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

type CourseSessionHandler struct {
	service service.CourseSessionServiceInterface
}

func NewCourseSessionHandler(s service.CourseSessionServiceInterface) *CourseSessionHandler {
	return &CourseSessionHandler{service: s}
}

func (h *CourseSessionHandler) List(w http.ResponseWriter, r *http.Request) {
	sessions, err := h.service.List(r.Context())
	if err != nil {
		Error(w, http.StatusInternalServerError, "failed to list sessions")
		return
	}
	JSON(w, http.StatusOK, sessions)
}

func (h *CourseSessionHandler) Create(w http.ResponseWriter, r *http.Request) {
	var session models.CourseSession
	if err := json.NewDecoder(r.Body).Decode(&session); err != nil {
		Error(w, http.StatusBadRequest, "invalid request body")
		return
	}
	session.ID = uuid.New()

	created, err := h.service.Create(r.Context(), &session)
	if err != nil {
		Error(w, http.StatusInternalServerError, "failed to create session")
		return
	}
	JSON(w, http.StatusCreated, created)
}

func (h *CourseSessionHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		Error(w, http.StatusBadRequest, "invalid id")
		return
	}

	session, err := h.service.GetByID(r.Context(), id)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			Error(w, http.StatusNotFound, "session not found")
			return
		}
		Error(w, http.StatusInternalServerError, "failed to get session")
		return
	}
	JSON(w, http.StatusOK, session)
}

func (h *CourseSessionHandler) GetByCourseID(w http.ResponseWriter, r *http.Request) {
	courseID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		Error(w, http.StatusBadRequest, "invalid course id")
		return
	}

	sessions, err := h.service.GetByCourseID(r.Context(), courseID)
	if err != nil {
		Error(w, http.StatusInternalServerError, "failed to get sessions")
		return
	}
	JSON(w, http.StatusOK, sessions)
}

func (h *CourseSessionHandler) Update(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		Error(w, http.StatusBadRequest, "invalid id")
		return
	}

	var updates models.CourseSessionUpdate
	if err := json.NewDecoder(r.Body).Decode(&updates); err != nil {
		Error(w, http.StatusBadRequest, "invalid request body")
		return
	}

	updated, err := h.service.Update(r.Context(), id, &updates)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			Error(w, http.StatusNotFound, "session not found")
			return
		}
		Error(w, http.StatusInternalServerError, "failed to update session")
		return
	}
	JSON(w, http.StatusOK, updated)
}

func (h *CourseSessionHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		Error(w, http.StatusBadRequest, "invalid id")
		return
	}

	if err := h.service.Delete(r.Context(), id); err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			Error(w, http.StatusNotFound, "session not found")
			return
		}
		Error(w, http.StatusInternalServerError, "failed to delete session")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
