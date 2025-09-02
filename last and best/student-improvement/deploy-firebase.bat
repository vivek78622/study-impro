@echo off
echo 🚀 Deploying StudyFlow to Firebase Hosting...
echo.

echo Step 1: Building application...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo.
echo Step 2: Logging into Firebase...
call firebase login
if %errorlevel% neq 0 (
    echo ❌ Firebase login failed!
    pause
    exit /b 1
)

echo.
echo Step 3: Deploying to Firebase Hosting...
call firebase deploy --only hosting --project study-improve
if %errorlevel% neq 0 (
    echo ❌ Deployment failed!
    pause
    exit /b 1
)

echo.
echo ✅ StudyFlow successfully deployed to Firebase Hosting!
echo 🌐 Your app is live at: https://study-improve.web.app
echo.
pause