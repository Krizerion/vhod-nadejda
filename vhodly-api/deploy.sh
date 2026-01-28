#!/bin/bash

# GCP Cloud Run Deployment Script for Vhodly API
# Usage: ./deploy.sh [PROJECT_ID] [REGION] [DOMAIN]

set -e

# Configuration
PROJECT_ID=${1:-"your-gcp-project-id"}
REGION=${2:-"us-central1"}
DOMAIN=${3:-"yourdomain.com"}
SERVICE_NAME="vhodly-api"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

echo "🚀 Deploying Vhodly API to Cloud Run..."
echo "Project ID: ${PROJECT_ID}"
echo "Region: ${REGION}"
echo "Domain: ${DOMAIN}"
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Error: gcloud CLI is not installed"
    echo "Install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Set the project
echo "📋 Setting GCP project..."
gcloud config set project ${PROJECT_ID}

# Enable required APIs
echo "🔧 Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Build the container image
echo "🏗️  Building container image..."
gcloud builds submit --tag ${IMAGE_NAME} --project ${PROJECT_ID}

# Deploy to Cloud Run
echo "🚀 Deploying to Cloud Run..."
gcloud run deploy ${SERVICE_NAME} \
  --image ${IMAGE_NAME} \
  --platform managed \
  --region ${REGION} \
  --allow-unauthenticated \
  --port 3000 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --timeout 300 \
  --set-env-vars "NODE_ENV=production,PORT=3000,CORS_ORIGIN=https://${DOMAIN}" \
  --project ${PROJECT_ID}

# Get the service URL
SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} \
  --platform managed \
  --region ${REGION} \
  --format 'value(status.url)' \
  --project ${PROJECT_ID})

echo ""
echo "✅ Deployment complete!"
echo "📍 Service URL: ${SERVICE_URL}"
echo "📚 Swagger docs: ${SERVICE_URL}/api/docs"
echo ""
echo "Next steps:"
echo "1. Map custom domain: gcloud run domain-mappings create --service=${SERVICE_NAME} --domain=api.${DOMAIN} --region=${REGION}"
echo "2. Update CORS_ORIGIN in Cloud Run if needed"
echo "3. Update frontend environment.prod.ts with API URL"
