package models

import (
	"time"

	"github.com/google/uuid"
)

type Class struct {
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
}

type CreateClassRequest struct {
	Name        string `json:"name" validate:"required"`
	Description string `json:"description"`
}
