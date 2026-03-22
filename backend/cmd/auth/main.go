package main

import (
	"log"

	"exam/internal/auth"
	"exam/internal/pkg/config"
	"exam/internal/pkg/db"

	"github.com/labstack/echo/v4"
	echoMiddleware "github.com/labstack/echo/v4/middleware"
	echoSwagger "github.com/swaggo/echo-swagger"
	_ "exam/cmd/auth/docs" // Ignore the error for now, swagger init will create this
)

// @title Auth Microservice API
// @version 1.0
// @description This is the Auth Service API
// @host localhost:8080
// @BasePath /
// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
func main() {
	cfg := config.LoadConfig()

	dbConn, err := db.InitDB(cfg)
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	defer dbConn.Close()

	e := echo.New()

	e.Use(echoMiddleware.Logger())
	e.Use(echoMiddleware.Recover())
	e.Use(echoMiddleware.CORS())

	authRepo := auth.NewRepository(dbConn)
	authSvc := auth.NewService(authRepo, cfg.JWTSecret)
	authHandler := auth.NewHandler(authSvc)

	// Auth Microservice Routes
	e.POST("/register", authHandler.Register)
	e.POST("/login", authHandler.Login)
	e.POST("/refresh", authHandler.Refresh)
	
	e.GET("/swagger/*", echoSwagger.WrapHandler)

	e.GET("/", func(c echo.Context) error {
		return c.JSON(200, map[string]string{"message": "Auth Service API!"})
	})

	log.Printf("Starting Auth Service on port %s", cfg.Port)
	if err := e.Start(":" + cfg.Port); err != nil {
		log.Fatalf("Shutting down the server: %v", err)
	}
}
