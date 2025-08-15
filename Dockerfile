FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port 3000 (Railway will map to the provided PORT)
EXPOSE 3000

# Use the standalone server for better performance
CMD ["npm", "run", "start:standalone"] 