#!/bin/bash

# Prompt Engineer - Start Script
# Starts both backend and frontend in background

set -e

echo "🚀 Starting Prompt Engineer..."
echo "=============================="
echo ""

# Check if setup has been run
if [ ! -d "backend/venv" ]; then
    echo "❌ Backend not set up. Please run ./scripts/setup.sh first."
    exit 1
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "❌ Frontend not set up. Please run ./scripts/setup.sh first."
    exit 1
fi

# Kill any existing processes on these ports
echo "🧹 Cleaning up existing processes..."
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true

# Start Backend
echo "🔧 Starting Backend (Port 8000)..."
cd backend
source venv/bin/activate
python main.py > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "  Backend PID: $BACKEND_PID"
cd ..

# Wait for backend to start
echo "  Waiting for backend to start..."
sleep 3

# Check if backend is running
if ! curl -s http://localhost:8000/health > /dev/null; then
    echo "❌ Backend failed to start. Check backend.log for errors."
    exit 1
fi
echo "✅ Backend running at http://localhost:8000"

# Start Frontend
echo ""
echo "🎨 Starting Frontend (Port 3000)..."
cd frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo "  Frontend PID: $FRONTEND_PID"
cd ..

# Wait for frontend to start
echo "  Waiting for frontend to start..."
sleep 5

echo ""
echo "✅ Application Started Successfully!"
echo "===================================="
echo ""
echo "🌐 Frontend: http://localhost:5173"
echo "🔧 Backend API: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "📊 Process IDs:"
echo "  Backend: $BACKEND_PID"
echo "  Frontend: $FRONTEND_PID"
echo ""
echo "📝 Logs:"
echo "  Backend: tail -f backend.log"
echo "  Frontend: tail -f frontend.log"
echo ""
echo "🛑 To stop:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo "  or run: ./scripts/stop.sh"
echo ""

# Try to open browser (macOS)
if command -v open &> /dev/null; then
    sleep 2
    echo "🌐 Opening browser..."
    open http://localhost:5173
fi
