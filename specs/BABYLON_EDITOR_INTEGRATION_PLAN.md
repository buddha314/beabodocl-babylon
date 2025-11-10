# Babylon Editor Integration Plan

**Date Created**: November 9, 2025
**Status**: Planning Phase - Ready for Implementation
**Estimated Effort**: 12-16 hours
**Priority**: Medium (enables visual scene editing)

---

## Problem Statement

The project was created from a Babylon Editor template but evolved to use manual scene creation instead of the editor's scene loading system. This prevents the Babylon Editor from opening and editing the project properly.

**Current State:**
- ✅ Editor files exist (project.bjseditor, assets/example.scene/, scripts.ts)
- ✅ babylonjs-editor-tools dependency installed
- ❌ `loadScene()` imported but **never called**
- ❌ Scene created manually in `page.tsx` (line 76: `new Scene(engine)`)
- ❌ ChatPanel3D, VRMovementSystem, camera, lights all created in code
- ❌ Editor can't open project because scene doesn't match editor data

**Desired State:**
- ✅ Scene loaded from `assets/example.scene/` using `loadScene()`
- ✅ All scene objects managed in Babylon Editor GUI
- ✅ ChatPanel3D and VRMovementSystem as editor scripts
- ✅ Can visually edit scene, cameras, lights, positions in editor
- ✅ Code only handles initialization and script registration

---

## Implementation Strategy

### Phase 1: Understand Editor Scene Loading (1-2 hours)

**Goal:** Learn how loadScene() works and what it expects

**Tasks:**
1. Read babylonjs-editor-tools documentation:
   - https://doc.babylonjs.com/toolsAndResources/editor
   - Check npm package docs for `babylonjs-editor-tools`

2. Study the loadScene API:
   ```typescript
   import { loadScene } from "babylonjs-editor-tools";

   // Signature:
   loadScene(
     rootUrl: string,           // Path to scene folder
     engine: Engine,
     scriptsMap: any           // Map of scripts to attach
   ): Promise<Scene>
   ```

3. Understand what loadScene does:
   - Reads `assets/example.scene/config.json`
   - Loads cameras, lights, meshes from JSON files
   - Applies materials and textures
   - Attaches scripts from scriptsMap to objects
   - Returns configured Scene object

4. Test basic loadScene call:
   ```typescript
   // Replace manual scene creation with:
   const scene = await loadScene('./assets/example.scene', engine, scriptsMap);
   ```

**Acceptance Criteria:**
- [x] ✅ Understand loadScene parameters
- [x] ✅ Know what scene objects exist in example.scene (box, camera, light only)
- [x] ✅ Can load basic scene without errors
- [x] ✅ Pinned babylonjs-editor-tools to v5.1.0
- [x] ✅ Fixed scripts.ts exports for v5.1.0 compatibility
- [x] ✅ Documented findings in PHASE1_LOADSCENE_TEST.md

**Phase 1 Status**: ✅ COMPLETED (November 9, 2025)

