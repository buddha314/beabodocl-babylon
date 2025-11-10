# Interface Design Specification

**Project**: BeaboDOCL VR Research Interface  
**Date**: November 10, 2025  
**Version**: 2.0 - Fresh Start

## Overview

This document specifies the visual design and layout for the VR research interface, focusing on the chat panel system for interacting with the biomedical research agent.

---

## Design Vision

### Aesthetic Philosophy

**Hybrid Cyberpunk-Solarpunk Design**:

This interface blends two complementary futuristic aesthetics:

1. **Cyberpunk Elements** (Technology/Artificial):
   - Holographic displays with floating text
   - Neon glow effects and scanlines
   - Industrial materials (corrugated metal, dark surfaces)
   - High-tech, digital interface elements
   - Glass and transparency effects

2. **Solarpunk Elements** (Nature/Organic):
   - **Organically grown materials** - wood grain, living plant textures
   - **Positive futuristic outlook** - hope, sustainability, harmony
   - Natural lighting (warm tones, soft ambient)
   - Biophilic design patterns
   - Green accents and earth tones
   - Curved, flowing forms vs. hard industrial edges

**Design Balance**:
- **Technology serves humanity** - Tools feel accessible, not alienating
- **Nature integrated with tech** - Organic materials alongside digital displays
- **Optimistic tone** - Bright, inviting, not dystopian
- **Sustainable aesthetic** - Reclaimed materials, living elements
- **Harmony over conflict** - Smooth transitions between organic and synthetic

### Spatial Environment

**The Hexagonal Room**:
- User is standing in a **large hexagonal room**
- Room serves as the primary VR workspace
- **Three display panels** positioned around the hexagon:
  1. **Chat Panel** (main interface)
  2. **Panel 2** (TBD - possibly document review)
  3. **Panel 3** (TBD - possibly search/visualization)
- Panels positioned on different walls for spatial organization
- Hexagonal geometry provides natural separation between workspaces
- **Organic elements**: Natural materials integrated into architecture

**Movement Constraints**:
- User is **standing** at all times
- **Lateral movement only** - can walk/strafe around the room
- **Cannot hover, jump, or fly**
- Ground-based locomotion only (realistic movement)
- Height fixed at standing eye level (~1.6m)

**Spatial Benefits**:
- Natural task separation across room
- Turn to access different panels/functions
- Physical movement aids memory and context switching
- Grounded, realistic interaction model

### Initial Camera View

The camera will initially face **two layered screens** (the Chat Panel):

1. **Front Screen (Holographic Display)**
   - Displays information in a **holographic fashion**
   - Visual style inspired by cyberpunk/futuristic UI (see `./lookbook` folder)
   - Semi-transparent with floating, projected appearance
   - Text and UI elements appear to float in space or be projected onto glass

2. **Background Panel (Contextual Surface)**
   - Provides visual context and depth
   - **Hybrid materiality** combining:
     - **Cyberpunk**: Corrugated metal, dark rough stone, industrial surfaces
     - **Solarpunk**: Reclaimed wood, bamboo, living moss/lichen textures
   - **Sustainable aesthetic** - materials appear repurposed or grown
   - Contrasts with the ethereal front screen
   - Grounds the interface in a tangible, harmonious space
   - **Warm organic tones** balance cool digital displays

### Chat Interface Design

**Modern Chat Aesthetic** (à la Claude Desktop):
- Clean, contemporary messaging interface
- **Mostly transparent panel** - the background shows through
- **Floating text effect** - text appears to hover or be projected
- **Glass pane metaphor** - messages rendered as if on transparent glass
- Minimalist, unobtrusive design that doesn't obstruct the environment
- **Optimistic color palette** - warm accents, inviting tones
- **Soft edges** - rounded corners, organic shapes vs. hard rectangles

### Document Review System

**Separate Document Pane**:
- Appears when user reviews a document
- **One of the three display panels** in the hexagonal room
- **Easily within view** - positioned on adjacent hexagon wall
- User can **turn laterally** to face document panel
- Separate from chat interface to maintain context
- Physical movement between panels aids cognitive separation
- Allows user to turn back to chat panel when needed

---

## Scene Layout

### Spatial Organization

```
                    Sky (Procedural)
                         │
                         │
         ╱───────────────────────────╲
        ╱         HEXAGONAL           ╲
       ╱            ROOM               ╲
      │                                 │
      │   [Panel 3]     [Panel 2]      │
      │       ╲           ╱             │
      │        ╲         ╱              │
      │         ╲       ╱               │
      │          ╲     ╱                │
      │           ╲   ╱                 │
      │         [Chat Panel]            │
      │      (Front-facing)             │
      │      chatBackground             │
      │      chatScreen                 │
      │             │                   │
      │          Camera                 │
      │        (Standing,               │
      │      Y: 1.6m/160 units)         │
      │                                 │
       ╲             │                 ╱
        ╲            │                ╱
         ╲───────────┼───────────────╱
                Ground Plane
         (Hexagonal or large plane)
```

**Room Layout**:
- **Hexagonal room** architecture
- **Three display panels** distributed around walls
- User starts facing **Chat Panel**
- **Lateral movement only** - user walks to view other panels
- Standing height: 1.6m (160 units in scene scale)

**Panel Distribution** (Suggested):
- **Chat Panel**: Front wall (0° - initial view)
- **Panel 2**: 120° rotation (document review)
- **Panel 3**: 240° rotation (search/visualization)
- Even spacing around hexagon for ergonomic turning

