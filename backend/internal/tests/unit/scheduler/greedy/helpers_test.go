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

// TestInitAvailability tests the availability initialization
func TestInitAvailability(t *testing.T) {
	room1ID := uuid.New()
	room2ID := uuid.New()

	rooms := []*models.Room{
		makeRoom(room1ID, "Room 101", "lecture"),
		makeRoom(room2ID, "Room 102", "lab"),
	}

	config := &scheduler.Config{
		OperatingHours: scheduler.TimeRange{Start: 480, End: 1260},
		OperatingDays:  []scheduler.Day{scheduler.Monday, scheduler.Wednesday, scheduler.Friday},
	}

	// We can't test private methods directly, but we can verify behavior through Generate
	sched := greedy.NewGreedyScheduler(&weight.TotalTimeWeight{})

	courseID := uuid.New()
	courses := []*models.Course{makeCourse(courseID, "Test Course")}
	sessions := []*models.CourseSession{makeSession(uuid.New(), courseID, "lecture", 60, 3)}

	output, err := sched.Generate(&scheduler.Input{
		Config:         config,
		Rooms:          rooms,
		Courses:        courses,
		CourseSessions: sessions,
	})

	require.NoError(t, err)
	require.Len(t, output.ScheduledSessions, 3)

	// Verify sessions are only scheduled on operating days (Mon=0, Wed=2, Fri=4)
	validDays := map[int]bool{0: true, 2: true, 4: true}
	for _, s := range output.ScheduledSessions {
		assert.True(t, validDays[s.Day], "Session should be on an operating day, got day %d", s.Day)
	}
}

// TestRoomsByType tests room filtering by type
func TestRoomsByType(t *testing.T) {
	lectureRoom1 := makeRoom(uuid.New(), "Lecture 1", "lecture")
	lectureRoom2 := makeRoom(uuid.New(), "Lecture 2", "lecture")
	labRoom := makeRoom(uuid.New(), "Lab 1", "lab")

	rooms := []*models.Room{lectureRoom1, labRoom, lectureRoom2}

	// Test through Generate - if we request a lecture session, only lecture rooms should be used
	courseID := uuid.New()
	courses := []*models.Course{makeCourse(courseID, "Test")}
	sessions := []*models.CourseSession{makeSession(uuid.New(), courseID, "lecture", 60, 2)}

	sched := greedy.NewGreedyScheduler(&weight.TotalTimeWeight{})
	output, err := sched.Generate(&scheduler.Input{
		Rooms:          rooms,
		Courses:        courses,
		CourseSessions: sessions,
	})

	require.NoError(t, err)
	require.Len(t, output.ScheduledSessions, 2)

	// All sessions should be in lecture rooms
	lectureRoomIDs := map[uuid.UUID]bool{lectureRoom1.ID: true, lectureRoom2.ID: true}
	for _, s := range output.ScheduledSessions {
		assert.True(t, lectureRoomIDs[s.RoomID], "Session should be in a lecture room")
	}
}

// TestFindFirstAvailableSlot_WithoutAlignment tests slot finding without alignment
func TestFindFirstAvailableSlot_WithoutAlignment(t *testing.T) {
	roomID := uuid.New()
	courseID := uuid.New()

	rooms := []*models.Room{makeRoom(roomID, "Room 101", "lecture")}
	courses := []*models.Course{makeCourse(courseID, "Test")}
	sessions := []*models.CourseSession{makeSession(uuid.New(), courseID, "lecture", 45, 1)}

	config := &scheduler.Config{
		OperatingHours:        scheduler.TimeRange{Start: 480, End: 600}, // 8AM-10AM
		OperatingDays:         []scheduler.Day{scheduler.Monday},
		PreferredSlotDuration: 0, // No alignment
	}

	sched := greedy.NewGreedyScheduler(&weight.TotalTimeWeight{})
	output, err := sched.Generate(&scheduler.Input{
		Config:         config,
		Rooms:          rooms,
		Courses:        courses,
		CourseSessions: sessions,
	})

	require.NoError(t, err)
	require.Len(t, output.ScheduledSessions, 1)

	// Should start at 480 (first available slot)
	assert.Equal(t, 480, output.ScheduledSessions[0].StartTime)
}

