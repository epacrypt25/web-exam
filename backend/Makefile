.PHONY: auth user class exam run-all

auth:
	go run ./cmd/auth

user:
	go run ./cmd/user

class:
	go run ./cmd/class

exam:
	go run ./cmd/exam

run-all:
	@echo "Starting all microservices..."
	@go run ./cmd/auth & \
	go run ./cmd/user & \
	go run ./cmd/class & \
	go run ./cmd/exam & \
	wait
