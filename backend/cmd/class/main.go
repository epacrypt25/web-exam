package main

import (
	"log"

	"exam/internal/class"
	"exam/internal/pkg/config"
	"exam/internal/pkg/db"
	"exam/internal/pkg/middleware"

	"github.com/labstack/echo/v4"
	echoMiddleware "github.com/labstack/echo/v4/middleware"
	echoSwagger "github.com/swaggo/echo-swagger"
	_ "exam/cmd/class/docs"
)

// @title Class Microservice API
// @version 1.0
// @description This is the Class Service API
// @host localhost:8082
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

	classRepo := class.NewRepository(dbConn)
	classSvc := class.NewService(classRepo)
	classHandler := class.NewHandler(classSvc)

	protected := e.Group("/classes")
	protected.Use(middleware.JWTMiddleware(cfg.JWTSecret))

	protected.POST("", classHandler.CreateClass)
	protected.GET("", classHandler.GetClasses)

	e.GET("/swagger/*", echoSwagger.WrapHandler)

	e.GET("/", func(c echo.Context) error {
		return c.JSON(200, map[string]string{"message": "Class Service API!"})
	})

	log.Printf("Starting Class Service on port 8082")
	if err := e.Start(":8082"); err != nil {
		log.Fatalf("Shutting down the server: %v", err)
	}
}
