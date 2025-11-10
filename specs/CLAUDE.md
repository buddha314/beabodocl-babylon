# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Beabodocl-Babylon** is a Next.js-based 3D VR/WebXR client for the Babocument academic paper analysis platform. It provides an immersive research experience using Babylon.js for 3D visualization and WebXR for VR headset support (Meta Quest 2/3).

**Backend Repository**: The backend API is located at `C:\Users\b\src\babocument` (FastAPI/Python) - do not confuse this frontend repo with the backend.

**Key Technologies**: Next.js 14.2.32, React 18, TypeScript 5.8.3, Babylon.js 8.33.2, Havok Physics, WebXR

## Common Commands

### Development
```bash
# Start development server (basic)
npm run dev

# Start with network detection for VR (RECOMMENDED)
npm run startup        # Windows PowerShell
npm run startup:bash   # Mac/Linux

# Build for production
npm run build

# Start production server
npm run start

# Lint
npm run lint
```

### Configuration
- Copy `.env.example` to `.env.local` and configure `NEXT_PUBLIC_API_URL`
- Default backend: `http://192.168.1.200:8000` (network IP for VR access)
- For local-only development: `http://localhost:8000`

### VR Testing
Access from VR headset browser using your computer's network IP (e.g., `http://192.168.1.100:3000`). The startup scripts display available network addresses automatically.

## Architecture & Code Organization

### High-Level Architecture
The frontend communicates directly with the Babocument backend FastAPI server. There is no intermediary API layer in this repository - all API endpoints are implemented in the backend at `C:\Users\b\src\babocument`.

```
Frontend (This Repo)          Backend (Separate Repo)
  Next.js + Babylon.js   →    FastAPI + Multi-Agent AI
  WebXR VR Interface     →    ChromaDB + Ollama LLM
  API Client Layer       →    /api/v1/* endpoints
```

### Directory Structure
```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Main 3D scene initialization with WebXR
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Tailwind styles
├── lib/                   # Core logic libraries
│   ├── api/               # Backend API clients
│   │   ├── client.ts      # Axios base client with interceptors
│   │   ├── agent.ts       # AI agent chat API
│   │   ├── documents.ts   # Document search/retrieval
│   │   ├── stats.ts       # System statistics
│   │   ├── types.ts       # TypeScript type definitions
│   │   └── index.ts       # Exports
│   ├── vr/                # VR-specific systems
│   │   └── movement.ts    # VRMovementSystem (strafing locomotion)
│   └── ChatPanel3D.ts     # 3D in-world chat interface with GUI
├── components/            # React components
│   ├── ApiTest.tsx        # API connection test widget
│   ├── AgentChatTest.tsx  # Chat test component (dev/testing only)
│   └── ErrorBoundary.tsx  # Error boundary for 3D scene
└── scripts/               # Babylon.js Editor scripts
    ├── scripts.ts         # Script registry
    └── box.ts             # Example rotating box script
```

### Key Architectural Patterns

#### 1. 3D Scene Lifecycle (page.tsx)
The main scene is initialized in `src/app/page.tsx` using React hooks:
- `useEffect` manages Engine/Scene lifecycle and cleanup
- Canvas element accessed via `useRef` to avoid re-renders
- Havok physics loaded asynchronously before scene setup
- WebXR initialized with `WebXRDefaultExperience.CreateAsync()`
- VRMovementSystem attached to enable strafing controls

**Critical**: The scene must be properly disposed in the useEffect cleanup function to prevent memory leaks.

#### 2. API Client Pattern
All API communication goes through a layered structure:
1. **Base Client** (`client.ts`): Singleton axios instance with interceptors
2. **Domain Modules** (`agent.ts`, `documents.ts`, etc.): Specific API operations
3. **Type Safety** (`types.ts`): Shared TypeScript interfaces

The API client forces network IP (`http://192.168.1.200:8000`) by default for VR headset accessibility.

#### 3. VR Movement System (movement.ts)
Custom `VRMovementSystem` class provides FPS-style locomotion:
- Left thumbstick: forward/back (Y-axis) + strafe left/right (X-axis)
- Movement relative to headset orientation
- 0.15 deadzone to prevent controller drift
- Y-axis locked (horizontal movement only) to reduce motion sickness

#### 4. ChatPanel3D (ChatPanel3D.ts)
In-world 3D chat interface using Babylon.js GUI:
- Mesh-based panel with AdvancedDynamicTexture (2048x1536 resolution)
- VR controller pointer interaction
- Real-time AI agent communication via `agentApi.sendMessage()`
- Conversation persistence with `conversation_id`

## Development Workflow

### Making Changes to 3D Scene
When modifying the 3D scene in `page.tsx`:
1. Scene initialization happens in `handleLoad()` async function
2. All Babylon.js imports should use tree-shaking: `import { Class } from "@babylonjs/core/path/to/class"`
3. Enable physics before creating physics-enabled objects
4. Attach WebXR after scene is fully set up
5. Test in both desktop browser and VR headset

### Adding New API Endpoints
To integrate a new backend endpoint:
1. Add TypeScript types to `src/lib/api/types.ts`
2. Create API methods in appropriate module (e.g., `documents.ts`)
3. Use the base axios client from `client.ts`
4. Export new API from `src/lib/api/index.ts`
5. **Do not create backend endpoints in this repo** - add them to `C:\Users\b\src\babocument`

### VR-Specific Considerations
- GUI textures need high resolution (2048x1536+) for readability
- Use emissive materials so objects are visible in dark scenes
- Test controller pointer selection: `xrHelper.pointerSelection.attach()`
- Desktop interactions use mouse/keyboard; VR uses controller rays
- Log VR state changes to help debug interaction issues

