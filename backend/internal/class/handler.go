package class

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

// @Summary Create a new class
// @Description Create a new class with name and description
// @Tags class
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param request body models.CreateClassRequest true "Create Class Request"
// @Success 201 {object} map[string]interface{}
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /classes [post]
func (h *Handler) CreateClass(c echo.Context) error {
	var req models.CreateClassRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request payload"})
	}

	if req.Name == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Class name is required"})
	}

	classID, err := h.svc.CreateClass(&req)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to create class"})
	}

	return c.JSON(http.StatusCreated, map[string]interface{}{
		"message":  "Class created successfully",
		"class_id": classID,
	})
}

// @Summary Get all classes
// @Description Retrieve a list of all classes
// @Tags class
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {array} models.Class
// @Failure 500 {object} map[string]string
// @Router /classes [get]
func (h *Handler) GetClasses(c echo.Context) error {
	classes, err := h.svc.GetClasses()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to retrieve classes"})
	}

	return c.JSON(http.StatusOK, classes)
}
