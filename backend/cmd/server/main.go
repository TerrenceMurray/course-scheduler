package main

import (
	"fmt"
	"slices"
	"time"

	"github.com/google/uuid"
)

type Room struct {
	ID        uuid.UUID `json:"id"`
	Name      string    `json:"name"`
	Type      string    `json:"type"`
	Category  string    `json:"category,omitempty"`
	Building  string    `json:"building"`
	Capacity  uint      `json:"capacity"`
	CreatedAt time.Time `json:"created_at"`
}

type Course struct {
	ID    uuid.UUID
	Title string
}

type CourseWeight struct {
	CourseID uuid.UUID
	Weight   uint
}

type Session struct {
	ID               uuid.UUID
	CourseID         uuid.UUID
	Type             string // (lab, tutorial, lecture)
	Duration         uint   // in minutes
	RequiredRoom     string // (chemistry_lab, computer_lab, lecture_room)
	NumberOfSessions uint
}

type ScheduledSession struct {
	CourseID  uuid.UUID
	RoomID    uuid.UUID
	DayOfWeek uint
	StartTime string
	EndTime   string
}

type TimeRange struct {
	Start uint
	End   uint
}

// Availability[room id][day of the week (0-6)] = [(int, int), ..., (int, int)]
type Availability map[string]map[int][]TimeRange

type RoomsByType map[string][]int

