# Quick Start - AWS Deployment

Quick reference for deploying Vhodly app to Amazon Web Services.

## Prerequisites Checklist

- [ ] AWS account created with billing enabled
- [ ] Domain purchased
- [ ] AWS CLI installed and configured (`aws configure`)
- [ ] Docker installed
- [ ] Node.js 20+ installed

## 5-Minute Deployment

### 1. Backend (App Runner)

```bash
cd vhodly-api

# Get your AWS Account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Windows PowerShell:
.\deploy-aws.ps1 -Region "eu-central-1" -Domain "yourdomain.com" -AccountId $ACCOUNT_ID

# Linux/Mac/Git Bash:
chmod +x deploy-aws.sh
./deploy-aws.sh eu-central-1 yourdomain.com $ACCOUNT_ID
```

**Then:**
1. Go to [AWS App Runner Console](https://console.aws.amazon.com/apprunner/)
2. Create new service using the ECR image
3. Configure environment variables (see deployment guide)
4. **Save the App Runner URL** - you'll need it for frontend!

### 2. Frontend (Amplify Hosting)

```bash
cd vhodly-app

# Update API URL in environment.prod.ts
# Replace YOUR_DOMAIN with your actual domain

# Deploy via Amplify Console:
# 1. Go to https://console.aws.amazon.com/amplify/
# 2. New app → Connect GitHub or Deploy without Git
# 3. Follow setup wizard
```

### 3. Configure DNS

**In your domain registrar (Cloudflare/Route 53/etc):**

1. **Frontend (Amplify):**
   - Go to Amplify Console → Domain management
   - Add custom domain
   - Add DNS records provided by Amplify

2. **Backend (App Runner):**
   - In App Runner service → Custom domains
   - Associate `api.yourdomain.com`
   - Add DNS records provided

### 4. Verify

- Frontend: `https://yourdomain.com`
- Backend: `https://api.yourdomain.com/api/docs`

## Common Commands

### Update Backend Environment Variables
```bash
# Update via AWS Console (App Runner → Configuration → Environment variables)
# Or use AWS CLI (see deployment guide)
```

### View Backend Logs
```bash
aws logs tail /aws/apprunner/vhodly-api --follow --region eu-central-1
```

### Redeploy Frontend
```bash
cd vhodly-app
npm run build:prod
# Then trigger deployment in Amplify Console or use CLI
```

### Check App Runner Status
```bash
aws apprunner list-services --region eu-central-1
```

## Troubleshooting

**CORS Errors?**
- Update `CORS_ORIGIN` environment variable in App Runner to match your frontend domain

**404 on Routes?**
- Check `amplify.yml` has correct build configuration
- Verify `environment.prod.ts` has correct API URL

**DNS Not Working?**
- Wait 5-60 minutes for propagation
- Verify DNS records are correct
- Use `nslookup yourdomain.com` to check

**Build Fails?**
- Check Amplify build logs
- Verify Node.js version matches (20+)
- Check `package.json` dependencies

## Full Documentation

See [AWS_DEPLOYMENT_GUIDE.md](./AWS_DEPLOYMENT_GUIDE.md) for detailed instructions.
