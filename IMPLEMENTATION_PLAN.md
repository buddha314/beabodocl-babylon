# BeaboDOCL VR Implementation Plan

**Project**: BeaboDOCL VR Research Interface  
**Version**: 1.0.0  
**Date**: November 10, 2025  
**Status**: Ready for Implementation  
**Approach**: Editor-First, Solarpunk-Cyberpunk Aesthetic

---

## 🎯 Vision

A VR research interface combining:
- **Cyberpunk holographic displays** - High-tech, floating transparent interfaces
- **Solarpunk organic materials** - Natural textures, living elements, hope-oriented design
- **Hexagonal workspace** - 3 display panels in a large hexagonal room
- **Grounded navigation** - Standing user, lateral movement only
- **AI-powered research** - Natural language paper discovery and chat

---

## 📋 Current State

### What Exists
✅ Clean Next.js 14 project structure  
✅ Minimal dependencies installed  
✅ Complete interface design document  
✅ Babylon Editor scene designed:
- Ground (procedural terrain)
- Sky (procedural skybox)
- chatBackground (dark brown-red frame)
- chatScreen (transparent purple-blue surface)

### What's Ready
✅ Design specifications complete  
✅ Asset generation prompts documented  
✅ 3D creation workflows defined  
✅ Editor-first approach established  

### What's Pending
⏳ Babylon.js integration  
⏳ Scene export and loading  
⏳ Hexagonal room creation  
⏳ Chat GUI implementation  
⏳ API connection  
⏳ VR support  

---

## 🚀 Implementation Phases

### Phase 1: Foundation Setup (Week 1, 8-12 hours)

**Goal**: Get basic scene loading and rendering working

#### Tasks

1. **Install Dependencies** (30 min)
   ```bash
   npm install @babylonjs/core @babylonjs/gui @babylonjs/materials @babylonjs/havok babylonjs-editor-tools
   ```

2. **Create Next.js App Structure** (2 hours)
   - [ ] Create `src/app/layout.tsx`
   - [ ] Create `src/app/page.tsx`
   - [ ] Create `src/app/globals.css`
   - [ ] Set up basic HTML structure
   - [ ] Configure Tailwind for UI elements

3. **Export Scene from Editor** (1 hour)
   - [ ] Open `project.bjseditor`
   - [ ] Build → Build and Export
   - [ ] Verify files in `public/scene/`
   - [ ] Check all 4 meshes exported

4. **Implement Scene Loading** (3-4 hours)
   - [ ] Import Babylon.js in page.tsx
   - [ ] Create canvas element
   - [ ] Initialize engine and scene
   - [ ] Use `loadScene()` from editor tools
   - [ ] Attach camera and start render loop
   - [ ] Test in browser

5. **Basic Testing** (1-2 hours)
   - [ ] Verify all objects visible
   - [ ] Test camera controls
   - [ ] Check performance (60+ FPS)
   - [ ] Test in different browsers

**Deliverables**:
- ✅ Scene loads in browser
- ✅ All 4 objects (ground, sky, 2 panels) visible
- ✅ Camera controls working
- ✅ Stable 60+ FPS

**Acceptance Criteria**:
- [ ] `npm run dev` starts without errors
- [ ] Scene renders on http://localhost:3000
- [ ] Can rotate camera with mouse
- [ ] Chat panels visible at ~400 units distance

---

### Phase 2: Hexagonal Room Environment (Week 2, 12-16 hours)

**Goal**: Create the hexagonal workspace with proper layout

#### Tasks

1. **Design Hexagonal Room in Editor** (3-4 hours)
   - [ ] Create hexagonal floor mesh (or use large plane)
   - [ ] Create 6 wall meshes arranged in hexagon
   - [ ] Scale room (diameter ~1000 units)
   - [ ] Position chat panel on front wall
   - [ ] Add placeholder panels on side walls

2. **Apply Materials and Textures** (4-6 hours)
   - [ ] Generate or source floor texture (grid + organic gaps)
   - [ ] Apply wood/bamboo or metal textures to walls
   - [ ] Test different material combinations
   - [ ] Add subtle ambient lighting
   - [ ] Configure PBR materials

3. **Position Display Panels** (2-3 hours)
   - [ ] Place Chat Panel at 0° (front)
   - [ ] Place Document Panel at 120° (left)
   - [ ] Place Visualization Panel at 240° (right)
   - [ ] Ensure consistent distance from center
   - [ ] Set correct scale for readability

4. **Add Lighting and Atmosphere** (3-4 hours)
   - [ ] Adjust sky material for warm tones
   - [ ] Add corner point lights
   - [ ] Configure ambient light
   - [ ] Optional: Add bioluminescent accents
   - [ ] Test lighting in VR perspective

