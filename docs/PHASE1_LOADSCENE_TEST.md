# Phase 1: loadScene API Testing

**Date**: November 9, 2025  
**Branch**: feature/babylon-editor-integration  
**Status**: Testing loadScene API and editor scene structure

---

## loadScene API Documentation

### Function Signature

```typescript
import { loadScene } from "babylonjs-editor-tools";

loadScene(
  rootUrl: string,           // Path to scene folder (e.g., "./assets/example.scene")
  engine: Engine,            // Babylon.js Engine instance
  scriptsMap: any            // Map of scripts to attach to objects
): Promise<Scene>
```

### Key Points

1. **Returns a NEW Scene** - Does not modify an existing scene
2. **Reads from JSON files** - Loads cameras, lights, meshes, materials from scene folder
3. **Attaches scripts** - Uses scriptsMap to attach editor scripts to objects
4. **Async operation** - Returns Promise<Scene>

---

## Current Scene Structure

### Editor Scene (`assets/example.scene/`)

Based on file inspection:

**Cameras:**
- `3ee0f345-7bea-4f59-a657-28c90a7d5e74.json` - Default camera from template

**Lights:**
- `9242a5b8-a8b8-41d2-94ea-968e4fc3dd61.json` - Default light from template

**Meshes:**
- `c04fac55-2089-4c99-bb08-39044d112145.json` - Box mesh (100x100x100) with rotation script
- `0fe36208-*.json` - Unknown mesh
- `6a927ea7-*.json` - Unknown mesh

**Environment:**
- `assets/country.env` - Environment texture

**Missing from editor scene:**
- ❌ Ground mesh (needed for VR floor detection)
- ❌ Chat panel mesh (needed for 3D UI)
- ❌ ArcRotateCamera (current browser uses this)
- ❌ HemisphericLight (current browser uses this)

---

## Browser Scene (Current Implementation in `page.tsx`)

**Created manually in code:**
- ✅ ArcRotateCamera at (0, 2, -5) looking at chat panel
- ✅ HemisphericLight with intensity 0.7
- ✅ Ground mesh (10x10) with StandardMaterial
- ✅ ChatPanel3D at (0, 2, -5)
- ✅ WebXR setup with floor detection
- ✅ VRMovementSystem for locomotion

---

## Test Implementation Options

### Option A: Replace Current Scene (BREAKS APP)

```typescript
// In handleLoad function:
const loadedScene = await loadScene("./assets/example.scene", engine, scriptsMap);

// Problem: This creates a NEW scene and returns it
// The scene parameter passed to handleLoad is ignored
// All manually created objects (ground, chat panel) are lost
```

**Result**: App will show only the default box from editor, no ground, no chat panel, broken VR

### Option B: Hybrid Approach (RECOMMENDED)

```typescript
// In handleLoad function:

// 1. Load editor scene
const editorScene = await loadScene("./assets/example.scene", engine, scriptsMap);

// 2. Check what we got
console.log("Editor scene cameras:", editorScene.cameras.map(c => c.name));
console.log("Editor scene lights:", editorScene.lights.map(c => c.name));
console.log("Editor scene meshes:", editorScene.meshes.map(c => c.name));

// 3. Add missing objects manually
let ground = editorScene.getMeshByName("ground");
if (!ground) {
  ground = MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, editorScene);
  // ... apply material
}

// 4. Continue with WebXR setup, etc.
```

**Result**: Editor scene + manual fallbacks for missing objects

### Option C: Inspect Only (SAFE FOR TESTING)

```typescript
// Don't actually use loadScene yet
// Just log what the current manual scene has
console.log("Current scene (manual):");
console.log("Cameras:", scene.cameras);
console.log("Meshes:", scene.meshes);

// Then compare with what's in editor files (we already did this)
```

**Result**: No changes to app, just documentation

---

## Test Plan

### ✅ Step 1: Version Compatibility
- Pinned `babylonjs-editor-tools` to `5.1.0` (closest to editor v5.1.1)
- npm install successful
- No version conflicts

### ⏳ Step 2: Verify Editor Can Open Project
- Need to test in Babylon Editor application
- Open `project.bjseditor`
- Check for errors/warnings
- Verify scene preview works

### ⏳ Step 3: Document Editor Scene Contents
- Open each mesh/camera/light JSON file
- Document what exists vs. what's needed
- Compare with browser scene requirements

### ⏳ Step 4: Create Minimal loadScene Test
- Create test branch or backup current page.tsx
- Replace scene creation with loadScene call
- Document what renders
- Test desktop and VR

### ⏳ Step 5: Implement Hybrid Approach
- Call loadScene to get editor objects
- Add fallback creation for missing objects
- Test that app works same as before
- Document which objects come from editor vs. code

---

## Findings So Far

### ✅ Confirmed
1. Editor project file is valid (project.bjseditor v5.1.1)
2. Scene files are valid JSON
3. scriptsMap exists with box.ts example
4. loadScene is imported but never called
5. Current app creates scene entirely manually

### ❌ Blockers
1. Editor scene is template-only (box, default camera, default light)
2. Cannot simply call loadScene() - will break app
3. Must use hybrid approach (load + create missing)
4. Phase 5 (Configure in Editor) is mandatory for full migration

### 📋 Next Actions
1. Test opening project in Babylon Editor
2. Verify editor can preview scene
3. Create test implementation of loadScene
4. Document what works vs. what breaks
5. Plan Phase 2 (script conversion) based on findings

---

## Questions to Answer

1. ✅ What version of babylonjs-editor-tools should we use?
   - **Answer**: 5.1.0 (closest to editor v5.1.1)

2. ⏳ Can the editor open our project without errors?
   - **Answer**: TBD - need to test in editor

3. ⏳ What does loadScene actually return when we call it?
   - **Answer**: TBD - need to test

4. ⏳ Can we add objects to a loaded scene after loading?
   - **Answer**: Yes (standard Babylon.js), but need to verify

5. ⏳ Do scripts in scriptsMap actually attach to meshes?
   - **Answer**: TBD - box.ts should attach to box mesh, need to verify

---

## References

- Editor docs: https://doc.babylonjs.com/toolsAndResources/editor
- babylonjs-editor-tools npm: https://www.npmjs.com/package/babylonjs-editor-tools
- GitHub: https://github.com/BabylonJS/Editor
- Integration plan: `specs/BABYLON_EDITOR_INTEGRATION_PLAN.md`
- Compatibility notes: `specs/EDITOR_COMPATIBILITY_NOTES.md`