### TypeScript & Build
- Strict mode enabled - all types must be properly defined
- `@/*` path alias maps to `./src/*`
- Experimental decorators enabled for Babylon.js Editor scripts
- Target ES5 for broad compatibility

## Backend Integration

### Important: Backend is a Separate Repository
The backend API server is **not** part of this repository. Backend code lives at:
- Local path: `C:\Users\b\src\babocument`
- GitHub: https://github.com/buddha314/babocument

### Backend API Structure
The backend (FastAPI) provides these endpoints:
- `/api/v1/agent/chat` - AI agent conversation (main interface)
- `/api/v1/documents/*` - Document search and retrieval
- `/api/v1/stats/*` - System statistics
- `/health` - Health check endpoint

### Agent Chat Endpoint
The frontend expects `/api/v1/agent/chat` with this contract:
```typescript
// Request
{
  message: string;
  conversation_id?: string;
  context?: any;
}

// Response
{
  message: string;
  conversation_id: string;
  sources?: Array<{
    title: string;
    url?: string;
    relevance?: number;
  }>;
  metadata?: any;
}
```

If you need to implement or modify backend endpoints, switch to the `babocument` repository at `C:\Users\b\src\babocument`.

## Current Development Status

### Completed Features
- ✅ Basic 3D scene with Babylon.js and Havok physics
- ✅ WebXR/VR support with controller interaction
- ✅ VR strafing locomotion (Issue #10 - COMPLETE)
- ✅ Agent API client with real-time chat
- ✅ ChatPanel3D in-world interface
- ✅ API health checks and document retrieval
- ✅ Error boundaries for stability
- ✅ Network startup scripts for VR access

### In Progress / Next Priorities
- ⏳ NavMesh system for walkable surfaces (Issue #9)
- ⏳ Backend agent endpoint implementation in babocument repo
- ⏳ Authentication system (Issue #2)
- ⏳ Enhanced agent search (Issue #4)

### Known Issues
- ⚠️ **Babylon Editor Integration**: The project has editor files but doesn't use them. Scene is created manually in code instead of loaded from `assets/example.scene/`. This prevents the Babylon Editor from opening the project properly. See `BABYLON_EDITOR_INTEGRATION_PLAN.md` for a comprehensive migration plan (12-16 hours estimated).

See `PRIORITIZED_TASKS.md` for full development roadmap and `GITHUB_ISSUES.md` for detailed issue descriptions.

## Testing & Debugging

### VR Testing Checklist
1. Start backend server: `cd C:\Users\b\src\babocument && uvicorn app.main:app --reload`
2. Start frontend: `npm run startup` (shows network addresses)
3. Access from VR headset browser using network IP
4. Check browser console for WebXR initialization logs
5. Verify controller pointer selection: logs show "VR controller pointer selection enabled"
6. Test left thumbstick movement (should log "VR Movement: Left thumbstick attached")

### Common Issues
- **"WebXR not supported"**: Browser doesn't support WebXR or not in HTTPS/localhost context
- **"No response received"**: Backend server not running or firewall blocking
- **VR controllers not working**: Check `xrHelper.pointerSelection.attach()` is called
- **Chat panel not interactive**: Ensure mesh is added to pointer selection meshes

### Debugging Tools
- Browser console logs (extensive logging in place)
- React DevTools for component state
- Babylon.js Inspector: Add `scene.debugLayer.show()` to enable

## Documentation

### Primary Docs (Root Directory)
- `README.md` - Project overview and getting started
- `HANDOFF.md` - Detailed session notes and implementation details
- `PRIORITIZED_TASKS.md` - Phase-based development plan
- `GITHUB_ISSUES.md` - Detailed GitHub issue descriptions
- `STARTUP_GUIDE.md` - Comprehensive startup and network configuration
- `QUICK_START.md` - Quick reference commands

### Detailed Specs (specs/ Directory)
- `ARCHITECTURE.md` - System architecture and design patterns
- `SETUP.md` - Developer onboarding and environment setup
- `API_INTEGRATION.md` - API usage guide
- `DEVELOPMENT.md` - Development workflow and best practices
- `3D_SCENE.md` - 3D scene structure and Babylon.js details

## Code Style & Conventions

### TypeScript
- Use explicit return types for public methods
- Prefer interfaces over types for object shapes
- Use strict null checks
- Destructure imports for better tree-shaking

### React
- Functional components with hooks only
- Use `"use client"` directive for client-side components
- `useRef` for DOM elements and Babylon.js objects
- Proper cleanup in `useEffect` return functions

### Babylon.js
- Import from specific paths: `@babylonjs/core/Meshes/mesh`
- Dispose objects in cleanup functions
- Use observables for event handling
- High-resolution textures for VR GUI (2048x1536+)

### API Calls
- Always use try-catch for error handling
- Log API calls via interceptors (already configured)
- Use TypeScript types from `types.ts`
- Show loading states during async operations

## Special Notes

### Do Not Commit
- `AgentChatTest.tsx` component is for testing only - remove before production
- `.env.local` file (contains environment-specific configuration)
- Test/debug code should be removed before PR

### VR-Specific Requirements
- Network IP required (localhost won't work from headset)
- CORS must be configured on backend for network access
- High-resolution textures essential for text readability
- Test on actual hardware - desktop simulation is not sufficient

### Performance
- Target 90 FPS for VR (use `scene.getEngine().getFps()`)
- Minimize draw calls and geometry complexity
- Use LOD (Level of Detail) for complex scenes
- Profile with Babylon.js Inspector performance tab

### AI Development Context
This project has been primarily developed with AI assistance (Claude). See `AI_DEVELOPMENT_IMPACT.md` for details on AI-augmented development workflow and outcomes.
