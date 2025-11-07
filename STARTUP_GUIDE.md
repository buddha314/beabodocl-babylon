# Startup Guide

This guide explains how to start the Babylon.js Editor application with flexible backend configuration for local development, network access, and VR headset connectivity.

## Quick Start

### Windows (PowerShell)
```powershell
.\start.ps1
```

### Mac/Linux (Bash)
```bash
chmod +x start.sh  # First time only
./start.sh
```

The startup script will:
1. Auto-detect or prompt for backend location
2. Check backend connectivity
3. Display network addresses for VR headset access
4. Start the Next.js development server

## Configuration Options

### Environment File (Recommended)

Copy `.env.example` to `.env.local` and configure:

```bash
# Copy the example file
cp .env.example .env.local

# Edit with your preferred editor
code .env.local  # VS Code
notepad .env.local  # Windows Notepad
nano .env.local  # Linux/Mac terminal editor
```

Set your backend URL:
```
NEXT_PUBLIC_API_URL=http://192.168.1.200:8000
```

### Command Line Options

#### PowerShell
```powershell
# Specify backend URL
.\start.ps1 -BackendUrl "http://192.168.1.200:8000"

# Use different port
.\start.ps1 -Port 3001

# Skip backend health check
.\start.ps1 -SkipBackendCheck

# Combine options
.\start.ps1 -BackendUrl "http://10.0.0.5:8000" -Port 3001
```

#### Bash
```bash
# Specify backend URL
./start.sh --backend-url "http://192.168.1.200:8000"

# Use different port
./start.sh --port 3001

# Skip backend health check
./start.sh --skip-backend-check

# Combine options
./start.sh --backend-url "http://10.0.0.5:8000" --port 3001

# Show help
./start.sh --help
```

## Network Scenarios

### Scenario 1: Local Development (Everything on One Computer)

**Setup:**
- Backend running on `http://localhost:8000`
- Frontend running on `http://localhost:3000`

**Configuration:**
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Access:**
- Desktop browser: `http://localhost:3000`
- VR headset on same network: `http://<your-computer-ip>:3000`

**Steps:**
1. Start backend: `cd backend && uvicorn main:app --reload`
2. Start frontend: `.\start.ps1` (Windows) or `./start.sh` (Mac/Linux)
3. Note the network IP addresses displayed by the startup script
4. Use one of those IPs to connect from VR headsets

### Scenario 2: Backend on Separate Computer

**Setup:**
- Backend on Computer A: `192.168.1.200:8000`
- Frontend on Computer B: `192.168.1.100:3000`

**Configuration on Computer B:**
```
NEXT_PUBLIC_API_URL=http://192.168.1.200:8000
```

**Access:**
- From Computer B: `http://localhost:3000`
- VR headsets: `http://192.168.1.100:3000`

**Steps:**
1. On Computer A: Start backend and note its IP address
2. On Computer B: Configure `.env.local` with Computer A's IP
3. On Computer B: Run `.\start.ps1` or `./start.sh`
4. VR headsets connect to Computer B's IP address

### Scenario 3: Multiple VR Users

**Setup:**
- One backend server (any computer on network)
- One frontend server (any computer on network)
- Multiple VR headsets connecting simultaneously

**Configuration:**
```
NEXT_PUBLIC_API_URL=http://<backend-ip>:8000
```

**Steps:**
1. Ensure backend is accessible on the network
2. Start frontend with startup script
3. Share the frontend network URL with all VR users
4. All users connect to the same frontend address

## Finding Your Computer's IP Address

### Windows (PowerShell)
```powershell
ipconfig
# Look for "IPv4 Address" under your active network adapter
# Example: 192.168.1.100
```

### Mac/Linux
```bash
ifconfig  # or: ip addr
# Look for "inet" address (not 127.0.0.1)
# Example: inet 192.168.1.100
```

### From the Startup Script
The startup script automatically displays all available network addresses when it starts.

## Troubleshooting

### Backend Not Found
If the startup script can't find the backend:

