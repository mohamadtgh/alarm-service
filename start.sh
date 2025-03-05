#!/bin/bash

# Run the Go server
(cd ./api/go-server && go generate && go run main.go)