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

// TestCreateBatch

func (s *BuildingRepositorySuite) TestCreateBatch_Success() {
	expected := []*models.Building{
		models.NewBuilding(uuid.New(), "Building 1"),
		models.NewBuilding(uuid.New(), "Building 2"),
	}

	actual, err := s.repo.CreateBatch(s.ctx, expected)

	s.Require().NoError(err)
	s.Require().Equal(2, len(actual))
	s.Require().NotNil(actual)
	for i, building := range expected {
		s.Require().Equal(building.ID, actual[i].ID)
		s.Require().Equal(building.Name, actual[i].Name)
	}
}

func (s *BuildingRepositorySuite) TestCreateBatch_ValidationError() {
	expected := []*models.Building{
		models.NewBuilding(uuid.New(), " "),
		models.NewBuilding(uuid.New(), "Building 2"),
	}

	actual, err := s.repo.CreateBatch(s.ctx, expected)

	s.Require().Error(err)
	s.Require().ErrorContains(err, "failed to create building")
	s.Require().Nil(actual)
}

func (s *BuildingRepositorySuite) TestCreateBatch_RollbackOnError() {
	buildings := []*models.Building{
		models.NewBuilding(uuid.New(), "Building 1"),
		models.NewBuilding(uuid.New(), " "),
	}

	_, createErr := s.repo.CreateBatch(s.ctx, buildings)

	actual, getErr := s.repo.List(s.ctx)

	s.Require().Error(createErr)
	s.Require().NoError(getErr)
	s.Require().Equal(0, len(actual))
}

// TestDelete
func (s *BuildingRepositorySuite) TestDelete_Success() {
	building, createErr := s.repo.Create(s.ctx, models.NewBuilding(uuid.New(), "Building 1"))

	err := s.repo.Delete(s.ctx, building.ID)

	actual, getErr := s.repo.List(s.ctx)

	s.Require().NoError(createErr)
	s.Require().NoError(getErr)
	s.Require().NoError(err)
	s.Require().NotNil(actual)
	s.Require().Equal(0, len(actual))
}

func (s *BuildingRepositorySuite) TestDelete_NotFound() {
	err := s.repo.Delete(s.ctx, uuid.New())

	s.Require().Error(err)
	s.Require().NotNil(err)
	s.Require().ErrorContains(err, repository.ErrNotFound.Error())
}

// TestBuildingRepositorySuite
func TestBuildingRepositorySuite(t *testing.T) {
	suite.Run(t, new(BuildingRepositorySuite))
}
