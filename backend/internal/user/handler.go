package user

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

// @Summary Get user profile
// @Description Get logged in user profile using access token
// @Tags user
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {object} models.User
// @Failure 401 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /profile [get]
func (h *Handler) GetProfile(c echo.Context) error {
	userID := c.Get("user_id").(string)
	
	user, err := h.svc.GetProfile(userID)
	if err != nil {
		if err == ErrUserNotFound {
			return c.JSON(http.StatusNotFound, map[string]string{"error": err.Error()})
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Database error"})
	}

	return c.JSON(http.StatusOK, user)
}

// @Summary Update user class
// @Description Set the class_id for the logged in user
// @Tags user
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param request body models.UpdateClassRequest true "Update Class Request"
// @Success 200 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /profile/class [put]
func (h *Handler) UpdateClass(c echo.Context) error {
	userID := c.Get("user_id").(string)
	
	var req models.UpdateClassRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request payload"})
	}

	if req.ClassID == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "class_id is required"})
	}

	if err := h.svc.SetClass(userID, req.ClassID); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to update class"})
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "Class updated successfully"})
}
