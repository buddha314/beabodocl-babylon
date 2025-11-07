# Quick Reference: Starting the Application

## TL;DR - Fastest Way to Start

```powershell
# Windows
.\start.ps1

# Mac/Linux
chmod +x start.sh  # First time only
./start.sh
```

## What the Startup Script Does

1. ✓ Detects or prompts for backend location
2. ✓ Checks backend health
3. ✓ Shows network IPs for VR headset access
4. ✓ Installs dependencies if needed (with timeout)
5. ✓ Starts Next.js dev server with startup verification
6. ✓ Includes timeouts to prevent hanging (120s server start, 300s npm install)

## Common Usage

### Backend on Same Computer
```powershell
.\start.ps1
# Script will auto-detect backend at http://localhost:8000
```

### Backend on Different Computer
```powershell
.\start.ps1 -BackendUrl "http://192.168.1.200:8000"
```

### Use Different Port
```powershell
.\start.ps1 -Port 3001
```

### Skip Backend Check (Fast Start)
```powershell
.\start.ps1 -SkipBackendCheck
```

## Configuration File Method

Create `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://192.168.1.200:8000
```

Then just run:
```powershell
.\start.ps1
```

## Network Access

After starting, you'll see output like:

```
=== Configuration ===
Backend URL:        http://192.168.1.200:8000
Frontend Port:      3000
Localhost Access:   http://localhost:3000
Network Access:     http://192.168.1.100:3000

✓ Available on network:
  http://192.168.1.100:3000
  http://192.168.50.1:3000
```

**VR Headsets:** Use any of the network addresses shown (not localhost!)

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Backend not found | Use `-BackendUrl` parameter or check backend is running |
| Port already in use | Use `-Port 3001` (or another port) |
| VR can't connect | Use network IP (shown in output), not localhost |
| Health check timeout | Use `-SkipBackendCheck` flag |
| Server hangs on start | Script has 120s timeout and will warn if startup fails |
| npm install hangs | Script has 300s timeout for dependency installation |

## Need More Help?

See [STARTUP_GUIDE.md](./STARTUP_GUIDE.md) for detailed documentation on:
- Network scenarios
- VR headset setup
- Firewall configuration
- Manual startup methods
- Advanced configuration
