# ⚡ Quick Start Guide

Get up and running in **5 minutes**!

## Prerequisites

- **Python 3.9+** - [Download](https://www.python.org/downloads/)
- **Node.js 16+** - [Download](https://nodejs.org/)

## Installation

### Option 1: One-Command Setup (Recommended)

```bash
git clone https://github.com/yourusername/prompt-engineer-app.git
cd prompt-engineer-app
./scripts/setup.sh
./scripts/start.sh
```

That's it! The app will open at **http://localhost:5173**

### Option 2: Manual Setup

```bash
# Backend
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

## First Steps

### 1. **Upload a Context** (Optional but Recommended)

Go to **Settings → Context Management**:
- Drag & drop a context YAML file
- Or use pre-built contexts in `/contexts/industries/`
- Example: `healthcare.yaml`, `finance.yaml`

### 2. **Optimize Your First Prompt**

On the **Home** page:

1. Enter a prompt (e.g., "Summarize this article")
2. Click **"Analyze Prompt"**
3. Review the analysis
4. Answer the questions
5. Get your optimized prompt!

### 3. **Save to Library**

After optimization:
- Click **"💾 Save to Library"**
- Add a title and tags
- Access later from **Library** page

---

**Happy Prompting! 🚀**
