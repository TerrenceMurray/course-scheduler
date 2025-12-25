package greedy_test

import (
	"testing"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"github.com/TerrenceMurray/course-scheduler/internal/models"
	"github.com/TerrenceMurray/course-scheduler/internal/scheduler"
	"github.com/TerrenceMurray/course-scheduler/internal/scheduler/greedy"
	"github.com/TerrenceMurray/course-scheduler/internal/scheduler/greedy/weight"
)

// Test helpers
func ptr[T any](v T) *T { return &v }

func makeRoom(id uuid.UUID, name, roomType string) *models.Room {
	return models.NewRoom(id, name, roomType, uuid.New(), 30, nil, nil)
}

func makeCourse(id uuid.UUID, name string) *models.Course {
	return models.NewCourse(id, name, nil, nil)
}

func makeSession(id, courseID uuid.UUID, roomType string, duration, numSessions int32) *models.CourseSession {
	return models.NewCourseSession(id, courseID, roomType, "lecture", ptr(duration), ptr(numSessions), nil, nil)
}

// TestGenerate_SingleSession_Success tests scheduling a single session
func TestGenerate_SingleSession_Success(t *testing.T) {
	roomID := uuid.New()
	courseID := uuid.New()

	rooms := []*models.Room{makeRoom(roomID, "Room 101", "lecture")}
	courses := []*models.Course{makeCourse(courseID, "Math 101")}
	sessions := []*models.CourseSession{makeSession(uuid.New(), courseID, "lecture", 60, 1)}

	sched := greedy.NewGreedyScheduler(&weight.TotalTimeWeight{})
	output, err := sched.Generate(&scheduler.Input{
		Rooms:          rooms,
		Courses:        courses,
		CourseSessions: sessions,
	})

	require.NoError(t, err)
	require.Len(t, output.ScheduledSessions, 1)
	assert.Empty(t, output.Failures)

	scheduled := output.ScheduledSessions[0]
	assert.Equal(t, courseID, scheduled.CourseID)
	assert.Equal(t, roomID, scheduled.RoomID)
	assert.Equal(t, 60, scheduled.EndTime-scheduled.StartTime)
}

// TestGenerate_MultipleSessions_SpreadAcrossDays tests that sessions are spread across days
func TestGenerate_MultipleSessions_SpreadAcrossDays(t *testing.T) {
	roomID := uuid.New()
	courseID := uuid.New()

	rooms := []*models.Room{makeRoom(roomID, "Room 101", "lecture")}
	courses := []*models.Course{makeCourse(courseID, "Math 101")}
	sessions := []*models.CourseSession{makeSession(uuid.New(), courseID, "lecture", 60, 3)}

	sched := greedy.NewGreedyScheduler(&weight.TotalTimeWeight{})
	output, err := sched.Generate(&scheduler.Input{
		Rooms:          rooms,
		Courses:        courses,
		CourseSessions: sessions,
	})

	require.NoError(t, err)
	require.Len(t, output.ScheduledSessions, 3)
	assert.Empty(t, output.Failures)

	// Verify sessions are on different days
	days := make(map[int]bool)
	for _, s := range output.ScheduledSessions {
		days[s.Day] = true
	}
	assert.Len(t, days, 3, "Sessions should be spread across 3 different days")
}

// TestGenerate_NoAvailableSlot_Failure tests failure when no slot is available
func TestGenerate_NoAvailableSlot_Failure(t *testing.T) {
	roomID := uuid.New()
	courseID := uuid.New()

	rooms := []*models.Room{makeRoom(roomID, "Room 101", "lecture")}
	courses := []*models.Course{makeCourse(courseID, "Math 101")}
	// Request more time than available: 5 days × 13 hours = 3900 minutes
	// Request 6 sessions × 800 minutes = 4800 minutes (exceeds capacity)
	sessions := []*models.CourseSession{makeSession(uuid.New(), courseID, "lecture", 800, 6)}

	sched := greedy.NewGreedyScheduler(&weight.TotalTimeWeight{})
	output, err := sched.Generate(&scheduler.Input{
		Rooms:          rooms,
		Courses:        courses,
		CourseSessions: sessions,
	})

	require.NoError(t, err)
	assert.NotEmpty(t, output.Failures)
	assert.Contains(t, output.Failures[0].Reason, "no available time slot found")
}

