# Architecture Overview

## System Architecture

### High-Level Design

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Browser / VR Headset              │
├─────────────────────────────────────────────────────────────┤
│  Next.js Frontend (Port 3000)                                │
│  ┌─────────────────┐  ┌──────────────┐  ┌────────────────┐ │
│  │ React UI Layer  │  │ Babylon.js   │  │ API Client     │ │
│  │ - ApiTest       │  │ - 3D Scene   │  │ - Documents    │ │
│  │ - Layout        │  │ - WebXR      │  │ - Stats        │ │
│  │                 │  │ - ChatPanel  │  │ - Axios        │ │
│  └─────────────────┘  └──────────────┘  └────────────────┘ │
└───────────────────────────────┬─────────────────────────────┘
                                │ HTTP/REST
                                │ (API_URL: http://192.168.1.200:8000)
                                ↓
┌─────────────────────────────────────────────────────────────┐
│  Backend API Server (Port 8000)                              │
│  - Document Management                                       │
│  - Search & Indexing                                         │
│  - Research Agent                                            │
│  - Vector Embeddings                                         │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Next.js App Router Structure

```
src/app/
├── layout.tsx         # Root layout with metadata
├── page.tsx          # Home page with 3D scene
└── globals.css       # Global Tailwind styles
```

**Key Features:**
- Client-side rendering for 3D engine (`"use client"`)
- React 18 hooks for lifecycle management
- Tailwind CSS for UI styling

### 3D Scene Architecture

**Engine Initialization:**
```typescript
Engine (Babylon.js)
  ↓
Scene
  ├── Physics (Havok)
  ├── Camera (ArcRotateCamera)
  ├── Lights (HemisphericLight)
  ├── Meshes (Ground, Box)
  ├── Materials (StandardMaterial)
  └── GUI (ChatPanel3D)
```

**Rendering Pipeline:**
1. Canvas element mounted via React ref
2. Babylon.js Engine created with canvas reference
3. Scene configured with physics and WebXR
4. Objects created and added to scene
5. Render loop starts (`engine.runRenderLoop()`)
6. Cleanup on component unmount

### API Client Architecture

**Layered API Design:**

```
Application Components
        ↓
  API Modules (documents.ts, stats.ts)
        ↓
  Base Client (client.ts)
        ↓
  Axios Instance
        ↓
  Backend REST API
```

**Features:**
- Singleton pattern for API client
- Centralized error handling
- Request/response interceptors for logging
- Type-safe with TypeScript interfaces
- 30-second timeout for requests

### Component Hierarchy

```
RootLayout (layout.tsx)
  └── Home (page.tsx)
      ├── Canvas (3D Scene)
      │   ├── Babylon.js Scene
      │   │   ├── Camera
      │   │   ├── Lights
      │   │   ├── Meshes
      │   │   └── ChatPanel3D
      │   └── WebXR Experience
      └── ApiTest (Overlay)
```

## Data Flow

### 1. 3D Scene Initialization

```
User loads page
  → React useEffect hook triggered
  → Canvas ref available
  → Engine created
  → Havok physics loaded (async)
  → Scene created with physics
  → 3D objects created
  → ChatPanel3D instantiated
  → WebXR initialized
  → Render loop starts
```

### 2. API Communication

```
Component mounted
  → API health check
  → Fetch system stats
  → Fetch document list
  → Update UI state
  → Display data
```

### 3. Chat Interaction (In-World)

```
User types in ChatPanel3D
  → Enter pressed or Send clicked
  → Message added to UI
  → API call to /api/v1/agent/chat (TODO)
  → Response received
  → Agent message added to UI
  → Chat scrolls to bottom
```

## Key Design Patterns

### 1. Singleton Pattern
- **Usage:** API client instance
- **Purpose:** Single shared instance for all API calls
- **Location:** `src/lib/api/client.ts`

### 2. Facade Pattern
- **Usage:** API modules wrap axios complexity
- **Purpose:** Simplified interface for document/stats operations
- **Location:** `src/lib/api/documents.ts`, `stats.ts`

### 3. Component Pattern
- **Usage:** React functional components with hooks
- **Purpose:** Reusable UI and 3D elements
- **Location:** All `.tsx` files

### 4. Observer Pattern
- **Usage:** Babylon.js observables for scene events
- **Purpose:** Event-driven 3D interactions
- **Example:** Button clicks, XR state changes

### 5. Module Pattern
- **Usage:** TypeScript modules for organization
- **Purpose:** Encapsulation and namespace management
- **Location:** Throughout the codebase

## Technology Decisions

### Why Next.js?
- Server-side rendering capability (future use)
- Built-in routing and optimization
- Great developer experience
- Production-ready out of the box

### Why Babylon.js?
- Excellent WebXR/VR support
- Powerful physics integration
- Active community and documentation
- Better for complex 3D scenes than Three.js

### Why Havok Physics?
- High-performance physics simulation
- WASM-based for speed
- Official Babylon.js integration
- Better than Cannon.js for VR

### Why Axios over Fetch?
- Interceptor support for logging
- Automatic JSON transformation
- Better error handling
- Timeout support built-in

### Why Tailwind CSS?
- Rapid UI development
- No CSS file management
- Consistent design system
- Small production bundle

## Performance Considerations

### 3D Scene Optimization
- Minimal geometry (simple box + ground)
- High-resolution textures for GUI only (2048x1536)
- Double-sided meshes only where needed
- Shadow generators only on lights that need them

### React Optimization
- `reactStrictMode: false` to prevent double-mounting 3D scene
- useRef for canvas to avoid re-renders
- Cleanup in useEffect return function

### API Optimization
- 30-second timeout prevents hanging requests
- Health check uses shorter 5-second timeout
- Pagination support for large document lists

### VR Optimization
- High DPI GUI textures for readability
- Emissive materials for visibility in dark scenes
- Controller pointer selection enabled
- Background color optimizations

## Security Considerations

### Current State
- No authentication implemented yet
- API URL hardcoded for local network
- CORS must be configured on backend
- No input sanitization in chat panel

### Recommendations for Production
- Add JWT authentication
- Implement rate limiting
- Use environment variables for API URL
- Add input validation and sanitization
- Enable HTTPS
- Implement Content Security Policy

## Scalability

### Current Limitations
- Single scene/page architecture
- Client-side rendering only
- No state management library (Redux/Zustand)
- Direct API calls from components

### Future Improvements
- Multi-scene navigation
- Server-side rendering for SEO
- Global state management
- GraphQL API layer
- CDN for assets
- Service worker for offline support

## Error Handling Strategy

### Frontend Errors
1. API call failures → Display error message in ApiTest
2. 3D scene failures → Console logging only
3. WebXR unavailable → Graceful degradation (console warning)

### Backend Communication
- Axios interceptors catch all HTTP errors
- Error details logged to console
- User-friendly messages displayed in UI
- Connection status indicator in ApiTest

## Testing Strategy (Not Implemented)

### Recommended Tests
- **Unit Tests:** API client methods, utility functions
- **Component Tests:** React components, ChatPanel3D
- **Integration Tests:** API communication, 3D scene initialization
- **E2E Tests:** Full user workflows, VR interactions

### Tools to Consider
- Jest + React Testing Library
- Playwright for E2E
- Babylon.js test utilities
