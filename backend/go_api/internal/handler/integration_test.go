package handler

import (
    "bytes"
    "database/sql"
    "encoding/json"
    "mime/multipart"
    "net/http"
    "net/http/httptest"
    "os"
    "testing"

    "github.com/gin-gonic/gin"
    "github.com/stretchr/testify/assert"
    _ "github.com/lib/pq"

    "github.com/IU-Capstone-Project-2025/VoiceDiary/backend/go_api/internal/service"
)

func setupTestRouter(db *sql.DB, mlURL string) *gin.Engine {
    gin.SetMode(gin.TestMode)
    r := gin.Default()
	
    recordHandler := NewRecordHandler(db, mlURL)
    userService := service.NewUserService(db)
    userHandler := NewUserHandler(userService)

    r.POST("/users/register", userHandler.Register)
    r.POST("/users/login", userHandler.Login)
    r.GET("/me", userHandler.Me)
    r.POST("/records/upload", recordHandler.UploadRecord)
    r.GET("/users/:userID/records", recordHandler.GetRecords)
    r.GET("/records/:recordID", recordHandler.GetRecordAnalysis)
    return r
}

func getTestDB() *sql.DB {
    // Test database
    dbURL := os.Getenv("TEST_DATABASE_URL")
    db, err := sql.Open("postgres", dbURL)
    if err != nil {
        panic(err)
    }
    return db
}

func TestUser(t *testing.T) {
    t.Skip("temporarily disabled due to known issue")

    db := getTestDB()
    defer db.Close()
    router := setupTestRouter(db, "http://ml_service:5000")

    // Register
    registerBody := `{"login":"testuser","password":"testpass","nickname":"Test"}`
    w := httptest.NewRecorder()
    req, _ := http.NewRequest("POST", "/users/register", bytes.NewBufferString(registerBody))
    req.Header.Set("Content-Type", "application/json")
    router.ServeHTTP(w, req)
    assert.Equal(t, http.StatusOK, w.Code)

    // Login
    loginBody := `{"login":"testuser","password":"testpass"}`
    w = httptest.NewRecorder()
    req, _ = http.NewRequest("POST", "/users/login", bytes.NewBufferString(loginBody))
    req.Header.Set("Content-Type", "application/json")
    router.ServeHTTP(w, req)
    assert.Equal(t, http.StatusOK, w.Code)
    cookies := w.Result().Cookies()
    assert.NotEmpty(t, cookies)

    // Me (authenticated)
    w = httptest.NewRecorder()
    req, _ = http.NewRequest("GET", "/me", nil)
    for _, c := range cookies {
        req.AddCookie(c)
    }
    router.ServeHTTP(w, req)
    assert.Equal(t, http.StatusOK, w.Code)
    var userResp map[string]interface{}
    json.Unmarshal(w.Body.Bytes(), &userResp)
    assert.Equal(t, "testuser", userResp["login"])
}

func TestUploadRecord_Unauthorized(t *testing.T) {
    t.Skip("temporarily disabled due to known issue")
    
    db := getTestDB()
    defer db.Close()
    router := setupTestRouter(db, "http://ml_service:5000")

    body := &bytes.Buffer{}
    writer := multipart.NewWriter(body)
    writer.WriteField("userID", "1")
    part, _ := writer.CreateFormFile("file", "test.wav")
    part.Write([]byte("FAKEAUDIO"))
    writer.Close()

    w := httptest.NewRecorder()
    req, _ := http.NewRequest("POST", "/records/upload", body)
    req.Header.Set("Content-Type", writer.FormDataContentType())
    router.ServeHTTP(w, req)
    // You may want to check for 401 or 400 depending on your logic
    assert.True(t, w.Code == http.StatusUnauthorized || w.Code == http.StatusBadRequest)
}

func TestGetRecords_NotFound(t *testing.T) {
    db := getTestDB()
    defer db.Close()
    router := setupTestRouter(db, "http://ml_service:5000")

    w := httptest.NewRecorder()
    req, _ := http.NewRequest("GET", "/users/99999/records", nil)
    router.ServeHTTP(w, req)
    assert.True(t, w.Code == http.StatusOK || w.Code == http.StatusNotFound)
}

func TestGetRecordAnalysis_NotFound(t *testing.T) {
    db := getTestDB()
    defer db.Close()
    router := setupTestRouter(db, "http://ml_service:5000")

    w := httptest.NewRecorder()
    req, _ := http.NewRequest("GET", "/records/99999", nil)
    router.ServeHTTP(w, req)
    assert.True(t, w.Code == http.StatusOK || w.Code == http.StatusNotFound || w.Code == http.StatusInternalServerError)
}