func main() {
	var scheduledSessions []ScheduledSession = []ScheduledSession{}
	var failedSessions []Session = []Session{}

	var rooms []Room = []Room{
		{
			ID:        uuid.New(),
			Name:      "FST 113",
			Type:      "lecture_room",
			Building:  "Natural Science Building",
			Capacity:  150,
			CreatedAt: time.Now(),
		},
		{
			ID:        uuid.New(),
			Name:      "CLT 201",
			Type:      "computer_lab",
			Building:  "Computing Building",
			Capacity:  30,
			CreatedAt: time.Now(),
		},
		{
			ID:        uuid.New(),
			Name:      "CHM 105",
			Type:      "chemistry_lab",
			Building:  "Natural Science Building",
			Capacity:  25,
			CreatedAt: time.Now(),
		},
		{
			ID:        uuid.New(),
			Name:      "ENG 302",
			Type:      "tutorial_room",
			Building:  "Engineering Building",
			Capacity:  40,
			CreatedAt: time.Now(),
		},
		{
			ID:        uuid.New(),
			Name:      "LIB 001",
			Type:      "lecture_room",
			Building:  "Library Building",
			Capacity:  200,
			CreatedAt: time.Now(),
		},
		// Additional rooms for increased capacity
		{
			ID:        uuid.New(),
			Name:      "SCI 201",
			Type:      "lecture_room",
			Building:  "Science Building",
			Capacity:  120,
			CreatedAt: time.Now(),
		},
		{
			ID:        uuid.New(),
			Name:      "CLT 305",
			Type:      "computer_lab",
			Building:  "Computing Building",
			Capacity:  35,
			CreatedAt: time.Now(),
		},
		{
			ID:        uuid.New(),
			Name:      "BIO 102",
			Type:      "biology_lab",
			Building:  "Natural Science Building",
			Capacity:  24,
			CreatedAt: time.Now(),
		},
		{
			ID:        uuid.New(),
			Name:      "HUM 405",
			Type:      "tutorial_room",
			Building:  "Humanities Building",
			Capacity:  35,
			CreatedAt: time.Now(),
		},
	}

	var courses []Course = []Course{
		{ID: uuid.New(), Title: "Introduction to Computer Science"},
		{ID: uuid.New(), Title: "Organic Chemistry"},
		{ID: uuid.New(), Title: "Calculus I"},
		{ID: uuid.New(), Title: "Data Structures"},
		{ID: uuid.New(), Title: "Physics 101"},
		// Additional courses
		{ID: uuid.New(), Title: "Biology 101"},
		{ID: uuid.New(), Title: "English Literature"},
		{ID: uuid.New(), Title: "Linear Algebra"},
		{ID: uuid.New(), Title: "Microeconomics"},
		{ID: uuid.New(), Title: "Introduction to Psychology"},
		{ID: uuid.New(), Title: "World History"},
		{ID: uuid.New(), Title: "Programming in Python"},
	}

	var sessions []Session = []Session{
		{
			ID:               uuid.New(),
			CourseID:         courses[0].ID,
			Type:             "lecture",
			Duration:         60,
			RequiredRoom:     "lecture_room",
			NumberOfSessions: 2,
		},
		{
			ID:               uuid.New(),
			CourseID:         courses[0].ID,
			Type:             "lab",
			Duration:         120,
			RequiredRoom:     "computer_lab",
			NumberOfSessions: 1,
		},
		{
			ID:               uuid.New(),
			CourseID:         courses[1].ID,
			Type:             "lecture",
			Duration:         60,
			RequiredRoom:     "lecture_room",
			NumberOfSessions: 2,
		},
		{
			ID:               uuid.New(),
			CourseID:         courses[1].ID,
			Type:             "lab",
			Duration:         90,
			RequiredRoom:     "chemistry_lab",
			NumberOfSessions: 1,
		},
		{
			ID:               uuid.New(),
			CourseID:         courses[2].ID,
			Type:             "lecture",
			Duration:         90,
			RequiredRoom:     "lecture_room",
			NumberOfSessions: 3,
		},
		{
			ID:               uuid.New(),
			CourseID:         courses[2].ID,
			Type:             "tutorial",
			Duration:         45,
			RequiredRoom:     "tutorial_room",
			NumberOfSessions: 2,
		},
		{
			ID:               uuid.New(),
			CourseID:         courses[3].ID,
			Type:             "lecture",
			Duration:         60,
			RequiredRoom:     "lecture_room",
			NumberOfSessions: 2,
		},
		{
			ID:               uuid.New(),
			CourseID:         courses[3].ID,
			Type:             "lab",
			Duration:         120,
			RequiredRoom:     "computer_lab",
			NumberOfSessions: 1,
		},
		{
			ID:               uuid.New(),
			CourseID:         courses[4].ID,
			Type:             "lecture",
			Duration:         90,
			RequiredRoom:     "lecture_room",
			NumberOfSessions: 2,
		},
		// Biology 101 - lectures + biology lab
		{
			ID:               uuid.New(),
			CourseID:         courses[5].ID,
			Type:             "lecture",
			Duration:         60,
			RequiredRoom:     "lecture_room",
			NumberOfSessions: 3,
		},
		{
			ID:               uuid.New(),
			CourseID:         courses[5].ID,
			Type:             "lab",
			Duration:         120,
			RequiredRoom:     "biology_lab",
			NumberOfSessions: 1,
		},
		// English Literature - lectures + tutorial
		{
			ID:               uuid.New(),
			CourseID:         courses[6].ID,
			Type:             "lecture",
			Duration:         75,
			RequiredRoom:     "lecture_room",
			NumberOfSessions: 2,
		},
		{
			ID:               uuid.New(),
			CourseID:         courses[6].ID,
			Type:             "tutorial",
			Duration:         60,
			RequiredRoom:     "tutorial_room",
			NumberOfSessions: 1,
		},
		// Linear Algebra - lectures + tutorial
		{
			ID:               uuid.New(),
			CourseID:         courses[7].ID,
			Type:             "lecture",
			Duration:         90,
			RequiredRoom:     "lecture_room",
			NumberOfSessions: 2,
		},
		{
			ID:               uuid.New(),
			CourseID:         courses[7].ID,
			Type:             "tutorial",
			Duration:         45,
			RequiredRoom:     "tutorial_room",
			NumberOfSessions: 2,
		},
		// Microeconomics - lectures only
		{
			ID:               uuid.New(),
			CourseID:         courses[8].ID,
			Type:             "lecture",
			Duration:         90,
			RequiredRoom:     "lecture_room",
			NumberOfSessions: 3,
		},
		// Introduction to Psychology - lectures + lab
		{
			ID:               uuid.New(),
			CourseID:         courses[9].ID,
			Type:             "lecture",
			Duration:         60,
			RequiredRoom:     "lecture_room",
			NumberOfSessions: 2,
		},
		{
			ID:               uuid.New(),
			CourseID:         courses[9].ID,
			Type:             "lab",
			Duration:         90,
			RequiredRoom:     "computer_lab",
			NumberOfSessions: 1,
		},
		// World History - lectures + tutorial
		{
			ID:               uuid.New(),
			CourseID:         courses[10].ID,
			Type:             "lecture",
			Duration:         75,
			RequiredRoom:     "lecture_room",
			NumberOfSessions: 2,
		},
		{
			ID:               uuid.New(),
			CourseID:         courses[10].ID,
			Type:             "tutorial",
			Duration:         45,
			RequiredRoom:     "tutorial_room",
			NumberOfSessions: 1,
		},
		// Programming in Python - lectures + computer lab
		{
			ID:               uuid.New(),
			CourseID:         courses[11].ID,
			Type:             "lecture",
			Duration:         60,
			RequiredRoom:     "lecture_room",
			NumberOfSessions: 2,
		},
		{
			ID:               uuid.New(),
			CourseID:         courses[11].ID,
			Type:             "lab",
			Duration:         120,
			RequiredRoom:     "computer_lab",
			NumberOfSessions: 2,
		},
	}

	avail := initAvailability(rooms)
	courseWeights := initWeights(courses, sessions)

	// 1. Sort course weights (desc)
	sortWeightedCourses(courseWeights)

	// 2. Get sessions ordered by course weight
	orderedSessions := getSessionsByWeightedCourses(courseWeights, sessions)

	// Track days used per course (across all session types)
	courseDaysUsed := make(map[string][]int)

	// 3. Schedule each session
	for _, session := range orderedSessions {
		sessionsToPlace := session.NumberOfSessions
		courseKey := session.CourseID.String()

		// Initialize if not exists
		if _, exists := courseDaysUsed[courseKey]; !exists {
			courseDaysUsed[courseKey] = []int{}
		}

		for sessionsToPlace > 0 {
			candidateDays := sortDaysByAvailabilityAndRoom(avail, rooms, session.RequiredRoom)
			sessionPlaced := false

			for _, day := range candidateDays {
				if sessionPlaced {
					break
				}

				// Try to spread sessions across different days for the same course
				if slices.Contains(courseDaysUsed[courseKey], day) && int(sessionsToPlace) <= (5-len(courseDaysUsed[courseKey])) {
					continue
				}

				for _, room := range roomsByType(rooms, session.RequiredRoom) {
					start, found := findFirstAvailableSlot(avail[room.ID.String()][day], int(session.Duration))

					if found {
						end := start + int(session.Duration)
						avail[room.ID.String()][day] = consumeSlot(avail[room.ID.String()][day], start, end)
						courseDaysUsed[courseKey] = append(courseDaysUsed[courseKey], day)

						scheduledSessions = append(scheduledSessions, ScheduledSession{
							CourseID:  session.CourseID,
							RoomID:    room.ID,
							DayOfWeek: uint(day),
							StartTime: minsToTime(start),
							EndTime:   minsToTime(end),
						})

						sessionsToPlace--
						sessionPlaced = true
						break
					}
				}
			}

			// If we tried all days and couldn't place the session, mark as failed
			if !sessionPlaced {
				failedSessions = append(failedSessions, session)
				break
			}
		}
	}

	printCalendar(scheduledSessions, courses, rooms)

	if len(failedSessions) > 0 {
		fmt.Println("\n⚠️  Failed to schedule:")
		for _, s := range failedSessions {
			course := findCourse(courses, s.CourseID)
			fmt.Printf("  - %s (%s, %d min)\n", course.Title, s.Type, s.Duration)
		}
	}
}

