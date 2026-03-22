package auth

import (
	"net/http"

	"exam/internal/pkg/models"

	"github.com/labstack/echo/v4"
)

type Handler struct {
	svc Service
}

func NewHandler(svc Service) *Handler {
	return &Handler{svc: svc}
}

// @Summary Register a new user
// @Description Register a new user with username and password
// @Tags auth
// @Accept json
// @Produce json
// @Param request body models.RegisterRequest true "Register Request"
// @Success 201 {object} map[string]interface{}
// @Failure 400 {object} map[string]string
// @Failure 409 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /register [post]
func (h *Handler) Register(c echo.Context) error {
	var req models.RegisterRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request payload"})
	}

	if req.Username == "" || req.Password == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Username and password are required"})
	}

	user, err := h.svc.Register(&req)
	if err != nil {
		if err == ErrUsernameExists {
			return c.JSON(http.StatusConflict, map[string]string{"error": err.Error()})
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to create user"})
	}

	return c.JSON(http.StatusCreated, map[string]interface{}{
		"message": "User registered successfully",
		"user":    user,
	})
}

// @Summary Login user
// @Description Login user to get access and refresh tokens
// @Tags auth
// @Accept json
// @Produce json
// @Param request body models.LoginRequest true "Login Request"
// @Success 200 {object} models.TokenResponse
// @Failure 400 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /login [post]
func (h *Handler) Login(c echo.Context) error {
	var req models.LoginRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request payload"})
	}

	tokens, err := h.svc.Login(&req)
	if err != nil {
		if err == ErrInvalidCreds {
			return c.JSON(http.StatusUnauthorized, map[string]string{"error": err.Error()})
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to login"})
	}

	return c.JSON(http.StatusOK, tokens)
}

// @Summary Refresh access token
// @Description Refresh access token using a valid refresh token
// @Tags auth
// @Accept json
// @Produce json
// @Param request body models.RefreshRequest true "Refresh Request"
// @Success 200 {object} models.TokenResponse
// @Failure 400 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /refresh [post]
func (h *Handler) Refresh(c echo.Context) error {
	var req models.RefreshRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request payload"})
	}

	tokens, err := h.svc.Refresh(&req)
	if err != nil {
		if err == ErrTokenInvalid || err == ErrUserNotFound {
			return c.JSON(http.StatusUnauthorized, map[string]string{"error": err.Error()})
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to refresh token"})
	}

	return c.JSON(http.StatusOK, tokens)
}
