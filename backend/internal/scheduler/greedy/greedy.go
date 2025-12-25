package greedy

import (
	"slices"

	"github.com/TerrenceMurray/course-scheduler/internal/models"
	"github.com/TerrenceMurray/course-scheduler/internal/scheduler"
	"github.com/TerrenceMurray/course-scheduler/internal/scheduler/greedy/weight"
)

var _ scheduler.Scheduler = (*GreedyScheduler)(nil)

type GreedyScheduler struct {
	WeightStrategy weight.WeightStrategyInterface
}

func NewGreedyScheduler(weightStrategy weight.WeightStrategyInterface) scheduler.Scheduler {
	return &GreedyScheduler{
		WeightStrategy: weightStrategy,
	}
}

func (g *GreedyScheduler) Generate(input *scheduler.Input) (*scheduler.Output, error) {
	// Use default config if not provided
	config := input.Config
	if config == nil {
		config = scheduler.DefaultConfig()
	}

	// Initialize availability for all rooms based on config
	availability := g.initAvailability(input.Rooms, config)

	// Calculate and sort course weights (descending)
	courseWeights := g.calculateWeights(input.Courses, input.CourseSessions)
	g.sortWeightsByDescending(courseWeights)

	// Get sessions ordered by course weight
	orderedSessions := g.getSessionsByWeightedCourses(courseWeights, input.CourseSessions)

	// Track days used per course (to spread sessions across days)
	courseDaysUsed := make(map[string][]int)

	var scheduledSessions []*models.ScheduledSession
	var failedSessions []*scheduler.FailedSession

	// Schedule each session
	for _, session := range orderedSessions {
		sessionsToPlace := int(*session.NumberOfSessions)
		courseKey := session.CourseID.String()

		// Initialize days used for this course if not exists
		if _, exists := courseDaysUsed[courseKey]; !exists {
			courseDaysUsed[courseKey] = []int{}
		}

		for sessionsToPlace > 0 {
			// Sort days by availability for the required room type
			candidateDays := g.sortDaysByAvailability(availability, input.Rooms, session.RequiredRoom, config)
			sessionPlaced := false

			for _, day := range candidateDays {
				if sessionPlaced {
					break
				}

				// Try to spread sessions across different days for the same course
				// Skip this day if already used and there are enough remaining days
				if slices.Contains(courseDaysUsed[courseKey], day) && sessionsToPlace <= (5-len(courseDaysUsed[courseKey])) {
					continue
				}

				// Try each room of the required type
				for _, room := range g.roomsByType(input.Rooms, session.RequiredRoom) {
					start, found := g.findFirstAvailableSlot(availability[room.ID.String()][day], int(*session.Duration), config)

					if found {
						end := start + int(*session.Duration)

						// Consume the slot (including break time after)
						consumeEnd := end + config.MinBreakBetweenSessions
						availability[room.ID.String()][day] = g.consumeSlot(availability[room.ID.String()][day], start, consumeEnd)
						courseDaysUsed[courseKey] = append(courseDaysUsed[courseKey], day)

						// Add to scheduled sessions
						scheduledSessions = append(scheduledSessions, &models.ScheduledSession{
							CourseID:  session.CourseID,
							RoomID:    room.ID,
							Day:       day,
							StartTime: start,
							EndTime:   end,
						})

						sessionsToPlace--
						sessionPlaced = true
						break
					}
				}
			}

			// If we tried all days and couldn't place the session, mark as failed
			if !sessionPlaced {
				failedSessions = append(failedSessions, &scheduler.FailedSession{
					CourseSession: session,
					Reason:        "no available time slot found",
				})
				break
			}
		}
	}

	return &scheduler.Output{
		ScheduledSessions: scheduledSessions,
		Failures:          failedSessions,
	}, nil
}

// initAvailability creates initial availability slots for all rooms based on config
func (g *GreedyScheduler) initAvailability(rooms []*models.Room, config *scheduler.Config) scheduler.Availability {
	availability := make(scheduler.Availability)

	for _, room := range rooms {
		if room == nil {
			continue
		}

		availability[room.ID.String()] = make(map[int][]scheduler.TimeRange)

		for _, day := range config.OperatingDays {
			availability[room.ID.String()][int(day)] = []scheduler.TimeRange{config.OperatingHours}
		}
	}

	return availability
}

