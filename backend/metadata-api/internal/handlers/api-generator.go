package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// Auto-generated API endpoints
func (h *Handler) HandleGeneratedAPI(c *gin.Context) {
	startTime := time.Now()
	databaseID := c.Param("databaseId")
	tableName := c.Param("tableName")
	method := c.Request.Method

	// Verify database access
	userID := c.GetString("user_id")
	if !h.verifyDatabaseAccess(databaseID, userID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}

	// Get project ID for logging
	projectID := h.getProjectIDFromDatabase(databaseID)

	// Get table schema
	table, err := h.getTableSchema(databaseID, tableName)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Table not found"})
		return
	}

	switch method {
	case "GET":
		if recordID := c.Param("id"); recordID != "" {
			h.handleGetRecord(c, databaseID, tableName, recordID)
		} else {
			h.handleListRecords(c, databaseID, tableName)
		}
	case "POST":
		h.handleCreateRecord(c, databaseID, tableName, table)
	case "PUT":
		h.handleUpdateRecord(c, databaseID, tableName, c.Param("id"), table)
	case "DELETE":
		h.handleDeleteRecord(c, databaseID, tableName, c.Param("id"))
	default:
		c.JSON(http.StatusMethodNotAllowed, gin.H{"error": "Method not allowed"})
	}

	// Log API usage
	duration := time.Since(startTime)
	statusCode := c.Writer.Status()
	go h.LogAPIUsage(projectID, databaseID, c.Request.URL.Path, method, duration, statusCode)
}

func (h *Handler) handleListRecords(c *gin.Context, databaseID, tableName string) {
	// Parse query parameters
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "50"))
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))
	filter := c.Query("filter")
	sort := c.DefaultQuery("sort", "id")

	if limit > 100 {
		limit = 100
	}

	// Simulate data retrieval
	records := h.simulateTableData(tableName, limit, offset)
	
	c.JSON(http.StatusOK, gin.H{
		"data":   records,
		"count":  len(records),
		"limit":  limit,
		"offset": offset,
	})
}

func (h *Handler) handleGetRecord(c *gin.Context, databaseID, tableName, recordID string) {
	// Simulate single record retrieval
	record := h.simulateSingleRecord(tableName, recordID)
	if record == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"data": record})
}

func (h *Handler) handleCreateRecord(c *gin.Context, databaseID, tableName string, table interface{}) {
	var data map[string]interface{}
	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate data against schema
	if err := h.validateRecord(data, table); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Simulate record creation
	newID := uuid.New().String()
	data["id"] = newID
	data["created_at"] = "2024-01-01T00:00:00Z"

	c.JSON(http.StatusCreated, gin.H{"data": data})
}

func (h *Handler) handleUpdateRecord(c *gin.Context, databaseID, tableName, recordID string, table interface{}) {
	var data map[string]interface{}
	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate data
	if err := h.validateRecord(data, table); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Simulate update
	data["id"] = recordID
	data["updated_at"] = "2024-01-01T00:00:00Z"

	c.JSON(http.StatusOK, gin.H{"data": data})
}

func (h *Handler) handleDeleteRecord(c *gin.Context, databaseID, tableName, recordID string) {
	// Simulate deletion
	c.JSON(http.StatusOK, gin.H{"message": "Record deleted successfully"})
}

func (h *Handler) verifyDatabaseAccess(databaseID, userID string) bool {
	var count int
	query := `
		SELECT COUNT(*) FROM databases d
		JOIN projects p ON d.project_id = p.id
		LEFT JOIN project_members pm ON p.id = pm.project_id
		WHERE d.id = $1 AND (p.owner_id = $2 OR pm.user_id = $2)`
	
	err := h.db.QueryRow(query, databaseID, userID).Scan(&count)
	return err == nil && count > 0
}

func (h *Handler) getTableSchema(databaseID, tableName string) (interface{}, error) {
	query := `SELECT columns FROM user_tables WHERE database_id = $1 AND name = $2`
	
	var columnsJSON []byte
	err := h.db.QueryRow(query, databaseID, tableName).Scan(&columnsJSON)
	if err != nil {
		return nil, err
	}

	var columns interface{}
	json.Unmarshal(columnsJSON, &columns)
	return columns, nil
}

func (h *Handler) validateRecord(data map[string]interface{}, schema interface{}) error {
	// Basic validation - in production, validate against actual schema
	if len(data) == 0 {
		return fmt.Errorf("empty data")
	}
	return nil
}

func (h *Handler) simulateTableData(tableName string, limit, offset int) []map[string]interface{} {
	switch tableName {
	case "users":
		return []map[string]interface{}{
			{"id": 1, "name": "John Doe", "email": "john@example.com", "created_at": "2024-01-01T00:00:00Z"},
			{"id": 2, "name": "Jane Smith", "email": "jane@example.com", "created_at": "2024-01-02T00:00:00Z"},
		}
	case "products":
		return []map[string]interface{}{
			{"id": 1, "name": "Product A", "price": 29.99, "created_at": "2024-01-01T00:00:00Z"},
			{"id": 2, "name": "Product B", "price": 49.99, "created_at": "2024-01-02T00:00:00Z"},
		}
	default:
		return []map[string]interface{}{}
	}
}

func (h *Handler) simulateSingleRecord(tableName, recordID string) map[string]interface{} {
	data := h.simulateTableData(tableName, 10, 0)
	for _, record := range data {
		if fmt.Sprintf("%v", record["id"]) == recordID {
			return record
		}
	}
	return nil
}