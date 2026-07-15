#!/bin/bash
# ==========================================================================
# BHARANI HYDRAULICS VMS - GCP DEPLOYMENT AUTOMATION SCRIPT (deploy-gcp.sh)
# ==========================================================================

# Exit immediately if a command exits with a non-zero status
set -e

# Configuration variables
PROJECT_ID="bharani-vms-prod"
REGION="asia-south1" # Close proximity to Chennai, India HQ
DB_INSTANCE_NAME="vms-postgres-db"
DB_NAME="vms_db"
DB_USER="vms_admin"
DB_PASS=$(openssl rand -base64 12) # Generate strong password
GCS_BUCKET_NAME="bharani-vms-storage-bucket"
JWT_SECRET=$(openssl rand -base64 32)

echo "========================================="
echo "Starting VMS GCP Deployment Engine"
echo "========================================="

# 1. Authenticate and Configure Project
echo "[1/7] Setting GCP project target..."
gcloud config set project $PROJECT_ID

# 2. Enable GCP API Services
echo "[2/7] Enabling necessary GCP services..."
gcloud services enable \
    run.googleapis.com \
    sqladmin.googleapis.com \
    storage.googleapis.com \
    artifactregistry.googleapis.com \
    cloudbuild.googleapis.com

# 3. Create Cloud SQL (PostgreSQL) Database
echo "[3/7] Setting up PostgreSQL Cloud SQL Instance..."
if ! gcloud sql instances describe $DB_INSTANCE_NAME &>/dev/null; then
    gcloud sql instances create $DB_INSTANCE_NAME \
        --database-version=POSTGRES_14 \
        --tier=db-f1-micro \
        --region=$REGION \
        --root-password=$DB_PASS
    
    # Create PostgreSQL Database
    gcloud sql databases create $DB_NAME --instance=$DB_INSTANCE_NAME
    
    # Create Database User
    gcloud sql users create $DB_USER --instance=$DB_INSTANCE_NAME --password=$DB_PASS
else
    echo "Cloud SQL PostgreSQL instance already exists."
fi

# 4. Create Google Cloud Storage (GCS) Bucket
echo "[4/7] Constructing Cloud Storage bucket..."
if ! gsutil ls -b gs://$GCS_BUCKET_NAME &>/dev/null; then
    gsutil mb -l $REGION gs://$GCS_BUCKET_NAME
    # Enable versioning on GCS bucket
    gsutil versioning set on gs://$GCS_BUCKET_NAME
else
    echo "GCS Bucket already exists."
fi

# 5. Create Artifact Registry Repository for Docker Images
echo "[5/7] Constructing Artifact Registry repo..."
REPO_NAME="vms-containers"
if ! gcloud artifacts repositories describe $REPO_NAME --location=$REGION &>/dev/null; then
    gcloud artifacts repositories create $REPO_NAME \
        --repository-format=docker \
        --location=$REGION \
        --description="VMS Docker Containers Repository"
fi

# 6. Deploy Python FastAPI AI Service to Cloud Run
echo "[6/7] Building and deploying FastAPI AI Service..."
gcloud builds submit --tag $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/ai-service:latest ./ai-service

AI_SERVICE_URL=$(gcloud run deploy vms-ai-service \
    --image=$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/ai-service:latest \
    --region=$REGION \
    --platform=managed \
    --allow-unauthenticated \
    --format='value(status.url)')

echo "AI Service deployed at: $AI_SERVICE_URL"

# 7. Deploy Spring Boot Backend to Cloud Run
echo "[7/7] Building and deploying Spring Boot Backend..."
gcloud builds submit --tag $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/backend:latest ./backend-springboot

BACKEND_URL=$(gcloud run deploy vms-backend-service \
    --image=$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/backend:latest \
    --region=$REGION \
    --platform=managed \
    --allow-unauthenticated \
    --set-env-vars="DB_HOST=127.0.0.1,DB_PORT=5432,DB_NAME=$DB_NAME,DB_USER=$DB_USER,DB_PASS=$DB_PASS,GCS_BUCKET=$GCS_BUCKET_NAME,GCP_PROJECT=$PROJECT_ID,JWT_SECRET=$JWT_SECRET" \
    --add-cloudsql-instances=$PROJECT_ID:$REGION:$DB_INSTANCE_NAME \
    --format='value(status.url)')

# Inject the resolved deployment URL back into the backend configuration
gcloud run services update vms-backend-service \
    --region=$REGION \
    --update-env-vars="VMS_PUBLIC_BASE_URL=$BACKEND_URL"

echo "Spring Boot Backend deployed and configured at: $BACKEND_URL"

# 8. Deploy Frontend to Firebase Hosting
echo "Deploying Web assets to Firebase Hosting..."
firebase deploy --only hosting

echo "========================================="
echo "GCP Migration Completed Successfully!"
echo "Spring Boot Backend API: $BACKEND_URL"
echo "FastAPI AI Engine API:  $AI_SERVICE_URL"
echo "GCS Storage Bucket:     gs://$GCS_BUCKET_NAME"
echo "========================================="
