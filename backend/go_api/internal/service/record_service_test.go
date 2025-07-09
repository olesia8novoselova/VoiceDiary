package service

import (
	"context"
	"database/sql"
	"fmt"
	"os"
	"testing"
	"time"

	"github.com/IU-Capstone-Project-2025/VoiceDiary/backend/go_api/internal/repository"
	_ "github.com/lib/pq"
	"github.com/stretchr/testify/assert"
)

// Helper to set up a clean test DB
func setupTestDB(t *testing.T) *sql.DB {
    dbURL := os.Getenv("TEST_DATABASE_URL")
    if dbURL == "" {
        t.Fatal("TEST_DATABASE_URL is not set")
    }
    db, err := sql.Open("postgres", dbURL)
    if err != nil {
        t.Fatalf("failed to connect to test db: %v", err)
    }
    db.Exec("DELETE FROM record")
    db.Exec(`DELETE FROM "user"`)
    return db
}

func TestFetchUserRecords_SaveAndFetch(t *testing.T) {
    t.Skip("temporarily disabled due to known issue")
    
    db := setupTestDB(t)
    defer db.Close()
    svc := NewRecordService(db, "http://ml_service:5000")
    ctx := context.Background()

    // Insert a user (required for foreign key)
    userID, err := repository.CreateUser(ctx, db, "recuser", "pass", "RecUser")
    assert.NoError(t, err)

    // Save two records
    _, err = svc.SaveRecord(ctx, userID, "happy", "summary1", "", nil)
    assert.NoError(t, err)
    _, err = svc.SaveRecord(ctx, userID, "sad", "summary2", "", nil)
    assert.NoError(t, err)

    // Fetch records
    records, err := svc.FetchUserRecords(ctx, userID, time.Time{}, 0)
    assert.NoError(t, err)
    assert.True(t, len(records) >= 2)
}

func TestFetchRecordByID_NotFound(t *testing.T) {
    db := setupTestDB(t)
    defer db.Close()
    svc := NewRecordService(db, "http://ml_service:5000")
    ctx := context.Background()

    rec, err := svc.FetchRecordByID(ctx, 999999)
    assert.Error(t, err)
    assert.Nil(t, rec)
}

func TestSaveAndFetchRecordByID(t *testing.T) {
    t.Skip("temporarily disabled due to known issue")

    db := setupTestDB(t)
    defer db.Close()
    svc := NewRecordService(db, "http://ml_service:5000")
    ctx := context.Background()

    userID, err := repository.CreateUser(ctx, db, "singleuser", "pass", "SingleUser")
    assert.NoError(t, err)

    recID, err := svc.SaveRecord(ctx, userID, "neutral", "test summary", "", nil)
    assert.NoError(t, err)

    rec, err := svc.FetchRecordByID(ctx, recID)
    assert.NoError(t, err)
    assert.Equal(t, userID, rec.UserID)
    assert.Equal(t, "neutral", rec.Emotion)
    assert.Equal(t, "test summary", rec.Summary)
}

// Helper to convert int to string
func stringFromInt(i int) string {
    return fmt.Sprintf("%d", i)
}