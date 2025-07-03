package repository

import (
    "context"
    "database/sql"
    "os"
    "testing"

    _ "github.com/lib/pq"
    "github.com/stretchr/testify/assert"
)

func setupRecordTestDB(t *testing.T) *sql.DB {
    dbURL := os.Getenv("TEST_DATABASE_URL")
    if dbURL == "" {
        t.Fatal("TEST_DATABASE_URL is not set")
    }
    db, err := sql.Open("postgres", dbURL)
    if err != nil {
        t.Fatalf("failed to connect to test db: %v", err)
    }
    // Clean up before each test
    db.Exec("DELETE FROM records")
    return db
}

func TestSaveAndGetRecord(t *testing.T) {
    db := setupRecordTestDB(t)
    defer db.Close()
    ctx := context.Background()

    userID := 1

    // Save a record
    emotion := "happy"
    summary := "Test summary"
    recordID, err := SaveRecord(ctx, db, userID, emotion, summary)
    assert.NoError(t, err)
    assert.True(t, recordID > 0)

    // Get record by ID
    rec, err := GetRecordByID(ctx, db, recordID)
    assert.NoError(t, err)
    assert.Equal(t, userID, rec.UserID)
    assert.Equal(t, emotion, rec.Emotion)
    assert.Equal(t, summary, rec.Summary)
}

func TestGetRecordsByUser(t *testing.T) {
    db := setupTestDB(t)
    defer db.Close()
    ctx := context.Background()

    userID := 1 // Make sure this user exists in your test DB

    // Insert two records
    SaveRecord(ctx, db, userID, "happy", "summary1")
    SaveRecord(ctx, db, userID, "sad", "summary2")

    records, err := GetRecordsByUser(ctx, db, userID)
    assert.NoError(t, err)
    assert.True(t, len(records) >= 2)
}

func TestGetRecordByID_NotFound(t *testing.T) {
    db := setupTestDB(t)
    defer db.Close()
    ctx := context.Background()

    _, err := GetRecordByID(ctx, db, 999999)
    assert.Error(t, err)
}