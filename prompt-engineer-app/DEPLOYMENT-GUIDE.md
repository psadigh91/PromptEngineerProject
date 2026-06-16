# 🚀 Deployment Guide

Complete guide for deploying Prompt Engineer to various platforms.

---

## 📋 Table of Contents

1. [AWS Amplify (Recommended for Demo)](#aws-amplify)
2. [Vercel](#vercel)
3. [Netlify](#netlify)
4. [Full Stack Deployment](#full-stack-deployment)
5. [Docker Deployment](#docker)

---

## 🎯 Quick Start: Choose Your Deployment

| Platform | Best For | Setup Time | Cost |
|----------|----------|------------|------|
| **AWS Amplify** | Portfolio demo | 5 min | Free tier |
| **Vercel** | Frontend-only | 3 min | Free tier |
| **Netlify** | Frontend-only | 3 min | Free tier |
| **Full Stack** | Production | 15 min | Varies |
| **Docker** | Self-hosted | 10 min | Server costs |

---

## 🟦 AWS Amplify

**Best for:** Portfolio demos, quick deployment

### Prerequisites
- AWS Account (free tier available)
- This GitHub repository

### Method 1: From GitHub (Recommended)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR-USERNAME/prompt-engineer-app.git
   git push -u origin main
   ```

2. **Connect to Amplify:**
   - Go to: https://console.aws.amazon.com/amplify/
   - Click "New app" → "Host web app"
   - Choose "GitHub"
   - Select your repository
   - Branch: `main`

3. **Configure Build Settings:**
   
   Amplify should auto-detect `amplify.yml`, but if not, use:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - cd frontend
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: frontend/dist
       files:
         - '**/*'
     cache:
       paths:
         - frontend/node_modules/**/*
   ```

4. **Environment Variables:**
   - Add: `VITE_DEMO_MODE` = `true`

5. **Deploy:**
   - Click "Save and deploy"
   - Wait ~3 minutes
   - Your app is live! 🎉

### Method 2: Manual Upload

1. **Build locally:**
   ```bash
   cd frontend
   npm install
   VITE_DEMO_MODE=true npm run build
   cd dist
   zip -r ~/amplify-deploy.zip .
   ```

2. **Upload to Amplify:**
   - Go to Amplify Console
   - Click "Deploy without Git"
   - Upload `amplify-deploy.zip`

**Demo Mode:** Uses mock data, no backend required. Perfect for portfolio!

---

## ▲ Vercel

**Best for:** Quick frontend deployment

### Deploy from GitHub

1. **Push to GitHub** (see Amplify step 1)

2. **Import to Vercel:**
   - Go to: https://vercel.com/
   - Click "New Project"
   - Import your GitHub repo
   
3. **Configure:**
   - Framework: React
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Environment Variables:**
   - Add: `VITE_DEMO_MODE` = `true`

5. **Deploy:**
   - Click "Deploy"
   - Live in ~2 minutes!

**URL:** Auto-generated (e.g., `your-app.vercel.app`)

---

## 🟩 Netlify

**Best for:** Simple static hosting

### Deploy from GitHub

1. **Push to GitHub** (see Amplify step 1)

2. **Connect to Netlify:**
   - Go to: https://app.netlify.com/
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub
   - Select your repository

3. **Build Settings:**
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`

4. **Environment Variables:**
   - Add: `VITE_DEMO_MODE` = `true`

5. **Deploy:**
   - Click "Deploy site"
   - Live in ~2 minutes!

---

## 🏗️ Full Stack Deployment

**For:** Production with real backend (data persistence)

### Architecture

```
Frontend (Vercel/Netlify/Amplify)
         ↓
Backend (Heroku/Railway/Render)
         ↓
Database (PostgreSQL)
```

### Backend Options

#### Option 1: Heroku

```bash
cd backend

# Create Procfile
echo "web: uvicorn main:app --host 0.0.0.0 --port \$PORT" > Procfile

# Create runtime.txt
echo "python-3.11.0" > runtime.txt

# Deploy
heroku login
heroku create your-app-name
git subtree push --prefix backend heroku main
```

**Your backend URL:** `https://your-app-name.herokuapp.com`

#### Option 2: Railway

```bash
cd backend
railway login
railway init
railway up
```

Get URL from Railway dashboard.

#### Option 3: Render

1. Go to: https://render.com/
2. New → "Web Service"
3. Connect your repo
4. Root Directory: `backend`
5. Build Command: `pip install -r requirements.txt`
6. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Frontend Configuration

Update frontend environment:

```bash
# In Amplify/Vercel/Netlify
VITE_DEMO_MODE=false
VITE_API_URL=https://your-backend-url.herokuapp.com
```

Redeploy frontend.

---

## 🐳 Docker

**For:** Self-hosted, containerized deployment

### Quick Start

```bash
# Build and run
docker-compose up -d

# Access at:
# http://localhost:8000 (Backend)
# http://localhost:3000 (Frontend)
```

### Production Deployment

Deploy to:
- **AWS ECS**
- **Google Cloud Run**
- **DigitalOcean App Platform**
- **Your own server**

---

## 🔧 Environment Variables

### Frontend Variables

| Variable | Value | Purpose |
|----------|-------|---------|
| `VITE_DEMO_MODE` | `true` / `false` | Enable mock API |
| `VITE_API_URL` | Backend URL | API endpoint (if DEMO_MODE=false) |

### Backend Variables (Full Stack Only)

| Variable | Value | Purpose |
|----------|-------|---------|
| `DATABASE_URL` | PostgreSQL URL | Database connection |
| `PORT` | `8000` | Server port |

---

## 📊 Comparison Matrix

| Feature | Amplify | Vercel | Netlify | Full Stack | Docker |
|---------|---------|--------|---------|------------|--------|
| Setup Time | 5 min | 3 min | 3 min | 15 min | 10 min |
| Demo Mode | ✅ | ✅ | ✅ | ✅ | ✅ |
| Data Persistence | ❌ | ❌ | ❌ | ✅ | ✅ |
| Custom Domain | ✅ | ✅ | ✅ | ✅ | ✅ |
| Free Tier | ✅ | ✅ | ✅ | Limited | N/A |
| SSL/HTTPS | ✅ Auto | ✅ Auto | ✅ Auto | ✅ Auto | Manual |
| CI/CD | ✅ | ✅ | ✅ | ✅ | Manual |

---

## 🎯 Recommendations

### For Portfolio/Demo
→ **AWS Amplify** or **Vercel**
- Fastest setup
- Demo mode works perfectly
- Free tier sufficient
- Professional URLs

### For MVP/Production
→ **Full Stack** (Vercel + Railway)
- Real data persistence
- Scalable
- Good free tiers
- Easy to upgrade

### For Learning/Local Dev
→ **Docker**
- Complete control
- Reproducible environment
- Good for team development

---

## 🆘 Troubleshooting

### Build Fails

**Error:** `npm: command not found`
- Install Node.js 16+

**Error:** `Module not found`
- Check `frontend/` directory structure
- Verify `package.json` exists

### Deployment Issues

**404 Error:**
- Verify build directory: `frontend/dist`
- Check `amplify.yml` is correct
- Ensure `VITE_DEMO_MODE=true` is set

**Blank Page:**
- Open browser console (F12)
- Check for JavaScript errors
- Verify API URL if using backend

### Demo Mode Not Working

**Symptoms:** Loading forever, errors in console

**Fix:**
1. Verify `VITE_DEMO_MODE=true` in environment variables
2. Check `mockApi.js` was included in build
3. Rebuild and redeploy

---

## 📚 Additional Resources

- [AWS Amplify Docs](https://docs.amplify.aws/)
- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com/)
- [Heroku Docs](https://devcenter.heroku.com/)

---

## ✅ Deployment Checklist

Before deploying:

- [ ] Choose deployment platform
- [ ] Set up hosting account
- [ ] Push code to GitHub (if using Git deployment)
- [ ] Configure build settings
- [ ] Set environment variables
- [ ] Deploy and test
- [ ] Verify all pages work
- [ ] Check mobile responsiveness
- [ ] Add custom domain (optional)
- [ ] Update README with live URL

---

**Need help?** Open an issue on GitHub or check the troubleshooting section above.
