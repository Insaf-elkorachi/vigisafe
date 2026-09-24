$ErrorActionPreference = "Stop"
$zip = Join-Path (Get-Location) "VigiSafe.zip"
if (Test-Path $zip) { Remove-Item -LiteralPath $zip -Force }
$exclude = @("node_modules", ".next", ".git", "VigiSafe.zip", "HSE-Remontees-Application.zip")
$items = Get-ChildItem -Force | Where-Object { $exclude -notcontains $_.Name }
Compress-Archive -Path $items.FullName -DestinationPath $zip -Force
Write-Host "Archive creee: $zip"
