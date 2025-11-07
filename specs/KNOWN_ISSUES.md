# Known Issues & Limitations

## Current Issues

### 1. Agent API Not Implemented

**Status:** 🔴 Not Implemented

**Description:**
The ChatPanel3D component currently simulates agent responses. The actual backend API endpoint `/api/v1/agent/chat` needs to be integrated.

**Location:** `src/lib/ChatPanel3D.ts:169`

**Current Code:**
```typescript
// TODO: Replace with actual API call to /api/v1/agent/chat
setTimeout(() => {
  this.addMessage("Agent", `I received your question: "${message}". The API integration is coming soon!`, "rgba(100, 50, 200, 0.3)");
}, 800);
```

**Impact:**
- Chat panel is visual only
- No actual research queries processed
- Limited functionality demo

**Resolution:**
1. Implement agent API endpoint on backend
2. Update sendMessage() method in ChatPanel3D
3. Add loading state during agent thinking
4. Handle API errors gracefully

**Workaround:** None - core feature missing

---

### 2. Texture Loading Fallback

**Status:** 🟡 Has Workaround

**Description:**
The box texture (`/assets/amiga.jpg`) may fail to load, falling back to solid color.

**Location:** `src/app/page.tsx:92`

**Code:**
```typescript
try {
  boxMaterial.diffuseTexture = new Texture("/assets/amiga.jpg", scene);
} catch (error) {
  console.warn("Failed to load texture, using solid color:", error);
  boxMaterial.diffuseColor = new Color3(0.8, 0.4, 0.2);
}
```

**Impact:**
- Box may appear solid orange instead of textured
- Visual inconsistency

**Cause:**
- Texture file may not exist in public directory
- Incorrect file path
- CORS issues with texture loading

**Resolution:**
- Verify texture exists at `/public/assets/amiga.jpg`
- Or remove texture code if not needed
- Or provide correct texture file

---

### 3. React Strict Mode Disabled

**Status:** 🟡 Intentional Decision

**Description:**
React Strict Mode is disabled to prevent double-mounting of the 3D scene.

**Location:** `next.config.js:2`

**Code:**
```javascript
reactStrictMode: false,
```

**Impact:**
- Misses some React development checks
- Potential bugs not caught in development
- Scene properly initializes without double-mounting

**Reason:**
Babylon.js engine shouldn't be initialized twice. Strict Mode in React 18 intentionally double-mounts components in development to help find bugs related to missing cleanup.

**Alternatives:**
- Keep disabled (current approach)
- Use ref check to prevent double initialization
- Implement proper cleanup (already done)

---

### 4. No Authentication/Authorization

**Status:** 🔴 Not Implemented

**Description:**
The application has no user authentication or API authorization.

**Impact:**
- Anyone can access the application
- No user-specific data
- No access control
- Security risk in production

**Resolution Plan:**
1. Implement JWT authentication on backend
2. Add login page to frontend
3. Store tokens securely
4. Add auth headers to API calls
5. Implement token refresh logic

**Temporary Mitigation:**
- Deploy behind VPN
- Use network-level security
- Don't expose publicly

---

### 5. API URL Hardcoded for VR

**Status:** 🟡 Environment-Specific

**Description:**
The API URL defaults to a local network IP for VR headset access.

**Location:** 
- `src/lib/api/client.ts:11`
- `.env.local`

