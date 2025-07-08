package handler

import (
	"log"
	"net/http"
	"time"

	"github.com/IU-Capstone-Project-2025/VoiceDiary/backend/go_api/internal/service"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type UserHandler struct {
	svc *service.UserService
}

func NewUserHandler(svc *service.UserService) *UserHandler {
	return &UserHandler{
		svc: svc,
	}
}

type RegisterRequest struct {
	Login    string `json:"login" binding:"required"`
	Password string `json:"password" binding:"required"`
	Nickname string `json:"nickname" binding:"required"`
}

type LoginRequest struct {
	Login    string `json:"login" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// @Summary Register a new user
// @Accept json
// @Produce json
// @Param user body RegisterRequest true "User info"
// @Success 200 {object} map[string]int
// @Failure 400 {object} map[string]string
// @Router /users/register [post]
func (h *UserHandler) Register(c *gin.Context) {
	log.Printf("Register: received request")

	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("Register: invalid input, error: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	id, err := h.svc.RegisterUser(c.Request.Context(), req.Login, req.Password, req.Nickname)
	if err != nil {
		log.Printf("Register: failed to register user, error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to register user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"userID": id})

	log.Printf("Register: user registered successfully, userID: %d", id)
}

// @Summary Login a user
// @Accept json
// @Produce json
// @Param user body LoginRequest true "User info"
// @Success 200 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Router /users/login [post]
func (h *UserHandler) Login(c *gin.Context) {
	log.Printf("Login: received request")

	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("Login: invalid request, error: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Please provide both email and password"})
		return
	}

	user, err := h.svc.GetUserByLogin(c.Request.Context(), req.Login)
    if err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Account not found. Please check your email or register"})
        return
    }

    if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Incorrect password. Please try again"})
        return
    }

    sessionToken := uuid.NewString()
    err = h.svc.SaveSession(c.Request.Context(), user.ID, sessionToken)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "We're having trouble signing you in. Please try again later"})
        return
    }

    http.SetCookie(c.Writer, &http.Cookie{
        Name:     "session_token",
        Value:    sessionToken,
        HttpOnly: true,
        Path:     "/",
        Expires:  time.Now().Add(30 * 24 * time.Hour), // 30 days session token expiration
        SameSite: http.SameSiteLaxMode,
    })

    c.JSON(http.StatusOK, gin.H{"message": "Login successful"})

	log.Printf("Login: user logged in successfully, userID: %d", user.ID)
}

// @Summary Get current user info
// @Description Returns the current user's info based on the session token.
// @Produce json
// @Success 200 {object} repository.User
// @Failure 400 {object} map[string]string
// @Router /users/me [get]
func (h *UserHandler) Me(c *gin.Context) {
    user, _ := c.Get("user")
    c.JSON(http.StatusOK, user)
}

// @Summary Logout a user
// @Description Logs out the user by deleting the session token.
// @Produce json
// @Success 200 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Router /users/logout [post]
func (h *UserHandler) Logout(c *gin.Context) {
	log.Printf("Logout: received request")

    cookie, err := c.Request.Cookie("session_token")
    if err != nil {
        c.JSON(http.StatusOK, gin.H{"message": "Logged out"})
        return
    }

    if err := h.svc.DeleteSession(c.Request.Context(), cookie.Value); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not revoke session"})
        return
    }

    // expire the cookie in the browser
    http.SetCookie(c.Writer, &http.Cookie{
        Name:     "session_token",
        Value:    "",
        Path:     "/",
        Expires:  time.Unix(0, 0),
        MaxAge:   -1,
        HttpOnly: true,
        SameSite: http.SameSiteLaxMode,
    })

    c.JSON(http.StatusOK, gin.H{"message": "Logged out"})
	log.Printf("Logout: user logged out successfully")
}