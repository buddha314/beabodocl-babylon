# GitHub Issues - November 10, 2025

**Project**: BeaboDOCL VR Research Interface  
**Repository**: github.com/buddha314/beabodocl-babylon  
**Status**: Updated for Solarpunk-Cyberpunk Design & Editor-First Approach

---

## 🎯 Current Focus: Implementation Phase 1-8

This document contains GitHub issue descriptions aligned with the new implementation plan. Issues are organized by phase and priority.

---

## Phase 1: Foundation Setup

### Issue #21: Install Babylon.js Dependencies and Configure Project

**Labels:** `critical`, `setup`, `phase-1`  
**Priority:** P0 - Critical  
**Effort:** Small (0.5 hours)  
**Milestone:** v1.0 - Foundation

**Description:**

Install all required Babylon.js packages and configure the Next.js project for 3D scene rendering.

**Tasks:**
- [ ] Install @babylonjs/core
- [ ] Install @babylonjs/gui
- [ ] Install @babylonjs/materials
- [ ] Install @babylonjs/havok
- [ ] Install babylonjs-editor-tools
- [ ] Verify package.json updated
- [ ] Run npm install successfully
- [ ] Verify TypeScript types available

**Acceptance Criteria:**
- [ ] All packages installed without errors
- [ ] TypeScript recognizes Babylon imports
- [ ] No dependency conflicts

---

### Issue #22: Create Next.js App Structure

**Labels:** `critical`, `frontend`, `phase-1`  
**Priority:** P0 - Critical  
**Effort:** Small (2 hours)  
**Milestone:** v1.0 - Foundation

**Description:**

Set up the basic Next.js application structure with layout, page, and styles.

**Tasks:**
- [ ] Create src/app/layout.tsx
- [ ] Create src/app/page.tsx with canvas element
- [ ] Create src/app/globals.css
- [ ] Configure Tailwind for UI elements
- [ ] Add viewport meta tags for VR
- [ ] Test dev server starts

**Acceptance Criteria:**
- [ ] `npm run dev` runs without errors
- [ ] Page loads at localhost:3000
- [ ] Canvas element renders
- [ ] Basic HTML structure in place

---

### Issue #23: Export Scene from Babylon Editor

**Labels:** `critical`, `editor`, `phase-1`  
**Priority:** P0 - Critical  
**Effort:** Small (1 hour)  
**Milestone:** v1.0 - Foundation

**Description:**

Export the designed scene from Babylon Editor to public/scene/ directory.

**Tasks:**
- [ ] Open project.bjseditor
- [ ] Verify all 4 meshes present (ground, sky, chatBackground, chatScreen)
- [ ] Build → Build and Export
- [ ] Verify files generated in public/scene/
- [ ] Check config.json created
- [ ] Verify geometry files present
- [ ] Confirm materials exported

**Acceptance Criteria:**
- [ ] public/scene/ directory created
- [ ] All mesh files exported
- [ ] Geometry files present
- [ ] Materials embedded in exports

---

### Issue #24: Implement Scene Loading in Next.js

**Labels:** `critical`, `frontend`, `3d`, `phase-1`  
**Priority:** P0 - Critical  
**Effort:** Medium (4 hours)  
**Milestone:** v1.0 - Foundation

**Description:**

Load and render the exported Babylon Editor scene in the Next.js application.

**Tasks:**
- [ ] Import Babylon.js modules in page.tsx
- [ ] Create canvas ref
- [ ] Initialize engine
- [ ] Use loadScene() from editor tools
- [ ] Point to public/scene/config.json
- [ ] Attach camera
- [ ] Start render loop
- [ ] Add error handling

**Code Reference:**
```typescript
import { loadScene } from 'babylonjs-editor-tools';

const initScene = async () => {
  const canvas = canvasRef.current;
  const engine = new Engine(canvas, true);
  
  const scene = await loadScene(engine, '/scene/config.json');
  
  engine.runRenderLoop(() => {
    scene.render();
  });
};
```

**Acceptance Criteria:**
- [ ] Scene loads without errors
- [ ] All 4 objects visible (ground, sky, 2 panels)
- [ ] Camera controls working (mouse drag/zoom)
- [ ] Render loop running
- [ ] 60+ FPS performance

