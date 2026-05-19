Write-Host "Starting Clinidea deployment script..." -ForegroundColor Cyan

# 1. Add all changes
git add .

# 2. Commit changes
git commit -m "fix: production base URL and Nginx URL rewrite"

# 3. Push to GitHub
Write-Host "Pushing to GitHub... If prompted, please enter your GitHub credentials." -ForegroundColor Yellow
git push origin main

Write-Host "Successfully pushed to GitHub!" -ForegroundColor Green
Write-Host "`nNext Steps for Live Server:" -ForegroundColor Cyan
Write-Host "1. SSH into your live server." -ForegroundColor Cyan
Write-Host "2. Navigate to your project folder: cd /path/to/your/project" -ForegroundColor Cyan
Write-Host "3. Pull the updated code: git pull origin main" -ForegroundColor Cyan
Write-Host "4. Restart the backend process: pm2 restart all" -ForegroundColor Cyan
Write-Host "5. Upload the contents of the local 'dist' folder to your website's cPanel/Nginx public_html folder." -ForegroundColor Cyan

Read-Host "`nPress Enter to exit..."
