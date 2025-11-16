package handlers

import (
	"database/sql"
	"fmt"
	"net/http"
	"nebuladb/metadata-api/internal/config"
	"nebuladb/metadata-api/internal/models"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type Handler struct {
	db  *sql.DB
	cfg *config.Config
}

func New(db *sql.DB, cfg *config.Config) *Handler {
	return &Handler{db: db, cfg: cfg}
}

func (h *Handler) HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":    "healthy",
		"timestamp": time.Now(),
		"service":   "metadata-api",
	})
}

func (h *Handler) Register(c *gin.Context) {
	var req models.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	// Create user
	userID := uuid.New()
	query := `
		INSERT INTO users (id, email, password_hash, name, created_at, updated_at)
		VALUES ($1, $2, $3, $4, NOW(), NOW())
		RETURNING id, email, name, email_verified, created_at, updated_at`

	var user models.User
	err = h.db.QueryRow(query, userID, req.Email, string(hashedPassword), req.Name).Scan(
		&user.ID, &user.Email, &user.Name, &user.EmailVerified, &user.CreatedAt, &user.UpdatedAt,
	)
	if err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Email already exists"})
		return
	}

	// Generate tokens
	accessToken, refreshToken, err := h.generateTokens(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate tokens"})
		return
	}

	c.JSON(http.StatusCreated, models.AuthResponse{
		User:         user,
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	})
}

func (h *Handler) Login(c *gin.Context) {
	var req models.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get user
	var user models.User
	query := `SELECT id, email, password_hash, name, email_verified, created_at, updated_at FROM users WHERE email = $1`
	err := h.db.QueryRow(query, req.Email).Scan(
		&user.ID, &user.Email, &user.PasswordHash, &user.Name, &user.EmailVerified, &user.CreatedAt, &user.UpdatedAt,
	)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Verify password
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Generate tokens
	accessToken, refreshToken, err := h.generateTokens(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate tokens"})
		return
	}

	c.JSON(http.StatusOK, models.AuthResponse{
		User:         user,
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	})
}

func (h *Handler) RefreshToken(c *gin.Context) {
	// Implementation for token refresh
	c.JSON(http.StatusOK, gin.H{"message": "Token refreshed"})
}

func (h *Handler) GetUser(c *gin.Context) {
	userID := c.GetString("user_id")
	
	var user models.User
	query := `SELECT id, email, name, avatar_url, email_verified, created_at, updated_at FROM users WHERE id = $1`
	err := h.db.QueryRow(query, userID).Scan(
		&user.ID, &user.Email, &user.Name, &user.AvatarURL, &user.EmailVerified, &user.CreatedAt, &user.UpdatedAt,
	)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, user)
}

func (h *Handler) UpdateUser(c *gin.Context) {
	// Implementation for updating user
	c.JSON(http.StatusOK, gin.H{"message": "User updated"})
}

// Project handlers
func (h *Handler) ListProjects(c *gin.Context) {
	userID := c.GetString("user_id")
	
	query := `
		SELECT p.id, p.name, p.description, p.owner_id, p.created_at, p.updated_at
		FROM projects p
		LEFT JOIN project_members pm ON p.id = pm.project_id
		WHERE p.owner_id = $1 OR pm.user_id = $1`
	
	rows, err := h.db.Query(query, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch projects"})
		return
	}
	defer rows.Close()

	var projects []models.Project
	for rows.Next() {
		var project models.Project
		err := rows.Scan(&project.ID, &project.Name, &project.Description, &project.OwnerID, &project.CreatedAt, &project.UpdatedAt)
		if err != nil {
			continue
		}
		projects = append(projects, project)
	}

	c.JSON(http.StatusOK, projects)
}