---

## Phase 2: Hexagonal Room Environment

### Issue #25: Design and Create Hexagonal Room in Editor

**Labels:** `high-priority`, `editor`, `3d`, `phase-2`  
**Priority:** P1 - High  
**Effort:** Medium (4 hours)  
**Milestone:** v1.0 - Environment

**Description:**

Create the hexagonal workspace environment in Babylon Editor.

**Tasks:**
- [ ] Create hexagonal floor mesh (or large plane)
- [ ] Create 6 wall meshes
- [ ] Arrange in hexagon pattern (diameter ~1000 units)
- [ ] Set floor at Y: 0
- [ ] Set walls height ~400 units
- [ ] Position chat panel on front wall (0°)
- [ ] Add placeholder panels at 120° and 240°

**Design Specs:**
- Hexagon diameter: 1000 units
- Wall height: 400 units
- Panel distance from center: ~400-500 units
- 3 panels evenly distributed (0°, 120°, 240°)

**Acceptance Criteria:**
- [ ] Hexagonal room created
- [ ] 6 walls properly positioned
- [ ] Floor at correct height
- [ ] 3 panels positioned correctly

---

### Issue #26: Apply Solarpunk-Cyberpunk Materials and Textures

**Labels:** `high-priority`, `design`, `3d`, `phase-2`  
**Priority:** P1 - High  
**Effort:** Medium (6 hours)  
**Milestone:** v1.0 - Environment

**Description:**

Apply materials and textures that create the hybrid solarpunk-cyberpunk aesthetic.

**Tasks:**
- [ ] Generate or source floor texture (see INTERFACE_DESIGN.md prompts)
- [ ] Generate panel background textures (metal/wood/hybrid)
- [ ] Apply PBR materials to all surfaces
- [ ] Configure roughness, metallic, normal maps
- [ ] Test different combinations
- [ ] Adjust UV scaling for proper tiling

**Material References:**
See `specs/INTERFACE_DESIGN.md` - Asset Generation Prompts section for:
- Corrugated metal textures
- Reclaimed wood textures
- Hybrid tech-organic textures
- Floor textures with grid + organic gaps

**Acceptance Criteria:**
- [ ] All surfaces have materials applied
- [ ] Textures tile seamlessly
- [ ] PBR maps create realistic look
- [ ] Balance between tech and organic achieved
- [ ] Performance remains above 60 FPS

---

### Issue #27: Configure Lighting for Welcoming Atmosphere

**Labels:** `high-priority`, `design`, `3d`, `phase-2`  
**Priority:** P1 - High  
**Effort:** Small (4 hours)  
**Milestone:** v1.0 - Environment

**Description:**

Set up lighting to create a warm, welcoming atmosphere that supports the solarpunk aesthetic.

**Tasks:**
- [ ] Adjust sky material for warmer tones (golden hour)
- [ ] Add point lights in room corners
- [ ] Configure ambient light color (slight warmth)
- [ ] Add optional emissive materials for accents
- [ ] Test lighting from different angles
- [ ] Optimize shadow settings

**Lighting Goals:**
- Warm, optimistic tone
- Soft shadows
- Even illumination on panels
- Optional bioluminescent accents

**Acceptance Criteria:**
- [ ] Lighting creates welcoming mood
- [ ] Panels are well-lit for readability
- [ ] No harsh shadows
- [ ] Maintains performance

---

## Phase 3: Chat Interface Implementation

### Issue #28: Create Chat GUI on Panel Texture

**Labels:** `high-priority`, `feature`, `3d`, `gui`, `phase-3`  
**Priority:** P1 - High  
**Effort:** Medium (10 hours)  
**Milestone:** v1.0 - Core Features

**Description:**

Implement the chat interface using Babylon.js GUI on the chatScreen panel.

**Tasks:**
- [ ] Create AdvancedDynamicTexture on chatScreen mesh
- [ ] Set appropriate resolution (2048x2048)
- [ ] Design chat layout (title, messages, input)
- [ ] Create title bar component
- [ ] Create scrollable message container
- [ ] Create input field at bottom
- [ ] Add send button
- [ ] Style with transparency effects
- [ ] Implement modern chat aesthetic

