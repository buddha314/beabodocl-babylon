#!/bin/bash
# Startup script for Babylon.js Editor Next.js application with flexible backend configuration
# This script handles:
# - Backend connectivity detection (local or network)
# - Network interface detection for VR headset access
# - Environment variable configuration
# - Development server startup

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
GRAY='\033[0;90m'
NC='\033[0m' # No Color

# Default values
PORT=3000
SKIP_BACKEND_CHECK=false
BACKEND_URL=""

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --backend-url)
            BACKEND_URL="$2"
            shift 2
            ;;
        --port)
            PORT="$2"
            shift 2
            ;;
        --skip-backend-check)
            SKIP_BACKEND_CHECK=true
            shift
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --backend-url URL       Override backend URL (e.g., http://192.168.1.200:8000)"
            echo "  --port PORT            Port for Next.js dev server (default: 3000)"
            echo "  --skip-backend-check   Skip backend health check"
            echo "  --help                 Show this help message"
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            exit 1
            ;;
    esac
done

echo -e "${MAGENTA}\n=== Babylon.js Editor Startup ===${NC}"
echo -e "${GRAY}Date: $(date '+%Y-%m-%d %H:%M:%S')\n${NC}"

# Load .env.local if it exists
if [ -f .env.local ]; then
    echo -e "${CYAN}Loading configuration from .env.local${NC}"
    export $(grep -v '^#' .env.local | xargs)
fi

# Determine backend URL
if [ -z "$BACKEND_URL" ]; then
    if [ -n "$NEXT_PUBLIC_API_URL" ]; then
        BACKEND_URL="$NEXT_PUBLIC_API_URL"
    else
        # Try to detect backend
        echo -e "${CYAN}No backend URL configured, attempting auto-detection...${NC}"
        
        # Check localhost first
        for url in "http://localhost:8000" "http://127.0.0.1:8000"; do
            echo -e "${CYAN}Checking $url...${NC}"
            if curl -sf "$url/health" > /dev/null 2>&1; then
                BACKEND_URL="$url"
                echo -e "${GREEN}✓ Found backend at $url${NC}"
                break
            else
                echo -e "${GRAY}  Not available${NC}"
            fi
        done
        
        # If not found locally, prompt for network address
        if [ -z "$BACKEND_URL" ]; then
            echo -e "${YELLOW}\nBackend not found on localhost.${NC}"
            echo -e "${CYAN}If your backend is on another computer, enter its IP address.${NC}"
            echo -e "${CYAN}Examples: 192.168.1.200, 10.0.0.5${NC}"
            read -p "Backend IP address (or press Enter to use localhost:8000): " network_ip
            
            if [ -n "$network_ip" ]; then
                BACKEND_URL="http://${network_ip}:8000"
            else
                BACKEND_URL="http://localhost:8000"
            fi
        fi
    fi
fi

echo -e "${CYAN}\nBackend URL: $BACKEND_URL${NC}"

# Health check
if [ "$SKIP_BACKEND_CHECK" = false ]; then
    echo -e "${CYAN}Checking backend connectivity...${NC}"
    if curl -sf "$BACKEND_URL/health" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Backend is healthy${NC}"
    else
        echo -e "${YELLOW}⚠ Backend health check failed${NC}"
        echo -e "${YELLOW}Continuing anyway. The app will show connection errors if backend is unavailable.${NC}"
    fi
fi

# Get local network IP for VR headset access
echo -e "${CYAN}\nDetecting network interfaces for VR headset access...${NC}"

# Try different methods to get network IPs based on OS
if command -v ip &> /dev/null; then
    # Linux with ip command
    NETWORK_IPS=$(ip -4 addr show | grep -oP '(?<=inet\s)\d+(\.\d+){3}' | grep -v '^127\.' | grep -v '^169\.254\.')
elif command -v ifconfig &> /dev/null; then
    # macOS or Linux with ifconfig
    NETWORK_IPS=$(ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '^127\.' | grep -v '^169\.254\.')
fi

if [ -n "$NETWORK_IPS" ]; then
    echo -e "${GREEN}✓ Available on network:${NC}"
    while IFS= read -r ip; do
        echo -e "  ${GREEN}http://${ip}:${PORT}${NC}"
    done <<< "$NETWORK_IPS"
    echo -e "${CYAN}\nVR headsets can connect to any of these addresses${NC}"
else
    echo -e "${YELLOW}⚠ No network interfaces detected. VR headsets may not be able to connect.${NC}"
fi

# Set environment variable
export NEXT_PUBLIC_API_URL="$BACKEND_URL"

# Display configuration summary
echo -e "${MAGENTA}\n=== Configuration ===${NC}"
echo -e "Backend URL:        ${BACKEND_URL}"
echo -e "Frontend Port:      ${PORT}"
echo -e "Localhost Access:   http://localhost:${PORT}"
if [ -n "$NETWORK_IPS" ]; then
    FIRST_IP=$(echo "$NETWORK_IPS" | head -n 1)
    echo -e "Network Access:     http://${FIRST_IP}:${PORT}"
fi

echo -e "${MAGENTA}\n=== Starting Development Server ===${NC}"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}node_modules not found. Installing dependencies...${NC}"
    
    # Install with timeout
    timeout 300 npm install
    if [ $? -eq 124 ]; then
        echo -e "${RED}npm install timed out after 300 seconds${NC}"
        exit 1
    elif [ $? -ne 0 ]; then
        echo -e "${RED}npm install failed${NC}"
        exit 1
    fi
fi

# Start the development server
export PORT="$PORT"
echo -e "${CYAN}\nStarting Next.js on port ${PORT}...${NC}"
echo -e "${CYAN}Press Ctrl+C to stop the server${NC}"
echo -e "${YELLOW}\nServer URLs will appear below once ready:${NC}"
echo -e "${YELLOW}- Local:   http://localhost:${PORT}${NC}"
if [ -n "$NETWORK_IPS" ]; then
    FIRST_IP=$(echo "$NETWORK_IPS" | head -n 1)
    echo -e "${YELLOW}- Network: http://${FIRST_IP}:${PORT}${NC}"
fi
echo ""

# Start npm in background to check startup
npm run dev &
NPM_PID=$!

# Wait for server to start with timeout
STARTUP_TIMEOUT=120
ELAPSED=0
CHECK_INTERVAL=5
SERVER_STARTED=false

while [ $ELAPSED -lt $STARTUP_TIMEOUT ]; do
    # Check if npm process is still running
    if ! kill -0 $NPM_PID 2>/dev/null; then
        echo -e "${RED}\nServer process exited unexpectedly. Check for errors above.${NC}"
        exit 1
    fi
    
    # Check if server is responding
    if curl -sf "http://localhost:${PORT}" > /dev/null 2>&1; then
        SERVER_STARTED=true
        echo -e "${GREEN}\n[OK] Server started successfully!${NC}"
        break
    fi
    
    sleep $CHECK_INTERVAL
    ELAPSED=$((ELAPSED + CHECK_INTERVAL))
    
    # Show progress dots
    if [ $((ELAPSED % 15)) -eq 0 ]; then
        echo -n "."
    fi
done

if [ "$SERVER_STARTED" = false ]; then
    echo -e "${YELLOW}\nServer startup check timed out after ${STARTUP_TIMEOUT} seconds.${NC}"
    echo -e "${YELLOW}The server may still be starting. Check the output above for errors.${NC}"
fi

# Keep script running and wait for npm process
wait $NPM_PID
EXIT_CODE=$?

echo -e "${CYAN}\nShutting down...${NC}"
exit $EXIT_CODE
