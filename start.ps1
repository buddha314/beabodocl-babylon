#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Startup script for Babylon.js Editor Next.js application with flexible backend configuration
.DESCRIPTION
    This script handles:
    - Backend connectivity detection (local or network)
    - Network interface detection for VR headset access
    - Environment variable configuration
    - Development server startup
.PARAMETER BackendUrl
    Override backend URL (e.g., http://192.168.1.200:8000)
.PARAMETER Port
    Port for Next.js dev server (default: 3000)
.PARAMETER SkipBackendCheck
    Skip backend health check
#>

param(
    [string]$BackendUrl,
    [int]$Port = 3000,
    [switch]$SkipBackendCheck
)

# Color output functions
function Write-Success { Write-Host $args -ForegroundColor Green }
function Write-Info { Write-Host $args -ForegroundColor Cyan }
function Write-Warning { Write-Host $args -ForegroundColor Yellow }
function Write-Error { Write-Host $args -ForegroundColor Red }

Write-Host "`n=== Babylon.js Editor Startup ===" -ForegroundColor Magenta
Write-Host "Date: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')`n" -ForegroundColor Gray

# Check if .env.local exists
$envFile = ".env.local"
if (Test-Path $envFile) {
    Write-Info "Loading configuration from $envFile"
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^([^#][^=]+)=(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($key, $value, "Process")
        }
    }
}

# Determine backend URL
if ($BackendUrl) {
    $BACKEND_URL = $BackendUrl
} elseif ($env:NEXT_PUBLIC_API_URL) {
    $BACKEND_URL = $env:NEXT_PUBLIC_API_URL
} else {
    # Try to detect backend
    Write-Info "No backend URL configured, attempting auto-detection..."
    
    # Check localhost first
    $localBackends = @("http://localhost:8000", "http://127.0.0.1:8000")
    $BACKEND_URL = $null
    
    foreach ($url in $localBackends) {
        Write-Info "Checking $url..."
        try {
            $response = Invoke-WebRequest -Uri "$url/health" -TimeoutSec 2 -UseBasicParsing -ErrorAction Stop
            if ($response.StatusCode -eq 200) {
                $BACKEND_URL = $url
                Write-Success "[OK] Found backend at $url"
                break
            }
        } catch {
            Write-Host "  Not available" -ForegroundColor DarkGray
        }
    }
    
    # If not found locally, prompt for network address
    if (-not $BACKEND_URL) {
        Write-Warning "`nBackend not found on localhost."
        Write-Info "If your backend is on another computer, enter its IP address."
        Write-Info "Examples: 192.168.1.200, 10.0.0.5"
        $networkIp = Read-Host "Backend IP address (or press Enter to use localhost:8000)"
        
        if ($networkIp) {
            $BACKEND_URL = "http://${networkIp}:8000"
        } else {
            $BACKEND_URL = "http://localhost:8000"
        }
    }
}

Write-Info "`nBackend URL: $BACKEND_URL"

# Health check
if (-not $SkipBackendCheck) {
    Write-Info "Checking backend connectivity..."
    try {
        $response = Invoke-WebRequest -Uri "$BACKEND_URL/health" -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
        Write-Success "[OK] Backend is healthy"
    } catch {
        Write-Warning "[WARNING] Backend health check failed: $_"
        Write-Warning "Continuing anyway. The app will show connection errors if backend is unavailable."
    }
}

# Get local network IP for VR headset access
Write-Info "`nDetecting network interfaces for VR headset access..."
$networkIps = Get-NetIPAddress -AddressFamily IPv4 | 
    Where-Object { $_.IPAddress -notmatch '^127\.' -and $_.IPAddress -notmatch '^169\.254\.' } |
    Select-Object -ExpandProperty IPAddress

if ($networkIps) {
    Write-Success "[OK] Available on network:"
    foreach ($ip in $networkIps) {
        Write-Host "  http://${ip}:${Port}" -ForegroundColor Green
    }
    Write-Info "`nVR headsets can connect to any of these addresses"
} else {
    Write-Warning "[WARNING] No network interfaces detected. VR headsets may not be able to connect."
}

# Set environment variable
$env:NEXT_PUBLIC_API_URL = $BACKEND_URL

# Display configuration summary
Write-Host "`n=== Configuration ===" -ForegroundColor Magenta
Write-Host "Backend URL:        $BACKEND_URL" -ForegroundColor White
Write-Host "Frontend Port:      $Port" -ForegroundColor White
Write-Host "Localhost Access:   http://localhost:$Port" -ForegroundColor White
if ($networkIps -and $networkIps.Count -gt 0) {
    Write-Host "Network Access:     http://$($networkIps[0]):$Port" -ForegroundColor White
}
Write-Host "`n=== Starting Development Server ===" -ForegroundColor Magenta

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Warning "node_modules not found. Installing dependencies..."
    $installJob = Start-Job -ScriptBlock { npm install }
    $installTimeout = 300 # 5 minutes
    
    Write-Info "Installing dependencies (timeout: $installTimeout seconds)..."
    $completed = Wait-Job -Job $installJob -Timeout $installTimeout
    
    if ($completed) {
        Receive-Job -Job $installJob
        Remove-Job -Job $installJob
    } else {
        Write-Error "npm install timed out after $installTimeout seconds"
        Stop-Job -Job $installJob
        Remove-Job -Job $installJob
        exit 1
    }
}

# Start the development server with timeout handling
$env:PORT = $Port
Write-Info "`nStarting Next.js on port $Port..."
Write-Host "`nServer URLs:" -ForegroundColor Yellow
Write-Host "- Local:   http://localhost:$Port" -ForegroundColor Green
if ($networkIps -and $networkIps.Count -gt 0) {
    Write-Host "- Network: http://$($networkIps[0]):$Port" -ForegroundColor Green
}
Write-Host "`nPress Ctrl+C to stop the server`n" -ForegroundColor Cyan

# Run npm directly - Next.js will handle the rest
npm run dev
