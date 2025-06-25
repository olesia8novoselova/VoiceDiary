package handler

import (
	"bytes"
	"database/sql"
	"io"
	"net/http"
	"strconv"

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

// UploadRecord handles voice file upload, sends it to ML service, and saves record metadata.
// @Summary Upload  a new voice record
// @Description Uploads a voice file, sends it to the ML service for analysis, and saves the record.
// @Tags records
// @Accept  multipart/form-data
// @Produce json
// @Param userID formData int true "User ID"
// @Param file formData file true "Voice file"
// @Success 200 {object} map[string]int
// @Failure 400 {object} map[string]string
// @Router /records/upload [post]
func (h *RecordHandler) UploadRecord(c *gin.Context) {
	userIDStr := c.PostForm("userID")
	userID , err := strconv.Atoi(userIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return 
	}
	file, _, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file is recieved"})
		return 
	}
	defer file.Close()

	// Read file into memory
	buf := bytes.NewBuffer(nil)
	if _, err := io.Copy(buf, file); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read file"})
		return
	}

	// Send file to ML service
	emotion, summary, err := h.svc.AnalyzeRawAudio(c.Request.Context(), buf.Bytes())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to analyze audio"})
		return
	}

	// Save record in DB
	recordID, err := h.svc.SaveRecord(c.Request.Context(), userID, emotion, summary)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save record"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user_id": userID,
		"record_id": recordID,
		"emotion": emotion,
		"summary": summary,
	})
}



// GetRecords returns all records for a given user.
// @Summary Get user records
// @Description  Returns a list of all diary records for a specific user.
// @Tags records
// @Accept json
// @Produce json
// @Param userID path int true "User ID"
// @Success 200 {array} repository.Record
// @Failure 400 {object} map[string]string
// @Router /users/{userID}/records [get]
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

// @Summary  Get analysis result for a record.
// @Description Returns emotion and summary for a specific record.
// @Tags records
// @Produce json
// @Param recordID path int true "Record ID"
// @Success 200 {object} repository.Record
// @Failure 400 {object} map[string]string	
// @Router /records/{recordID} [get]
func (h *RecordHandler) GetRecordAnalysis(c *gin.Context) {
	recordIDStr := c.Param("recordID")
	recordID, err := strconv.Atoi(recordIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid record ID"})
		return
	}
	record, err := h.svc.FetchRecordByID(c.Request.Context(), recordID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Record not found"})
		return
	}
	c.JSON(http.StatusOK, record)
}
