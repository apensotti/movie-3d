#!/bin/bash

# Navigate to the directory
cd /home/alexp/src/movie-3d

docker-compose down

# Build and run docker-compose
docker-compose up --build
