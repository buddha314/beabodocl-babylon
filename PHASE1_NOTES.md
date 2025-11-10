# Phase 1: Understanding loadScene API - Research Notes

## Date: November 9, 2025

## Current Project State

### What EXISTS in the Editor Scene Files
Based on examination of `assets/example.scene/`:

1. **Camera** (`cameras/3ee0f345-7bea-4f59-a657-28c90a7d5e74.json`)
   - Type: UniversalCamera
   - Name: "camera"
   - Position: [461.58, 140.64, -488.55]
   - Speed: 500
   - Has keyboard and mouse input configured

2. **Light** (`lights/9242a5b8-a8b8-41d2-94ea-968e4fc3dd61.json`)
   - Type: DirectionalLight (type: 1)
   - Name: "sun"
   - Position: [100, 200, 100]
   - Direction: [-1, -2, -1]
   - Intensity: 3.43
   - Shadow enabled: true

3. **Mesh - Box** (`meshes/c04fac55-2089-4c99-bb08-39044d112145.json`)
   - Type: Box mesh
   - Name: "box"
   - Position: [0, 50, 0]
   - Size: 100x100x100
   - Material: PBRMaterial with amiga.jpg texture
   - **HAS SCRIPT ATTACHED**: `scripts/box.ts`
   - Script config: `_speed: 0.04`

4. **Environment** (in `config.json`)
   - Environment texture: `assets/country.env`
   - Clear color: [0.2, 0.2, 0.3, 1]
   - Physics gravity: [0, -981, 0]

### What DOES NOT EXIST in Editor Scene
- ❌ No ground mesh
- ❌ No chat panel mesh
- ❌ No VR movement controller node
- ❌ No HemisphericLight (only DirectionalLight exists)
- ❌ No ArcRotateCamera (only UniversalCamera exists)

### Current Code Implementation (page.tsx)

**Manual Scene Creation:**
```typescript
const scene = new Scene(engine); // Line 76 - Creates empty scene

// Then manually creates:
- ArcRotateCamera (position: (0, 2, -5), looking at (0, 2, -5))
- HemisphericLight (direction: (0, 1, 0), intensity: 0.7)
- Ground mesh (10x10, StandardMaterial with color)
- ChatPanel3D (position: (0, 2, -5))
- WebXR setup
- VRMovementSystem
```

**Problem:** This completely ignores the editor scene files!

---

## loadScene API Understanding

### Function Signature
```typescript
import { loadScene } from "babylonjs-editor-tools";

loadScene(
  rootUrl: string,        // Path to scene folder (e.g., './assets/example.scene')
  engine: Engine,         // Babylon.js Engine instance
  scriptsMap: any        // Map of scripts from scripts.ts
): Promise<Scene>        // Returns configured Scene
```

### What loadScene DOES

1. **Reads config.json** - Gets scene settings (environment, physics, fog, etc.)
2. **Loads all scene files:**
   - Cameras from `cameras/*.json`
   - Lights from `lights/*.json`
   - Meshes from `meshes/*.json`
   - Materials, geometries, etc.
3. **Attaches scripts** - Uses scriptsMap to attach scripts to objects
4. **Returns Scene** - Fully configured scene object

### How Scripts Work in Editor

**Script Metadata in Mesh JSON:**
```json
"metadata": {
  "scripts": [
    {
      "enabled": true,
      "key": "scripts/box.ts",
      "values": {
        "_speed": {
          "type": "number",
          "value": 0.04
        }
      }
    }
  ]
}
```

**Script Implementation (box.ts):**
```typescript
export default class SceneComponent implements IScript {
  @visibleAsNumber("Speed", { min: 0, max: 0.1 })
  private _speed: number = 0.04;

  public constructor(public mesh: Mesh) {}
  
  public onStart(): void {}
  
  public onUpdate(): void {
    this.mesh.rotate(Vector3.UpReadOnly, this._speed * this.mesh.getScene().getAnimationRatio());
  }
}
```

**Key Points:**
- Scripts must implement `IScript` interface
- Scripts receive the object (mesh/node/camera/etc.) in constructor
- Lifecycle: `onStart()` → `onUpdate()` (every frame) → `onStop()`
- Properties decorated with `@visibleInInspector` variants appear in editor
- Property values from JSON override defaults

---

## IScript Interface Requirements

```typescript
interface IScript {
  constructor(object: any);  // Receives mesh/node/camera/light/etc.
  onStart(): void;           // Called once when scene starts
  onUpdate(): void;          // Called every frame
  onStop(): void;            // Called when scene disposes
}
```

