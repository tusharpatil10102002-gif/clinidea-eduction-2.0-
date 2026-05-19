Write-Host "Zipping Backend..."
Remove-Item -Path "Clinidea_Backend.zip" -Force -ErrorAction SilentlyContinue
if (Test-Path "backend\node_modules") { Rename-Item -Path "backend\node_modules" -NewName "node_modules_temp" }
Compress-Archive -Path "backend\*" -DestinationPath "Clinidea_Backend.zip"
if (Test-Path "backend\node_modules_temp") { Rename-Item -Path "backend\node_modules_temp" -NewName "node_modules" }

Write-Host "Zipping Frontend..."
Remove-Item -Path "Clinidea_Frontend.zip" -Force -ErrorAction SilentlyContinue
$frontendFiles = "src", "public", "index.html", "package.json", "package-lock.json", "vite.config.js", "eslint.config.js", "README.md", "RUNBOOK.md", "DEPLOYMENT.md", ".env", ".gitignore"
Compress-Archive -Path $frontendFiles -DestinationPath "Clinidea_Frontend.zip"

Write-Host "Zipping Complete!"
