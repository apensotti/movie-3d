#!/bin/bash

# Navigate to the directory
cd /home/alexp/src/movie-3d

docker-compose down

# Run the Cloudflare tunnel container
APP_ENV=prod docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build

