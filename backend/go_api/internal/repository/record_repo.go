package repository

import (
	"context"
	"database/sql"
	_ "github.com/lib/pq"
)

type Record struct {
	ID int `json:"id"`
	UserID int `json:"user_id"`
	RecordDate string `json:"record_date"`
	DataURL string `json:"data_url"`
	Mood string `json:"mood"`
}

const getRecordsByUserSQL = `
    SELECT id, user_id, record_date, data_url, mood
	FROM records
	WHERE user_id = $1
	ORDER BY record_date DESC
`
func GetRecordsByUser(ctx context.Context, db *sql.DB, userID int) ([]Record, error) {
	rows, err := db.QueryContext(ctx, getRecordsByUserSQL, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var records []Record
	for rows.Next() {
		var r Record
		if err := rows.Scan(&r.ID, &r.UserID, &r.RecordDate, &r.DataURL, &r.Mood); err != nil {
			return nil, err
		}
		records = append(records, r)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return records, nil
}