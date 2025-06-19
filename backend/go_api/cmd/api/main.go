package main

import (
	"database/sql"
	"log"

	_ "github.com/lib/pq"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"github.com/IU-Capstone-Project-2025/VoiceDiary/backend/go_api/internal/config"
    "github.com/IU-Capstone-Project-2025/VoiceDiary/backend/go_api/internal/handler"
	_ "github.com/IU-Capstone-Project-2025/VoiceDiary/backend/go_api/docs"
	ginSwagger "github.com/swaggo/gin-swagger"
    swaggerFiles "github.com/swaggo/files"
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

	r := gin.Default()

	recordHandler := handler.NewRecordHandler(db, cfg.MLServiceURL)
	r.GET("/users/:userID/records", recordHandler.GetRecords)
	r.POST("/records/:recordID/analyze", recordHandler.AnalyzeRecord)

	r.GET("/swagger/*any",
    ginSwagger.WrapHandler(swaggerFiles.Handler, 
        ginSwagger.URL("/swagger/doc.json"),
    ),
)

	log.Printf("Starting server on port %s\n", cfg.ListenAddr)
	if err := r.Run(cfg.ListenAddr); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}