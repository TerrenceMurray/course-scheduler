package integration_test

import (
	"context"
	"errors"
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
	s.ctx = context.Background()
}

func (s *BuildingRepositorySuite) TearDownSuite() {
	s.testDB.Close()
}

func (s *BuildingRepositorySuite) TearDownTest() {
	s.testDB.Truncate("scheduler.buildings")
}

// TestCreateBuilding
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

// TestGetByID
func (s *BuildingRepositorySuite) TestGetByID_Success() {
	expected, err := s.repo.Create(s.ctx, models.NewBuilding(uuid.New(), "Building 1"))

	actual, err := s.repo.GetByID(s.ctx, expected.ID)

	s.Require().NoError(err)
	s.Require().Equal(expected.ID, actual.ID)
	s.Require().Equal(expected.Name, actual.Name)
}

func (s *BuildingRepositorySuite) TestGetByID_NotFoundError() {
	expectedErr := errors.New("failed to get building: qrm: no rows in result set")

	_, actualErr := s.repo.GetByID(s.ctx, uuid.New())

	s.Require().Equal(expectedErr.Error(), actualErr.Error())
}

// TestList
func (s *BuildingRepositorySuite) TestList_Success() {
	expected1, _ := s.repo.Create(s.ctx, models.NewBuilding(uuid.New(), "Building 1"))
	expected2, _ := s.repo.Create(s.ctx, models.NewBuilding(uuid.New(), "Building 2"))

	actual, err := s.repo.List(s.ctx)

	s.Require().NoError(err)
	s.Require().Equal(expected1.ID, actual[0].ID)
	s.Require().Equal(expected2.ID, actual[1].ID)
}

func (s *BuildingRepositorySuite) TestList_Empty() {
	actual, err := s.repo.List(s.ctx)

	s.Require().NoError(err)
	s.Require().Equal(0, len(actual))
}

// TestBuildingRepositorySuite
func TestBuildingRepositorySuite(t *testing.T) {
	suite.Run(t, new(BuildingRepositorySuite))
}
