package class

import "exam/internal/pkg/models"

type Service interface {
	CreateClass(req *models.CreateClassRequest) (string, error)
	GetClasses() ([]models.Class, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) CreateClass(req *models.CreateClassRequest) (string, error) {
	return s.repo.CreateClass(req)
}

func (s *service) GetClasses() ([]models.Class, error) {
	return s.repo.GetClasses()
}
