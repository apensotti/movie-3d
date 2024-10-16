#!/bin/bash

# Navigate to the directory
cd /home/alexp/src/movie-3d

# Stop running containers
docker-compose down

# Set the environment variable
export APP_ENV=dev

# Build and run docker-compose
docker-compose up --build -d