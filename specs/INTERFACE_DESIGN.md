# Interface Design Specification

**Project**: BeaboDOCL VR Research Interface  
**Date**: November 10, 2025  
**Version**: 2.0 - Fresh Start

## Overview

This document specifies the visual design and layout for the VR research interface, focusing on the chat panel system for interacting with the biomedical research agent.

---

## Scene Layout

### Spatial Organization

```
                    Sky (Procedural)
                         │
                         │
    ┌────────────────────┼────────────────────┐
    │                    │                    │
    │         Chat Panel System               │
    │         (Z: ~400 units)                 │
    │                    │                    │
    │    [chatBackground] │                   │
    │    [chatScreen]     │                   │
    │                    │                    │
    │                    │                    │
    │                 Camera                  │
    │               (Z: 0-100)                │
    │                    │                    │
    └────────────────────┼────────────────────┘
                    Ground Plane
            (102400 x 20000 units)
```

### Distance & Scale
- **Ground**: Origin-centered, massive terrain (102400 x 20000)
- **Chat Panel**: ~400 units in front of camera (Z-axis)
- **Camera**: Near origin, facing chat panel
- **Sky**: Procedural skybox scaled 100x

---

## Chat Panel System

### Component Hierarchy

```
chatBackground (Frame/Border)
    └── chatScreen (Interactive Surface)
```

### 1. Chat Background Panel

**Purpose**: Provides visual frame and depth for the chat interface

**Mesh Properties**:
- Type: Plane
- Position: [0, -12.26, 424.93]
- Scaling: [5, 3.5, 1]
- Dimensions: ~500 x 350 units (scaled)

**Material: `chatBackMat` (PBR)**
- **Type**: PBRMaterial
- **Albedo Color**: RGB(0.435, 0.219, 0.219)
  - Dark reddish-brown
  - Hex: ~#6F3838
- **Metallic**: 0 (non-metallic)
- **Roughness**: 1 (completely matte)
- **Opacity**: 100% (fully opaque)
- **Visual Effect**: Solid, warm-toned frame

**Purpose**: 
- Creates visual boundary for chat interface
- Provides contrast against background
- Frames the interactive screen area

### 2. Chat Screen Panel

**Purpose**: Primary interactive surface for chat display and input

**Mesh Properties**:
- Type: Plane
- Position: [0, 0, 375.33]
- Scaling: [4, 3, 1]
- Dimensions: ~400 x 300 units (scaled)
- Z-offset: ~50 units in front of background

**Material: `chatScreenMat` (PBR)**
- **Type**: PBRMaterial
- **Albedo Color**: RGB(0.417, 0.417, 0.687)
  - Light purple-blue
  - Hex: ~#6A6AAF
- **Metallic**: 0 (non-metallic)
- **Roughness**: 1 (matte surface)
- **Opacity**: 0.2 (20% - highly transparent)
- **Alpha Mode**: Standard blending
- **Visual Effect**: Translucent glass-like overlay

**Interaction Properties**:
- Pickable: true
- Receives shadows: true
- Will host Babylon.js GUI AdvancedDynamicTexture

---

## Visual Design Principles

### Color Palette