### Distance & Scale
- **Ground**: Hexagonal or origin-centered plane
- **Chat Panel**: ~400 units in front of camera (Z-axis)
- **Other Panels**: Similar distance on respective walls
- **Camera Height**: 1.6m standing (locked, no jump/fly)
- **Room Radius**: ~500-600 units (comfortable walking space)
- **Sky**: Procedural skybox scaled 100x

---

## Chat Panel System

### Chat Background Panel

**Component Hierarchy**:

```
chatBackground (Frame/Border)
    └── chatScreen (Interactive Surface)
```

**Note**: This is the **Chat Panel** - one of three display panels in the hexagonal room.

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

**Design Direction** (Future Enhancement):
- **Target**: Hybrid organic-industrial texture
- **Cyberpunk Options**:
  - Corrugated metal with normal/bump mapping
  - Dark rough stone with displacement
  - Industrial surface with wear and detail
- **Solarpunk Options**:
  - Reclaimed/weathered wood grain
  - Bamboo weave or lattice
  - Living wall texture (moss, lichen, small plants)
  - Mycelium-grown material patterns
  - Cork or natural fiber textures
- **Hybrid Approach** (Recommended):
  - Industrial frame with organic insets
  - Metal panels with wood accents
  - Stone base with living elements growing through
  - Sustainable tech aesthetic - technology working with nature
- **Purpose**: 
  - Provides tactile, grounded context
  - Contrasts with ethereal holographic front screen
  - Creates depth and visual interest
  - **Communicates hope and sustainability**

**Current Purpose**: 
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

**Design Aesthetic**:
- **Holographic Display**: Information appears in cyberpunk/futuristic style
- **Floating Text**: Messages appear to hover in space
- **Glass Projection Metaphor**: Text rendered as if projected onto transparent glass
- **Modern Chat Interface**: Clean, contemporary design (Claude Desktop inspiration)
- **Minimal Obstruction**: Transparency preserves environmental awareness

**Interaction Properties**:
- Pickable: true
- Receives shadows: true
- Will host Babylon.js GUI AdvancedDynamicTexture

**Visual References**:
- See `./lookbook/cybernetic-odyssey-universal-cyberpunk-futuristic-user-interface_954894-37376.avif`
- Holographic UI elements with glow effects
- Transparent panels with high-tech aesthetics

---

## Visual Design Principles

### Color Palette

