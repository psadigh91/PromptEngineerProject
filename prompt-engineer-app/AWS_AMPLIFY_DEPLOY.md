# 🚀 AWS Amplify Deployment Guide

## Quick Fix for Your Current Issue

Your app is showing a 404 because Amplify doesn't know how to build the project. Here's the fix:

### Option 1: Demo Mode (Easiest - Frontend Only) ✅

This creates a **working demo** without needing a backend!

#### Step 1: Update Your Amplify Build Settings

1. Go to your Amplify console: https://console.aws.amazon.com/amplify/
2. Click on your app
3. Go to "App settings" → "Build settings"
4. Replace the build specification with this:

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

5. Click "Save"

#### Step 2: Add Environment Variable

1. In Amplify console → "Environment variables"
2. Add: `VITE_DEMO_MODE` = `true`
3. Save

#### Step 3: Redeploy

1. Click "Redeploy this version" or push a new commit
2. Wait for build to complete (~3-5 minutes)
3. Your app will work in **DEMO MODE**!

### What is Demo Mode?

- ✅ **Full UI works** - All pages, components, animations
- ✅ **Mock data** - Uses simulated API responses
- ✅ **Perfect for portfolio** - Shows your skills
- ✅ **No backend needed** - Pure static site
- ⚠️ **Data doesn't persist** - Refreshing resets everything

This is **perfect for showcasing your work** on Amplify!

---

## Option 2: Full Stack Deployment (More Complex)

If you want **real backend** functionality with data persistence:

### Frontend (Amplify)

Use the same build settings as Option 1, but:

1. Set `VITE_DEMO_MODE` = `false`
2. Set `VITE_API_URL` = your backend URL (see below)

### Backend Options

#### A. Heroku (Easiest for Python)

```bash
# In your project root
cd backend

# Create Procfile
echo "web: uvicorn main:app --host 0.0.0.0 --port \$PORT" > Procfile

# Create runtime.txt
echo "python-3.11.0" > runtime.txt

# Deploy
heroku create your-app-name
git subtree push --prefix backend heroku main
```

Your backend URL: `https://your-app-name.herokuapp.com`

#### B. AWS Lambda + API Gateway

More complex but stays in AWS. Would need to convert FastAPI to Lambda handlers.

#### C. Railway.app (Alternative to Heroku)

```bash
# Install Railway CLI
npm i -g @railway/cli

# Deploy backend
cd backend
railway login
railway init
railway up
```

Get your URL from Railway dashboard.

---

## Testing Your Deployment

### Demo Mode (Option 1)

After deployment, test these:

1. ✅ **Home page loads**
2. ✅ **Enter a prompt** → Click "Analyze"
3. ✅ **See analysis results**
4. ✅ **Answer questions**
5. ✅ **Get optimized prompt**
6. ✅ **Save to library** (won't persist on refresh)
7. ✅ **Library page** shows sample prompts

You should see a banner: **"Demo Mode: Changes won't be saved"**

### Full Stack (Option 2)

All features work + data persists.

---

## Troubleshooting

### Build Fails on Amplify

**Error:** `npm ERR! enoent ENOENT: no such file or directory`

**Fix:** Make sure `frontend/package.json` exists. Check the `baseDirectory` in build settings points to `frontend/dist`.

**Error:** `Module not found: Can't resolve './mockApi'`

**Fix:** Make sure `frontend/src/services/mockApi.js` exists in your zip file.

### App Shows Blank Page

1. Check browser console for errors (F12)
2. Verify `VITE_DEMO_MODE=true` is set in Amplify environment variables
3. Check Amplify build logs for warnings

### "Demo Mode" works but I want real backend

Follow **Option 2** above to deploy backend separately, then update `VITE_API_URL` and set `VITE_DEMO_MODE=false`.

---

## Current Issue - Your Amplify Deployment

Based on your screenshot, here's what happened:

1. ❌ Amplify tried to deploy the **root directory**
2. ❌ No `package.json` found at root (it's in `frontend/`)
3. ❌ No build instructions provided
4. ❌ Result: 404 error

**The Fix:**

1. Add `amplify.yml` (already created for you)
2. Redeploy
3. App will work in demo mode!

---

## Quick Commands

### Redeploy from GitHub

```bash
# Commit the amplify.yml file
cd prompt-engineer-app
git add amplify.yml frontend/.env.production frontend/src/services/mockApi.js
git commit -m "Add Amplify build config and demo mode"
git push origin main
```

Amplify will auto-detect and rebuild.

### Manual Redeploy in Amplify Console

1. Go to your app
2. Click "Redeploy this version"
3. Wait ~3 minutes
4. Visit your URL

---

## Expected Result

After following Option 1, visiting `https://staging.d1a9rwz0d7hjvm.amplifyapp.com/` should show:

- ✅ Beautiful landing page
- ✅ Working navigation
- ✅ Prompt input that analyzes
- ✅ Interactive question flow
- ✅ Optimized prompt results
- ✅ Sample library with 3 prompts

---

## Next Steps

1. **Now:** Deploy in Demo Mode (Option 1)
2. **Later:** Deploy backend separately (Option 2) if you want persistence
3. **Share:** Add the live URL to your portfolio/GitHub README

---

## Files You Need

All these are already in your zip:

✅ `amplify.yml` - Build configuration
✅ `frontend/.env.production` - Environment config
✅ `frontend/src/services/mockApi.js` - Mock API for demo mode
✅ Updated `frontend/src/services/api.js` - Supports both modes

Just upload to GitHub and reconnect Amplify, or use the build settings above!

---

**You're 5 minutes away from a working demo! 🚀**
