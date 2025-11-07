# 3D Scene Guide

## Scene Overview

The application uses Babylon.js to create an immersive 3D environment with VR support. The main scene is initialized in `src/app/page.tsx` with full WebXR integration.

## Scene Architecture

### Engine Configuration

```typescript
const engine = new Engine(canvasRef.current, true, {
  stencil: true,              // Enable stencil buffer
  antialias: true,            // Smooth edges
  audioEngine: true,          // 3D audio support
  adaptToDeviceRatio: true,   // Handle different pixel ratios
  disableWebGL2Support: false,// Use WebGL 2 if available
  useHighPrecisionFloats: true,// Better precision
  powerPreference: "high-performance", // GPU performance mode
  failIfMajorPerformanceCaveat: false, // Don't fail on low-end devices
});
```

**Performance Settings Explained:**
- `high-performance`: Prioritize GPU performance over battery life
- `adaptToDeviceRatio`: Ensures crisp rendering on high-DPI displays
- `antialias`: Reduces jagged edges on 3D objects

## Physics System

### Havok Physics Engine

```typescript
const havok = await HavokPhysics();
scene.enablePhysics(new Vector3(0, -981, 0), new HavokPlugin(true, havok));
```

**Gravity:** `(0, -981, 0)` - Downward force in cm/s² (Babylon uses cm as default unit)

**Why Havok?**
- WebAssembly-based for high performance
- Better VR physics than alternatives
- Official Babylon.js integration
- Advanced collision detection

**Note:** Havok is loaded asynchronously, so scene setup must wait for physics initialization.

## Camera System

### ArcRotateCamera

```typescript
const camera = new ArcRotateCamera(
  "camera",
  -Math.PI / 2,           // Alpha (horizontal rotation)
  Math.PI / 3,            // Beta (vertical rotation)
  10,                     // Radius (distance from target)
  new Vector3(0, 1, 0),   // Target position
  scene
);
camera.attachControl();
```

**Camera Properties:**
- **Alpha:** `-Math.PI / 2` = facing forward
- **Beta:** `Math.PI / 3` = 60° downward angle
- **Radius:** `10` units from target
- **Target:** `(0, 1, 0)` - centered, slightly elevated

**Controls:**
- **Mouse:** Left-click drag to rotate
- **Wheel:** Zoom in/out
- **Right-click:** Pan (if enabled)
- **Touch:** Single finger rotate, pinch zoom

## Lighting

### HemisphericLight

```typescript
const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
light.intensity = 0.7;
```

**Properties:**
- **Direction:** `(0, 1, 0)` - light comes from above
- **Intensity:** `0.7` - slightly dimmed for better contrast
- **Type:** Hemispheric provides ambient + directional lighting

**Why Hemispheric?**
- Performance-friendly
- Natural outdoor lighting
- Works well with emissive materials

## Scene Objects

### Ground Plane

```typescript
const ground = MeshBuilder.CreateGround("ground", { 
  width: 10, 
  height: 10 
}, scene);

const groundMaterial = new StandardMaterial("groundMaterial", scene);
groundMaterial.diffuseColor = new Color3(0.3, 0.3, 0.4);
ground.material = groundMaterial;
```

**Properties:**
- **Size:** 10x10 units
- **Color:** Dark blue-gray `(0.3, 0.3, 0.4)`
- **Material:** StandardMaterial (basic shader)

**Purpose:**
- Visual reference plane
- WebXR floor mesh for teleportation
- Physics ground (potential)

### Animated Box

```typescript
const box = MeshBuilder.CreateBox("box", { size: 2 }, scene);
box.position.y = 1;

const boxMaterial = new StandardMaterial("boxMaterial", scene);
boxMaterial.diffuseTexture = new Texture("/assets/amiga.jpg", scene);
box.material = boxMaterial;

scene.registerBeforeRender(() => {
  box.rotation.y += 0.01;
});
```

**Properties:**
- **Size:** 2x2x2 units cube
- **Position:** Elevated 1 unit above ground
- **Texture:** Amiga image (with fallback to solid color)
- **Animation:** Continuous Y-axis rotation

**Animation Loop:**
- Runs before each frame render
- Rotation speed: `0.01` radians per frame
- Smooth at 60 FPS

## ChatPanel3D Component

### Overview

A 3D GUI panel that provides an in-world chat interface for interacting with the research agent.

### Creation

