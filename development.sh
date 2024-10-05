#!/bin/bash

# Navigate to the directory
cd /home/alexp/src/movie-3d

docker-compose down

# Build and run docker-compose
APP_ENV=dev docker-compose up --build