**Deliverables**:
- ✅ Hexagonal room created
- ✅ 3 display panels positioned
- ✅ Materials applied
- ✅ Lighting configured

**Acceptance Criteria**:
- [ ] Room feels enclosed but spacious
- [ ] All 3 panels easily accessible by turning
- [ ] Materials match design aesthetic
- [ ] Lighting creates welcoming atmosphere

---

### Phase 3: Chat Interface Implementation (Week 3, 14-18 hours)

**Goal**: Functional chat interface on chatScreen panel

#### Tasks

1. **Create GUI Texture** (3-4 hours)
   - [ ] Create `AdvancedDynamicTexture` on chatScreen mesh
   - [ ] Set up coordinate system
   - [ ] Test basic text rendering
   - [ ] Configure resolution for clarity

2. **Build Chat UI Components** (6-8 hours)
   - [ ] Create title bar ("BeaboDOCL Research Agent")
   - [ ] Create message container with scroll
   - [ ] Create input field at bottom
   - [ ] Add send button
   - [ ] Style with modern chat aesthetic (Claude Desktop inspired)
   - [ ] Implement transparency effects

3. **Implement Chat Logic** (4-6 hours)
   - [ ] Handle user input (keyboard)
   - [ ] Display user messages
   - [ ] Show typing indicator
   - [ ] Handle message history
   - [ ] Implement scroll on overflow
   - [ ] Add timestamps

4. **Test Chat UX** (1-2 hours)
   - [ ] Test typing and sending
   - [ ] Test long messages
   - [ ] Test scroll behavior
   - [ ] Test from VR perspective distance

**Deliverables**:
- ✅ Functional chat UI on 3D panel
- ✅ User can type and send messages
- ✅ Messages display correctly
- ✅ Modern, clean aesthetic

**Acceptance Criteria**:
- [ ] Text is readable from ~400 units away
- [ ] Input field captures keyboard input
- [ ] Messages append to chat history
- [ ] Transparency effect looks good
- [ ] UI feels responsive

---

### Phase 4: Agent API Integration (Week 4, 12-16 hours)

**Goal**: Connect chat to actual AI research agent

#### Tasks

1. **Create API Client** (2-3 hours)
   - [ ] Create `src/lib/api/agent.ts`
   - [ ] Implement `sendMessage()` function
   - [ ] Configure API endpoint
   - [ ] Add error handling
   - [ ] Add TypeScript types

2. **Integrate with Chat** (4-5 hours)
   - [ ] Call API on message send
   - [ ] Handle loading state
   - [ ] Display agent responses
   - [ ] Parse and display citations
   - [ ] Show connection status

3. **Enhance UX** (4-6 hours)
   - [ ] Add "thinking" animation
   - [ ] Implement retry logic
   - [ ] Show error messages
   - [ ] Add conversation persistence (localStorage)
   - [ ] Highlight citations/links

4. **Test Integration** (2-3 hours)
   - [ ] Test various queries
   - [ ] Test error scenarios
   - [ ] Test long responses
   - [ ] Verify citations display correctly

**Deliverables**:
- ✅ Chat connects to agent API
- ✅ Agent responses display
- ✅ Citations visible
- ✅ Errors handled

**Acceptance Criteria**:
- [ ] Can ask questions and get responses
- [ ] Response time < 5 seconds
- [ ] Citations are clickable/highlighted
- [ ] Network errors display user-friendly messages
- [ ] Works without VR first

---

### Phase 5: VR Support (Week 5, 10-14 hours)

**Goal**: Enable WebXR and VR interaction

#### Tasks

1. **Initialize WebXR** (3-4 hours)
   - [ ] Add WebXR helper
   - [ ] Create VR button
   - [ ] Configure default experience
   - [ ] Test VR mode entry/exit

2. **Implement VR Navigation** (4-5 hours)
   - [ ] Enable smooth locomotion
   - [ ] Configure joystick controls
   - [ ] Lock Y-axis (horizontal movement only)
   - [ ] Test movement speed
   - [ ] Add teleportation option

3. **Add VR Interactions** (3-5 hours)
   - [ ] Implement pointer ray from controllers
   - [ ] Enable UI interaction with ray
   - [ ] Test input field focus
   - [ ] Add haptic feedback
   - [ ] Configure comfortable viewing distance

4. **VR Testing** (2-3 hours)
   - [ ] Test in Quest 2/3
   - [ ] Verify 90 FPS performance
   - [ ] Check text readability
   - [ ] Test controller comfort
   - [ ] Adjust as needed

