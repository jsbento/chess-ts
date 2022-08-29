package handler

import (
	"fmt"
	"net/http"
)

// Run with vercel dev
func Hello(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	fmt.Fprintf(w, `{"msg": "Hello World"}`)
}
