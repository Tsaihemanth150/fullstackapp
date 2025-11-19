# -------------------------
# Config
# -------------------------
$RG       = "vishwadristi-rg"
$LOCATION = "eastus"
$ACRNAME  = "vishwadristi"   # must be lowercase + globally unique

# -------------------------
# Helper - friendly timestamped output
# -------------------------
function Write-Info([string]$msg) { Write-Host "$(Get-Date -Format 'HH:mm:ss')  $msg" -ForegroundColor Cyan }
function Write-Ok([string]$msg)   { Write-Host "$(Get-Date -Format 'HH:mm:ss')  $msg" -ForegroundColor Green }
function Write-Warn([string]$msg) { Write-Host "$(Get-Date -Format 'HH:mm:ss')  $msg" -ForegroundColor Yellow }
function Write-Err([string]$msg)  { Write-Host "$(Get-Date -Format 'HH:mm:ss')  $msg" -ForegroundColor Red }

# -------------------------
# 0. Ensure az CLI is available and user is logged in
# -------------------------
if (-not (Get-Command az -ErrorAction SilentlyContinue)) {
    Write-Err "Azure CLI 'az' not found. Install it and login (az login) before running this script."
    exit 1
}

# Optional: check az login status (will error if not logged in)
az account show --output none 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Warn "You are not logged in to Azure. Run 'az login' and re-run this script."
    exit 1
}

# -------------------------
# 1. Create Resource Group (if missing) - guaranteed first
# -------------------------
Write-Info "Checking Resource Group '$RG' in location '$LOCATION'..."
az group show --name $RG --output json 2>$null | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Warn "Resource Group '$RG' not found. Creating..."
    az group create --name $RG --location $LOCATION --output none
    if ($LASTEXITCODE -ne 0) {
        Write-Err "Failed to create Resource Group '$RG'. Aborting."
        exit 1
    }
    Write-Ok "Resource Group '$RG' created."
} else {
    Write-Ok "Resource Group '$RG' already exists."
}

# -------------------------
# 2. Check ACR across subscription (handle name collision / existing in other RG)
# -------------------------
Write-Info "Checking if ACR '$ACRNAME' exists in the subscription..."
# Try to get ACR by name (works regardless of RG)
$acrJson = az acr show --name $ACRNAME --output json 2>$null
if ($LASTEXITCODE -eq 0 -and $acrJson) {
    $acr = $acrJson | ConvertFrom-Json
    $acrRg = $acr.resourceGroup
    Write-Ok "ACR '$ACRNAME' already exists in resource group '$acrRg'. No creation needed."
    # If you want to ensure it is in our target RG, inform the user:
    if ($acrRg -ne $RG) {
        Write-Warn "Note: ACR '$ACRNAME' exists in '$acrRg' (not in '$RG'). You cannot create the same ACR name in another RG."
    }
} else {
    # ACR name not found anywhere -> safe to create in our RG
    Write-Warn "ACR '$ACRNAME' not found in subscription. Creating in RG '$RG'..."
    az acr create --resource-group $RG --name $ACRNAME --sku Basic --output none
    if ($LASTEXITCODE -ne 0) {
        Write-Err "Failed to create ACR '$ACRNAME' in RG '$RG'. Checking if the name exists elsewhere..."
        # Double-check if it actually exists somewhere (maybe race condition)
        $check = az acr show --name $ACRNAME --output json 2>$null
        if ($LASTEXITCODE -eq 0 -and $check) {
            $checkObj = $check | ConvertFrom-Json
            Write-Warn "ACR exists in another resource group: $($checkObj.resourceGroup). You cannot create a duplicate ACR name."
        } else {
            Write-Err "ACR create failed and name does not appear to exist elsewhere. Inspect the error above or re-run with --debug."
        }
        exit 1
    }
    Write-Ok "ACR '$ACRNAME' created in resource group '$RG'."
}

# -------------------------
# 3. Final info: show ACR login server (if exists)
# -------------------------
Write-Info "Retrieving ACR details..."
az acr show --name $ACRNAME --resource-group $RG --query "{name:name, loginServer:loginServer, resourceGroup:resourceGroup}" -o table 2>$null
if ($LASTEXITCODE -ne 0) {
    # if it failed for the specified RG, try to show global one
    az acr show --name $ACRNAME --query "{name:name, loginServer:loginServer, resourceGroup:resourceGroup}" -o table
}
Write-Ok "Done."
