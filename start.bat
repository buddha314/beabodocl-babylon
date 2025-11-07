@echo off
REM Startup script wrapper for Windows users
REM This batch file calls the PowerShell startup script

echo Starting Babylon.js Editor...
echo.

REM Check if PowerShell is available
where pwsh >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    REM Use PowerShell Core if available
    pwsh -ExecutionPolicy Bypass -File "%~dp0start.ps1" %*
) else (
    REM Fall back to Windows PowerShell
    powershell -ExecutionPolicy Bypass -File "%~dp0start.ps1" %*
)

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Error: Failed to start the application
    echo If you see execution policy errors, try running as Administrator
    pause
    exit /b %ERRORLEVEL%
)
