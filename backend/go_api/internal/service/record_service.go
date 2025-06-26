package service

import (
	"context"
	"database/sql"
	"strconv"
	"log"

	"github.com/IU-Capstone-Project-2025/VoiceDiary/backend/go_api/internal/client"
	"github.com/IU-Capstone-Project-2025/VoiceDiary/backend/go_api/internal/repository"
)

type RecordService struct {
	db *sql.DB
	mlURL string
}

func NewRecordService(db *sql.DB, mlURL string) *RecordService {
	return &RecordService{
    	db: db,
    	mlURL: mlURL,
    }
}

func (s *RecordService) FetchUserRecords(ctx context.Context, userIDParam string) ([]repository.Record, error) {
	log.Printf("FetchUserRecords: fetching records for userID %s", userIDParam)

	userID, err := strconv.Atoi(userIDParam)
	if err != nil {
		log.Printf("FetchUserRecords: invalid userIDParam %s, error: %v", userIDParam, err)
		return nil, err
	}

	log.Printf("FetchUserRecords: valid userID %d", userID)
	return repository.GetRecordsByUser(ctx, s.db, userID)
}

func (s *RecordService) AnalyzeRawAudio(ctx context.Context, fileBytes []byte) (string, string, error) {
	log.Printf("AnalyzeRawAudio: sending file to ML service at %s", s.mlURL)
	
	result, err := client.CallMLService(ctx, s.mlURL, fileBytes)
	if err != nil {
		log.Printf("AnalyzeRawAudio: failed to call ML service, error: %v", err)
		return "", "", err
	}

	log.Printf("AnalyzeRawAudio: received response from ML service, Emotion: %s, Summary: %s", result.Emotion, result.Summary)
	return result.Emotion, result.Summary, nil
}

func (s *RecordService) SaveRecord(ctx context.Context, userID int, emotion string, summary string) (int, error) {
	return repository.SaveRecord(ctx, s.db, userID, emotion, summary)
}

func (s *RecordService) FetchRecordByID(ctx context.Context, recordID int) (*repository.Record, error) {
    return repository.GetRecordByID(ctx, s.db, recordID)
}