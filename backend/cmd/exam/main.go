package main

import (
	"log"

	"exam/internal/exam"
	"exam/internal/pkg/config"
	"exam/internal/pkg/db"
	"exam/internal/pkg/middleware"

	"github.com/labstack/echo/v4"
	echoMiddleware "github.com/labstack/echo/v4/middleware"
	echoSwagger "github.com/swaggo/echo-swagger"
	_ "exam/cmd/exam/docs"
)

// @title Exam Microservice API
// @version 1.0
// @description This is the Exam Service API
// @host localhost:8083
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

	examRepo := exam.NewRepository(dbConn)
	examSvc := exam.NewService(examRepo)
	examHandler := exam.NewHandler(examSvc)

	protected := e.Group("/exams")
	protected.Use(middleware.JWTMiddleware(cfg.JWTSecret))

	protected.POST("", examHandler.CreateExam)
	protected.GET("", examHandler.GetExamsByClass)
	protected.POST("/:exam_id/questions", examHandler.CreateQuestion)
	protected.GET("/:exam_id/questions", examHandler.GetQuestionsByExam)
	protected.POST("/:exam_id/submit", examHandler.SubmitExam)
	protected.GET("/:exam_id/result", examHandler.GetExamResult)

	e.GET("/swagger/*", echoSwagger.WrapHandler)

	e.GET("/", func(c echo.Context) error {
		return c.JSON(200, map[string]string{"message": "Exam Service API!"})
	})

	log.Printf("Starting Exam Service on port 8083")
	if err := e.Start(":8083"); err != nil {
		log.Fatalf("Shutting down the server: %v", err)
	}
}
