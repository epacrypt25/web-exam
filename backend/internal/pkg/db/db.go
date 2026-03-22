package db

import (
	"database/sql"
	"fmt"
	"log"

	"exam/internal/pkg/config"

	_ "github.com/lib/pq"
)

func InitDB(cfg *config.Config) (*sql.DB, error) {
	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		cfg.DBHost, cfg.DBPort, cfg.DBUser, cfg.DBPassword, cfg.DBName, cfg.DBSSLMode)

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, fmt.Errorf("error opening database: %w", err)
	}

	if err = db.Ping(); err != nil {
		return nil, fmt.Errorf("error connecting to the database: %w", err)
	}

	log.Println("Successfully connected to the database.")

	err = createTables(db)
	if err != nil {
		return nil, fmt.Errorf("error creating tables: %w", err)
	}

	return db, nil
}

func createTables(db *sql.DB) error {
	usersQuery := `
	CREATE TABLE IF NOT EXISTS users (
		id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
		username VARCHAR(50) UNIQUE NOT NULL,
		password_hash VARCHAR(255) NOT NULL,
		role VARCHAR(20) DEFAULT 'user' NOT NULL,
		created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
	);`
	if _, err := db.Exec(usersQuery); err != nil {
		return err
	}

	classesQuery := `
	CREATE TABLE IF NOT EXISTS classes (
		id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
		name VARCHAR(100) NOT NULL,
		description TEXT,
		created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
	);`
	if _, err := db.Exec(classesQuery); err != nil {
		return err
	}

	alterUsersQuery := `ALTER TABLE users ADD COLUMN IF NOT EXISTS class_id UUID REFERENCES classes(id) ON DELETE SET NULL;`
	if _, err := db.Exec(alterUsersQuery); err != nil {
		return err
	}

	examsQuery := `
	CREATE TABLE IF NOT EXISTS exams (
		id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
		title VARCHAR(100) NOT NULL,
		description TEXT,
		class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
		created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
	);`
	if _, err := db.Exec(examsQuery); err != nil {
		return err
	}

	questionsQuery := `
	CREATE TABLE IF NOT EXISTS questions (
		id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
		exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
		question_text TEXT NOT NULL,
		option_a VARCHAR(255) NOT NULL,
		option_b VARCHAR(255) NOT NULL,
		option_c VARCHAR(255) NOT NULL,
		option_d VARCHAR(255) NOT NULL,
		correct_answer CHAR(1) NOT NULL,
		created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
	);`
	if _, err := db.Exec(questionsQuery); err != nil {
		return err
	}

	examResultsQuery := `
	CREATE TABLE IF NOT EXISTS exam_results (
		id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
		exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
		user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
		score INT NOT NULL,
		total INT NOT NULL,
		created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
		UNIQUE(exam_id, user_id)
	);`
	if _, err := db.Exec(examResultsQuery); err != nil {
		return err
	}

	log.Println("Database tables initialized successfully.")
	return nil
}
