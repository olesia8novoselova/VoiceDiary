package repository

import (
	"context"
	"database/sql"
	"time"
	"log"

	_ "github.com/lib/pq"
)

type Record struct {
	ID int `json:"id"`
	UserID int `json:"user_id"`
	RecordDate string `json:"record_date"`
	Emotion string `json:"emotion"`
	Summary string `json:"summary"`
}

const getRecordsByUserSQL = `
    SELECT id, user_id, record_date, emotion
	FROM records
	WHERE user_id = $1
	ORDER BY record_date DESC
`
func SaveRecord(ctx context.Context, db *sql.DB, userID int, emotion string, summary string) (int, error) {
	log.Printf("SaveRecord: saving record for userID %d with emotion %s", userID, emotion)
	
	recordDate := time.Now()

	query := `
	INSERT INTO records (user_id, emotion, record_date)
	VALUES ($1, $2, $3)
	RETURNING id
	`
	var recordID int
	err := db.QueryRowContext(ctx, query, userID, emotion, recordDate).Scan(&recordID)
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
		if err := rows.Scan(&r.ID, &r.UserID, &r.RecordDate, &r.Emotion); err != nil {
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

	query := `SELECT id, user_id, record_date, emotion, summary FROM records WHERE id = $1`
	var rec Record
	err := db.QueryRowContext(ctx, query, recordID).Scan(&rec.ID, &rec.UserID, &rec.RecordDate, &rec.Emotion, &rec.Summary)
	if err != nil {
		log.Printf("GetRecordByID: failed to fetch record with ID %d, error: %v", recordID, err)
		return nil, err
	}
	log.Printf("GetRecordByID: successfully fetched record with ID %d", rec.ID)
	return &rec, nil
}