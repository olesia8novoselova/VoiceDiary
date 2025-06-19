package config

import (
	"os"
)

type Config struct {
	DatabaseURL string
	MLServiceURL string
	ListenAddr string
}

func Load() Config {
	addr := os.Getenv("LISTEN_ADDR")
    if addr == "" {
        addr = ":8080"
    }
	return Config {
		DatabaseURL: os.Getenv("DATABASE_URL"),
		MLServiceURL: os.Getenv("ML_SERVICE_URL"),
		ListenAddr: addr,
	}
}