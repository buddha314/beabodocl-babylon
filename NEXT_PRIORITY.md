# Development Priorities

**Last Updated**: November 9, 2025  
**Branch**: feature/babylon-editor-integration  
**Repository**: beabodocl-babylon

---

## 🎯 Current Priority: Babylon Editor Integration

**Status**: Phase 1 - Research  
**Total Effort**: 12-16 hours (6 phases)  
**Detailed Plan**: See `specs/BABYLON_EDITOR_INTEGRATION_PLAN.md`

### Why This Is Priority #1

The project was created from a Babylon Editor template but currently bypasses the editor's scene loading system. Restoring editor compliance will enable:
- Visual scene editing without code changes
- Faster iteration on 3D layouts
- Better separation of concerns (code vs. content)
- Industry-standard Babylon.js workflow

### Phase Progress

- [ ] **Phase 1: Understand loadScene API** (1-2 hrs) ← **CURRENT**
  - Research babylonjs-editor-tools documentation
  - Study loadScene API signature and behavior
  - Test basic scene loading
  - Document findings

- [ ] **Phase 2: Convert ChatPanel3D to Editor Script** (4-6 hrs)
  - Create `src/scripts/chatPanel.ts` implementing IScript
  - Add @visibleInInspector decorators
  - Migrate chat UI functionality
  - Update scriptsMap

- [ ] **Phase 3: Convert VRMovementSystem to Editor Script** (3-4 hrs)
  - Create `src/scripts/vrMovement.ts` implementing IScript
  - Handle WebXR initialization timing
  - Migrate movement logic
  - Update scriptsMap

- [ ] **Phase 4: Update page.tsx to Use loadScene** (2-3 hrs)
  - Replace manual Scene creation with loadScene()
  - Remove manual object creation
  - Use getMeshByName() for references
  - Keep WebXR initialization

- [ ] **Phase 5: Configure Scene in Babylon Editor** (2-3 hrs)
  - Open project in Babylon Editor
  - Add/configure camera, lights, ground
  - Create chat panel mesh with script
  - Add VR movement controller node
  - Save scene configuration

- [ ] **Phase 6: Testing and Validation** (1-2 hrs)
  - Desktop testing
  - VR testing  
  - Editor testing
  - Performance validation

### Quick Start Commands

```powershell
# Start development
npm run dev

# Start with network access (for VR testing)
npm run startup

# Test backend API
cd C:\Users\b\src\babocument
.\run-server.ps1 -Port 8000
```

---

## 📋 Secondary Priorities

### P2: NavMesh for Collision Detection (Issue #9)
**Effort**: 2-4 hours  
**Dependencies**: VR Movement System (✅ complete)  
**Status**: Ready to implement

Adds collision detection and walkable boundaries to prevent walking through walls or off platform edges.

**Tasks**:
1. Install Recast.js navigation library
2. Create `src/lib/vr/navmesh.ts`
3. Integrate with VRMovementSystem
4. Test on Quest headset

### P3: VR Headset Testing (Issue #10)
**Effort**: 1-2 hours  
**Dependencies**: None  
**Status**: Ready to test

VR strafing system is implemented but untested on actual VR hardware.

**Tasks**:
1. Charge Quest 2/3 headset
2. Test movement controls
3. Test chat panel interaction
4. Verify no drift or performance issues

---

## ✅ Recently Completed

### VR Input & Network Access (Nov 7, 2025)
- VR controller input working with 3D chat panel
- Network access enabled for VR headsets
- VR pointer selection attached
- 2D overlays hidden in VR mode
- Enhanced startup script with VR URLs

**Commit**: `781f6d3`  
**Handoff**: `specs/HANDOFF_2025-11-07_VR_INPUT_FIX.md`

### VR Strafing Implementation (Issue #10, Nov 7, 2025)
- VRMovementSystem class with 4-directional movement
- Joystick deadzone handling
- Movement relative to headset orientation
- Y-axis locked for horizontal movement

**Files**: `src/lib/vr/movement.ts`, `docs/VR_STRAFING_IMPLEMENTATION.md`  
**Handoff**: `specs/HANDOFF_2025-11-07_VR_STRAFING.md`

### Agent Chat Backend Endpoint (Nov 7, 2025)
- `/api/v1/agent/chat` endpoint created in babocument
- Router registered and tested
- Integration verified with frontend

**Repository**: `C:\Users\b\src\babocument`  
**Commit**: `17d2c25`

---

## 📚 Documentation Reference

All planning and handoff documents are in `specs/`:
- **Babylon Editor Plan**: `specs/BABYLON_EDITOR_INTEGRATION_PLAN.md`
- **Handoff Docs**: `specs/HANDOFF*.md`
- **AI Instructions**: `specs/CLAUDE.md`
- **Issues Tracking**: `specs/GITHUB_ISSUES.md`
- **Project Planning**: `specs/PROJECT_PLANNING_SUMMARY.md`
- **Doc Index**: `specs/AI_ASSISTANT_DOCS.md`

---

## 🚀 Next Session Checklist

Before starting Babylon Editor Phase 1:
- [ ] Commit any uncommitted changes
- [ ] Ensure on `feature/babylon-editor-integration` branch
- [ ] Read `specs/BABYLON_EDITOR_INTEGRATION_PLAN.md` thoroughly
- [ ] Have Babylon Editor installed and accessible
- [ ] Bookmark babylonjs-editor-tools documentation
- [ ] Review current `page.tsx` implementation
