# GitHub Issues

**Project**: Beabodocl-Babylon  
**Date Created**: November 7, 2025  
**Last Synchronized**: November 7, 2025  
**Status**: ✅ Critical, High Priority, and VR Control Issues Created

This document contains detailed GitHub issue descriptions. The critical (P0), high priority (P1), and new VR control issues have been created in the repository.

## Created Issues

### Critical Priority (P0) - ✅ Created
1. ✅ [Issue #1: Implement Agent API Integration](https://github.com/buddha314/beabodocl-babylon/issues/1)
2. ✅ [Issue #2: Add Authentication System](https://github.com/buddha314/beabodocl-babylon/issues/2)
3. ✅ [Issue #3: Implement Error Boundaries](https://github.com/buddha314/beabodocl-babylon/issues/3)

### High Priority (P1) - ✅ Created
4. ✅ [Issue #4: Implement Agent-Assisted Paper Discovery](https://github.com/buddha314/beabodocl-babylon/issues/4)
5. ✅ [Issue #5: Add Loading States for Scene Initialization](https://github.com/buddha314/beabodocl-babylon/issues/5)
6. ✅ [Issue #6: Implement Document Search in 3D](https://github.com/buddha314/beabodocl-babylon/issues/6)
7. ✅ [Issue #7: Add Security Hardening](https://github.com/buddha314/beabodocl-babylon/issues/7)
8. ✅ [Issue #8: Implement Chat History Persistence](https://github.com/buddha314/beabodocl-babylon/issues/8)

### Medium Priority (P2) - To Be Created
9. [DICOM Medical Imaging Visualization](#issue-9-dicom-medical-imaging-visualization)
10. [Implement Data Visualization - Keyword Trends](#issue-10-implement-data-visualization---keyword-trends)
11. [Implement Data Visualization - Word Clouds](#issue-11-implement-data-visualization---word-clouds)
12. [Optimize VR Performance](#issue-12-optimize-vr-performance)
13. [Add Mobile Support](#issue-13-add-mobile-support)
14. [Implement 3D Document Browser](#issue-14-implement-3d-document-browser)
15. [Add Testing Suite](#issue-15-add-testing-suite)

### Low Priority (P3) - To Be Created
16. [Implement Collaborative Features](#issue-16-implement-collaborative-features)
17. [Add Voice Commands for VR](#issue-17-add-voice-commands-for-vr)
18. [Implement Knowledge Graph Visualization](#issue-18-implement-knowledge-graph-visualization)
19. [Add Export Capabilities](#issue-19-add-export-capabilities)
20. [Implement Progressive Web App](#issue-20-implement-progressive-web-app)

### VR Controls & UX - To Be Created
21. ✅ [Issue #9: Confine User Motion to Horizontal Plane](https://github.com/buddha314/beabodocl-babylon/issues/9)
22. ✅ [Issue #10: Enable Player Strafing on Left Joystick](https://github.com/buddha314/beabodocl-babylon/issues/10)

---

## Issue #1: Implement Agent API Integration

**Labels:** `critical`, `backend`, `frontend`, `enhancement`  
**Priority:** P0 - Critical  
**Effort:** Large (16-24 hours)  
**Milestone:** v0.2.0

### Description

The ChatPanel3D component currently simulates agent responses with mock data. We need to integrate with the actual backend agent API endpoint to enable real AI-powered research assistance.

### Current Behavior

```typescript
// TODO: Replace with actual API call to /api/v1/agent/chat
setTimeout(() => {
  this.addMessage("Agent", `I received your question: "${message}". The API integration is coming soon!`, "rgba(100, 50, 200, 0.3)");
}, 800);
```

### Expected Behavior

- User sends message through ChatPanel3D
- Message posted to `/api/v1/agent/chat` endpoint
- Agent processes query with LLM
- Response streamed back to frontend
- Citations and references included in response

### Technical Requirements

#### Backend Tasks (8-12 hours)
- [ ] Create `/api/v1/agent/chat` endpoint
- [ ] Implement LLM integration (Ollama/LiteLLM)
- [ ] Add semantic search for document corpus
- [ ] Generate citations for responses
- [ ] Implement streaming responses (SSE or WebSocket)
- [ ] Add rate limiting
- [ ] Error handling and logging

#### Frontend Tasks (8-12 hours)
- [ ] Update `ChatPanel3D.sendMessage()` method
- [ ] Add API client method for chat in `src/lib/api/agent.ts`
- [ ] Implement loading state (typing indicator)
- [ ] Handle streaming responses
- [ ] Parse and display citations
- [ ] Add error handling and retry logic
- [ ] Show connection status
- [ ] Update types in `src/lib/api/types.ts`

### API Contract

**Request:**
```typescript
POST /api/v1/agent/chat
{
  "message": string,
  "conversation_id"?: string,
  "context"?: {
    "documents": string[],
    "filters": object
  }
}
```

**Response:**
```typescript
{
  "response": string,
  "citations": [
    {
      "document_id": string,
      "title": string,
      "excerpt": string,
      "relevance": number
    }
  ],
  "conversation_id": string,
  "timestamp": string
}
```

### Acceptance Criteria

- [ ] User can send messages and receive AI responses
- [ ] Responses cite relevant documents from corpus
- [ ] Loading state shown during agent "thinking"
- [ ] Errors handled gracefully with user-friendly messages
- [ ] Response time < 5 seconds for most queries
- [ ] Works in both desktop and VR modes
- [ ] Console logs API communication for debugging

### Dependencies

- Backend agent infrastructure must be deployed
- Document corpus must be indexed
- LLM service must be running

### Related Files

- `src/lib/ChatPanel3D.ts` (line 169)
- `src/lib/api/client.ts`
- `src/lib/api/types.ts`

### References

- [KNOWN_ISSUES.md - Issue #1](./specs/KNOWN_ISSUES.md)
- [API_INTEGRATION.md](./specs/API_INTEGRATION.md)

---

## Issue #2: Add Authentication System

**Labels:** `critical`, `security`, `backend`, `frontend`, `enhancement`  
**Priority:** P0 - Critical  
**Effort:** Large (20-28 hours)  
**Milestone:** v0.3.0

### Description

The application currently has no authentication or authorization. Anyone can access the application and query the API. We need to implement a secure authentication system with JWT tokens.

### Security Risks

- Unauthorized access to research documents
- No user-specific data or workspaces
- API abuse potential
- Data privacy concerns
- Cannot deploy publicly without auth

### Technical Requirements

#### Backend Tasks (12-16 hours)

**Authentication Service:**
- [ ] User registration endpoint (`POST /api/v1/auth/register`)
- [ ] Login endpoint (`POST /api/v1/auth/login`)
- [ ] JWT token generation and validation
- [ ] Password hashing (bcrypt/argon2)
- [ ] Token refresh mechanism
- [ ] Logout/token invalidation

**Authorization:**
- [ ] Protect existing API endpoints with auth middleware
- [ ] Add user context to requests
- [ ] Implement role-based access control (RBAC)
- [ ] Rate limiting per user

**Database:**
- [ ] User table schema
- [ ] Session/token storage
- [ ] User preferences storage

#### Frontend Tasks (8-12 hours)

**Authentication UI:**
- [ ] Login page/modal (`src/app/login/page.tsx`)
- [ ] Registration page (`src/app/register/page.tsx`)
- [ ] Forgot password flow
- [ ] Logout button

**Token Management:**
- [ ] Secure token storage (httpOnly cookies or secure localStorage)
- [ ] Add auth headers to all API requests
- [ ] Token refresh logic
- [ ] Handle token expiration
- [ ] Redirect to login on 401 errors

**Protected Routes:**
- [ ] Protect main app page
- [ ] Redirect unauthenticated users to login
- [ ] Remember intended destination

### API Endpoints

```typescript
POST /api/v1/auth/register
{
  "email": string,
  "password": string,
  "name": string
}

POST /api/v1/auth/login
{
  "email": string,
  "password": string
}

POST /api/v1/auth/refresh
{
  "refresh_token": string
}

POST /api/v1/auth/logout
```

### Security Best Practices

- [ ] Password complexity requirements
- [ ] Rate limiting on auth endpoints
- [ ] Account lockout after failed attempts
- [ ] HTTPS enforcement
- [ ] Secure token storage
- [ ] CSRF protection
- [ ] Input validation and sanitization
- [ ] Security headers (CSP, HSTS, etc.)

### Acceptance Criteria

- [ ] Only authenticated users can access the application
- [ ] Passwords stored securely (hashed + salted)
- [ ] JWT tokens expire after 1 hour
- [ ] Refresh tokens work for 7 days
- [ ] Failed login attempts are rate-limited
- [ ] Sessions persist across page refreshes
- [ ] Logout clears all authentication state
- [ ] Works in VR mode

### Testing

- [ ] Unit tests for auth service
- [ ] Integration tests for auth flow
- [ ] Security audit with OWASP checklist
- [ ] Test token expiration handling
- [ ] Test concurrent sessions

### Dependencies

- None (standalone feature)

### Related Documentation

- [KNOWN_ISSUES.md - Issue #4](./specs/KNOWN_ISSUES.md)
- [ROADMAP.md - Milestone 3](./specs/ROADMAP.md)

---

## Issue #3: Implement Error Boundaries

**Labels:** `critical`, `frontend`, `ux`, `bug`  
**Priority:** P0 - Critical  
**Effort:** Small (4-6 hours)  
**Milestone:** v0.2.0

### Description

The application lacks React Error Boundaries, causing the entire app to crash when component errors occur. We need to implement error boundaries to catch errors gracefully and provide fallback UI.

### Current Behavior

- Any unhandled error crashes the entire application
- User sees blank screen or browser error
- No way to recover without page reload
- Poor user experience

### Expected Behavior

- Errors caught by Error Boundary
- User sees friendly error message
- Option to retry or go home
- Error details logged for debugging
- Rest of app continues working if possible

### Implementation

#### Create Error Boundary Component

**File:** `src/components/ErrorBoundary.tsx`

```typescript
'use client';

import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
          <div className="text-center p-8">
            <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
            <p className="text-gray-400 mb-6">{this.state.error?.message}</p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-6 py-3 bg-blue-600 rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

#### Wrap Critical Components

**Update:** `src/app/layout.tsx`

```typescript
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

**Update:** `src/app/page.tsx`

```typescript
// Wrap 3D scene initialization
<ErrorBoundary fallback={<SceneLoadError />}>
  <canvas ref={canvasRef} className="w-full h-full" />
</ErrorBoundary>

// Wrap API components
<ErrorBoundary fallback={<ApiErrorFallback />}>
  <ApiTest />
</ErrorBoundary>
```

### Tasks

- [ ] Create ErrorBoundary component
- [ ] Create fallback UI components
- [ ] Wrap RootLayout
- [ ] Wrap 3D scene
- [ ] Wrap API components
- [ ] Add error logging service integration
- [ ] Add retry mechanisms
- [ ] Test error scenarios
- [ ] Update documentation

### Error Scenarios to Handle

- [ ] 3D scene initialization failure
- [ ] API connection errors
- [ ] WebGL context loss
- [ ] Out of memory errors
- [ ] Missing WebXR support
- [ ] Component rendering errors

### Acceptance Criteria

- [ ] App doesn't crash on component errors
- [ ] User sees friendly error message
- [ ] Error details logged to console
- [ ] Retry button works
- [ ] Other parts of app remain functional
- [ ] Works in VR mode

### Testing

- [ ] Trigger various error types
- [ ] Verify error boundary catches them
- [ ] Test retry functionality
- [ ] Check error logging
- [ ] Test in production build

---

## Issue #4: Implement Agent-Assisted Paper Discovery

**Labels:** `high-priority`, `feature`, `ai`, `backend`, `frontend`  
**Priority:** P1 - High  
**Effort:** Large (14-20 hours)  
**Milestone:** v0.3.0

### Description

Enable users to discover scientific papers using natural language queries powered by AI agents. This is a core feature that transforms the application from a document viewer into an intelligent research assistant.

### User Story

> As a researcher, I want to ask an agent to find scientific papers for me using natural language, so I can quickly discover relevant research without manually searching through databases.

### Example Queries

- "Find papers about bioink formulation for 3D printing"
- "Show me recent advances in CRISPR gene editing"
- "Papers by George Church about synthetic biology"
- "Compare different methods for tissue scaffolding"
- "What's new in biomanufacturing since 2023?"

### Technical Requirements

#### Backend (8-12 hours)

**Natural Language Processing:**
- [ ] Implement query intent extraction using LLM
- [ ] Parse keywords, filters, time ranges from natural language
- [ ] Support multiple query types (keyword, author, topic, comparative, time-based)

**Search Agent:**
- [ ] Create specialized research agent for paper discovery
- [ ] Integrate with vector database for semantic search
- [ ] Implement relevance ranking algorithm
- [ ] Generate AI explanations for "why this matches"
- [ ] Link to external sources (PubMed, arXiv) via MCP

**API Endpoints:**
```typescript
POST /api/v1/agents/search/papers
GET /api/v1/agents/search/{task_id}
POST /api/v1/agents/search/{task_id}/refine
```

#### Frontend (6-8 hours)

**Search Components:**
- [ ] Create `AgentSearchBar.tsx` with natural language input
- [ ] Add voice input support
- [ ] Create `AgentSearchResults.tsx` component
- [ ] Display relevance scores
- [ ] Show AI-generated summaries
- [ ] Add "why this matches" explanations

**3D Integration:**
- [ ] Integrate search bar into 3D scene
- [ ] Display results as floating panels in VR
- [ ] VR voice input support
- [ ] Gesture-based result navigation

**Real-time Updates:**
- [ ] WebSocket integration for search progress
- [ ] Show agent "thinking" animation
- [ ] Progressive result loading
- [ ] Allow result refinement

### Query Processing Flow

1. User inputs natural language query
2. Frontend sends to `/api/v1/agents/search/papers`
3. Backend agent processes with LLM
4. Extract intent (keywords, filters, time ranges)
5. Perform semantic search + external MCP sources
6. Rank results by relevance
7. Generate AI summaries and explanations
8. Return ranked results with scores
9. User can refine with follow-up questions

### Response Format

```typescript
{
  "task_id": string,
  "status": "processing" | "complete" | "error",
  "results": [
    {
      "document_id": string,
      "title": string,
      "authors": string[],
      "year": number,
      "relevance_score": number,
      "ai_summary": string,
      "why_matches": string,
      "source": string
    }
  ],
  "metadata": {
    "query": string,
    "intent": object,
    "total_results": number,
    "search_time_ms": number
  }
}
```

### Files to Create/Modify

**Backend:**
- `server/app/agents/research_agent.py` - Enhanced agent
- `server/app/api/routes/search.py` - Search endpoints
- `server/app/services/nlp_service.py` - Query parsing

**Frontend:**
- `src/components/search/AgentSearchBar.tsx`
- `src/components/search/AgentSearchResults.tsx`
- `src/components/search/AgentThinkingAnimation.tsx`
- `src/lib/api/search.ts`
- `src/lib/api/types.ts` (add search types)

### Performance Requirements

- Initial results within 2 seconds (local corpus)
- External repository results within 5 seconds
- Support concurrent searches
- Real-time progress updates

### Success Metrics

- [ ] Users can ask questions in natural language
- [ ] Agent returns relevant papers with >80% relevance
- [ ] AI explanations are clear and accurate
- [ ] Voice input works in VR mode
- [ ] Average query response time <5 seconds
- [ ] Users can refine results with follow-up questions

### Dependencies

- Issue #1 (Agent API Integration) must be complete
- Document corpus must be indexed
- Vector database with embeddings

### References

- [USER_STORIES.md - Agent-Assisted Paper Discovery](./specs/USER_STORIES.md)
- [ROADMAP.md - Milestone 2](./specs/ROADMAP.md)

---

## Issue #5: Add Loading States for Scene Initialization

**Labels:** `high-priority`, `ux`, `frontend`, `enhancement`  
**Priority:** P1 - High  
**Effort:** Small (3-4 hours)  
**Milestone:** v0.2.0

### Description

The 3D scene has no loading indicator during initialization, showing a blank screen for 2-5 seconds. Users may think the app is broken. We need to add a proper loading screen with progress indication.

### Current Behavior

- User navigates to app
- Blank white/black screen shown
- Scene loads silently in background (2-5 seconds)
- Suddenly scene appears
- No indication of progress or that anything is happening

### Expected Behavior

- Loading screen shown immediately
- Progress indicator (spinner or progress bar)
- Status messages ("Loading 3D scene...", "Initializing physics...", etc.)
- Smooth fade out when scene is ready
- Optional: Show interesting tips while loading

### Implementation

#### Add Loading State

```typescript
// src/app/page.tsx

const [sceneStatus, setSceneStatus] = useState<{
  isLoading: boolean;
  stage: string;
  progress: number;
}>({
  isLoading: true,
  stage: 'Initializing...',
  progress: 0
});

const handleLoad = async (scene: Scene) => {
  setSceneStatus({ isLoading: true, stage: 'Creating engine...', progress: 10 });
  
  // Engine setup
  const engine = scene.getEngine();
  
  setSceneStatus({ isLoading: true, stage: 'Loading physics...', progress: 30 });
  await initPhysics(scene);
  
  setSceneStatus({ isLoading: true, stage: 'Creating scene objects...', progress: 50 });
  createSceneObjects(scene);
  
  setSceneStatus({ isLoading: true, stage: 'Setting up WebXR...', progress: 70 });
  await setupWebXR(scene);
  
  setSceneStatus({ isLoading: true, stage: 'Finalizing...', progress: 90 });
  // Final setup
  
  setSceneStatus({ isLoading: false, stage: 'Ready', progress: 100 });
};
```

#### Create Loading Component

```typescript
// src/components/SceneLoading.tsx

export function SceneLoading({ stage, progress }: { stage: string; progress: number }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black z-50">
      {/* Logo or App Name */}
      <h1 className="text-4xl font-bold text-white mb-8">Beabodocl</h1>
      
      {/* Spinner */}
      <div className="relative w-24 h-24 mb-6">
        <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Status Text */}
      <p className="text-gray-400 text-sm animate-pulse">{stage}</p>
      
      {/* Optional: Loading Tips */}
      <div className="mt-8 text-gray-500 text-xs max-w-md text-center">
        💡 Tip: Use mouse drag to rotate camera, scroll to zoom
      </div>
    </div>
  );
}
```

#### Add to Page

```typescript
// src/app/page.tsx

return (
  <main className="w-full h-screen relative">
    {/* Loading overlay */}
    {sceneStatus.isLoading && (
      <SceneLoading stage={sceneStatus.stage} progress={sceneStatus.progress} />
    )}
    
    {/* 3D Canvas */}
    <canvas ref={canvasRef} className="w-full h-full" />
    
    {/* API Test Panel */}
    {!sceneStatus.isLoading && <ApiTest />}
  </main>
);
```

### Tasks

- [ ] Add loading state to page component
- [ ] Create SceneLoading component
- [ ] Update scene initialization with progress stages
- [ ] Add smooth fade transition
- [ ] Create loading tips carousel
- [ ] Test on slow connections
- [ ] Test in VR mode
- [ ] Add error state for failed loads

### Loading Stages

1. **Initializing** (0-10%) - Component mounting
2. **Creating Engine** (10-20%) - Babylon.js engine
3. **Loading Physics** (20-40%) - Havok initialization
4. **Creating Scene** (40-60%) - Objects and materials
5. **Setting up WebXR** (60-80%) - VR support
6. **Loading Assets** (80-90%) - Textures, models
7. **Finalizing** (90-100%) - Final touches
8. **Ready** (100%) - Fade out loading screen

### Acceptance Criteria

- [ ] Loading screen shows immediately on page load
- [ ] Progress bar updates smoothly
- [ ] Status messages are accurate
- [ ] Scene becomes interactive when loading completes
- [ ] Smooth fade-out animation
- [ ] Works in both desktop and VR modes
- [ ] Loading time < 5 seconds on decent hardware

### References

- [KNOWN_ISSUES.md - Issue #7](./specs/KNOWN_ISSUES.md)

---

## Issue #6: Implement Document Search in 3D

**Labels:** `high-priority`, `feature`, `3d`, `frontend`  
**Priority:** P1 - High  
**Effort:** Medium (10-14 hours)  
**Milestone:** v0.3.0

### Description

Add ability to search documents directly from the 3D scene and display results as interactive 3D cards that users can browse in VR.

### User Story

> As a VR user, I want to search documents while immersed in the 3D environment, so I don't have to take off my headset to interact with traditional 2D UI.

### Features

#### 3D Search Bar
- Floating input panel in 3D space
- Follows user gaze or attached to controller
- Voice input support
- Auto-complete suggestions
- Search history

#### 3D Results Display
- Documents displayed as cards arranged in 3D space
- Cards show: title, author, year, preview
- Spatial arrangement (grid, arc, timeline)
- Highlight matching keywords
- Color coding by relevance

#### Interactions
- Point and click to select document
- Gesture to dismiss results
- Swipe to navigate pages
- Grab and move cards
- Star/bookmark documents

### Technical Implementation

#### Frontend Components

**3DSearchBar Component:**
```typescript
// src/components/search/3DSearchBar.ts

export class SearchBar3D {
  private panel: AdvancedDynamicTexture;
  private inputField: InputText;
  private searchButton: Button;
  
  constructor(scene: Scene) {
    this.createUI(scene);
  }
  
  private createUI(scene: Scene) {
    // Create floating panel
    // Add input field
    // Add search button
    // Set up event handlers
  }
  
  public async search(query: string): Promise<SearchResult[]> {
    // Call search API
    // Return results
  }
}
```

**3DResultsGrid Component:**
```typescript
// src/components/search/3DResultsGrid.ts

export class ResultsGrid3D {
  private cards: DocumentCard3D[] = [];
  
  constructor(scene: Scene, results: SearchResult[]) {
    this.displayResults(scene, results);
  }
  
  private displayResults(scene: Scene, results: SearchResult[]) {
    results.forEach((result, index) => {
      const card = new DocumentCard3D(result, scene);
      card.position = this.calculatePosition(index);
      this.cards.push(card);
    });
  }
  
  private calculatePosition(index: number): Vector3 {
    // Arrange in grid/arc pattern
    // Return position
  }
}
```

**DocumentCard3D Component:**
```typescript
// src/components/search/DocumentCard3D.ts

export class DocumentCard3D {
  private mesh: Mesh;
  private texture: AdvancedDynamicTexture;
  
  constructor(document: SearchResult, scene: Scene) {
    this.createCard(document, scene);
  }
  
  private createCard(document: SearchResult, scene: Scene) {
    // Create plane mesh for card
    // Add document info to texture
    // Set up interactions
  }
  
  public onSelect(callback: () => void) {
    // Handle card selection
  }
}
```

#### Backend API

```typescript
GET /api/v1/search?q={query}&limit={limit}&offset={offset}

Response:
{
  "results": [
    {
      "id": string,
      "title": string,
      "authors": string[],
      "year": number,
      "abstract": string,
      "relevance": number,
      "highlight": string
    }
  ],
  "total": number,
  "query": string
}
```

### UI/UX Design

#### Card Layout
```
┌────────────────────────┐
│ ⭐ [Title]            │
│ by [Authors]          │
│ [Year] • [Source]     │
├────────────────────────┤
│ [Abstract preview...] │
│ [Keywords]            │
├────────────────────────┤
│ 📊 Relevance: 95%     │
└────────────────────────┘
```

#### Spatial Arrangements

**Grid Layout:**
```
[Card] [Card] [Card]
[Card] [Card] [Card]
[Card] [Card] [Card]
```

**Arc Layout:**
```
     [Card]
  [Card] [Card]
[Card]    [Card]
  [Card] [Card]
     [Card]
```

**Timeline Layout:**
```
2023────[Card]
2022────[Card][Card]
2021────[Card]
2020────[Card][Card][Card]
```

### Tasks

#### Phase 1: Basic Search (6-8 hours)
- [ ] Create 3DSearchBar component
- [ ] Implement search API integration
- [ ] Create DocumentCard3D component
- [ ] Implement basic grid layout
- [ ] Add click to select interaction

#### Phase 2: Enhanced UX (4-6 hours)
- [ ] Add voice input support
- [ ] Implement auto-complete
- [ ] Add results pagination
- [ ] Create different layout modes
- [ ] Add keyword highlighting
- [ ] Implement card animations

### VR Interactions

- **Controllers:**
  - Point and click to select
  - Trigger to open document
  - Grip to grab and move card

- **Gaze:**
  - Look at card to highlight
  - Stare to preview
  - Blink to select (optional)

- **Voice:**
  - "Search for [query]"
  - "Next page"
  - "Open this document"

### Performance Considerations

- Limit visible cards (20-30 max)
- Use instancing for repeated geometry
- LOD for distant cards
- Lazy load card content
- Pagination for large result sets

### Acceptance Criteria

- [ ] Search bar accessible in VR
- [ ] Results display as 3D cards
- [ ] Cards show relevant information
- [ ] Point and click interaction works
- [ ] Voice search works in VR
- [ ] Performance remains >60 FPS
- [ ] Pagination works smoothly
- [ ] Selected document can be viewed

### Dependencies

- Issue #4 (Agent-Assisted Search) for advanced features
- Document API must support search

### References

- [ROADMAP.md - Milestone 2](./specs/ROADMAP.md)
- [3D_SCENE.md](./specs/3D_SCENE.md)

---

## Issue #7: Add Security Hardening

**Labels:** `high-priority`, `security`, `backend`, `frontend`  
**Priority:** P1 - High  
**Effort:** Medium (8-12 hours)  
**Milestone:** v0.3.0

### Description

The application has several security vulnerabilities that need to be addressed before production deployment.

### Security Concerns

#### 1. XSS Vulnerabilities

**Risk:** User input in chat not sanitized  
**Location:** `ChatPanel3D.ts`

**Current Code:**
```typescript
// No sanitization
this.addMessage(sender, message, color);
```

**Fix:**
```typescript
import DOMPurify from 'dompurify';

private addMessage(sender: string, message: string, color: string) {
  const cleanSender = DOMPurify.sanitize(sender);
  const cleanMessage = DOMPurify.sanitize(message);
  // Use cleaned values
}
```

#### 2. API Exposure

**Risk:** API endpoints accessible without auth  
**Impact:** Anyone can query documents, no rate limiting

**Fix:**
- Add authentication (Issue #2)
- Implement rate limiting on backend
- Use API keys for external access

#### 3. CORS Configuration

**Risk:** CORS may be too permissive or misconfigured

**Backend Fix:**
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],  # Specific origins only
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
```

#### 4. Content Security Policy

**Risk:** No CSP headers

**Frontend Fix in `next.config.js`:**
```javascript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.yourdomain.com"
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
    ];
  },
};
```

### Tasks

#### Frontend Security (4-6 hours)
- [ ] Install and configure DOMPurify
- [ ] Sanitize all user inputs
- [ ] Add Content Security Policy headers
- [ ] Implement security headers
- [ ] Validate all data before sending to API
- [ ] Sanitize document content display
- [ ] Add CSRF protection for future forms

#### Backend Security (4-6 hours)
- [ ] Configure CORS properly
- [ ] Add rate limiting (per IP and per user)
- [ ] Implement input validation
- [ ] Add SQL injection protection (use ORMs)
- [ ] Enable HTTPS only
- [ ] Add security headers
- [ ] Implement request size limits
- [ ] Add logging for security events

### Rate Limiting

**Backend Implementation:**
```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.get("/api/v1/documents")
@limiter.limit("100/hour")
async def list_documents():
    # Endpoint logic
```

### Input Validation

**Frontend:**
```typescript
// Validate before sending
function validateMessage(message: string): boolean {
  if (!message || message.length === 0) return false;
  if (message.length > 1000) return false;
  if (/<script/i.test(message)) return false;
  return true;
}
```

**Backend:**
```python
from pydantic import BaseModel, validator

class ChatMessage(BaseModel):
    message: str
    
    @validator('message')
    def validate_message(cls, v):
        if len(v) > 1000:
            raise ValueError('Message too long')
        return v
```

### Acceptance Criteria

- [ ] All user inputs sanitized
- [ ] XSS attacks prevented
- [ ] Rate limiting working (100 req/hour per IP)
- [ ] CORS configured correctly
- [ ] CSP headers in place
- [ ] Security headers present
- [ ] HTTPS enforced in production
- [ ] Input validation on frontend and backend
- [ ] No SQL injection vulnerabilities
- [ ] Security audit passed

### Testing

- [ ] Test XSS payloads
- [ ] Test rate limiting
- [ ] Test CORS from different origins
- [ ] Security scan with OWASP ZAP
- [ ] Penetration testing

### References

- [KNOWN_ISSUES.md - Security Concerns](./specs/KNOWN_ISSUES.md)
- [ROADMAP.md - Milestone 3](./specs/ROADMAP.md)

---

## Issue #8: Implement Chat History Persistence

**Labels:** `high-priority`, `feature`, `backend`, `frontend`  
**Priority:** P1 - High  
**Effort:** Medium (8-10 hours)  
**Milestone:** v0.3.0

### Description

Chat conversations with the AI agent are currently not saved. Users lose their conversation history when they refresh the page or navigate away. We need to implement persistent chat history.

### Features

- Save conversation history to database
- Load previous conversations on page load
- Support multiple conversation threads
- Search through chat history
- Export conversations
- Delete conversations

### Technical Requirements

#### Database Schema

```sql
-- Conversations table
CREATE TABLE conversations (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title VARCHAR(255),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  last_message_at TIMESTAMP
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id),
  role VARCHAR(50), -- 'user' or 'agent'
  content TEXT,
  citations JSONB,
  created_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_conversations_last_message ON conversations(last_message_at DESC);
```

#### Backend API

```typescript
// Conversations
GET /api/v1/conversations
POST /api/v1/conversations
GET /api/v1/conversations/{id}
DELETE /api/v1/conversations/{id}
PUT /api/v1/conversations/{id}

// Messages
GET /api/v1/conversations/{id}/messages
POST /api/v1/conversations/{id}/messages
```

#### Frontend Implementation

**Conversation Manager:**
```typescript
// src/lib/api/conversations.ts

export const conversationsApi = {
  async list(): Promise<Conversation[]> {
    const response = await apiClient.get('/conversations');
    return response.data;
  },
  
  async create(title?: string): Promise<Conversation> {
    const response = await apiClient.post('/conversations', { title });
    return response.data;
  },
  
  async getMessages(conversationId: string): Promise<Message[]> {
    const response = await apiClient.get(`/conversations/${conversationId}/messages`);
    return response.data;
  },
  
  async sendMessage(conversationId: string, message: string): Promise<Message> {
    const response = await apiClient.post(`/conversations/${conversationId}/messages`, {
      content: message
    });
    return response.data;
  }
};
```

**Update ChatPanel3D:**
```typescript
// src/lib/ChatPanel3D.ts

export class ChatPanel3D {
  private conversationId: string | null = null;
  
  constructor(scene: Scene) {
    this.loadOrCreateConversation();
  }
  
  private async loadOrCreateConversation() {
    // Load existing or create new conversation
    const conversations = await conversationsApi.list();
    if (conversations.length > 0) {
      this.conversationId = conversations[0].id;
      await this.loadMessages();
    } else {
      const newConv = await conversationsApi.create();
      this.conversationId = newConv.id;
    }
  }
  
  private async loadMessages() {
    if (!this.conversationId) return;
    const messages = await conversationsApi.getMessages(this.conversationId);
    messages.forEach(msg => {
      this.addMessage(
        msg.role === 'user' ? 'You' : 'Agent',
        msg.content,
        msg.role === 'user' ? USER_COLOR : AGENT_COLOR
      );
    });
  }
  
  public async sendMessage(message: string) {
    if (!this.conversationId) return;
    
    // Save to database
    await conversationsApi.sendMessage(this.conversationId, message);
    
    // Display in UI
    this.addMessage('You', message, USER_COLOR);
    
    // Get agent response and save
    // ...
  }
}
```

### UI Components

#### Conversation List
```typescript
// src/components/ConversationList.tsx

export function ConversationList() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  
  return (
    <div className="conversation-list">
      {conversations.map(conv => (
        <ConversationItem
          key={conv.id}
          conversation={conv}
          onClick={() => loadConversation(conv.id)}
        />
      ))}
      <button onClick={createNewConversation}>
        + New Conversation
      </button>
    </div>
  );
}
```

### Tasks

#### Backend (4-5 hours)
- [ ] Create database migrations
- [ ] Implement conversation CRUD endpoints
- [ ] Implement message endpoints
- [ ] Add pagination for messages
- [ ] Add full-text search for messages
- [ ] Add conversation metadata (title generation)

#### Frontend (4-5 hours)
- [ ] Create conversation API client
- [ ] Update ChatPanel3D with persistence
- [ ] Create ConversationList component
- [ ] Add conversation switching UI
- [ ] Implement message loading
- [ ] Add conversation search
- [ ] Add export functionality
- [ ] Add delete confirmation

### Features

#### Auto-title Generation
```python
# Backend: Auto-generate conversation title from first message
def generate_title(first_message: str) -> str:
    # Use LLM to generate concise title
    # Or use first 50 chars
    return first_message[:50] + "..." if len(first_message) > 50 else first_message
```

#### Message Timestamps
```typescript
// Display message time
{message.created_at && (
  <span className="text-xs text-gray-500">
    {formatDistanceToNow(new Date(message.created_at))} ago
  </span>
)}
```

#### Search Conversations
```typescript
GET /api/v1/conversations/search?q={query}

// Search in message content and conversation titles
```

### Acceptance Criteria

- [ ] Conversations persist across sessions
- [ ] Messages load from database
- [ ] Users can create multiple conversations
- [ ] Users can switch between conversations
- [ ] Conversation list shows recent activity
- [ ] Messages show timestamps
- [ ] Users can search conversations
- [ ] Users can delete conversations
- [ ] Users can export conversations
- [ ] Works in VR mode

### Performance Considerations

- Paginate messages (50 per page)
- Cache recent conversations
- Lazy load old messages
- Index database properly

### References

- [ROADMAP.md - Milestone 1](./specs/ROADMAP.md)

---

## Issue #9: DICOM Medical Imaging Visualization

**Labels:** `medium-priority`, `feature`, `medical`, `3d`, `backend`, `frontend`  
**Priority:** P2 - Medium  
**Effort:** X-Large (38-54 hours)  
**Milestone:** v0.5.0

### Description

Implement support for viewing DICOM medical imaging files in 3D/VR and searching medical imaging repositories like The Cancer Imaging Archive (TCIA).

### User Story

> As a medical researcher, I want to view DICOM medical imaging files in 3D/VR and search medical imaging repositories, so I can analyze diagnostic images alongside scientific papers for comprehensive medical research.

### Features Overview

1. DICOM file upload and parsing
2. 2D slice viewer with windowing controls
3. 3D volume rendering
4. VR immersive viewing
5. TCIA repository search integration
6. Measurement tools
7. Multi-modal overlay (CT + PET)

### Implementation Phases

#### Phase 1: DICOM Backend (8-12 hours)

**Libraries:**
```python
pip install pydicom SimpleITK numpy pillow
```

**Tasks:**
- [ ] Create DICOMService for parsing
- [ ] Implement DICOM upload endpoint
- [ ] Extract and store metadata
- [ ] Convert DICOM to web formats (PNG, NIfTI)
- [ ] Support multi-slice series
- [ ] Implement anonymization
- [ ] Create DICOM REST endpoints

**Endpoints:**
```typescript
POST /api/v1/dicom/upload
GET /api/v1/dicom/{id}
GET /api/v1/dicom/{id}/image
GET /api/v1/dicom/{id}/series
GET /api/v1/dicom/studies
POST /api/v1/dicom/anonymize
```

#### Phase 2: DICOM Visualization (12-16 hours)

**Libraries:**
```typescript
npm install cornerstone-core cornerstone-tools
// or
npm install ami.js  // For BabylonJS integration
```

**Tasks:**
- [ ] Research DICOM viewer libraries
- [ ] Create DicomViewer2D component
- [ ] Implement windowing/leveling controls
- [ ] Add measurement tools (distance, angle, area)
- [ ] Create Volume3D component
- [ ] Implement volume rendering
- [ ] Add clipping planes
- [ ] VR controls for navigation

**Components:**
```
src/components/dicom/
├── DicomViewer.tsx         # 2D slice viewer
├── Volume3D.tsx            # 3D volume rendering
├── DicomControls.tsx       # UI controls
└── DicomMeasurements.tsx   # Measurement tools

src/lib/dicom/
├── dicomLoader.ts          # Load DICOM files
├── volumeRenderer.ts       # 3D rendering
└── windowLevel.ts          # Windowing algorithms
```

#### Phase 3: TCIA Integration (10-14 hours)

**Tasks:**
- [ ] Create TCIA API v4 client
- [ ] Implement collection/modality search
- [ ] Create imaging search agent
- [ ] Index Awesome DICOM into RAG
- [ ] Create imaging search endpoints
- [ ] Implement background downloads
- [ ] Link images to papers

**TCIA API:**
```typescript
// TCIA REST API v4 endpoints
GET /v4/query/getCollectionValues
GET /v4/query/getModalityValues
GET /v4/query/getBodyPartValues
GET /v4/query/getPatientStudy
GET /v4/query/getSeries
GET /v4/query/getImage
```

#### Phase 4: Imaging Search UI (8-12 hours)

**Tasks:**
- [ ] Create ImagingSearchBar component
- [ ] Add modality/body part filters
- [ ] Display preview thumbnails
- [ ] Show DICOM metadata
- [ ] Implement download/view workflow
- [ ] Integrate with 3D scene
- [ ] VR voice search

### Technical Details

#### 2D Slice Viewer Features
- Display individual DICOM slices
- Windowing/Leveling (brightness/contrast)
- Pan/zoom/rotate
- Measurement tools (distance, angle, area)
- Multi-planar reconstruction (MPR)

#### 3D Volume Rendering Features
- Volume rendering for CT/MRI series
- Adjustable transfer functions
- Clipping planes
- Isosurface extraction
- Maximum Intensity Projection (MIP)

#### VR Features
- Immersive 3D volume viewing
- Gesture-based slice navigation
- Spatial measurement tools
- Multi-modal overlay (CT + PET)

### Database Schema

```sql
CREATE TABLE dicom_studies (
  id UUID PRIMARY KEY,
  patient_id VARCHAR(255),
  study_date DATE,
  modality VARCHAR(50),
  description TEXT,
  created_at TIMESTAMP
);

CREATE TABLE dicom_series (
  id UUID PRIMARY KEY,
  study_id UUID REFERENCES dicom_studies(id),
  series_number INT,
  images_count INT,
  modality VARCHAR(50),
  body_part VARCHAR(100)
);

CREATE TABLE dicom_images (
  id UUID PRIMARY KEY,
  series_id UUID REFERENCES dicom_series(id),
  instance_number INT,
  file_path VARCHAR(500),
  slice_location FLOAT
);

CREATE TABLE imaging_collections (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  repository VARCHAR(100),
  modality VARCHAR(50),
  description TEXT
);
```

### Security & Privacy

#### HIPAA Compliance
- De-identification: Remove all 18 PHI identifiers
- Access controls: Authentication required
- Audit logs: Track all data access
- Encryption: At rest and in transit

#### TCIA Data Use
- Open access: De-identified and public
- Attribution: Cite collection creators
- No redistribution: Don't re-host TCIA data

### Performance Considerations

- DICOM files are large (50-500 MB per CT series)
- Volume rendering is GPU-intensive
- Progressive loading for large files
- Cache frequently accessed series
- TCIA API has rate limits

### Acceptance Criteria

- [ ] Can upload and view DICOM files
- [ ] 2D slice viewer with windowing works
- [ ] 3D volume rendering displays correctly
- [ ] Can search TCIA by modality and body part
- [ ] Agent understands imaging-related queries
- [ ] VR volume viewing maintains >60 FPS
- [ ] DICOM anonymization removes PHI
- [ ] Measurement tools are accurate
- [ ] Can link images to related papers

### Testing

- [ ] Test with sample DICOM files from TCIA
- [ ] Test multiple modalities (CT, MRI, X-Ray, PET)
- [ ] Test large series (500+ slices)
- [ ] Test VR performance
- [ ] Test anonymization compliance

### Dependencies

- Storage infrastructure for large files
- GPU for volume rendering
- Backend agent framework

### References

- [USER_STORIES.md - DICOM Medical Imaging](./specs/USER_STORIES.md#dicom-medical-imaging-visualization)
- DICOM Standard: https://www.dicomstandard.org/
- TCIA: https://www.cancerimagingarchive.net/
- TCIA API Docs: https://wiki.cancerimagingarchive.net/

---

## Issue #10: Implement Data Visualization - Keyword Trends

**Labels:** `medium-priority`, `feature`, `visualization`, `backend`, `frontend`  
**Priority:** P2 - Medium  
**Effort:** Medium (10-14 hours)  
**Milestone:** v0.4.0

### Description

Implement keyword trend line graphs to visualize how frequently specific keywords appear in research papers over time.

### User Story

> As a researcher, I want to see how frequently specific keywords appear in research papers over time, so I can understand the evolution and popularity of research topics.

### Features

- Multi-line graphs (up to 10 keywords)
- Interactive legend (toggle lines)
- Time range selection
- Normalization options (absolute, relative, percentage)
- Export graph and data
- 3D integration in VR

### Technical Requirements

#### Backend (6-8 hours)

**Analysis Service:**
```python
# server/app/services/analytics_service.py

class AnalyticsService:
    async def get_keyword_trends(
        self,
        keywords: List[str],
        start_year: int,
        end_year: int,
        normalization: str = "absolute"
    ) -> dict:
        # Query corpus database
        # Extract keyword frequencies
        # Aggregate by year
        # Calculate trends
        # Return structured data
```

**API Endpoint:**
```typescript
GET /api/v1/analytics/keyword-trends?keywords=bioink,CRISPR&start_year=2015&end_year=2025&normalization=relative

Response:
{
  "trends": [
    {
      "keyword": "bioink",
      "data": [
        {"year": 2015, "count": 45, "documents": 120},
        {"year": 2016, "count": 67, "documents": 150}
      ]
    }
  ],
  "metadata": {
    "totalDocuments": 1500,
    "yearRange": [2015, 2025]
  }
}
```

**Tasks:**
- [ ] Create AnalyticsService
- [ ] Implement keyword frequency extraction
- [ ] Add time-series aggregation
- [ ] Implement normalization algorithms
- [ ] Cache common queries (Redis)
- [ ] Add API endpoint
- [ ] Write tests

#### Frontend (4-6 hours)

**Plotly.js Integration:**
```typescript
npm install plotly.js-dist
// or for smaller bundle
npm install plotly.js-basic-dist
```

**KeywordTrendsChart Component:**
```typescript
// src/components/analytics/KeywordTrendsChart.tsx

import Plotly from 'plotly.js-dist';

export function KeywordTrendsChart({ keywords, startYear, endYear }: Props) {
  const [data, setData] = useState<TrendData[]>([]);
  
  useEffect(() => {
    loadTrendData();
  }, [keywords, startYear, endYear]);
  
  const loadTrendData = async () => {
    const response = await analyticsApi.getKeywordTrends({
      keywords,
      startYear,
      endYear,
      normalization: 'relative'
    });
    setData(response.trends);
  };
  
  useEffect(() => {
    if (data.length > 0) {
      renderChart();
    }
  }, [data]);
  
  const renderChart = () => {
    const traces = data.map(trend => ({
      x: trend.data.map(d => d.year),
      y: trend.data.map(d => d.count),
      type: 'scatter',
      mode: 'lines+markers',
      name: trend.keyword,
      line: { shape: 'spline' }
    }));
    
    const layout = {
      title: 'Keyword Trends Over Time',
      xaxis: { title: 'Year' },
      yaxis: { title: 'Frequency' },
      showlegend: true
    };
    
    Plotly.newPlot('chart', traces, layout);
  };
  
  return (
    <div>
      <KeywordSelector onSelect={setKeywords} />
      <YearRangeSelector onChange={(start, end) => {
        setStartYear(start);
        setEndYear(end);
      }} />
      <div id="chart" />
      <ExportButtons data={data} />
    </div>
  );
}
```

**3D Integration:**
```typescript
// For VR mode: Render to texture
const plotDiv = document.createElement('div');
Plotly.newPlot(plotDiv, data, layout);

const canvas = plotDiv.querySelector('canvas');
const texture = new BABYLON.Texture.CreateFromCanvas(canvas);

const plane = BABYLON.MeshBuilder.CreatePlane("plot", {size: 10}, scene);
plane.material = new BABYLON.StandardMaterial("plotMat", scene);
plane.material.diffuseTexture = texture;
```

### Tasks

#### Backend
- [ ] Create AnalyticsService class
- [ ] Implement keyword extraction
- [ ] Add time-series queries
- [ ] Implement caching layer
- [ ] Create API endpoint
- [ ] Add tests
- [ ] Document API

#### Frontend
- [ ] Install Plotly.js
- [ ] Create KeywordTrendsChart component
- [ ] Create KeywordSelector component
- [ ] Add year range selector
- [ ] Implement normalization toggle
- [ ] Add export functionality (PNG, SVG, CSV)
- [ ] Integrate into 3D scene
- [ ] VR texture mapping
- [ ] Add tests

### UI Components

```
┌─────────────────────────────────────┐
│ Keyword Trends                      │
├─────────────────────────────────────┤
│ Keywords: [bioink] [CRISPR] [+Add] │
│ Years: [2015] ──────── [2025]      │
│ Mode: ○ Absolute ● Relative        │
├─────────────────────────────────────┤
│                                     │
│        [CHART AREA]                 │
│                                     │
│   Legend:                           │
│   ─ bioink  ─ CRISPR               │
├─────────────────────────────────────┤
│ [Export PNG] [Export CSV] [Share]  │
└─────────────────────────────────────┘
```

### Performance Requirements

- Query response < 500ms (cached)
- Chart renders in < 1s
- Smooth animations at 60 FPS
- Support corpus up to 100,000 documents

### Acceptance Criteria

- [ ] Can select multiple keywords
- [ ] Chart displays correctly
- [ ] Interactive legend works
- [ ] Time range selection works
- [ ] Normalization modes work
- [ ] Export functions work
- [ ] Integration in 3D scene works
- [ ] VR performance acceptable
- [ ] Data is accurate

### References

- [USER_STORIES.md - Data Visualization](./specs/USER_STORIES.md#data-visualization-requirements)
- Plotly.js Docs: https://plotly.com/javascript/

---

*[Issues #11-20 would follow similar detailed format. For brevity, I'll create a summary table for the remaining issues]*

## Remaining Issues Summary

| # | Title | Priority | Effort | Milestone |
|---|-------|----------|--------|-----------|
| 11 | Data Visualization - Word Clouds | P2 | Medium (8-10h) | v0.4.0 |
| 12 | Optimize VR Performance | P2 | Medium (12-16h) | v0.4.0 |
| 13 | Add Mobile Support | P2 | Large (16-20h) | v0.5.0 |
| 14 | 3D Document Browser | P2 | Medium (10-14h) | v0.4.0 |
| 15 | Add Testing Suite | P2 | Large (20-30h) | v0.4.0 |
| 16 | Collaborative Features | P3 | X-Large (30-40h) | v0.6.0 |
| 17 | Voice Commands for VR | P3 | Medium (10-14h) | v0.6.0 |
| 18 | Knowledge Graph Visualization | P3 | Large (20-25h) | v0.7.0 |
| 19 | Export Capabilities | P3 | Small (6-8h) | v0.5.0 |
| 20 | Progressive Web App | P3 | Medium (8-12h) | v0.6.0 |

---

## Labels Reference

### Priority Labels
- `critical` - P0 - Must have, blocking
- `high-priority` - P1 - Should have soon
- `medium-priority` - P2 - Important but can wait
- `low-priority` - P3 - Nice to have

### Type Labels
- `bug` - Something isn't working
- `enhancement` - New feature or request
- `security` - Security vulnerability
- `performance` - Performance improvement
- `documentation` - Documentation update

### Area Labels
- `frontend` - React/Next.js/UI
- `backend` - Python API/Services
- `3d` - Babylon.js/3D rendering
- `vr` - WebXR/VR specific
- `ai` - LLM/Agent features
- `medical` - DICOM/Medical imaging
- `visualization` - Data visualization
- `ux` - User experience

### Size Labels
- `small` - < 8 hours
- `medium` - 8-16 hours
- `large` - 16-30 hours
- `x-large` - 30+ hours

---

## Issue Creation Checklist

When creating each issue on GitHub:

- [ ] Copy title and description
- [ ] Add appropriate labels
- [ ] Set milestone
- [ ] Add to project board
- [ ] Assign if known
- [ ] Link related issues
- [ ] Add acceptance criteria as task list
- [ ] Link to relevant documentation

---

## Issue #9: Confine User Motion to Horizontal Plane

**Labels:** `enhancement`, `vr`, `ux`, `medium-priority`  
**Priority:** P2 - Medium  
**Effort:** Small (2-4 hours)  
**Milestone:** v0.4.0
**GitHub:** https://github.com/buddha314/beabodocl-babylon/issues/9

### Description

In VR mode, users can currently move freely in all three dimensions, including up and down (Y-axis). For most research/document viewing scenarios, we want to confine user movement to a horizontal plane at a fixed height, similar to walking on a floor.

### Current Behavior

- Users can move in X, Y, and Z directions
- Free-flying movement can be disorienting
- No ground reference or constraints
- Users can "fall" or "fly" unintentionally

### Expected Behavior

- User movement confined to horizontal plane (XZ plane)
- Y-position stays constant during locomotion
- Smooth, ground-level navigation
- More natural, less disorienting VR experience
- Head/camera still free to look up/down
- **NavMesh defines walkable areas within the scene**

### Technical Implementation

#### Navigation Mesh (NavMesh) Required

**A navigation mesh must be created to define walkable areas:**

```typescript
// src/lib/vr/navmesh.ts

import { Scene, Mesh, Vector3 } from "@babylonjs/core";
import { RecastJSPlugin } from "@babylonjs/core/Navigation/Plugins/recastJSPlugin";

export class NavMeshSystem {
  private navigationPlugin: RecastJSPlugin | null = null;
  
  async initialize(scene: Scene, walkableFloors: Mesh[]) {
    // Load Recast.js navigation library
    const recast = await import("recast-detour");
    
    // Create navigation plugin
    this.navigationPlugin = new RecastJSPlugin(recast);
    
    // Create navmesh from floor meshes
    const navmeshParameters = {
      cs: 0.2,        // Cell size
      ch: 0.2,        // Cell height
      walkableSlopeAngle: 35,  // Max slope angle
      walkableHeight: 2.0,     // Agent height
      walkableClimb: 0.5,      // Max step height
      walkableRadius: 0.5,     // Agent radius
      maxEdgeLen: 12,
      maxSimplificationError: 1.3,
      minRegionArea: 8,
      mergeRegionArea: 20,
      maxVertsPerPoly: 6,
      detailSampleDist: 6,
      detailSampleMaxError: 1,
    };
    
    // Build the navigation mesh
    this.navigationPlugin.createNavMesh(walkableFloors, navmeshParameters);
    
    console.log("Navigation mesh created successfully");
  }
  
  /**
   * Check if a position is on the navmesh
   */
  isPositionOnNavMesh(position: Vector3): boolean {
    if (!this.navigationPlugin) return false;
    
    const closestPoint = this.navigationPlugin.getClosestPoint(position);
    const distance = Vector3.Distance(position, closestPoint);
    
    // Allow small tolerance for Y-axis variance
    return distance < 0.5;
  }
  
  /**
   * Get the closest valid position on the navmesh
   */
  getClosestPointOnNavMesh(position: Vector3): Vector3 {
    if (!this.navigationPlugin) return position;
    return this.navigationPlugin.getClosestPoint(position);
  }
  
  /**
   * Compute a path between two points on the navmesh
   */
  computePath(start: Vector3, end: Vector3): Vector3[] {
    if (!this.navigationPlugin) return [];
    return this.navigationPlugin.computePath(start, end);
  }
  
  /**
   * Debug: Show the navmesh visually
   */
  showDebugMesh(scene: Scene) {
    if (!this.navigationPlugin) return;
    
    const navmeshDebug = this.navigationPlugin.createDebugNavMesh(scene);
    if (navmeshDebug) {
      navmeshDebug.position = new Vector3(0, 0.01, 0); // Slightly above floor
      const mat = new StandardMaterial("navmeshMat", scene);
      mat.diffuseColor = new Color3(0, 1, 0);
      mat.alpha = 0.3;
      navmeshDebug.material = mat;
    }
  }
}
```

#### WebXR Locomotion System

**Update camera position constraints with navmesh validation:**
```typescript
// src/lib/vr/locomotion.ts

export class LocomotionSystem {
  private readonly FLOOR_HEIGHT = 1.6; // Average eye height in meters
  private navMesh: NavMeshSystem;
  
  constructor(
    private scene: Scene, 
    private xr: WebXRDefaultExperience,
    navMesh: NavMeshSystem
  ) {
    this.navMesh = navMesh;
    this.setupTeleportation();
    this.constrainMovement();
  }
  
  private constrainMovement() {
    // Store initial Y position
    const initialY = this.xr.baseExperience.camera.position.y || this.FLOOR_HEIGHT;
    
    // Constrain on every frame
    this.scene.onBeforeRenderObservable.add(() => {
      if (this.xr.baseExperience.state === WebXRState.IN_XR) {
        const camera = this.xr.baseExperience.camera;
        
        // Keep Y position constant
        camera.position.y = initialY;
        
        // Ensure position is on navmesh
        const currentPos = camera.position.clone();
        currentPos.y = 0; // Check XZ position only
        
        if (!this.navMesh.isPositionOnNavMesh(currentPos)) {
          // Snap back to nearest valid position on navmesh
          const validPos = this.navMesh.getClosestPointOnNavMesh(currentPos);
          camera.position.x = validPos.x;
          camera.position.z = validPos.z;
        }
      }
    });
  }
  
  private setupTeleportation() {
    const featuresManager = this.xr.baseExperience.featuresManager;
    
    // Enable teleportation (horizontal only)
    const teleportation = featuresManager.enableFeature(
      WebXRFeatureName.TELEPORTATION,
      "stable",
      {
        floorMeshes: this.getFloorMeshes(),
        xrInput: this.xr.input,
        snapPositions: this.getSnapPositions(),
      }
    );
    
    // Ensure teleportation respects floor height and navmesh
    if (teleportation) {
      teleportation.attach();
      teleportation.onTargetMeshPositionUpdatedObservable.add((newPosition) => {
        newPosition.y = this.FLOOR_HEIGHT;
        
        // Validate teleport target is on navmesh
        if (!this.navMesh.isPositionOnNavMesh(newPosition)) {
          const validPos = this.navMesh.getClosestPointOnNavMesh(newPosition);
          newPosition.x = validPos.x;
          newPosition.z = validPos.z;
        }
      });
    }
  }
  
  private getFloorMeshes(): Mesh[] {
    // Return floor meshes for teleportation
    return this.scene.meshes.filter(m => m.name.includes("floor")) as Mesh[];
  }
}
```

**Update in page.tsx:**
```typescript
// src/app/page.tsx

const handleWebXRInit = async (scene: Scene) => {
  // Create floor/ground meshes first
  const ground = MeshBuilder.CreateGround("ground", { width: 20, height: 20 }, scene);
  
  // Initialize navigation mesh
  const navMeshSystem = new NavMeshSystem();
  await navMeshSystem.initialize(scene, [ground]);
  
  // Optional: Show navmesh for debugging
  if (process.env.NODE_ENV === "development") {
    navMeshSystem.showDebugMesh(scene);
  }
  
  const xr = await scene.createDefaultXRExperienceAsync({
    floorMeshes: [ground],
    disableTeleportation: false,
  });
  
  // Add locomotion constraints with navmesh
  const locomotion = new LocomotionSystem(scene, xr, navMeshSystem);
  
  return xr;
};
```

### NavMesh Benefits

- **Walkable Area Definition:** Clearly defines where users can walk
- **Collision Prevention:** Prevents walking through walls or off edges
- **Pathfinding:** Enables AI navigation and guided tours
- **Multi-level Support:** Handles stairs, ramps, and platforms
- **Performance:** Efficient spatial queries for position validation

### Scene Requirements

The scene must include:
- [ ] Ground/floor meshes marked as walkable
- [ ] Proper mesh colliders for walls/obstacles
- [ ] NavMesh baked from walkable surfaces
- [ ] Optional: Multiple NavMesh areas for different zones
- [ ] Optional: Off-mesh links for jumps/teleports

### Alternative Approaches

#### Option 1: Teleportation Only
- Disable smooth locomotion
- Only allow teleportation to ground level
- Most common in VR apps

#### Option 2: Gravity Simulation
- Apply simple gravity physics
- User "falls" to ground if in air
- More realistic but more complex

#### Option 3: Configurable
- Allow users to toggle free flight vs. grounded
- Best of both worlds
- Add setting in UI

### Tasks

#### Phase 1: NavMesh Setup (1-2 hours)
- [ ] Install Recast.js navigation library
- [ ] Create NavMeshSystem class
- [ ] Define walkable floor meshes in scene
- [ ] Configure navmesh parameters
- [ ] Build navigation mesh from scene geometry
- [ ] Add navmesh debug visualization
- [ ] Test navmesh coverage of walkable areas

#### Phase 2: Locomotion Integration (1-2 hours)
- [ ] Create LocomotionSystem class
- [ ] Implement Y-axis constraint
- [ ] Integrate navmesh position validation
- [ ] Update WebXR initialization with navmesh
- [ ] Set appropriate floor height (1.6m default)
- [ ] Constrain teleportation to navmesh
- [ ] Test smooth locomotion stays on navmesh
- [ ] Add user preference setting
- [ ] Update documentation
- [ ] Test on Quest headsets

### Dependencies

**Required:**
- Recast.js library for navigation mesh
- Ground/floor meshes in the scene
- Babylon.js Navigation plugin

**Installation:**
```bash
npm install recast-detour
```

### User Experience

**Before:**
- User can accidentally drift up or down
- Disorienting floating sensation
- No consistent ground reference

**After:**
- Stable, ground-level movement
- Natural walking simulation
- Consistent spatial reference
- Less VR sickness

### Performance Impact

- NavMesh queries: ~0.1ms per frame (negligible)
- Simple Y-coordinate constraint per frame
- No additional rendering overhead (except debug visualization)
- Should maintain 90 FPS target
- NavMesh built once at scene load

### Acceptance Criteria

- [ ] Navigation mesh successfully created from scene geometry
- [ ] User movement constrained to horizontal plane in VR
- [ ] User cannot walk through walls or off edges (navmesh boundaries)
- [ ] Y-position remains constant during locomotion
- [ ] Teleportation targets stay at floor level and on navmesh
- [ ] Head tracking still allows looking up/down
- [ ] No performance degradation (<90 FPS in VR)
- [ ] Works on Quest 2/3 and desktop VR
- [ ] Configurable floor height
- [ ] Smooth, no jittering
- [ ] Debug visualization available in development mode

### Testing Scenarios

- [ ] Test navmesh creation with simple floor
- [ ] Test navmesh creation with complex multi-room scene
- [ ] Test smooth locomotion in VR stays on navmesh
- [ ] Test teleportation respects navmesh boundaries
- [ ] Test walking towards walls (should be blocked)
- [ ] Test walking off edges (should be blocked)
- [ ] Test on uneven terrain (stairs, ramps)
- [ ] Test with different floor heights
- [ ] Test head movement (should work normally)
- [ ] Verify no motion sickness increase
- [ ] Performance test with large navmesh

### Related Issues

- Issue #12 (VR Performance Optimization)
- Issue #10 (Player Strafing)

### References

- [WebXR Locomotion](https://www.babylonjs-playground.com/#9K3MRA)
- [Babylon.js WebXR Docs](https://doc.babylonjs.com/features/featuresDeepDive/webXR)
- [Babylon.js Navigation Mesh](https://doc.babylonjs.com/features/featuresDeepDive/crowdNavigation/navigationIntro)
- [Recast Navigation](https://github.com/recastnavigation/recastnavigation)
- [Crowd Navigation Demo](https://www.babylonjs-playground.com/#X5XHAX)

---

## Issue #10: Enable Player Strafing on Left Joystick

**Labels:** `enhancement`, `vr`, `high-priority`  
**Priority:** P1 - High  
**Effort:** Small (3-5 hours)  
**Milestone:** v0.3.0
**GitHub:** https://github.com/buddha314/beabodocl-babylon/issues/10

### Description

Implement full directional movement (forward/backward/left/right strafe) using the left joystick on VR controllers, providing more natural and flexible locomotion.

### Current Behavior

- Left joystick may only move forward/backward
- No lateral (strafing) movement
- Limited mobility and navigation
- Users must physically turn or rotate camera to move sideways

### Expected Behavior

- Left joystick Y-axis: Forward/Backward movement
- Left joystick X-axis: Left/Right strafing
- Smooth, responsive controls
- Direction relative to headset orientation
- Similar to FPS game controls

### User Story

> As a VR user, I want to strafe left/right using the left joystick, so I can navigate the environment smoothly without having to physically turn my body or use snap turning.

### Technical Implementation

#### WebXR Movement Feature

**Create custom movement system:**
```typescript
// src/lib/vr/movement.ts

import { WebXRAbstractMotionController } from "@babylonjs/core/XR";
import { Scene } from "@babylonjs/core";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";

export class VRMovementSystem {
  private movementSpeed = 2.0; // meters per second
  private readonly DEADZONE = 0.15; // Joystick deadzone
  
  constructor(
    private scene: Scene,
    private xr: WebXRDefaultExperience
  ) {
    this.setupMovementControls();
  }
  
  private setupMovementControls() {
    // Get left controller
    this.xr.input.onControllerAddedObservable.add((controller) => {
      if (controller.inputSource.handedness === "left") {
        this.attachMovementToController(controller);
      }
    });
  }
  
  private attachMovementToController(controller: WebXRInputSource) {
    const motionController = controller.motionController;
    if (!motionController) return;
    
    // Get thumbstick component
    const thumbstick = motionController.getComponent("xr-standard-thumbstick");
    if (!thumbstick) return;
    
    // Update movement every frame
    this.scene.onBeforeRenderObservable.add(() => {
      if (thumbstick.axes) {
        const xAxis = thumbstick.axes.x; // Left/Right strafe
        const yAxis = thumbstick.axes.y; // Forward/Backward
        
        this.applyMovement(xAxis, yAxis);
      }
    });
  }
  
  private applyMovement(xInput: number, yInput: number) {
    // Apply deadzone
    if (Math.abs(xInput) < this.DEADZONE) xInput = 0;
    if (Math.abs(yInput) < this.DEADZONE) yInput = 0;
    
    if (xInput === 0 && yInput === 0) return;
    
    const camera = this.xr.baseExperience.camera;
    const deltaTime = this.scene.getEngine().getDeltaTime() / 1000;
    
    // Get camera forward direction (projected on XZ plane)
    const forward = camera.getForwardRay().direction.clone();
    forward.y = 0; // Remove vertical component
    forward.normalize();
    
    // Get camera right direction
    const right = Vector3.Cross(Vector3.Up(), forward).normalize();
    
    // Calculate movement vector
    const moveVector = forward.scale(-yInput) // Forward/backward (inverted)
      .add(right.scale(xInput)); // Left/right strafe
    
    // Apply movement
    const speed = this.movementSpeed * deltaTime;
    camera.position.addInPlace(moveVector.scale(speed));
  }
  
  public setSpeed(speed: number) {
    this.movementSpeed = speed;
  }
  
  public getSpeed(): number {
    return this.movementSpeed;
  }
}
```

**Integrate into scene:**
```typescript
// src/app/page.tsx

const initVR = async (scene: Scene) => {
  const xr = await scene.createDefaultXRExperienceAsync({
    floorMeshes: [ground],
    disableTeleportation: false, // Keep teleportation as alternative
  });
  
  // Disable default locomotion if it exists
  const locomotionFeature = xr.baseExperience.featuresManager.getEnabledFeature(
    WebXRFeatureName.MOVEMENT
  );
  if (locomotionFeature) {
    locomotionFeature.detach();
  }
  
  // Add custom movement system
  const movement = new VRMovementSystem(scene, xr);
  
  // Optional: Add speed control UI
  movement.setSpeed(2.0); // 2 m/s default
  
  return xr;
};
```

### Control Mapping

**Left Controller (Quest/Index/etc):**
```
Thumbstick:
  ↑ (Y+)  → Move Forward
  ↓ (Y-)  → Move Backward
  ← (X-)  → Strafe Left
  → (X+)  → Strafe Right
  
  Diagonal: Combined movement
```

**Right Controller:**
```
Thumbstick:
  ← → → Snap Turn (optional)
  ↑ ↓  → Reserved for UI navigation
```

### Advanced Features (Optional)

#### Sprint/Walk Toggle
```typescript
// Hold trigger while moving for sprint
private isSprintPressed = false;

const trigger = motionController.getComponent("xr-standard-trigger");
trigger?.onButtonStateChangedObservable.add((component) => {
  this.isSprintPressed = component.pressed;
});

// In applyMovement:
const speedMultiplier = this.isSprintPressed ? 2.0 : 1.0;
const speed = this.movementSpeed * speedMultiplier * deltaTime;
```

#### Smooth vs. Snap Turning
```typescript
// Right thumbstick for smooth or snap rotation
private setupRotationControls(controller: WebXRInputSource) {
  const thumbstick = controller.motionController.getComponent("xr-standard-thumbstick");
  
  thumbstick.onAxisValueChangedObservable.add((axes) => {
    if (Math.abs(axes.x) > this.DEADZONE) {
      // Smooth turn
      const rotationSpeed = 90; // degrees per second
      const deltaTime = this.scene.getEngine().getDeltaTime() / 1000;
      this.xr.baseExperience.camera.rotation.y += 
        axes.x * rotationSpeed * deltaTime * (Math.PI / 180);
    }
  });
}
```

### Tasks

- [ ] Create VRMovementSystem class
- [ ] Implement joystick input reading
- [ ] Calculate strafe direction relative to headset
- [ ] Apply deadzone to prevent drift
- [ ] Smooth movement interpolation
- [ ] Add configurable movement speed
- [ ] Optional: Add sprint functionality
- [ ] Optional: Add smooth turning on right stick
- [ ] Test on Quest 2/3
- [ ] Test on Index/Vive
- [ ] Add comfort options (vignette during movement)
- [ ] Update documentation

### Comfort Options

For users prone to VR motion sickness:

```typescript
// Vignette during movement
private applyComfortVignette(isMoving: boolean) {
  if (isMoving && this.comfortModeEnabled) {
    // Reduce FOV during movement
    this.addVignetteEffect(0.3); // 30% darkening around edges
  } else {
    this.removeVignetteEffect();
  }
}
```

### Performance Considerations

- Lightweight: Simple vector math per frame
- No physics calculations needed
- Should not impact 90 FPS target
- Minimal CPU overhead

### Acceptance Criteria

- [ ] Left thumbstick controls forward/back/strafe
- [ ] Movement direction relative to headset orientation
- [ ] Smooth, responsive controls (no lag)
- [ ] Deadzone prevents unwanted drift
- [ ] Movement speed is comfortable (not too fast/slow)
- [ ] Works with Y-axis constraint (Issue #21)
- [ ] No performance impact
- [ ] Works on Quest 2/3
- [ ] Works on PC VR (Index, Vive, etc.)
- [ ] Optional comfort features available

### Testing Scenarios

- [ ] Test all 8 directions (N, S, E, W, NE, NW, SE, SW)
- [ ] Test diagonal movement smoothness
- [ ] Test deadzone (release stick should stop movement)
- [ ] Test while rotating head
- [ ] Test movement speed feels natural
- [ ] Test with plane constraint (Issue #21)
- [ ] Test for motion sickness (comfort)
- [ ] Verify no jittering or stuttering

### User Feedback

Collect feedback on:
- Movement speed preference
- Deadzone size
- Need for sprint feature
- Comfort options effectiveness

### Related Issues

- Issue #9 (Confine User Motion to Plane)
- Issue #12 (VR Performance Optimization)
- Issue #17 (Voice Commands for VR)

### References

- [WebXR Input Profiles](https://github.com/immersive-web/webxr-input-profiles)
- [Babylon.js XR Controller Input](https://doc.babylonjs.com/features/featuresDeepDive/webXR/webXRSelectedFeatures#controller-input)
- [VR Locomotion Best Practices](https://developer.oculus.com/resources/locomotion-design/)

---

**Total Issues**: 22  
**Total Estimated Effort**: 285-409 hours  
**Critical Issues**: 3  
**High Priority Issues**: 6  
**Medium Priority Issues**: 8  
**Low Priority Issues**: 5

**Last Updated**: November 7, 2025
