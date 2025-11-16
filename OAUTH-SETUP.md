# OAuth Setup Guide

## Google OAuth Setup (5 minutes)

1. Go to https://console.cloud.google.com/
2. Click "Select a project" → "New Project" → Name it "NebulaDB" → Create
3. Wait for project creation, then select it
4. Go to "APIs & Services" → "OAuth consent screen"
5. Select "External" → Click "Create"
6. Fill in:
   - App name: NebulaDB
   - User support email: your-email@gmail.com
   - Developer contact: your-email@gmail.com
   - Click "Save and Continue" (skip scopes)
   - Click "Save and Continue" (skip test users)
7. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
8. Select "Web application"
9. Add Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
10. Click "Create"
11. Copy the Client ID and Client Secret

## GitHub OAuth Setup

1. Go to [GitHub Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in:
   - Application name: NebulaDB
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Client Secret to `.env.local`

## Update .env.local

Replace the placeholder values:

```env
GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123def456

GITHUB_CLIENT_ID=Iv1.abc123def456
GITHUB_CLIENT_SECRET=abc123def456ghi789
```

**IMPORTANT:** Restart your dev server after updating!

```bash
Ctrl+C (stop server)
npm run dev (start again)
```