func (h *Handler) CreateProject(c *gin.Context) {
	var req models.CreateProjectRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID := c.GetString("user_id")
	projectID := uuid.New()

	query := `
		INSERT INTO projects (id, name, description, owner_id, created_at, updated_at)
		VALUES ($1, $2, $3, $4, NOW(), NOW())
		RETURNING id, name, description, owner_id, created_at, updated_at`

	var project models.Project
	err := h.db.QueryRow(query, projectID, req.Name, req.Description, userID).Scan(
		&project.ID, &project.Name, &project.Description, &project.OwnerID, &project.CreatedAt, &project.UpdatedAt,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create project"})
		return
	}

	c.JSON(http.StatusCreated, project)
}

func (h *Handler) GetProject(c *gin.Context) {
	// Implementation for getting single project
	c.JSON(http.StatusOK, gin.H{"message": "Get project"})
}

func (h *Handler) UpdateProject(c *gin.Context) {
	// Implementation for updating project
	c.JSON(http.StatusOK, gin.H{"message": "Project updated"})
}

func (h *Handler) DeleteProject(c *gin.Context) {
	// Implementation for deleting project
	c.JSON(http.StatusOK, gin.H{"message": "Project deleted"})
}

// Database handlers - implemented in database.go
// Table handlers - implemented in tables.go
// SQL execution - implemented in sql.go

// API endpoint handlers
func (h *Handler) ListAPIEndpoints(c *gin.Context) {
	databaseID := c.Param("databaseId")
	userID := c.GetString("user_id")

	// Verify access
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

	// Get tables with API enabled
	query := `SELECT name, api_enabled FROM user_tables WHERE database_id = $1`
	rows, err := h.db.Query(query, databaseID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch endpoints"})
		return
	}
	defer rows.Close()

	var endpoints []map[string]interface{}
	for rows.Next() {
		var tableName string
		var apiEnabled bool
		rows.Scan(&tableName, &apiEnabled)
		
		if apiEnabled {
			endpoints = append(endpoints, map[string]interface{}{
				"table": tableName,
				"endpoints": []map[string]string{
					{"method": "GET", "path": fmt.Sprintf("/databases/%s/data/%s", databaseID, tableName)},
					{"method": "POST", "path": fmt.Sprintf("/databases/%s/data/%s", databaseID, tableName)},
					{"method": "GET", "path": fmt.Sprintf("/databases/%s/data/%s/{id}", databaseID, tableName)},
					{"method": "PUT", "path": fmt.Sprintf("/databases/%s/data/%s/{id}", databaseID, tableName)},
					{"method": "DELETE", "path": fmt.Sprintf("/databases/%s/data/%s/{id}", databaseID, tableName)},
				},
			})
		}
	}

	c.JSON(http.StatusOK, endpoints)
}

func (h *Handler) CreateAPIEndpoint(c *gin.Context) {
	databaseID := c.Param("databaseId")
	userID := c.GetString("user_id")

	var req struct {
		TableName  string `json:"table_name" binding:"required"`
		APIEnabled bool   `json:"api_enabled"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Verify ownership
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

	// Update table API status
	query := `UPDATE user_tables SET api_enabled = $1 WHERE database_id = $2 AND name = $3`
	_, err = h.db.Exec(query, req.APIEnabled, databaseID, req.TableName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update API status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "API endpoint updated successfully"})
}

// Usage and billing handlers
func (h *Handler) GetUsage(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Get usage"})
}

func (h *Handler) GetBilling(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Get billing"})
}

// Helper functions
func (h *Handler) generateTokens(userID uuid.UUID) (string, string, error) {
	// Access token (15 minutes)
	accessClaims := jwt.MapClaims{
		"user_id": userID.String(),
		"exp":     time.Now().Add(time.Minute * 15).Unix(),
	}
	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims)
	accessTokenString, err := accessToken.SignedString([]byte(h.cfg.JWTSecret))
	if err != nil {
		return "", "", err
	}

	// Refresh token (7 days)
	refreshClaims := jwt.MapClaims{
		"user_id": userID.String(),
		"exp":     time.Now().Add(time.Hour * 24 * 7).Unix(),
	}
	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims)
	refreshTokenString, err := refreshToken.SignedString([]byte(h.cfg.JWTSecret))
	if err != nil {
		return "", "", err
	}

	return accessTokenString, refreshTokenString, nil
}