**Deliverables**:
- ✅ WebXR working
- ✅ VR locomotion implemented
- ✅ Controller interaction functional
- ✅ Performance optimized for VR

**Acceptance Criteria**:
- [ ] Can enter/exit VR mode
- [ ] Can move around hexagonal room
- [ ] Can interact with chat using controllers
- [ ] Maintains 90 FPS in VR
- [ ] No motion sickness triggers

---

### Phase 6: Document Display Panel (Week 6, 8-12 hours)

**Goal**: Second panel for document viewing

#### Tasks

1. **Create Document Panel** (2-3 hours)
   - [ ] Duplicate chat panel setup
   - [ ] Position at 120° in hexagon
   - [ ] Apply similar materials
   - [ ] Create GUI texture

2. **Build Document Viewer UI** (4-6 hours)
   - [ ] Create document title display
   - [ ] Add author and metadata
   - [ ] Create scrollable content area
   - [ ] Add navigation controls
   - [ ] Style to match chat aesthetic

3. **Implement Document Loading** (2-3 hours)
   - [ ] Create document API client
   - [ ] Load document on selection
   - [ ] Parse and display content
   - [ ] Handle loading states

4. **Link from Chat** (1-2 hours)
   - [ ] Make citations clickable in chat
   - [ ] Open document in document panel
   - [ ] Add "return to chat" gesture/button

**Deliverables**:
- ✅ Second panel for documents
- ✅ Documents load and display
- ✅ Navigation between panels works

**Acceptance Criteria**:
- [ ] Document panel visible when turning left
- [ ] Documents load when cited in chat
- [ ] Content is readable
- [ ] Can navigate back to chat easily

---

### Phase 7: Enhanced Materials & Polish (Week 7, 10-14 hours)

**Goal**: Implement solarpunk-cyberpunk aesthetic fully

#### Tasks

1. **Generate Textures with ComfyUI** (4-6 hours)
   - [ ] Generate corrugated metal texture
   - [ ] Generate reclaimed wood texture
   - [ ] Generate hybrid tech-organic textures
   - [ ] Generate living wall textures
   - [ ] Generate floor textures
   - [ ] Create PBR map sets (albedo, normal, roughness, metallic)

2. **Apply Enhanced Materials** (3-4 hours)
   - [ ] Import textures to editor
   - [ ] Apply to background panels
   - [ ] Apply to room walls
   - [ ] Test combinations
   - [ ] Adjust scale and tiling

3. **Add Atmospheric Elements** (3-4 hours)
   - [ ] Add bioluminescent corner accents
   - [ ] Implement particle effects (floating pollen)
   - [ ] Adjust lighting for warmth
   - [ ] Add subtle glow effects
   - [ ] Configure post-processing (bloom)

4. **Polish and Optimize** (2-3 hours)
   - [ ] Optimize texture sizes
   - [ ] Test performance impact
   - [ ] Adjust based on VR testing
   - [ ] Fine-tune colors and lighting

**Deliverables**:
- ✅ Full solarpunk-cyberpunk aesthetic
- ✅ Rich, textured environment
- ✅ Atmospheric lighting
- ✅ Performance maintained

**Acceptance Criteria**:
- [ ] Environment feels alive and welcoming
- [ ] Balance between tech and nature
- [ ] Textures are high quality
- [ ] Still maintains 90 FPS in VR

---

### Phase 8: Third Panel & Visualization (Week 8, 8-12 hours)

**Goal**: Add search/visualization panel

#### Tasks

1. **Create Visualization Panel** (2-3 hours)
   - [ ] Position panel at 240° in hexagon
   - [ ] Apply matching materials
   - [ ] Create GUI texture

2. **Implement Search Interface** (3-4 hours)
   - [ ] Create search input field
   - [ ] Add filter controls
   - [ ] Create results display
   - [ ] Style results as cards or list

3. **Integrate Search API** (2-3 hours)
   - [ ] Connect to search endpoint
   - [ ] Display results
   - [ ] Handle selection
   - [ ] Link to document panel

4. **Optional: Add Visualizations** (3-4 hours)
   - [ ] Integrate Plotly.js for charts
   - [ ] Create keyword trend visualization
   - [ ] Display on panel texture
   - [ ] Make interactive

**Deliverables**:
- ✅ Third panel operational
- ✅ Search functionality working
- ✅ Optional visualizations

**Acceptance Criteria**:
- [ ] Can search from third panel
- [ ] Results display clearly
- [ ] Can open documents from search
- [ ] Three panels create complete workflow

