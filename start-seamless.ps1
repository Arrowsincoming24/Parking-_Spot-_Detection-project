Write-Host "========================================" -ForegroundColor Green
Write-Host "  Smart Parking System - Starting..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Kill any existing processes on ports 3000 and 8080
Write-Host "[Cleanup] Checking for existing processes..." -ForegroundColor Yellow
$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
$port8080 = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue

if ($port3000) {
    $pid3000 = $port3000.OwningProcess | Select-Object -First 1
    Stop-Process -Id $pid3000 -Force -ErrorAction SilentlyContinue
    Write-Host "  Stopped process on port 3000" -ForegroundColor Yellow
}

if ($port8080) {
    $pid8080 = $port8080.OwningProcess | Select-Object -First 1
    Stop-Process -Id $pid8080 -Force -ErrorAction SilentlyContinue
    Write-Host "  Stopped process on port 8080" -ForegroundColor Yellow
}

Write-Host ""

# Start Backend
Write-Host "[1/2] Starting Backend (Spring Boot)..." -ForegroundColor Cyan
$backendPath = Join-Path $PSScriptRoot "backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host 'Backend Server Starting...' -ForegroundColor Green; mvn spring-boot:run" -WindowStyle Minimized

Write-Host "  Waiting for backend to initialize (15 seconds)..." -ForegroundColor Gray
Start-Sleep -Seconds 15

# Start Frontend
Write-Host "[2/2] Starting Frontend (React)..." -ForegroundColor Cyan
$frontendPath = Join-Path $PSScriptRoot "frontend"

# Check if node_modules exists
if (-Not (Test-Path (Join-Path $frontendPath "node_modules"))) {
    Write-Host "  Installing dependencies..." -ForegroundColor Yellow
    Set-Location $frontendPath
    npm install
    Set-Location $PSScriptRoot
}

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host 'Frontend Server Starting...' -ForegroundColor Green; npm start" -WindowStyle Minimized

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Application Started Successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend API: " -NoNewline
Write-Host "http://localhost:8080" -ForegroundColor Blue
Write-Host "Frontend:    " -NoNewline
Write-Host "http://localhost:3000" -ForegroundColor Blue
Write-Host ""
Write-Host "Driver Portal: " -NoNewline
Write-Host "http://localhost:3000/driver" -ForegroundColor Magenta
Write-Host "Admin Portal:  " -NoNewline
Write-Host "http://localhost:3000/admin/login" -ForegroundColor Magenta
Write-Host ""
Write-Host "Admin Credentials:" -ForegroundColor Yellow
Write-Host "  Username: admin"
Write-Host "  Password: admin123"
Write-Host ""
Write-Host "Servers are running in minimized windows." -ForegroundColor Gray
Write-Host "Opening browser in 5 seconds..." -ForegroundColor Gray
Start-Sleep -Seconds 5

# Open browser
Start-Process "http://localhost:3000/driver"

Write-Host ""
Write-Host "Press any key to exit (servers will keep running)..." -ForegroundColor Green
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
