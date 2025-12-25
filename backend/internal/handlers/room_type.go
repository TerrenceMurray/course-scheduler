package handlers

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/go-chi/chi/v5"

	"github.com/TerrenceMurray/course-scheduler/internal/models"
	"github.com/TerrenceMurray/course-scheduler/internal/repository"
	"github.com/TerrenceMurray/course-scheduler/internal/service"
)

type RoomTypeHandler struct {
	service service.RoomTypeServiceInterface
}

func NewRoomTypeHandler(s service.RoomTypeServiceInterface) *RoomTypeHandler {
	return &RoomTypeHandler{service: s}
}

func (h *RoomTypeHandler) List(w http.ResponseWriter, r *http.Request) {
	roomTypes, err := h.service.List(r.Context())
	if err != nil {
		Error(w, http.StatusInternalServerError, "failed to list room types")
		return
	}
	JSON(w, http.StatusOK, roomTypes)
}

func (h *RoomTypeHandler) Create(w http.ResponseWriter, r *http.Request) {
	var roomType models.RoomType
	if err := json.NewDecoder(r.Body).Decode(&roomType); err != nil {
		Error(w, http.StatusBadRequest, "invalid request body")
		return
	}

	created, err := h.service.Create(r.Context(), &roomType)
	if err != nil {
		Error(w, http.StatusInternalServerError, "failed to create room type")
		return
	}
	JSON(w, http.StatusCreated, created)
}

func (h *RoomTypeHandler) GetByName(w http.ResponseWriter, r *http.Request) {
	name := chi.URLParam(r, "name")
	if name == "" {
		Error(w, http.StatusBadRequest, "invalid name")
		return
	}

	roomType, err := h.service.GetByName(r.Context(), name)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			Error(w, http.StatusNotFound, "room type not found")
			return
		}
		Error(w, http.StatusInternalServerError, "failed to get room type")
		return
	}
	JSON(w, http.StatusOK, roomType)
}

func (h *RoomTypeHandler) Update(w http.ResponseWriter, r *http.Request) {
	name := chi.URLParam(r, "name")
	if name == "" {
		Error(w, http.StatusBadRequest, "invalid name")
		return
	}

	var updates models.UpdateRoomType
	if err := json.NewDecoder(r.Body).Decode(&updates); err != nil {
		Error(w, http.StatusBadRequest, "invalid request body")
		return
	}

	updated, err := h.service.Update(r.Context(), name, &updates)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			Error(w, http.StatusNotFound, "room type not found")
			return
		}
		Error(w, http.StatusInternalServerError, "failed to update room type")
		return
	}
	JSON(w, http.StatusOK, updated)
}

func (h *RoomTypeHandler) Delete(w http.ResponseWriter, r *http.Request) {
	name := chi.URLParam(r, "name")
	if name == "" {
		Error(w, http.StatusBadRequest, "invalid name")
		return
	}

	if err := h.service.Delete(r.Context(), name); err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			Error(w, http.StatusNotFound, "room type not found")
			return
		}
		Error(w, http.StatusInternalServerError, "failed to delete room type")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