**Primary Colors**:
- **Frame**: Dark Brown-Red (#6F3838) - Warm, grounding, earth-toned
- **Screen**: Light Purple-Blue (#6A6AAF) - Cool, technological
- **Background Sky**: Procedural (natural gradient)
- **Ground**: Textured (albedo.png tiled 500x)

**Solarpunk Accent Colors** (Future):
- **Living Green**: #4A7C59 - Plant life, growth, vitality
- **Warm Wood**: #8B7355 - Natural materials, warmth
- **Soft Gold**: #D4AF37 - Sunlight, optimism, energy
- **Earth Brown**: #6B4423 - Soil, grounding, sustainability
- **Sky Blue**: #87CEEB - Hope, openness, clarity

**Color Relationships**:
- Warm frame + cool screen = visual hierarchy
- **Green/gold accents** = life and energy
- **Earth tones** = grounding and sustainability
- Transparency creates depth perception
- Contrast ensures readability
- **Optimistic palette** - inviting, not dystopian

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
- Sun Inclination: 0.2 (morning/evening angle - **warm, optimistic light**)
- Sun Azimuth: 0.25

**Ambient Lighting**:
- Clear color: RGB(0.2, 0.2, 0.3) - dark blue-gray
- Ambient color: RGB(0, 0, 0) - pure black
- Environment intensity: 1.0
- Environment texture: country.env

**Solarpunk Lighting Enhancements** (Future):
- **Warm sunlight** - golden hour tones, inviting
- **Natural light sources** - simulated daylight through ceiling
- **Bioluminescent accents** - soft glowing plants/fungi
- **Soft shadows** - diffused, natural shadow falloff
- **Ambient warmth** - subtle orange/yellow ambient light
- **Dynamic time** - optional day/night cycle for variety

**Effect**:
- Natural outdoor lighting
- Soft atmospheric scattering
- Realistic sky gradient
- No harsh contrasts
- **Positive, welcoming atmosphere**

---

## Physics & Interaction

### Physics Configuration

**Gravity**: [0, -981, 0] cm/s² (Earth gravity)
**Ground Physics**: Static collider
**Movement Type**: 
- **Grounded locomotion** - walking/strafing only
- **No vertical movement** - no jumping, hovering, or flying
- **Standing height locked** at 1.6m
- Realistic, ground-based navigation

**Chat Panels**: No physics bodies (UI elements)

### Interaction Design

**Movement**:
- **Lateral only**: Walking/strafing in the hexagonal room
- **No vertical movement**: Cannot jump, fly, or hover
- **Turn to access panels**: Rotate to face different walls
- Ground-based, realistic locomotion

**Chat Screen**:
- Pickable: Enabled
- Pointer interaction: Direct
- VR controller: Ray-based selection
- Desktop: Mouse click

**Input Methods**:
1. **VR**: Controller raycasting + locomotion
2. **Desktop**: Mouse, keyboard, WASD movement
3. **Touch**: Mobile/tablet support

---

## Camera Configuration

### Default Camera Setup

**Position**: [0, 160, 5] (standing height in scene units, 5 units back)
**Target**: [0, 160, 0] (eye level, forward)
**Type**: UniversalCamera (first-person)
**Height**: Locked at 1.6m (160 units) - standing height

**Movement Capabilities**:
- ✅ **Lateral movement**: Walk forward/back, strafe left/right
- ✅ **Rotation**: Look around, turn to face different panels
- ❌ **No jumping**: Grounded at all times
- ❌ **No flying/hovering**: Realistic movement only
- ❌ **No vertical movement**: Height fixed

**Hexagonal Room Navigation**:
- Start facing **Chat Panel** (front wall)
- **Turn left/right** to view other two panels
- **Walk around room** to explore
- Comfortable turning radius within hexagon

**View**:
- Eye level: 1.6m (160 units - average standing height)
- Distance to chat panel: ~370-420 units
- Clear frontal view of interface
- No obstruction or clipping

---

## Asset Generation Prompts

### Image Generation Prompts (ComfyUI / Stable Diffusion / Midjourney)

#### Panel Background Textures

**Cyberpunk Metal Panel**:
```
Positive: corrugated metal texture, dark industrial steel, weathered rusty surface, rivets and bolts, seamless tileable pattern, PBR material, 4K resolution, photorealistic, high detail, panel seams, industrial sci-fi

Negative: people, faces, text, watermark, blurry, low quality, distorted

Settings: SDXL, 1024x1024, CFG 7-9, Steps 30-40
```

**Solarpunk Wood Panel**:
```
Positive: reclaimed weathered wood texture, warm natural grain, sustainable eco-friendly material, bamboo accents, organic texture, seamless tileable pattern, PBR material, 4K resolution, photorealistic, earthy tones, hope and nature

Negative: people, faces, text, watermark, plastic, synthetic, cold colors, dystopian

Settings: SDXL or Realistic Vision, 1024x1024, CFG 7-9, Steps 30-40
```

**Hybrid Tech-Organic Panel**:
```
Positive: industrial metal panel with organic moss growing in crevices, sustainable solarpunk cyberpunk fusion, reclaimed materials, nature reclaiming technology, green living plants on dark metal, seamless tileable PBR texture, 4K resolution, photorealistic, hopeful futurism

Negative: people, faces, text, watermark, pure synthetic, dystopian dark, death decay

Settings: SDXL, 1024x1024, CFG 7-9, Steps 35-45
```

**Living Wall Texture**:
```
Positive: vertical garden living wall texture, lush green moss and lichen, small plants and ferns, bioluminescent glow accents, natural organic growth, seamless tileable pattern, 4K resolution, photorealistic, vibrant life, sustainable architecture

Negative: people, faces, text, watermark, dead plants, brown wilted, artificial fake

Settings: SDXL, 1024x1024, CFG 7-9, Steps 30-40
```

**Dark Stone with Bio-Growth**:
```
positive: dark rough granite stone texture, black and gray rock surface, subtle green moss in cracks, natural weathering, high detail bumps and crevices, seamless tileable PBR, 4K resolution, photorealistic, organic meets mineral

Negative: people, faces, text, watermark, smooth, polished, artificial

Settings: SDXL, 1024x1024, CFG 7-9, Steps 30-40
```

**Bamboo Lattice Panel**:
```
Positive: bamboo weave lattice texture, natural woven pattern, sustainable eco material, warm honey brown tones, organic fiber detail, seamless tileable pattern, PBR material, 4K resolution, photorealistic, craftsmanship, solarpunk aesthetic

Negative: people, faces, text, watermark, plastic, metal, synthetic

Settings: SDXL or Realistic Vision, 1024x1024, CFG 7-9, Steps 30-40
```

**Mycelium Bio-Material**:
```
Positive: mycelium grown material texture, organic fungal network pattern, white and cream tones with earth brown accents, bio-engineered sustainable material, subtle organic tendrils, seamless tileable PBR, 4K resolution, photorealistic, future biomaterial, solarpunk technology

Negative: people, faces, text, watermark, mold, rot, slimy, unpleasant

Settings: SDXL, 1024x1024, CFG 7-9, Steps 35-45
```

#### Floor Textures

**Hexagonal Sci-Fi Floor with Organic Gaps**:
```
Positive: hexagonal pattern floor texture, dark metallic panels with glowing cyan edge lights, green moss growing between panel gaps, tech meets nature, sustainable cyberpunk, seamless tileable, PBR material, 4K resolution, photorealistic, grid pattern, hope and technology

Negative: people, faces, text, watermark, random, chaotic, broken

Settings: SDXL, 1024x1024, CFG 7-9, Steps 35-45
```

**Natural Wood Plank Floor**:
```
Positive: warm wooden floor planks texture, reclaimed sustainable wood, natural grain variation, hexagonal room flooring, eco-friendly material, seamless tileable pattern, PBR material, 4K resolution, photorealistic, organic warmth

Negative: people, faces, text, watermark, laminate, fake, plastic

Settings: Realistic Vision or SDXL, 1024x1024, CFG 7-9, Steps 30-40
```

**Bio-Luminescent Floor Accents**:
```
Positive: dark floor texture with bioluminescent organic pathways, glowing blue-green living light trails, natural phosphorescence, sustainable lighting, seamless tileable, 4K resolution, photorealistic, magical bio-technology, solarpunk aesthetic

Negative: people, faces, text, watermark, neon artificial, LEDs, cables

Settings: SDXL, 1024x1024, CFG 7-10, Steps 35-45
```

#### Environmental Elements

**Ceiling Skylight with Plant Canopy**:
```
Positive: glass skylight ceiling view, lush green plant canopy visible through transparent panels, natural sunlight filtering through leaves, hexagonal glass pattern, sustainable architecture, hopeful bright atmosphere, photorealistic, 4K resolution, biophilic design

Negative: people, faces, text, watermark, dark, gloomy, dead plants, urban sprawl

Settings: SDXL, 1024x1024, CFG 7-9, Steps 30-40
```

**Bioluminescent Corner Accents**:
```
Positive: bioluminescent plants in corner arrangement, soft blue and green natural glow, living fungi and moss, sustainable organic lighting, gentle atmospheric light, photorealistic, high detail, 4K resolution, magical nature, solarpunk technology

Negative: people, faces, text, watermark, LED lights, artificial, electrical, wires

Settings: SDXL, 1024x1024, CFG 7-10, Steps 35-45
```

#### Holographic UI Reference

**Cyberpunk Holographic Interface**:
```
Positive: holographic user interface, floating transparent glass panels, cyan and purple neon accents, digital readout displays, futuristic UI elements, clean modern design, glowing edges, semi-transparent, high tech aesthetic, photorealistic, 4K

Negative: people, faces, cluttered, messy, retro, old, physical buttons

Settings: SDXL or DreamShaper, 1024x1024, CFG 7-9, Steps 30-40
```

**Solarpunk-Cyberpunk Hybrid UI**:
```
Positive: holographic interface with organic flowing forms, transparent glass panels with subtle green plant motifs, warm gold and cool cyan accents, sustainable tech aesthetic, clean modern design, nature-inspired UI elements, hopeful futurism, photorealistic, 4K

Negative: people, faces, dystopian, dark gloomy, aggressive, military

Settings: SDXL, 1024x1024, CFG 7-9, Steps 35-45
```

---

### 3D Asset Generation Prompts

#### For AI 3D Generators (Meshy.ai / Rodin / Luma AI / TripoSR)

**Hexagonal Room Structure**:
```
Text Prompt: hexagonal room interior, six-sided walls, sustainable architecture, organic meets technology, bamboo and metal structural elements, warm lighting, biophilic design, clean modern space, ceiling with skylight panels, no furniture

Image Reference: [Use generated ceiling skylight image above]

Settings: High poly, detailed, architectural mode
```

**Panel Frame with Organic Accents**:
```
Text Prompt: rectangular display panel frame, industrial metal border with wooden bamboo trim accents, sustainable design, tech meets nature, wall-mounted, clean edges, modern minimalist, solarpunk aesthetic

Settings: Medium poly, game-ready mesh
```

**Living Wall Section**:
```
Text Prompt: vertical garden wall panel, lush green plants and moss, small ferns, sustainable living wall architecture, organic growth on structured frame, modern biophilic design, photorealistic plants

Image Reference: [Use living wall texture from above]

Settings: High poly, detailed vegetation, architectural element
```

**Bioluminescent Plant Cluster**:
```
Text Prompt: cluster of bioluminescent plants, glowing blue-green mushrooms and moss, natural phosphorescence, sustainable organic lighting, low poly stylized yet realistic, magical atmosphere, corner accent piece

Settings: Medium poly, emissive materials, game-ready
```

**Floor Panel with Bio-Growth**:
```
Text Prompt: hexagonal floor tile, dark metallic surface with moss growing in panel gaps, tech meets nature, sustainable design, single tile unit for tiling, seamless edges, PBR ready

Image Reference: [Use hexagonal floor texture from above]

Settings: Low-medium poly, tileable, game-ready
```

**Bamboo Structural Beam**:
```
Text Prompt: bamboo support beam, natural sustainable material, cylindrical pole with authentic bamboo segments and nodes, warm honey brown color, architectural element, clean modern design

Settings: Medium poly, architectural, game-ready
```

**Holographic Display Screen**:
```
Text Prompt: transparent holographic display panel, floating glass screen, thin beveled edges, slight blue glow, futuristic interface, clean minimal design, wall-mounted, sci-fi technology

Settings: Low poly, simple geometry, clean mesh
```

#### For Blender Geometry Nodes / Procedural

**Hexagonal Room (Blender Python Script)**:
```python
# Prompt for AI code generation:
Create a Blender Python script that generates a hexagonal room with:
- 6 walls, each 400 units tall and 500 units wide
- Hexagonal floor and ceiling
- Walls positioned in hexagon shape with 1000 unit diameter
- Separate mesh for each wall for individual texturing
- Clean topology, quads preferred
- Proper normals facing inward
- UV unwrapped for seamless texturing
```

**Living Wall Geometry**:
```
Geometry Nodes Prompt: Create a geometry nodes setup that distributes small plant meshes (ferns, leaves, moss patches) across a vertical wall surface. Use weight painting to control density. Add slight random rotation and scale variation. Include bioluminescent glow emissive shader on 20% of instances.
```

**Floor Hexagonal Tiling**:
```
Geometry Nodes Prompt: Create hexagonal floor tile pattern using Array modifier and geometry nodes. Each tile should have slight height variation, edge gaps for moss growth, and support for dual material assignment (metal base + organic gaps).
```

---

### PBR Material Map Generation Prompts

#### For Any Base Texture Generated Above

**Normal Map** (img2img workflow):
```
Workflow: Base Texture → NormalMap Node/Model
Settings: Strength 1.0-2.0, preserve details
Alternative: Use external tool like NormalMap-Online or Blender Bake
```

**Roughness Map**:
```
Workflow: Base Texture → Desaturate → Invert regions where glossy
Guidance: 
- Metal/glass areas: 0.1-0.3 (darker = glossier)
- Wood/bamboo: 0.6-0.8 (lighter = rougher)
- Moss/plants: 0.7-0.9
- Stone: 0.8-1.0
```

**Metallic Map**:
```
Workflow: Create mask - white for metal, black for non-metal
Guidance:
- Metal panels: White (1.0)
- Wood/bamboo: Black (0.0)
- Stone: Black (0.0)
- Moss/plants: Black (0.0)
- Hybrid: Mask metal portions only
```

**Ambient Occlusion (AO)**:
```
Workflow: Base Texture → ControlNet Depth → Darken crevices
Alternative: Bake AO in Blender from 3D mesh
Guidance: Subtle darkening in gaps, corners, under elements
```

**Emissive Map** (for bioluminescent elements):
```
Positive Prompt: extract only the glowing bioluminescent areas from this texture, black background, bright blue-green emission areas only, clean mask, high contrast

Use Case: Living walls, bioluminescent accents, holographic glows
Color: Tint green-blue (RGB: 0.2, 0.8, 0.6) in Babylon.js
Intensity: 0.5-2.0 depending on element
```

---

### Quick Reference: Asset Checklist

**For Each Panel Background Material**:
1. ✅ Generate base albedo texture (1024x1024 or 2048x2048)
2. ✅ Generate or derive normal map
3. ✅ Create roughness map (grayscale)
4. ✅ Create metallic map (black/white mask)
5. ✅ Optional: AO map for depth
6. ✅ Optional: Emissive map for glow areas
7. ✅ Test in Babylon.js PBRMaterial

**For Each 3D Asset**:
1. ✅ Generate or model base geometry
2. ✅ Ensure clean topology (quads preferred, triangles acceptable)
3. ✅ UV unwrap for texturing
4. ✅ Apply textures/materials
5. ✅ Export as .glb or .babylon
6. ✅ Import to Babylon Editor
7. ✅ Position in scene

**Optimization Tips**:
- Textures: 1024x1024 for small elements, 2048x2048 for large panels
- Compress: Use JPEG for albedo (quality 85%), PNG for maps with alpha
- Geometry: Keep poly count reasonable for VR (<10k tris per asset)
- Materials: Reuse materials where possible
- Testing: Always test in actual VR headset for scale/detail

---

## 3D Asset Creation Tools & Methods

### Hexagonal Room Geometry

**Recommended Tools**:

1. **Babylon.js Editor** (Primary - Already in Use)
   - Direct integration with project
   - Built-in material editor
   - Real-time preview
   - Export to `.scene` format
   - **Current workflow**: Already creating chatBackground/chatScreen

2. **Blender** (Free, Open Source)
   - Create hexagonal room mesh
   - UV unwrapping for textures
   - Export as `.glb` or `.babylon`
   - Precise control over geometry
   - **Workflow**: Model → Export → Import to Babylon Editor

3. **Parametric Creation** (Code-based)
   - Use Babylon.js `MeshBuilder.CreateCylinder()` with 6 tessellation
   - Programmatically generate hexagon
   - Adjust in code without external tools
   - **Example**:
     ```typescript
     const room = BABYLON.MeshBuilder.CreateCylinder("hexRoom", {
       height: 400,
       diameterTop: 1000,
       diameterBottom: 1000,
       tessellation: 6
     }, scene);
     ```

### Textured Background Panels

**Material Creation Methods**:

1. **AI-Generated Textures via ComfyUI**

   **Corrugated Metal Texture**:
   - **Model**: SDXL or SD 1.5 with ControlNet
   - **Prompt**: "corrugated metal texture, dark industrial steel, rusty weathered surface, seamless tileable, PBR material, 4K"
   - **Workflow**:
     - Base Texture (Albedo/Diffuse)
     - Normal Map (from height map)
     - Roughness Map
     - Metallic Map
     - Ambient Occlusion
   - **ComfyUI Nodes**:
     - `Load Checkpoint` → SDXL or Realistic Vision
     - `CLIPTextEncode` → Positive/negative prompts
     - `KSampler` → Generate base texture
     - `ControlNet` → Ensure seamless tiling
     - `NormalMapGenerator` → Convert to normal map
     - `Save Image` → Export maps

   **Dark Stone Texture**:
   - **Model**: SDXL with detail enhancement
   - **Prompt**: "dark rough stone texture, black granite, weathered rock surface, high detail bumps, seamless tileable PBR, 4K"
   - **Additional Maps**: 
     - Displacement map for depth
     - Cavity map for crevices

   **Solarpunk Organic Textures**:
   - **Reclaimed Wood**:
     - **Model**: SDXL or Realistic Vision
     - **Prompt**: "reclaimed weathered wood texture, warm natural grain, sustainable material, seamless tileable PBR, 4K"
   - **Living Wall/Moss**:
     - **Model**: SDXL with fine detail
     - **Prompt**: "living moss wall texture, green lichen, organic growth, soft bioluminescent glow, seamless tileable, 4K"
   - **Bamboo Lattice**:
     - **Model**: SDXL
     - **Prompt**: "bamboo weave texture, natural lattice pattern, sustainable material, warm tones, seamless tileable PBR, 4K"
   - **Mycelium Surface**:
     - **Model**: SDXL
     - **Prompt**: "mycelium grown material texture, organic fungal network, white and earth tones, seamless tileable, sci-fi sustainable, 4K"

   **Hybrid Textures** (Recommended):
   - **Prompt**: "industrial metal panel with organic moss growing in crevices, sustainable cyberpunk, reclaimed materials, nature reclaiming technology, seamless PBR, 4K"
   - **Prompt**: "weathered wood planks with embedded LED strips, solarpunk aesthetic, warm natural wood with cool tech accents, seamless tileable, 4K"

   **Seamless Tiling**:
   - Use **Seamless Texture** custom node in ComfyUI
   - Or use **Tiled Diffusion** extension
   - Or manually blend edges in Photoshop/GIMP

2. **Traditional Texture Tools**

   **Substance Designer** (Adobe, Paid):
   - Procedural material creation
   - Full PBR workflow (albedo, normal, roughness, metallic, AO)
   - Export directly for Babylon.js
   - Pre-made materials: Metal, stone, concrete

   **Quixel Mixer** (Free with Epic Account):
   - Mix and layer materials
   - Extensive material library
   - PBR workflow
   - Export as texture sets

   **ArmorPaint** (Blender Foundation, Paid):
   - Texture painting
   - PBR material authoring
   - Similar to Substance Painter
   - Lower cost alternative

3. **Free Texture Resources**

   - **Poly Haven** (polyhaven.com)
     - Free PBR textures
     - Metal, stone, concrete, **wood**
     - Multiple resolutions
     - CC0 license
   
   - **ambientCG** (ambientcg.com)
     - Free PBR materials
     - Seamless textures
     - **Wood, bark, natural materials**
     - Public domain

   - **CC0 Textures** (cc0textures.com)
     - Free, no attribution
     - PBR sets
     - Good quality
     - **Organic materials available**

   - **Texture Haven** (texturehaven.com)
     - Natural textures
     - Wood, bark, leaves
     - High quality scans

### Holographic UI Elements

**Creation Approaches**:

1. **Babylon.js GUI** (Recommended for Text/UI)
   - Create UI programmatically
   - `AdvancedDynamicTexture`
   - Built-in controls (text, buttons, inputs)
   - **Current plan**: Use for chat interface

2. **Glow Effects via Post-Processing**
   - **Babylon.js Default Pipeline**:
     - Bloom effect for holographic glow
     - Adjust threshold and intensity
   - **Code Example**:
     ```typescript
     const pipeline = new BABYLON.DefaultRenderingPipeline(
       "default", true, scene, [camera]
     );
     pipeline.bloomEnabled = true;
     pipeline.bloomThreshold = 0.8;
     pipeline.bloomWeight = 0.3;
     pipeline.bloomKernel = 64;
     ```

3. **Custom Shaders for Scanlines**
   - **ShaderMaterial** for holographic effects
   - Scanline animation
   - Flickering/glitch effects
   - Color cycling

4. **Particle Systems for Accents**
   - Floating particles around UI
   - Data streams
   - Cursor trails
   - **Solarpunk particles**:
     - Floating pollen/seeds
     - Bioluminescent motes
     - Leaf particles
     - Firefly-like ambient effects

### Recommended ComfyUI Workflows

**Workflow 1: PBR Texture Set Generation**
```
[CheckpointLoader] → SDXL or Realistic Vision
    ↓
[CLIPTextEncode] → Prompt: "corrugated metal texture seamless 4k pbr"
    ↓
[KSampler] → Generate base image
    ↓
[VAEDecode] → Get image
    ↓
├─[SaveImage] → albedo.png
├─[NormalMapFromImage] → normal.png
├─[RoughnessMapGenerator] → roughness.png
└─[MetallicMapGenerator] → metallic.png
```

**Workflow 2: Seamless Tiling Texture**
```
[CheckpointLoader] → SDXL
    ↓
[CLIPTextEncode] → Texture description
    ↓
[TiledKSampler] → Ensures seamless edges
    ↓
[VAEDecode]
    ↓
[MakeTileable] → Post-process for perfect tiling
    ↓
[SaveImage] → texture.png
```

**Recommended Models for ComfyUI**:
- **SDXL**: Best quality for textures (tech and organic)
- **Realistic Vision**: Good for realistic materials
- **DreamShaper**: Artistic textures
- **ControlNet Tile**: For upscaling/enhancing existing textures
- **Normal Map VAE**: Specialized for normal map generation
- **Nature/Organic Models**: 
  - Any SDXL fine-tune trained on natural materials
  - Photorealistic models for wood/plant textures

### Material Workflow

**For Each Panel Background**:

1. **Generate/Source Textures**:
   - Albedo (base color) - 2048x2048 or 4096x4096
   - Normal map (surface detail)
   - Roughness map (matte/glossy)
   - Metallic map (metal/non-metal)
   - Ambient Occlusion (shadows in crevices)

2. **Import to Babylon Editor**:
   - Create new PBRMaterial
   - Load texture maps
   - Adjust settings (roughness, metallic values)
   - Preview in real-time

3. **Apply to Panel**:
   - Assign material to chatBackground mesh
   - Adjust UV scaling for tiling
   - Test in VR for scale/detail

4. **Optimize**:
   - Compress textures (JPEG for albedo, PNG for maps)
   - Use appropriate resolution (2K usually sufficient for VR)
   - Consider mip-mapping for performance

### Additional Geometry Assets

**Panel Frames/Bezels**:
- **Blender**: Model custom frame geometry
- **CSG in Babylon**: Combine primitives for frames
- **Kitbash**: Use pre-made sci-fi panel assets

**Room Details** (Corners, Ceiling, Floor):
- **Procedural**: Generate floor grid with shader
- **Blender**: Model architectural details
- **Solarpunk elements**:
  - Living walls (plant geometry)
  - Bioluminescent accents
  - Organic structural elements
- **Asset Libraries**: 
  - Sketchfab (some free assets, search "solarpunk" or "organic sci-fi")
  - Turbosquid (paid)
  - CGTrader (mixed)
  - **Nature assets**: Plant libraries, tree models, foliage

**Lighting Elements**:
- **Babylon.js Lights**: Point lights in corners
- **Emissive Materials**: Glowing strips/accents
- **Bioluminescent emissive**: Soft green/blue glowing plants
- **Light Baking** (Advanced): Pre-bake lighting in Blender

### Workflow Summary

**Current Assets** → **New Assets**:

1. **Chat Panel** (✅ Done)
   - Keep current geometry
   - **Add**: Enhanced background texture (ComfyUI metal/stone **OR wood/bamboo/hybrid**)
   - **Add**: Holographic shader effects (Babylon.js)
   - **Consider**: Organic frame accents (wood trim on metal)

2. **Hexagonal Room** (⏳ To Create)
   - **Tool**: Babylon.js Editor or Blender
   - **Method**: Create cylinder with 6 sides
   - **Material**: Dark, subtle texture (ComfyUI or Poly Haven)
   - **Solarpunk additions**:
     - Living wall sections between panels
     - Bioluminescent corner accents
     - Wood or bamboo structural elements
     - Optional ceiling with skylight/plant canopy effect

3. **Panel 2 & 3** (⏳ To Create)
   - **Duplicate**: Clone chat panel geometry
   - **Reposition**: Place at 120° and 240°
   - **Materials**: Same hybrid tech-organic style
   - **Variation**: Perhaps different organic elements per panel

4. **Floor** (⏳ To Create)
   - **Option A**: Hexagonal mesh (Blender)
   - **Option B**: Large plane with hexagonal texture
   - **Texture**: 
     - Tech option: Grid pattern or sci-fi floor (ComfyUI)
     - Organic option: Wood planks, bamboo, natural stone
     - **Hybrid option**: Tech grid with moss/plants in gaps

5. **Lighting/Atmosphere** (⏳ To Create)
   - **Sky**: Keep current procedural sky (adjust to warmer tones)
   - **Room Lights**: Add point lights in corners (warm color temperature)
   - **Accent Lights**: 
     - Emissive materials on panel edges
     - **Bioluminescent plants** - soft green/blue glow
     - Warm sunlight from ceiling
   - **Particle effects**: Floating pollen, light motes, ambient life

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

### Future Enhancements

### Planned Features

1. **Document Review Panel**
   - **Second display panel** in the hexagonal room
   - Positioned on adjacent wall (120° from chat panel)
   - User **turns to face** when reviewing documents
   - Appears when user requests document review
   - Similar holographic/transparent aesthetic
   - **Physical separation** aids focus and context switching
   - May include:
     - Document title and metadata
     - Scrollable content area
     - Highlight/annotation tools
     - Quick navigation controls

2. **Third Display Panel**
   - **Third panel** on opposite wall (240° from chat)
   - Potential uses:
     - Search results visualization
     - 3D data representation
     - Paper relationship graph
     - Settings/controls
   - Accessed by turning around in room

3. **Hexagonal Room Environment**
   - **Floor geometry**: Hexagonal or fitted plane
   - **Wall geometry**: Six walls with panel mounts
   - **Solarpunk elements**:
     - **Living walls** - vertical gardens between panels
     - **Natural materials** - bamboo, reclaimed wood accents
     - **Bioluminescent details** - glowing plant life
     - **Organic patterns** - vines, roots as decorative elements
   - **Ambient details**: 
     - Corner lighting (warm tones)
     - Floor grid/pattern (natural + tech hybrid)
     - Ceiling details (skylight effect, plant canopy)
   - **Navigation aids**:
     - Subtle floor markers (organic shapes)
     - Directional indicators (living light trails)
     - Panel labels/icons (nature-inspired)

4. **Dynamic Layout**
   - Resizable panels
   - Height adjustment (within standing reach)
   - Distance control

5. **Visual Feedback**
   - Button hover effects
   - Input field highlighting
   - Message send animation
   - Holographic glow effects
   - Subtle animations for text appearance
   - **Panel activation indicators** (which panel is active)

6. **Customization**
   - Color themes
   - Opacity adjustment
   - Font size control
   - Holographic intensity settings

5. **Enhanced Background Panel**
   - **Textured surfaces**: corrugated metal, dark stone
   - Normal/bump mapping for depth
   - Displacement for realism
   - Industrial/architectural materiality
   - Dynamic lighting response
   - **Applied to all three panel backgrounds** for consistency

6. **Additional Panels**
   - Source preview panel
   - Search results panel
   - Settings panel

### Advanced Features

- **3D Data Visualization**: Papers in 3D space
- **Gesture Controls**: Hand tracking
- **Spatial Audio**: Directional feedback for each panel
- **Multi-user**: Collaborative viewing
- **Holographic Effects**: 
  - Glow/bloom post-processing
  - Scanline effects
  - Particle systems for UI accents
  - Dynamic opacity based on focus
  - **Organic particles** - floating pollen, leaf particles, light motes
- **Contextual Backgrounds**:
  - Multiple texture options (metal, stone, concrete, **wood, bamboo, living walls**)
  - Environment-based lighting
  - Parallax effects for depth
  - **Natural material transitions** - tech to organic gradients
- **Room Customization**:
  - Adjustable room size
  - Different hexagonal themes
  - Custom panel arrangements
  - Lighting mood presets
  - **Biome options**: Forest, garden, meadow, greenhouse themes
- **Navigation Enhancements**:
  - Teleport to panel (quick access)
  - Minimap showing room layout
  - Breadcrumb trail for movement history
  - Panel quick-switch hotkeys
  - **Natural wayfinding** - organic visual cues

---

## Design Rationale

### Why This Layout?

**Hybrid Cyberpunk-Solarpunk Aesthetic**:
- **Best of both worlds**: High-tech functionality + natural warmth
- **Positive futurism**: Technology as tool for good, not dystopia
- **Sustainable narrative**: Harmony between digital and natural
- **Visual richness**: Organic textures prevent sterile tech feel
- **Emotional balance**: Cool digital + warm organic = comfortable
- **Hope-oriented**: Solarpunk counters cyberpunk's darkness

**Hexagonal Room**:
- **Six walls** provide natural segmentation for multiple displays
- **Three panels** utilize alternating walls for optimal spacing
- **120° rotation** between panels is comfortable turning distance
- **Enclosed space** creates focused work environment
- **Symmetrical geometry** is aesthetically pleasing and intuitive
- **Hexagon in nature** - honeycomb pattern, organic efficiency

**Grounded Movement**:
- **Standing only** - realistic, reduces motion sickness
- **No flying/jumping** - prevents disorientation
- **Lateral movement** - natural, familiar locomotion
- **Physical turning** to access panels aids spatial memory
- **Locked height** eliminates accidental vertical movement

**Front-Facing Panel**:
- Natural reading position
- Mimics real-world display interaction
- Easy to locate in VR
- **Starting position** orients user immediately

**Multi-Panel System**:
- **Spatial separation** for different tasks
- **Physical movement** between contexts reduces cognitive load
- **Turn to switch** is more engaging than menu navigation
- **Three panels** balances functionality with simplicity
- **Even distribution** around hexagon feels balanced

**Layered Design**:
- Background provides context and grounding
- Screen maintains focus on content
- Transparency preserves spatial awareness
- **Two-screen approach**:
  - Front: Ethereal, holographic information display
  - Back: Solid, textured, tactile context
  - Creates depth and visual hierarchy

**Holographic Aesthetic**:
- **Modern, futuristic feel** aligns with advanced research tool
- **Floating text** reduces cognitive load (feels lighter)
- **Glass projection metaphor** is familiar from sci-fi interfaces
- **Transparency** prevents claustrophobia in VR
- Inspired by cutting-edge UI design (lookbook references)

**Textured Background**:
- **Grounds the interface** in physical space
- **Rich materiality** (metal/stone) adds realism
- **Organic elements** (wood/plants) add warmth and life
- **Hybrid materials** show tech-nature integration
- **Contrast** makes holographic elements more striking
- **Depth cues** improve spatial understanding
- **Sustainable aesthetic** - reclaimed, grown, harmonious

**Matte Materials**:
- Reduces VR eye strain
- Professional appearance
- Better text readability

**Purple-Blue + Brown-Red**:
- Cool screen = technology/digital
- Warm frame = approachable/grounded
- Complementary contrast
- **Future**: Add green/gold solarpunk accents for life and optimism

**Separate Document Pane**:
- **Physical panel** on different wall
- **Turn to view** creates clear context switch
- **Dedicated space** for focused reading
- **Return to chat** by turning back
- **Spatial memory** helps recall information location

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
- Sci-fi UI aesthetics (holographic displays)
- Minimalist design principles
- **Cyberpunk/futuristic UI** (see lookbook folder)
- **Claude Desktop** - modern chat interface design
- **Holographic cinema interfaces** (Minority Report, Iron Man, etc.)
- **Glass/transparency effects** in modern UI design
- **Solarpunk aesthetics**:
  - Studio Ghibli nature-tech harmony
  - Sustainable architecture (green buildings, living walls)
  - Hopeful futurism (Wakanda, Star Trek utopia)
  - Biophilic design principles
  - Natural materials in tech spaces

**3D Asset Tools**:
- Babylon.js Editor (primary workflow)
- Blender (geometry creation)
- ComfyUI + SDXL (texture generation - **tech and organic**)
- Substance Designer / Quixel Mixer (PBR materials)
- Poly Haven / ambientCG (free texture resources - **including wood/natural materials**)

---

*This design document serves as the foundation for implementing the VR research interface. All measurements, colors, and specifications are derived from the current Babylon Editor scene configuration.*
