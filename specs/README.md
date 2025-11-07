# Beabodocl Babylon.js Project Documentation

**Last Updated:** November 7, 2025  
**Project Version:** 0.1.0  
**Status:** Active Development

## 📋 Overview

This is a Next.js-based 3D web application that integrates Babylon.js for immersive 3D/VR experiences with a research document management backend. The application features an in-world 3D chat interface for interacting with a research agent, VR/WebXR support, and full backend API integration.

## 🎯 Project Purpose

- **Primary Goal:** Create an immersive 3D/VR interface for interacting with biomedical research documents
- **Target Users:** Researchers, medical professionals, VR enthusiasts
- **Key Features:**
  - 3D scene rendering with Babylon.js
  - WebXR/VR support for immersive experiences
  - In-world 3D chat panel for research queries
  - Backend API integration for document management
  - Real-time physics simulation using Havok

## 🏗️ Architecture

### Tech Stack
- **Framework:** Next.js 14.2.32 (React 18)
- **3D Engine:** Babylon.js 8.33.2
- **UI Framework:** Tailwind CSS
- **Physics:** Havok Physics Engine
- **Language:** TypeScript 5.8.3
- **HTTP Client:** Axios
- **Build Tool:** Webpack (integrated via Next.js)

### Project Structure
```
beabodocl-babylon/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   ├── lib/              # Library code
│   │   ├── api/         # Backend API client
│   │   └── ChatPanel3D.ts # 3D chat interface
│   └── scripts/          # Babylon.js scene scripts
├── public/
│   ├── assets/          # Public assets (textures, models)
│   └── scene/           # Babylon.js scene data
├── assets/              # Source assets
└── specs/               # Project documentation (this folder)
```

## 📚 Documentation Index

1. [Architecture Overview](./ARCHITECTURE.md) - System design and component relationships
2. [API Integration](./API_INTEGRATION.md) - Backend API documentation and usage
3. [3D Scene Guide](./3D_SCENE.md) - Babylon.js scene structure and features
4. [Component Reference](./COMPONENTS.md) - React component documentation
5. [Development Guide](./DEVELOPMENT.md) - Setup, running, and debugging
6. [Deployment Guide](./DEPLOYMENT.md) - Production deployment instructions
7. [Known Issues](./KNOWN_ISSUES.md) - Current bugs and limitations
8. [Roadmap](./ROADMAP.md) - Future features and improvements

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Access the application at `http://localhost:3000`

## 🔗 Related Systems

- **Backend API:** Running at `http://192.168.1.200:8000` (configured for VR headset access)
- **Babylon.js Editor:** Project file `project.bjseditor`

## 👥 Handoff Checklist

- [ ] Review all documentation files in `specs/`
- [ ] Verify environment variables are configured
- [ ] Test API connectivity with backend
- [ ] Verify VR/WebXR functionality
- [ ] Check all npm dependencies are installed
- [ ] Review known issues and roadmap

## 📞 Support

For questions or issues:
1. Check the [Known Issues](./KNOWN_ISSUES.md) document
2. Review the [Development Guide](./DEVELOPMENT.md)
3. Contact the development team

---

**Note:** This documentation is intended for developers taking over or maintaining this project. Please keep it updated as the project evolves.
