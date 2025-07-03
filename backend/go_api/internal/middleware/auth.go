package middleware

import (
    "net/http"
    "github.com/IU-Capstone-Project-2025/VoiceDiary/backend/go_api/internal/service"
    "github.com/gin-gonic/gin"
)

func AuthMiddleware(svc *service.UserService) gin.HandlerFunc {
    return func(c *gin.Context) {
        cookie, err := c.Request.Cookie("session_token")
        if err != nil {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "no session"})
            return
        }
        user, err := svc.GetUserBySession(c.Request.Context(), cookie.Value)
        if err != nil {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid session"})
            return
        }
        c.Set("user", user)
        c.Next()
    }
}