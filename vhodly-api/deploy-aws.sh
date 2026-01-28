#!/bin/bash

# AWS App Runner Deployment Script for Vhodly API
# Usage: ./deploy-aws.sh [AWS_REGION] [DOMAIN] [AWS_ACCOUNT_ID]

set -e

# Configuration
REGION=${1:-"eu-central-1"}
DOMAIN=${2:-"yourdomain.com"}
ACCOUNT_ID=${3:-"YOUR_ACCOUNT_ID"}
SERVICE_NAME="vhodly-api"
ECR_REPO="vhodly-api"
ECR_URI="${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${ECR_REPO}"

echo "🚀 Deploying Vhodly API to AWS App Runner..."
echo "Region: ${REGION}"
echo "Domain: ${DOMAIN}"
echo "Account ID: ${ACCOUNT_ID}"
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ Error: AWS CLI is not installed"
    echo "Install it from: https://aws.amazon.com/cli/"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed"
    echo "Install it from: https://www.docker.com/get-started"
    exit 1
fi

# Check AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ Error: AWS credentials not configured"
    echo "Run: aws configure"
    exit 1
fi

# Create ECR repository if it doesn't exist
echo "📋 Checking ECR repository..."
if ! aws ecr describe-repositories --repository-names ${ECR_REPO} --region ${REGION} &> /dev/null; then
    echo "📦 Creating ECR repository..."
    aws ecr create-repository \
        --repository-name ${ECR_REPO} \
        --region ${REGION} \
        --image-scanning-configuration scanOnPush=true
    echo "✅ ECR repository created"
else
    echo "✅ ECR repository exists"
fi

# Authenticate Docker to ECR
echo "🔐 Authenticating Docker to ECR..."
aws ecr get-login-password --region ${REGION} | \
    docker login --username AWS --password-stdin ${ECR_URI}

# Build Docker image
echo "🏗️  Building Docker image..."
docker build -t ${ECR_REPO}:latest .

# Tag image
echo "🏷️  Tagging image..."
docker tag ${ECR_REPO}:latest ${ECR_URI}:latest

# Push to ECR
echo "📤 Pushing image to ECR..."
docker push ${ECR_URI}:latest

echo ""
echo "✅ Image pushed to ECR: ${ECR_URI}:latest"
echo ""
echo "Next steps:"
echo "1. Go to AWS App Runner Console: https://console.aws.amazon.com/apprunner/"
echo "2. Create new service using ECR image: ${ECR_URI}:latest"
echo "3. Configure environment variables:"
echo "   - NODE_ENV=production"
echo "   - PORT=3000"
echo "   - CORS_ORIGIN=https://${DOMAIN}"
echo "4. Set CPU: 1 vCPU, Memory: 2 GB"
echo "5. After deployment, map custom domain: api.${DOMAIN}"
