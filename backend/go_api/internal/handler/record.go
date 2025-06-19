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

// GetRecords returns all records for a given user.
// @Summary      Get user records
// @Description  Returns a list of all diary records for a specific user.
// @Tags         records
// @Accept       json
// @Produce      json
// @Param        userID   path      int  true  "User ID"
// @Success      200      {array}   repository.Record
// @Failure      400      {object}  map[string]string
// @Router       /users/{userID}/records [get]
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

// AnalyzeRecord runs ML analysis on a single record.
// @Summary      Analyze a record
// @Description  Fetches the data_url for the record, sends it to the ML service, and returns the result.
// @Tags         records
// @Accept       json
// @Produce      json
// @Param        recordID  path      int  true  "Record ID"
// @Success      200       {object}  client.AnalysisResult
// @Failure      500       {object}  map[string]string
// @Router       /records/{recordID}/analyze [post]
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