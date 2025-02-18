# Development stage
FROM node:18-alpine as development

WORKDIR /app

# Copy dependencies files
COPY package*.json ./

# Install all dependencies (including dev/test dependencies)
RUN npm install

# Copy all files
COPY . .

# Build the application
RUN npm run build

# Runtime (production) layer
FROM node:18-alpine as production

WORKDIR /app

# Copy dependencies files
COPY package*.json ./

# Install runtime dependencies (without dev/test dependencies)
RUN npm ci --omit=dev

# Copy production build from the development stage
COPY --from=development /app/dist/ ./dist/

# Expose application port
EXPOSE 3000

# Start application
CMD [ "node", "dist/main.js" ]
