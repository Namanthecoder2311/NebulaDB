package handlers

import (
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type SQLExecuteRequest struct {
	Query string `json:"query" binding:"required"`
}

type SQLExecuteResponse struct {
	Columns []string        `json:"columns"`
	Rows    [][]interface{} `json:"rows"`
	RowCount int            `json:"row_count"`
	Duration string         `json:"duration"`
	Message  string         `json:"message,omitempty"`
}

func (h *Handler) ExecuteSQL(c *gin.Context) {
	databaseID := c.Param("databaseId")
	userID := c.GetString("user_id")

	var req SQLExecuteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Verify access to database
	var dbName, projectID string
	checkQuery := `
		SELECT d.name, d.project_id FROM databases d
		JOIN projects p ON d.project_id = p.id
		LEFT JOIN project_members pm ON p.id = pm.project_id
		WHERE d.id = $1 AND (p.owner_id = $2 OR pm.user_id = $2)`
	
	err := h.db.QueryRow(checkQuery, databaseID, userID).Scan(&dbName, &projectID)
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}

	// Validate SQL query (basic security)
	if !h.isQuerySafe(req.Query) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Query contains forbidden operations"})
		return
	}

	startTime := time.Now()

	// Execute query (simulated for now)
	result := h.executeQuery(databaseID, req.Query)
	
	duration := time.Since(startTime)

	// Log usage
	go h.logUsage(projectID, databaseID, "query", map[string]interface{}{
		"query": req.Query,
		"duration_ms": duration.Milliseconds(),
	})

	result.Duration = duration.String()
	c.JSON(http.StatusOK, result)
}

func (h *Handler) isQuerySafe(query string) bool {
	query = strings.ToLower(strings.TrimSpace(query))
	
	// Block dangerous operations
	forbidden := []string{
		"drop database", "drop schema", "truncate", 
		"delete from pg_", "update pg_", "insert into pg_",
		"create user", "drop user", "alter user",
		"grant", "revoke", "create role", "drop role",
	}
	
	for _, forbidden := range forbidden {
		if strings.Contains(query, forbidden) {
			return false
		}
	}
	
	return true
}

func (h *Handler) executeQuery(databaseID, query string) *SQLExecuteResponse {
	// For now, return simulated data
	// TODO: Implement actual database connection via compute engine
	
	query = strings.TrimSpace(query)
	queryLower := strings.ToLower(query)
	
	if strings.HasPrefix(queryLower, "select") {
		return &SQLExecuteResponse{
			Columns: []string{"id", "name", "email", "created_at"},
			Rows: [][]interface{}{
				{1, "John Doe", "john@example.com", "2024-01-01T00:00:00Z"},
				{2, "Jane Smith", "jane@example.com", "2024-01-02T00:00:00Z"},
				{3, "Bob Johnson", "bob@example.com", "2024-01-03T00:00:00Z"},
			},
			RowCount: 3,
		}
	} else if strings.HasPrefix(queryLower, "insert") {
		return &SQLExecuteResponse{
			Columns: []string{},
			Rows: [][]interface{}{},
			RowCount: 1,
			Message: "INSERT 0 1",
		}
	} else if strings.HasPrefix(queryLower, "update") {
		return &SQLExecuteResponse{
			Columns: []string{},
			Rows: [][]interface{}{},
			RowCount: 1,
			Message: "UPDATE 1",
		}
	} else if strings.HasPrefix(queryLower, "delete") {
		return &SQLExecuteResponse{
			Columns: []string{},
			Rows: [][]interface{}{},
			RowCount: 1,
			Message: "DELETE 1",
		}
	} else if strings.HasPrefix(queryLower, "create table") {
		return &SQLExecuteResponse{
			Columns: []string{},
			Rows: [][]interface{}{},
			RowCount: 0,
			Message: "CREATE TABLE",
		}
	} else if strings.HasPrefix(queryLower, "show tables") {
		return &SQLExecuteResponse{
			Columns: []string{"table_name"},
			Rows: [][]interface{}{
				{"users"},
				{"products"},
				{"orders"},
			},
			RowCount: 3,
		}
	}
	
	return &SQLExecuteResponse{
		Columns: []string{},
		Rows: [][]interface{}{},
		RowCount: 0,
		Message: "Query executed successfully",
	}
}

func (h *Handler) logUsage(projectID, databaseID, eventType string, details map[string]interface{}) {
	query := `
		INSERT INTO usage_logs (project_id, database_id, event_type, details, created_at)
		VALUES ($1, $2, $3, $4, NOW())`
	
	detailsJSON, _ := json.Marshal(details)
	h.db.Exec(query, projectID, databaseID, eventType, detailsJSON)
}