// TestGenerate_MultipleRoomTypes tests sessions are assigned to correct room types
func TestGenerate_MultipleRoomTypes(t *testing.T) {
	lectureRoomID := uuid.New()
	labRoomID := uuid.New()
	courseID := uuid.New()

	rooms := []*models.Room{
		makeRoom(lectureRoomID, "Lecture Hall", "lecture"),
		makeRoom(labRoomID, "Computer Lab", "lab"),
	}
	courses := []*models.Course{makeCourse(courseID, "CS 101")}

	lectureSession := makeSession(uuid.New(), courseID, "lecture", 60, 1)
	labSession := models.NewCourseSession(uuid.New(), courseID, "lab", "lab", ptr(int32(90)), ptr(int32(1)), nil, nil)

	sched := greedy.NewGreedyScheduler(&weight.TotalTimeWeight{})
	output, err := sched.Generate(&scheduler.Input{
		Rooms:          rooms,
		Courses:        courses,
		CourseSessions: []*models.CourseSession{lectureSession, labSession},
	})

	require.NoError(t, err)
	require.Len(t, output.ScheduledSessions, 2)
	assert.Empty(t, output.Failures)

	// Verify each session is in the correct room type
	for _, s := range output.ScheduledSessions {
		if s.EndTime-s.StartTime == 60 {
			assert.Equal(t, lectureRoomID, s.RoomID, "Lecture session should be in lecture room")
		} else {
			assert.Equal(t, labRoomID, s.RoomID, "Lab session should be in lab room")
		}
	}
}

// TestGenerate_WithMinBreakBetweenSessions tests minimum break between sessions
func TestGenerate_WithMinBreakBetweenSessions(t *testing.T) {
	roomID := uuid.New()
	course1ID := uuid.New()
	course2ID := uuid.New()

	rooms := []*models.Room{makeRoom(roomID, "Room 101", "lecture")}
	courses := []*models.Course{
		makeCourse(course1ID, "Math 101"),
		makeCourse(course2ID, "Physics 101"),
	}
	sessions := []*models.CourseSession{
		makeSession(uuid.New(), course1ID, "lecture", 60, 1),
		makeSession(uuid.New(), course2ID, "lecture", 60, 1),
	}

	config := &scheduler.Config{
		OperatingHours:          scheduler.TimeRange{Start: 480, End: 720}, // 8AM-12PM (4 hours)
		OperatingDays:           []scheduler.Day{scheduler.Monday},
		MinBreakBetweenSessions: 15,
	}

	sched := greedy.NewGreedyScheduler(&weight.TotalTimeWeight{})
	output, err := sched.Generate(&scheduler.Input{
		Config:         config,
		Rooms:          rooms,
		Courses:        courses,
		CourseSessions: sessions,
	})

	require.NoError(t, err)
	require.Len(t, output.ScheduledSessions, 2)

	// Sort by start time to check gap
	s1, s2 := output.ScheduledSessions[0], output.ScheduledSessions[1]
	if s1.StartTime > s2.StartTime {
		s1, s2 = s2, s1
	}

	gap := s2.StartTime - s1.EndTime
	assert.GreaterOrEqual(t, gap, 15, "Gap between sessions should be at least 15 minutes")
}

// TestGenerate_WithPreferredSlotDuration tests slot alignment
func TestGenerate_WithPreferredSlotDuration(t *testing.T) {
	roomID := uuid.New()
	courseID := uuid.New()

	rooms := []*models.Room{makeRoom(roomID, "Room 101", "lecture")}
	courses := []*models.Course{makeCourse(courseID, "Math 101")}
	sessions := []*models.CourseSession{makeSession(uuid.New(), courseID, "lecture", 45, 3)}

	config := &scheduler.Config{
		OperatingHours:        scheduler.TimeRange{Start: 480, End: 1260}, // 8AM-9PM
		OperatingDays:         []scheduler.Day{scheduler.Monday, scheduler.Tuesday, scheduler.Wednesday},
		PreferredSlotDuration: 60, // Align to hourly slots
	}

	sched := greedy.NewGreedyScheduler(&weight.TotalTimeWeight{})
	output, err := sched.Generate(&scheduler.Input{
		Config:         config,
		Rooms:          rooms,
		Courses:        courses,
		CourseSessions: sessions,
	})

	require.NoError(t, err)
	require.Len(t, output.ScheduledSessions, 3)

	// Verify all sessions start on hour boundaries
	for _, s := range output.ScheduledSessions {
		assert.Equal(t, 0, s.StartTime%60, "Session should start on hour boundary, got start time %d", s.StartTime)
	}
}