---

## 📊 Prioritized Task List

### Critical Path (Must Have for v1.0)

| Priority | Task | Phase | Effort | Status |
|----------|------|-------|--------|--------|
| P0-1 | Install Babylon.js dependencies | 1 | 30min | 🔴 Todo |
| P0-2 | Create Next.js app structure | 1 | 2h | 🔴 Todo |
| P0-3 | Export scene from editor | 1 | 1h | 🔴 Todo |
| P0-4 | Implement scene loading | 1 | 4h | 🔴 Todo |
| P0-5 | Test basic rendering | 1 | 2h | 🔴 Todo |
| P1-1 | Design hexagonal room | 2 | 4h | 🔴 Todo |
| P1-2 | Apply materials | 2 | 6h | 🔴 Todo |
| P1-3 | Position panels | 2 | 3h | 🔴 Todo |
| P1-4 | Configure lighting | 2 | 4h | 🔴 Todo |
| P2-1 | Create chat GUI | 3 | 10h | 🔴 Todo |
| P2-2 | Implement chat logic | 3 | 6h | 🔴 Todo |
| P3-1 | Create API client | 4 | 3h | 🔴 Todo |
| P3-2 | Integrate agent API | 4 | 9h | 🔴 Todo |
| P3-3 | Test integration | 4 | 3h | 🔴 Todo |
| P4-1 | Initialize WebXR | 5 | 4h | 🔴 Todo |
| P4-2 | Implement VR navigation | 5 | 5h | 🔴 Todo |
| P4-3 | Add VR interactions | 5 | 5h | 🔴 Todo |

### High Priority (Should Have)

| Priority | Task | Phase | Effort | Status |
|----------|------|-------|--------|--------|
| P5-1 | Create document panel | 6 | 3h | 🔴 Todo |
| P5-2 | Build document viewer | 6 | 6h | 🔴 Todo |
| P5-3 | Link from chat | 6 | 2h | 🔴 Todo |

### Medium Priority (Nice to Have)

| Priority | Task | Phase | Effort | Status |
|----------|------|-------|--------|--------|
| P6-1 | Generate textures | 7 | 6h | 🔴 Todo |
| P6-2 | Apply enhanced materials | 7 | 4h | 🔴 Todo |
| P6-3 | Add atmospheric elements | 7 | 4h | 🔴 Todo |
| P7-1 | Create visualization panel | 8 | 3h | 🔴 Todo |
| P7-2 | Implement search | 8 | 7h | 🔴 Todo |

---

## 🛠️ Technical Requirements

### Babylon.js Editor Compatibility

**All implementations MUST**:
- ✅ Use `loadScene()` from `babylonjs-editor-tools`
- ✅ NOT manually create scene objects in code
- ✅ Design scene structure in Babylon Editor
- ✅ Export from editor before integration
- ✅ Use scripts for behavior, not structure
- ✅ Keep editor as single source of truth

### Scene Scripts Approach

Create editor-compatible scripts in `src/scripts/`:
```typescript
// Example: chatPanel.ts
export default class ChatPanel extends TOOLKIT.ScriptComponent {
  protected awake() {
    // Initialize GUI on this mesh
  }
  
  protected start() {
    // Set up event handlers
  }
  
  protected update() {
    // Per-frame updates if needed
  }
}
```

Register in `src/scripts.ts`:
```typescript
import ChatPanel from './scripts/chatPanel';

export const scriptsMap = {
  'PROJECT.ChatPanel': ChatPanel,
};
```

---

## 📁 File Structure

```
beabodocl-babylon/
├── assets/
│   └── example.scene/           # Babylon Editor scene
├── public/
│   └── scene/                   # Generated by editor export
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Main 3D scene
│   │   └── globals.css         # Global styles
│   ├── scripts/
│   │   ├── chatPanel.ts        # Chat panel behavior
│   │   ├── documentPanel.ts    # Document panel behavior
│   │   └── searchPanel.ts      # Search panel behavior
│   ├── scripts.ts              # Script registration
│   ├── lib/
│   │   └── api/
│   │       ├── agent.ts        # Agent API client
│   │       ├── documents.ts    # Document API client
│   │       └── types.ts        # TypeScript types
│   └── components/             # React components (if needed)
├── specs/
│   └── INTERFACE_DESIGN.md     # Design specification
├── docs/                        # Additional documentation
├── project.bjseditor            # Editor project file
├── package.json
├── tsconfig.json
└── next.config.js
```

---

## 🎨 Design Assets Checklist

### Textures Needed

