//go:generate npm run build --prefix ../../dashboard
/*
 * CogvisAI Alarms API
 *
 * API for managing alarms and visualizations from cogvisAI sensors.
 *
 * API version: 1.0.0
 */

package main

import (
	"log"
	"net/http"

	"github.com/GIT_USER_ID/GIT_REPO_ID/auth"
	"github.com/GIT_USER_ID/GIT_REPO_ID/db"
	openapi "github.com/GIT_USER_ID/GIT_REPO_ID/go"
	"github.com/GIT_USER_ID/GIT_REPO_ID/service"
	"github.com/gorilla/handlers"
)

func main() {
	log.Printf("Server started")

	db.InitDB()

	DefaultAPIService := service.NewAPIService()
	DefaultAPIController := openapi.NewDefaultAPIController(DefaultAPIService)

	// Create your router
	router := openapi.NewRouter(DefaultAPIController)
	// Serve the React static files
	reactHandler := http.StripPrefix("/", http.FileServer(http.Dir("../../dashboard/build")))
	router.PathPrefix("/").Handler(reactHandler)
	
	// Set up auth-protected routes
	alarmsRouter := router.PathPrefix("/alarms").Subrouter()
	alarmsRouter.Use(auth.JWTMiddleware)
	
	// Start the server with the CORS-enabled router
	log.Fatal(http.ListenAndServe(":8080", handlers.CORS()(router)))
}
