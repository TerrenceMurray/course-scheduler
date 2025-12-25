package weight

import (
	"github.com/TerrenceMurray/course-scheduler/internal/models"
)

var _ WeightStrategyInterface = (*TotalTimeWeight)(nil)

type TotalTimeWeight struct{}

func (w *TotalTimeWeight) Calculate(sessions []*models.CourseSession) int {
	var totalWeight = 0

	for _, session := range sessions {
		totalWeight += int(*session.Duration) * int(*session.NumberOfSessions)
	}

	return totalWeight
}