// calculateWeights computes the scheduling weight for each course
func (g *GreedyScheduler) calculateWeights(courses []*models.Course, sessions []*models.CourseSession) []*weight.CourseWeight {
	courseWeights := make([]*weight.CourseWeight, 0, len(courses))

	for _, course := range courses {
		if course == nil {
			continue
		}

		// Filter sessions for this course
		courseSessions := make([]*models.CourseSession, 0)
		for _, session := range sessions {
			if session != nil && session.CourseID == course.ID {
				courseSessions = append(courseSessions, session)
			}
		}

		courseWeights = append(courseWeights, &weight.CourseWeight{
			Course: course,
			Weight: g.WeightStrategy.Calculate(courseSessions),
		})
	}

	return courseWeights
}

// sortWeightsByDescending sorts course weights in descending order (highest weight first)
func (g *GreedyScheduler) sortWeightsByDescending(weights []*weight.CourseWeight) {
	slices.SortFunc(weights, func(a, b *weight.CourseWeight) int {
		return b.Weight - a.Weight
	})
}

// getSessionsByWeightedCourses returns sessions ordered by their course's weight
func (g *GreedyScheduler) getSessionsByWeightedCourses(weights []*weight.CourseWeight, sessions []*models.CourseSession) []*models.CourseSession {
	ordered := make([]*models.CourseSession, 0, len(sessions))

	for _, cw := range weights {
		for _, session := range sessions {
			if session != nil && session.CourseID == cw.Course.ID {
				ordered = append(ordered, session)
			}
		}
	}

	return ordered
}

// sortDaysByAvailability returns days sorted by total availability for a room type (descending)
func (g *GreedyScheduler) sortDaysByAvailability(availability scheduler.Availability, rooms []*models.Room, roomType string, config *scheduler.Config) []int {
	roomsOfType := g.roomsByType(rooms, roomType)

	// Convert operating days to int slice
	days := make([]int, len(config.OperatingDays))
	for i, day := range config.OperatingDays {
		days[i] = int(day)
	}

	slices.SortFunc(days, func(a, b int) int {
		availA := g.getTotalAvailability(availability, roomsOfType, a)
		availB := g.getTotalAvailability(availability, roomsOfType, b)
		// Sort descending (most availability first)
		return availB - availA
	})

	return days
}

// roomsByType filters rooms by their type
func (g *GreedyScheduler) roomsByType(rooms []*models.Room, roomType string) []*models.Room {
	result := make([]*models.Room, 0)

	for _, room := range rooms {
		if room != nil && room.Type == roomType {
			result = append(result, room)
		}
	}

	return result
}

// getTotalAvailability calculates total available minutes for rooms on a given day
func (g *GreedyScheduler) getTotalAvailability(availability scheduler.Availability, rooms []*models.Room, day int) int {
	total := 0

	for _, room := range rooms {
		if room == nil {
			continue
		}

		roomAvail, exists := availability[room.ID.String()]
		if !exists {
			continue
		}

		dayRanges, exists := roomAvail[day]
		if !exists {
			continue
		}

		for _, timeRange := range dayRanges {
			total += timeRange.End - timeRange.Start
		}
	}

	return total
}

// findFirstAvailableSlot finds the first time slot that can fit the requested duration
// If PreferredSlotDuration is set, it aligns the start time to slot boundaries
func (g *GreedyScheduler) findFirstAvailableSlot(ranges []scheduler.TimeRange, duration int, config *scheduler.Config) (start int, found bool) {
	for _, r := range ranges {
		candidateStart := r.Start

		// Align to preferred slot boundaries if configured
		if config.PreferredSlotDuration > 0 {
			// Round up to the next slot boundary
			remainder := candidateStart % config.PreferredSlotDuration
			if remainder != 0 {
				candidateStart += config.PreferredSlotDuration - remainder
			}
		}

		// Check if the aligned slot still fits within this range
		if candidateStart+duration <= r.End {
			return candidateStart, true
		}

		// If alignment pushed us out, try the original start as fallback
		if config.PreferredSlotDuration > 0 && r.End-r.Start >= duration {
			return r.Start, true
		}
	}
	return 0, false
}

// consumeSlot removes a time slot from availability, splitting ranges as needed
func (g *GreedyScheduler) consumeSlot(ranges []scheduler.TimeRange, start, end int) []scheduler.TimeRange {
	result := make([]scheduler.TimeRange, 0)

	for _, r := range ranges {
		// Range is completely before or after the consumed slot
		if r.End <= start || r.Start >= end {
			result = append(result, r)
		} else {
			// Range overlaps with consumed slot - split it
			if r.Start < start {
				result = append(result, scheduler.TimeRange{Start: r.Start, End: start})
			}
			if r.End > end {
				result = append(result, scheduler.TimeRange{Start: end, End: r.End})
			}
		}
	}

	return result
}