**Primary Colors**:
- **Frame**: Dark Brown-Red (#6F3838) - Warm, grounding
- **Screen**: Light Purple-Blue (#6A6AAF) - Cool, technological
- **Background Sky**: Procedural (natural gradient)
- **Ground**: Textured (albedo.png tiled 500x)

**Color Relationships**:
- Warm frame + cool screen = visual hierarchy
- Transparency creates depth perception
- Contrast ensures readability

### Material Strategy

**PBR Materials** (Physically Based Rendering):
- Realistic lighting response
- No metallic surfaces (metallic = 0)
- Fully rough surfaces (roughness = 1)
- Matte appearance reduces glare in VR

**Rationale**:
- Matte surfaces reduce eye strain in VR
- Non-metallic maintains readability
- Transparency on screen allows environmental awareness

### Depth & Layering

**Layer Stack** (front to back):
1. Chat Screen (Z: 375, alpha: 0.2)
2. Chat Background (Z: 425, alpha: 1.0)
3. Environment/Sky
4. Ground

**Depth Cues**:
- ~50 unit separation between screen and background
- Transparency creates see-through effect
- Shadow casting enhances depth perception

---

## Typography & Text (To Be Implemented)

### Chat GUI Specifications

**Font Sizing** (VR-optimized):
- Title: 28-32px
- Message Text: 24-26px
- Input Text: 24px
- Metadata/Timestamps: 18-20px

**Text Colors**:
- Primary Text: White (#FFFFFF)
- Secondary Text: Light Gray (#CCCCCC)
- Placeholder: 50% opacity white
- User Messages: Light Blue tint
- Agent Messages: Light Purple tint

**Readability**:
- High contrast against semi-transparent background
- Slight text shadow or outline for legibility
- Line spacing: 1.4-1.6 for VR comfort

---

## Lighting & Environment

### Environment Setup

**Sky Material**:
- Type: SkyMaterial (procedural)
- Luminance: 1.0
- Turbidity: 10
- Rayleigh: 2
- Mie Coefficient: 0.005
- Sun Inclination: 0.2 (morning/evening angle)
- Sun Azimuth: 0.25

**Ambient Lighting**:
- Clear color: RGB(0.2, 0.2, 0.3) - dark blue-gray
- Ambient color: RGB(0, 0, 0) - pure black
- Environment intensity: 1.0
- Environment texture: country.env

**Effect**:
- Natural outdoor lighting
- Soft atmospheric scattering
- Realistic sky gradient
- No harsh contrasts

---

## Physics & Interaction

### Physics Configuration

**Gravity**: [0, -981, 0] cm/s² (Earth gravity)
**Ground Physics**: Static collider
**Chat Panels**: No physics bodies (UI elements)

### Interaction Design

**Chat Screen**:
- Pickable: Enabled
- Pointer interaction: Direct
- VR controller: Ray-based selection
- Desktop: Mouse click

**Input Methods**:
1. **VR**: Controller raycasting
2. **Desktop**: Mouse and keyboard
3. **Touch**: Mobile/tablet support

---

## Camera Configuration

### Default Camera Setup

**Position**: [0, 1.6, 5] (standing height, 5 units back)
**Target**: [0, 1.6, 0] (eye level, forward)
**Type**: UniversalCamera / ArcRotateCamera

**View**:
- Eye level: 1.6m (average standing height)
- Distance to chat panel: ~370-420 units
- Clear frontal view of interface
- No obstruction or clipping

---

## Technical Specifications

### Scene Configuration

**File Structure**:
```
assets/example.scene/
  ├── config.json          # Scene settings
  ├── cameras/             # Camera configurations
  ├── meshes/              # 4 mesh JSON files
  │   ├── ground.json
  │   ├── sky.json
  │   ├── chatBackground.json
  │   └── chatScreen.json
  ├── geometries/          # Binary mesh data
  └── materials/           # Embedded in mesh files
```

**Asset Files**:
- `albedo.png` - Ground texture (512x512)
- `country.env` - Environment cubemap
- `amiga.jpg` - Legacy texture (unused)

### Performance Targets

**VR Rendering**:
- Target: 90 FPS (Quest 2/3)
- Fallback: 72 FPS
- Desktop: 60+ FPS

**Optimization**:
- Minimal geometry (~4 meshes)
- Efficient texture sizes
- No real-time shadows (baked only)
- LOD not needed (simple scene)

---

## Accessibility Considerations

### VR Comfort

**Distance & Scale**:
- Chat panel at comfortable reading distance
- Large enough text for clarity
- Not too close (prevents eye strain)

**Transparency**:
- 20% opacity maintains environmental awareness
- Reduces motion sickness
- Allows peripheral vision

**Colors**:
- High contrast for readability
- Matte surfaces reduce glare
- No bright whites or pure blacks

### Control Options

**Multiple Input Methods**:
- VR controllers (ray-based)
- Keyboard/mouse (desktop)
- Voice input (future consideration)
- Gaze-based selection (accessibility)

---

## Future Enhancements

### Planned Features

1. **Dynamic Layout**
   - Resizable panels
   - Position adjustment
   - Distance control

2. **Visual Feedback**
   - Button hover effects
   - Input field highlighting
   - Message send animation

3. **Customization**
   - Color themes
   - Opacity adjustment
   - Font size control

4. **Additional Panels**
   - Source preview panel
   - Search results panel
   - Settings panel

### Advanced Features

- **3D Data Visualization**: Papers in 3D space
- **Gesture Controls**: Hand tracking
- **Spatial Audio**: Directional feedback
- **Multi-user**: Collaborative viewing

---

## Design Rationale

### Why This Layout?

**Front-Facing Panel**:
- Natural reading position
- Mimics real-world display interaction
- Easy to locate in VR

**Layered Design**:
- Background provides context
- Screen maintains focus
- Transparency preserves awareness

**Matte Materials**:
- Reduces VR eye strain
- Professional appearance
- Better text readability

**Purple-Blue + Brown-Red**:
- Cool screen = technology/digital
- Warm frame = approachable/grounded
- Complementary contrast

---

## Implementation Notes

### Current State (November 10, 2025)

**Completed**:
- ✅ Scene geometry created in Babylon Editor
- ✅ Materials configured with proper colors
- ✅ Objects positioned and scaled
- ✅ Environment and lighting set up

**Pending**:
- ⏳ Next.js integration code
- ⏳ GUI texture implementation
- ⏳ Chat functionality scripting
- ⏳ VR controller input
- ⏳ API integration

### Next Steps

1. Set up Next.js project structure
2. Install Babylon.js dependencies
3. Load scene from editor
4. Implement GUI on chatScreen
5. Add chat functionality
6. Test in VR

---

## References

**Babylon.js Documentation**:
- PBRMaterial: https://doc.babylonjs.com/typedoc/classes/BABYLON.PBRMaterial
- GUI: https://doc.babylonjs.com/features/featuresDeepDive/gui/gui
- SkyMaterial: https://doc.babylonjs.com/toolsAndResources/assetLibraries/materialsLibrary/skyMat

**Design Inspiration**:
- Modern VR interfaces (Meta Horizon, Apple Vision)
- Sci-fi UI aesthetics
- Minimalist design principles

---

*This design document serves as the foundation for implementing the VR research interface. All measurements, colors, and specifications are derived from the current Babylon Editor scene configuration.*
