package repository

import (
	"context"
	"database/sql"
	"log"
	"strconv"
	"strings"

	_ "github.com/lib/pq"
)

type User struct {
	ID   int    `db:"user_id"`
	Login    string `db:"login"`
	Password string `db:"password"`
	Nickname string `db:"nickname"`
}

func CreateUser(ctx context.Context, db *sql.DB, login, password, nickname string) (int, error) {
	log.Printf("CreateUser: creating user with login %s", login)

	query := `
		INSERT INTO "user" (login, password, nickname)
		VALUES ($1, $2, $3)
		RETURNING user_id
	`
	var userID int
	err := db.QueryRowContext(ctx, query, login, password, nickname).Scan(&userID)
	if err != nil {
		log.Printf("CreateUser: failed to create user, error: %v", err)
		return 0, err
	}

	log.Printf("CreateUser: successfully created user with ID %d", userID)
	return userID, nil
}

func GetUserByLogin(ctx context.Context, db *sql.DB, login string) (*User, error) {
	log.Printf("GetUserByLogin: fetching user with login %s", login)

	query := `
		SELECT user_id, login, password, nickname
		FROM "user"
		WHERE login = $1
	`
	var user User
	err := db.QueryRowContext(ctx, query, login).Scan(&user.ID, &user.Login, &user.Password, &user.Nickname)
	if err != nil {
		log.Printf("GetUserByLogin: failed to fetch user with login %s, error: %v", login, err)
		return nil, err
	}

	log.Printf("GetUserByLogin: successfully fetched user with ID %d", user.ID)
	return &user, nil
}

func SaveSession(ctx context.Context, db *sql.DB, userID int, token string) error {
	log.Printf("SaveSession: saving session for userID %d", userID)

	query := `
		INSERT INTO session (user_id, token)
		VALUES ($1, $2)
	`
	_, err := db.ExecContext(ctx, query, userID, token)
	if err != nil {
		log.Printf("SaveSession: failed to save session for userID %d, error: %v", userID, err)
		return err
	}

	log.Printf("SaveSession: successfully saved session for userID %d", userID)
	return nil
}

func GetUserBySession(ctx context.Context, db *sql.DB, token string) (*User, error) {
	log.Printf("GetUserBySession: fetching user by session token %s", token)

	query := `
		SELECT u.user_id, u.login, u.password, u.nickname
		FROM "user" u
		JOIN session s ON u.user_id = s.user_id
		WHERE s.token = $1
	`
	var user User
	err := db.QueryRowContext(ctx, query, token).Scan(&user.ID, &user.Login, &user.Password, &user.Nickname)
	if err != nil {
		log.Printf("GetUserBySession: failed to fetch user by session token %s, error: %v", token, err)
		return nil, err
	}

	log.Printf("GetUserBySession: successfully fetched user with ID %d", user.ID)
	return &user, nil
}

func DeleteSession(ctx context.Context, db *sql.DB, token string) error {
	log.Printf("DeleteSession: deleting session token %s", token)
	query := `
		DELETE FROM session
		WHERE token = $1
	`
	_, err := db.ExecContext(ctx, query, token)
	if err != nil {
		log.Printf("DeleteSession: failed to delete session token %s, error: %v", token, err)
		return err
	}
	log.Printf("DeleteSession: successfully deleted session token %s", token)
	return nil
}

// UpdateUserProfile updates login, password, and/or nickname for a user.
func UpdateUserProfile(ctx context.Context, db *sql.DB, userID int, login, password, nickname string) error {
    log.Printf("UpdateUserProfile: updating profile for userID %d", userID)
    setParts := []string{}
    args := []interface{}{}
    argIdx := 1

    if login != "" {
        setParts = append(setParts, "login = $" + strconv.Itoa(argIdx))
        args = append(args, login)
        argIdx++
    }
    if password != "" {
        setParts = append(setParts, "password = $" + strconv.Itoa(argIdx))
        args = append(args, password)
        argIdx++
    }
    if nickname != "" {
        setParts = append(setParts, "nickname = $" + strconv.Itoa(argIdx))
        args = append(args, nickname)
        argIdx++
    }
    if len(setParts) == 0 {
        log.Printf("UpdateUserProfile: no fields to update for userID %d", userID)
        return nil
    }

    args = append(args, userID)
    query := `UPDATE "user" SET ` + strings.Join(setParts, ", ") + ` WHERE user_id = $` + strconv.Itoa(argIdx)
    res, err := db.ExecContext(ctx, query, args...)
    if err != nil {
        log.Printf("UpdateUserProfile: failed to update user %d, error: %v", userID, err)
        return err
    }
    rowsAffected, err := res.RowsAffected()
    if err != nil {
        return err
    }
    if rowsAffected == 0 {
        log.Printf("UpdateUserProfile: no user found with ID %d", userID)
        return sql.ErrNoRows
    }
    log.Printf("UpdateUserProfile: successfully updated user %d", userID)
    return nil
}
