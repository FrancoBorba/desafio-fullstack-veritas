package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {

	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {

		fmt.Fprintf(w, "Backend ruunning")
	})


	fmt.Println("Go Server running in port 8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatalf("Error starting the server: %v", err)
	}
}