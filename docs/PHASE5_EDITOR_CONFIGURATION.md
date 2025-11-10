# Phase 5: Configure Scene in Babylon Editor

**Date**: November 9, 2025  
**Status**: Ready to Execute  
**Prerequisites**: Phase 2 & 3 Complete (scripts created)

---

## Overview

This phase configures the scene visually in Babylon Editor to match what's currently created in code. After this, page.tsx can load the scene using `loadScene()` instead of manual creation.

---

## Step-by-Step Instructions

### Step 1: Open Project in Babylon Editor

1. **Launch Babylon Editor application**
   - If not installed, download from: https://github.com/BabylonJS/Editor/releases
   - Version: 5.1.1 (matches our editor tools version)

2. **Open the project**
   - File → Open Project
   - Navigate to: `C:\Users\b\src\beabodocl-babylon`
   - Select: `project.bjseditor`
   - Click Open

3. **Verify no errors**
   - Check console for errors
   - Scene preview should show the default box
   - Inspector panel should be visible

**Expected Result**: Project opens successfully, shows scene hierarchy with box, camera, light

---

### Step 2: Configure Camera

**Current browser scene has:**
```typescript
const camera = new ArcRotateCamera("camera", Math.PI, Math.PI / 2.5, 8, new Vector3(0, 2, -5), scene);
camera.attachControl(canvas, true);
```

**In Babylon Editor:**

1. **Find or create ArcRotateCamera**
   - Scene Hierarchy → Cameras
   - If default camera exists, delete it or modify it
   - Add → Camera → Arc Rotate Camera

2. **Configure properties**
   - Name: `mainCamera` (important for identification)
   - Position: X=0, Y=2, Z=-5
   - Target: X=0, Y=2, Z=-5
   - Alpha: 3.14159 (π radians = 180°)
   - Beta: 1.25664 (π/2.5 radians ≈ 72°)
   - Radius: 8
   - Attach Control: true (enable mouse/keyboard control)

3. **Set as active camera**
   - Right-click camera → Set as Active Camera

**Expected Result**: Camera positioned to view chat panel area

---

### Step 3: Configure Lighting

**Current browser scene has:**
```typescript
const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
light.intensity = 0.7;
```

**In Babylon Editor:**

1. **Find or create HemisphericLight**
   - Scene Hierarchy → Lights
   - If default light exists, modify it
   - Add → Light → Hemispheric Light

2. **Configure properties**
   - Name: `mainLight`
   - Direction: X=0, Y=1, Z=0 (pointing up)
   - Intensity: 0.7
   - Diffuse Color: RGB(1, 1, 1) white
   - Specular Color: RGB(1, 1, 1) white

**Expected Result**: Scene has even, moderate lighting

---

### Step 4: Create Ground Mesh

**Current browser scene has:**
```typescript
const ground = MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, scene);
const groundMaterial = new StandardMaterial("groundMat", scene);
groundMaterial.diffuseColor = new Color3(0.3, 0.3, 0.4);
ground.material = groundMaterial;
```

**In Babylon Editor:**

1. **Create ground mesh**
   - Scene Hierarchy → Meshes
   - Add → Mesh → Ground
   - ⚠️ **CRITICAL**: Name MUST be exactly `ground` (lowercase)
     - WebXR uses this name to find the floor mesh
     - Case-sensitive!

2. **Configure mesh properties**
   - Width: 10
   - Height: 10
   - Subdivisions: 1 (default)
   - Position: X=0, Y=0, Z=0

3. **Create and apply material**
   - Right-click ground mesh → Add Material → Standard Material
   - Material name: `groundMat`
   - Diffuse Color: R=0.3, G=0.3, B=0.4 (grayish-blue)
   - Specular Color: R=0.2, G=0.2, B=0.2 (low shine)

**Expected Result**: Gray-blue floor at Y=0

---

### Step 5: Create Chat Panel Mesh

**Current browser scene has:**
```typescript
const chatPanel = new ChatPanel3D(scene, new Vector3(0, 2, -5));
// Creates a 4x3 plane mesh with GUI texture
```

**In Babylon Editor:**

1. **Create plane mesh**
   - Scene Hierarchy → Meshes
   - Add → Mesh → Plane
   - ⚠️ **CRITICAL**: Name MUST be exactly `chatPanel` (camelCase)
     - Code looks for this name to enable VR pointer selection
     - Case-sensitive!

2. **Configure mesh properties**
   - Width: 4
   - Height: 3
   - Side Orientation: Double Side (renders both front and back)
   - Position: X=0, Y=2, Z=-5 (in front of camera)
   - Rotation: X=0, Y=0, Z=0 (or adjust to face camera if needed)

3. **Attach ChatPanel script**
   - Select the chatPanel mesh
   - Inspector → Scripts section
   - Click "+" to add script
   - Select: `scripts/chatPanel.ts`
   - Script should appear in list

4. **Configure script properties (in Inspector)**
   - Panel Width: 4 (should match mesh width)
   - Panel Height: 3 (should match mesh height)
   - Texture Width: 2048 (high resolution for VR)
   - Texture Height: 1536 (high resolution for VR)

**Expected Result**: Plane mesh with chatPanel script attached, visible in scene preview

---

### Step 6: Create VR Movement Controller Node

