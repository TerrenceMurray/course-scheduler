package integration_test

import (
	"context"
	"testing"

	"github.com/TerrenceMurray/course-scheduler/internal/repository"
	"github.com/TerrenceMurray/course-scheduler/internal/tests/utils"
	"github.com/stretchr/testify/suite"
)

type CourseRepositorySuite struct {
	suite.Suite
	repo   repository.CourseRepositoryInterface
	testDB *utils.TestDB
	ctx    context.Context
}

func (s *CourseRepositorySuite) SetupSuite() {
	s.testDB = utils.NewTestDB(s.T())
	s.repo = repository.NewCourseRepository(s.testDB.DB, s.testDB.Logger)
}

func (s *CourseRepositorySuite) TearDownSuite() {
	s.testDB.Close()
}

func (s *CourseRepositorySuite) TearDownTest() {
	s.testDB.Truncate("courses")
}

func TestCourseRepositorySuite(t *testing.T) {
	suite.Run(t, new(CourseRepositorySuite))
}