// TestFindFirstAvailableSlot_WithAlignment tests slot finding with alignment
func TestFindFirstAvailableSlot_WithAlignment(t *testing.T) {
	roomID := uuid.New()
	courseID := uuid.New()

	rooms := []*models.Room{makeRoom(roomID, "Room 101", "lecture")}
	courses := []*models.Course{makeCourse(courseID, "Test")}
	sessions := []*models.CourseSession{makeSession(uuid.New(), courseID, "lecture", 45, 1)}

	config := &scheduler.Config{
		OperatingHours:        scheduler.TimeRange{Start: 490, End: 600}, // 8:10AM-10AM (not on hour boundary)
		OperatingDays:         []scheduler.Day{scheduler.Monday},
		PreferredSlotDuration: 60, // Align to hourly
	}

	sched := greedy.NewGreedyScheduler(&weight.TotalTimeWeight{})
	output, err := sched.Generate(&scheduler.Input{
		Config:         config,
		Rooms:          rooms,
		Courses:        courses,
		CourseSessions: sessions,
	})

	require.NoError(t, err)
	require.Len(t, output.ScheduledSessions, 1)

	// Should align to 540 (9AM), the next hour boundary after 490
	assert.Equal(t, 540, output.ScheduledSessions[0].StartTime)
}

// TestFindFirstAvailableSlot_AlignmentFallback tests fallback when aligned slot doesn't fit
func TestFindFirstAvailableSlot_AlignmentFallback(t *testing.T) {
	roomID := uuid.New()
	courseID := uuid.New()

	rooms := []*models.Room{makeRoom(roomID, "Room 101", "lecture")}
	courses := []*models.Course{makeCourse(courseID, "Test")}
	// 50 minute session
	sessions := []*models.CourseSession{makeSession(uuid.New(), courseID, "lecture", 50, 1)}

	config := &scheduler.Config{
		OperatingHours:        scheduler.TimeRange{Start: 500, End: 580}, // 8:20AM-9:40AM
		OperatingDays:         []scheduler.Day{scheduler.Monday},
		PreferredSlotDuration: 60, // Align to hourly
	}

	sched := greedy.NewGreedyScheduler(&weight.TotalTimeWeight{})
	output, err := sched.Generate(&scheduler.Input{
		Config:         config,
		Rooms:          rooms,
		Courses:        courses,
		CourseSessions: sessions,
	})

	require.NoError(t, err)
	require.Len(t, output.ScheduledSessions, 1)

	// Aligned would be 540, but 540+50=590 > 580, so falls back to 500
	assert.Equal(t, 500, output.ScheduledSessions[0].StartTime)
}