**Panel Backgrounds**:
- [ ] Cyberpunk metal texture (2048x2048)
- [ ] Reclaimed wood texture (2048x2048)
- [ ] Hybrid tech-organic (2048x2048)
- [ ] PBR maps for each (normal, roughness, metallic)

**Room Environment**:
- [ ] Floor texture with grid + organic gaps (2048x2048)
- [ ] Wall texture (bamboo or wood) (2048x2048)
- [ ] Optional: Living wall texture (2048x2048)

**Atmospheric**:
- [ ] Particle textures for floating elements
- [ ] Emissive textures for bioluminescence

### 3D Assets Needed

- [ ] Hexagonal floor mesh
- [ ] 6 wall meshes
- [ ] Optional: Corner accent meshes
- [ ] Optional: Bioluminescent plant models

---

## 🧪 Testing Strategy

### Desktop Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (if Mac available)
- [ ] Edge (latest)

### VR Testing
- [ ] Quest 2 (target device)
- [ ] Quest 3 (if available)
- [ ] Performance profiling
- [ ] Comfort testing (15+ minute sessions)

### Performance Targets
- **Desktop**: 60+ FPS constant
- **VR**: 90 FPS minimum (Quest 2)
- **VR**: 120 FPS target (Quest 3)
- **Load time**: < 5 seconds
- **API response**: < 3 seconds

---

## 📈 Success Metrics

### Phase Completion Metrics

**Phase 1**: ✅ Scene loads, all objects visible, 60+ FPS  
**Phase 2**: ✅ Hexagonal room complete, 3 panels positioned  
**Phase 3**: ✅ Chat UI functional, messages send/receive  
**Phase 4**: ✅ Agent responds, citations display  
**Phase 5**: ✅ VR mode works, 90 FPS, smooth navigation  
**Phase 6**: ✅ Documents viewable, navigation works  
**Phase 7**: ✅ Full aesthetic implemented, textures applied  
**Phase 8**: ✅ Search functional, 3-panel workflow complete  

### User Experience Metrics

- [ ] User can enter VR and chat within 30 seconds
- [ ] Agent responses feel conversational
- [ ] Navigation between panels is intuitive
- [ ] No motion sickness reported
- [ ] Text is clearly readable
- [ ] Environment feels welcoming
- [ ] Performance is smooth throughout

---

## 🚨 Risk Mitigation

### Technical Risks

**Risk**: VR performance < 90 FPS  
**Mitigation**: 
- Profile early and often
- Use LOD for distant objects
- Optimize texture sizes
- Implement occlusion culling

**Risk**: Editor exports break existing code  
**Mitigation**:
- Use version control
- Test exports immediately
- Keep editor as source of truth
- Don't manually modify exports

**Risk**: WebXR not supported on target devices  
**Mitigation**:
- Check compatibility early
- Provide desktop fallback
- Test on actual devices
- Document requirements

### Schedule Risks

**Risk**: Phases take longer than estimated  
**Mitigation**:
- Break into smaller tasks
- Test incrementally
- Prioritize critical path
- Cut nice-to-haves if needed

---

## 📚 Documentation Dependencies

### Must Read Before Starting

1. **INTERFACE_DESIGN.md** - Complete design spec
2. **This document** - Implementation plan
3. **Babylon Editor docs** - Workflow understanding
4. **Copilot instructions** - Coding guidelines

### Reference as Needed

- **ARCHITECTURE.md** - System design
- **DEVELOPMENT.md** - Development practices
- **ROADMAP.md** - Long-term vision
- **README.md** - Project overview

---

## 🎯 Next Session: Phase 1 Kickoff

### Immediate Actions

1. **Review This Plan** (30 min)
   - Read through completely
   - Clarify any questions
   - Confirm approach

2. **Environment Setup** (30 min)
   - Ensure Node.js installed
   - Verify Babylon Editor accessible
   - Check VR headset available

3. **Begin Phase 1** (follow tasks above)
   - Install dependencies
   - Create app structure
   - Export scene
   - Implement loading

### Expected Outcome

By end of Phase 1 session:
- ✅ Working 3D scene in browser
- ✅ All panels visible
- ✅ Camera controls functional
- ✅ Ready for Phase 2

---

## 📝 Notes

- **Editor-first approach is non-negotiable** - Always design in editor first
- **Test in VR early** - Don't wait until end to discover VR issues
- **Iterate on design** - Materials and layout can be refined continuously
- **Document as you go** - Update this plan with learnings
- **Performance matters** - Profile and optimize throughout

---

*This implementation plan provides a clear, step-by-step path from current state to fully functional VR research interface with hybrid solarpunk-cyberpunk aesthetic.*
