# Railway Deployment Guide

This guide provides detailed instructions for deploying your Angular application to Railway.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Railway Setup](#railway-setup)
3. [Configuration Files](#configuration-files)
4. [Deployment Steps](#deployment-steps)
5. [Environment Variables](#environment-variables)
6. [Custom Domain Setup](#custom-domain-setup)
7. [Troubleshooting](#troubleshooting)
8. [Monitoring and Logs](#monitoring-and-logs)

## Prerequisites

Before deploying to Railway, ensure you have:

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **GitHub Account**: Your code should be in a GitHub repository
3. **Node.js**: Railway will automatically detect Node.js (version 20+ recommended)
4. **Git**: To push your code to GitHub

## Railway Setup

### Step 1: Create a Railway Account

1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"** or **"Login"**
3. Sign up using GitHub (recommended for easy integration)

### Step 2: Create a New Project

1. In Railway dashboard, click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your repository (`vhodly-app` or the repository containing your Angular app)
4. Railway will automatically detect it's a Node.js project

### Step 3: Configure the Service

Railway will automatically:
- Detect the `railway.json` configuration file
- Use the build command: `npm ci && npm run build`
- Use the start command: `npm run start:server`
- Set up the service on a default port

## Configuration Files

The following files have been created/configured for Railway deployment:

### 1. `nixpacks.toml` (Node.js Version Configuration)

Located at: `vhodly-app/nixpacks.toml`

```toml
[phases.setup]
nixPkgs = ["nodejs-20_x"]

[phases.install]
cmds = ["npm ci"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npm run start:server"
```

**What it does:**
- **CRITICAL**: Forces Railway/Nixpacks to use Node.js 20.x (required for Angular 21)
- Defines the build phases explicitly
- Ensures correct Node.js version is used during build

**Why this is needed:**
- Angular 21 requires Node.js >=20.19.0
- Railway's default Node.js version may be older (18.x)
- This file ensures the correct version is used

### 2. `.nvmrc`

Located at: `vhodly-app/.nvmrc`

```
20
```

**What it does:**
- Specifies Node.js version 20 for NVM (Node Version Manager)
- Provides a fallback method for Node.js version detection
- Works alongside `nixpacks.toml` for maximum compatibility

### 3. `railway.json`

Located at: `vhodly-app/railway.json`

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm ci && npm run build"
  },
  "deploy": {
    "startCommand": "npm run start:server",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**What it does:**
- Uses Nixpacks builder (Railway's default)
- Runs `npm ci` to install dependencies
- Builds the Angular app with `npm run build`
- Starts the Express server with `npm run start:server`
- Configures automatic restart on failure

### 4. `package.json` (Updated)

Located at: `vhodly-app/package.json`

Added `engines` field:
```json
"engines": {
  "node": ">=20.19.0",
  "npm": ">=8.0.0"
}
```

**What it does:**
- Documents the required Node.js and npm versions
- Provides additional validation for version requirements
- Helps tools and platforms understand version needs

### 5. `server.js`

Located at: `vhodly-app/server.js`

A simple Express server that:
- Serves static files from the Angular build output (`dist/vhodly-app/browser`)
- Handles Angular routing by returning `index.html` for all routes
- Uses the `PORT` environment variable (Railway provides this automatically)

### 3. Updated `package.json`

Added:
- `express` dependency (production dependency)
- `start:server` script to run the Express server

## Deployment Steps

### Automatic Deployment (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Configure Railway deployment"
   git push origin main
   ```

2. **Railway will automatically:**
   - Detect the push to your repository
   - Start building your application
   - Deploy it once the build succeeds

3. **Monitor the deployment:**
   - Go to your Railway project dashboard
   - Click on your service
   - View the **"Deployments"** tab to see build logs
   - View the **"Logs"** tab for runtime logs

### Manual Deployment

If you need to trigger a deployment manually:

1. Go to your Railway project dashboard
2. Click on your service
3. Click **"Deploy"** → **"Redeploy"**

## Environment Variables

Railway automatically provides:
- `PORT`: The port your application should listen on (automatically handled by `server.js`)
- `RAILWAY_ENVIRONMENT`: The environment name (production, preview, etc.)

### Adding Custom Environment Variables

If your Angular app needs environment variables:

1. **Create environment files** (if not already present):
   - `src/environments/environment.ts` (development)
   - `src/environments/environment.prod.ts` (production)

2. **In Railway Dashboard:**
   - Go to your service
   - Click **"Variables"** tab
   - Add your environment variables
   - Example: `API_URL=https://api.example.com`

3. **Use in Angular:**
   - Access via `environment.apiUrl` in your components/services
   - Note: Angular environment files are replaced at build time, not runtime

### Runtime Environment Variables (Advanced)

If you need runtime environment variables (not build-time), you'll need to:

1. Create an API endpoint in your Express server to serve config
2. Load config in Angular on app initialization
3. See [Angular Runtime Configuration Guide](https://angular.io/guide/build#configuring-application-environments)

## Custom Domain Setup

### Step 1: Add Custom Domain in Railway

1. Go to your service in Railway dashboard
2. Click **"Settings"** tab
3. Scroll to **"Networking"** section
4. Click **"Generate Domain"** or **"Add Custom Domain"**

### Step 2: Configure DNS

For Railway-generated domain:
- No DNS configuration needed
- Railway provides a domain like: `your-app.up.railway.app`

For custom domain:
1. Add a CNAME record in your DNS provider:
   - **Name**: `@` or `www` (or subdomain)
   - **Value**: Your Railway service domain (e.g., `your-app.up.railway.app`)
2. Railway will automatically provision SSL certificates

### Step 3: Update Base Href (if needed)

If using a custom domain at root (`https://yourdomain.com`):
- Your `index.html` already has `<base href="/" />` which is correct
- No changes needed

If using a subdirectory:
- Update `index.html`: `<base href="/subdirectory/" />`
- Update `angular.json` build configuration

## Troubleshooting

### Build Fails

**Error: "npm warn EBADENGINE Unsupported engine" or "Node.js version mismatch"**
- **Symptom**: Warnings about unsupported Node.js engine, build fails or Angular packages complain
- **Cause**: Railway is using Node.js 18.x but Angular 21 requires Node.js >=20.19.0
- **Solution**: 
  - Ensure `nixpacks.toml` exists with `nixPkgs = ["nodejs-20_x"]`
  - Verify `.nvmrc` contains `20`
  - Check `package.json` has `engines.node: ">=20.19.0"`
  - Redeploy after committing these files
  - Railway should now use Node.js 20.x

**Error: "npm ci failed"**
- Check that `package-lock.json` exists and is committed
- Ensure Node.js version compatibility (Railway uses Node 20+)
- Verify `nixpacks.toml` specifies Node.js 20

**Error: "ng build failed"**
- Check build logs in Railway dashboard
- Verify all dependencies are in `package.json`
- Check for TypeScript errors locally: `npm run build`

**Error: "Cannot find module 'express'"**
- Ensure `express` is in `dependencies` (not `devDependencies`)
- Railway only installs production dependencies by default

### Application Won't Start

**Error: "Port already in use"**
- Railway automatically sets `PORT` environment variable
- Ensure `server.js` uses `process.env.PORT || 4200`

**Error: "Cannot find dist folder"**
- Verify build completed successfully
- Check that build output path matches `server.js` path
- Default Angular output: `dist/vhodly-app/browser`

**404 Errors on Routes**
- Ensure `server.js` handles all routes with `app.get('*', ...)`
- Verify Express is serving `index.html` for all non-file routes

### Assets Not Loading

**Images/CSS not loading:**
- Check that assets are in `public` folder (configured in `angular.json`)
- Verify base href is correct (`/` for root domain)
- Check browser console for 404 errors

### Performance Issues

**Slow builds:**
- Railway caches `node_modules` between builds
- Consider using `.railwayignore` to exclude unnecessary files

**Slow startup:**
- Ensure production build (`npm run build` uses production by default)
- Check that unnecessary dev dependencies aren't installed

## Monitoring and Logs

### Viewing Logs

1. **Real-time logs:**
   - Go to Railway dashboard → Your service → **"Logs"** tab
   - Shows stdout/stderr from your application

2. **Build logs:**
   - Go to Railway dashboard → Your service → **"Deployments"** tab
   - Click on a deployment to see build logs

### Metrics

Railway provides:
- **CPU Usage**: Monitor in the service dashboard
- **Memory Usage**: View in the service dashboard
- **Network Traffic**: Available in the metrics section

### Alerts

Set up alerts in Railway:
1. Go to your service → **"Settings"**
2. Configure alerts for:
   - Build failures
   - Service crashes
   - High resource usage

## Railway-Specific Features

### Preview Deployments

Railway automatically creates preview deployments for:
- Pull requests (if connected to GitHub)
- Feature branches

To enable:
1. Go to service → **"Settings"**
2. Enable **"Preview Deployments"**

### Health Checks

Railway automatically checks if your service is responding on the configured port.

To add custom health check endpoint:

1. **Update `server.js`:**
   ```javascript
   app.get('/health', (req, res) => {
     res.json({ status: 'ok', timestamp: new Date().toISOString() });
   });
   ```

2. **Configure in Railway:**
   - Service → **"Settings"** → **"Healthcheck Path"**
   - Set to: `/health`

### Database (if needed)

If you need a database:
1. Click **"New"** → **"Database"** in Railway
2. Choose PostgreSQL, MySQL, MongoDB, etc.
3. Railway automatically provides connection string as environment variable
4. Use in your Angular app's backend API (if you add one)

## Cost Considerations

Railway offers:
- **Free Tier**: $5 credit per month
- **Hobby Plan**: $5/month for additional resources
- **Pro Plan**: $20/month for teams

For a static Angular app with Express server:
- Typically fits within free tier
- Uses minimal resources
- Check Railway pricing: [railway.app/pricing](https://railway.app/pricing)

## Additional Resources

- [Railway Documentation](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)
- [Express.js Documentation](https://expressjs.com)
- [Angular Deployment Guide](https://angular.io/guide/deployment)

## Quick Reference

### Important Files
- `vhodly-app/nixpacks.toml` - **CRITICAL**: Forces Node.js 20.x (required for Angular 21)
- `vhodly-app/.nvmrc` - Specifies Node.js version 20
- `vhodly-app/railway.json` - Railway configuration
- `vhodly-app/server.js` - Express server for serving Angular app
- `vhodly-app/package.json` - Contains build and start scripts, engines specification

### Key Commands
- Build: `npm ci && npm run build`
- Start: `npm run start:server`
- Local test: `npm run build && npm run start:server`

### Important Paths
- Build output: `dist/vhodly-app/browser`
- Server file: `server.js`
- Angular source: `src/`

---

**Need Help?**
- Check Railway logs first
- Review this guide's troubleshooting section
- Consult Railway documentation
- Join Railway Discord community