### Available Decorators

From `box.ts` example:
- `@visibleAsNumber(label, options)` - Number input in inspector
- Likely also available (standard Babylon Editor):
  - `@visibleInInspector(type, label, defaultValue)`
  - `@visibleInInspector("boolean", "Enabled", true)`
  - `@visibleInInspector("string", "Name", "")`
  - `@visibleInInspector("vector3", "Position", Vector3.Zero())`

---

## Testing Strategy - Simple loadScene Call

### Test 1: Basic loadScene (No Changes)

**Goal:** Load the existing editor scene AS-IS to see what we get

```typescript
// Replace page.tsx handleLoad:
async function handleLoad(engine: Engine) {
  const havok = await HavokPhysics();
  
  // Load scene from editor
  const scene = await loadScene('./assets/example.scene', engine, scriptsMap);
  
  console.log("=== LOADED SCENE CONTENTS ===");
  console.log("Cameras:", scene.cameras.map(c => c.name));
  console.log("Lights:", scene.lights.map(l => l.name));
  console.log("Meshes:", scene.meshes.map(m => m.name));
  console.log("Active Camera:", scene.activeCamera?.name);
  
  // Enable physics (from config.json gravity)
  scene.enablePhysics(new Vector3(0, -981, 0), new HavokPlugin(true, havok));
  
  // Start render loop
  engine.runRenderLoop(() => scene.render());
}
```

**Expected Result:**
- Camera named "camera" (UniversalCamera)
- Light named "sun" (DirectionalLight)
- Mesh named "box" with spinning animation
- No ground, no chat panel (not in scene files)

### Test 2: What Breaks?

**Issues we'll encounter:**
1. ✅ Scene loads (box spins)
2. ❌ No ground mesh (needed for WebXR floor)
3. ❌ No chat panel (needed for UI)
4. ❌ Camera position wrong (far away, not facing origin)
5. ❌ No ArcRotateCamera (UniversalCamera instead)
6. ❌ No HemisphericLight (DirectionalLight instead)

---

## Next Steps After Test

### Option A: Modify Editor Scene First
1. Open Babylon Editor
2. Add/modify objects in editor:
   - Change camera to ArcRotateCamera at (0, 2, -5)
   - Add HemisphericLight
   - Add Ground mesh (name: "ground")
   - Add Plane mesh for chat panel (name: "chatPanel")
   - Attach scripts to new objects
3. Save scene
4. Use loadScene with updated scene

### Option B: Hybrid Approach (Recommended)
1. Load scene with loadScene
2. Check if required objects exist
3. Create missing objects programmatically
4. Gradually migrate objects to editor

```typescript
const scene = await loadScene('./assets/example.scene', engine, scriptsMap);

// Check for ground, create if missing
let ground = scene.getMeshByName("ground");
if (!ground) {
  console.warn("Ground not in scene, creating manually");
  ground = MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, scene);
  // ... set material
}

// Check for chat panel, create if missing
let chatPanelMesh = scene.getMeshByName("chatPanel");
if (!chatPanelMesh) {
  console.warn("Chat panel not in scene, creating manually");
  const chatPanel = new ChatPanel3D(scene, new Vector3(0, 2, -5));
}
```

---

## Acceptance Criteria for Phase 1

- [x] Understand loadScene API signature
- [x] Know what objects exist in example.scene
- [x] Know what scripts are already attached
- [x] Understand IScript interface requirements
- [x] Have a test plan for basic loadScene call
- [ ] Execute Test 1 (basic loadScene)
- [ ] Document results
- [ ] Decide on approach (A or B)

---

## Key Insights

1. **Editor scene is mostly empty** - Only has box, camera, light
2. **Camera position is wrong** - Far from origin, needs repositioning
3. **Missing critical objects** - Ground, chat panel, etc.
4. **Scripts work well** - Box script proves the system works
5. **Hybrid approach best** - Load scene + create missing objects initially

## Recommended Path Forward

1. **Phase 1**: Test basic loadScene (this phase)
2. **Phase 2**: Create ChatPanel script (can test independently)
3. **Phase 3**: Create VR Movement script (can test independently)
4. **Phase 4**: Refactor page.tsx (hybrid: load + create missing)
5. **Phase 5**: Add objects to editor scene over time
6. **Phase 6**: Remove manual creation as editor scene gets complete

This approach allows incremental migration without breaking existing functionality.

---

**Status**: Ready to execute Test 1
**Next Action**: Modify page.tsx to test loadScene
