package handler

import (
	"net/http"
	"strconv"
	"time"

	"github.com/IU-Capstone-Project-2025/VoiceDiary/backend/go_api/internal/service"
	"github.com/gin-gonic/gin"
)

type TotalHandler struct {
	svc *service.TotalService
	recordSvc *service.RecordService
}

func NewTotalHandler(svc *service.TotalService, recordSvc *service.RecordService) *TotalHandler {
	return &TotalHandler{
		svc: svc,
		recordSvc: recordSvc,
	}
}

func (h *TotalHandler) GetTotals(c *gin.Context) {
	userIDStr := c.Param("userID")
	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}
	
	startDateStr := c.Query("start_date")
	endDateStr := c.Query("end_date")
	
	startDate, err := time.Parse("2006-01-02", startDateStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid start date"})
		return
	}
	
	endDate, err := time.Parse("2006-01-02", endDateStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid end date"})
		return
	}
	
	// Запрос агрегированных данных из сервиса
	totals, err := h.svc.GetUserTotals(c.Request.Context(), userID, startDate, endDate)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get totals"})
		return
	}
	
	c.JSON(http.StatusOK, totals)
}

func (h *TotalHandler) RecalculateTotal(c *gin.Context) {
	// Получение userID из URL
	userIDStr := c.Param("userID")
	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}
	
	// Получение даты из URL
	dateStr := c.Param("date")
	date, err := time.Parse("2006-01-02", dateStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date"})
		return
	}
	
	// Вызов сервиса для пересчёта данных
	err = h.svc.CalculateDailyTotal(c.Request.Context(), userID, date)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to recalculate totals"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Totals recalculated successfully"})
}