func findCourse(courses []Course, id uuid.UUID) Course {
	for _, c := range courses {
		if c.ID == id {
			return c
		}
	}
	return Course{}
}

func findRoom(rooms []Room, id uuid.UUID) Room {
	for _, r := range rooms {
		if r.ID == id {
			return r
		}
	}
	return Room{}
}

func printCalendar(scheduled []ScheduledSession, courses []Course, rooms []Room) {
	days := []string{"Monday", "Tuesday", "Wednesday", "Thursday", "Friday"}

	fmt.Println("\n" + "═" + repeatStr("═", 90))
	fmt.Println("  WEEKLY SCHEDULE")
	fmt.Println("═" + repeatStr("═", 90))

	for dayIdx, dayName := range days {
		daySessions := []ScheduledSession{}
		for _, s := range scheduled {
			if s.DayOfWeek == uint(dayIdx) {
				daySessions = append(daySessions, s)
			}
		}

		// Sort by start time
		slices.SortFunc(daySessions, func(a, b ScheduledSession) int {
			if a.StartTime < b.StartTime {
				return -1
			}
			if a.StartTime > b.StartTime {
				return 1
			}
			return 0
		})

		fmt.Printf("\n📅 %s\n", dayName)
		fmt.Println(repeatStr("-", 50))

		if len(daySessions) == 0 {
			fmt.Println("   (no sessions)")
		} else {
			for _, s := range daySessions {
				course := findCourse(courses, s.CourseID)
				room := findRoom(rooms, s.RoomID)
				fmt.Printf("   %s - %s  │  %-30s  │  %s\n",
					s.StartTime, s.EndTime, course.Title, room.Name)
			}
		}
	}

	fmt.Println("\n" + "═" + repeatStr("═", 90))
	fmt.Printf("Total sessions scheduled: %d\n", len(scheduled))
}

