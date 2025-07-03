package repository

import (
	"context"
	"database/sql"
	"log"
	_ "github.com/lib/pq"
)

type User struct {
	ID int `db:"id"`
	Login string `db:"login"`
	Password string `db:"password"`
	Nickname string `db:"nickname"`
}

func CreateUser(ctx context.Context, db *sql.DB, login, password, nickname string) (int, error) {
	log.Printf("CreateUser: creating user with login %s", login)

	query := `
		INSERT INTO user (login, password, nickname)
		VALUES ($1, $2, $3)
		RETURNING id
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
		SELECT id, login, password, nickname
		FROM user
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
		SELECT u.id, u.login, u.password, u.nickname
		FROM user u
		JOIN session s ON u.id = s.user_id
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