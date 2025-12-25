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

type RoomHandler struct {
	service service.RoomServiceInterface
}

func NewRoomHandler(s service.RoomServiceInterface) *RoomHandler {
	return &RoomHandler{service: s}
}

func (h *RoomHandler) List(w http.ResponseWriter, r *http.Request) {
	rooms, err := h.service.List(r.Context())
	if err != nil {
		Error(w, http.StatusInternalServerError, "failed to list rooms")
		return
	}
	JSON(w, http.StatusOK, rooms)
}

func (h *RoomHandler) Create(w http.ResponseWriter, r *http.Request) {
	var room models.Room
	if err := json.NewDecoder(r.Body).Decode(&room); err != nil {
		Error(w, http.StatusBadRequest, "invalid request body")
		return
	}
	room.ID = uuid.New()

	created, err := h.service.Create(r.Context(), &room)
	if err != nil {
		Error(w, http.StatusInternalServerError, "failed to create room")
		return
	}
	JSON(w, http.StatusCreated, created)
}

func (h *RoomHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		Error(w, http.StatusBadRequest, "invalid id")
		return
	}

	room, err := h.service.GetByID(r.Context(), id)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			Error(w, http.StatusNotFound, "room not found")
			return
		}
		Error(w, http.StatusInternalServerError, "failed to get room")
		return
	}
	JSON(w, http.StatusOK, room)
}

func (h *RoomHandler) Update(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		Error(w, http.StatusBadRequest, "invalid id")
		return
	}

	var updates models.RoomUpdate
	if err := json.NewDecoder(r.Body).Decode(&updates); err != nil {
		Error(w, http.StatusBadRequest, "invalid request body")
		return
	}

	updated, err := h.service.Update(r.Context(), id, &updates)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			Error(w, http.StatusNotFound, "room not found")
			return
		}
		Error(w, http.StatusInternalServerError, "failed to update room")
		return
	}
	JSON(w, http.StatusOK, updated)
}

func (h *RoomHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		Error(w, http.StatusBadRequest, "invalid id")
		return
	}

	if err := h.service.Delete(r.Context(), id); err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			Error(w, http.StatusNotFound, "room not found")
			return
		}
		Error(w, http.StatusInternalServerError, "failed to delete room")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