// TestGenerate_DefaultConfig tests that nil config uses default
func TestGenerate_DefaultConfig(t *testing.T) {
	roomID := uuid.New()
	courseID := uuid.New()

	rooms := []*models.Room{makeRoom(roomID, "Room 101", "lecture")}
	courses := []*models.Course{makeCourse(courseID, "Math 101")}
	sessions := []*models.CourseSession{makeSession(uuid.New(), courseID, "lecture", 60, 1)}

	sched := greedy.NewGreedyScheduler(&weight.TotalTimeWeight{})
	output, err := sched.Generate(&scheduler.Input{
		Config:         nil, // Should use default
		Rooms:          rooms,
		Courses:        courses,
		CourseSessions: sessions,
	})

	require.NoError(t, err)
	require.Len(t, output.ScheduledSessions, 1)

	scheduled := output.ScheduledSessions[0]
	// Default config has operating hours 8AM (480) to 9PM (1260)
	assert.GreaterOrEqual(t, scheduled.StartTime, 480)
	assert.LessOrEqual(t, scheduled.EndTime, 1260)
	// Default config has Mon-Fri (days 0-4)
	assert.GreaterOrEqual(t, scheduled.Day, 0)
	assert.LessOrEqual(t, scheduled.Day, 4)
}

// TestGenerate_EmptyInput tests handling of empty input
func TestGenerate_EmptyInput(t *testing.T) {
	sched := greedy.NewGreedyScheduler(&weight.TotalTimeWeight{})
	output, err := sched.Generate(&scheduler.Input{
		Rooms:          []*models.Room{},
		Courses:        []*models.Course{},
		CourseSessions: []*models.CourseSession{},
	})

	require.NoError(t, err)
	assert.Empty(t, output.ScheduledSessions)
	assert.Empty(t, output.Failures)
}

// TestGenerate_HigherWeightCoursesScheduledFirst tests course prioritization
func TestGenerate_HigherWeightCoursesScheduledFirst(t *testing.T) {
	roomID := uuid.New()
	lightCourseID := uuid.New()
	heavyCourseID := uuid.New()

	rooms := []*models.Room{makeRoom(roomID, "Room 101", "lecture")}
	courses := []*models.Course{
		makeCourse(lightCourseID, "Light Course"), // 1 session × 30 min = weight 30
		makeCourse(heavyCourseID, "Heavy Course"), // 3 sessions × 60 min = weight 180
	}
	sessions := []*models.CourseSession{
		makeSession(uuid.New(), lightCourseID, "lecture", 30, 1),
		makeSession(uuid.New(), heavyCourseID, "lecture", 60, 3),
	}

	config := &scheduler.Config{
		OperatingHours: scheduler.TimeRange{Start: 480, End: 600}, // 8AM-10AM (120 min)
		OperatingDays:  []scheduler.Day{scheduler.Monday},
	}

	sched := greedy.NewGreedyScheduler(&weight.TotalTimeWeight{})
	output, err := sched.Generate(&scheduler.Input{
		Config:         config,
		Rooms:          rooms,
		Courses:        courses,
		CourseSessions: sessions,
	})

	require.NoError(t, err)

	// With limited capacity, the heavy course should be scheduled first
	// Only 120 minutes available, heavy course needs 180 minutes
	// So we should have at least 1 heavy course session scheduled
	heavyScheduled := 0
	for _, s := range output.ScheduledSessions {
		if s.CourseID == heavyCourseID {
			heavyScheduled++
		}
	}
	assert.GreaterOrEqual(t, heavyScheduled, 1, "Heavy course should be prioritized")
}

// TestGenerate_NoMatchingRoomType tests failure when required room type doesn't exist
func TestGenerate_NoMatchingRoomType(t *testing.T) {
	roomID := uuid.New()
	courseID := uuid.New()

	rooms := []*models.Room{makeRoom(roomID, "Lecture Hall", "lecture")}
	courses := []*models.Course{makeCourse(courseID, "Chemistry 101")}
	sessions := []*models.CourseSession{makeSession(uuid.New(), courseID, "chemistry_lab", 60, 1)} // No chemistry_lab room

	sched := greedy.NewGreedyScheduler(&weight.TotalTimeWeight{})
	output, err := sched.Generate(&scheduler.Input{
		Rooms:          rooms,
		Courses:        courses,
		CourseSessions: sessions,
	})

	require.NoError(t, err)
	assert.Empty(t, output.ScheduledSessions)
	assert.NotEmpty(t, output.Failures)
}
