package handlers

import (
	"encoding/json"
	"time"
)

func (h *Handler) getProjectIDFromDatabase(databaseID string) string {
	var projectID string
	query := `SELECT project_id FROM databases WHERE id = $1`
	h.db.QueryRow(query, databaseID).Scan(&projectID)
	return projectID
}

func (h *Handler) logUsage(projectID, databaseID, eventType string, details map[string]interface{}) {
	query := `
		INSERT INTO usage_logs (project_id, database_id, event_type, details, created_at)
		VALUES ($1, $2, $3, $4, NOW())`
	
	detailsJSON, _ := json.Marshal(details)
	h.db.Exec(query, projectID, databaseID, eventType, detailsJSON)
}