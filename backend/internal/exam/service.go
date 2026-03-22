package exam

import (
	"fmt"
	"math"
	"strings"

	"exam/internal/pkg/models"
	"github.com/google/uuid"
)

type Service interface {
	CreateExam(req *models.CreateExamRequest) (string, error)
	GetExamsByClass(classID string) ([]models.Exam, error)
	CreateQuestion(req *models.CreateQuestionRequest) (string, error)
	GetQuestionsByExam(examID string) ([]models.Question, error)
	SubmitExam(examID string, userID string, req *models.SubmitExamRequest) (*models.ExamResult, error)
	GetExamResult(examID string, userID string) (*models.ExamResult, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) CreateExam(req *models.CreateExamRequest) (string, error) {
	return s.repo.CreateExam(req)
}

func (s *service) GetExamsByClass(classID string) ([]models.Exam, error) {
	return s.repo.GetExamsByClass(classID)
}

func (s *service) CreateQuestion(req *models.CreateQuestionRequest) (string, error) {
	return s.repo.CreateQuestion(req)
}

func (s *service) GetQuestionsByExam(examID string) ([]models.Question, error) {
	return s.repo.GetQuestionsByExam(examID)
}

func (s *service) SubmitExam(examID string, userID string, req *models.SubmitExamRequest) (*models.ExamResult, error) {
	questions, err := s.repo.GetQuestionsByExam(examID)
	if err != nil {
		return nil, err
	}

	totalQuestions := len(questions)
	if totalQuestions == 0 {
		return nil, fmt.Errorf("no questions found for this exam")
	}

	correctCount := 0
	for _, q := range questions {
		if ans, ok := req.Answers[q.ID]; ok {
			if strings.EqualFold(ans, q.CorrectAnswer) {
				correctCount++
			}
		}
	}

	percentage := int(math.Round((float64(correctCount) / float64(totalQuestions)) * 100))

	examIDParsed, _ := uuid.Parse(examID)
	userIDParsed, _ := uuid.Parse(userID)

	result := &models.ExamResult{
		ExamID: examIDParsed,
		UserID: userIDParsed,
		Score:  percentage,
		Total:  totalQuestions,
	}

	if err := s.repo.CreateExamResult(result); err != nil {
		return nil, err
	}

	return result, nil
}

func (s *service) GetExamResult(examID string, userID string) (*models.ExamResult, error) {
	return s.repo.GetExamResult(examID, userID)
}
