# Multi-stage build for Prompt Engineer

# Stage 1: Build Frontend
FROM node:18-alpine as frontend-build

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Python Backend
FROM python:3.11-slim

WORKDIR /app

# Install backend dependencies
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy backend code
COPY backend/ ./backend/

# Copy built frontend
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

# Create database directory
RUN mkdir -p /app/database

# Expose ports
EXPOSE 8000

# Start backend (which also serves frontend static files)
CMD ["python", "backend/main.py"]
