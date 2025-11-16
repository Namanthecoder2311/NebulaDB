package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type BillingInfo struct {
	Plan           string  `json:"plan"`
	Status         string  `json:"status"`
	CurrentPeriod  Period  `json:"current_period"`
	Usage          Usage   `json:"usage"`
	NextInvoice    Invoice `json:"next_invoice"`
	PaymentMethod  *PaymentMethod `json:"payment_method"`
}

type Period struct {
	Start time.Time `json:"start"`
	End   time.Time `json:"end"`
}

type Usage struct {
	Queries       int     `json:"queries"`
	APICalls      int     `json:"api_calls"`
	ComputeHours  float64 `json:"compute_hours"`
	StorageGB     float64 `json:"storage_gb"`
	EstimatedCost float64 `json:"estimated_cost"`
}

type Invoice struct {
	Amount   float64   `json:"amount"`
	DueDate  time.Time `json:"due_date"`
	Status   string    `json:"status"`
}

type PaymentMethod struct {
	Type string `json:"type"`
	Last4 string `json:"last4"`
	Brand string `json:"brand"`
}

func (h *Handler) GetBilling(c *gin.Context) {
	projectID := c.Param("projectId")
	userID := c.GetString("user_id")

	if !h.verifyProjectAccess(projectID, userID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}

	billing := h.calculateBilling(projectID)
	c.JSON(http.StatusOK, billing)
}

func (h *Handler) CreateSubscription(c *gin.Context) {
	projectID := c.Param("projectId")
	userID := c.GetString("user_id")

	var req struct {
		Plan          string `json:"plan" binding:"required"`
		PaymentMethod string `json:"payment_method"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if !h.verifyProjectOwnership(projectID, userID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}

	// Create Stripe subscription (simulated)
	subscriptionID := "sub_" + uuid.New().String()[:8]
	
	query := `
		INSERT INTO subscriptions (project_id, stripe_subscription_id, plan_type, status, current_period_start, current_period_end, created_at, updated_at)
		VALUES ($1, $2, $3, 'active', NOW(), NOW() + INTERVAL '1 month', NOW(), NOW())
		ON CONFLICT (project_id) DO UPDATE SET
		plan_type = $3, stripe_subscription_id = $2, updated_at = NOW()`

	_, err := h.db.Exec(query, projectID, subscriptionID, req.Plan)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create subscription"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"subscription_id": subscriptionID,
		"plan": req.Plan,
		"status": "active",
	})
}

func (h *Handler) UpdateSubscription(c *gin.Context) {
	projectID := c.Param("projectId")
	userID := c.GetString("user_id")

	var req struct {
		Plan string `json:"plan" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if !h.verifyProjectOwnership(projectID, userID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}

	query := `UPDATE subscriptions SET plan_type = $1, updated_at = NOW() WHERE project_id = $2`
	_, err := h.db.Exec(query, req.Plan, projectID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update subscription"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Subscription updated successfully"})
}

func (h *Handler) GetInvoices(c *gin.Context) {
	projectID := c.Param("projectId")
	userID := c.GetString("user_id")

	if !h.verifyProjectAccess(projectID, userID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}

	// Simulate invoice data
	invoices := []map[string]interface{}{
		{
			"id": "inv_001",
			"amount": 29.99,
			"status": "paid",
			"date": "2024-01-01T00:00:00Z",
			"period": "December 2023",
		},
		{
			"id": "inv_002", 
			"amount": 45.50,
			"status": "pending",
			"date": "2024-02-01T00:00:00Z",
			"period": "January 2024",
		},
	}

	c.JSON(http.StatusOK, invoices)
}

func (h *Handler) calculateBilling(projectID string) BillingInfo {
	// Get subscription info
	var plan, status string
	var periodStart, periodEnd time.Time
	
	query := `SELECT plan_type, status, current_period_start, current_period_end FROM subscriptions WHERE project_id = $1`
	err := h.db.QueryRow(query, projectID).Scan(&plan, &status, &periodStart, &periodEnd)
	if err != nil {
		plan = "free"
		status = "active"
		periodStart = time.Now().Truncate(24 * time.Hour)
		periodEnd = periodStart.AddDate(0, 1, 0)
	}

	// Calculate usage
	usage := h.calculateCurrentUsage(projectID, periodStart)
	
	// Calculate estimated cost
	cost := h.calculateCost(plan, usage)

	return BillingInfo{
		Plan:   plan,
		Status: status,
		CurrentPeriod: Period{
			Start: periodStart,
			End:   periodEnd,
		},
		Usage: Usage{
			Queries:       usage.Queries,
			APICalls:      usage.APICalls,
			ComputeHours:  usage.ComputeTime / 3600, // Convert seconds to hours
			StorageGB:     usage.StorageUsed,
			EstimatedCost: cost,
		},
		NextInvoice: Invoice{
			Amount:  cost,
			DueDate: periodEnd,
			Status:  "pending",
		},
		PaymentMethod: &PaymentMethod{
			Type:  "card",
			Last4: "4242",
			Brand: "visa",
		},
	}
}

func (h *Handler) calculateCurrentUsage(projectID string, since time.Time) UsageStats {
	query := `
		SELECT 
			COUNT(*) FILTER (WHERE event_type = 'query') as queries,
			COUNT(*) FILTER (WHERE event_type = 'api_call') as api_calls,
			COALESCE(SUM(compute_seconds), 0) as compute_time
		FROM usage_logs 
		WHERE project_id = $1 AND created_at >= $2`

	var stats UsageStats
	h.db.QueryRow(query, projectID, since).Scan(&stats.Queries, &stats.APICalls, &stats.ComputeTime)
	stats.StorageUsed = h.getStorageUsage(projectID)
	
	return stats
}

func (h *Handler) calculateCost(plan string, usage UsageStats) float64 {
	switch plan {
	case "free":
		return 0.0
	case "pro":
		base := 29.0
		// Additional costs for overages
		if usage.ComputeTime > 100 { // 100 hours included
			base += (usage.ComputeTime - 100) * 0.10 // $0.10 per hour
		}
		if usage.StorageUsed > 10 { // 10GB included
			base += (usage.StorageUsed - 10) * 2.0 // $2 per GB
		}
		return base
	case "enterprise":
		return 99.0 // Fixed enterprise price
	default:
		return 0.0
	}
}

func (h *Handler) verifyProjectOwnership(projectID, userID string) bool {
	var count int
	query := `SELECT COUNT(*) FROM projects WHERE id = $1 AND owner_id = $2`
	err := h.db.QueryRow(query, projectID, userID).Scan(&count)
	return err == nil && count > 0
}