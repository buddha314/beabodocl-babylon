# Quick Reference Guide

**One-page reference for common tasks and information**

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
# Create .env.local with:
NEXT_PUBLIC_API_URL=http://192.168.1.200:8000

# 3. Start development server
npm run dev

# 4. Open browser
# http://localhost:3000
```

---

## 📁 Project Structure

```
src/
├── app/              # Next.js pages
│   ├── layout.tsx   # Root layout
│   └── page.tsx     # Main page (3D scene)
├── components/       # React components
│   └── ApiTest.tsx  # API test overlay
├── lib/
│   ├── api/         # API client
│   └── ChatPanel3D.ts # 3D chat UI
└── scripts/         # Babylon.js scripts
```

---

## 🛠️ Common Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run linter

# Dependencies
npm install          # Install all
npm update           # Update all
npm audit            # Check vulnerabilities
npm outdated         # Check outdated packages
```

---

## 🔌 API Endpoints

**Base URL:** `http://192.168.1.200:8000/api/v1`

### Health Check
```typescript
GET /health  // Returns { status: "healthy" }
```

### Documents
```typescript
GET    /documents              // List documents
GET    /documents/{id}         // Get document
GET    /documents/{id}/content // Get full text
POST   /documents/search       // Search documents
POST   /documents              // Upload document
DELETE /documents/{id}         // Delete document
```

### Stats
```typescript
GET /stats      // System statistics
GET /stats/all  // All statistics
```

---

## 📦 Key Dependencies

```json
{
  "@babylonjs/core": "8.33.2",     // 3D engine
  "@babylonjs/gui": "8.33.2",      // 3D UI
  "@babylonjs/havok": "1.3.10",    // Physics
  "next": "14.2.32",               // Framework
  "react": "^18",                  // UI library
  "axios": "^1.13.2",              // HTTP client
  "typescript": "5.8.3"            // Language
}
```

---

## 🎮 3D Scene Objects

### Camera
```typescript
ArcRotateCamera
- Position: 10 units from (0, 1, 0)
- Controls: Mouse drag to rotate, scroll to zoom
```

### Lighting
```typescript
HemisphericLight
- Direction: (0, 1, 0) - from above
- Intensity: 0.7
```

### Objects
```typescript
- Ground: 10x10 units, dark blue-gray
- Box: 2x2x2 units, rotating, textured
- ChatPanel: 4x3 units, 3D GUI interface
```

### Physics
```typescript
Havok Plugin
- Gravity: (0, -981, 0)
- WebAssembly-based
```

---

## 🎯 Component Quick Reference

### Home (page.tsx)
- Main page with 3D scene
- Client component
- Manages engine and scene lifecycle

### ApiTest
- API connectivity test
- Shows stats and documents
- Fixed top-right position

### ChatPanel3D
```typescript
new ChatPanel3D(scene, position)

Methods:
- addMessage(sender, text, bgColor)
- setPosition(position)
- lookAt(target)
- dispose()
```

---

## 🔧 Configuration Files

### .env.local
```bash
NEXT_PUBLIC_API_URL=http://192.168.1.200:8000
```

### next.config.js
```javascript
reactStrictMode: false  // For Babylon.js
webpack: raw-loader for .fx files
```

### tsconfig.json
```json
experimentalDecorators: true
paths: { "@/*": ["./src/*"] }
```

---

## 🐛 Common Issues

### Port in Use
```powershell
# Windows PowerShell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### API Not Connecting
```bash
# Check backend is running
curl http://192.168.1.200:8000/health

# Verify .env.local
cat .env.local
```

### Scene Not Loading
- Check console for errors
- Verify canvas ref is attached
- Ensure WebGL is supported

### VR Not Working
- Enable WebXR in browser
- Use HTTPS
- Check floor meshes defined

---

## 📊 File Sizes (Approximate)

```
Uncompressed:
- Total bundle: ~2MB
- Babylon.js: ~1MB
- Havok: ~1MB
- React/Next: ~500KB

Gzipped:
- Total: ~500KB
- Babylon.js: ~300KB
```

---

## 🎯 Performance Targets

```
Desktop:
- Load time: < 3s
- FPS: 60+

VR:
- Load time: < 5s
- FPS: 72-90
- Latency: < 20ms
```

---

## 🔐 Environment Variables

```bash
# Development
NEXT_PUBLIC_API_URL=http://localhost:8000

# VR Development (same network)
NEXT_PUBLIC_API_URL=http://192.168.1.200:8000

# Production
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

---

