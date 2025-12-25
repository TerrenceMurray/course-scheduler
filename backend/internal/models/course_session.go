package models

import (
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"
)

var validSessionTypes = map[string]bool{
	"lecture":  true,
	"lab":      true,
	"tutorial": true,
}

type CourseSession struct {
	ID               uuid.UUID  `json:"id"`
	CourseID         uuid.UUID  `json:"course_id"`
	RequiredRoom     string     `json:"required_room"`
	Type             string     `json:"type"` // enum.course_session_type
	Duration         *int32     `json:"duration"`
	NumberOfSessions *int32     `json:"number_of_sessions"`
	CreatedAt        *time.Time `json:"created_at,omitempty"`
	UpdatedAt        *time.Time `json:"updated_at,omitempty"`
}

func NewCourseSession(
	id uuid.UUID,
	courseID uuid.UUID,
	requiredRoom string,
	sessionType string,
	duration *int32,
	numberOfSessions *int32,
	createdAt *time.Time,
	updatedAt *time.Time,
) *CourseSession {
	return &CourseSession{
		ID:               id,
		CourseID:         courseID,
		RequiredRoom:     requiredRoom,
		Type:             sessionType,
		Duration:         duration,
		NumberOfSessions: numberOfSessions,
		CreatedAt:        createdAt,
		UpdatedAt:        updatedAt,
	}
}

func (c *CourseSession) Validate() error {
	if strings.TrimSpace(c.RequiredRoom) == "" {
		return errors.New("required_room is required")
	}

	if !validSessionTypes[c.Type] {
		return fmt.Errorf("invalid session type: %s", c.Type)
	}

	if c.Duration == nil {
		return errors.New("duration is required")
	}

	if *c.Duration <= 0 {
		return errors.New("duration must be greater than 0")
	}

	if c.NumberOfSessions == nil {
		return errors.New("number of sessions is required")
	}

	if *c.NumberOfSessions <= 0 {
		return errors.New("number of sessions must be greater than 0")
	}

	return nil
}

// CourseSessionUpdate represents partial update fields for a CourseSession.
type CourseSessionUpdate struct {
	RequiredRoom     *string `json:"required_room,omitempty"`
	Type             *string `json:"type,omitempty"`
	Duration         *int32  `json:"duration,omitempty"`
	NumberOfSessions *int32  `json:"number_of_sessions,omitempty"`
}

func (u *CourseSessionUpdate) Validate() error {
	if u.RequiredRoom != nil && strings.TrimSpace(*u.RequiredRoom) == "" {
		return errors.New("required_room cannot be empty")
	}

	if u.Type != nil && !validSessionTypes[*u.Type] {
		return fmt.Errorf("invalid session type: %s", *u.Type)
	}

	if u.Duration != nil && *u.Duration <= 0 {
		return errors.New("duration must be greater than 0")
	}

	if u.NumberOfSessions != nil && *u.NumberOfSessions <= 0 {
		return errors.New("number of sessions must be greater than 0")
	}

	return nil
}
