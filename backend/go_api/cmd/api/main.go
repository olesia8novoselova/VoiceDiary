package main

import (
	"database/sql"
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"

	_ "github.com/IU-Capstone-Project-2025/VoiceDiary/backend/go_api/docs"
	"github.com/IU-Capstone-Project-2025/VoiceDiary/backend/go_api/internal/config"
	"github.com/IU-Capstone-Project-2025/VoiceDiary/backend/go_api/internal/handler"
	"github.com/IU-Capstone-Project-2025/VoiceDiary/backend/go_api/internal/middleware"
	"github.com/IU-Capstone-Project-2025/VoiceDiary/backend/go_api/internal/service"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func main() {
	if err := godotenv.Load(); err != nil {
    	log.Println("No .env file found, using existing environment")
    }
	cfg := config.Load()

	db, err := sql.Open("postgres", cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Failed to connect to the database: %v", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatalf("Failed to ping the database: %v", err)
	}

	frontendURL := os.Getenv("FRONTEND")
	r := gin.Default()
	r.Use(cors.New(cors.Config{
    AllowOrigins:     []string{frontendURL, "https://go_api", "http://178.205.96.163:8080", "http://178.205.96.163:3000", "https://178.205.96.163:3000", "https://178.205.96.163", "https://178.205.96.163:80", "https://178.205.96.163:443", "https://178.205.96.163:8080", "https://dadadadada.dynnamn.ru"},
    AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
    AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
    ExposeHeaders:    []string{"Content-Length"},
    AllowCredentials: true,
}))

	recordHandler := handler.NewRecordHandler(db, cfg.MLServiceURL)
	userService := service.NewUserService(db)
	userHandler := handler.NewUserHandler(userService)
	totalService := service.NewTotalService(db, cfg.MLServiceURL)
	recordService := service.NewRecordService(db, cfg.MLServiceURL)
	totalHandler := handler.NewTotalHandler(totalService, recordService)

	// User-related endpoints
	userGroup := r.Group("/users")
	{
		userGroup.POST("/register", userHandler.Register)
		userGroup.POST("/login", userHandler.Login)
		userGroup.POST("/logout", middleware.AuthMiddleware(userService), userHandler.Logout)
		userGroup.GET("/me", middleware.AuthMiddleware(userService), userHandler.Me)
		userGroup.GET("/:userID/records", recordHandler.GetRecords)
		userGroup.PATCH("/me", middleware.AuthMiddleware(userService), userHandler.UpdateProfile)
		userGroup.DELETE("/me", middleware.AuthMiddleware(userService), userHandler.DeleteAccount)
	}

	// Record-related endpoints
	recordGroup := r.Group("/records")
	{
		recordGroup.GET("/:recordID", recordHandler.GetRecordAnalysis)
		recordGroup.POST("/upload", recordHandler.UploadRecord)
		recordGroup.POST("/insights", recordHandler.GetRecordInsights)
		recordGroup.DELETE("/:recordID", recordHandler.DeleteRecord)
		recordGroup.POST("/:recordID/feedback", recordHandler.SetRecordFeedback)
		recordGroup.PATCH("/:recordID/emotion", recordHandler.UpdateEmotion)
		recordGroup.GET("/users/:userID/consecutive-days", recordHandler.GetConsecutiveRecordingDays)
	}

	totalGroup := r.Group("/totals")
	{
    totalGroup.GET("/:userID", totalHandler.GetTotals)
    totalGroup.POST("/:userID/recalculate/:date", totalHandler.RecalculateTotal)
	}

	r.GET("/swagger/*any",
    ginSwagger.WrapHandler(swaggerFiles.Handler, 
        ginSwagger.URL("/swagger/doc.json"),
    ),
)

	log.Printf("Starting server on port %s\n", cfg.ListenAddr)
	if err := r.RunTLS(cfg.ListenAddr, "localhost.crt", "localhost.key"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}