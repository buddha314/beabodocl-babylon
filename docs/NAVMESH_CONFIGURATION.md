# NavMesh Configuration Guide

**Date Created**: November 9, 2025  
**Purpose**: Enable collision detection for VR movement using navigation meshes  
**Scripts**: `src/scripts/navMesh.ts`, `src/scripts/vrMovement.ts`

---

## Overview

NavMesh (Navigation Mesh) provides collision detection and walkable boundary constraints for VR movement. This prevents players from walking through walls or falling off platform edges.

**How It Works:**
1. NavMesh script creates a walkable surface from ground mesh
2. VR movement script checks proposed positions against NavMesh
3. Movement is constrained to stay on walkable areas
4. Player cannot move outside NavMesh boundaries

---

## Configuration Steps

### Step 1: Open Project in Babylon Editor

```powershell
# From project root
babylon-editor
```

Open `project.bjseditor` when prompted.

### Step 2: Attach NavMesh Script to Ground

1. **Select the ground mesh** in the Scene Graph
   - Should be the mesh representing your walkable floor/platform
   - In our case: "ground" mesh

2. **Add NavMesh Script**:
   - Click "Add Component" in Inspector (right panel)
   - Select "Script"
   - Choose `scripts/navMesh.ts` from dropdown
   - Click "Add"

3. **Configure NavMesh Properties** in Inspector:
   - **Cell Size**: `0.2` (default) - Lower = more precise, slower generation
   - **Cell Height**: `0.2` (default)
   - **Agent Height**: `1.7` (meters) - Height of VR player
   - **Agent Radius**: `0.4` (meters) - Width/collision radius of player
   - **Agent Max Slope**: `45` (degrees) - Maximum walkable slope angle
   - **Debug Visualization**: `false` (set to `true` to see NavMesh wireframe)

### Step 3: Verify VR Movement Settings

1. **Select vrMovementController node** in Scene Graph

2. **Check VR Movement Script Properties**:
   - **Movement Speed**: `2.0` m/s (default)
   - **Joystick Deadzone**: `0.15` (default)
   - **Use NavMesh Collision**: ✅ **TRUE** (this enables collision detection)
   - **Enabled**: ✅ TRUE

### Step 4: Optional - Tag Obstacles

If you have obstacles (walls, furniture, etc.) that should block movement:

1. **Select obstacle mesh** in Scene Graph
2. **Add Metadata** in Inspector:
   - Click "Metadata" section
   - Add property: `tags` (array)
   - Add value: `"obstacle"` or `"navmesh"`
3. NavMesh script will automatically include tagged meshes in collision calculation

### Step 5: Export Scene

1. **File → Export** (or Ctrl+E)
2. Exports to `public/scene/`
3. Scene is ready for browser testing

---

## Testing NavMesh

### Desktop Testing (Mouse/Keyboard)
NavMesh only affects VR movement, not desktop camera controls.

### VR Testing (Quest Headset)

1. **Start dev server**:
   ```powershell
   npm run startup
   ```

2. **Access from VR headset**:
   - Use URL with your computer's IP address
   - Example: `http://192.168.1.100:3000`

3. **Test Movement**:
   - Enter VR mode
   - Use left joystick to move
   - Try walking toward edges of ground mesh
   - ✅ **Expected**: Movement stops at edge, cannot fall off
   - Try walking toward obstacles (if configured)
   - ✅ **Expected**: Movement blocked, cannot walk through

4. **Debug Visualization** (optional):
   - Set "Debug Visualization" to `true` in NavMesh script
   - Re-export scene
   - Green wireframe shows walkable areas
   - Red areas are blocked

---

## How NavMesh Works Internally

### NavMesh Script (`navMesh.ts`)

1. **Initialization** (`onStart`):
   - Imports Recast.js WASM library
   - Creates `RecastJSPlugin` instance
   - Builds navigation mesh from ground geometry

2. **Mesh Collection**:
   - Includes the mesh script is attached to (ground)
   - Includes meshes tagged with `"obstacle"`, `"ground"`, or `"navmesh"`
   - Generates walkable surface data

3. **Navigation Plugin Storage**:
   - Stores plugin in `scene.metadata.navigationPlugin`
   - VR movement script retrieves it from there

### VR Movement Script (`vrMovement.ts`)

