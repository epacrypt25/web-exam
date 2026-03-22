package exam

import (
	"net/http"

	"exam/internal/pkg/models"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

type Handler struct {
	svc Service
}

func NewHandler(svc Service) *Handler {
	return &Handler{svc: svc}
}

// @Summary Create a new exam
// @Description Create a new exam assigned to a class
// @Tags exam
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param request body models.CreateExamRequest true "Create Exam Request"
// @Success 201 {object} map[string]interface{}
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /exams [post]
func (h *Handler) CreateExam(c echo.Context) error {
	var req models.CreateExamRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request payload"})
	}

	if req.Title == "" || req.ClassID == uuid.Nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Title and Class ID are required"})
	}

	examID, err := h.svc.CreateExam(&req)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to create exam"})
	}

	return c.JSON(http.StatusCreated, map[string]interface{}{
		"message": "Exam created successfully",
		"exam_id": examID,
	})
}

// @Summary Get exams by class
// @Description Retrieve a list of exams for a specific class ID
// @Tags exam
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param class_id query string true "Class ID"
// @Success 200 {array} models.Exam
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /exams [get]
func (h *Handler) GetExamsByClass(c echo.Context) error {
	classID := c.QueryParam("class_id")
	if classID == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "class_id query parameter is required"})
	}

	exams, err := h.svc.GetExamsByClass(classID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to retrieve exams"})
	}

	return c.JSON(http.StatusOK, exams)
}

// @Summary Create a new question
// @Description Create a new multiple choice question for an exam
// @Tags question
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param exam_id path string true "Exam ID"
// @Param request body models.CreateQuestionRequest true "Create Question Request"
// @Success 201 {object} map[string]interface{}
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /exams/{exam_id}/questions [post]
func (h *Handler) CreateQuestion(c echo.Context) error {
	examID := c.Param("exam_id")
	if examID == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "exam_id is required"})
	}

	var req models.CreateQuestionRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request payload"})
	}

	parsedExamID, err := uuid.Parse(examID)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid exam_id format"})
	}
	req.ExamID = parsedExamID

	if req.QuestionText == "" || req.OptionA == "" || req.OptionB == "" || req.OptionC == "" || req.OptionD == "" || req.CorrectAnswer == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "All fields are required"})
	}

	questionID, err := h.svc.CreateQuestion(&req)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to create question"})
	}

	return c.JSON(http.StatusCreated, map[string]interface{}{
		"message":     "Question created successfully",
		"question_id": questionID,
	})
}

// @Summary Get questions by exam
// @Description Retrieve a list of questions for a specific exam
// @Tags question
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param exam_id path string true "Exam ID"
// @Success 200 {array} models.Question
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /exams/{exam_id}/questions [get]
func (h *Handler) GetQuestionsByExam(c echo.Context) error {
	examID := c.Param("exam_id")
	if examID == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "exam_id is required"})
	}

	questions, err := h.svc.GetQuestionsByExam(examID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to retrieve questions"})
	}

	return c.JSON(http.StatusOK, questions)
}

// @Summary Submit an exam
// @Description Submit answers for an exam and get the score
// @Tags result
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param exam_id path string true "Exam ID"
// @Param request body models.SubmitExamRequest true "Submit Exam Request"
// @Success 201 {object} models.ExamResult
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /exams/{exam_id}/submit [post]
func (h *Handler) SubmitExam(c echo.Context) error {
	examID := c.Param("exam_id")
	userID := c.Get("user_id").(string)

	if examID == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "exam_id is required"})
	}

	var req models.SubmitExamRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request payload"})
	}

	result, err := h.svc.SubmitExam(examID, userID, &req)
	if err != nil {
		if err.Error() == "no questions found for this exam" {
			return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to submit exam"})
	}

	return c.JSON(http.StatusCreated, result)
}

// @Summary Get exam result
// @Description Get the result for a specific exam and user
// @Tags result
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param exam_id path string true "Exam ID"
// @Success 200 {object} models.ExamResult
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /exams/{exam_id}/result [get]
func (h *Handler) GetExamResult(c echo.Context) error {
	examID := c.Param("exam_id")
	userID := c.Get("user_id").(string)

	if examID == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "exam_id is required"})
	}

	result, err := h.svc.GetExamResult(examID, userID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to get exam result"})
	}

	if result == nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Exam result not found"})
	}

	return c.JSON(http.StatusOK, result)
}