**UI Components Needed:**
- TextBlock for title ("BeaboDOCL Research Agent")
- ScrollViewer for message history
- Rectangle containers for messages
- InputText for user input
- Button for send

**Acceptance Criteria:**
- [ ] GUI renders on chatScreen panel
- [ ] Layout matches design (Claude Desktop inspired)
- [ ] Text is readable from ~400 units
- [ ] Transparency effect looks good
- [ ] All UI elements positioned correctly

---

### Issue #29: Implement Chat Logic and Interaction

**Labels:** `high-priority`, `feature`, `frontend`, `phase-3`  
**Priority:** P1 - High  
**Effort:** Medium (6 hours)  
**Milestone:** v1.0 - Core Features

**Description:**

Add functionality to the chat UI for sending/receiving messages.

**Tasks:**
- [ ] Capture keyboard input in input field
- [ ] Handle Enter key to send
- [ ] Display user messages in container
- [ ] Add message timestamps
- [ ] Implement scroll on new messages
- [ ] Show typing indicator (placeholder)
- [ ] Handle long messages (word wrap)
- [ ] Store message history

**Acceptance Criteria:**
- [ ] User can type messages
- [ ] Enter sends message
- [ ] Messages appear in chat history
- [ ] Timestamps display
- [ ] Scroll works correctly
- [ ] UI remains responsive

---

## Phase 4: Agent API Integration

### Issue #30: Create Agent API Client

**Labels:** `high-priority`, `backend`, `api`, `phase-4`  
**Priority:** P1 - High  
**Effort:** Small (3 hours)  
**Milestone:** v1.0 - Core Features

**Description:**

Create TypeScript API client for communicating with the research agent backend.

**Tasks:**
- [ ] Create src/lib/api/agent.ts
- [ ] Implement sendMessage() function
- [ ] Add TypeScript types in src/lib/api/types.ts
- [ ] Configure API base URL
- [ ] Add error handling
- [ ] Add retry logic
- [ ] Create mock responses for testing

**API Interface:**
```typescript
interface AgentMessage {
  message: string;
  conversationId?: string;
}

interface AgentResponse {
  response: string;
  citations?: Citation[];
  conversationId: string;
}

async function sendMessage(message: AgentMessage): Promise<AgentResponse>
```

**Acceptance Criteria:**
- [ ] API client created with proper types
- [ ] Can send messages
- [ ] Handles responses
- [ ] Error handling in place
- [ ] Works with mock data

---

### Issue #31: Integrate Agent API with Chat UI

**Labels:** `high-priority`, `feature`, `frontend`, `phase-4`  
**Priority:** P1 - High  
**Effort:** Medium (9 hours)  
**Milestone:** v1.0 - Core Features

**Description:**

Connect the chat UI to the agent API to enable real AI conversations.

**Tasks:**
- [ ] Call API when message sent
- [ ] Show loading state ("Agent is thinking...")
- [ ] Display agent responses
- [ ] Parse and highlight citations
- [ ] Handle API errors gracefully
- [ ] Add retry button on errors
- [ ] Show connection status
- [ ] Persist conversation ID

**UX Enhancements:**
- Typing animation while waiting
- Clear error messages
- Clickable citations
- Conversation persistence

**Acceptance Criteria:**
- [ ] Chat connects to agent API
- [ ] Agent responses display correctly
- [ ] Citations are highlighted/clickable
- [ ] Errors show user-friendly messages
- [ ] Response time reasonable (<5s)
- [ ] Works without VR first

---

## Phase 5: VR Support

### Issue #32: Initialize WebXR and VR Controls

**Labels:** `high-priority`, `vr`, `feature`, `phase-5`  
**Priority:** P1 - High  
**Effort:** Medium (4 hours)  
**Milestone:** v1.0 - VR

**Description:**

Enable WebXR support and create VR entry point.

**Tasks:**
- [ ] Add WebXRDefaultExperience
- [ ] Create "Enter VR" button
- [ ] Configure VR settings
- [ ] Test VR mode entry/exit
- [ ] Handle VR device detection
- [ ] Add fallback for non-VR browsers

