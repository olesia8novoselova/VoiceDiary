package service

import (
	"context"
	"database/sql"
	"log"
	"time"

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

func (s *RecordService) FetchUserRecords(ctx context.Context, userID int, date time.Time, limit int) ([]repository.Record, error) {
    if date.IsZero() {
        // Return latest records
        return repository.GetLatestRecords(ctx, s.db, userID, limit)
    } else {
        // Return records starting from the specified date
        return repository.GetRecordsStartingFromDate(ctx, s.db, userID, date, limit)
    }
}

func (s *RecordService) AnalyzeRawAudio(ctx context.Context, fileBytes []byte) (string, string, string, string, error) {
	log.Printf("AnalyzeRawAudio: sending file to ML service at %s", s.mlURL)
	result, err := client.CallMLService(ctx, s.mlURL, fileBytes)
	if err != nil {
		log.Printf("AnalyzeRawAudio: failed to call ML service, error: %v", err)
		return "", "", "", "", err
	}

	log.Printf("AnalyzeRawAudio: received response from ML service, Emotion: %s, Summary: %s, TextInsights: %s, Feedback: %s", result.Emotion, result.Summary, result.TextInsights, result.Feedback)
	return result.Emotion, result.Summary, result.TextInsights, result.Feedback, nil
}

func (s *RecordService) SaveRecord(ctx context.Context, userID int, emotion string, summary string, feedback string, insights map[string]string) (int, error) {
	return repository.SaveRecord(ctx, s.db, userID, emotion, summary, feedback, insights)
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