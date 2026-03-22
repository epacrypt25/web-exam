package auth

import (
	"database/sql"
	"errors"
	"time"

	"exam/internal/pkg/models"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

var (
	ErrUsernameExists = errors.New("username already exists")
	ErrInvalidCreds   = errors.New("invalid credentials")
	ErrTokenInvalid   = errors.New("invalid token")
	ErrUserNotFound   = errors.New("user not found")
)

type Service interface {
	Register(req *models.RegisterRequest) (*models.User, error)
	Login(req *models.LoginRequest) (*models.TokenResponse, error)
	Refresh(req *models.RefreshRequest) (*models.TokenResponse, error)
}

type service struct {
	repo      Repository
	jwtSecret string
}

func NewService(repo Repository, jwtSecret string) Service {
	return &service{
		repo:      repo,
		jwtSecret: jwtSecret,
	}
}

func (s *service) Register(req *models.RegisterRequest) (*models.User, error) {
	_, err := s.repo.GetUserByUsername(req.Username)
	if err == nil {
		return nil, ErrUsernameExists
	} else if err != sql.ErrNoRows {
		return nil, err
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	userID, err := s.repo.CreateUser(req.Username, string(hashedPassword))
	if err != nil {
		return nil, err
	}

	return s.repo.GetUserByID(userID)
}

func (s *service) generateTokens(userID, username, role string) (*models.TokenResponse, error) {
	accessClaims := jwt.MapClaims{
		"user_id":  userID,
		"username": username,
		"role":     role,
		"exp":      time.Now().Add(time.Minute * 15).Unix(),
	}
	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims)
	aToken, err := accessToken.SignedString([]byte(s.jwtSecret))
	if err != nil {
		return nil, err
	}

	refreshClaims := jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(time.Hour * 24 * 7).Unix(),
	}
	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims)
	rToken, err := refreshToken.SignedString([]byte(s.jwtSecret))
	if err != nil {
		return nil, err
	}

	return &models.TokenResponse{
		AccessToken:  aToken,
		RefreshToken: rToken,
	}, nil
}

func (s *service) Login(req *models.LoginRequest) (*models.TokenResponse, error) {
	user, err := s.repo.GetUserByUsername(req.Username)
	if err == sql.ErrNoRows {
		return nil, ErrInvalidCreds
	} else if err != nil {
		return nil, err
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password))
	if err != nil {
		return nil, ErrInvalidCreds
	}

	return s.generateTokens(user.ID.String(), user.Username, user.Role)
}

func (s *service) Refresh(req *models.RefreshRequest) (*models.TokenResponse, error) {
	token, err := jwt.Parse(req.RefreshToken, func(t *jwt.Token) (interface{}, error) {
		return []byte(s.jwtSecret), nil
	})

	if err != nil || !token.Valid {
		return nil, ErrTokenInvalid
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, ErrTokenInvalid
	}

	userID, ok := claims["user_id"].(string)
	if !ok {
		return nil, ErrTokenInvalid
	}

	user, err := s.repo.GetUserByID(userID)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, ErrUserNotFound
		}
		return nil, err
	}

	return s.generateTokens(user.ID.String(), user.Username, user.Role)
}
