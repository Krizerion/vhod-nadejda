# AWS Deployment Guide - Vhodly App

Complete step-by-step guide to deploy your Vhodly app (Angular + NestJS) to Amazon Web Services using GitHub Actions and Elastic Beanstalk.

> **🚀 Fully Automated CI/CD**: This guide uses GitHub Actions for automated deployments. **You don't need Docker, Node.js, or AWS CLI installed locally** - all builds and deployments happen automatically in GitHub Actions when you push to your repository. After initial setup, simply push your code and deployments happen automatically!

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: AWS Account & Setup](#step-1-aws-account--setup)
3. [Step 2: Domain Purchase](#step-2-domain-purchase)
4. [Step 3: Initial Backend Setup (Elastic Beanstalk)](#step-3-initial-backend-setup-elastic-beanstalk)
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
- [ ] Git installed (for pushing code)
- [ ] Basic command line knowledge (optional - only for initial AWS setup)

**Note**: This guide uses GitHub Actions for CI/CD, so you don't need Docker, Node.js, or AWS CLI installed locally. All builds happen automatically in GitHub Actions when you push to your repository.

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

### 1.2 Get AWS Access Keys

You'll need AWS access keys for GitHub Actions to deploy your application:

1. Go to [AWS Console](https://console.aws.amazon.com/)
2. Click your username → **Security credentials**
3. Scroll to **Access keys** section
4. Click **"Create access key"**
5. Choose **"Command Line Interface (CLI)"**
6. Download or copy the access key ID and secret access key

   **⚠️ Important**: Save these credentials securely - you'll add them to GitHub Secrets in Step 5.

### 1.3 Get AWS Account ID

You'll need your AWS Account ID for GitHub Actions:

1. Go to [AWS Console](https://console.aws.amazon.com/)
2. Click your username in the top right
3. Your **Account ID** (12-digit number) is displayed in the dropdown
4. Copy and save this number

### 1.4 Set Up IAM User for GitHub Actions (Recommended)

For better security, create a dedicated IAM user for CI/CD:

1. Go to **IAM** → **Users** → **Create user**
2. Enter username: `github-actions-vhodly`
3. Select **"Provide user access to the AWS Management Console"** (optional)
4. Attach the following policies:
   - `AmazonEC2ContainerRegistryFullAccess` (for ECR)
   - `AWSElasticBeanstalkFullAccess` (for Elastic Beanstalk deployments)
   - `AmplifyFullAccess` (for Amplify deployments)
   - `AmazonS3FullAccess` (needed for Elastic Beanstalk deployment packages)
   - `CloudFrontFullAccess` (if needed by Amplify)
   - `Route53FullAccess` (if using Route 53 for DNS)
5. Click **"Next"** → **"Create user"**
6. Click on the user → **"Security credentials"** tab
7. Click **"Create access key"**
8. Choose **"Command Line Interface (CLI)"**
9. Copy the **Access key ID** and **Secret access key**

   **⚠️ Important**: Save these credentials securely - you'll add them to GitHub Secrets in Step 5.

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
- **Keep DNS management access ready** - you'll need it in Step 6

---

## Step 3: Initial Backend Setup (Elastic Beanstalk)

This step sets up the initial Elastic Beanstalk environment. After CI/CD is configured in Step 5, all future deployments will happen automatically via GitHub Actions.

### 3.1 Create ECR Repository

Elastic Beanstalk needs a container image in Amazon ECR. GitHub Actions will build and push Docker images to this repository.

1. Go to [Amazon ECR Console](https://console.aws.amazon.com/ecr/)
2. Click **"Create repository"**
3. Configure:
   - **Visibility settings**: Private
   - **Repository name**: `vhodly-api`
   - **Tag immutability**: Enabled (recommended)
   - **Scan on push**: Enabled (recommended)
4. Click **"Create repository"**
5. Copy the **Repository URI** (e.g., `123456789012.dkr.ecr.eu-central-1.amazonaws.com/vhodly-api`)

   **Save this URI** - you'll need it for GitHub secrets!

### 3.2 Create Elastic Beanstalk Application

1. Go to [AWS Elastic Beanstalk Console](https://console.aws.amazon.com/elasticbeanstalk/)
2. Click **"Create application"**
3. Enter:
   - **Application name**: `vhodly-api`
   - **Description**: `Vhodly Backend API`
4. Click **"Create"**

### 3.3 Create Elastic Beanstalk Environment

1. In your application, click **"Create environment"**
2. Choose **"Web server environment"**
3. **Configure environment:**
   - **Environment name**: `vhodly-api-prod`
   - **Domain**: Leave default (or customize)
   - **Platform**: **Docker**
   - **Platform branch**: **Docker running on 64bit Amazon Linux 2**
   - **Platform version**: Latest recommended version
4. **Application code**: Choose **"Sample application"** (we'll deploy via GitHub Actions)
5. Click **"Next"** to proceed to **"Configure service access"**

### 3.3.1 Configure Service Access (IAM Roles)

If you see empty dropdowns for **Service role** and **EC2 instance profile**, you need to create these IAM roles:

**For Service Role:**
1. Click the **"Create role"** button next to the **"Service role"** dropdown
2. AWS will open a new tab/window for IAM role creation
3. The role will be pre-configured with the necessary permissions for Elastic Beanstalk
4. Click **"Create role"** at the bottom
5. Return to the Elastic Beanstalk tab and click the **refresh icon** (circular arrow) next to the Service role dropdown
6. Select the newly created role (usually named `aws-elasticbeanstalk-service-role`)

**For EC2 Instance Profile:**
1. Click the **"Create role"** button next to the **"EC2 instance profile"** dropdown
2. AWS will open a new tab/window for IAM role creation
3. The role will be pre-configured with the necessary permissions for EC2 instances
4. Click **"Create role"** at the bottom
5. Return to the Elastic Beanstalk tab and click the **refresh icon** (circular arrow) next to the EC2 instance profile dropdown
6. Select the newly created role (usually named `aws-elasticbeanstalk-ec2-role`)

**For EC2 Key Pair (Optional):**
- You can leave this empty if you don't need SSH access to your instances
- If you want SSH access, you can create a key pair later in the EC2 console

7. Click **"Next"** to proceed to **"Set up networking, database, and tags"**

### 3.3.2 Set Up Networking, Database, and Tags (Optional)

**Networking Configuration:**
- **VPC**: Leave default (uses default VPC) or select a custom VPC if you have one
- **Load balancer**: Leave default (Application Load Balancer) - recommended for Docker
- **Subnets**: Leave defaults (uses all available subnets in your VPC)
- **Public IP**: Leave default (assign public IP addresses) - needed for internet access

**Database (Optional):**
- **Database**: Leave **"No database"** for now
  - You can add a database later (RDS) if needed
  - For initial setup, we'll skip this

**Tags (Optional):**
- Add tags if you want to organize resources (e.g., `Environment: production`, `Project: vhodly`)
- Tags are optional but helpful for cost tracking and resource management

Click **"Next"** to proceed to **"Configure instance traffic and scaling"**

### 3.3.3 Configure Instance Traffic and Scaling

**Capacity:**
- **Environment type**: Leave default (**"Load balanced"**) - recommended for production
- **Instance type**: Select **`t3.micro`** or **`t2.micro`** (free tier eligible)
  - For production with more traffic, consider `t3.small` or `t3.medium`
- **Instance count**: Set to **`1`** for initial setup (minimum for load balanced)
  - You can scale up later as needed

**Scaling:**
- **Scaling triggers**: Leave defaults or configure later
  - For initial setup, manual scaling is fine
  - Auto-scaling can be configured after deployment

**Traffic:**
- **Port**: Leave default (`80` for HTTP)
- **Processes**: Leave defaults

Click **"Next"** to proceed to **"Configure updates, monitoring, and logging"**

### 3.3.4 Configure Updates, Monitoring, and Logging

**Deployment:**
- **Deployment policy**: Leave default (**"All at once"**) or select **"Rolling"** for zero-downtime deployments
- **Rolling batch type**: Leave default if using Rolling policy
- **Rolling batch size**: Leave default if using Rolling policy

**Health Reporting:**
- **Health check URL**: Leave default (`/`) or set to `/api/docs` to check API health
- **Health check grace period**: Leave default (`0`)

**Monitoring:**
- **Enhanced health reporting**: Leave default (**"Enabled"**) - recommended
- **Health check success threshold**: Leave default (`Ok`)
- **System type**: Leave default (**"Enhanced"**)

**Logging:**
- **Instance log streaming**: Leave default (**"Enabled"**) - helpful for debugging
- **Log retention**: Leave default (`7` days) or increase if needed
- **Log groups**: Leave defaults (auto-created)

**Managed Updates:**
- **Managed platform updates**: Leave default (**"Enabled"**) - keeps platform updated automatically
- **Update level**: Leave default (**"Minor and patch"**)

Click **"Next"** to proceed to **"Review"**

### 3.3.5 Review and Create Environment

1. **Review all settings** you've configured:
   - Environment name: `vhodly-api-prod`
   - Platform: Docker
   - Service role: Created/selected
   - EC2 instance profile: Created/selected
   - Instance type: t3.micro or t2.micro
   - Capacity: Load balanced, 1 instance

2. **Verify** that all required fields are filled

3. Click **"Create environment"**

4. **Wait for environment creation** (5-10 minutes)
   - You'll see the environment status change from "Launching" to "Updating" to "Ready"
   - The environment URL will be displayed when ready

**Note**: We're using the sample application for initial setup. The first real deployment will happen via GitHub Actions in Step 5.

---

### 3.4 Configure Environment Variables (After Environment Creation)

**Important**: This step is done AFTER your environment is created and running. These are not part of the initial creation wizard.

**How to Access Environment Variables:**

1. Go to your Elastic Beanstalk environment dashboard
2. In the left sidebar, click **"Configuration"**
3. On the Configuration page, look for configuration sections. You may see:
   - **Service access**
   - **Networking and database**
   - **Instance traffic and scaling**
   - **Updates, monitoring, and logging**

4. **To find Environment Variables (Software configuration):**
   - **Option A**: Look for a **"Software"** section in the configuration list. If you don't see it, try:
   - **Option B**: Click **"Edit"** on the **"Instance traffic and scaling"** section
     - Scroll down to find **"Environment properties"** or **"Software"** subsection
   - **Option C**: Look for a **"Platform"** or **"Application"** section that contains environment variables
   - **Option D**: Use the search/filter at the top of the Configuration page to search for "Software" or "Environment"

5. Once you find the Environment properties section, click **"Add environment property"** and add:
   - **Name**: `NODE_ENV` → **Value**: `production`
   - **Name**: `PORT` → **Value**: `3000`
   - **Name**: `CORS_ORIGIN` → **Value**: `https://yourdomain.com` (update with your actual domain)

6. Click **"Apply"** at the bottom
7. Wait for the configuration update to complete (1-2 minutes)

**Alternative Method (if you can't find it in Configuration):**
- Go to your environment → **Configuration** → Look for any section that mentions "Environment properties", "Variables", or "Software"
- If still not found, try clicking **"Edit"** on different sections to see if environment variables are nested within them

### 3.5 Get Elastic Beanstalk Environment URL

1. Go to your Elastic Beanstalk environment dashboard
2. At the top of the page, you'll see the **Environment URL** (e.g., `vhodly-api-prod.eba-xxxxx.eu-central-1.elasticbeanstalk.com`)
   - Alternatively, look for the URL in the environment overview section
3. Copy this URL

   **Save this URL** - you'll need it for frontend configuration and DNS setup!

### 3.6 Configure Custom Domain (Optional - Can be done later)

**Important**: This step is done AFTER your environment is created and running. This is not part of the initial creation wizard.

**⚠️ Important Note**: If your environment type is **"Single instance"** (as shown in your configuration), you won't have a Load balancer section. Single instance environments have limitations for custom domains with SSL. You have two options:

**Option A: Use Load Balanced Environment (Recommended for Production)**

If you want to use a custom domain with SSL, you should recreate your environment as "Load balanced":

1. Go to your Elastic Beanstalk environment dashboard
2. In the left sidebar, click **"Configuration"**
3. Click **"Edit"** on the **"Instance traffic and scaling"** section
4. Change **"Environment type"** from **"Single instance"** to **"Load balanced"**
5. Set **"Instance count"** to at least `1`
6. Click **"Apply"** and wait for the update (this will add a load balancer)
7. After the update completes, go back to **"Configuration"** → **"Load balancer"**
8. Click **"Edit"** and add HTTPS listener (port 443) with SSL certificate
9. Add CNAME record in DNS pointing to your Elastic Beanstalk URL

**Option B: Keep Single Instance (Simpler, but limited SSL options)**

For single instance environments:
1. You can still use the Elastic Beanstalk URL directly (e.g., `vhodly-api-prod.eba-xxxxx.eu-central-1.elasticbeanstalk.com`)
2. Or add a CNAME record pointing to this URL (without SSL/HTTPS)
3. For HTTPS with single instance, you'd need to configure SSL at the EC2 instance level (more complex)

**If you have a Load Balanced Environment:**

1. Go to your Elastic Beanstalk environment dashboard
2. In the left sidebar, click **"Configuration"**
3. Look for the **"Load balancer"** section in the configuration list
4. Click **"Edit"** next to the Load balancer section
5. Under **"Listeners"**, you'll see the default HTTP listener (port 80)
6. Click **"Add listener"** to add HTTPS:
   - **Port**: `443`
   - **Protocol**: `HTTPS`
   - **SSL certificate**: Select an existing certificate from AWS Certificate Manager, or click **"Request a new certificate"** if you don't have one
     - If requesting a new certificate, you'll need to verify domain ownership
7. Click **"Add"** to add the listener
8. Click **"Apply"** at the bottom
9. Wait for the configuration update to complete (2-5 minutes)
10. After SSL is configured, add a CNAME record in your DNS pointing `api.yourdomain.com` to the Elastic Beanstalk environment URL (see Step 6)

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
  apiUrl: 'https://api.yourdomain.com/api', // Use your Elastic Beanstalk URL
};
```

You can also set this via environment variables in Amplify Console or GitHub Secrets (see Step 5).

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
5. **Add DNS records** (provided by Amplify) - you'll add them in Step 6
6. SSL certificate will be provisioned automatically

---

## Step 5: CI/CD Setup with GitHub Actions

This is the **primary deployment method**. After setup, every push to your `main` branch will automatically trigger deployments.

### 5.1 Configure GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Add the following secrets:

**Required Secrets for Backend (Elastic Beanstalk):**
- `AWS_ACCESS_KEY_ID`: Your AWS access key ID (from Step 1.2 or 1.4)
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret access key (from Step 1.2 or 1.4)
- `AWS_REGION`: `eu-central-1` (or your preferred region)
- `AWS_ACCOUNT_ID`: Your 12-digit AWS account ID (from Step 1.3)
- `ECR_REPOSITORY`: `vhodly-api`
- `EB_APPLICATION_NAME`: `vhodly-api`
- `EB_ENVIRONMENT_NAME`: `vhodly-api-prod`

**Required Secrets for Frontend (Amplify):**
- `AMPLIFY_APP_ID`: Your Amplify App ID (from Step 4.3)
- `AMPLIFY_BRANCH`: `main` (or your default branch)
- `API_URL`: `https://api.yourdomain.com/api` (your backend API URL - use Elastic Beanstalk URL initially)

**Optional Secrets:**
- `FRONTEND_URL`: `https://yourdomain.com` (for CORS configuration)

### 5.2 Update Dockerrun.aws.json

The `Dockerrun.aws.json` file in `vhodly-api/` directory contains a placeholder for the ECR registry. GitHub Actions will automatically replace this placeholder during deployment, but you should verify the file exists and has the correct structure.

The file should look like this:
```json
{
  "AWSEBDockerrunVersion": 2,
  "containerDefinitions": [
    {
      "name": "vhodly-api",
      "image": "YOUR_ACCOUNT_ID.dkr.ecr.eu-central-1.amazonaws.com/vhodly-api:latest",
      ...
    }
  ]
}
```

GitHub Actions will replace `YOUR_ACCOUNT_ID.dkr.ecr.eu-central-1.amazonaws.com` with the actual ECR registry during deployment.

### 5.3 Verify GitHub Actions Workflows

The workflows are already configured in your repository:
- `.github/workflows/deploy-elastic-beanstalk.yml` - Backend deployment to Elastic Beanstalk
- `.github/workflows/deploy-amplify.yml` - Frontend deployment to Amplify

**How it works:**
- When you push changes to `vhodly-api/**`, the backend workflow triggers
- When you push changes to `vhodly-app/**`, the frontend workflow triggers
- Both workflows run automatically on push to `main` branch
- You can also trigger manually via **Actions** tab → **Run workflow**

**Backend Workflow Process:**
1. Checks out your code
2. Configures AWS credentials
3. Logs into Amazon ECR
4. Builds Docker image from `Dockerfile`
5. Tags and pushes image to ECR
6. Updates `Dockerrun.aws.json` with ECR registry
7. Creates deployment package
8. Uploads to S3
9. Creates Elastic Beanstalk application version
10. Updates Elastic Beanstalk environment
11. Waits for deployment to complete

**Frontend Workflow Process:**
1. Checks out your code
2. Sets up Node.js
3. Installs dependencies
4. Builds Angular app
5. Configures AWS credentials
6. Triggers Amplify deployment

### 5.4 Test CI/CD

1. Make a small change to your code (e.g., update a comment)
2. Commit and push to `main` branch:
   ```bash
   git add .
   git commit -m "Test CI/CD deployment"
   git push origin main
   ```
3. Go to **GitHub** → **Actions** tab
4. Watch the workflows run:
   - Backend: Builds Docker image → Pushes to ECR → Creates EB version → Deploys to Elastic Beanstalk
   - Frontend: Builds Angular app → Deploys to Amplify
5. Wait for deployment to complete (5-10 minutes)
6. Verify your changes are live!

**Note**: The first deployment may take longer as it builds everything from scratch. Subsequent deployments will be faster due to caching.

---

## Step 6: DNS Configuration

### 6.1 DNS Records to Add

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

#### For Backend (Elastic Beanstalk):

```
Type: CNAME
Name: api
Value: [Elastic Beanstalk environment URL - from Step 3.5]
TTL: Auto or 3600
```

### 6.2 Configure DNS

**If using Route 53:**

1. Go to [Route 53 Console](https://console.aws.amazon.com/route53/)
2. Create hosted zone for your domain (if not exists)
3. Update nameservers in your domain registrar
4. Records will be created automatically by Amplify
5. For Elastic Beanstalk, manually add CNAME record pointing to your EB environment URL

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

### 6.3 Verify DNS Propagation

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

### 7.1 Test Backend API

1. **Check Swagger docs:**
   ```
   https://api.yourdomain.com/api/docs
   ```
   Or use the Elastic Beanstalk URL:
   ```
   http://vhodly-api-prod.eba-xxxxx.eu-central-1.elasticbeanstalk.com/api/docs
   ```

2. **Test API endpoint:**
   ```bash
   curl https://api.yourdomain.com/api/apartments/floors
   ```

3. **Verify CORS:**
   - Open browser console on your frontend
   - Check for CORS errors
   - API calls should work without errors

### 7.2 Test Frontend

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

### 7.3 Verify SSL Certificates

- Frontend: Check browser padlock icon (should be green)
- Backend: Check Swagger docs URL (should be HTTPS)

Amplify provides automatic SSL certificates via AWS Certificate Manager. For Elastic Beanstalk, you can configure SSL certificates through the Load Balancer configuration (see Step 3.6).

---

## Troubleshooting

### Backend Issues

**Problem: GitHub Actions workflow fails on ECR push**
- **Solution**: Verify AWS credentials in GitHub secrets, check ECR repository exists, ensure IAM user has ECR permissions

**Problem: Elastic Beanstalk deployment fails**
- **Solution**: Check environment logs in Elastic Beanstalk console, verify Dockerrun.aws.json is correct, ensure ECR image is accessible, check environment variables are set correctly

**Problem: "Application does not exist" error**
- **Solution**: 
  1. Ensure Elastic Beanstalk application exists and is named `vhodly-api`
  2. Verify environment name matches (`vhodly-api-prod`)
  3. Create application/environment via AWS Console if needed

**Problem: Empty dropdowns for Service role and EC2 instance profile**
- **Solution**: 
  1. Click the **"Create role"** buttons next to each empty dropdown (see Step 3.3.1)
  2. AWS will automatically create the roles with correct permissions
  3. Refresh the dropdowns using the circular refresh icon
  4. Select the newly created roles
  5. If "Create role" doesn't work, you can create them manually in IAM Console:
     - Service role: Create role → AWS service → Elastic Beanstalk → Use case: Elastic Beanstalk → Attach policy: `AWSElasticBeanstalkService`
     - EC2 instance profile: Create role → AWS service → EC2 → Use case: Elastic Beanstalk → Attach policy: `AWSElasticBeanstalkWebTier` and `AWSElasticBeanstalkWorkerTier`

**Problem: S3 bucket access denied**
- **Solution**: Ensure IAM user has `s3:PutObject`, `s3:GetObject`, and `s3:CreateBucket` permissions for the Elastic Beanstalk deployment bucket

**Problem: GitHub Actions workflow doesn't trigger**
- **Solution**: Verify workflow files are in `.github/workflows/`, check branch name matches workflow configuration, ensure paths are correct

**Problem: CORS errors**
- **Solution**: Update `CORS_ORIGIN` environment variable in Elastic Beanstalk to match your frontend domain

**Problem: API returns 404**
- **Solution**: Check that routes are prefixed with `/api`, verify Swagger docs URL

**Problem: Docker build fails in GitHub Actions**
- **Solution**: Check Dockerfile syntax, verify all dependencies are listed in package.json, check build logs in GitHub Actions

**Problem: Can't find "Software" section or Environment Variables in Configuration**
- **Solution**: 
  1. The "Software" section may not be visible by default. Try these methods:
     - Click **"Edit"** on **"Instance traffic and scaling"** section and scroll down - environment variables may be there
     - Look for a **"Platform"** section in the Configuration list
     - Use the browser's Find function (Ctrl+F) to search for "Environment properties" or "Software"
  2. **Alternative**: Use AWS CLI to set environment variables:
     ```bash
     aws elasticbeanstalk update-environment \
       --environment-name vhodly-api-prod \
       --option-settings \
         Namespace=aws:elasticbeanstalk:application:environment,OptionName=NODE_ENV,Value=production \
         Namespace=aws:elasticbeanstalk:application:environment,OptionName=PORT,Value=3000 \
         Namespace=aws:elasticbeanstalk:application:environment,OptionName=CORS_ORIGIN,Value=https://yourdomain.com
     ```
  3. **Or**: Wait for the environment to fully initialize - some configuration sections may appear after the environment is fully ready

**Problem: Can't find "Load balancer" section in Configuration**
- **Solution**: 
  1. **Check your environment type**: If it shows **"Single instance"**, you won't have a Load balancer section
  2. **To add a Load balancer**: 
     - Go to **Configuration** → **Instance traffic and scaling** → **Edit**
     - Change **"Environment type"** from **"Single instance"** to **"Load balanced"**
     - Set **"Instance count"** to at least `1`
     - Click **"Apply"** and wait for update (5-10 minutes)
     - After update, the Load balancer section will appear
  3. **Note**: Changing from Single instance to Load balanced will cause a brief downtime and may incur additional costs

### Frontend Issues

**Problem: Amplify build fails**
- **Solution**: Check build logs in Amplify Console, verify `angular.json` configuration, check Node.js version

**Problem: API calls fail**
- **Solution**: Check `environment.prod.ts` has correct API URL, verify backend is deployed and accessible

**Problem: Routes return 404**
- **Solution**: Verify Amplify rewrite rules, check `angular.json` baseHref configuration

**Problem: GitHub Actions Amplify deployment fails**
- **Solution**: Verify `AMPLIFY_APP_ID` secret is correct, check AWS credentials have Amplify permissions

### DNS Issues

**Problem: Domain not resolving**
- **Solution**: Wait longer (up to 48 hours), verify DNS records are correct, check TTL

**Problem: SSL certificate not provisioning**
- **Solution**: Wait 24-48 hours, verify DNS records are correct, check Amplify/Elastic Beanstalk console

**Problem: Mixed content warnings**
- **Solution**: Ensure all URLs use HTTPS, update API URL to use HTTPS

### General Issues

**Problem: High costs**
- **Solution**: Check Elastic Beanstalk instance configuration, monitor usage in AWS Cost Explorer, consider scaling down during low-traffic periods

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
| **Elastic Beanstalk** | Free tier (750 hours EC2) | ~$15-30/month (t2.micro) | **$0-30/month** (first year) |
| **ECR Storage** | 500 MB/month | $0.10/GB/month | **$0-1/month** |
| **S3 Storage** (EB deployments) | 5 GB/month | $0.023/GB/month | **$0-1/month** |
| **CloudFront** (Amplify) | 1 TB transfer/month | $0.085/GB | **$0-5/month** |
| **Route 53** | $0.50/hosted zone | $0.50/month | **$0.50/month** |
| **RDS** (future) | 750 hours/month (12 months) | Starts at $15/month | **$0-20/month** (first year) |
| **Domain** | N/A | $8-15/year | **$1/month** |

### Total Estimated Cost: **$16-60/month** (Year 1: **$0-35/month** with free tier)

### Cost Optimization Tips

1. **Use Elastic Beanstalk free tier** - 750 hours/month of t2.micro EC2 instance (first year)
2. **Monitor usage** - Set up AWS Cost Explorer and billing alerts
3. **Use free tier** - Stay within free tier limits when possible
4. **Optimize builds** - Use Amplify build caching, reduce build time
5. **Scale down when not in use** - Elastic Beanstalk allows you to scale to 0 instances (with some limitations)
6. **Use smaller instance types** - t2.micro or t3.micro for low traffic

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
# - Build Docker image for backend (in GitHub Actions)
# - Push to ECR
# - Deploy to Elastic Beanstalk
# - Build Angular app for frontend
# - Deploy to Amplify
```

**Manual deployment (if needed):**

You can trigger workflows manually:
1. Go to **GitHub** → **Actions** tab
2. Select the workflow (Backend or Frontend)
3. Click **"Run workflow"** → **"Run workflow"**

### Check Elastic Beanstalk Status

If you have AWS CLI installed locally (optional):
```bash
aws elasticbeanstalk describe-environments \
  --application-name vhodly-api \
  --environment-names vhodly-api-prod \
  --region eu-central-1
```

Or check in AWS Console: [Elastic Beanstalk Console](https://console.aws.amazon.com/elasticbeanstalk/)

### View Elastic Beanstalk Logs

View logs in AWS Console:
1. Go to [Elastic Beanstalk Console](https://console.aws.amazon.com/elasticbeanstalk/)
2. Select your environment
3. Click **"Logs"** → **"Request logs"** → **"Last 100 lines"**

Or use CloudWatch Logs:
1. Go to [CloudWatch Console](https://console.aws.amazon.com/cloudwatch/)
2. Navigate to **Logs** → **Log groups**
3. Find `/aws/elasticbeanstalk/vhodly-api-prod/var/log/eb-engine.log`

### Update Environment Variables

Update via AWS Console:
1. Go to [Elastic Beanstalk Console](https://console.aws.amazon.com/elasticbeanstalk/)
2. Select your environment
3. Go to **Configuration** → **Software**
4. Click **"Edit"** → Update environment properties
5. Click **"Apply"**

### View GitHub Actions Logs

1. Go to **GitHub** → **Actions** tab
2. Click on a workflow run
3. Click on individual jobs to see detailed logs

---

## Support & Resources

- **AWS Documentation**: https://docs.aws.amazon.com/
- **Elastic Beanstalk Documentation**: https://docs.aws.amazon.com/elasticbeanstalk/
- **Amplify Documentation**: https://docs.amplify.aws/
- **GitHub Actions Documentation**: https://docs.github.com/en/actions
- **Elastic Beanstalk Pricing**: https://aws.amazon.com/elasticbeanstalk/pricing/
- **Amplify Pricing**: https://aws.amazon.com/amplify/pricing/

---

**Congratulations!** Your app should now be live at `https://yourdomain.com` 🎉

All future deployments happen automatically when you push to your `main` branch - no local tools required!
