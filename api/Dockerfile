# Stage 1: Build the application
FROM node:lts-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application code to the working directory
COPY . .

# Stage 2: Production-ready image
FROM node:lts-alpine AS production

WORKDIR /app

# Copy only necessary files from build stage
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/server.js ./

# Expose the port that your app runs on
EXPOSE 3000

# Command to run your app
CMD ["node", "server.js"]
