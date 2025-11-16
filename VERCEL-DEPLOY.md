# Deploy NebulaDB to Vercel (No Localhost!)

## Quick Deploy (5 minutes)

### Step 1: Push to GitHub
```bash
cd d:\Projects\NebulaDB
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/nebuladb.git
git push -u origin main
```

### Step 2: Deploy to Vercel
1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: Next.js
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`

### Step 3: Add Environment Variables
In Vercel dashboard, add these:
```
NEXTAUTH_SECRET=your-random-secret-key-here
NEXTAUTH_URL=https://your-app.vercel.app
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### Step 4: Update OAuth Redirect URLs
**Google Cloud Console:**
- Add: `https://your-app.vercel.app/api/auth/callback/google`

**GitHub OAuth:**
- Add: `https://your-app.vercel.app/api/auth/callback/github`

### Step 5: Deploy!
Click "Deploy" and wait 2-3 minutes.

## Your Live URLs
- **Frontend**: `https://your-app.vercel.app`
- **API**: `https://your-app.vercel.app/api/*`
- **Dashboard**: `https://your-app.vercel.app/dashboard`

## Features Working Without Backend
✅ Authentication (Email/Password, Google, GitHub)
✅ CRUD Operations (Create, Read, Update, Delete)
✅ API Keys Management
✅ Team Management
✅ Backups
✅ Webhooks
✅ Import/Export
✅ Activity Logs
✅ Settings
✅ All UI Features

## Auto-Deploy
Every `git push` automatically deploys to Vercel!

## Custom Domain (Optional)
1. Go to Vercel Project Settings
2. Add your domain (e.g., nebuladb.com)
3. Update DNS records
4. Done!

## Local Development (Optional)
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:3000

## Production Ready
- ✅ No localhost needed
- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ Serverless functions
- ✅ Edge network
- ✅ Zero configuration
