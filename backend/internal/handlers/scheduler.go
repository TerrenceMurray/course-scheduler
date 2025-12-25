package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/TerrenceMurray/course-scheduler/internal/scheduler"
	"github.com/TerrenceMurray/course-scheduler/internal/service"
)

type SchedulerHandler struct {
	service service.SchedulerServiceInterface
}

func NewSchedulerHandler(s service.SchedulerServiceInterface) *SchedulerHandler {
	return &SchedulerHandler{service: s}
}

type GenerateRequest struct {
	Name   string            `json:"name"`
	Config *scheduler.Config `json:"config,omitempty"`
}

type GenerateResponse struct {
	Schedule any                        `json:"schedule,omitempty"`
	Output   *scheduler.Output          `json:"output,omitempty"`
	Failures []*scheduler.FailedSession `json:"failures,omitempty"`
	Error    string                     `json:"error,omitempty"`
}

func (h *SchedulerHandler) Generate(w http.ResponseWriter, r *http.Request) {
	var req GenerateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		Error(w, http.StatusBadRequest, "invalid request body")
		return
	}

	output, err := h.service.Generate(r.Context(), req.Config)
	if err != nil {
		Error(w, http.StatusInternalServerError, "failed to generate schedule")
		return
	}

	JSON(w, http.StatusOK, GenerateResponse{
		Output:   output,
		Failures: output.Failures,
	})
}

func (h *SchedulerHandler) GenerateAndSave(w http.ResponseWriter, r *http.Request) {
	var req GenerateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		Error(w, http.StatusBadRequest, "invalid request body")
		return
	}

	if req.Name == "" {
		Error(w, http.StatusBadRequest, "name is required")
		return
	}

	schedule, output, err := h.service.GenerateAndSave(r.Context(), req.Name, req.Config)
	if err != nil {
		// If we have output but save failed, still return the generated schedule info
		if output != nil {
			JSON(w, http.StatusInternalServerError, GenerateResponse{
				Output:   output,
				Failures: output.Failures,
				Error:    "schedule generated but failed to save: " + err.Error(),
			})
			return
		}
		Error(w, http.StatusInternalServerError, "failed to generate schedule")
		return
	}

	JSON(w, http.StatusCreated, GenerateResponse{
		Schedule: schedule,
		Output:   output,
		Failures: output.Failures,
	})
}
