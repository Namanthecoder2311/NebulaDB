package handlers

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

type Datacenter struct {
	ID          string  `json:"id"`
	Name        string  `json:"name"`
	Region      string  `json:"region"`
	Country     string  `json:"country"`
	City        string  `json:"city"`
	Latency     int     `json:"latency_ms"`
	PricePerGB  float64 `json:"price_per_gb"`
	PricePerHour float64 `json:"price_per_hour"`
	Available   bool    `json:"available"`
	Tier        string  `json:"tier"`
}

func (h *Handler) ListDatacenters(c *gin.Context) {
	datacenters := []Datacenter{
		{
			ID: "us-east-1", Name: "US East (Virginia)", Region: "us-east", Country: "USA", City: "Virginia",
			Latency: 45, PricePerGB: 0.10, PricePerHour: 0.05, Available: true, Tier: "premium",
		},
		{
			ID: "us-west-1", Name: "US West (California)", Region: "us-west", Country: "USA", City: "California",
			Latency: 60, PricePerGB: 0.12, PricePerHour: 0.06, Available: true, Tier: "premium",
		},
		{
			ID: "eu-central-1", Name: "EU Central (Frankfurt)", Region: "eu-central", Country: "Germany", City: "Frankfurt",
			Latency: 85, PricePerGB: 0.11, PricePerHour: 0.055, Available: true, Tier: "premium",
		},
		{
			ID: "eu-west-1", Name: "EU West (London)", Region: "eu-west", Country: "UK", City: "London",
			Latency: 90, PricePerGB: 0.11, PricePerHour: 0.055, Available: true, Tier: "premium",
		},
		{
			ID: "ap-south-1", Name: "Asia Pacific (Mumbai)", Region: "ap-south", Country: "India", City: "Mumbai",
			Latency: 120, PricePerGB: 0.08, PricePerHour: 0.04, Available: true, Tier: "standard",
		},
		{
			ID: "ap-southeast-1", Name: "Asia Pacific (Singapore)", Region: "ap-southeast", Country: "Singapore", City: "Singapore",
			Latency: 140, PricePerGB: 0.09, PricePerHour: 0.045, Available: true, Tier: "standard",
		},
		{
			ID: "ap-northeast-1", Name: "Asia Pacific (Tokyo)", Region: "ap-northeast", Country: "Japan", City: "Tokyo",
			Latency: 150, PricePerGB: 0.13, PricePerHour: 0.065, Available: true, Tier: "premium",
		},
	}

	c.JSON(http.StatusOK, datacenters)
}

func (h *Handler) SelectDatacenter(c *gin.Context) {
	databaseID := c.Param("databaseId")
	userID := c.GetString("user_id")

	var req struct {
		DatacenterID string `json:"datacenter_id" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Verify database ownership
	var projectID string
	query := `
		SELECT d.project_id FROM databases d
		JOIN projects p ON d.project_id = p.id
		WHERE d.id = $1 AND p.owner_id = $2`
	
	err := h.db.QueryRow(query, databaseID, userID).Scan(&projectID)
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}

	// Update database datacenter
	updateQuery := `
		UPDATE databases 
		SET connection_string = $1, updated_at = NOW() 
		WHERE id = $2`
	
	newConnectionString := "postgres://user@" + req.DatacenterID + ":5432/db"
	_, err = h.db.Exec(updateQuery, newConnectionString, databaseID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update datacenter"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Datacenter updated successfully",
		"datacenter_id": req.DatacenterID,
	})
}