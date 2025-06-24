package repository

import (
	"context"
	"database/sql"
	"time"

	_ "github.com/lib/pq"
)

type Record struct {
	ID int `json:"id"`
	UserID int `json:"user_id"`
	RecordDate string `json:"record_date"`
	Emotion string `json:"emotion"`
}

const getRecordsByUserSQL = `
    SELECT id, user_id, record_date, emotion
	FROM records
	WHERE user_id = $1
	ORDER BY record_date DESC
`
func SaveRecord(ctx context.Context, db *sql.DB, userID int, emotion string) (int, error) {
	recordDate := time.Now()

	query := `
	INSERT INTO records (user_id, emotion, record_date)
	VALUES ($1, $2, $3)
	RETURNING id
	`
	var recordID int
	err := db.QueryRowContext(ctx, query, userID, emotion, recordDate).Scan(&recordID)
	if err != nil {
		return 0, err
	}
	return recordID, nil
}

func GetRecordsByUser(ctx context.Context, db *sql.DB, userID int) ([]Record, error) {
	rows, err := db.QueryContext(ctx, getRecordsByUserSQL, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var records []Record
	for rows.Next() {
		var r Record
		if err := rows.Scan(&r.ID, &r.UserID, &r.RecordDate, &r.Emotion); err != nil {
			return nil, err
		}
		records = append(records, r)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return records, nil
}