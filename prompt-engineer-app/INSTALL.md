# Installation Guide

Complete installation instructions for all platforms.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Quick Install (Recommended)](#quick-install)
- [Manual Installation](#manual-installation)
- [Docker Installation](#docker-installation)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

1. **Python 3.9 or higher**
   ```bash
   python3 --version  # Check version
   ```
   Download: https://www.python.org/downloads/

2. **Node.js 16 or higher**
   ```bash
   node --version  # Check version
   ```
   Download: https://nodejs.org/

### System Requirements

- **OS:** macOS, Linux, or Windows
- **RAM:** 2GB minimum, 4GB recommended
- **Disk:** 500MB free space

---

## Quick Install

### macOS / Linux

```bash
# 1. Navigate to project directory
cd prompt-engineer-app

# 2. Run setup script
chmod +x scripts/*.sh
./scripts/setup.sh

# 3. Start the application
./scripts/start.sh
```

### Windows

```cmd
# 1. Navigate to project directory
cd prompt-engineer-app

# 2. Setup Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# 3. Setup Frontend (new terminal)
cd frontend
npm install

# 4. Start Backend
cd backend
venv\Scripts\activate
python main.py

# 5. Start Frontend (new terminal)
cd frontend
npm run dev
```

---

## Manual Installation

### Step 1: Clone or Download

```bash
# Option A: Git clone
git clone https://github.com/yourusername/prompt-engineer-app.git
cd prompt-engineer-app

# Option B: Download ZIP
# Extract and cd into folder
```

### Step 2: Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# macOS/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Initialize database
python -c "from core.database import init_db; init_db()"
```

### Step 3: Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Verify installation
npm run dev -- --help
```

### Step 4: Start Application

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python main.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 5: Verify

Open browser to: **http://localhost:5173**

Backend API: **http://localhost:8000**
API Docs: **http://localhost:8000/docs**

---

## Docker Installation

### Using Docker Compose (Easiest)

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

Access at: **http://localhost:8000**

### Using Dockerfile

```bash
# Build image
docker build -t prompt-engineer .

# Run container
docker run -p 8000:8000 -p 3000:3000 \
  -v $(pwd)/database:/app/database \
  prompt-engineer

# Stop container
docker stop <container-id>
```

---

## Troubleshooting

### Python Issues

**❌ Python not found**
```bash
# Install Python 3.9+
# macOS (using Homebrew):
brew install python@3.9

# Ubuntu/Debian:
sudo apt install python3.9 python3.9-venv

# Windows: Download from python.org
```

**❌ pip install fails**
```bash
# Upgrade pip
pip install --upgrade pip

# Use specific index
pip install -r requirements.txt --index-url https://pypi.org/simple
```

**❌ Module not found error**
```bash
# Verify virtual environment is activated
which python  # Should show venv path

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### Node.js Issues

**❌ Node not found**
```bash
# Install Node.js 16+
# macOS (using Homebrew):
brew install node

# Ubuntu/Debian:
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Windows: Download from nodejs.org
```

**❌ npm install fails**
```bash
# Clear cache
npm cache clean --force

# Delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

**❌ Permission errors**
```bash
# Fix npm permissions (macOS/Linux)
sudo chown -R $USER ~/.npm
sudo chown -R $USER node_modules
```

### Port Issues

**❌ Port already in use**
```bash
# Find and kill process on port 8000
# macOS/Linux:
lsof -ti:8000 | xargs kill -9

# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Or use different port
# Edit backend/main.py: uvicorn.run(..., port=8001)
```

### Database Issues

**❌ Database locked**
```bash
# Stop all running instances
./scripts/stop.sh

# Delete and recreate database
rm database/prompts.db
python -c "from core.database import init_db; init_db()"
```

**❌ Database corruption**
```bash
# Backup existing
mv database/prompts.db database/prompts.db.backup

# Create fresh database
python -c "from core.database import init_db; init_db()"
```

### Frontend Build Issues

**❌ Vite build fails**
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Rebuild
npm run dev
```

**❌ Blank page on load**
```bash
# Check browser console for errors
# Verify backend is running at localhost:8000
curl http://localhost:8000/health

# Check API proxy in vite.config.js
```

---

## Verification Checklist

After installation, verify:

- [ ] Backend running: http://localhost:8000/health returns `{"status": "healthy"}`
- [ ] API docs accessible: http://localhost:8000/docs
- [ ] Frontend loads: http://localhost:5173
- [ ] Can enter prompt and see analysis
- [ ] Can upload context file in Settings
- [ ] Can save prompt to library
- [ ] Database file created at `database/prompts.db`

---

## Next Steps

1. **Upload a context:** Settings → Context Management
2. **Try first prompt:** Home → Enter prompt → Analyze
3. **Explore library:** Library → Browse saved prompts
4. **Read docs:** Check README.md and QUICKSTART.md

---

## Getting Help

- **Documentation:** README.md, QUICKSTART.md
- **GitHub Issues:** https://github.com/yourusername/prompt-engineer-app/issues
- **Discussions:** https://github.com/yourusername/prompt-engineer-app/discussions

---

**Installation complete! Happy prompting! 🚀**
