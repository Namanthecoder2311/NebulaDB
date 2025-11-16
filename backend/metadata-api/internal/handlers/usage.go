package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type UsageStats struct {
	Period        string  `json:"period"`
	Queries       int     `json:"queries"`
	APICalls      int     `json:"api_calls"`
	ComputeTime   float64 `json:"compute_time"`
	StorageUsed   float64 `json:"storage_used"`
	ErrorRate     float64 `json:"error_rate"`
	AvgQueryTime  float64 `json:"avg_query_time"`
}

func (h *Handler) GetUsage(c *gin.Context) {
	projectID := c.Param("projectId")
	userID := c.GetString("user_id")
	period := c.DefaultQuery("period", "24h")

	// Verify access
	if !h.verifyProjectAccess(projectID, userID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}

	stats := h.calculateUsageStats(projectID, period)
	c.JSON(http.StatusOK, stats)
}

func (h *Handler) GetMetrics(c *gin.Context) {
	projectID := c.Param("projectId")
	userID := c.GetString("user_id")

	if !h.verifyProjectAccess(projectID, userID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}

	metrics := h.getRealtimeMetrics(projectID)
	c.JSON(http.StatusOK, metrics)
}

func (h *Handler) LogAPIUsage(projectID, databaseID, endpoint, method string, duration time.Duration, statusCode int) {
	details := map[string]interface{}{
		"endpoint":    endpoint,
		"method":      method,
		"duration_ms": duration.Milliseconds(),
		"status_code": statusCode,
	}

	h.logUsage(projectID, databaseID, "api_call", details)
}

func (h *Handler) calculateUsageStats(projectID, period string) UsageStats {
	var since time.Time
	switch period {
	case "1h":
		since = time.Now().Add(-time.Hour)
	case "24h":
		since = time.Now().Add(-24 * time.Hour)
	case "7d":
		since = time.Now().Add(-7 * 24 * time.Hour)
	case "30d":
		since = time.Now().Add(-30 * 24 * time.Hour)
	default:
		since = time.Now().Add(-24 * time.Hour)
	}

	query := `
		SELECT 
			COUNT(*) FILTER (WHERE event_type = 'query') as queries,
			COUNT(*) FILTER (WHERE event_type = 'api_call') as api_calls,
			COALESCE(SUM(compute_seconds), 0) as compute_time,
			COALESCE(AVG(compute_seconds), 0) as avg_query_time
		FROM usage_logs 
		WHERE project_id = $1 AND created_at >= $2`

	var stats UsageStats
	err := h.db.QueryRow(query, projectID, since).Scan(
		&stats.Queries, &stats.APICalls, &stats.ComputeTime, &stats.AvgQueryTime,
	)
	if err != nil {
		return UsageStats{Period: period}
	}

	// Calculate error rate
	errorQuery := `
		SELECT COUNT(*) FROM usage_logs 
		WHERE project_id = $1 AND created_at >= $2 
		AND details->>'status_code' >= '400'`
	
	var errors int
	h.db.QueryRow(errorQuery, projectID, since).Scan(&errors)
	
	if stats.APICalls > 0 {
		stats.ErrorRate = float64(errors) / float64(stats.APICalls) * 100
	}

	stats.Period = period
	stats.StorageUsed = h.getStorageUsage(projectID)
	
	return stats
}

func (h *Handler) getRealtimeMetrics(projectID string) map[string]interface{} {
	// Get last 5 minutes of activity
	since := time.Now().Add(-5 * time.Minute)
	
	query := `
		SELECT event_type, COUNT(*), AVG(compute_seconds)
		FROM usage_logs 
		WHERE project_id = $1 AND created_at >= $2
		GROUP BY event_type`

	rows, err := h.db.Query(query, projectID, since)
	if err != nil {
		return map[string]interface{}{"error": "Failed to fetch metrics"}
	}
	defer rows.Close()

	metrics := map[string]interface{}{
		"timestamp": time.Now(),
		"active_connections": h.getActiveConnections(projectID),
		"events": make(map[string]interface{}),
	}

	for rows.Next() {
		var eventType string
		var count int
		var avgTime float64
		rows.Scan(&eventType, &count, &avgTime)
		
		metrics["events"].(map[string]interface{})[eventType] = map[string]interface{}{
			"count": count,
			"avg_time": avgTime,
		}
	}

	return metrics
}

func (h *Handler) getStorageUsage(projectID string) float64 {
	query := `
		SELECT COALESCE(SUM(storage_size_gb), 0) 
		FROM databases 
		WHERE project_id = $1`
	
	var storage float64
	h.db.QueryRow(query, projectID).Scan(&storage)
	return storage
}

func (h *Handler) getActiveConnections(projectID string) int {
	// Simulate active connections
	return 3
}

func (h *Handler) verifyProjectAccess(projectID, userID string) bool {
	var count int
	query := `
		SELECT COUNT(*) FROM projects p
		LEFT JOIN project_members pm ON p.id = pm.project_id
		WHERE p.id = $1 AND (p.owner_id = $2 OR pm.user_id = $2)`
	
	err := h.db.QueryRow(query, projectID, userID).Scan(&count)
	return err == nil && count > 0
}