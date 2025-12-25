package app

import "os"

type Config struct {
	Addr        string // :8080
	DatabaseURL string // pg connection string
}

func LoadConfig() *Config {
	address := os.Getenv("BACKEND_ADDRESS")
	databaseURL := os.Getenv("DATABASE_URL")

	if address == "" {
		address = ":8080"
	}

	if databaseURL == "" {
		databaseURL = "postgres://localhost:5432/scheduler?sslmode=disable"
	}

	return &Config{
		Addr:        address,
		DatabaseURL: databaseURL,
	}
}
