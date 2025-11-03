@echo off
color 0A
echo ========================================
echo   Smart Parking System - Web Version
echo ========================================
echo.
echo Starting application...
echo.

echo [1/3] Starting Backend (Spring Boot on port 8080)...
cd backend
start "Backend Server" cmd /k "mvn spring-boot:run"
cd ..

echo Waiting for backend to initialize...
timeout /t 15 /nobreak > nul

echo.
echo [2/3] Installing Frontend Dependencies...
cd frontend
if not exist node_modules (
    echo Installing npm packages...
    call npm install
) else (
    echo Dependencies already installed.
)

echo.
echo [3/3] Starting Frontend (React on port 3000)...
start "Frontend Server" cmd /k "npm start"
cd ..

echo.
echo ========================================
echo   Application Started Successfully!
echo ========================================
echo.
echo Backend API: http://localhost:8080
echo Frontend:    http://localhost:3000
echo.
echo Driver Portal (NO LOGIN): http://localhost:3000/driver
echo Admin Portal (LOGIN):     http://localhost:3000/admin/login
echo.
echo Admin Credentials:
echo   Username: admin
echo   Password: admin123
echo.
echo ========================================
echo.
echo Your browser will open automatically...
echo Keep this window open to see logs.
echo.
echo Press any key to close this window (servers will keep running)...
pause > nul
