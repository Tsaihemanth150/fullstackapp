# -------------------------
# CONFIGURE VALUES
# -------------------------
$subscriptionId    = "<YOUR-SUBSCRIPTION-ID>"
$resourceGroup     = "vishwadristi-rg"
$location          = "eastus"
$acrName           = "vishwadristi"      # must be lowercase + unique
$aksName           = "vishwadristi-aks"
$nodeCount         = 2
$nodeVMSize        = "Standard_DS2_v2"
# -------------------------

# Login to Azure
az login
az account 

Write-Host "`n=== Creating Resource Group ==="
az group create --name $resourceGroup --location $location

Write-Host "`n=== Creating ACR Registry ==="
az acr create `
  --resource-group $resourceGroup `
  --name $acrName `
  --sku Basic `
  --admin-enabled false

Write-Host "`n=== Getting ACR Login Server ==="
$acrLoginServer = az acr show `
    --name $acrName `
    --resource-group $resourceGroup `
    --query loginServer -o tsv
Write-Host "ACR Login Server = $acrLoginServer"


Write-Host "`n=== Creating AKS Cluster and Attaching ACR ==="
az aks create `
  --resource-group $resourceGroup `
  --name $aksName `
  --node-count $nodeCount `
  --node-vm-size $nodeVMSize `
  --generate-ssh-keys `
  --enable-managed-identity `
  --attach-acr $acrName

Write-Host "`n=== Connecting kubectl to AKS ==="
az aks get-credentials --resource-group $resourceGroup --name $aksName

Write-Host "`n=== Setup COMPLETE! ==="
Write-Host "AKS and ACR created and linked successfully."
Write-Host "ACR Login Server: $acrLoginServer"
