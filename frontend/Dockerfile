# Stage 1: Build the Next.js app
FROM node:21 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# RUN npm install -g pnpm

# Install dependencies
RUN npm install
RUN npm install --save cookies-next@4.3.0


# Install required packages (Debian-based)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    xorg \
    xserver-xorg \
    xvfb \
    libx11-dev \
    libxext-dev && \
    # Clean up to reduce the image size
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN npm run build

# Stage 2: Serve the Next.js app in production
FROM node:21

# Set the working directory
WORKDIR /app

# Copy the built app from the builder stage
COPY --from=builder /app .

# # Install pnpm
# RUN npm install -g pnpm

# Install production dependencies only
RUN npm install --production

# Expose the port
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]
