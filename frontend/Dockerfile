# Stage 1: Build React application
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Clean npm cache and install dependencies
RUN npm cache clean --force
RUN npm ci --legacy-peer-deps

# Copy application files
COPY . .

# Build the React application
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy build output to Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]