# BeaboDOCL VR Research Interface

> **⚠️ MIGRATION NOTICE**: This Babylon.js implementation is being deprecated due to the difficulty of creating and editing scenes programmatically. Development has moved to a Unity-based implementation at:
> 
> **🔗 https://github.com/buddha314/beabodocl-unity**
>
> The Unity version provides better tooling for VR scene creation and editing. This repository is kept for reference only.

---

A VR research interface for biomedical paper discovery and exploration, combining **solarpunk** optimism with **cyberpunk** technology in an immersive 3D environment.

---

## 🎯 Project Vision

BeaboDOCL is a virtual reality research assistant that enables scientists to explore biomedical literature through natural language conversation with an AI agent. The interface blends:

- **Holographic displays** for information presentation
- **Organic materials** for environmental warmth
- **Hexagonal workspace** with three interactive panels
- **Grounded navigation** for comfortable VR experience
- **AI-powered discovery** for intelligent paper search

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Babylon Editor (for scene editing)
- VR headset (Quest 2/3 recommended for testing)

### Installation

```bash
# Clone the repository
git clone https://github.com/buddha314/beabodocl-babylon.git
cd beabodocl-babylon

# Install dependencies
npm install

# Install Babylon.js packages (if not already)
npm install @babylonjs/core @babylonjs/gui @babylonjs/materials @babylonjs/havok babylonjs-editor-tools

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

For VR testing on Quest headsets, access the dev server from your headset browser using your computer's IP address.

---

## 📁 Project Structure

```
beabodocl-babylon/
├── assets/
│   └── example.scene/           # Babylon Editor scene files
├── public/
│   └── scene/                   # Generated scene exports (created by editor)
├── src/
│   ├── app/                     # Next.js app (to be created)
│   ├── scripts/                 # Babylon Editor scripts (to be created)
│   └── lib/                     # API clients and utilities (to be created)
├── specs/
│   ├── INTERFACE_DESIGN.md     # Complete design specification
│   ├── GITHUB_ISSUES_V2.md     # GitHub issues aligned with current plan
│   └── ...                      # Additional documentation
├── IMPLEMENTATION_PLAN.md       # 8-phase implementation roadmap
├── project.bjseditor            # Babylon Editor project file
├── package.json
└── tsconfig.json
```

---

## 🎨 Design Aesthetic

### Solarpunk-Cyberpunk Fusion

**Cyberpunk Elements:**
- Holographic transparent displays
- Neon-like glow effects
- Industrial materials (corrugated metal)
- High-tech UI elements

**Solarpunk Elements:**
- Organic textures (wood, bamboo, living moss)
- Warm, natural lighting
- Bioluminescent accents
- Positive, hopeful atmosphere
- Sustainable material aesthetic

### Environment Layout

- **Hexagonal room** - Six walls creating focused workspace
- **Three display panels** - Chat (0°), Documents (120°), Search (240°)
- **Grounded navigation** - Standing user, lateral movement only
- **Atmospheric elements** - Floating particles, soft glows, warm lighting

---

## 🛠️ Development Approach

### Editor-First Workflow

This project follows an **editor-first approach** using Babylon Editor:

1. **Design in Babylon Editor** - Create and arrange all scene objects
2. **Export from Editor** - Generate scene files to `public/scene/`
3. **Load in Next.js** - Use `loadScene()` to load exported scene
4. **Attach Scripts** - Add behavior through editor-compatible scripts

**Important**: Do NOT manually create scene objects in code. Always use the editor as the single source of truth.

### Key Technologies

- **Next.js 14** - React framework with App Router
- **Babylon.js** - 3D engine for web and VR
- **Babylon Editor** - Visual scene creation tool
- **WebXR** - VR support in browsers
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling

---

## 📖 Documentation

### Essential Reading

- **[IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)** - Complete 8-phase implementation roadmap
- **[specs/INTERFACE_DESIGN.md](./specs/INTERFACE_DESIGN.md)** - Detailed design specification with asset prompts
- **[specs/GITHUB_ISSUES_V2.md](./specs/GITHUB_ISSUES_V2.md)** - GitHub issues aligned with current plan
- **[HANDOFF_2025-11-10.md](./HANDOFF_2025-11-10.md)** - Current state and next steps

### Additional Documentation

- **specs/ARCHITECTURE.md** - System architecture
- **specs/DEVELOPMENT.md** - Development practices
- **specs/ROADMAP.md** - Long-term vision
- **.github/copilot-instructions.md** - AI coding guidelines

---

## 🎯 Current Status

**Phase**: Foundation Setup (Phase 1 of 8)  
**Status**: Ready for Implementation  
**Next Steps**: Install Babylon.js, create app structure, export scene

### Completed
✅ Project structure organized  
✅ Interface design documented  
✅ Scene designed in Babylon Editor  
✅ Implementation plan created  
✅ Asset generation prompts defined  

### In Progress
⏳ Babylon.js integration (Phase 1)  
⏳ Scene export and loading (Phase 1)  

### Upcoming
📋 Hexagonal room creation (Phase 2)  
📋 Chat GUI implementation (Phase 3)  
📋 Agent API integration (Phase 4)  

---

## 🎮 Features (Planned)

### Core Features
- ✨ AI-powered research agent chat
- 🔍 Natural language paper search
- 📄 Document viewing and navigation
- 🎨 Immersive VR environment
- 🌿 Solarpunk-cyberpunk aesthetic

### VR Features
- 🕹️ Smooth locomotion (joystick controls)
- 🎯 Controller-based UI interaction
- 🏃 Grounded movement (no flying)
- 👀 Comfortable viewing distances
- 💫 90 FPS performance target

### Advanced Features (Future)
- 📊 Data visualizations
- 🔗 Knowledge graph exploration
- 🎨 Custom texture themes
- 🌐 Multi-user collaboration
- 📱 Mobile support

---

## 🧪 Testing

### Desktop Testing
```bash
npm run dev
# Open http://localhost:3000
```

### VR Testing
```bash
npm run dev
# Access from Quest browser using computer's IP
# Example: http://192.168.1.100:3000
```

---

## 📊 Performance Targets

- **Desktop**: 60+ FPS constant
- **VR (Quest 2)**: 90 FPS minimum
- **VR (Quest 3)**: 120 FPS target
- **Load Time**: < 5 seconds
- **API Response**: < 3 seconds

---

## 🤝 Contributing

This project follows the **editor-first** workflow. When contributing:

1. Design scene changes in Babylon Editor
2. Export before committing
3. Test scene loads correctly
4. Write editor-compatible scripts for behavior
5. Follow TypeScript guidelines in `.github/copilot-instructions.md`

---

## 📝 License

[Add license information]

---

## 🔗 Links

- **Repository**: https://github.com/buddha314/beabodocl-babylon
- **Issues**: See `specs/GITHUB_ISSUES_V2.md`
- **Babylon.js**: https://www.babylonjs.com/
- **Babylon Editor**: https://doc.babylonjs.com/toolsAndResources/editor

---

## 📞 Contact

[Add contact information]

---

*Built with ❤️ combining the optimism of solarpunk with the innovation of cyberpunk*
