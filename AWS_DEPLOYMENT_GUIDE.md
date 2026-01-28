# AWS Deployment Guide - Vhodly App

Complete step-by-step guide to deploy your Vhodly app (Angular + NestJS) to Amazon Web Services with a custom domain.

> **🚀 CI/CD with GitHub Actions**: This guide uses GitHub Actions for automated deployments. **You don't need Docker or Node.js installed locally** - all builds happen automatically in GitHub Actions when you push to your repository. After initial setup, simply push your code and deployments happen automatically!

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: AWS Account & Setup](#step-1-aws-account--setup)
3. [Step 2: Domain Purchase](#step-2-domain-purchase)
4. [Step 3: Initial Backend Setup (App Runner)](#step-3-initial-backend-setup-app-runner)
5. [Step 4: Initial Frontend Setup (Amplify Hosting)](#step-4-initial-frontend-setup-amplify-hosting)
6. [Step 5: CI/CD Setup with GitHub Actions](#step-5-cicd-setup-with-github-actions)
7. [Step 6: DNS Configuration](#step-6-dns-configuration)
8. [Step 7: Verify Deployment](#step-7-verify-deployment)
9. [Troubleshooting](#troubleshooting)
10. [Cost Estimation](#cost-estimation)

---

## Prerequisites

Before starting, ensure you have:

- [ ] AWS account created
- [ ] Credit card for AWS billing (free tier available)
- [ ] Domain name selected
- [ ] GitHub repository with your code
- [ ] Git installed
- [ ] Basic command line knowledge

**Note**: This guide uses GitHub Actions for CI/CD, so you don't need Docker or Node.js installed locally. All builds happen automatically in GitHub Actions when you push to your repository.

---

## Step 1: AWS Account & Setup

### 1.1 Create AWS Account

1. Go to [Amazon Web Services](https://aws.amazon.com/)
2. Click **"Create an AWS Account"**
3. Complete account setup:
   - Enter email and password
   - Enter contact information
   - Add payment method (you'll get $200 free credits for 6 months)
   - Verify your identity
   - Choose a support plan (Basic is free)

### 1.2 Configure AWS CLI

**Install AWS CLI:**

**Windows:**
```powershell
# Download MSI installer from:
# https://awscli.amazonaws.com/AWSCLIV2.msi

# Or use Chocolatey:
choco install awscli
```

**macOS:**
```bash
# Using Homebrew:
brew install awscli
```

**Linux:**
```bash
# Download installer:
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

**Verify installation:**
```bash
aws --version
```

### 1.3 Configure AWS Credentials

1. **Get AWS Access Keys:**
   - Go to [AWS Console](https://console.aws.amazon.com/)
   - Click your username → **Security credentials**
   - Scroll to **Access keys** section
   - Click **"Create access key"**
   - Choose **"Command Line Interface (CLI)"**
   - Download or copy the access key ID and secret access key

2. **Configure AWS CLI:**
   ```bash
   aws configure
   ```
   
   Enter:
   - **AWS Access Key ID**: Your access key
   - **AWS Secret Access Key**: Your secret key
   - **Default region**: `eu-central-1` (or your preferred region)
   - **Default output format**: `json`

3. **Verify configuration:**
   ```bash
   aws sts get-caller-identity
   ```

### 1.4 Set Up IAM User (Recommended)

For better security, create a dedicated IAM user:

1. Go to **IAM** → **Users** → **Create user**
2. Enter username: `vhodly-deployment`
3. Select **"Provide user access to the AWS Management Console"** (optional)
4. Attach policies:
   - `AmazonEC2ContainerRegistryFullAccess`
   - `AWSAppRunnerServiceRolePolicy`
   - `AWSAppRunnerFullAccess`
   - `AmplifyFullAccess`
   - `AmazonS3FullAccess`
   - `CloudFrontFullAccess`
   - `Route53FullAccess`
5. Create access keys for this user
6. Configure AWS CLI with these credentials

---

## Step 2: Domain Purchase

### 2.1 Choose Domain Registrar

**Recommended: Cloudflare Registrar**
- **Cost**: ~$8-10/year (at-cost pricing)
- **Benefits**: Free DNS, DDoS protection, CDN
- **URL**: https://www.cloudflare.com/products/registrar/

**Alternative Options:**
- **Route 53**: ~$12/year (AWS native, easier integration)
- **Namecheap**: ~$10-15/year
- **GoDaddy**: ~$12-15/year

### 2.2 Purchase Domain

1. Go to your chosen registrar
2. Search for your desired domain name
3. Add to cart and complete purchase
4. **Important**: Note your domain registrar's DNS management interface

### 2.3 Domain Configuration

- **If using Route 53**: Domain will be managed in AWS
- **If using Cloudflare**: Domain will automatically use Cloudflare DNS
- **If using other registrars**: You'll configure DNS in their interface
- **Keep DNS management access ready** - you'll need it in Step 5

---

## Step 3: Initial Backend Setup (App Runner)

This step sets up the initial App Runner service. After CI/CD is configured in Step 5, all future deployments will happen automatically via GitHub Actions.

### 3.1 Create ECR Repository

AWS App Runner needs a container image in Amazon ECR:

1. **Create ECR repository:**
   ```bash
   aws ecr create-repository \
     --repository-name vhodly-api \
     --region eu-central-1 \
     --image-scanning-configuration scanOnPush=true
   ```

2. **Get repository URI:**
   ```bash
   aws ecr describe-repositories \
     --repository-names vhodly-api \
     --region eu-central-1 \
     --query 'repositories[0].repositoryUri' \
     --output text
   ```

   **Save this URI** - you'll need it for GitHub secrets!

### 3.2 Initial Deployment to App Runner

For the initial deployment, you have two options:

**Option A: Deploy via GitHub Actions (Recommended)**

1. Set up GitHub secrets first (see Step 5)
2. Push your code to trigger the workflow
3. The GitHub Action will build and deploy automatically

**Option B: Manual Initial Deployment via AWS Console**

If you need to deploy before setting up CI/CD:

1. Go to [AWS App Runner Console](https://console.aws.amazon.com/apprunner/)
2. Click **"Create service"**
3. Choose **"Source code repository"** → **"GitHub"** (or use ECR if you've already pushed an image)
4. Follow the prompts to connect your repository
5. Configure the service (see details below)

### 3.3 Configure App Runner Service

When creating the App Runner service, configure:

1. **Service name**: `vhodly-api`
2. **Virtual CPU**: `1 vCPU`
3. **Memory**: `2 GB`
4. **Port**: `3000`
5. **Environment variables**:
   - `NODE_ENV` = `production`
   - `PORT` = `3000`
   - `CORS_ORIGIN` = `https://yourdomain.com` (update with your actual domain)
6. **Auto-scaling**:
   - **Min concurrency**: `10`
   - **Max concurrency**: `100`
   - **Min capacity**: `1`
   - **Max capacity**: `10`
7. **Auto-deployments**: Set to `false` initially (we'll use GitHub Actions for deployments)

**Note**: After initial setup, all deployments will be handled automatically by GitHub Actions when you push to your repository.

### 3.4 Get App Runner Service URL

1. Go to [App Runner Console](https://console.aws.amazon.com/apprunner/)
2. Click on your service: `vhodly-api`
3. Copy the **Service URL** (e.g., `https://xxxxx.eu-central-1.awsapprunner.com`)

   **Save this URL** - you'll need it for frontend configuration!

### 3.5 Map Custom Domain to App Runner

1. In App Runner service page, go to **"Custom domains"** tab
2. Click **"Associate custom domain"**
3. Enter domain: `api.yourdomain.com`
4. Click **"Associate"**
5. **Note the DNS records** - you'll add them in Step 5

---

## Step 4: Initial Frontend Setup (Amplify Hosting)

This step sets up the initial Amplify app. After CI/CD is configured in Step 5, all future deployments will happen automatically via GitHub Actions.

### 4.1 Create Amplify App

**Option A: Connect GitHub Repository (Recommended)**

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click **"New app"** → **"Host web app"**
3. Choose **"GitHub"**
4. Authorize AWS Amplify to access your GitHub account
5. Select repository: `your-username/vhodly-app` (or your repo name)
6. Select branch: `main`
7. Amplify will auto-detect Angular

**Option B: Deploy Without Git (Manual)**

If you prefer manual deployments initially:

1. Click **"Deploy without Git"**
2. Enter app name: `vhodly-app`
3. Upload your built files manually

### 4.2 Configure Build Settings

Amplify will auto-detect Angular, but verify the build settings:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - cd vhodly-app
        - npm ci
    build:
      commands:
        - npm run build:prod
  artifacts:
    baseDirectory: vhodly-app/dist/vhodly-app/browser
    files:
      - '**/*'
  cache:
    paths:
      - vhodly-app/node_modules/**/*
```

**Important**: Update `environment.prod.ts` with your API URL:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.yourdomain.com/api', // Use your App Runner URL
};
```

You can also set this via environment variables in Amplify Console (see Step 5).

### 4.3 Get Amplify App ID

After creating the app:

1. Go to your Amplify app in the console
2. Click on **"App settings"** → **"General"**
3. Copy the **App ID** (e.g., `d1234567890abc`)

**Save this App ID** - you'll need it for GitHub secrets!

### 4.4 Add Custom Domain in Amplify

1. In Amplify Console, go to your app
2. Click **"Domain management"** → **"Add domain"**
3. Enter your domain: `yourdomain.com`
4. Click **"Configure domain"**
5. **Add DNS records** (provided by Amplify) - you'll add them in Step 5
6. SSL certificate will be provisioned automatically

---

## Step 5: CI/CD Setup with GitHub Actions

This is the **primary deployment method**. After setup, every push to your `main` branch will automatically trigger deployments.

### 5.1 Configure GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Add the following secrets:

**Required Secrets for Backend (App Runner):**
- `AWS_ACCESS_KEY_ID`: Your AWS access key ID
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret access key
- `AWS_REGION`: `eu-central-1` (or your preferred region)
- `AWS_ACCOUNT_ID`: Your 12-digit AWS account ID
- `ECR_REPOSITORY`: `vhodly-api`
- `APP_RUNNER_SERVICE`: `vhodly-api`

**Required Secrets for Frontend (Amplify):**
- `AMPLIFY_APP_ID`: Your Amplify App ID (from Step 4.3)
- `AMPLIFY_BRANCH`: `main` (or your default branch)
- `API_URL`: `https://api.yourdomain.com/api` (your backend API URL)

**Optional Secrets:**
- `FRONTEND_URL`: `https://yourdomain.com` (for CORS configuration)

### 5.2 Create IAM User for GitHub Actions

For better security, create a dedicated IAM user for CI/CD:

1. Go to [IAM Console](https://console.aws.amazon.com/iam/)
2. Click **"Users"** → **"Create user"**
3. Enter username: `github-actions-vhodly`
4. Select **"Provide user access to the AWS Management Console"** (optional)
5. Attach the following policies:
   - `AmazonEC2ContainerRegistryFullAccess` (for ECR)
   - `AWSAppRunnerFullAccess` (for App Runner)
   - `AmplifyFullAccess` (for Amplify deployments)
   - `AmazonS3FullAccess` (if needed by Amplify)
   - `CloudFrontFullAccess` (if needed by Amplify)
6. Click **"Next"** → **"Create user"**
7. Click on the user → **"Security credentials"** tab
8. Click **"Create access key"**
9. Choose **"Command Line Interface (CLI)"**
10. Copy the **Access key ID** and **Secret access key**
11. Add these to GitHub secrets as `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`

### 5.3 Verify GitHub Actions Workflows

The workflows are already configured in your repository:
- `.github/workflows/deploy-app-runner.yml` - Backend deployment
- `.github/workflows/deploy-amplify.yml` - Frontend deployment

**How it works:**
- When you push changes to `vhodly-api/**`, the backend workflow triggers
- When you push changes to `vhodly-app/**`, the frontend workflow triggers
- Both workflows run automatically on push to `main` branch
- You can also trigger manually via **Actions** tab → **Run workflow**

### 5.4 Test CI/CD

1. Make a small change to your code
2. Commit and push to `main` branch:
   ```bash
   git add .
   git commit -m "Test CI/CD deployment"
   git push origin main
   ```
3. Go to **GitHub** → **Actions** tab
4. Watch the workflows run:
   - Backend: Builds Docker image → Pushes to ECR → Deploys to App Runner
   - Frontend: Builds Angular app → Deploys to Amplify
5. Wait for deployment to complete (5-10 minutes)
6. Verify your changes are live!

**Note**: The first deployment may take longer as it builds everything from scratch. Subsequent deployments will be faster due to caching.

---

## Step 6: DNS Configuration

### 5.1 DNS Records to Add

You need to add the following DNS records in your domain registrar:

#### For Frontend (Amplify Hosting):

**If using Route 53:**
- Amplify will automatically create records in Route 53

**If using other DNS providers:**
```
Type: CNAME
Name: @ (or root domain)
Value: [Amplify domain - provided by Amplify]
TTL: Auto or 3600
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: [Amplify domain]
TTL: Auto or 3600
```

#### For Backend (App Runner):

```
Type: CNAME
Name: api
Value: [App Runner custom domain - from Step 3.6]
TTL: Auto or 3600
```

### 5.2 Configure DNS

**If using Route 53:**

1. Go to [Route 53 Console](https://console.aws.amazon.com/route53/)
2. Create hosted zone for your domain (if not exists)
3. Update nameservers in your domain registrar
4. Records will be created automatically by Amplify/App Runner

**If using Cloudflare:**

1. Login to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Select your domain
3. Go to **DNS** → **Records**
4. Add the records listed above
5. Ensure **Proxy status** is **Proxied** (orange cloud) for DDoS protection

**If using other registrars:**

1. Login to your registrar's DNS management
2. Navigate to DNS settings
3. Add the records listed above
4. Save changes

### 5.3 Verify DNS Propagation

Wait 5-60 minutes for DNS propagation, then verify:

```bash
# Check frontend domain
nslookup yourdomain.com

# Check API subdomain
nslookup api.yourdomain.com
```

Or use online tools:
- [whatsmydns.net](https://www.whatsmydns.net/)
- [dnschecker.org](https://dnschecker.org/)

---

## Step 7: Verify Deployment

### 6.1 Test Backend API

1. **Check Swagger docs:**
   ```
   https://api.yourdomain.com/api/docs
   ```

2. **Test API endpoint:**
   ```bash
   curl https://api.yourdomain.com/api/apartments/floors
   ```

3. **Verify CORS:**
   - Open browser console on your frontend
   - Check for CORS errors
   - API calls should work without errors

### 6.2 Test Frontend

1. **Visit your domain:**
   ```
   https://yourdomain.com
   ```

2. **Check browser console:**
   - No CORS errors
   - API calls successful
   - No 404 errors

3. **Test navigation:**
   - All routes should work
   - No blank pages
   - Assets loading correctly

### 6.3 Verify SSL Certificates

- Frontend: Check browser padlock icon (should be green)
- Backend: Check Swagger docs URL (should be HTTPS)

Both Amplify and App Runner provide automatic SSL certificates via AWS Certificate Manager.

---


## Troubleshooting

### Backend Issues

**Problem: GitHub Actions workflow fails on ECR push**
- **Solution**: Verify AWS credentials in GitHub secrets, check ECR repository exists, ensure IAM user has ECR permissions

**Problem: App Runner deployment fails**
- **Solution**: Check container logs in App Runner, verify environment variables, ensure image is accessible in ECR

**Problem: GitHub Actions workflow doesn't trigger**
- **Solution**: Verify workflow files are in `.github/workflows/`, check branch name matches workflow configuration, ensure paths are correct

**Problem: CORS errors**
- **Solution**: Update `CORS_ORIGIN` environment variable in App Runner to match your frontend domain

**Problem: API returns 404**
- **Solution**: Check that routes are prefixed with `/api`, verify Swagger docs URL

### Frontend Issues

**Problem: Amplify build fails**
- **Solution**: Check build logs in Amplify Console, verify `angular.json` configuration, check Node.js version

**Problem: API calls fail**
- **Solution**: Check `environment.prod.ts` has correct API URL, verify backend is deployed and accessible

**Problem: Routes return 404**
- **Solution**: Verify Amplify rewrite rules, check `angular.json` baseHref configuration

### DNS Issues

**Problem: Domain not resolving**
- **Solution**: Wait longer (up to 48 hours), verify DNS records are correct, check TTL

**Problem: SSL certificate not provisioning**
- **Solution**: Wait 24-48 hours, verify DNS records are correct, check Amplify/App Runner console

**Problem: Mixed content warnings**
- **Solution**: Ensure all URLs use HTTPS, update API URL to use HTTPS

### General Issues

**Problem: High costs**
- **Solution**: Check App Runner min capacity is set appropriately, monitor usage in AWS Cost Explorer

**Problem: Slow deployments**
- **Solution**: GitHub Actions uses caching automatically, optimize Dockerfile layers, use Amplify build caching

**Problem: GitHub Actions build fails**
- **Solution**: Check workflow logs in GitHub Actions tab, verify Node.js version matches, check for dependency issues, ensure all secrets are set correctly

---

## Cost Estimation

### Monthly Costs (Small to Medium Traffic)

| Service | Free Tier | After Free Tier | Your Estimated Cost |
|---------|-----------|-----------------|---------------------|
| **Amplify Hosting** | Free deployment (12 months) | $0.01/build-minute | **$0-2/month** |
| **App Runner** | None | ~$0.064/vCPU-hour + $0.007/GB-hour | **$35-50/month** |
| **ECR Storage** | 500 MB/month | $0.10/GB/month | **$0-1/month** |
| **CloudFront** (Amplify) | 1 TB transfer/month | $0.085/GB | **$0-5/month** |
| **Route 53** | $0.50/hosted zone | $0.50/month | **$0.50/month** |
| **RDS** (future) | 750 hours/month (12 months) | Starts at $15/month | **$0-20/month** (first year) |
| **Domain** | N/A | $8-15/year | **$1/month** |

### Total Estimated Cost: **$36-80/month** (Year 1: **$0-60/month** with free tier)

### Cost Optimization Tips

1. **Use App Runner min capacity: 1** - But this costs ~$36/month minimum
2. **Monitor usage** - Set up AWS Cost Explorer and billing alerts
3. **Use free tier** - Stay within free tier limits when possible
4. **Optimize builds** - Use Amplify build caching, reduce build time
5. **Consider ECS Fargate** - May be cheaper for always-on workloads

---

## Next Steps

1. ✅ **Set up monitoring** - Use CloudWatch for alerts and logs
2. ✅ **Configure backups** - Set up RDS automated backups (when DB is added)
3. ✅ **Set up staging** - Create separate Amplify branches for testing
4. ✅ **Add database** - Deploy RDS PostgreSQL
5. ✅ **Enable CDN** - Already included with Amplify Hosting
6. ✅ **Set up logging** - Use CloudWatch Logs for debugging

---

## Quick Reference Commands

### Deploying Changes

**All deployments happen automatically via GitHub Actions when you push to `main`:**

```bash
# Make your changes
git add .
git commit -m "Your commit message"
git push origin main

# GitHub Actions will automatically:
# - Build Docker image for backend
# - Push to ECR
# - Deploy to App Runner
# - Build Angular app for frontend
# - Deploy to Amplify
```

**Manual deployment (if needed):**

You can trigger workflows manually:
1. Go to **GitHub** → **Actions** tab
2. Select the workflow (Backend or Frontend)
3. Click **"Run workflow"** → **"Run workflow"**

### Check App Runner Status
```bash
aws apprunner describe-service \
  --service-name vhodly-api \
  --region eu-central-1
```

### View App Runner Logs
```bash
aws logs tail /aws/apprunner/vhodly-api --follow --region eu-central-1
```

### Update Environment Variables

Update via AWS Console:
1. Go to [App Runner Console](https://console.aws.amazon.com/apprunner/)
2. Select your service
3. Go to **Configuration** → **Service settings**
4. Click **"Edit"** → Update environment variables
5. Save changes

Or via AWS CLI:
```bash
aws apprunner update-service \
  --service-arn YOUR_SERVICE_ARN \
  --source-configuration '{"ImageRepository":{"ImageConfiguration":{"RuntimeEnvironmentVariables":{"CORS_ORIGIN":"https://yourdomain.com"}}}}' \
  --region eu-central-1
```

### View GitHub Actions Logs
1. Go to **GitHub** → **Actions** tab
2. Click on a workflow run
3. Click on individual jobs to see detailed logs

---

## Support & Resources

- **AWS Documentation**: https://docs.aws.amazon.com/
- **App Runner Documentation**: https://docs.aws.amazon.com/apprunner/
- **Amplify Documentation**: https://docs.amplify.aws/
- **App Runner Pricing**: https://aws.amazon.com/apprunner/pricing/
- **Amplify Pricing**: https://aws.amazon.com/amplify/pricing/

---

**Congratulations!** Your app should now be live at `https://yourdomain.com` 🎉
