package auth

import (
	"database/sql"

	"exam/internal/pkg/models"
	"github.com/google/uuid"
)

type Repository interface {
	CreateUser(username, passwordHash string) (string, error)
	GetUserByUsername(username string) (*models.User, error)
	GetUserByID(userID string) (*models.User, error)
}

type repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) Repository {
	return &repository{db: db}
}

func (r *repository) CreateUser(username, passwordHash string) (string, error) {
	var userID string
	query := `INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id`
	err := r.db.QueryRow(query, username, passwordHash).Scan(&userID)
	if err != nil {
		return "", err
	}
	return userID, nil
}

func (r *repository) GetUserByUsername(username string) (*models.User, error) {
	var user models.User
	var classID uuid.NullUUID
	query := `SELECT id, username, password_hash, role, class_id, created_at FROM users WHERE username = $1`
	err := r.db.QueryRow(query, username).Scan(&user.ID, &user.Username, &user.PasswordHash, &user.Role, &classID, &user.CreatedAt)
	if err != nil {
		return nil, err
	}
	if classID.Valid {
		user.ClassID = &classID.UUID
	}
	return &user, nil
}

func (r *repository) GetUserByID(userID string) (*models.User, error) {
	var user models.User
	var classID uuid.NullUUID
	query := `SELECT id, username, password_hash, role, class_id, created_at FROM users WHERE id = $1`
	err := r.db.QueryRow(query, userID).Scan(&user.ID, &user.Username, &user.PasswordHash, &user.Role, &classID, &user.CreatedAt)
	if err != nil {
		return nil, err
	}
	if classID.Valid {
		user.ClassID = &classID.UUID
	}
	return &user, nil
}
