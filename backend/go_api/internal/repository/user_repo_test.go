package repository

import (
    "context"
    "database/sql"
    "os"
    "testing"

    _ "github.com/lib/pq"
    "github.com/stretchr/testify/assert"
)

func setupTestDB(t *testing.T) *sql.DB {
    dbURL := os.Getenv("TEST_DATABASE_URL")
    if dbURL == "" {
        t.Fatal("TEST_DATABASE_URL is not set")
    }
    db, err := sql.Open("postgres", dbURL)
    if err != nil {
        t.Fatalf("failed to connect to test db: %v", err)
    }
    // Clean up tables before each test
    db.Exec("DELETE FROM sessions")
    db.Exec("DELETE FROM users")
    return db
}

func TestCreateAndGetUser(t *testing.T) {
    db := setupTestDB(t)
    defer db.Close()
    ctx := context.Background()

    login := "testuser"
    password := "hashedpassword"
    nickname := "Testy"

    // Create user
    userID, err := CreateUser(ctx, db, login, password, nickname)
    assert.NoError(t, err)
    assert.True(t, userID > 0)

    // Get user by login
    user, err := GetUserByLogin(ctx, db, login)
    assert.NoError(t, err)
    assert.Equal(t, userID, user.ID)
    assert.Equal(t, login, user.Login)
    assert.Equal(t, password, user.Password)
    assert.Equal(t, nickname, user.Nickname)
}

func TestSaveSessionAndGetUserBySession(t *testing.T) {
    db := setupTestDB(t)
    defer db.Close()
    ctx := context.Background()

    // Create user
    login := "sessionuser"
    password := "hashedpassword"
    nickname := "Session"
    userID, err := CreateUser(ctx, db, login, password, nickname)
    assert.NoError(t, err)

    // Save session
    token := "test-session-token"
    err = SaveSession(ctx, db, userID, token)
    assert.NoError(t, err)

    // Get user by session
    user, err := GetUserBySession(ctx, db, token)
    assert.NoError(t, err)
    assert.Equal(t, userID, user.ID)
    assert.Equal(t, login, user.Login)
}

func TestGetUserByLogin_NotFound(t *testing.T) {
    db := setupTestDB(t)
    defer db.Close()
    ctx := context.Background()

    _, err := GetUserByLogin(ctx, db, "nonexistent")
    assert.Error(t, err)
}

func TestGetUserBySession_NotFound(t *testing.T) {
    db := setupTestDB(t)
    defer db.Close()
    ctx := context.Background()

    _, err := GetUserBySession(ctx, db, "badtoken")
    assert.Error(t, err)
}