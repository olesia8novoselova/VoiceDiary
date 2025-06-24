package service

import (
	"context"
	"database/sql"
	"strconv"

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
	userID, err := strconv.Atoi(userIDParam)
	if err != nil {
		return nil, err
	}
	return repository.GetRecordsByUser(ctx, s.db, userID)
}

func (s *RecordService) AnalyzeRawAudio(ctx context.Context, fileBytes []byte) (string, error) {
	result, err := client.CallMLService(ctx, s.mlURL, fileBytes)
	if err != nil {
	return "", err
	}
	return result.Emotion, nil
}

func (s *RecordService) SaveRecord(ctx context.Context, userID int, emotion string) (int, error) {
	return repository.SaveRecord(ctx, s.db, userID, emotion)
}