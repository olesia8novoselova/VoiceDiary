package service

import (
	"context"
	"database/sql"
	"strconv"
	"github.com/IU-Capstone-Project-2025/VoiceDiary/backend/go_api/internal/repository"
	"github.com/IU-Capstone-Project-2025/VoiceDiary/backend/go_api/internal/client"
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

func (s *RecordService) AnalyzeRecord(ctx context.Context, recordIDParam string) (*client.AnalysisResult, error) {
	recs, err := repository.GetRecordsByUser(ctx, s.db, 0) // 0 - userID
	if err != nil {
		return nil, err
	}
	dataURL := recs[0].DataURL
	return client.CallMLService(ctx, s.mlURL, dataURL)
}