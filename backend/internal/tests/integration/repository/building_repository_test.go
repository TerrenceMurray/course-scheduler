package integration_test

import (
	"context"
	"testing"

	"github.com/TerrenceMurray/course-scheduler/internal/models"
	"github.com/TerrenceMurray/course-scheduler/internal/repository"
	"github.com/TerrenceMurray/course-scheduler/internal/tests/utils"
	"github.com/google/uuid"
	"github.com/stretchr/testify/suite"
)

type BuildingRepositorySuite struct {
	suite.Suite
	testDB *utils.TestDB
	repo   repository.BuildingRepositoryInterface
	ctx    context.Context
}

func (s *BuildingRepositorySuite) SetupSuite() {
	s.testDB = utils.NewTestDB(s.T())
	s.repo = repository.NewBuildingRepository(s.testDB.DB, s.testDB.Logger)
}

func (s *BuildingRepositorySuite) TearDownSuite() {
	s.testDB.Close()
}

func (s *BuildingRepositorySuite) TearDownTest() {
	s.testDB.Truncate("building")
}

// Test Methods

func (s *BuildingRepositorySuite) TestCreateBuilding_Success() {
	expected := &models.Building{
		ID:   uuid.New(),
		Name: "Natural Science",
	}

	actual, err := s.repo.Create(s.ctx, expected)

	s.Require().NoError(err)
	s.Require().Equal(expected.Name, actual.Name)
}

func (s *BuildingRepositorySuite) TestCreateBuilding_ValidationError() {
	testBuilding := &models.Building{
		ID:   uuid.New(),
		Name: "",
	}

	_, err := s.repo.Create(s.ctx, testBuilding)

	s.Require().Error(err)
}

func TestBuildingRepositorySuite(t *testing.T) {
	suite.Run(t, new(BuildingRepositorySuite))
}
