package config

import (
	"os"
)

type Config struct {
	DatabaseURL string
	MLServiceURL string
	ServerPort string
}

func Load() Config {
	return Config {
		DatabaseURL: os.Getenv("DATABASE_URL"),
		MLServiceURL: os.Getenv("ML_SERVICE_URL"),
		ServerPort: os.Getenv("SERVER_PORT"),
	}
}