1. **Check if backend is running:**
   ```bash
   curl http://localhost:8000/health
   # or in PowerShell:
   Invoke-WebRequest -Uri http://localhost:8000/health
   ```

2. **Verify backend IP address:**
   - If backend is on another computer, ensure you can ping it
   - Check firewall settings (port 8000 should be open)

3. **Manual override:**
   ```powershell
   .\start.ps1 -BackendUrl "http://<correct-ip>:8000"
   ```

### VR Headset Can't Connect

1. **Check network connectivity:**
   - VR headset must be on the same WiFi network
   - Try accessing the frontend URL from VR headset browser

2. **Firewall issues:**
   - Ensure port 3000 (or your chosen port) is open
   - Windows: Allow Node.js through Windows Defender Firewall
   - Mac: System Preferences > Security & Privacy > Firewall > Firewall Options

3. **Use IP address, not localhost:**
   - VR headsets cannot access `localhost`
   - Always use the network IP displayed by the startup script

### Connection Timeout

If backend health check times out:

1. **Backend might be slow to start:**
   ```powershell
   .\start.ps1 -SkipBackendCheck
   ```

2. **Network latency:**
   - If backend is on a slow network, use `-SkipBackendCheck`
   - The app will still work, just won't verify backend before starting

### Server Hangs on Startup

The startup script includes automatic timeouts:

- **npm install timeout:** 300 seconds (5 minutes)
- **Server startup timeout:** 120 seconds (2 minutes)

If the server hangs:

1. **Check for port conflicts:**
   ```powershell
   # Windows
   netstat -ano | findstr :3000
   
   # Mac/Linux
   lsof -i :3000
   ```

2. **Try a different port:**
   ```powershell
   .\start.ps1 -Port 3001
   ```

3. **Check for errors in the output:**
   - Look for npm errors or Next.js compilation issues
   - Check if node_modules is corrupted (delete and reinstall)

4. **Manual verification:**
   ```bash
   # Test if server is actually running
   curl http://localhost:3000
   ```

### Port Already in Use

If port 3000 is already in use:
```powershell
# Use a different port
.\start.ps1 -Port 3001
```

## Manual Startup (Without Script)

If you prefer not to use the startup script:

1. **Set environment variable:**
   ```powershell
   # Windows PowerShell
   $env:NEXT_PUBLIC_API_URL="http://192.168.1.200:8000"
   
   # Mac/Linux Bash
   export NEXT_PUBLIC_API_URL="http://192.168.1.200:8000"
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Access the application:**
   - Open browser to `http://localhost:3000`
   - Or use your computer's IP for network access

## Advanced Configuration

### Custom Port
Change the default port in `package.json`:
```json
{
  "scripts": {
    "dev": "next dev -p 3001"
  }
}
```

### Production Build
For production deployment:
```bash
# Build the application
npm run build

# Start production server
npm start
```

Make sure `NEXT_PUBLIC_API_URL` is set correctly in your production environment.

### Docker/Container Deployment
When running in containers, ensure:
- Backend container exposes port 8000
- Frontend container exposes port 3000
- Containers are on the same network or can route to each other
- Environment variables are passed to the frontend container

## Security Considerations

1. **Local Network Only:** These scripts are designed for local network use. Don't expose to the internet without proper security.

2. **Firewall Rules:** Only open necessary ports and only to trusted networks.

3. **HTTPS:** For production or sensitive data, use HTTPS with proper SSL certificates.

4. **Backend Authentication:** Ensure your backend has proper authentication if needed.

## Getting Help

If you continue to have issues:

1. Check the console output from the startup script for error messages
2. Verify backend logs for connection attempts
3. Test connectivity with `curl` or `Invoke-WebRequest`
4. Check network configuration (subnet masks, router settings)
5. Consult the project's main README.md for additional documentation

## Next Steps

Once the application is running:
- Access it from your browser at the displayed URLs
- Connect VR headsets using the network addresses shown
- Test the 3D scene and chat functionality
- Review the API documentation in `specs/API_INTEGRATION.md`