## 🧪 Testing Commands

```bash
# Manual testing
npm run dev
# Open http://localhost:3000
# Test features manually

# Type checking
npx tsc --noEmit

# Linting
npm run lint

# Build test
npm run build
npm start
```

---

## 📱 Browser Support

```
✅ Chrome 90+
✅ Edge 90+
✅ Firefox 88+
✅ Safari 14.1+
✅ Meta Quest Browser
⚠️ Safari iOS (no WebXR)
❌ Internet Explorer
```

---

## 🗺️ VR Controls

```
Desktop:
- Mouse drag: Rotate camera
- Scroll wheel: Zoom
- Click GUI: Interact

VR:
- Controller pointer: Aim
- Trigger: Select/Click
- Thumbstick: Teleport
- Grip: (not assigned)
```

---

## 📝 Code Snippets

### Adding API Call
```typescript
import { documentsApi } from '@/lib/api';

const docs = await documentsApi.list({ page: 1 });
```

### Adding 3D Object
```typescript
const sphere = MeshBuilder.CreateSphere("sphere", 
  { diameter: 2 }, scene);
sphere.position = new Vector3(5, 1, 0);
```

### Adding Message to Chat
```typescript
chatPanel.addMessage("Agent", "Hello!", 
  "rgba(100, 50, 200, 0.3)");
```

---

## 🔗 Important URLs

```
Local Dev:     http://localhost:3000
VR Access:     http://YOUR_IP:3000
Backend API:   http://192.168.1.200:8000
API Health:    http://192.168.1.200:8000/health
API Docs:      http://192.168.1.200:8000/docs
```

---

## 📚 Documentation Files

```
specs/
├── INDEX.md               ← Navigation guide
├── README.md              ← Start here
├── DEVELOPMENT.md         ← Setup guide
├── ARCHITECTURE.md        ← System design
├── COMPONENTS.md          ← Component docs
├── API_INTEGRATION.md     ← API guide
├── 3D_SCENE.md           ← Babylon.js guide
├── DEPLOYMENT.md          ← Deploy guide
├── KNOWN_ISSUES.md        ← Current issues
├── ROADMAP.md             ← Future plans
├── HANDOFF_CHECKLIST.md   ← Handoff guide
└── QUICK_REFERENCE.md     ← This file
```

---

## 🎯 Next Priorities (from ROADMAP.md)

1. **Agent API Integration** (🔴 Critical)
   - Connect chat to backend
   - Real AI responses

2. **Loading States** (🟡 Important)
   - Scene loading indicator
   - API loading states

3. **Authentication** (🟡 Important)
   - User login
   - Secure API access

4. **Error Boundaries** (🟡 Important)
   - Catch React errors
   - Graceful degradation

---

## 🚨 Known Critical Issues

```
1. Agent API not implemented (chat is simulation)
2. No authentication (open to all)
3. React Strict Mode disabled (for 3D scene)
4. No error boundaries (app crashes on error)
5. Memory leaks possible (needs monitoring)
```

See `KNOWN_ISSUES.md` for complete list.

---

## 💡 Quick Tips

### Development
- Always check console for errors
- Use React DevTools for debugging
- Monitor Network tab for API calls
- Test in VR headset regularly

### Performance
- Keep mesh count low
- Use simple materials
- Optimize textures
- Profile with DevTools

### VR
- Test on actual hardware
- Maintain 72+ FPS
- Use large fonts (24px+)
- High contrast colors

---

## 📞 Getting Help

1. **Check docs first** → `specs/INDEX.md`
2. **Check known issues** → `specs/KNOWN_ISSUES.md`
3. **Search console errors** → Browser DevTools
4. **External resources:**
   - Babylon.js: https://forum.babylonjs.com/
   - Next.js: https://nextjs.org/docs

---

## ✅ Pre-Commit Checklist

```
Before committing code:
- [ ] Code runs without errors
- [ ] Linter passes (npm run lint)
- [ ] Types check (npx tsc --noEmit)
- [ ] Documentation updated
- [ ] No console.logs left
- [ ] Tested manually
```

---

## 🎓 Learning Path

```
Day 1: Setup + Run
Day 2-3: Understand structure
Week 1: Small changes
Week 2: Add features
Week 3: VR testing
Week 4: Production ready
```

---

**Last Updated:** November 7, 2025  
**Version:** 1.0  
**For full details, see complete documentation in `specs/` folder**

---

[Full Documentation Index](./INDEX.md) | [Handoff Checklist](./HANDOFF_CHECKLIST.md)
