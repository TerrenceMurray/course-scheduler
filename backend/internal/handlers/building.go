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

type BuildingHandler struct {
	service service.BuildingServiceInterface
}

func NewBuildingHandler(s service.BuildingServiceInterface) *BuildingHandler {
	return &BuildingHandler{service: s}
}

func (h *BuildingHandler) List(w http.ResponseWriter, r *http.Request) {
	buildings, err := h.service.List(r.Context())
	if err != nil {
		Error(w, http.StatusInternalServerError, "failed to list buildings")
		return
	}
	JSON(w, http.StatusOK, buildings)
}

func (h *BuildingHandler) Create(w http.ResponseWriter, r *http.Request) {
	var building models.Building
	if err := json.NewDecoder(r.Body).Decode(&building); err != nil {
		Error(w, http.StatusBadRequest, "invalid request body")
		return
	}
	building.ID = uuid.New()

	created, err := h.service.Create(r.Context(), &building)
	if err != nil {
		Error(w, http.StatusInternalServerError, "failed to create building")
		return
	}
	JSON(w, http.StatusCreated, created)
}

func (h *BuildingHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		Error(w, http.StatusBadRequest, "invalid id")
		return
	}

	building, err := h.service.GetByID(r.Context(), id)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			Error(w, http.StatusNotFound, "building not found")
			return
		}
		Error(w, http.StatusInternalServerError, "failed to get building")
		return
	}
	JSON(w, http.StatusOK, building)
}

func (h *BuildingHandler) Update(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		Error(w, http.StatusBadRequest, "invalid id")
		return
	}

	var updates models.BuildingUpdate
	if err := json.NewDecoder(r.Body).Decode(&updates); err != nil {
		Error(w, http.StatusBadRequest, "invalid request body")
		return
	}

	updated, err := h.service.Update(r.Context(), id, &updates)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			Error(w, http.StatusNotFound, "building not found")
			return
		}
		Error(w, http.StatusInternalServerError, "failed to update building")
		return
	}
	JSON(w, http.StatusOK, updated)
}

func (h *BuildingHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		Error(w, http.StatusBadRequest, "invalid id")
		return
	}

	if err := h.service.Delete(r.Context(), id); err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			Error(w, http.StatusNotFound, "building not found")
			return
		}
		Error(w, http.StatusInternalServerError, "failed to delete building")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
