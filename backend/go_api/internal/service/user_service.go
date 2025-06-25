package service

import (
	"context"
	"database/sql"
	"github.com/IU-Capstone-Project-2025/VoiceDiary/backend/go_api/internal/repository"
)

type UserService struct {
	db *sql.DB
}

func NewUserService(db *sql.DB) *UserService {
	return &UserService{
		db: db,
	}
}

func (s *UserService) RegisterUser(ctx context.Context, login, password, nickname string) (int, error) {
	return repository.CreateUser(ctx, s.db, login, password, nickname)
}

func (s *UserService) GetUserByLogin(ctx context.Context, login string) (*repository.User, error) {
	return repository.GetUserByLogin(ctx, s.db, login)
}