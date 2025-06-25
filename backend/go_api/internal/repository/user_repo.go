package repository

import (
	"context"
	"database/sql"
	_ "github.com/lib/pq"
)

type User struct {
	ID int `db:"id"`
	Login string `db:"login"`
	Password string `db:"password"`
	Nickname string `db:"nickname"`
}

func CreateUser(ctx context.Context, db *sql.DB, login, password, nickname string) (int, error) {
	query := `
		INSERT INTO users (login, password, nickname)
		VALUES ($1, $2, $3)
		RETURNING id
	`
	var userID int
	err := db.QueryRowContext(ctx, query, login, password, nickname).Scan(&userID)
	if err != nil {
		return 0, err
	}
	return userID, nil
}

func GetUserByLogin(ctx context.Context, db *sql.DB, login string) (*User, error) {
	query := `
		SELECT id, login, password, nickname
		FROM users
		WHERE login = $1
	`
	var user User
	err := db.QueryRowContext(ctx, query, login).Scan(&user.ID, &user.Login, &user.Password, &user.Nickname)
	if err != nil {
		return nil, err // Other error
	}
	return &user, nil
}