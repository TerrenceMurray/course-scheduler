package main

import (
	"log"

	"github.com/TerrenceMurray/course-scheduler/internal/app"
)

func main() {
	cfg := app.LoadConfig()

	application, err := app.New(cfg)
	if err != nil {
		log.Fatal(err)
	}
	defer application.Close()

	log.Printf("Server starting on %s", cfg.Addr)
	log.Fatal(application.Run())
}