func repeatStr(s string, n int) string {
	result := ""
	for i := 0; i < n; i++ {
		result += s
	}
	return result
}

func findFirstAvailableSlot(ranges []TimeRange, duration int) (start int, found bool) {
	for _, r := range ranges {
		if r.End-r.Start >= uint(duration) {
			return int(r.Start), true
		}
	}
	return 0, false
}

func consumeSlot(ranges []TimeRange, start, end int) []TimeRange {
	var result []TimeRange
	for _, r := range ranges {
		if r.End <= uint(start) || r.Start >= uint(end) {
			result = append(result, r)
		} else {
			if r.Start < uint(start) {
				result = append(result, TimeRange{r.Start, uint(start)})
			}

			if r.End > uint(end) {
				result = append(result, TimeRange{uint(end), r.End})
			}
		}
	}
	return result
}

func initAvailability(rooms []Room) Availability {
	availability := make(Availability)
	for _, room := range rooms {
		availability[room.ID.String()] = make(map[int][]TimeRange)
		for day := 0; day < 5; day++ {
			// 08:00 (480 mins) to 21:00 (1260 mins)
			availability[room.ID.String()][day] = []TimeRange{{Start: 480, End: 1260}}
		}
	}

	return availability
}

func initWeights(courses []Course, sessions []Session) []CourseWeight {
	weights := make([]CourseWeight, len(courses))

	for i, course := range courses {
		weights[i] = CourseWeight{
			CourseID: course.ID,
			Weight:   calculateSessionWeight(course.ID, sessions),
		}
	}

	return weights
}

func calculateSessionWeight(courseID uuid.UUID, sessions []Session) uint {
	var weight uint = 0

	for _, session := range sessions {
		if session.CourseID != courseID {
			continue
		}

		weight += session.Duration * session.NumberOfSessions
	}

	return weight
}

func sortWeightedCourses(wc []CourseWeight) {
	slices.SortFunc(wc, func(a, b CourseWeight) int {
		return int(b.Weight) - int(a.Weight)
	})
}

func getSessionsByWeightedCourses(weights []CourseWeight, sessions []Session) []Session {
	var ordered []Session

	for _, cw := range weights {
		for _, session := range sessions {
			if session.CourseID == cw.CourseID {
				ordered = append(ordered, session)
			}
		}
	}

	return ordered
}

func sortDaysByAvailabilityAndRoom(avail Availability, rooms []Room, roomType string) []int {
	roomsOfType := roomsByType(rooms, roomType)

	days := []int{0, 1, 2, 3, 4}
	slices.SortFunc(days, func(a, b int) int {
		availA := getTotalAvailability(avail, roomsOfType, a)
		availB := getTotalAvailability(avail, roomsOfType, b)
		// Sort descending (most availability first)
		return int(availB) - int(availA)
	})

	return days
}

func roomsByType(rooms []Room, roomType string) []Room {
	roomsOfType := []Room{}

	for _, room := range rooms {
		if room.Type == roomType {
			roomsOfType = append(roomsOfType, room)
		}
	}
	return roomsOfType
}

func getTotalAvailability(avail Availability, rooms []Room, day int) uint {
	var total uint = 0

	for _, room := range rooms {
		roomAvail, exists := avail[room.ID.String()]
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

// Helper: convert minutes to "HH:MM" string
func minsToTime(mins int) string {
	return fmt.Sprintf("%02d:%02d", mins/60, mins%60)
}