# VR Black Screen Issue - RESOLVED - November 9, 2025

## ✅ RESOLUTION

**ROOT CAUSE**: The scene loading from Babylon Editor (`loadScene()`) was causing rendering issues. Basic Babylon.js rendering works perfectly.

**SOLUTION**: Temporarily disabled scene loading and created a minimal test scene.

**VERIFICATION**: 
- ✅ Red box renders on desktop
- ✅ Red box renders in VR headset  
- ✅ Basic VR functionality confirmed
- ⚠️ VR controllers need refinement

## Problem Description
When loading the scene in VR headset (Quest 2/3), the screen was completely black. No rendering occurred despite the app loading without errors.

## Investigation Timeline

### Initial Issue
- **Error**: "No camera defined" error at `page.tsx` line 182 (`scene.render()`)
- **Root Cause**: `activeCameraID` in `example.babylon` was set to editor camera ID (`3cc9ef80-8c60-43e0-bcc4-1b55ff36010d`) which doesn't exist at runtime

### Fix Attempts

#### 1. Fixed Camera ID (Not Successful)
- Changed `activeCameraID` in `public/scene/example.babylon` from editor camera to runtime camera
- Changed from: `3cc9ef80-8c60-43e0-bcc4-1b55ff36010d` (EditorCamera)
- Changed to: `b22eda30-5d83-4697-962c-f0e879be295e` (mainCamera - ArcRotateCamera)
- **Result**: Error persisted

#### 2. Added Camera Fallback Logic (Not Successful)
- Modified `page.tsx` to automatically set first available camera if `scene.activeCamera` is null
- Added check after scene load to set `scene.cameras[0]` as active if needed
- **Result**: Still black screen

#### 3. Added Comprehensive Logging (In Progress)
- Added detailed console logging with emoji indicators throughout initialization
- Logs camera count, names, IDs, types
- Logs active camera before and after scene load
- Logs WebXR initialization
- Logs lighting information
- **Result**: Can't see browser console from headset to verify logs

#### 4. Added Lighting Fallback (Not Successful)
- Added check for lights in scene
- Creates default `HemisphericLight` if no lights found
- Logs light intensity and enabled status
- **Result**: Still black screen

#### 5. Added Render Loop Safety Checks (Not Successful)
- Added camera check in render loop before calling `scene.render()`
- Automatically sets first camera if none active during render
- Prevents crash by skipping render if no camera available
- **Result**: Still black screen (but no errors)

## Current State

### Files Modified
1. **`public/scene/example.babylon`**
   - Changed `activeCameraID` to mainCamera ID

2. **`src/app/page.tsx`**
   - Added comprehensive logging throughout `handleLoad()`
   - Added camera fallback logic after scene load
   - Added lighting check and fallback
   - Added WebXR state logging
   - Added render loop safety checks
   - Added camera restoration when exiting VR

### Scene Configuration
- **Camera**: ArcRotateCamera named "mainCamera"
  - Position: `[0, 9.998, -5]`
  - Target: `[0, 2, -5]`
  - ID: `b22eda30-5d83-4697-962c-f0e879be295e`
  - Type: ArcRotateCamera
  
- **Lights**: Scene has mainLight (DirectionalLight, intensity 0.7)

- **Meshes**: 
  - chatPanel (Plane at `[0, 2, -5]` scaled `[4, 3, 1]`)
  - ground (2 GroundMesh instances)

## Potential Root Causes

### 1. WebXR Camera Replacement
- WebXR creates its own VR camera when entering VR mode
- This replaces `scene.activeCamera` with WebXR camera
- Original camera might not be compatible with VR rendering
- **Theory**: The camera switch happens but WebXR camera isn't positioned correctly

### 2. Camera Position/Orientation
- ArcRotateCamera at position `[0, 9.998, -5]` looking at `[0, 2, -5]`
- In VR, WebXR creates camera at user's head position
- **Theory**: WebXR camera might be spawning inside a mesh or pointing wrong direction

### 3. Lighting in VR Mode
- Scene has DirectionalLight with intensity 0.7
- Environment texture: `assets/country.env`
- **Theory**: Lighting might not transfer correctly to VR camera

### 4. Scene Loader Timing
- Using `loadScene()` from `babylonjs-editor-tools`
- Camera might not be fully initialized before WebXR takes over
- **Theory**: Race condition between scene load and WebXR initialization

### 5. Material/Rendering Pipeline
- Ground uses PBR material with albedo texture
- Chat panel uses default material
- **Theory**: Materials might not render in VR mode

## Next Steps to Try

### Option A: Debug Browser Console in VR
1. Connect Quest to PC via USB
2. Use Chrome DevTools remote debugging
3. View actual console logs from VR browser
4. Check what the detailed logging reveals

### Option B: Test on Desktop First
1. Load page in desktop browser
2. Verify scene renders correctly before entering VR
3. Use "Enter VR" button to transition
4. Compare desktop vs VR rendering

### Option C: Simplify Scene
1. Create minimal test scene with just a box and light
2. Test if basic scene renders in VR
3. Gradually add complexity to isolate issue

### Option D: Camera Type Change
1. Replace ArcRotateCamera with UniversalCamera or FreeCamera
2. Position camera at origin `[0, 1.6, 0]` (VR eye height)
3. Test if simpler camera type works better with WebXR

### Option E: Check WebXR Camera Position
1. Log `scene.activeCamera.position` when entering VR
2. Verify WebXR camera is at reasonable location
3. Add helper mesh at camera position to visualize

### Option F: Force Camera Before Render
1. Store reference to WebXR camera when it's created
2. Ensure it's set as active camera before every render
3. Check if camera is being cleared/reset

## Technical Details

### WebXR State Values
- `0`: NOT_IN_XR
- `1`: ENTERING_XR
- `2`: IN_XR
- `3`: EXITING_XR

### Camera Types in Scene
- Editor Camera: `EditorCamera` (ID: `3cc9ef80-8c60-43e0-bcc4-1b55ff36010d`) - **Not in runtime**
- Main Camera: `ArcRotateCamera` (ID: `b22eda30-5d83-4697-962c-f0e879be295e`) - **Runtime camera**
- Universal Camera: `UniversalCamera` (ID: `3ee0f345-7bea-4f59-a657-28c90a7d5e74`) - **Also in scene**
- WebXR Camera: Created dynamically when entering VR (type: `WebXRCamera`)

### Key Code Locations
- Scene loading: `page.tsx` line ~104
- Camera setup: `page.tsx` line ~120-135
- WebXR init: `page.tsx` line ~150
- Render loop: `page.tsx` line ~220

## Questions to Answer
1. Does the scene render correctly on desktop before entering VR?
2. What camera is active when WebXR state = 2 (IN_VR)?
3. Are there any WebGL errors in the console?
4. What is the WebXR camera position when in VR?
5. Is the lighting working in VR mode?
6. Are the meshes visible (check with wireframe mode)?

## Babylon.js WebXR Expected Behavior
- WebXR should automatically create a camera when entering VR
- Original camera should be preserved and restored when exiting VR
- Scene should continue rendering with WebXR camera in VR mode
- All meshes, lights, and materials should work the same in VR

## References
- Babylon.js WebXR Docs: https://doc.babylonjs.com/features/featuresDeepDive/webXR
- Scene Loader: https://doc.babylonjs.com/features/featuresDeepDive/importers/loadingFileTypes
- Camera Docs: https://doc.babylonjs.com/features/featuresDeepDive/cameras
