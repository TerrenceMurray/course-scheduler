package handlers

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"

	"github.com/TerrenceMurray/course-scheduler/internal/models"
	"github.com/TerrenceMurray/course-scheduler/internal/repository"
	"github.com/TerrenceMurray/course-scheduler/internal/service"
)

type CourseHandler struct {
	service service.CourseServiceInterface
}

func NewCourseHandler(s service.CourseServiceInterface) *CourseHandler {
	return &CourseHandler{service: s}
}

func (h *CourseHandler) List(w http.ResponseWriter, r *http.Request) {
	courses, err := h.service.List(r.Context())
	if err != nil {
		Error(w, http.StatusInternalServerError, "failed to list courses")
		return
	}
	JSON(w, http.StatusOK, courses)
}

func (h *CourseHandler) Create(w http.ResponseWriter, r *http.Request) {
	var course models.Course
	if err := json.NewDecoder(r.Body).Decode(&course); err != nil {
		Error(w, http.StatusBadRequest, "invalid request body")
		return
	}
	course.ID = uuid.New()

	created, err := h.service.Create(r.Context(), &course)
	if err != nil {
		Error(w, http.StatusInternalServerError, "failed to create course")
		return
	}
	JSON(w, http.StatusCreated, created)
}

func (h *CourseHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		Error(w, http.StatusBadRequest, "invalid id")
		return
	}

	course, err := h.service.GetByID(r.Context(), id)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			Error(w, http.StatusNotFound, "course not found")
			return
		}
		Error(w, http.StatusInternalServerError, "failed to get course")
		return
	}
	JSON(w, http.StatusOK, course)
}

func (h *CourseHandler) Update(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		Error(w, http.StatusBadRequest, "invalid id")
		return
	}

	var updates models.CourseUpdate
	if err := json.NewDecoder(r.Body).Decode(&updates); err != nil {
		Error(w, http.StatusBadRequest, "invalid request body")
		return
	}

	updated, err := h.service.Update(r.Context(), id, &updates)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			Error(w, http.StatusNotFound, "course not found")
			return
		}
		Error(w, http.StatusInternalServerError, "failed to update course")
		return
	}
	JSON(w, http.StatusOK, updated)
}

func (h *CourseHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		Error(w, http.StatusBadRequest, "invalid id")
		return
	}

	if err := h.service.Delete(r.Context(), id); err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			Error(w, http.StatusNotFound, "course not found")
			return
		}
		Error(w, http.StatusInternalServerError, "failed to delete course")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
