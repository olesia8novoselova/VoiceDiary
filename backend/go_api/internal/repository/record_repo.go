package repository

import (
	"context"
	"database/sql"
	"log"
	"time"

	_ "github.com/lib/pq"
)

type Record struct {
	ID int `json:"record_id"`
	UserID int `json:"user_id"`
	RecordDate time.Time `json:"record_date"`
	Emotion string `json:"emotion"`
	Summary string `json:"summary"`
	Feedback string `json:"feedback"` 
}

// type DailyEmotion struct {
//     UserID  int       `json:"user_id"`
//     Date    time.Time `json:"date"`
//     Emotion string    `json:"emotion"`
//     Count   int       `json:"count"`
// }

// const getDailyEmotionsSQL = `
// 	SELECT user_id, date, emotion, count
//     FROM daily_emotion
//     WHERE user_id = $1
//     AND date = $2
// `

const getRecordsByUserSQL = `
    SELECT record_id, user_id, record_date, emotion, summary, feedback
	FROM record
	WHERE user_id = $1
	ORDER BY record_date DESC
`
func SaveRecord(ctx context.Context, db *sql.DB, userID int, emotion string, summary string, feedback string) (int, error) {
	log.Printf("SaveRecord: saving record for userID %d with emotion %s", userID, emotion)

	query := `
	INSERT INTO record (user_id, emotion, summary, feedback)
	VALUES ($1, $2, $3)
	RETURNING record_id
	`

	// upsert := `
	// INSERT INTO daily_emotion (user_id, date, emotion, count)
	// VALUES ($1, CURRENT_DATE, $2, 1)
	// ON CONFLICT (user_id, date, emotion)
	// DO UPDATE SET count = daily_emotion.count + 1
	// `
	// if _, err := db.ExecContext(ctx, upsert, userID, emotion); err != nil {
	// 	log.Printf("SaveRecord: failed to upsert daily_emotion, error: %v", err)
	// 	return 0, err
	// }

	var recordID int
	err := db.QueryRowContext(ctx, query, userID, emotion, summary).Scan(&recordID)
	if err != nil {
		log.Printf("SaveRecord: failed to save record, error: %v", err)
		return 0, err
	}

	log.Printf("SaveRecord: successfully saved record with ID %d for userID %d", recordID, userID)
	return recordID, nil
}

func GetRecordsByUser(ctx context.Context, db *sql.DB, userID int) ([]Record, error) {
	log.Printf("GetRecordsByUser: fetching records for userID %d", userID)

	rows, err := db.QueryContext(ctx, getRecordsByUserSQL, userID)
	if err != nil {
		log.Printf("GetRecordsByUser: failed to fetch records for userID %d, error: %v", userID, err)
		return nil, err
	}
	defer rows.Close()

	var records []Record
	for rows.Next() {
		var r Record
		if err := rows.Scan(&r.ID, &r.UserID, &r.RecordDate, &r.Emotion, &r.Summary, &r.Feedback); err != nil {
			log.Printf("GetRecordsByUser: failed to scan record for userID %d, error: %v", userID, err)
			return nil, err
		}
		records = append(records, r)
	}

	if err := rows.Err(); err != nil {
		log.Printf("GetRecordsByUser: failed to iterate over rows for userID %d, error: %v", userID, err)
		return nil, err
	}

	log.Printf("GetRecordsByUser: successfully fetched %d records for userID %d", len(records), userID)
	return records, nil
}

func GetRecordByID(ctx context.Context, db *sql.DB, recordID int) (*Record, error) {
	log.Printf("GetRecordByID: fetching record with ID %d", recordID)

	query := `
	SELECT record_id, user_id, record_date, emotion, summary, feedback 
	FROM record
	WHERE record_id = $1
	`
	var rec Record
	err := db.QueryRowContext(ctx, query, recordID).Scan(&rec.ID, &rec.UserID, &rec.RecordDate, &rec.Emotion, &rec.Summary, &rec.Feedback)
	if err != nil {
		log.Printf("GetRecordByID: failed to fetch record with ID %d, error: %v", recordID, err)
		return nil, err
	}
	log.Printf("GetRecordByID: successfully fetched record with ID %d", rec.ID)
	return &rec, nil
}

// func GetDailyEmotionsByUserAndDate(ctx context.Context, db *sql.DB, userID int, date time.Time) ([]DailyEmotion, error) {
//     rows, err := db.QueryContext(ctx, getDailyEmotionsSQL, userID, date)
//     if err != nil {
//         return nil, err
//     }
//     defer rows.Close()

//     var result []DailyEmotion
//     for rows.Next() {
//         var e DailyEmotion
//         if err := rows.Scan(&e.UserID, &e.Date, &e.Emotion, &e.Count); err != nil {
//             return nil, err
//         }
//         result = append(result, e)
//     }
//     return result, rows.Err()
// }