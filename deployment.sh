#!/bin/bash

# Navigate to the directory
cd /home/alexp/src/movie-3d

docker-compose down

# Run the Cloudflare tunnel container
docker run -d cloudflare/cloudflared:latest tunnel --no-autoupdate run --token eyJhIjoiZDMzOTg5ZGFmMTY5YzMwMWVkM2IxM2I4YzUwMDA4MzgiLCJ0IjoiMmVmMjRhOGYtMzgwMC00YTkyLTk2MTUtZGM3MzhmOTA3MjU1IiwicyI6Ik0yVTJZbVUwWmpFdE9UQmxPQzAwTkdJMUxXRmpNRE10TjJRNFpETTBNVEZpTkdSaSJ9

# Build and run docker-compose
docker-compose up --build
