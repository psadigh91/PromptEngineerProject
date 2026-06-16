#!/bin/bash

# Prompt Engineer - Stop Script
# Stops both backend and frontend

echo "🛑 Stopping Prompt Engineer..."
echo "=============================="
echo ""

# Kill processes on backend port
echo "Stopping Backend (Port 8000)..."
lsof -ti:8000 | xargs kill -9 2>/dev/null || echo "  Backend not running"

# Kill processes on frontend ports
echo "Stopping Frontend (Port 3000, 5173)..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || echo "  Frontend not running"

echo ""
echo "✅ All processes stopped"
