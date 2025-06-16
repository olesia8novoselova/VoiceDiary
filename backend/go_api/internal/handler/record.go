package handler

import (
	"database/sql"
	"net/http"
	"github.com/gin-gonic/gin"

	"github.com/IU-Capstone-Project-2025/VoiceDiary/backend/go_api/internal/service"
)

type RecordHandler struct {
	svc *service.RecordService
}

func NewRecordHandler(db  *sql.DB, mlURL string) *RecordHandler {
	return &RecordHandler{
  		svc: service.NewRecordService(db, mlURL),
 	}
}

func (h *RecordHandler) GetRecords(c *gin.Context) {
	ctx := c.Request.Context()
	userID := c.Param("userID")

	records, err := h.svc.FetchUserRecords(ctx, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, records)
}

func (h *RecordHandler) AnalyzeRecord(c *gin.Context) {
	ctx := c.Request.Context()
	recordID := c.Param("recordID")

	result, err := h.svc.AnalyzeRecord(ctx, recordID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, result)
}