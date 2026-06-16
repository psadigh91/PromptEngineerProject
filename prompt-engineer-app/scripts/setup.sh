#!/bin/bash

# Prompt Engineer - Setup Script
# This script sets up both backend and frontend

set -e  # Exit on error

echo "🚀 Prompt Engineer - Setup Script"
echo "=================================="
echo ""

# Check Python version
echo "📋 Checking Python version..."
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.9 or higher."
    exit 1
fi

PYTHON_VERSION=$(python3 --version | cut -d' ' -f2 | cut -d'.' -f1,2)
echo "✅ Found Python $PYTHON_VERSION"

# Check Node.js version
echo "📋 Checking Node.js version..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

NODE_VERSION=$(node --version)
echo "✅ Found Node.js $NODE_VERSION"

# Setup Backend
echo ""
echo "🔧 Setting up Backend..."
cd backend

# Create virtual environment
echo "  Creating Python virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "  Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "  Installing Python dependencies..."
pip install --upgrade pip > /dev/null
pip install -r requirements.txt

# Initialize database
echo "  Initializing database..."
python -c "from core.database import init_db; init_db()"

echo "✅ Backend setup complete"
cd ..

# Setup Frontend
echo ""
echo "🎨 Setting up Frontend..."
cd frontend

# Install dependencies
echo "  Installing Node.js dependencies..."
npm install

echo "✅ Frontend setup complete"
cd ..

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Prompt Engineer Configuration
BACKEND_PORT=8000
FRONTEND_PORT=3000
DATABASE_PATH=./database/prompts.db
EOF
    echo "✅ .env file created"
fi

# Success message
echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "To start the application, run:"
echo "  ./scripts/start.sh"
echo ""
echo "Or start manually:"
echo "  Terminal 1: cd backend && source venv/bin/activate && python main.py"
echo "  Terminal 2: cd frontend && npm run dev"
echo ""
echo "The app will be available at: http://localhost:3000"
echo ""
