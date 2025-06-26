package handler

import(
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/IU-Capstone-Project-2025/VoiceDiary/backend/go_api/internal/service"
	"log"
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

// @Summary Register a new user
// @Accept json
// @Produce json
// @Param user body RegisterRequest true "User info"
// @Success 200 {object} map[string]int
// @Failure 400 {object} map[string]string
// @Router /users/register [post]
func (h *UserHandler) Register(c *gin.Context) {
	log.Printf("Register: received request")

	var req struct {
		Login   string `json:"login" binding:"required"`
		Password string `json:"password" binding:"required"`
		Nickname string `json:"nickname" binding:"required"`
	}
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