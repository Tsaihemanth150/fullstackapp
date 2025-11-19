# -------------------------
# Config - EDIT THESE
# -------------------------
$ACR_NAME     = "vishwadristi"              # ACR name (lowercase)
$IMAGE_NAME   = "demoapp"                   # your image repo inside ACR
$IMAGE_TAG    = "v1"                        # e.g. v1, latest
$DOCKERFILE_PATH = "."                      # folder containing Dockerfile

# -------------------------
# Helpers
# -------------------------
function Info($msg){ Write-Host "[INFO] $msg" -ForegroundColor Cyan }
function Ok($msg){ Write-Host "[OK]   $msg" -ForegroundColor Green }
function Err($msg){ Write-Host "[ERR]  $msg" -ForegroundColor Red }

# -------------------------
# 1) Get ACR Login Server
# -------------------------
Info "Fetching ACR login server..."
$ACR_LOGIN_SERVER = az acr show --name $ACR_NAME --query "loginServer" -o tsv 2>$null

if ([string]::IsNullOrEmpty($ACR_LOGIN_SERVER)) {
    Err "ACR '$ACR_NAME' not found. Make sure it exists."
    exit 1
}

Ok "ACR Login Server: $ACR_LOGIN_SERVER"

# Compute full image name
$FULL_IMAGE_NAME = "$ACR_LOGIN_SERVER/${IMAGE_NAME}:${IMAGE_TAG}"
Info "Full Image Name: $FULL_IMAGE_NAME"

# -------------------------
# 2) ACR Login
# -------------------------
Info "Logging in to ACR..."
az acr login --name $ACR_NAME 2>$null

if ($LASTEXITCODE -ne 0) {
    Err "ACR login failed."
    exit 1
}
Ok "Logged into ACR."

# -------------------------
# 3) Build Docker Image
# -------------------------
Info "Building Docker image..."
docker build -t $FULL_IMAGE_NAME $DOCKERFILE_PATH

if ($LASTEXITCODE -ne 0) {
    Err "Docker build failed."
    exit 1
}
Ok "Docker image build successful."

# -------------------------
# 4) Push Image to ACR
# -------------------------
Info "Pushing image to ACR..."
docker push $FULL_IMAGE_NAME

if ($LASTEXITCODE -ne 0) {
    Err "Image push failed."
    exit 1
}

Ok "Image pushed successfully: $FULL_IMAGE_NAME"

# -------------------------
# 5) Print info for Kubernetes usage
# -------------------------
Write-Host ""
Ok "Use this image in your AKS Deployment:"
Write-Host "  image: $FULL_IMAGE_NAME" -ForegroundColor Yellow
