#!/bin/bash

# Navigate to the directory
cd /home/alexp/src/movie-3d

# Stop running containers
docker-compose down --remove-orphans
docker network rm movie-3d_app-network || true

# Set the environment variable
export APP_ENV=prod

# Build and start the containers
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
