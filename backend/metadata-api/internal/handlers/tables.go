package handlers

import (
	"encoding/json"
	"net/http"
	"nebuladb/metadata-api/internal/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (h *Handler) ListTables(c *gin.Context) {
	databaseID := c.Param("databaseId")
	userID := c.GetString("user_id")

	// Verify access to database
	var count int
	checkQuery := `
		SELECT COUNT(*) FROM databases d
		JOIN projects p ON d.project_id = p.id
		LEFT JOIN project_members pm ON p.id = pm.project_id
		WHERE d.id = $1 AND (p.owner_id = $2 OR pm.user_id = $2)`
	
	err := h.db.QueryRow(checkQuery, databaseID, userID).Scan(&count)
	if err != nil || count == 0 {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}

	query := `SELECT id, name, schema_name, columns, indexes, api_enabled, created_at, updated_at 
			  FROM user_tables WHERE database_id = $1 ORDER BY created_at DESC`
	
	rows, err := h.db.Query(query, databaseID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch tables"})
		return
	}
	defer rows.Close()

	var tables []models.UserTable
	for rows.Next() {
		var table models.UserTable
		var columnsJSON, indexesJSON []byte
		
		err := rows.Scan(&table.ID, &table.Name, &table.SchemaName, &columnsJSON, &indexesJSON, &table.APIEnabled, &table.CreatedAt, &table.UpdatedAt)
		if err != nil {
			continue
		}
		
		json.Unmarshal(columnsJSON, &table.Columns)
		json.Unmarshal(indexesJSON, &table.Indexes)
		table.DatabaseID = uuid.MustParse(databaseID)
		
		tables = append(tables, table)
	}

	c.JSON(http.StatusOK, tables)
}

func (h *Handler) CreateTable(c *gin.Context) {
	databaseID := c.Param("databaseId")
	userID := c.GetString("user_id")

	var req models.CreateTableRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Verify access
	var count int
	checkQuery := `
		SELECT COUNT(*) FROM databases d
		JOIN projects p ON d.project_id = p.id
		WHERE d.id = $1 AND p.owner_id = $2`
	
	err := h.db.QueryRow(checkQuery, databaseID, userID).Scan(&count)
	if err != nil || count == 0 {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}

	// Create table record
	tableID := uuid.New()
	columnsJSON, _ := json.Marshal(req.Columns)
	
	query := `
		INSERT INTO user_tables (id, database_id, name, schema_name, columns, indexes, api_enabled, created_at, updated_at)
		VALUES ($1, $2, $3, 'public', $4, '[]', true, NOW(), NOW())
		RETURNING id, name, schema_name, columns, indexes, api_enabled, created_at, updated_at`

	var table models.UserTable
	var columnsRaw, indexesRaw []byte
	
	err = h.db.QueryRow(query, tableID, databaseID, req.Name, columnsJSON).Scan(
		&table.ID, &table.Name, &table.SchemaName, &columnsRaw, &indexesRaw, &table.APIEnabled, &table.CreatedAt, &table.UpdatedAt,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create table"})
		return
	}

	json.Unmarshal(columnsRaw, &table.Columns)
	json.Unmarshal(indexesRaw, &table.Indexes)
	table.DatabaseID = uuid.MustParse(databaseID)

	// TODO: Execute actual CREATE TABLE on user database
	go h.executeCreateTable(databaseID, req.Name, req.Columns)

	c.JSON(http.StatusCreated, table)
}

func (h *Handler) GetTable(c *gin.Context) {
	databaseID := c.Param("databaseId")
	tableName := c.Param("name")
	userID := c.GetString("user_id")

	query := `
		SELECT ut.id, ut.name, ut.schema_name, ut.columns, ut.indexes, ut.api_enabled, ut.created_at, ut.updated_at
		FROM user_tables ut
		JOIN databases d ON ut.database_id = d.id
		JOIN projects p ON d.project_id = p.id
		LEFT JOIN project_members pm ON p.id = pm.project_id
		WHERE ut.database_id = $1 AND ut.name = $2 AND (p.owner_id = $3 OR pm.user_id = $3)`

	var table models.UserTable
	var columnsJSON, indexesJSON []byte
	
	err := h.db.QueryRow(query, databaseID, tableName, userID).Scan(
		&table.ID, &table.Name, &table.SchemaName, &columnsJSON, &indexesJSON, &table.APIEnabled, &table.CreatedAt, &table.UpdatedAt,
	)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Table not found"})
		return
	}

	json.Unmarshal(columnsJSON, &table.Columns)
	json.Unmarshal(indexesJSON, &table.Indexes)
	table.DatabaseID = uuid.MustParse(databaseID)

	c.JSON(http.StatusOK, table)
}

func (h *Handler) DeleteTable(c *gin.Context) {
	databaseID := c.Param("databaseId")
	tableName := c.Param("name")
	userID := c.GetString("user_id")

	query := `
		DELETE FROM user_tables 
		WHERE database_id = $1 AND name = $2 AND database_id IN (
			SELECT d.id FROM databases d
			JOIN projects p ON d.project_id = p.id
			WHERE p.owner_id = $3
		)`

	result, err := h.db.Exec(query, databaseID, tableName, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete table"})
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Table not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Table deleted successfully"})
}

func (h *Handler) executeCreateTable(databaseID, tableName string, columns interface{}) {
	// TODO: Execute actual CREATE TABLE SQL on user database
	// This would connect to the serverless compute engine
}