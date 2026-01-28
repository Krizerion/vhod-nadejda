# GCP Cloud Run Deployment Script for Vhodly API (PowerShell)
# Usage: .\deploy.ps1 -ProjectId "your-gcp-project-id" -Region "us-central1" -Domain "yourdomain.com"

param(
    [Parameter(Mandatory=$true)]
    [string]$ProjectId,
    
    [Parameter(Mandatory=$false)]
    [string]$Region = "us-central1",
    
    [Parameter(Mandatory=$true)]
    [string]$Domain
)

$ServiceName = "vhodly-api"
$ImageName = "gcr.io/$ProjectId/$ServiceName"

Write-Host "🚀 Deploying Vhodly API to Cloud Run..." -ForegroundColor Cyan
Write-Host "Project ID: $ProjectId" -ForegroundColor Yellow
Write-Host "Region: $Region" -ForegroundColor Yellow
Write-Host "Domain: $Domain" -ForegroundColor Yellow
Write-Host ""

# Check if gcloud is installed
try {
    $null = gcloud --version 2>&1
} catch {
    Write-Host "❌ Error: gcloud CLI is not installed" -ForegroundColor Red
    Write-Host "Install it from: https://cloud.google.com/sdk/docs/install" -ForegroundColor Yellow
    exit 1
}

# Set the project
Write-Host "📋 Setting GCP project..." -ForegroundColor Cyan
gcloud config set project $ProjectId

# Enable required APIs
Write-Host "🔧 Enabling required APIs..." -ForegroundColor Cyan
gcloud services enable cloudbuild.googleapis.com --project $ProjectId
gcloud services enable run.googleapis.com --project $ProjectId
gcloud services enable containerregistry.googleapis.com --project $ProjectId

# Build the container image
Write-Host "🏗️  Building container image..." -ForegroundColor Cyan
gcloud builds submit --tag $ImageName --project $ProjectId

# Deploy to Cloud Run
Write-Host "🚀 Deploying to Cloud Run..." -ForegroundColor Cyan
gcloud run deploy $ServiceName `
  --image $ImageName `
  --platform managed `
  --region $Region `
  --allow-unauthenticated `
  --port 3000 `
  --memory 512Mi `
  --cpu 1 `
  --min-instances 0 `
  --max-instances 10 `
  --timeout 300 `
  --set-env-vars "NODE_ENV=production,PORT=3000,CORS_ORIGIN=https://$Domain" `
  --project $ProjectId

# Get the service URL
Write-Host "📍 Getting service URL..." -ForegroundColor Cyan
$ServiceUrl = gcloud run services describe $ServiceName `
  --platform managed `
  --region $Region `
  --format 'value(status.url)' `
  --project $ProjectId

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "📍 Service URL: $ServiceUrl" -ForegroundColor Green
Write-Host "📚 Swagger docs: $ServiceUrl/api/docs" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Map custom domain: gcloud run domain-mappings create --service=$ServiceName --domain=api.$Domain --region=$Region"
Write-Host "2. Update CORS_ORIGIN in Cloud Run if needed"
Write-Host "3. Update frontend environment.prod.ts with API URL: $ServiceUrl/api"
