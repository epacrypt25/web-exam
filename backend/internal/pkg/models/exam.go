package models

import (
	"time"

	"github.com/google/uuid"
)

type Exam struct {
	ID          uuid.UUID `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	ClassID     uuid.UUID `json:"class_id"`
	CreatedAt   time.Time `json:"created_at"`
}

type CreateExamRequest struct {
	Title       string    `json:"title" validate:"required"`
	Description string    `json:"description"`
	ClassID     uuid.UUID `json:"class_id" validate:"required"`
}

type Question struct {
	ID            uuid.UUID `json:"id"`
	ExamID        uuid.UUID `json:"exam_id"`
	QuestionText  string    `json:"question_text"`
	OptionA       string    `json:"option_a"`
	OptionB       string    `json:"option_b"`
	OptionC       string    `json:"option_c"`
	OptionD       string    `json:"option_d"`
	CorrectAnswer string    `json:"correct_answer"`
	CreatedAt     time.Time `json:"created_at"`
}

type CreateQuestionRequest struct {
	ExamID        uuid.UUID `json:"exam_id" validate:"required"`
	QuestionText  string    `json:"question_text" validate:"required"`
	OptionA       string    `json:"option_a" validate:"required"`
	OptionB       string    `json:"option_b" validate:"required"`
	OptionC       string    `json:"option_c" validate:"required"`
	OptionD       string    `json:"option_d" validate:"required"`
	CorrectAnswer string    `json:"correct_answer" validate:"required"`
}

type ExamResult struct {
	ID        uuid.UUID `json:"id"`
	ExamID    uuid.UUID `json:"exam_id"`
	UserID    uuid.UUID `json:"user_id"`
	Score     int       `json:"score"`
	Total     int       `json:"total"`
	CreatedAt time.Time `json:"created_at"`
}

type SubmitExamRequest struct {
	Answers map[uuid.UUID]string `json:"answers" validate:"required"`
}
