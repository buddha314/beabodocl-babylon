# Startup Scripts - Implementation Summary

## Created Files

### Startup Scripts
1. **`start.ps1`** - PowerShell startup script (Windows/Mac/Linux)
2. **`start.sh`** - Bash startup script (Mac/Linux)
3. **`start.bat`** - Batch file wrapper (Windows, no execution policy issues)

### Configuration Files
4. **`.env.example`** - Template for environment configuration
5. **`STARTUP_GUIDE.md`** - Comprehensive documentation
6. **`QUICK_START.md`** - Quick reference guide

### Updated Files
7. **`package.json`** - Added `startup` and `startup:bash` npm scripts
8. **`README.md`** - Updated with startup instructions and links

## Key Features

### Automatic Backend Detection
- Checks localhost:8000 and 127.0.0.1:8000 automatically
- Prompts for network IP if backend not found locally
- Validates backend health before starting

### Network Configuration for VR
- Detects all network interfaces on the computer
- Displays all accessible IP addresses
- Provides clear instructions for VR headset access
- Handles scenarios where backend is on different computer

### Flexible Configuration
- Environment file support (`.env.local`)
- Command-line parameter overrides
- Multiple startup methods (script, npm, manual)

### User-Friendly Output
- Color-coded status messages
- Clear configuration summary
- Network addresses for VR access
- Helpful error messages and troubleshooting hints

## Usage Examples

### Simple Start
```powershell
# Windows - any of these work:
.\start.bat
.\start.ps1
npm run startup

# Mac/Linux:
./start.sh
npm run startup:bash
```

### With Backend on Network
```powershell
.\start.ps1 -BackendUrl "http://192.168.1.200:8000"
```

### Custom Port
```powershell
.\start.ps1 -Port 3001
```

### Fast Start (Skip Health Check)
```powershell
.\start.ps1 -SkipBackendCheck
```

## Network Scenarios Supported

### 1. Everything Local
- Backend: localhost:8000
- Frontend: localhost:3000
- VR Access: Computer's network IP

### 2. Backend on Separate Computer
- Backend: Network IP (e.g., 192.168.1.200:8000)
- Frontend: localhost:3000
- VR Access: Frontend computer's network IP

### 3. Multiple VR Users
- Single backend (any network location)
- Single frontend (any network location)
- Multiple VR headsets connect to frontend

## Script Features

### PowerShell Script (`start.ps1`)
- ✓ Parameter parsing with proper PowerShell cmdlet syntax
- ✓ Color-coded output for better readability
- ✓ Environment file loading
- ✓ Backend auto-detection with health checks
- ✓ Network interface detection (IPv4)
- ✓ Automatic npm install if needed (with 300s timeout)
- ✓ Server startup verification (with 120s timeout)
- ✓ Process management to prevent hanging
- ✓ Configuration summary display
- ✓ Graceful shutdown handling

### Bash Script (`start.sh`)
- ✓ POSIX-compliant argument parsing
- ✓ ANSI color codes for terminal output
- ✓ Environment file loading
- ✓ Backend auto-detection with curl
- ✓ Network interface detection (ip/ifconfig)
- ✓ Automatic npm install if needed (with 300s timeout)
- ✓ Server startup verification (with 120s timeout)
- ✓ Background process management
- ✓ Cross-platform compatibility (Linux/Mac)
- ✓ Graceful shutdown handling

### Batch File (`start.bat`)
- ✓ Bypasses PowerShell execution policies
- ✓ Detects PowerShell Core vs Windows PowerShell
- ✓ Passes through all command-line arguments
- ✓ User-friendly error handling

## Documentation

### STARTUP_GUIDE.md
Comprehensive guide covering:
- Quick start instructions
- Configuration options
- All network scenarios
- Finding IP addresses
- Troubleshooting common issues
- Manual startup methods
- Security considerations

### QUICK_START.md
Fast reference for:
- TL;DR commands
- Common usage patterns
- Quick troubleshooting table
- Network access info

### .env.example
Template showing:
- Backend URL configuration
- Port settings
- All three network scenarios with examples
- Instructions for finding IP addresses

## Integration Points

### Environment Variables
The scripts set: `NEXT_PUBLIC_API_URL`
- Used by Next.js at build time
- Available in browser via `process.env.NEXT_PUBLIC_API_URL`
- Used by `src/lib/api/client.ts` for backend communication

### Next.js Configuration
The `next.config.js` remains unchanged but works with the environment variables set by the startup scripts.

### API Client
The existing `src/lib/api/client.ts` uses `NEXT_PUBLIC_API_URL` with a fallback to `http://192.168.1.200:8000`.

## Testing Checklist

Before distributing to users, test:

- [ ] Start with backend on localhost
- [ ] Start with backend on network IP
- [ ] Start without backend running
- [ ] Start with `.env.local` configuration
- [ ] Start with command-line parameters
- [ ] Verify network IPs are displayed correctly
- [ ] Test from VR headset using displayed network IP
- [ ] Test with custom port
- [ ] Test with `-SkipBackendCheck` flag
- [ ] Test batch file on Windows
- [ ] Test bash script on Mac/Linux
- [ ] Verify npm scripts work

## Future Enhancements

Potential improvements:
1. Add support for HTTPS/SSL configuration
2. Auto-discover backend using mDNS/Bonjour
3. Save last-used backend URL to config file
4. Add backend start/stop commands
5. Create desktop shortcuts/launchers
6. Add system tray integration for Windows
7. Support for Docker Compose startup
8. Add QR code generation for VR headset URLs
9. Configurable timeout values via environment variables
10. Retry logic for transient startup failures

## Security Notes

⚠️ **Important:**
- These scripts are designed for local network use only
- Do not expose to public internet without proper security
- Backend should implement authentication/authorization
- Consider using HTTPS for production deployments
- Firewall rules should limit access to trusted networks

## Support

For issues or questions:
1. Check `STARTUP_GUIDE.md` troubleshooting section
2. Review console output for error messages
3. Verify network connectivity and firewall settings
4. Check backend logs for connection attempts
5. Refer to project documentation in `specs/` directory
