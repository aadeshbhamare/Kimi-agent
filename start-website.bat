@echo off
title DocEngine AI - Live Website Server
color 0A

echo ========================================================
echo       DocEngine AI - Website Launcher
echo ========================================================
echo.
echo [1] Permanent 24/7 Live URL (No server needed):
echo     https://docengine-ai-studio.netlify.app/
echo.
echo [2] Local Dev Server:
echo     http://localhost:3000/
echo ========================================================
echo.

cd /d "%~dp0app"

:: Check if node is available
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [NOTICE] Node.js not found in current PATH.
    echo Opening permanent 24/7 live link directly...
    start https://docengine-ai-studio.netlify.app/
    pause
    exit /b
)

echo Starting Local Dev server...
echo Opening http://localhost:3000 in your browser...

:: Open local website in default browser after 2 seconds
start "" cmd /c "timeout /t 2 /nobreak >nul & start http://localhost:3000"

:: Run local dev server
npm run dev
