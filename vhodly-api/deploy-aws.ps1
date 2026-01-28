# AWS App Runner Deployment Script for Vhodly API (PowerShell)
# Usage: .\deploy-aws.ps1 -Region "eu-central-1" -Domain "yourdomain.com" -AccountId "123456789012"

param(
    [Parameter(Mandatory=$false)]
    [string]$Region = "eu-central-1",
    
    [Parameter(Mandatory=$true)]
    [string]$Domain,
    
    [Parameter(Mandatory=$true)]
    [string]$AccountId
)

$ServiceName = "vhodly-api"
$EcrRepo = "vhodly-api"
$EcrUri = "${AccountId}.dkr.ecr.${Region}.amazonaws.com/${EcrRepo}"

Write-Host "🚀 Deploying Vhodly API to AWS App Runner..." -ForegroundColor Cyan
Write-Host "Region: $Region" -ForegroundColor Yellow
Write-Host "Domain: $Domain" -ForegroundColor Yellow
Write-Host "Account ID: $AccountId" -ForegroundColor Yellow
Write-Host ""

# Check if AWS CLI is installed
try {
    $null = aws --version 2>&1
} catch {
    Write-Host "❌ Error: AWS CLI is not installed" -ForegroundColor Red
    Write-Host "Install it from: https://aws.amazon.com/cli/" -ForegroundColor Yellow
    exit 1
}

# Check if Docker is installed
try {
    $null = docker --version 2>&1
} catch {
    Write-Host "❌ Error: Docker is not installed" -ForegroundColor Red
    Write-Host "Install it from: https://www.docker.com/get-started" -ForegroundColor Yellow
    exit 1
}

# Check AWS credentials
try {
    $null = aws sts get-caller-identity 2>&1
} catch {
    Write-Host "❌ Error: AWS credentials not configured" -ForegroundColor Red
    Write-Host "Run: aws configure" -ForegroundColor Yellow
    exit 1
}

# Create ECR repository if it doesn't exist
Write-Host "📋 Checking ECR repository..." -ForegroundColor Cyan
try {
    $null = aws ecr describe-repositories --repository-names $EcrRepo --region $Region 2>&1
    Write-Host "✅ ECR repository exists" -ForegroundColor Green
} catch {
    Write-Host "📦 Creating ECR repository..." -ForegroundColor Cyan
    aws ecr create-repository `
        --repository-name $EcrRepo `
        --region $Region `
        --image-scanning-configuration scanOnPush=true
    Write-Host "✅ ECR repository created" -ForegroundColor Green
}

# Authenticate Docker to ECR
Write-Host "🔐 Authenticating Docker to ECR..." -ForegroundColor Cyan
$loginPassword = aws ecr get-login-password --region $Region
$loginPassword | docker login --username AWS --password-stdin $EcrUri

# Build Docker image
Write-Host "🏗️  Building Docker image..." -ForegroundColor Cyan
docker build -t ${EcrRepo}:latest .

# Tag image
Write-Host "🏷️  Tagging image..." -ForegroundColor Cyan
docker tag "${EcrRepo}:latest" "${EcrUri}:latest"

# Push to ECR
Write-Host "📤 Pushing image to ECR..." -ForegroundColor Cyan
docker push "${EcrUri}:latest"

Write-Host ""
Write-Host "✅ Image pushed to ECR: ${EcrUri}:latest" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Go to AWS App Runner Console: https://console.aws.amazon.com/apprunner/"
Write-Host "2. Create new service using ECR image: ${EcrUri}:latest"
Write-Host "3. Configure environment variables:"
Write-Host "   - NODE_ENV=production"
Write-Host "   - PORT=3000"
Write-Host "   - CORS_ORIGIN=https://$Domain"
Write-Host "4. Set CPU: 1 vCPU, Memory: 2 GB"
Write-Host "5. After deployment, map custom domain: api.$Domain"
