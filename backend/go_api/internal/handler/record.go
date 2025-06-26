package handler

import (
	"bytes"
	"database/sql"
	"io"
	"net/http"
	"strconv"
	"log"

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
	log.Printf("UploadRecord: received request")

	userIDStr := c.PostForm("userID")
	userID , err := strconv.Atoi(userIDStr)
	if err != nil {
		log.Printf("UploadRecord: invalid userID %s, error: %v", userIDStr, err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return 
	}
	file, _, err := c.Request.FormFile("file")
	if err != nil {
		log.Printf("UploadRecord: failed to get file from form, error: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file is recieved"})
		return 
	}
	defer file.Close()

	// Read file into memory
	buf := bytes.NewBuffer(nil)
	if _, err := io.Copy(buf, file); err != nil {
		log.Printf("UploadRecord: failed to read file into buffer, error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read file"})
		return
	}

	// Send file to ML service
	emotion, summary, err := h.svc.AnalyzeRawAudio(c.Request.Context(), buf.Bytes())
	if err != nil {
		log.Printf("UploadRecord: failed to analyze audio, error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to analyze audio"})
		return
	}

	// Save record in DB
	recordID, err := h.svc.SaveRecord(c.Request.Context(), userID, emotion, summary)
	if err != nil {
		log.Printf("UploadRecord: failed to save record, error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save record"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user_id": userID,
		"record_id": recordID,
		"emotion": emotion,
		"summary": summary,
	})

	log.Printf("UploadRecord: successfully processed record for user %d with ID %d", userID, recordID)
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
	log.Printf("GetRecords: received request")

	ctx := c.Request.Context()
	userID := c.Param("userID")

	records, err := h.svc.FetchUserRecords(ctx, userID)
	if err != nil {
		log.Printf("GetRecords: failed to fetch records for userID %s, error: %v", userID, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, records)

	log.Printf("GetRecords: successfully fetched %d records for userID %s", len(records), userID)
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
	log.Printf("GetRecordAnalysis: received request")

	recordIDStr := c.Param("recordID")
	recordID, err := strconv.Atoi(recordIDStr)
	if err != nil {
		log.Printf("GetRecordAnalysis: invalid recordID %s, error: %v", recordIDStr, err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid record ID"})
		return
	}
	record, err := h.svc.FetchRecordByID(c.Request.Context(), recordID)
	if err != nil {
		log.Printf("GetRecordAnalysis: failed to fetch record with ID %d, error: %v", recordID, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Record not found"})
		return
	}
	c.JSON(http.StatusOK, record)

	log.Printf("GetRecordAnalysis: successfully fetched record with ID %d", recordID)
}