**Key Findings:**
- babylonjs-editor-tools v5.1.0 is compatible (v5.1.1 doesn't exist on npm)
- loadScene() creates a NEW scene, doesn't modify existing
- Editor scene contains only template objects (box, camera, light)
- Browser scene must be recreated in editor for full integration
- Hybrid approach is mandatory: loadScene() + create missing objects
- Removed non-existent exports from scripts.ts (scriptsDictionary, _removeRegisteredScriptInstance)

**Next Steps**: Phase 2 - Convert ChatPanel3D to editor script

---

### Phase 2: Convert ChatPanel3D to Editor Script (4-6 hours)

**Goal:** Make ChatPanel3D attachable to a mesh in the editor

**Current Implementation:**
```typescript
// In page.tsx:
const chatPanel = new ChatPanel3D(scene, new Vector3(0, 2, -5));
```

**New Implementation:**
Create `src/scripts/chatPanel.ts` as an editor script:

```typescript
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Scene } from "@babylonjs/core/scene";
import { IScript, visibleInInspector } from "babylonjs-editor-tools";
import {
  AdvancedDynamicTexture,
  Rectangle,
  StackPanel,
  TextBlock,
  InputText,
  Button,
  ScrollViewer,
  Control
} from "@babylonjs/gui";
import { agentApi } from '../lib/api';

/**
 * ChatPanel Script - Attaches chat interface to a mesh
 *
 * Usage in Babylon Editor:
 * 1. Create a Plane mesh (width: 4, height: 3)
 * 2. Attach this script to the mesh
 * 3. Configure properties in inspector
 */
export default class ChatPanelScript implements IScript {
  // Editable properties in Babylon Editor Inspector
  @visibleInInspector("number", "Panel Width", 4)
  private panelWidth: number = 4;

  @visibleInInspector("number", "Panel Height", 3)
  private panelHeight: number = 3;

  @visibleInInspector("number", "Texture Resolution Width", 2048)
  private textureWidth: number = 2048;

  @visibleInInspector("number", "Texture Resolution Height", 1536)
  private textureHeight: number = 1536;

  // Private properties
  private advancedTexture!: AdvancedDynamicTexture;
  private messageContainer!: StackPanel;
  private scrollViewer!: ScrollViewer;
  private inputText!: InputText;
  private sendButton!: Button;
  private messages: Array<{ sender: string; text: string }> = [];
  private conversationId?: string;
  private isLoading: boolean = false;
  private scene!: Scene;

  /**
   * Constructor - receives the mesh this script is attached to
   */
  public constructor(public mesh: Mesh) {}

  /**
   * Called when scene starts - initialize the chat UI
   */
  public onStart(): void {
    this.scene = this.mesh.getScene();
    this.initializeChatPanel();
  }

  /**
   * Initialize the chat panel GUI
   */
  private initializeChatPanel(): void {
    // Create GUI texture with high resolution for VR
    this.advancedTexture = AdvancedDynamicTexture.CreateForMesh(
      this.mesh,
      this.textureWidth,
      this.textureHeight
    );

    this.createChatUI();
    console.log("ChatPanel3D script initialized on mesh:", this.mesh.name);
  }

  /**
   * Create the chat UI elements
   * (Copy from ChatPanel3D.ts createChatUI() and related methods)
   */
  private createChatUI(): void {
    // Main container
    const mainContainer = new Rectangle("mainContainer");
    mainContainer.width = "100%";
    mainContainer.height = "100%";
    mainContainer.thickness = 0;
    mainContainer.background = "rgba(20, 20, 40, 0.95)";
    mainContainer.cornerRadius = 10;
    this.advancedTexture.addControl(mainContainer);

    // ... (copy rest of createChatUI from ChatPanel3D.ts)
  }

  /**
   * Send message to agent API
   */
  private async sendMessage(message: string): Promise<void> {
    // ... (copy from ChatPanel3D.ts)
  }

  /**
   * Add message to chat display
   */
  private addMessage(sender: string, text: string): void {
    // ... (copy from ChatPanel3D.ts)
  }

  /**
   * Called every frame - can be used for updates if needed
   */
  public onUpdate(): void {
    // Currently not needed for chat panel
    // Could be used for animations or status updates
  }

  /**
   * Called when scene is disposed
   */
  public onStop(): void {
    // Clean up resources
    if (this.advancedTexture) {
      this.advancedTexture.dispose();
    }
  }

  /**
   * Public API - get the mesh this script is attached to
   */
  public getMesh(): Mesh {
    return this.mesh;
  }
}
```

**Tasks:**
1. Create `src/scripts/chatPanel.ts` with IScript interface
2. Move all ChatPanel3D functionality into the script
3. Add @visibleInInspector decorators for configurable properties
4. Implement onStart(), onUpdate(), onStop() lifecycle methods
5. Update `src/scripts.ts` to include chatPanel:
   ```typescript
   import * as scripts_chatPanel from "./scripts/chatPanel";

   export const scriptsMap = {
     "scripts/box.ts": scripts_box,
     "scripts/chatPanel.ts": scripts_chatPanel
   };
   ```
6. In Babylon Editor:
   - Open `assets/example.scene/`
   - Create new Plane mesh (name: "chatPanel", width: 4, height: 3)
   - Position at (0, 2, -5)
   - Attach chatPanel.ts script to the mesh
   - Save scene
7. Keep original `ChatPanel3D.ts` for now (can delete after migration works)

**Acceptance Criteria:**
- [ ] ChatPanelScript implements IScript correctly
- [ ] Can attach script to mesh in Babylon Editor
- [ ] Properties visible in editor inspector
- [ ] Chat UI renders when scene loads
- [ ] Can send messages to agent API
- [ ] VR controller can interact with panel

---

### Phase 3: Convert VRMovementSystem to Editor Script (3-4 hours)

**Goal:** Make VR movement system a scene-level script

**Current Implementation:**
```typescript
// In page.tsx:
const vrMovement = new VRMovementSystem(scene, xrHelper);
```

**New Implementation:**
Create `src/scripts/vrMovement.ts`:

```typescript
import { Scene } from "@babylonjs/core/scene";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { IScript, visibleInInspector } from "babylonjs-editor-tools";
import { WebXRDefaultExperience } from "@babylonjs/core/XR/webXRDefaultExperience";
import { WebXRInputSource } from "@babylonjs/core/XR/webXRInputSource";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";

/**
 * VR Movement Script - Enables VR locomotion with strafing
 *
 * Attach to any node in the scene (can be a dummy transform node)
 * Will automatically initialize when WebXR session starts
 */
export default class VRMovementScript implements IScript {
  @visibleInInspector("number", "Movement Speed (m/s)", 2.0)
  private movementSpeed: number = 2.0;

  @visibleInInspector("number", "Joystick Deadzone", 0.15)
  private deadzone: number = 0.15;

  @visibleInInspector("boolean", "Enabled", true)
  private enabled: boolean = true;

  private scene!: Scene;
  private xrHelper?: WebXRDefaultExperience;

  public constructor(public node: TransformNode) {}

  public onStart(): void {
    this.scene = this.node.getScene();

    // Wait for WebXR to initialize, then setup movement
    // This is tricky - need to hook into WebXR initialization
    this.setupWhenXRReady();
  }

  private setupWhenXRReady(): void {
    // Observer pattern to wait for XR initialization
    // This will be called from the main page.tsx after WebXR setup
    // Store a global reference or use event system

    // Alternative: Hook into scene metadata
    const metadata = this.scene.metadata || {};
    metadata.vrMovementScript = this;
    this.scene.metadata = metadata;

    console.log("VR Movement Script ready, waiting for WebXR initialization");
  }

  /**
   * Initialize VR movement controls
   * Called from page.tsx after WebXR is created
   */
  public initializeWithXR(xrHelper: WebXRDefaultExperience): void {
    this.xrHelper = xrHelper;
    this.setupMovementControls();
  }

  private setupMovementControls(): void {
    if (!this.xrHelper) return;

    this.xrHelper.input.onControllerAddedObservable.add((controller) => {
      if (controller.inputSource.handedness === "left") {
        this.attachMovementToController(controller);
      }
    });
  }

  private attachMovementToController(controller: WebXRInputSource): void {
    const motionController = controller.motionController;
    if (!motionController) return;

    const thumbstick = motionController.getComponent("xr-standard-thumbstick");
    if (!thumbstick) return;

    console.log("VR Movement: Left thumbstick attached");

    this.scene.onBeforeRenderObservable.add(() => {
      if (!this.enabled || !this.xrHelper) return;

      if (thumbstick.axes) {
        const xAxis = thumbstick.axes.x;
        const yAxis = thumbstick.axes.y;
        this.applyMovement(xAxis, yAxis);
      }
    });
  }

  private applyMovement(xInput: number, yInput: number): void {
    // Apply deadzone
    if (Math.abs(xInput) < this.deadzone) xInput = 0;
    if (Math.abs(yInput) < this.deadzone) yInput = 0;

    if (xInput === 0 && yInput === 0) return;
    if (!this.xrHelper) return;

    const camera = this.xrHelper.baseExperience.camera;
    const deltaTime = this.scene.getEngine().getDeltaTime() / 1000;

    // Get camera forward and right directions
    const forward = camera.getForwardRay().direction.clone();
    forward.y = 0;
    forward.normalize();

    const right = Vector3.Cross(Vector3.Up(), forward).normalize();

    // Calculate movement vector
    const moveVector = forward.scale(-yInput).add(right.scale(xInput));

    // Apply movement
    const speed = this.movementSpeed * deltaTime;
    camera.position.addInPlace(moveVector.scale(speed));
  }

  public onUpdate(): void {
    // Movement is handled via observables, not in update loop
  }

  public onStop(): void {
    this.enabled = false;
  }
}
```

**Tasks:**
1. Create `src/scripts/vrMovement.ts` with IScript interface
2. Move VRMovementSystem logic into script
3. Add to scriptsMap in scripts.ts
4. In Babylon Editor:
   - Create new TransformNode (name: "vrMovementController")
   - Attach vrMovement.ts script to it
   - Save scene
5. Update page.tsx to call `initializeWithXR()` after WebXR setup
6. Test VR locomotion still works

**Acceptance Criteria:**
- [ ] VRMovementScript implements IScript
- [ ] Attached to node in editor scene
- [ ] Movement works in VR headset
- [ ] Configurable speed/deadzone in editor

---

### Phase 4: Update page.tsx to Use loadScene (2-3 hours)

**Goal:** Replace manual scene creation with editor scene loading

**Before (page.tsx lines 60-182):**
```typescript
useEffect(() => {
  if (!canvasRef.current) return;

  const engine = new Engine(canvasRef.current, ...);
  const scene = new Scene(engine);  // ❌ Manual creation

  handleLoad(engine, scene);
  // ...
}, [canvasRef]);

async function handleLoad(engine: Engine, scene: Scene) {
  const havok = await HavokPhysics();
  scene.enablePhysics(...);

  // Manual object creation
  const camera = new ArcRotateCamera(...);
  const light = new HemisphericLight(...);
  const ground = MeshBuilder.CreateGround(...);
  const chatPanel = new ChatPanel3D(...);

  // WebXR setup
  const xrHelper = await WebXRDefaultExperience.CreateAsync(...);
  const vrMovement = new VRMovementSystem(scene, xrHelper);

  engine.runRenderLoop(() => scene.render());
}
```

**After:**
```typescript
import { loadScene } from "babylonjs-editor-tools";
import { scriptsMap } from "@/scripts";

useEffect(() => {
  if (!canvasRef.current) return;

  const engine = new Engine(canvasRef.current, ...);

  handleLoad(engine);  // No scene parameter needed

  // ... cleanup stays the same
}, [canvasRef]);

async function handleLoad(engine: Engine) {
  try {
    // Load Havok first (required for physics)
    const havok = await HavokPhysics();

    // Load scene from editor files
    const scene = await loadScene(
      './assets/example.scene',
      engine,
      scriptsMap
    );

    console.log("Scene loaded from Babylon Editor");

    // Enable physics (scene loaded, now configure)
    scene.enablePhysics(
      new Vector3(0, -981, 0),
      new HavokPlugin(true, havok)
    );

    // Find ground mesh for WebXR floor
    const ground = scene.getMeshByName("ground");
    if (!ground) {
      console.error("Ground mesh not found in scene!");
    }

    // Initialize WebXR
    const xrHelper = await WebXRDefaultExperience.CreateAsync(scene, {
      floorMeshes: ground ? [ground] : [],
      optionalFeatures: true,
    });

    console.log("WebXR initialized successfully");

    // Find VR Movement script in scene metadata
    const vrMovementScript = scene.metadata?.vrMovementScript;
    if (vrMovementScript) {
      vrMovementScript.initializeWithXR(xrHelper);
      console.log("VR Movement System initialized");
    }

    // Find chat panel mesh for pointer selection
    const chatPanelMesh = scene.getMeshByName("chatPanel");
    if (xrHelper.pointerSelection && chatPanelMesh) {
      xrHelper.pointerSelection.attach();
      console.log("VR controller pointer selection enabled");
    }

    // XR state change logging
    xrHelper.baseExperience.onStateChangedObservable.add((state) => {
      console.log("WebXR state changed:", state);
      if (state === 2) { // IN_XR
        setIsInVR(true);
        console.log("==============================================");
        console.log("ENTERED VR MODE");
        console.log("==============================================");
        console.log("Chat Panel Controls:");
        console.log("- Point controller at panel");
        console.log("- Pull trigger to click buttons/type");
        console.log("");
        console.log("Movement Controls:");
        console.log("- Left joystick: Y-axis = Forward/Back");
        console.log("- Left joystick: X-axis = Strafe Left/Right");
        console.log("==============================================");
      } else {
        setIsInVR(false);
      }
    });

    // Start render loop
    engine.runRenderLoop(() => {
      scene.render();
    });

  } catch (error) {
    console.error("Failed to load scene:", error);
    throw error;
  }
}
```

**Tasks:**
1. Replace `new Scene(engine)` with `await loadScene(...)`
2. Remove manual object creation (camera, light, ground, chatPanel)
3. Use `scene.getMeshByName()` to find objects created in editor
4. Keep WebXR initialization logic
5. Connect VR movement script via metadata/global reference
6. Test that scene loads correctly
7. Verify all features still work (chat, VR movement, WebXR)

**Acceptance Criteria:**
- [ ] Scene loads from assets/example.scene/
- [ ] No manual object creation in code
- [ ] Chat panel appears and works
- [ ] VR movement works
- [ ] WebXR initializes correctly
- [ ] No errors in console

---

### Phase 5: Configure Scene in Babylon Editor (2-3 hours)

**Goal:** Set up the scene visually in the editor

**Tasks:**

1. **Open Project in Babylon Editor**
   - Launch Babylon Editor
   - Open project: File → Open Project → Select `C:\Users\b\src\beabodocl-babylon\project.bjseditor`
   - Should now open without errors (after Phase 4 changes)

2. **Configure Camera**
   - Delete default camera if exists
   - Add new ArcRotateCamera
   - Name: "mainCamera"
   - Position: (0, 2, -5) or adjust as needed
   - Target: (0, 2, -5) (looking at chat panel)
   - Alpha: π (180°)
   - Beta: π/2.5 (~72°)
   - Radius: 8

3. **Configure Lighting**
   - Check existing light or add new HemisphericLight
   - Name: "mainLight"
   - Direction: (0, 1, 0)
   - Intensity: 0.7

4. **Configure Ground**
   - Check existing ground mesh or create new
   - Name: "ground" (important for WebXR floor detection)
   - Type: Ground
   - Width: 10
   - Height: 10
   - Position: (0, 0, 0)
   - Material: Create new StandardMaterial
     - Diffuse Color: RGB(0.3, 0.3, 0.4)

5. **Add Chat Panel Mesh**
   - Create new Plane mesh
   - Name: "chatPanel" (important - code looks for this)
   - Width: 4
   - Height: 3
   - Side Orientation: Double Side
   - Position: (0, 2, -5)
   - Rotation: Adjust to face camera
   - Attach Script: chatPanel.ts
   - Configure script properties in inspector

6. **Add VR Movement Controller**
   - Create new TransformNode
   - Name: "vrMovementController"
   - Position: (0, 0, 0) (doesn't matter, just a controller)
   - Attach Script: vrMovement.ts
   - Configure properties:
     - Movement Speed: 2.0
     - Deadzone: 0.15
     - Enabled: true

7. **Configure Environment**
   - Check environment texture is set to `assets/country.env`
   - Verify sky/background settings

8. **Save Scene**
   - File → Save Scene
   - Verify all changes saved to `assets/example.scene/`

**Acceptance Criteria:**
- [ ] Can open project in Babylon Editor without errors
- [ ] All objects visible in scene hierarchy
- [ ] Scripts attached to correct meshes/nodes
- [ ] Scene renders correctly in editor preview
- [ ] Changes saved to disk

---

### Phase 6: Testing and Validation (1-2 hours)

**Goal:** Verify everything works after migration

**Desktop Testing:**
1. Run `npm run dev`
2. Open http://localhost:3000
3. Verify:
   - [ ] Scene loads without errors
   - [ ] Camera positioned correctly
   - [ ] Ground visible
   - [ ] Chat panel visible at correct position
   - [ ] Can interact with chat panel (type, send message)
   - [ ] Agent API responses work
   - [ ] No console errors

**VR Testing:**
1. Run `npm run startup` (for network access)
2. Put on VR headset
3. Open http://[YOUR-IP]:3000 in headset browser
4. Enter VR mode
5. Verify:
   - [ ] Scene renders in VR
   - [ ] Chat panel visible and readable
   - [ ] Can point at chat panel with controller
   - [ ] Can click buttons with trigger
   - [ ] Left joystick moves forward/back
   - [ ] Left joystick strafes left/right
   - [ ] Movement feels smooth (no drift)
   - [ ] Can send messages to agent

**Editor Testing:**
1. Open project in Babylon Editor
2. Verify:
   - [ ] Project opens without errors
   - [ ] Can see all meshes in hierarchy
   - [ ] Can select and move objects
   - [ ] Can modify script properties
   - [ ] Scene preview works
   - [ ] Can save changes

**Acceptance Criteria:**
- [ ] All desktop features work
- [ ] All VR features work
- [ ] Editor can open and edit scene
- [ ] No regression in functionality
- [ ] Performance is acceptable

---

## File Changes Summary

### Files to Create
```
src/scripts/chatPanel.ts       (NEW - 300-400 lines)
src/scripts/vrMovement.ts      (NEW - 150-200 lines)
```

### Files to Modify
```
src/scripts.ts                 (UPDATE - add new scripts to scriptsMap)
src/app/page.tsx              (MAJOR REFACTOR - replace manual scene with loadScene)
assets/example.scene/         (UPDATE in editor - add meshes and scripts)
```

### Files to Keep (Reference)
```
src/lib/ChatPanel3D.ts        (KEEP - reference for migration, can delete later)
src/lib/vr/movement.ts        (KEEP - reference for migration, can delete later)
```

### Files to Eventually Delete (After Successful Migration)
```
src/lib/ChatPanel3D.ts        (DELETE - functionality moved to script)
src/lib/vr/movement.ts        (DELETE - functionality moved to script)
```

---

## Potential Issues and Solutions

### Issue 1: Script Lifecycle Timing
**Problem:** Scripts might initialize before WebXR is ready
**Solution:** Use scene metadata or event system to defer VR setup until WebXR initializes

### Issue 2: API Imports in Scripts
**Problem:** Scripts might not resolve `@/lib/api` path alias
**Solution:**
- Use relative imports: `import { agentApi } from '../../lib/api'`
- Or ensure TypeScript paths are configured correctly for scripts

### Issue 3: Missing Mesh References
**Problem:** Code looks for meshes by name that don't exist
**Solution:**
- Ensure exact name matching in editor (case-sensitive)
- Add null checks and meaningful error messages
- Document required mesh names

### Issue 4: Physics Timing
**Problem:** Physics might need to be enabled before scene load
**Solution:**
- Enable physics after loadScene completes
- Test different initialization orders
- Check Babylon Editor physics settings

### Issue 5: WebXR Floor Meshes
**Problem:** WebXR needs reference to ground for teleportation
**Solution:**
- Ensure ground mesh is named exactly "ground"
- Use getMeshByName() to find it
- Pass to WebXR floorMeshes array

### Issue 6: Chat Panel Not Clickable
**Problem:** VR pointer selection might not detect chat panel mesh
**Solution:**
- Ensure mesh is named "chatPanel"
- Check mesh is in scene hierarchy
- Verify pointer selection is attached after mesh exists

---

## Testing Checklist

### Before Starting Implementation
- [ ] Commit all current changes to git
- [ ] Create new branch: `git checkout -b feature/babylon-editor-integration`
- [ ] Backup working version
- [ ] Read Babylon Editor documentation

### During Implementation
- [ ] Test after each phase completion
- [ ] Keep editor and browser dev servers running
- [ ] Check console for errors frequently
- [ ] Commit working states incrementally

### After Completion
- [ ] Full desktop testing
- [ ] Full VR testing
- [ ] Editor testing
- [ ] Performance testing
- [ ] Update documentation (README, CLAUDE.md)
- [ ] Create pull request
- [ ] Update HANDOFF.md with results

---

## Success Metrics

**Implementation is successful when:**
1. ✅ Babylon Editor can open project without errors
2. ✅ Scene loads from editor files, not manual code
3. ✅ Can visually edit scene in editor
4. ✅ All VR features work (chat, movement, WebXR)
5. ✅ All desktop features work
6. ✅ No regressions in functionality
7. ✅ Code is cleaner (less manual scene setup)
8. ✅ Can iterate faster using visual editor

**Bonus achievements:**
- Can add new 3D objects without touching code
- Can adjust positions/lighting visually
- Can duplicate and modify scripts easily
- Development velocity increases

---

## Reference Documentation

### Babylon Editor
- Official Docs: https://doc.babylonjs.com/toolsAndResources/editor
- GitHub: https://github.com/BabylonJS/Editor
- Forum: https://forum.babylonjs.com/c/editor

### babylonjs-editor-tools
- npm: https://www.npmjs.com/package/babylonjs-editor-tools
- IScript Interface documentation
- Decorator reference (@visibleInInspector, etc.)

### Babylon.js Core
- WebXR: https://doc.babylonjs.com/features/featuresDeepDive/webXR
- Scene Loading: https://doc.babylonjs.com/features/featuresDeepDive/importers/loadingFileTypes
- Scripting: https://doc.babylonjs.com/features/featuresDeepDive/behaviors

---

## Notes for Future Implementation

### Recommended Implementation Order
1. **Phase 1 first** - Understand loadScene thoroughly before touching code
2. **Phase 2 second** - ChatPanel is most complex, tackle it early
3. **Phase 3 third** - VR movement builds on Phase 2 learnings
4. **Phase 4 fourth** - Update page.tsx only after scripts work
5. **Phase 5 fifth** - Configure in editor after code is ready
6. **Phase 6 last** - Comprehensive testing

### Time Management
- Don't rush Phase 1 - understanding saves debugging time later
- Budget extra time for Phase 2 (ChatPanel migration is complex)
- Keep Phases 4-5 in same session (code and editor config are linked)
- Reserve full VR testing session for Phase 6

### Risk Mitigation
- Work on feature branch
- Commit after each phase
- Keep original files as reference
- Test incrementally
- Ask for help on Babylon.js forum if stuck

### Development Environment
- Have Babylon Editor installed and working
- Have VR headset charged and ready
- Ensure backend API is running for chat testing
- Use good code editor (VS Code recommended)

---

**END OF PLAN**

Ready for implementation in a future session. Good luck! 🚀
