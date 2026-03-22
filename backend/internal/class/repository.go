package class

import (
	"database/sql"
	"exam/internal/pkg/models"
)

type Repository interface {
	CreateClass(req *models.CreateClassRequest) (string, error)
	GetClasses() ([]models.Class, error)
}

type repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) Repository {
	return &repository{db: db}
}

func (r *repository) CreateClass(req *models.CreateClassRequest) (string, error) {
	var classID string
	query := `INSERT INTO classes (name, description) VALUES ($1, $2) RETURNING id`
	err := r.db.QueryRow(query, req.Name, req.Description).Scan(&classID)
	if err != nil {
		return "", err
	}
	return classID, nil
}

func (r *repository) GetClasses() ([]models.Class, error) {
	query := `SELECT id, name, description, created_at FROM classes ORDER BY created_at DESC`
	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	classes := make([]models.Class, 0)
	for rows.Next() {
		var c models.Class
		if err := rows.Scan(&c.ID, &c.Name, &c.Description, &c.CreatedAt); err != nil {
			return nil, err
		}
		classes = append(classes, c)
	}
	return classes, nil
}
