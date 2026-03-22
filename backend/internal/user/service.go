package user

import (
	"database/sql"
	"errors"

	"exam/internal/pkg/models"
)

var ErrUserNotFound = errors.New("user not found")

type Service interface {
	GetProfile(userID string) (*models.User, error)
	SetClass(userID string, classID string) error
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) GetProfile(userID string) (*models.User, error) {
	user, err := s.repo.GetUserByID(userID)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, ErrUserNotFound
		}
		return nil, err
	}
	return user, nil
}

func (s *service) SetClass(userID string, classID string) error {
	return s.repo.SetClass(userID, classID)
}
