# NebulaDB Cloud Deployment Guide

## Deploy to Cloud (No Local Installation Required)

### Option A: Railway + Vercel (Recommended - Free Tier)

#### Step 1: Deploy Backend to Railway

1. **Create Railway Account**
   - Go to: https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your GitHub account
   - Push NebulaDB code to GitHub first

3. **Add PostgreSQL Database**
   - In Railway project, click "New"
   - Select "Database" → "PostgreSQL"
   - Railway will auto-provision the database

4. **Deploy Backend Service**
   - Click "New" → "GitHub Repo"
   - Select NebulaDB repository
   - Set root directory: `backend/metadata-api`
   - Add environment variables:
     ```
     PORT=8080
     DATABASE_URL=${{Postgres.DATABASE_URL}}
     JWT_SECRET=your-secret-key-here
     ENVIRONMENT=production
     ```

5. **Get Backend URL**
   - Railway will provide a URL like: `https://your-app.railway.app`
   - Copy this URL

#### Step 2: Deploy Frontend to Vercel

1. **Create Vercel Account**
   - Go to: https://vercel.com
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Framework: Next.js (auto-detected)
   - Root Directory: `frontend`

3. **Configure Environment**
   - Add environment variable:
     ```
     NEXT_PUBLIC_API_URL=https://your-app.railway.app/api/v1
     ```
   - Replace with your Railway backend URL

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically
   - You'll get a URL like: `https://nebuladb.vercel.app`

### Option B: Render (All-in-One)

1. **Create Render Account**
   - Go to: https://render.com
   - Sign up with GitHub

2. **Create PostgreSQL Database**
   - Dashboard → "New" → "PostgreSQL"
   - Name: nebuladb-postgres
   - Copy the Internal Database URL

3. **Deploy Backend**
   - "New" → "Web Service"
   - Connect GitHub repository
   - Root Directory: `backend/metadata-api`
   - Build Command: `go build -o main .`
   - Start Command: `./main`
   - Environment Variables:
     ```
     DATABASE_URL=<your-postgres-url>
     JWT_SECRET=your-secret-key
     PORT=8080
     ```

4. **Deploy Frontend**
   - "New" → "Static Site"
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `.next`
   - Environment Variable:
     ```
     NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api/v1
     ```

### Option C: Heroku (Classic)

1. **Install Heroku CLI**
   ```bash
   # Download from: https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Deploy Backend**
   ```bash
   cd backend/metadata-api
   heroku create nebuladb-api
   heroku addons:create heroku-postgresql:mini
   git push heroku main
   ```

3. **Deploy Frontend**
   ```bash
   cd frontend
   heroku create nebuladb-frontend
   heroku config:set NEXT_PUBLIC_API_URL=https://nebuladb-api.herokuapp.com/api/v1
   git push heroku main
   ```

## Quick Deploy with Railway (Fastest)

### One-Click Deploy Button

Add this to your GitHub README:

```markdown
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/yourusername/nebuladb)
```

### Railway Template Configuration

Create `railway.json`:
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "cd backend/metadata-api && go run main.go",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

## Environment Variables Reference

### Backend (.env)
```bash
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=your-256-bit-secret-key
STRIPE_SECRET_KEY=sk_test_your_key
PORT=8080
ENVIRONMENT=production
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api/v1
```

## Post-Deployment Setup

1. **Initialize Database**
   - Connect to your PostgreSQL database
   - Run the schema from: `docs/database-schema.sql`

2. **Test the Deployment**
   ```bash
   # Health check
   curl https://your-backend-url.com/api/v1/health
   
   # Register user
   curl -X POST https://your-backend-url.com/api/v1/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@example.com","password":"test123"}'
   ```

3. **Access Your Application**
   - Frontend: https://your-frontend-url.vercel.app
   - Backend API: https://your-backend-url.railway.app/api/v1

## Cost Estimates

### Free Tier Limits
- **Railway**: 500 hours/month, $5 credit
- **Vercel**: Unlimited deployments, 100GB bandwidth
- **Render**: 750 hours/month free

### Paid Plans (if needed)
- **Railway Pro**: $5/month + usage
- **Vercel Pro**: $20/month
- **Render**: $7/month per service

## Troubleshooting

### Backend won't start
- Check DATABASE_URL is set correctly
- Verify Go version in build logs
- Check Railway/Render logs for errors

### Frontend can't connect to backend
- Verify NEXT_PUBLIC_API_URL is correct
- Check CORS settings in backend
- Ensure backend is running and accessible

### Database connection fails
- Verify DATABASE_URL format
- Check database is provisioned
- Ensure SSL mode is correct

## Monitoring

### Railway Dashboard
- View logs: Project → Service → Logs
- Metrics: CPU, Memory, Network usage
- Deployments: History and rollback

### Vercel Dashboard
- Analytics: Page views, performance
- Logs: Function logs and errors
- Deployments: Preview and production

## Next Steps

1. Push code to GitHub
2. Connect Railway for backend
3. Connect Vercel for frontend
4. Configure environment variables
5. Deploy and test
6. Share your live URL!

Your NebulaDB instance will be live at:
- https://nebuladb.vercel.app (frontend)
- https://nebuladb-api.railway.app (backend)