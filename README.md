# Beabodocl-Babylon

**3D VR/WebXR Client for Babocument Research Platform**

This is a Next.js-based 3D visualization and VR interface for the Babocument academic paper analysis system. Built with Babylon.js and WebXR, it provides an immersive research experience in VR headsets and web browsers.

> **Backend Repository:** [babocument](https://github.com/buddha314/babocument)  
> **Local Development:** Backend is located at `C:\Users\b\src\babocument`

## Project Overview

**Beabodocl-Babylon** is the first client application for the Babocument platform. Additional clients (mobile apps, desktop applications, etc.) are planned for future development. This client focuses on providing:

- **3D Scene Visualization** - Immersive Babylon.js 3D environment
- **VR/WebXR Support** - Full support for Meta Quest and other VR headsets  
- **AI Agent Chat** - Conversational interface for research assistance
- **Document Visualization** - 3D representations of papers and research data
- **Real-time Collaboration** - Multi-user features (planned)

## Architecture

```
┌─────────────────────────────────────────┐
│   Beabodocl-Babylon (This Repo)        │
│   - Next.js Frontend                    │
│   - Babylon.js 3D Engine                │
│   - WebXR VR Interface                  │
│   - Agent Chat UI                       │
└──────────────┬──────────────────────────┘
               │ REST API
               ▼
┌─────────────────────────────────────────┐
│   Babocument Backend                    │
│   - FastAPI Server                      │
│   - Multi-Agent AI System               │
│   - Vector Database (ChromaDB)          │
│   - LLM Integration (Ollama)            │
└─────────────────────────────────────────┘
```

**Other Clients (Planned):**
- Mobile apps (iOS/Android)
- Desktop applications  
- CLI tools
- Browser extensions

## Getting Started

### Quick Start with Startup Script (Recommended)

The easiest way to start the application with proper network configuration:

**Windows (PowerShell):**
```powershell
.\start.ps1
# or
npm run startup
```

**Mac/Linux (Bash):**
```bash
./start.sh
# or
npm run startup:bash
```

The startup script will:
- Auto-detect or prompt for backend location
- Check backend connectivity
- Display network addresses for VR headset access
- Start the Next.js development server

### Manual Start

Alternatively, run the development server directly:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

**For VR headset access:** Use your computer's network IP address instead of localhost (e.g., `http://192.168.1.100:3000`). The startup script displays these automatically.

### Configuration

Copy `.env.example` to `.env.local` and configure your backend URL:

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_DEBUG_MODE=false  # Set to "true" for verbose logging
```

For detailed setup instructions including network scenarios and VR headset connectivity, see [STARTUP_GUIDE.md](./STARTUP_GUIDE.md).

## Current Status

### ✅ What's Working
- **Basic Rendering**: Babylon.js 3D engine fully functional
- **WebXR/VR Mode**: VR headset support (Quest 2/3 tested)
- **VR Head Tracking**: Full 6DOF tracking in VR
- **VR Controllers**: Detected and visible
- **Babylon Editor Integration**: Scene loading architecture implemented
- **NavMesh System**: Collision detection for VR movement
- **Chat Panel**: 3D GUI interface for agent interaction
- **Network Access**: VR headsets can connect over local network

### ⚠️ Known Issues
- **Scene Loading**: Full scene loading from Babylon Editor currently disabled due to asset loading issues
  - **Workaround**: Minimal test scene (red box) renders correctly to verify basic functionality
  - **Root Cause**: `loadScene()` from `babylonjs-editor-tools` failing to load mesh/texture assets
  - **Status**: Under investigation - basic rendering confirmed working
- **VR Controllers**: Visible but interaction needs refinement for optimal UX

### 🚧 In Progress
- **Debugging Scene Loader**: Investigating asset path resolution and binary mesh data loading
- **VR Controller Refinement**: Fine-tuning pointer selection and interaction sensitivity

### 📋 Next Steps
1. **Fix Scene Loading** (P0) - Debug and resolve asset loading from Babylon Editor
2. **VR Controller Polish** (P1) - Refine interaction mechanics
3. **Scene Enhancement** (P2) - Add visual content once loading works
4. **Performance Testing** (P3) - Profile and optimize for VR

**For complete status details**, see:
- [NEXT_PRIORITY.md](./NEXT_PRIORITY.md) - Current development priorities
- [VR_BLACK_SCREEN_ISSUE.md](./VR_BLACK_SCREEN_ISSUE.md) - Scene loading investigation
- [HANDOFF_2025-11-09_VR_TEST.md](./HANDOFF_2025-11-09_VR_TEST.md) - VR testing session details

## Documentation

### Getting Started
- **[STARTUP_GUIDE.md](./STARTUP_GUIDE.md)** - Comprehensive startup guide with network setup, VR configuration, and troubleshooting
- **[QUICK_START.md](./QUICK_START.md)** - Quick reference for common startup commands
- **[specs/SETUP.md](./specs/SETUP.md)** - Complete developer onboarding and environment setup

### Project Information
- **[HANDOFF.md](./HANDOFF.md)** - Project handoff document with overview and next steps
- **[PRIORITIZED_TASKS.md](./PRIORITIZED_TASKS.md)** - Phase-based development plan
- **[GITHUB_ISSUES.md](./GITHUB_ISSUES.md)** - Detailed issue descriptions
- **[specs/](./specs/)** - Full technical documentation (13 documents)

### GitHub Issues
View and track development: https://github.com/buddha314/beabodocl-babylon/issues

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
