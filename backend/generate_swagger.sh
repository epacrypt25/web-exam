#!/bin/bash
SWAG=$(go env GOPATH)/bin/swag

echo "Generating Swagger for Auth Service..."
$SWAG init -d cmd/auth,internal/auth,internal/pkg/models -g main.go -o cmd/auth/docs

echo "Generating Swagger for User Service..."
$SWAG init -d cmd/user,internal/user,internal/pkg/models -g main.go -o cmd/user/docs

echo "Generating Swagger for Class Service..."
$SWAG init -d cmd/class,internal/class,internal/pkg/models -g main.go -o cmd/class/docs

echo "Generating Swagger for Exam Service..."
$SWAG init -d cmd/exam,internal/exam,internal/pkg/models -g main.go -o cmd/exam/docs

echo "Tidying dependencies..."
go mod tidy
echo "Done!"
