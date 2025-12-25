package scheduler

import "github.com/TerrenceMurray/course-scheduler/internal/models"

// Day represents a day of the week (0 = Monday, 6 = Sunday)
type Day int

const (
	Monday Day = iota
	Tuesday
	Wednesday
	Thursday
	Friday
	Saturday
	Sunday
)

// DefaultConfig returns a standard Mon-Fri, 8AM-9PM configuration
func DefaultConfig() *Config {
	return &Config{
		OperatingHours: TimeRange{
			Start: 480,  // 8:00 AM (8 * 60)
			End:   1260, // 9:00 PM (21 * 60)
		},
		OperatingDays: []Day{Monday, Tuesday, Wednesday, Thursday, Friday},
	}
}

// Config sets the parameters for generating schedules
type Config struct {
	// OperatingHours defines when sessions can be scheduled (in minutes from midnight)
	OperatingHours TimeRange

	// OperatingDays defines which days sessions can be scheduled
	OperatingDays []Day

	// MinBreakBetweenSessions is the minimum gap between sessions (in minutes)
	// Useful for travel time between buildings, etc.
	MinBreakBetweenSessions int

	// PreferredSlotDuration helps align sessions to consistent start times (e.g., 60 = hourly slots)
	// Set to 0 to disable
	PreferredSlotDuration int
}

// Scheduler generates schedules from inputs
type Scheduler interface {
	Generate(input *Input) (*Output, error)
}

// Input contains everything needed to generate a schedule
type Input struct {
	Config         *Config
	Rooms          []*models.Room
	Courses        []*models.Course
	CourseSessions []*models.CourseSession
}

// Output contains the generated sessions
type Output struct {
	ScheduledSessions []*models.ScheduledSession
	Failures          []*FailedSession
}

// FailedSession represents a session that couldn't be scheduled
type FailedSession struct {
	CourseSession *models.CourseSession
	Reason        string
}

// TimeRange defines a time interval (in minutes from midnight)
type TimeRange struct {
	Start int // e.g., 480 = 8:00 AM
	End   int // e.g., 1260 = 9:00 PM
}

// Availability defines the availability of a room for every day of the week
// Usage: Availability[roomID][day] = []TimeRange{{Start: 480, End: 1260}, ...}
type Availability map[string]map[int][]TimeRange
