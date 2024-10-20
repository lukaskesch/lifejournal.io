# Use an official Node.js runtime as the base image
FROM node:20-alpine

# Install dependencies required for bcrypt
RUN apk add --no-cache make gcc g++ python3

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Rebuild bcrypt for Alpine
RUN npm rebuild bcrypt --build-from-source

# Build the Next.js app
RUN npm run build

# Remove dependencies used for building
RUN apk del make gcc g++ python3

# Expose the port that Next.js runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]