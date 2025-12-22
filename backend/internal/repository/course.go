package repository

import (
	"database/sql"

	"go.uber.org/zap"
)

var _ CourseRepositoryInterface = (*CourseRepository)(nil)

type CourseRepositoryInterface interface {
}

type CourseRepository struct {
	db     *sql.DB
	logger *zap.Logger
}

func NewCourseRepository(db *sql.DB, logger *zap.Logger) CourseRepositoryInterface {
	return &CourseRepository{
		db:     db,
		logger: logger,
	}
}
