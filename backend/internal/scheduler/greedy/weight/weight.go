package weight

import "github.com/TerrenceMurray/course-scheduler/internal/models"

// Weight defines the interface for the weight calculation strategy
type WeightStrategyInterface interface {
	Calculate(sessions []*models.CourseSession) int
}

// CourseWeights are calculated based on the course and it's sessions
type CourseWeight struct {
	Course *models.Course
	Weight int
}
