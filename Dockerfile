# Stage 1: Build the application
FROM node:lts-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

# Stage 2: Production-ready image
FROM node:lts-alpine AS production

WORKDIR /app

COPY --from=build /app ./

EXPOSE 3000

CMD ["npm", "start"]