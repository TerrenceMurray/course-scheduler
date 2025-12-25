package weight_test

import (
	"testing"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"

	"github.com/TerrenceMurray/course-scheduler/internal/models"
	"github.com/TerrenceMurray/course-scheduler/internal/scheduler/greedy/weight"
)

func ptr[T any](v T) *T { return &v }

func makeSession(courseID uuid.UUID, duration, numSessions int32) *models.CourseSession {
	return models.NewCourseSession(uuid.New(), courseID, "lecture", "lecture", ptr(duration), ptr(numSessions), nil, nil)
}

func TestTotalTimeWeight_Calculate_SingleSession(t *testing.T) {
	w := &weight.TotalTimeWeight{}
	courseID := uuid.New()

	sessions := []*models.CourseSession{
		makeSession(courseID, 60, 2), // 60 * 2 = 120
	}

	result := w.Calculate(sessions)
	assert.Equal(t, 120, result)
}

func TestTotalTimeWeight_Calculate_MultipleSessions(t *testing.T) {
	w := &weight.TotalTimeWeight{}
	courseID := uuid.New()

	sessions := []*models.CourseSession{
		makeSession(courseID, 60, 2),  // 60 * 2 = 120
		makeSession(courseID, 90, 1),  // 90 * 1 = 90
		makeSession(courseID, 45, 3),  // 45 * 3 = 135
	}

	result := w.Calculate(sessions)
	assert.Equal(t, 345, result) // 120 + 90 + 135
}

func TestTotalTimeWeight_Calculate_EmptySessions(t *testing.T) {
	w := &weight.TotalTimeWeight{}

	sessions := []*models.CourseSession{}

	result := w.Calculate(sessions)
	assert.Equal(t, 0, result)
}

func TestTotalTimeWeight_Calculate_ZeroDuration(t *testing.T) {
	w := &weight.TotalTimeWeight{}
	courseID := uuid.New()

	// Edge case: session with 0 duration (though invalid, shouldn't panic)
	sessions := []*models.CourseSession{
		makeSession(courseID, 0, 5), // 0 * 5 = 0
	}

	result := w.Calculate(sessions)
	assert.Equal(t, 0, result)
}

func TestTotalTimeWeight_Calculate_LargeValues(t *testing.T) {
	w := &weight.TotalTimeWeight{}
	courseID := uuid.New()

	sessions := []*models.CourseSession{
		makeSession(courseID, 180, 5),   // 180 * 5 = 900
		makeSession(courseID, 120, 10),  // 120 * 10 = 1200
	}

	result := w.Calculate(sessions)
	assert.Equal(t, 2100, result)
}

func TestTotalTimeWeight_ImplementsInterface(t *testing.T) {
	// Verify TotalTimeWeight implements WeightStrategyInterface
	var _ weight.WeightStrategyInterface = (*weight.TotalTimeWeight)(nil)
}
