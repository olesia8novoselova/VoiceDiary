package service

import (
	"context"
	"database/sql"
	"log"
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
	log.Printf("FetchUserRecords: fetching records for userID %s", userIDParam)

	userID, err := strconv.Atoi(userIDParam)
	if err != nil {
		log.Printf("FetchUserRecords: invalid userIDParam %s, error: %v", userIDParam, err)
		return nil, err
	}

	log.Printf("FetchUserRecords: valid userID %d", userID)
	return repository.GetRecordsByUser(ctx, s.db, userID)
}

func (s *RecordService) AnalyzeRawAudio(ctx context.Context, fileBytes []byte) (string, string, string, error) {
	log.Printf("AnalyzeRawAudio: sending file to ML service at %s", s.mlURL)
	result, err := client.CallMLService(ctx, s.mlURL, fileBytes)
	if err != nil {
		log.Printf("AnalyzeRawAudio: failed to call ML service, error: %v", err)
		return "", "", "", err
	}

	log.Printf("AnalyzeRawAudio: received response from ML service, Emotion: %s, Summary: %s, Text: %s", result.Emotion, result.Summary, result.Text)
	return result.Emotion, result.Summary, result.Text, nil
}

func (s *RecordService) SaveRecord(ctx context.Context, userID int, emotion string, summary string) (int, error) {
	return repository.SaveRecord(ctx, s.db, userID, emotion, summary)
}

func (s *RecordService) FetchRecordByID(ctx context.Context, recordID int) (*repository.Record, error) {
    return repository.GetRecordByID(ctx, s.db, recordID)
}

func (s *RecordService) AnalyzeText(ctx context.Context, text string) (*client.AnalysisResult, error) {
	return client.CallMLServiceWithInsights(ctx, s.mlURL, text)
}


// GetDominantEmotion returns:
//  - "no"           if no rows for that user/date
//  - a string       if one emotion strictly has the highest count
//  - the full slice if all counts are equal
// func (s *RecordService) GetDominantEmotion(ctx context.Context, userID int, date time.Time) (interface{}, error) {
//     ems, err := repository.GetDailyEmotionsByUserAndDate(ctx, s.db, userID, date)
//     if err != nil {
//         return nil, err
//     }
//     if len(ems) == 0 {
//         return "no", nil
//     }

//     // find max
//     max := ems[0].Count
//     for _, e := range ems {
//         if e.Count > max {
//             max = e.Count
//         }
//     }
//     // check if *all* equal
//     allEqual := true
//     for _, e := range ems {
//         if e.Count != max {
//             allEqual = false
//             break
//         }
//     }
//     if allEqual {
//         return ems, nil
//     }
//     // otherwise return one of the highest
//     for _, e := range ems {
//         if e.Count == max {
//             return e.Emotion, nil
//         }
//     }
//     return nil, errors.New("unexpected balanced state")
// }