1. **Initialization** (`onStart`):
   - Retrieves `navigationPlugin` from `scene.metadata`
   - Enables NavMesh collision if plugin found

2. **Movement** (`applyMovement`):
   ```typescript
   // Calculate desired position
   const proposedPosition = camera.position + movement;
   
   // Check against NavMesh
   const closestPoint = navigationPlugin.getClosestPoint(proposedPosition);
   
   if (closestPoint) {
     // Valid position, move there
     camera.position = closestPoint;
   } else {
     // Invalid position, block movement
   }
   ```

3. **Collision Detection**:
   - Every frame checks if movement is valid
   - Constrains position to nearest valid point on NavMesh
   - Prevents walking off edges or through walls

---

## Troubleshooting

### Problem: Player can still walk off edges

**Causes:**
- NavMesh script not attached to ground mesh
- NavMesh failed to generate (check console errors)
- VR movement "Use NavMesh Collision" is disabled

**Solution:**
1. Check browser console for `[NavMeshScript]` logs
2. Verify `"Navigation mesh ready"` message appears
3. Verify VR movement logs `"NavMesh collision detection enabled"`
4. Enable debug visualization to see NavMesh coverage

### Problem: Movement feels sticky or jerky

**Causes:**
- Cell Size too large (navigation mesh too coarse)
- Agent Radius too large

**Solution:**
1. Decrease Cell Size to `0.1` for finer mesh
2. Decrease Agent Radius to `0.3`
3. Re-export scene and test

### Problem: Can't move at all in VR

**Causes:**
- NavMesh didn't generate properly
- Starting position is outside NavMesh bounds

**Solution:**
1. Enable debug visualization
2. Check if green NavMesh covers starting area
3. Increase "Agent Max Slope" if ground has slopes
4. Ensure ground mesh is large enough

### Problem: "Navigation plugin not found" warning

**Causes:**
- NavMesh script not attached in editor
- Scene not exported after adding NavMesh script
- Script initialization order issue

**Solution:**
1. Verify NavMesh script is attached to ground mesh in editor
2. Re-export scene (File → Export)
3. Clear browser cache and reload
4. Check console for `[NavMeshScript] Navigation mesh ready` before `[VRMovementScript]` initializes

---

## Advanced Configuration

### Custom NavMesh Parameters

Edit `navMesh.ts` to fine-tune generation:

```typescript
const parameters = {
  cs: this.cellSize,              // Cell size (XZ-plane)
  ch: this.cellHeight,            // Cell height (Y-axis)
  walkableSlopeAngle: this.agentMaxSlope,
  walkableHeight: this.agentHeight,
  walkableClimb: 0.3,             // Max step height (stairs)
  walkableRadius: this.agentRadius,
  maxEdgeLen: 12,                 // Max polygon edge length
  maxSimplificationError: 1.3,    // Edge simplification tolerance
  minRegionArea: 8,               // Min walkable region size
  mergeRegionArea: 20,            // Region merge threshold
  maxVertsPerPoly: 6,             // Max vertices per polygon
  detailSampleDist: 6,            // Detail mesh sample distance
  detailSampleMaxError: 1         // Detail mesh max error
};
```

### Multiple NavMesh Zones

For complex scenes with multiple floors or platforms:

1. Attach NavMesh script to each platform/floor mesh
2. Each will generate its own navigation area
3. Recast.js will merge them automatically

### Dynamic Obstacles

To add/remove obstacles at runtime, modify `navMesh.ts`:

```typescript
public rebuildNavMesh(): void {
  const meshes = this.getMeshesForNavigation();
  this.navigationPlugin.createNavMesh(meshes, this.parameters);
}
```

Call from game code when obstacles change.

---

## Files Modified

```
src/scripts/navMesh.ts        - NEW: NavMesh script
src/scripts/vrMovement.ts     - Updated: Added NavMesh collision
src/scripts.ts                - Updated: Added navMesh to scriptsMap
package.json                  - Updated: Added recast-detour dependency
```

---

## Next Steps

1. ✅ NavMesh script created
2. ✅ VR movement integrated with collision detection
3. ⏳ **Configure in Babylon Editor** (follow steps above)
4. ⏳ **Test on VR headset** (Issue #10)

---

**Ready for editor configuration!** 🎮
