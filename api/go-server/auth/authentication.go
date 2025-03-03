// This package mocks JWT authentication middleware by checking
// if the request contains `Mocked_Auth` header with the value of `LetMeIn`
package auth

import (
	"net/http"
)

func JWTMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Mocked-Auth")
		if authHeader != "LetMeIn" {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}
		
		next.ServeHTTP(w, r)
	})
}