```typescript
const chatPanel = new ChatPanel3D(scene, new Vector3(0, 2, 5));
chatPanel.lookAt(camera.position);
```

**Positioning:**
- **Default:** `(0, 2, 5)` - centered, elevated, 5 units forward
- **Orientation:** Faces the camera initially

### GUI Configuration

**Mesh:**
- **Type:** Plane mesh (4x3 units)
- **Material:** Emissive for visibility in dark scenes
- **Sides:** Double-sided for VR viewing

**Texture Resolution:**
- **Width:** 2048 pixels
- **Height:** 1536 pixels
- **Ratio:** 4:3 matching mesh dimensions

**Why High Resolution?**
- VR headsets require crisp text
- Close viewing distances
- Better readability for small fonts

### UI Components

**Layout Structure:**
```
┌─────────────────────────────────────┐
│ Title Bar (60px)                    │ ← Blue header
├─────────────────────────────────────┤
│                                     │
│  Scrollable Message Area (1200px)  │ ← Chat history
│                                     │
│                                     │
├─────────────────────────────────────┤
│ Input Area (120px)                  │ ← Text input + Send
│ [Text Input...........] [Send]      │
└─────────────────────────────────────┘
```

**Components:**
1. **Title Bar**
   - Text: "Chat with Research Agent"
   - Background: Blue gradient
   - Height: 60px

2. **Message Container**
   - ScrollViewer for overflow
   - StackPanel for vertical layout
   - Auto-scroll to latest message

3. **Input Area**
   - InputText (70% width, 70px height)
   - Send Button (150px width, 70px height)
   - Enter key support

### Message System

```typescript
chatPanel.addMessage(
  "Agent",                           // Sender
  "Hello! How can I help?",          // Message text
  "rgba(100, 50, 200, 0.3)"         // Background color
);
```

**Message Features:**
- Sender name display (bold, colored)
- Word-wrapped text (24px font)
- Automatic height adjustment
- Color-coded by sender
- Timestamp support (can be added)

### VR Interaction

**Controller Pointer Selection:**
- Automatically enabled via WebXR
- VR controllers can point and click
- Laser pointer visualization
- GUI interaction same as desktop

**Readability Optimizations:**
- Large font sizes (24-28px)
- High contrast colors
- Emissive panel background
- Anti-aliased text

### Methods

```typescript
// Add message
chatPanel.addMessage(sender: string, text: string, bgColor?: string): void

// Get mesh reference
chatPanel.getMesh(): Mesh

// Position the panel
chatPanel.setPosition(position: Vector3): void

// Orient the panel
chatPanel.lookAt(target: Vector3): void

// Clean up
chatPanel.dispose(): void
```

## WebXR / VR Support

### Initialization

```typescript
const xrHelper = await WebXRDefaultExperience.CreateAsync(scene, {
  floorMeshes: [ground],
  optionalFeatures: true,
});
```

**Configuration:**
- **Floor Meshes:** Defines teleportation surfaces
- **Optional Features:** Enables all available XR features

### Features Enabled

1. **Teleportation**
   - Point and click on ground
   - Smooth transition
   - Height adjustment

2. **Controller Interaction**
   - Pointer selection for GUI
   - Laser visualization
   - Button mapping

3. **Hand Tracking** (if supported)
   - Direct hand interaction
   - Gesture recognition

4. **Depth Sensing** (if supported)
   - Occlusion with real world
   - Better tracking

### State Management

```typescript
xrHelper.baseExperience.onStateChangedObservable.add((state) => {
  switch(state) {
    case 0: // NOT_IN_XR
      console.log('Outside VR');
      break;
    case 1: // ENTERING_XR
      console.log('Entering VR...');
      break;
    case 2: // IN_XR
      console.log('VR Active');
      break;
    case 3: // EXITING_XR
      console.log('Exiting VR...');
      break;
  }
});
```

### Browser Requirements

**Desktop:**
- Chrome/Edge with WebXR flags enabled
- Firefox with WebXR enabled

**VR Headsets:**
- Meta Quest 2/3/Pro (native browser)
- HTC Vive (SteamVR)
- Valve Index (SteamVR)
- Windows Mixed Reality

### Fallback Behavior

If WebXR is not available:
- Warning logged to console
- Scene continues in 2D mode
- Mouse/keyboard controls still work
- No VR features available

## Scene Lifecycle

### Initialization Flow