// TestConsumeSlot_StartOfRange tests consuming a slot at the start
func TestConsumeSlot_StartOfRange(t *testing.T) {
	roomID := uuid.New()
	course1ID := uuid.New()
	course2ID := uuid.New()

	rooms := []*models.Room{makeRoom(roomID, "Room 101", "lecture")}
	courses := []*models.Course{
		makeCourse(course1ID, "Course 1"),
		makeCourse(course2ID, "Course 2"),
	}
	sessions := []*models.CourseSession{
		makeSession(uuid.New(), course1ID, "lecture", 60, 1),
		makeSession(uuid.New(), course2ID, "lecture", 60, 1),
	}

	config := &scheduler.Config{
		OperatingHours: scheduler.TimeRange{Start: 480, End: 720},
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
	require.Len(t, output.ScheduledSessions, 2)

	// First session consumes start of range, second should come after
	s1, s2 := output.ScheduledSessions[0], output.ScheduledSessions[1]
	if s1.StartTime > s2.StartTime {
		s1, s2 = s2, s1
	}

	assert.Equal(t, 480, s1.StartTime)
	assert.GreaterOrEqual(t, s2.StartTime, s1.EndTime)
}

// TestConsumeSlot_MiddleOfRange tests that consuming middle splits the range
func TestConsumeSlot_MiddleOfRange(t *testing.T) {
	roomID := uuid.New()
	course1ID := uuid.New()
	course2ID := uuid.New()
	course3ID := uuid.New()

	rooms := []*models.Room{makeRoom(roomID, "Room 101", "lecture")}
	courses := []*models.Course{
		makeCourse(course1ID, "Course 1"),
		makeCourse(course2ID, "Course 2"),
		makeCourse(course3ID, "Course 3"),
	}
	sessions := []*models.CourseSession{
		makeSession(uuid.New(), course1ID, "lecture", 60, 1),
		makeSession(uuid.New(), course2ID, "lecture", 60, 1),
		makeSession(uuid.New(), course3ID, "lecture", 60, 1),
	}

	config := &scheduler.Config{
		OperatingHours: scheduler.TimeRange{Start: 480, End: 720}, // 4 hours = 240 min for 3x60min sessions
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
	require.Len(t, output.ScheduledSessions, 3)

	// Verify no overlaps
	for i, s1 := range output.ScheduledSessions {
		for j, s2 := range output.ScheduledSessions {
			if i != j && s1.Day == s2.Day && s1.RoomID == s2.RoomID {
				assert.True(t, s1.EndTime <= s2.StartTime || s2.EndTime <= s1.StartTime,
					"Sessions should not overlap")
			}
		}
	}
}

// TestSortWeightsByDescending tests that heavier courses are scheduled first
func TestSortWeightsByDescending(t *testing.T) {
	roomID := uuid.New()
	lightCourseID := uuid.New()
	mediumCourseID := uuid.New()
	heavyCourseID := uuid.New()

	rooms := []*models.Room{makeRoom(roomID, "Room 101", "lecture")}
	courses := []*models.Course{
		makeCourse(lightCourseID, "Light"),  // weight: 30
		makeCourse(mediumCourseID, "Medium"), // weight: 120
		makeCourse(heavyCourseID, "Heavy"),  // weight: 300
	}
	sessions := []*models.CourseSession{
		makeSession(uuid.New(), lightCourseID, "lecture", 30, 1),
		makeSession(uuid.New(), mediumCourseID, "lecture", 60, 2),
		makeSession(uuid.New(), heavyCourseID, "lecture", 100, 3),
	}

	config := &scheduler.Config{
		OperatingHours: scheduler.TimeRange{Start: 480, End: 600}, // Limited: only 120 min
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

	// With only 120 minutes, only 1 heavy session (100min) can fit
	// Verify heavy course was prioritized
	heavyCount := 0
	for _, s := range output.ScheduledSessions {
		if s.CourseID == heavyCourseID {
			heavyCount++
		}
	}
	assert.Equal(t, 1, heavyCount, "Heavy course should have 1 session scheduled")
}

// TestNilRoomsHandling tests that nil rooms are handled gracefully
func TestNilRoomsHandling(t *testing.T) {
	roomID := uuid.New()
	courseID := uuid.New()

	rooms := []*models.Room{
		nil,
		makeRoom(roomID, "Room 101", "lecture"),
		nil,
	}
	courses := []*models.Course{makeCourse(courseID, "Test")}
	sessions := []*models.CourseSession{makeSession(uuid.New(), courseID, "lecture", 60, 1)}

	sched := greedy.NewGreedyScheduler(&weight.TotalTimeWeight{})
	output, err := sched.Generate(&scheduler.Input{
		Rooms:          rooms,
		Courses:        courses,
		CourseSessions: sessions,
	})

	require.NoError(t, err)
	require.Len(t, output.ScheduledSessions, 1)
	assert.Equal(t, roomID, output.ScheduledSessions[0].RoomID)
}

// TestNilCoursesHandling tests that nil courses are handled gracefully
func TestNilCoursesHandling(t *testing.T) {
	roomID := uuid.New()
	courseID := uuid.New()

	rooms := []*models.Room{makeRoom(roomID, "Room 101", "lecture")}
	courses := []*models.Course{
		nil,
		makeCourse(courseID, "Test"),
		nil,
	}
	sessions := []*models.CourseSession{makeSession(uuid.New(), courseID, "lecture", 60, 1)}

	sched := greedy.NewGreedyScheduler(&weight.TotalTimeWeight{})
	output, err := sched.Generate(&scheduler.Input{
		Rooms:          rooms,
		Courses:        courses,
		CourseSessions: sessions,
	})

	require.NoError(t, err)
	require.Len(t, output.ScheduledSessions, 1)
}

// TestNilSessionsHandling tests that nil sessions are handled gracefully
func TestNilSessionsHandling(t *testing.T) {
	roomID := uuid.New()
	courseID := uuid.New()

	rooms := []*models.Room{makeRoom(roomID, "Room 101", "lecture")}
	courses := []*models.Course{makeCourse(courseID, "Test")}
	sessions := []*models.CourseSession{
		nil,
		makeSession(uuid.New(), courseID, "lecture", 60, 1),
		nil,
	}

	sched := greedy.NewGreedyScheduler(&weight.TotalTimeWeight{})
	output, err := sched.Generate(&scheduler.Input{
		Rooms:          rooms,
		Courses:        courses,
		CourseSessions: sessions,
	})

	require.NoError(t, err)
	require.Len(t, output.ScheduledSessions, 1)
}
