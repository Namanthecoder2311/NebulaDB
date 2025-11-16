package main

import (
	"log"
	"nebuladb/metadata-api/internal/config"
	"nebuladb/metadata-api/internal/database"
	"nebuladb/metadata-api/internal/handlers"
	"nebuladb/metadata-api/internal/middleware"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Initialize configuration
	cfg := config.Load()

	// Initialize database
	db, err := database.Connect(cfg.DatabaseURL)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close()

	// Initialize Gin router
	r := gin.Default()

	// Middleware
	r.Use(middleware.CORS())
	r.Use(middleware.Logger())
	r.Use(middleware.PerformanceMonitoring())

	// Initialize handlers
	h := handlers.New(db, cfg)

	// Routes
	setupRoutes(r, h)

	log.Printf("Server starting on port %s", cfg.Port)
	log.Fatal(r.Run(":" + cfg.Port))
}

func setupRoutes(r *gin.Engine, h *handlers.Handler) {
	api := r.Group("/api/v1")

	// Health check
	api.GET("/health", h.HealthCheck)

	// Auth routes
	auth := api.Group("/auth")
	{
		auth.POST("/register", h.Register)
		auth.POST("/login", h.Login)
		auth.POST("/refresh", h.RefreshToken)
	}

	// Protected routes
	protected := api.Group("/")
	protected.Use(middleware.AuthRequired())
	{
		// User routes
		protected.GET("/user", h.GetUser)
		protected.PUT("/user", h.UpdateUser)

		// Project routes
		projects := protected.Group("/projects")
		{
			projects.GET("", h.ListProjects)
			projects.POST("", h.CreateProject)
			projects.GET("/:id", h.GetProject)
			projects.PUT("/:id", h.UpdateProject)
			projects.DELETE("/:id", h.DeleteProject)
		}

		// Database routes
		databases := protected.Group("/projects/:projectId/databases")
		{
			databases.GET("", h.ListDatabases)
			databases.POST("", h.CreateDatabase)
			databases.GET("/:id", h.GetDatabase)
			databases.PUT("/:id", h.UpdateDatabase)
			databases.DELETE("/:id", h.DeleteDatabase)
		}

		// Datacenter routes
		protected.GET("/datacenters", h.ListDatacenters)
		protected.POST("/databases/:databaseId/datacenter", h.SelectDatacenter)

		// Table routes
		tables := protected.Group("/databases/:databaseId/tables")
		{
			tables.GET("", h.ListTables)
			tables.POST("", h.CreateTable)
			tables.GET("/:name", h.GetTable)
			tables.PUT("/:name", h.UpdateTable)
			tables.DELETE("/:name", h.DeleteTable)
		}

		// SQL execution
		protected.POST("/databases/:databaseId/sql", h.ExecuteSQL)

		// API routes (auto-generated)
		apiRoutes := protected.Group("/databases/:databaseId/api")
		{
			apiRoutes.GET("/endpoints", h.ListAPIEndpoints)
			apiRoutes.POST("/endpoints", h.CreateAPIEndpoint)
		}

		// Dynamic data API routes with rate limiting
		dataAPI := protected.Group("/databases/:databaseId/data")
		dataAPI.Use(middleware.APIRateLimit())
		{
			dataAPI.GET("/:tableName", h.HandleGeneratedAPI)
			dataAPI.POST("/:tableName", h.HandleGeneratedAPI)
			dataAPI.GET("/:tableName/:id", h.HandleGeneratedAPI)
			dataAPI.PUT("/:tableName/:id", h.HandleGeneratedAPI)
			dataAPI.DELETE("/:tableName/:id", h.HandleGeneratedAPI)
		}

		// Usage and billing
		usage := protected.Group("/projects/:projectId/usage")
		{
			usage.GET("", h.GetUsage)
			usage.GET("/metrics", h.GetMetrics)
			usage.GET("/billing", h.GetBilling)
		}

		// Billing management
		billing := protected.Group("/projects/:projectId/billing")
		{
			billing.POST("/subscription", h.CreateSubscription)
			billing.PUT("/subscription", h.UpdateSubscription)
			billing.GET("/invoices", h.GetInvoices)
		}
	}
}