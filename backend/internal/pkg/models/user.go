package models

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID           uuid.UUID  `json:"id"`
	Username     string     `json:"username"`
	PasswordHash string     `json:"-"` // Don't expose password hash in JSON response
	Role         string     `json:"role"`
	ClassID      *uuid.UUID `json:"class_id"` // Nullable class assignment
	CreatedAt    time.Time  `json:"created_at"`
}

type UpdateClassRequest struct {
	ClassID string `json:"class_id" validate:"required"`
}

type RegisterRequest struct {
	Username string `json:"username" validate:"required"`
	Password string `json:"password" validate:"required"`
}

type LoginRequest struct {
	Username string `json:"username" validate:"required"`
	Password string `json:"password" validate:"required"`
}

type TokenResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}

type RefreshRequest struct {
	RefreshToken string `json:"refresh_token" validate:"required"`
}

