package repository

import (
	"context"
	"database/sql"
	"log"
	"time"
)

type UserTotal struct {
	ID            int       `json:"id"`
	UserID        int       `json:"user_id"`
	Date          time.Time `json:"date"`
	Emotion 	  string    `json:"emotion"`
	Summary       string    `json:"summary"`
}

func SaveOrUpdateUserTotal(ctx context.Context, db *sql.DB, userID int, date time.Time, emotion, summary string) error {
	log.Printf("SaveOrUpdateUserTotal: saving totals for user %d on date %s", userID, date.Format("2006-01-02"))

	query := `
		INSERT INTO user_totals (user_id, date, emotion, summary)
		VALUES ($1, $2, $3, $4)
		ON CONFLICT (user_id, date) 
		DO UPDATE SET 
			emotion = EXCLUDED.emotion,
			summary = EXCLUDED.summary,
			updated_at = NOW()
	`
	_, err := db.ExecContext(ctx, query, userID, date, emotion, summary)
	if err != nil {
		log.Printf("SaveOrUpdateUserTotal: failed to save totals, error: %v", err)
		return err
	}

	log.Printf("SaveOrUpdateUserTotal: successfully saved totals for user %d", userID)
	return nil
}

func GetUserTotalsByDateRange(ctx context.Context, db *sql.DB, userID int, startDate, endDate time.Time) ([]UserTotal, error) {
	log.Printf("GetUserTotalsByDateRange: fetching totals for user %d from %s to %s", 
		userID, startDate.Format("2006-01-02"), endDate.Format("2006-01-02"))

	query := `
		SELECT id, user_id, date, emotion, summary, insights
		FROM user_totals
		WHERE user_id = $1 AND date BETWEEN $2 AND $3
		ORDER BY date DESC
	`
	rows, err := db.QueryContext(ctx, query, userID, startDate, endDate)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var totals []UserTotal
	for rows.Next() {
		var t UserTotal
		if err := rows.Scan(&t.ID, &t.UserID, &t.Date, &t.Emotion, &t.Summary); err != nil {
			return nil, err
		}
		
		totals = append(totals, t)
	}

	return totals, nil
}

func DeleteUserTotal(ctx context.Context, db *sql.DB, userID int, date time.Time) error {
    log.Printf("DeleteUserTotal: deleting total for user %d on date %s", userID, date.Format("2006-01-02"))

    query := `DELETE FROM user_totals WHERE user_id = $1 AND date = $2`
    _, err := db.ExecContext(ctx, query, userID, date)
    if err != nil {
        log.Printf("DeleteUserTotal: failed to delete total, error: %v", err)
        return err
    }

    log.Printf("DeleteUserTotal: successfully deleted total for user %d", userID)
    return nil
}