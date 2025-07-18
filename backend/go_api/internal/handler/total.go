package handler

import (
	"net/http"
	"strconv"
	"time"

	"github.com/IU-Capstone-Project-2025/VoiceDiary/backend/go_api/internal/service"
	"github.com/gin-gonic/gin"
)

type TotalHandler struct {
	svc      *service.TotalService
	recordSvc *service.RecordService
}

func NewTotalHandler(svc *service.TotalService, recordSvc *service.RecordService) *TotalHandler {
	return &TotalHandler{
		svc:      svc,
		recordSvc: recordSvc,
	}
}

func (h *TotalHandler) GetTotals(c *gin.Context) {
    userIDStr := c.Param("userID")
    userID, err := strconv.Atoi(userIDStr)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "success": false,
            "error":   "Invalid user ID",
        })
        return
    }

    startDateStr := c.Query("start_date")
    endDateStr := c.Query("end_date")

    startDate, err := time.Parse("2006-01-02", startDateStr)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "success": false,
            "error":   "Invalid start date format, use YYYY-MM-DD",
        })
        return
    }

    endDate, err := time.Parse("2006-01-02", endDateStr)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "success": false,
            "error":   "Invalid end date format, use YYYY-MM-DD",
        })
        return
    }

    if startDate.After(endDate) {
        c.JSON(http.StatusBadRequest, gin.H{
            "success": false,
            "error":   "Start date must be before or equal to end date",
        })
        return
    }

    if endDate.Sub(startDate) > 365*24*time.Hour {
        c.JSON(http.StatusBadRequest, gin.H{
            "success": false,
            "error":   "Date range cannot exceed 1 year",
        })
        return
    }

    totals, err := h.svc.GetUserTotals(c.Request.Context(), userID, startDate, endDate)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "success": false,
            "error":   "Failed to get totals",
        })
        return
    }

    response := gin.H{
        "success": true,
        "data":    totals,
    }

    if len(totals) == 0 {
        response["message"] = "No records found for the specified period"
    }

    c.JSON(http.StatusOK, response)
}

func (h *TotalHandler) RecalculateTotal(c *gin.Context) {
    userIDStr := c.Param("userID")
    userID, err := strconv.Atoi(userIDStr)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "success": false,
            "error":   "Invalid user ID",
        })
        return
    }
    
    dateStr := c.Param("date")
    date, err := time.Parse("2006-01-02", dateStr)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "success": false,
            "error":   "Invalid date",
        })
        return
    }
    
    err = h.svc.CalculateDailyTotal(c.Request.Context(), userID, date)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "success": false,
            "error":   "Failed to recalculate totals",
        })
        return
    }

    totals, err := h.svc.GetUserTotals(c.Request.Context(), userID, date, date)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "success": false,
            "error":   "Failed to verify recalculation",
        })
        return
    }

    response := gin.H{
        "success": true,
        "data":    totals,
    }

    if len(totals) == 0 {
        response["message"] = "No records found for the specified date"
    }

    c.JSON(http.StatusOK, response)
}