```
1. Component Mount (useEffect)
   ↓
2. Canvas Ref Available
   ↓
3. Create Engine
   ↓
4. Create Scene
   ↓
5. Load Havok Physics (async)
   ↓
6. Enable Physics on Scene
   ↓
7. Create Camera, Lights, Meshes
   ↓
8. Create ChatPanel3D
   ↓
9. Initialize WebXR (async)
   ↓
10. Start Render Loop
```

### Render Loop

```typescript
engine.runRenderLoop(() => {
  scene.render();
});
```

**Performance:**
- Target: 60 FPS (desktop), 72-90 FPS (VR)
- Automatic frame timing
- Paused when tab not visible

### Cleanup

```typescript
return () => {
  scene.dispose();  // Dispose all scene resources
  engine.dispose(); // Stop render loop, release WebGL
  window.removeEventListener("resize", listener);
};
```

**Important:** Always clean up to prevent memory leaks.

## Performance Optimization

### Current Optimizations

1. **Minimal Geometry**
   - Only 2 meshes (ground + box)
   - Simple primitives (box, plane)

2. **Material Efficiency**
   - StandardMaterial (not PBR)
   - Single texture on box
   - Emissive colors (no complex lighting)

3. **GUI Optimization**
   - Single AdvancedDynamicTexture
   - Efficient layout system
   - Minimal redraws

4. **Physics**
   - Physics enabled but not actively simulated
   - No physics bodies assigned yet
   - Ready for future interactions

### Performance Monitoring

```typescript
// Add to render loop for FPS display
console.log('FPS:', engine.getFps().toFixed());
```

## Extending the Scene

### Adding New Meshes

```typescript
// Import necessary classes
import { MeshBuilder } from "@babylonjs/core";

// Create mesh
const sphere = MeshBuilder.CreateSphere("sphere", { 
  diameter: 1 
}, scene);

sphere.position = new Vector3(3, 1, 0);
```

### Adding Physics Bodies

```typescript
import { PhysicsBody } from "@babylonjs/core";

const boxBody = new PhysicsBody(
  box,
  PhysicsMotionType.DYNAMIC,
  false,
  scene
);

const boxShape = new PhysicsShapeBox(
  new Vector3(0, 0, 0),
  new Quaternion(0, 0, 0, 1),
  new Vector3(2, 2, 2),
  scene
);

boxBody.shape = boxShape;
boxBody.setMassProperties({ mass: 1 });
```

### Adding Sounds

```typescript
import { Sound } from "@babylonjs/core";

const music = new Sound(
  "music",
  "/assets/music.mp3",
  scene,
  null,
  {
    loop: true,
    autoplay: true
  }
);
```

### Custom Shaders

```typescript
import { ShaderMaterial } from "@babylonjs/core";

const customMaterial = new ShaderMaterial(
  "shader",
  scene,
  {
    vertex: "custom",
    fragment: "custom",
  },
  {
    attributes: ["position", "normal", "uv"],
    uniforms: ["world", "worldView", "worldViewProjection"],
  }
);
```

## Babylon.js Editor Integration

### Project File

**Location:** `project.bjseditor`

The project was created with Babylon.js Editor, which provides:
- Visual scene editing
- Material editor
- Script attachment system
- Asset management

### Scripts

**Script System:**
- Scripts in `src/scripts/` directory
- Exported via `src/scripts.ts`
- Attached to objects in editor
- IScript interface implementation

**Example:** `box.ts` rotation script

### Scene Export

**Assets:**
- `assets/example.scene/` - Editor scene data
- `public/scene/` - Deployed scene data
- JSON format with separate geometry files

**Note:** Current implementation creates scene programmatically, not loading from editor files.

## Troubleshooting

### Black Screen
- Check console for errors
- Verify canvas ref is attached
- Ensure WebGL is supported
- Check scene has active camera

### VR Not Working
- Enable WebXR in browser flags
- Use HTTPS (required for WebXR)
- Check headset browser compatibility
- Verify floor meshes are defined

### Poor Performance
- Reduce texture resolution
- Simplify geometry
- Disable antialiasing
- Lower render resolution

### GUI Not Visible
- Check emissive material on panel
- Verify camera can see panel
- Increase ambient light intensity
- Check panel is not behind camera

### Physics Not Working
- Verify Havok loaded successfully
- Check physics bodies are assigned
- Ensure physics shapes match mesh geometry
- Verify gravity vector is correct