**Current browser scene has:**
```typescript
const vrMovement = new VRMovementSystem(scene, xrHelper);
// Initialized after WebXR setup
```

**In Babylon Editor:**

1. **Create transform node**
   - Scene Hierarchy → Nodes
   - Add → Node → Transform Node
   - Name: `vrMovementController` (descriptive name)
   - This is just a logical node, doesn't render anything

2. **Configure node properties**
   - Position: X=0, Y=0, Z=0 (doesn't matter, not rendered)
   - Rotation: X=0, Y=0, Z=0
   - Scaling: X=1, Y=1, Z=1

3. **Attach VR Movement script**
   - Select the vrMovementController node
   - Inspector → Scripts section
   - Click "+" to add script
   - Select: `scripts/vrMovement.ts`
   - Script should appear in list

4. **Configure script properties (in Inspector)**
   - Movement Speed (m/s): 2.0
   - Joystick Deadzone: 0.15
   - Enabled: true (checked)

**Expected Result**: Transform node with vrMovement script attached

---

### Step 7: Verify and Save Scene

**Final verification checklist:**

- [ ] Camera: mainCamera (ArcRotateCamera) exists and is active
- [ ] Light: mainLight (HemisphericLight) with intensity 0.7
- [ ] Mesh: ground (Ground) with gray-blue material
- [ ] Mesh: chatPanel (Plane 4x3) with chatPanel.ts script attached
- [ ] Node: vrMovementController with vrMovement.ts script attached
- [ ] Environment: country.env texture is set
- [ ] Scene preview renders correctly
- [ ] No errors in console

**Save the scene:**

1. **Save scene**
   - File → Save Scene
   - Or Ctrl+S
   - Files saved to: `assets/example.scene/`

2. **Verify files updated**
   - Check `assets/example.scene/config.json` has updated timestamp
   - New mesh JSON files should be created in `meshes/` folder
   - Camera and light JSON files updated

3. **Close editor**
   - File → Close Project (or exit editor)

**Expected Result**: Scene configuration saved to disk

---

## Verification in File System

After saving, verify these files exist/updated:

```
assets/example.scene/
  config.json                     ← Updated with all objects
  cameras/
    [uuid].json                   ← mainCamera configuration
  lights/
    [uuid].json                   ← mainLight configuration
  meshes/
    [uuid].json                   ← ground mesh
    [uuid].json                   ← chatPanel mesh
  nodes/
    [uuid].json                   ← vrMovementController node
  geometries/
    [uuid].babylonbinarymeshdata  ← ground geometry
    [uuid].babylonbinarymeshdata  ← chatPanel geometry
```

---

## Troubleshooting

### Issue: Can't find scripts in dropdown

**Cause**: Scripts not in scriptsMap or editor cache issue

**Solution**:
1. Close and reopen project
2. Verify `src/scripts.ts` has both scripts in scriptsMap
3. Check console for script loading errors

### Issue: Script properties don't show in inspector

**Cause**: Decorators not working or wrong decorator type

**Solution**:
1. Verify `@visibleAsNumber` and `@visibleAsBoolean` are imported
2. Check decorator syntax matches box.ts example
3. Rebuild project: close editor, reopen

### Issue: Scene preview is black

**Cause**: Camera or lighting not configured

**Solution**:
1. Ensure mainCamera is set as active camera
2. Verify light exists and intensity > 0
3. Check camera is positioned to see objects

### Issue: Can't save scene

**Cause**: File permissions or path issues

**Solution**:
1. Check write permissions on assets/ folder
2. Run editor as administrator (if needed)
3. Verify project.bjseditor points to correct scene path

---

## What Happens to Old Code

After Phase 5, the following code in page.tsx becomes **redundant** (will be removed in Phase 4):

```typescript
// These will be deleted after Phase 4:
const camera = new ArcRotateCamera(...);           // ← Now in editor
const light = new HemisphericLight(...);           // ← Now in editor
const ground = MeshBuilder.CreateGround(...);      // ← Now in editor
const chatPanel = new ChatPanel3D(...);            // ← Now a script
const vrMovement = new VRMovementSystem(...);      // ← Now a script
```

They will be replaced with:

```typescript
// Phase 4 will change to:
const scene = await loadScene("./assets/example.scene", engine, scriptsMap);
// Everything is loaded from editor!
```

---

## Success Criteria

Phase 5 is complete when:

- [x] Babylon Editor can open project without errors
- [x] All required objects exist in scene hierarchy
- [x] Scripts are attached to correct objects
- [x] Script properties are configured
- [x] Scene preview shows all objects correctly
- [x] Scene is saved to disk
- [x] File system shows updated scene files

---

## Next Steps

After Phase 5:
1. **Phase 4**: Update page.tsx to use loadScene()
2. **Phase 6**: Test desktop and VR functionality

---

## Notes

- **Name matching is critical**: `ground` and `chatPanel` must be exact (case-sensitive)
- **Script attachment**: Scripts attach automatically when loadScene() runs
- **WebXR initialization**: Will still happen in page.tsx, then call `vrMovementScript.initializeWithXR()`
- **Hybrid approach no longer needed**: Once all objects are in editor, loadScene() returns complete scene

---

**Ready to execute!** Follow steps 1-7 in order.
