FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy only the package.json and package-lock.json first (to leverage Docker caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the remaining files
COPY . ./

# Expose the React development server port
EXPOSE 3000

# Use the development server
CMD ["npm", "start"]