**Acceptance Criteria:**
- [ ] VR button appears when VR available
- [ ] Can enter/exit VR mode
- [ ] Scene displays correctly in VR
- [ ] Head tracking works
- [ ] No crashes in VR mode

---

### Issue #33: Implement VR Locomotion System

**Labels:** `high-priority`, `vr`, `feature`, `phase-5`  
**Priority:** P1 - High  
**Effort:** Medium (5 hours)  
**Milestone:** v1.0 - VR

**Description:**

Add smooth locomotion for VR navigation with horizontal plane constraint.

**Tasks:**
- [ ] Create VR movement script
- [ ] Map left joystick to movement
- [ ] Implement 4-directional movement
- [ ] Lock Y-axis (horizontal movement only)
- [ ] Set comfortable movement speed
- [ ] Add deadzone handling
- [ ] Test turning and strafing

**Movement Requirements:**
- Forward/backward on joystick Y
- Left/right strafe on joystick X
- Movement relative to headset orientation
- Y position locked at standing height (~1.6m)
- No jumping, flying, or vertical drift

**Acceptance Criteria:**
- [ ] Can move around room with joystick
- [ ] Movement feels natural
- [ ] Y-axis locked (no vertical drift)
- [ ] Speed is comfortable
- [ ] No motion sickness triggers

---

### Issue #34: Add VR Interaction with UI Panels

**Labels:** `high-priority`, `vr`, `feature`, `phase-5`  
**Priority:** P1 - High  
**Effort:** Medium (5 hours)  
**Milestone:** v1.0 - VR

**Description:**

Enable controller interaction with chat and other UI panels.

**Tasks:**
- [ ] Add pointer rays from controllers
- [ ] Enable UI picking with rays
- [ ] Allow input field focus via ray
- [ ] Add haptic feedback on button press
- [ ] Test chat input from VR
- [ ] Adjust interaction distances

**Acceptance Criteria:**
- [ ] Controller rays visible
- [ ] Can point at UI elements
- [ ] Can click buttons
- [ ] Can focus input field
- [ ] Typing works in VR (if virtual keyboard available)
- [ ] Haptic feedback works

---

## Phase 6: Document Display Panel

### Issue #35: Create Document Viewer Panel

**Labels:** `medium-priority`, `feature`, `3d`, `gui`, `phase-6`  
**Priority:** P2 - Medium  
**Effort:** Medium (11 hours)  
**Milestone:** v1.1 - Enhanced Features

**Description:**

Add second panel for displaying document content.

**Tasks:**
- [ ] Duplicate chat panel setup for document panel
- [ ] Position at 120° in hexagon
- [ ] Apply matching materials
- [ ] Create GUI texture on panel
- [ ] Design document viewer UI layout
- [ ] Create scrollable content area
- [ ] Add document title/metadata display
- [ ] Create navigation controls
- [ ] Link citations from chat to document panel

**Acceptance Criteria:**
- [ ] Second panel visible at 120°
- [ ] GUI renders on panel
- [ ] Documents can be loaded
- [ ] Content is readable
- [ ] Can navigate back to chat

---

## Phase 7: Enhanced Materials & Atmosphere

### Issue #36: Generate and Apply Solarpunk-Cyberpunk Textures

**Labels:** `medium-priority`, `design`, `assets`, `phase-7`  
**Priority:** P2 - Medium  
**Effort:** Large (10 hours)  
**Milestone:** v1.2 - Polish

**Description:**

Create rich textures using AI generation and apply to environment.

**Tasks:**
- [ ] Generate textures using ComfyUI (see INTERFACE_DESIGN.md prompts)
- [ ] Create corrugated metal texture with PBR maps
- [ ] Create reclaimed wood texture with PBR maps
- [ ] Create hybrid tech-organic textures
- [ ] Generate living wall textures
- [ ] Create bioluminescent elements
- [ ] Import to Babylon Editor
- [ ] Apply to background panels and walls
- [ ] Test combinations and adjust

**Textures Needed:**
- Panel backgrounds (metal, wood, hybrid)
- Floor texture
- Wall textures
- Atmospheric elements

