package main

import (
	"log"

	"exam/internal/pkg/config"
	"exam/internal/pkg/db"
	"exam/internal/pkg/middleware"
	"exam/internal/user"

	"github.com/labstack/echo/v4"
	echoMiddleware "github.com/labstack/echo/v4/middleware"
	echoSwagger "github.com/swaggo/echo-swagger"
	_ "exam/cmd/user/docs"
)

// @title User Microservice API
// @version 1.0
// @description This is the User Service API
// @host localhost:8081
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

	userRepo := user.NewRepository(dbConn)
	userSvc := user.NewService(userRepo)
	userHandler := user.NewHandler(userSvc)

	// User Microservice Routes (Protected)
	protected := e.Group("")
	protected.Use(middleware.JWTMiddleware(cfg.JWTSecret))
	
	protected.GET("/profile", userHandler.GetProfile)
	protected.PUT("/profile/class", userHandler.UpdateClass)

	e.GET("/swagger/*", echoSwagger.WrapHandler)

	e.GET("/", func(c echo.Context) error {
		return c.JSON(200, map[string]string{"message": "User Service API!"})
	})

	log.Printf("Starting User Service on port 8081") // Running on different port to allow both concurrently
	if err := e.Start(":8081"); err != nil {
		log.Fatalf("Shutting down the server: %v", err)
	}
}