**Code:**
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.1.200:8000';
```

**Impact:**
- Won't work on different networks
- Hardcoded IP is fragile
- Needs manual configuration

**Resolution:**
- Always use environment variables
- Document network setup
- Consider mDNS/service discovery

---

### 6. No Error Boundaries

**Status:** 🟡 Missing Error Handling

**Description:**
React Error Boundaries are not implemented to catch component errors.

**Impact:**
- Entire app crashes on component error
- Poor user experience
- No graceful degradation

**Example Implementation:**
```typescript
// Create ErrorBoundary component
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.error('Error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
```

**Resolution:**
Wrap components in Error Boundaries, especially:
- 3D scene initialization
- API calls
- Dynamic imports

---

### 7. No Loading States for Scene Initialization

**Status:** 🟡 UX Issue

**Description:**
No loading indicator while Babylon.js scene initializes.

**Impact:**
- Blank screen during load (2-5 seconds)
- Users may think app is broken
- No feedback on progress

**Resolution:**
```typescript
const [sceneReady, setSceneReady] = useState(false);

// In handleLoad after scene setup:
setSceneReady(true);

// In render:
{!sceneReady && <LoadingScreen />}
```

---

### 8. No Offline Support

**Status:** 🔴 Not Implemented

**Description:**
Application requires network connection to function.

**Impact:**
- No offline usage
- API failures break functionality
- No cached data

**Potential Solutions:**
- Service Worker for offline caching
- IndexedDB for document storage
- Progressive Web App features
- Graceful degradation

---

### 9. Memory Leaks Possible

**Status:** 🟡 Potential Issue

**Description:**
Complex 3D scenes may leak memory if not properly disposed.

**Location:** Scene cleanup in `src/app/page.tsx`

**Current Cleanup:**
```typescript
return () => {
  scene.dispose();
  engine.dispose();
  window.removeEventListener("resize", listener);
};
```

**Potential Issues:**
- ChatPanel3D not always disposed
- Event listeners may persist
- Texture references retained

**Testing:**
- Monitor memory in DevTools
- Test navigation away and back
- Long-running sessions

**Resolution:**
- Ensure all meshes disposed
- Clear all observables
- Dispose textures explicitly

---

### 10. WebXR Controller Button Mapping

**Status:** 🟡 Limited Testing

**Description:**
VR controller button mappings may not work on all headsets.

**Impact:**
- Some controllers may not interact properly
- Button layouts vary by device
- May need device-specific handling

**Tested On:**
- Meta Quest 2/3 (✅ Works)
- Other headsets (❓ Unknown)

**Resolution:**
- Test on multiple VR devices
- Add controller detection
- Implement fallback controls
- Document supported devices

---

## Performance Limitations

### 1. No Scene Optimization

**Description:**
The current scene is simple but not optimized for complex scenarios.

**Missing Optimizations:**
- No LOD (Level of Detail)
- No occlusion culling
- No frustum culling configuration
- No mesh merging
- No instancing for repeated objects

**Impact:**
- Performance will degrade with more objects
- VR frame rate may suffer

**When to Address:**
- Before adding many objects (>100 meshes)
- Before complex scenes
- When FPS drops below 72 (VR) or 60 (desktop)

---

### 2. Bundle Size

**Current Size:**
- ~500KB gzipped (estimated)
- Babylon.js core: ~300KB
- Full app with dependencies: ~2MB uncompressed

**Considerations:**
- Slow load on mobile networks
- VR headset bandwidth limitations
- Could use code splitting

**Optimization Options:**
- Dynamic imports for Babylon modules
- Tree-shaking (already enabled)
- Reduce dependency count

---

### 3. GUI Texture Resolution

**Description:**
ChatPanel3D uses 2048x1536 texture for VR readability.

**Impact:**
- Higher memory usage (~12MB for texture)
- More GPU memory required
- May impact low-end devices

**Trade-off:**
- High resolution needed for VR text readability
- Desktop could use lower resolution
- Consider device detection

---

## Browser Compatibility

### Fully Supported

- ✅ Chrome 90+ (Desktop)
- ✅ Edge 90+ (Desktop)
- ✅ Firefox 88+ (Desktop)
- ✅ Safari 14.1+ (Desktop, limited WebXR)
- ✅ Meta Quest Browser
- ✅ Chrome/Edge Mobile (Android)

### Partial Support

- ⚠️ Safari iOS - No WebXR support
- ⚠️ Firefox Mobile - Limited WebXR
- ⚠️ Older browsers - May lack features

### Not Supported

- ❌ Internet Explorer
- ❌ Chrome < 80
- ❌ Browsers without WebGL 2

---

## VR/WebXR Limitations

### 1. WebXR Browser Requirements

**Issue:** Not all browsers support WebXR

**Supported:**
- Meta Quest Browser (native)
- Chrome with flags (desktop)
- Edge with flags (desktop)

**Not Supported:**
- Safari (any platform)
- Firefox (limited)
- Most mobile browsers

---

### 2. Performance in VR

**Issue:** VR requires consistent 72-90 FPS

**Current Performance:**
- Simple scene: ✅ 90 FPS on Quest 2
- With complex scene: ❓ Unknown

**Recommendations:**
- Test on target devices
- Profile regularly
- Optimize early

---

### 3. Hand Tracking

**Status:** Partial support

**Description:**
Hand tracking APIs used but not fully tested.

**Impact:**
- May work on Quest 2/3
- Interaction model not designed for hands
- Needs specific gestures

---

## Security Concerns

### 1. XSS Vulnerabilities

**Risk:** User input in chat not sanitized

**Location:** ChatPanel3D message display

**Impact:** 
- Potential script injection
- No current mitigation

**Resolution:**
```typescript
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(userInput);
```

---

### 2. API Exposure

**Risk:** API endpoints accessible without auth

**Impact:**
- Anyone can query documents
- No rate limiting
- Potential abuse

**Mitigation:**
- Add authentication
- Implement rate limiting on backend
- Use API keys

---

### 3. CORS Configuration

**Issue:** CORS must be properly configured on backend

**Current State:**
- Assumed configured
- Not verified in frontend

**Impact:**
- May block legitimate requests
- Security if too permissive

---

## Dependency Issues

### 1. Babylon.js Version Lock

**Current:** 8.33.2

**Issue:**
- Updates may break compatibility
- Editor version must match
- Manual updates needed

**Resolution:**
- Test updates thoroughly
- Check editor compatibility
- Review changelog

---

### 2. Next.js 14 App Router

**Status:** Stable but evolving

**Considerations:**
- API changes in updates
- Migration path unclear for future versions
- Some features still stabilizing

---

### 3. Havok Physics

**Issue:** Binary WASM dependency

**Considerations:**
- Large file size (~1MB)
- Must be loaded from CDN or local
- Version must match Babylon.js

---

## Documentation Gaps

### Missing Documentation

- [ ] VR setup guide for developers
- [ ] API endpoint complete reference (backend)
- [ ] Babylon.js Editor workflow
- [ ] Testing procedures
- [ ] Code style guide

### Incomplete Documentation

- ⚠️ Component prop types (some missing)
- ⚠️ Error codes and meanings
- ⚠️ Performance benchmarks
- ⚠️ Browser compatibility matrix

---

## Future Breaking Changes

### Next.js 15

**Expected:** 2024-2025

**Potential Issues:**
- App Router changes
- Breaking API changes
- New features we should adopt

**Action:** Monitor Next.js releases

---

### Babylon.js 9.x

**Expected:** Future release

**Potential Issues:**
- API changes
- Physics engine updates
- Editor compatibility

**Action:** Review migration guide when released

---

## Workarounds & Quick Fixes

### No Agent API
```typescript
// Temporary: Return static responses
const mockResponses = [
  "That's an interesting question about research.",
  "Let me look into the latest papers on that topic.",
  "Based on recent studies, ...",
];
```

### Scene Loading Time
```typescript
// Show loading overlay
const LoadingOverlay = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
    <div className="text-white text-xl">Loading 3D Scene...</div>
  </div>
);
```

### API Connection Failed
```typescript
// Fallback to demo mode
if (!apiHealthy) {
  showDemoMessage("Running in demo mode - backend unavailable");
}
```

---

## Reporting New Issues

**To report a new issue:**

1. Check this document first
2. Search GitHub issues (if applicable)
3. Document the issue:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details
   - Screenshots/videos if applicable

4. Add to this document under appropriate section
5. Create tracking ticket (if using issue tracker)

---

## Issue Priority Guide

**🔴 Critical (P0):**
- Blocks core functionality
- Security vulnerabilities
- Data loss possible
- Production outage

**🟡 Important (P1):**
- Impacts user experience
- Performance issues
- Missing features
- Should fix soon

**🟢 Minor (P2):**
- Nice to have
- Cosmetic issues
- Documentation gaps
- Can defer

---

## Next Steps

### Immediate Priorities

1. Implement agent API integration
2. Add loading states
3. Improve error handling
4. Add authentication

### Medium Term

1. Optimize performance
2. Improve VR experience
3. Add offline support
4. Complete documentation

### Long Term

1. Advanced features
2. Multi-user support
3. Mobile optimization
4. Comprehensive testing suite