**Acceptance Criteria:**
- [ ] All textures generated with PBR maps
- [ ] Applied in editor and exported
- [ ] Visual quality matches design vision
- [ ] Performance remains acceptable
- [ ] Aesthetic balance achieved

---

### Issue #37: Add Atmospheric Elements and Post-Processing

**Labels:** `medium-priority`, `design`, `3d`, `phase-7`  
**Priority:** P2 - Medium  
**Effort:** Small (4 hours)  
**Milestone:** v1.2 - Polish

**Description:**

Add atmospheric effects to enhance the solarpunk aesthetic.

**Tasks:**
- [ ] Create particle system for floating pollen/motes
- [ ] Add bioluminescent corner accents (emissive materials)
- [ ] Configure bloom post-processing for glow
- [ ] Add subtle ambient particles
- [ ] Adjust lighting warmth
- [ ] Test performance impact

**Effects:**
- Floating organic particles
- Soft glowing accents
- Bloom on emissive elements
- Warm ambient lighting

**Acceptance Criteria:**
- [ ] Atmospheric effects visible
- [ ] Environment feels alive
- [ ] Maintains 90 FPS in VR
- [ ] Effects are subtle, not distracting

---

## Phase 8: Search & Visualization Panel

### Issue #38: Implement Search Panel and API Integration

**Labels:** `medium-priority`, `feature`, `phase-8`  
**Priority:** P2 - Medium  
**Effort:** Medium (10 hours)  
**Milestone:** v1.3 - Complete Workflow

**Description:**

Add third panel for search and visualization features.

**Tasks:**
- [ ] Create third panel at 240° in hexagon
- [ ] Apply matching materials
- [ ] Create search UI on panel
- [ ] Add search input field
- [ ] Create filter controls
- [ ] Integrate search API
- [ ] Display results as cards or list
- [ ] Enable document selection from results

**Acceptance Criteria:**
- [ ] Third panel visible and functional
- [ ] Can search from this panel
- [ ] Results display clearly
- [ ] Can open documents from search results
- [ ] Three panels create complete workflow

---

## Removed/Archived Legacy Issues

The following issues from the previous plan are not applicable to the new editor-first, solarpunk-cyberpunk approach:

**Archived**:
- Old Issue #1: Agent API Integration (superseded by #30, #31)
- Old Issue #2: Authentication (deferred to v2.0)
- Old Issue #3: Error Boundaries (will implement as needed)
- Old Issue #4: Agent-Assisted Search (superseded by #38)
- Old Issue #5: Loading States (will implement in #24)
- Old Issue #6: Document Search in 3D (superseded by #35, #38)
- Old Issue #7: Security Hardening (deferred to v2.0)
- Old Issue #8: Chat History Persistence (deferred to v2.0)
- Old Issue #9: DICOM Imaging (deferred to v3.0)
- Old Issue #10: Keyword Trends (deferred to v2.0)
- Old Issue #11-20: Various advanced features (deferred)

**Retained from Previous Plan**:
- VR Strafing (completed, documented)
- NavMesh (completed, documented)
- VR Movement (covered in #33)

---

## Issue Labels

### Priority
- `critical` - P0 - Blocking, must have
- `high-priority` - P1 - Important, should have
- `medium-priority` - P2 - Nice to have
- `low-priority` - P3 - Future enhancement

### Type
- `feature` - New functionality
- `bug` - Something broken
- `design` - Visual/UX design
- `setup` - Configuration/installation

### Area
- `frontend` - Next.js/React
- `3d` - Babylon.js scene
- `vr` - WebXR/VR specific
- `gui` - Babylon.js GUI
- `editor` - Babylon Editor
- `api` - Backend integration
- `assets` - Textures/models

### Phase
- `phase-1` through `phase-8` - Implementation phases

---

## Issue Creation Workflow

1. Copy issue content from this document
2. Create new issue on GitHub
3. Add appropriate labels
4. Link to IMPLEMENTATION_PLAN.md
5. Add to project board
6. Track in phase checklist

---

**Last Updated**: November 10, 2025  
**Repository**: github.com/buddha314/beabodocl-babylon  
**Branch**: main
