package exam

import (
	"database/sql"
	"exam/internal/pkg/models"
)

type Repository interface {
	CreateExam(req *models.CreateExamRequest) (string, error)
	GetExamsByClass(classID string) ([]models.Exam, error)
	CreateQuestion(req *models.CreateQuestionRequest) (string, error)
	GetQuestionsByExam(examID string) ([]models.Question, error)
	CreateExamResult(result *models.ExamResult) error
	GetExamResult(examID string, userID string) (*models.ExamResult, error)
}

type repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) Repository {
	return &repository{db: db}
}

func (r *repository) CreateExam(req *models.CreateExamRequest) (string, error) {
	var examID string
	query := `INSERT INTO exams (title, description, class_id) VALUES ($1, $2, $3) RETURNING id`
	// Assume class_id is valid UUID string
	err := r.db.QueryRow(query, req.Title, req.Description, req.ClassID).Scan(&examID)
	if err != nil {
		return "", err
	}
	return examID, nil
}

func (r *repository) GetExamsByClass(classID string) ([]models.Exam, error) {
	query := `SELECT id, title, description, class_id, created_at FROM exams WHERE class_id = $1 ORDER BY created_at DESC`
	rows, err := r.db.Query(query, classID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	exams := make([]models.Exam, 0)
	for rows.Next() {
		var e models.Exam
		if err := rows.Scan(&e.ID, &e.Title, &e.Description, &e.ClassID, &e.CreatedAt); err != nil {
			return nil, err
		}
		exams = append(exams, e)
	}
	return exams, nil
}

func (r *repository) CreateQuestion(req *models.CreateQuestionRequest) (string, error) {
	var questionID string
	query := `INSERT INTO questions (exam_id, question_text, option_a, option_b, option_c, option_d, correct_answer) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`
	err := r.db.QueryRow(query, req.ExamID, req.QuestionText, req.OptionA, req.OptionB, req.OptionC, req.OptionD, req.CorrectAnswer).Scan(&questionID)
	if err != nil {
		return "", err
	}
	return questionID, nil
}

func (r *repository) GetQuestionsByExam(examID string) ([]models.Question, error) {
	query := `SELECT id, exam_id, question_text, option_a, option_b, option_c, option_d, correct_answer, created_at FROM questions WHERE exam_id = $1 ORDER BY created_at ASC`
	rows, err := r.db.Query(query, examID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	questions := make([]models.Question, 0)
	for rows.Next() {
		var q models.Question
		if err := rows.Scan(&q.ID, &q.ExamID, &q.QuestionText, &q.OptionA, &q.OptionB, &q.OptionC, &q.OptionD, &q.CorrectAnswer, &q.CreatedAt); err != nil {
			return nil, err
		}
		questions = append(questions, q)
	}
	return questions, nil
}

func (r *repository) CreateExamResult(result *models.ExamResult) error {
	query := `INSERT INTO exam_results (exam_id, user_id, score, total) VALUES ($1, $2, $3, $4) RETURNING id, created_at`
	err := r.db.QueryRow(query, result.ExamID, result.UserID, result.Score, result.Total).Scan(&result.ID, &result.CreatedAt)
	if err != nil {
		return err
	}
	return nil
}

func (r *repository) GetExamResult(examID string, userID string) (*models.ExamResult, error) {
	query := `SELECT id, exam_id, user_id, score, total, created_at FROM exam_results WHERE exam_id = $1 AND user_id = $2`
	var result models.ExamResult
	err := r.db.QueryRow(query, examID, userID).Scan(&result.ID, &result.ExamID, &result.UserID, &result.Score, &result.Total, &result.CreatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return &result, nil
}
