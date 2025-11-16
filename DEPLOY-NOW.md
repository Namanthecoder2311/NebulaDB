# 🚀 Deploy NebulaDB Now (5 Minutes)

## Step-by-Step Deployment

### 1️⃣ Push to GitHub (2 minutes)

```bash
cd d:\Projects\NebulaDB

# Initialize git
git init
git add .
git commit -m "Initial commit - NebulaDB MVP"

# Create GitHub repo and push
# Go to: https://github.com/new
# Create repository named: nebuladb
# Then run:
git remote add origin https://github.com/YOUR_USERNAME/nebuladb.git
git branch -M main
git push -u origin main
```

### 2️⃣ Deploy Backend to Railway (2 minutes)

1. Go to: https://railway.app
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `nebuladb` repository
5. Click "Add Variables":
   ```
   PORT=8080
   JWT_SECRET=nebuladb-secret-key-2024
   ENVIRONMENT=production
   ```
6. Click "Add PostgreSQL" from the dashboard
7. Railway will auto-connect the database
8. Click "Deploy"
9. Copy your Railway URL (e.g., `nebuladb-api.railway.app`)

### 3️⃣ Deploy Frontend to Vercel (1 minute)

1. Go to: https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub `nebuladb` repository
4. Framework Preset: Next.js (auto-detected)
5. Root Directory: `frontend`
6. Add Environment Variable:
   ```
   NEXT_PUBLIC_API_URL=https://YOUR-RAILWAY-URL.railway.app/api/v1
   ```
7. Click "Deploy"
8. Wait 2 minutes for build to complete

### 4️⃣ Initialize Database

Connect to Railway PostgreSQL and run:

```sql
-- Copy and paste from: docs/database-schema.sql
-- Or use Railway's built-in SQL editor
```

### 5️⃣ Test Your Deployment

Visit your Vercel URL (e.g., `nebuladb.vercel.app`)

1. Click "Sign Up"
2. Create an account
3. Create a project
4. Create a database
5. Try the SQL editor
6. Test the API explorer

## 🎉 You're Live!

Your NebulaDB instance is now running at:
- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-app.railway.app

## Alternative: One-Click Deploy

### Railway Template
Click this button to deploy everything:

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/nebuladb)

### Vercel Template
Click this button for frontend:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/nebuladb)

## Troubleshooting

### Backend not starting?
- Check Railway logs
- Verify DATABASE_URL is set
- Ensure PostgreSQL is running

### Frontend can't connect?
- Verify NEXT_PUBLIC_API_URL is correct
- Check backend is deployed and running
- Test backend health: `https://your-backend.railway.app/api/v1/health`

### Database errors?
- Run the schema SQL in Railway PostgreSQL
- Check connection string format
- Verify database is provisioned

## Free Tier Limits

✅ **Railway**: 500 hours/month free
✅ **Vercel**: Unlimited deployments
✅ **PostgreSQL**: 1GB storage free

Perfect for MVP and testing!

## Next Steps

1. Share your live URL
2. Invite team members
3. Configure custom domain
4. Set up monitoring
5. Add Stripe keys for billing

## Support

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- NebulaDB Docs: See `/docs` folder

Your serverless PostgreSQL BaaS is now live! 🎊