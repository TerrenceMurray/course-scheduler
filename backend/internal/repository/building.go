package repository

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/TerrenceMurray/course-scheduler/internal/database/postgres/scheduler/model"
	"github.com/TerrenceMurray/course-scheduler/internal/database/postgres/scheduler/table"
	"github.com/TerrenceMurray/course-scheduler/internal/models"
	. "github.com/go-jet/jet/v2/postgres"
	"github.com/google/uuid"
	"go.uber.org/zap"
)

var _ BuildingRepositoryInterface = (*BuildingRepository)(nil)

type BuildingRepositoryInterface interface {
	Create(ctx context.Context, building *models.Building) (*models.Building, error)
	GetByID(ctx context.Context, id uuid.UUID) (*models.Building, error)
	List(ctx context.Context) ([]models.Building, error)
}

type BuildingRepository struct {
	db     *sql.DB
	logger *zap.Logger
}

func NewBuildingRepository(db *sql.DB, logger *zap.Logger) BuildingRepositoryInterface {
	return &BuildingRepository{
		db:     db,
		logger: logger,
	}
}

func (b *BuildingRepository) Create(ctx context.Context, building *models.Building) (*models.Building, error) {
	// Validate input
	if building == nil {
		return nil, errors.New("building cannot be nil")
	}

	if err := building.Validate(); err != nil {
		return nil, fmt.Errorf("validation failed: %w", err)
	}

	newBuilding := model.Buildings{
		ID:   uuid.New(),
		Name: building.Name,
	}

	insertStmt := table.Buildings.INSERT(
		table.Buildings.ID,
		table.Buildings.Name,
	).MODEL(newBuilding).RETURNING(table.Buildings.AllColumns)

	var dest model.Buildings
	err := insertStmt.QueryContext(ctx, b.db, &dest)

	if err != nil {
		b.logger.Error("failed to insert building", zap.Error(err))
		return nil, fmt.Errorf("failed to insert building: %w", err)
	}

	return models.NewBuilding(dest.ID, dest.Name), nil
}

func (b *BuildingRepository) GetByID(ctx context.Context, id uuid.UUID) (*models.Building, error) {
	stmt := table.Buildings.
		SELECT(table.Buildings.AllColumns).
		WHERE(table.Buildings.ID.EQ(UUID(id)))

	var dest model.Buildings
	err := stmt.QueryContext(ctx, b.db, &dest)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrNotFound
		}
		b.logger.Error("failed to get building", zap.Error(err), zap.String("id", id.String()))
		return nil, fmt.Errorf("failed to get building: %w", err)
	}

	return models.NewBuilding(dest.ID, dest.Name), nil
}

func (b *BuildingRepository) List(ctx context.Context) ([]models.Building, error) {
	stmt := table.Buildings.
		SELECT(table.Buildings.AllColumns).
		ORDER_BY(table.Buildings.Name.ASC())

	var dest []model.Buildings
	err := stmt.QueryContext(ctx, b.db, &dest)

	if err != nil {
		b.logger.Error("failed to list buildings", zap.Error(err))
		return nil, fmt.Errorf("failed to list buildings: %w", err)
	}

	buildings := make([]models.Building, len(dest))
	for i, d := range dest {
		buildings[i] = models.Building{
			ID:   d.ID,
			Name: d.Name,
		}
	}

	return buildings, nil
}
