package user

import (
	"database/sql"
	"exam/internal/pkg/models"
	
	"github.com/google/uuid"
)

type Repository interface {
	GetUserByID(userID string) (*models.User, error)
	SetClass(userID string, classID string) error
}

type repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) Repository {
	return &repository{db: db}
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

func (r *repository) SetClass(userID string, classID string) error {
	query := `UPDATE users SET class_id = $1 WHERE id = $2`
	_, err := r.db.Exec(query, classID, userID)
	return err
}
