# Add MongoDB + Razorpay env vars to Vercel and redeploy.
# Usage:
#   $env:MONGODB_URI="mongodb+srv://..."
#   $env:RAZORPAY_KEY_ID="rzp_live_..."
#   $env:RAZORPAY_KEY_SECRET="..."
#   $env:RAZORPAY_WEBHOOK_SECRET="..."
#   .\scripts\configure-vercel-production.ps1

$ErrorActionPreference = "Stop"
$env:NODE_OPTIONS = "--use-system-ca"
Set-Location $PSScriptRoot\..

function Add-VercelEnv($name, $value) {
  if (-not $value) {
    Write-Host "Skip $name (not set)"
    return
  }
  Write-Host "Setting $name on Vercel..."
  $value | npx vercel env add $name production --force | Out-Null
}

Add-VercelEnv "MONGODB_URI" $env:MONGODB_URI
Add-VercelEnv "RAZORPAY_KEY_ID" $env:RAZORPAY_KEY_ID
Add-VercelEnv "RAZORPAY_KEY_SECRET" $env:RAZORPAY_KEY_SECRET
Add-VercelEnv "RAZORPAY_WEBHOOK_SECRET" $env:RAZORPAY_WEBHOOK_SECRET
Add-VercelEnv "RESEND_API_KEY" $env:RESEND_API_KEY

Write-Host "Redeploying production..."
npx vercel --prod --yes
Write-Host "Done."
