package models

import (
	"time"
	"github.com/google/uuid"
)

type User struct {
	ID            uuid.UUID `json:"id" db:"id"`
	Email         string    `json:"email" db:"email"`
	PasswordHash  string    `json:"-" db:"password_hash"`
	Name          string    `json:"name" db:"name"`
	AvatarURL     *string   `json:"avatar_url" db:"avatar_url"`
	EmailVerified bool      `json:"email_verified" db:"email_verified"`
	CreatedAt     time.Time `json:"created_at" db:"created_at"`
	UpdatedAt     time.Time `json:"updated_at" db:"updated_at"`
}

type Project struct {
	ID          uuid.UUID `json:"id" db:"id"`
	Name        string    `json:"name" db:"name"`
	Description *string   `json:"description" db:"description"`
	OwnerID     uuid.UUID `json:"owner_id" db:"owner_id"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time `json:"updated_at" db:"updated_at"`
}

type Database struct {
	ID               uuid.UUID `json:"id" db:"id"`
	Name             string    `json:"name" db:"name"`
	ProjectID        uuid.UUID `json:"project_id" db:"project_id"`
	ConnectionString string    `json:"-" db:"connection_string"`
	StorageSizeGB    int       `json:"storage_size_gb" db:"storage_size_gb"`
	MaxConnections   int       `json:"max_connections" db:"max_connections"`
	Status           string    `json:"status" db:"status"`
	CreatedAt        time.Time `json:"created_at" db:"created_at"`
	UpdatedAt        time.Time `json:"updated_at" db:"updated_at"`
}

type UserTable struct {
	ID         uuid.UUID   `json:"id" db:"id"`
	DatabaseID uuid.UUID   `json:"database_id" db:"database_id"`
	Name       string      `json:"name" db:"name"`
	SchemaName string      `json:"schema_name" db:"schema_name"`
	Columns    interface{} `json:"columns" db:"columns"`
	Indexes    interface{} `json:"indexes" db:"indexes"`
	APIEnabled bool        `json:"api_enabled" db:"api_enabled"`
	CreatedAt  time.Time   `json:"created_at" db:"created_at"`
	UpdatedAt  time.Time   `json:"updated_at" db:"updated_at"`
}

type APIEndpoint struct {
	ID          uuid.UUID   `json:"id" db:"id"`
	TableID     uuid.UUID   `json:"table_id" db:"table_id"`
	Method      string      `json:"method" db:"method"`
	Path        string      `json:"path" db:"path"`
	Permissions interface{} `json:"permissions" db:"permissions"`
	RateLimit   int         `json:"rate_limit" db:"rate_limit"`
	Enabled     bool        `json:"enabled" db:"enabled"`
	CreatedAt   time.Time   `json:"created_at" db:"created_at"`
}

type UsageLog struct {
	ID             uuid.UUID   `json:"id" db:"id"`
	ProjectID      uuid.UUID   `json:"project_id" db:"project_id"`
	DatabaseID     *uuid.UUID  `json:"database_id" db:"database_id"`
	EventType      string      `json:"event_type" db:"event_type"`
	Details        interface{} `json:"details" db:"details"`
	ComputeSeconds float64     `json:"compute_seconds" db:"compute_seconds"`
	StorageBytes   int64       `json:"storage_bytes" db:"storage_bytes"`
	APICalls       int         `json:"api_calls" db:"api_calls"`
	CreatedAt      time.Time   `json:"created_at" db:"created_at"`
}

// Request/Response DTOs
type RegisterRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=8"`
	Name     string `json:"name" binding:"required"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type AuthResponse struct {
	User         User   `json:"user"`
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}

type CreateProjectRequest struct {
	Name        string `json:"name" binding:"required"`
	Description string `json:"description"`
}

type CreateDatabaseRequest struct {
	Name          string `json:"name" binding:"required"`
	StorageSizeGB int    `json:"storage_size_gb"`
}

type CreateTableRequest struct {
	Name    string      `json:"name" binding:"required"`
	Columns interface{} `json:"columns" binding:"required"`
}