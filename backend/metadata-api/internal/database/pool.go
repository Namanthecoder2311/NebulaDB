package database

import (
	"database/sql"
	"fmt"
	"sync"
	"time"
)

type ConnectionPool struct {
	pools map[string]*sql.DB
	mutex sync.RWMutex
}

var globalPool = &ConnectionPool{
	pools: make(map[string]*sql.DB),
}

func GetUserDatabaseConnection(databaseID string) (*sql.DB, error) {
	globalPool.mutex.RLock()
	if db, exists := globalPool.pools[databaseID]; exists {
		globalPool.mutex.RUnlock()
		return db, nil
	}
	globalPool.mutex.RUnlock()

	globalPool.mutex.Lock()
	defer globalPool.mutex.Unlock()

	// Double-check after acquiring write lock
	if db, exists := globalPool.pools[databaseID]; exists {
		return db, nil
	}

	// Create new connection for user database
	connectionString := fmt.Sprintf("postgres://user_%s:pass_%s@localhost:5432/db_%s?sslmode=disable", 
		databaseID[:8], databaseID[:8], databaseID[:8])
	
	db, err := sql.Open("postgres", connectionString)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to user database: %w", err)
	}

	// Configure connection pool
	db.SetMaxOpenConns(10)
	db.SetMaxIdleConns(2)
	db.SetConnMaxLifetime(time.Hour)

	if err := db.Ping(); err != nil {
		db.Close()
		return nil, fmt.Errorf("failed to ping user database: %w", err)
	}

	globalPool.pools[databaseID] = db
	return db, nil
}

func CloseUserDatabaseConnection(databaseID string) {
	globalPool.mutex.Lock()
	defer globalPool.mutex.Unlock()

	if db, exists := globalPool.pools[databaseID]; exists {
		db.Close()
		delete(globalPool.pools, databaseID)
	}
}

func CloseAllConnections() {
	globalPool.mutex.Lock()
	defer globalPool.mutex.Unlock()

	for id, db := range globalPool.pools {
		db.Close()
		delete(globalPool.pools, id)
	}
}