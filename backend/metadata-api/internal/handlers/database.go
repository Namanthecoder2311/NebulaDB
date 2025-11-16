package handlers

import (
	"database/sql"
	"fmt"
	"net/http"
	"nebuladb/metadata-api/internal/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (h *Handler) ListDatabases(c *gin.Context) {
	projectID := c.Param("projectId")
	userID := c.GetString("user_id")

	// Verify user has access to project
	var count int
	checkQuery := `
		SELECT COUNT(*) FROM projects p 
		LEFT JOIN project_members pm ON p.id = pm.project_id 
		WHERE p.id = $1 AND (p.owner_id = $2 OR pm.user_id = $2)`
	
	err := h.db.QueryRow(checkQuery, projectID, userID).Scan(&count)
	if err != nil || count == 0 {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}

	query := `SELECT id, name, project_id, storage_size_gb, max_connections, status, created_at, updated_at 
			  FROM databases WHERE project_id = $1 ORDER BY created_at DESC`
	
	rows, err := h.db.Query(query, projectID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch databases"})
		return
	}
	defer rows.Close()

	var databases []models.Database
	for rows.Next() {
		var db models.Database
		err := rows.Scan(&db.ID, &db.Name, &db.ProjectID, &db.StorageSizeGB, &db.MaxConnections, &db.Status, &db.CreatedAt, &db.UpdatedAt)
		if err != nil {
			continue
		}
		databases = append(databases, db)
	}

	c.JSON(http.StatusOK, databases)
}

func (h *Handler) CreateDatabase(c *gin.Context) {
	projectID := c.Param("projectId")
	userID := c.GetString("user_id")

	var req models.CreateDatabaseRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Verify user owns project
	var count int
	checkQuery := `SELECT COUNT(*) FROM projects WHERE id = $1 AND owner_id = $2`
	err := h.db.QueryRow(checkQuery, projectID, userID).Scan(&count)
	if err != nil || count == 0 {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}

	// Create database record
	dbID := uuid.New()
	connectionString := fmt.Sprintf("postgres://user_%s:pass_%s@compute-engine:5432/db_%s", 
		dbID.String()[:8], dbID.String()[:8], dbID.String()[:8])

	query := `
		INSERT INTO databases (id, name, project_id, connection_string, storage_size_gb, max_connections, status, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, 'provisioning', NOW(), NOW())
		RETURNING id, name, project_id, storage_size_gb, max_connections, status, created_at, updated_at`

	var database models.Database
	err = h.db.QueryRow(query, dbID, req.Name, projectID, connectionString, req.StorageSizeGB, 100).Scan(
		&database.ID, &database.Name, &database.ProjectID, &database.StorageSizeGB, &database.MaxConnections, &database.Status, &database.CreatedAt, &database.UpdatedAt,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create database"})
		return
	}

	// TODO: Trigger serverless database provisioning
	go h.provisionDatabase(database.ID)

	c.JSON(http.StatusCreated, database)
}

func (h *Handler) GetDatabase(c *gin.Context) {
	dbID := c.Param("id")
	userID := c.GetString("user_id")

	query := `
		SELECT d.id, d.name, d.project_id, d.storage_size_gb, d.max_connections, d.status, d.created_at, d.updated_at
		FROM databases d
		JOIN projects p ON d.project_id = p.id
		LEFT JOIN project_members pm ON p.id = pm.project_id
		WHERE d.id = $1 AND (p.owner_id = $2 OR pm.user_id = $2)`

	var database models.Database
	err := h.db.QueryRow(query, dbID, userID).Scan(
		&database.ID, &database.Name, &database.ProjectID, &database.StorageSizeGB, &database.MaxConnections, &database.Status, &database.CreatedAt, &database.UpdatedAt,
	)
	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Database not found"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch database"})
		return
	}

	c.JSON(http.StatusOK, database)
}

func (h *Handler) DeleteDatabase(c *gin.Context) {
	dbID := c.Param("id")
	userID := c.GetString("user_id")

	// Verify ownership and delete
	query := `
		DELETE FROM databases 
		WHERE id = $1 AND project_id IN (
			SELECT id FROM projects WHERE owner_id = $2
		)`

	result, err := h.db.Exec(query, dbID, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete database"})
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Database not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Database deleted successfully"})
}

func (h *Handler) provisionDatabase(dbID uuid.UUID) {
	// Simulate database provisioning
	// In production, this would call the compute engine service
	
	// Update status to active after "provisioning"
	query := `UPDATE databases SET status = 'active', updated_at = NOW() WHERE id = $1`
	h.db.Exec(query, dbID)
}