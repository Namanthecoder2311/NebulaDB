# NebulaDB Frontend Deployment Guide

## Deploy Frontend to Cloud (No Backend Required)

### Option A: Vercel (Recommended - Free Tier)

#### Deploy Frontend to Vercel

1. **Create Vercel Account**
   - Go to: https://vercel.com
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Framework: Next.js (auto-detected)
   - Root Directory: `frontend`

3. **Configure Environment** (Optional)
   - Add environment variables if needed:
     ```
     NEXTAUTH_SECRET=your-nextauth-secret
     NEXTAUTH_URL=https://your-app.vercel.app
     ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically
   - You'll get a URL like: `https://nebuladb.vercel.app`

### Option B: Netlify

1. **Create Netlify Account**
   - Go to: https://netlify.com
   - Sign up with GitHub

2. **Deploy Frontend**
   - "Add new site" → "Import an existing project"
   - Connect GitHub repository
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Framework preset: Next.js (auto-detected)

### Option C: GitHub Pages (Static Export)

1. **Configure Next.js for Static Export**
   ```javascript
   // next.config.js
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     output: 'export',
     trailingSlash: true,
     images: {
       unoptimized: true
     }
   }
   
   module.exports = nextConfig
   ```

2. **Deploy to GitHub Pages**
   - Enable GitHub Pages in repository settings
   - Set source to GitHub Actions
   - Push code to trigger deployment

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