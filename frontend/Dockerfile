# Stage 1: Build the Next.js app
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock if you're using yarn)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN npm run build

# Stage 2: Serve the Next.js app in production
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy the built app from the builder stage
COPY --from=builder /app ./

# Install production dependencies only
RUN npm install --production

# Expose the port
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]

