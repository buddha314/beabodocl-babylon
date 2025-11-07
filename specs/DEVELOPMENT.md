# Development Guide

## Prerequisites

### Required Software

1. **Node.js** (v18 or higher recommended)
   - Download: https://nodejs.org/
   - Verify: `node --version`
   - Check npm: `npm --version`

2. **npm** (comes with Node.js)
   - Version 9.0+ recommended
   - Alternative: yarn, pnpm

3. **Git** (for version control)
   - Download: https://git-scm.com/
   - Verify: `git --version`

4. **Code Editor**
   - VS Code (recommended)
   - WebStorm
   - Any editor with TypeScript support

### Recommended VS Code Extensions

- **ESLint** - JavaScript/TypeScript linting
- **Tailwind CSS IntelliSense** - Tailwind class autocomplete
- **TypeScript Error Translator** - Better TS error messages
- **Babylon.js Editor** - Scene editing support
- **Prettier** - Code formatting (optional)

## Initial Setup

### 1. Clone Repository

```bash
# If using git
git clone <repository-url>
cd beabodocl-babylon

# Or if receiving handoff
cd c:\Users\b\src\beabodocl-babylon
```

### 2. Install Dependencies

```bash
npm install
```

This installs:
- Next.js framework
- Babylon.js engine and modules
- React and React DOM
- Tailwind CSS
- TypeScript
- All dev dependencies

**Installation Time:** ~2-5 minutes depending on network speed

### 3. Environment Configuration

Create `.env.local` file in project root:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**For VR Development:**
```bash
# Use your local network IP
NEXT_PUBLIC_API_URL=http://192.168.1.200:8000
```

**Find Your IP:**
```powershell
# Windows PowerShell
ipconfig

# Look for "IPv4 Address" under your active network adapter
```

### 4. Start Backend Server (Required)

The frontend needs a running backend API server:

```bash
# Navigate to backend directory (separate repo)
cd ../babocument-backend

# Start the server
python main.py
# or
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Verify backend is running:
- Open http://localhost:8000/health
- Should see: `{"status": "healthy"}`

## Development Workflow

### Starting Development Server

```bash
npm run dev
```

**Output:**
```
> babylonjs-editor-nextjs-template@0.1.0 dev
> next dev

- ready started server on 0.0.0.0:3000, url: http://localhost:3000
- event compiled client and server successfully in 2.5s
```

**Access Application:**
- Desktop: http://localhost:3000
- Same machine: http://127.0.0.1:3000
- Network: http://YOUR_IP:3000
- VR Headset: http://YOUR_IP:3000 (same network)

### Hot Reload

The development server supports hot reload:
- **React changes:** Instant refresh
- **TypeScript changes:** Automatic recompile
- **CSS changes:** Live update
- **API changes:** Manual refresh needed

**Important:** Babylon.js scene changes require full page reload.

### Development Server Features

- **Fast Refresh** - Preserves component state
- **Error Overlay** - Shows errors in browser
- **Source Maps** - Debug original TypeScript
- **Auto Compile** - Watches for file changes

## Project Structure Deep Dive

```
beabodocl-babylon/
├── .next/                    # Build output (generated)
├── node_modules/             # Dependencies (generated)
├── public/                   # Static files
│   ├── assets/              # Public assets
│   └── scene/               # Babylon.js scene data
├── src/                     # Source code
│   ├── app/                 # Next.js App Router
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page (main scene)
│   ├── components/          # React components
│   │   └── ApiTest.tsx     # API test overlay
│   ├── lib/                 # Library code
│   │   ├── api/            # API client
│   │   │   ├── client.ts   # Base API client
│   │   │   ├── documents.ts # Document API
│   │   │   ├── stats.ts    # Stats API
│   │   │   ├── types.ts    # TypeScript types
│   │   │   └── index.ts    # Exports
│   │   └── ChatPanel3D.ts  # 3D chat interface
│   ├── scripts/             # Babylon.js scripts
│   │   └── box.ts          # Box rotation script
│   └── scripts.ts           # Script exports
├── specs/                   # Documentation (this folder)
├── .env.local              # Environment variables (create this)
├── next.config.js          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.ts      # Tailwind configuration
├── postcss.config.js       # PostCSS configuration
├── package.json            # Dependencies
└── README.md               # Project readme
```

## Common Development Tasks

### Adding a New Component

```bash
# Create component file
# src/components/MyComponent.tsx
```

```typescript
'use client';

import { useState } from 'react';

export default function MyComponent() {
  const [state, setState] = useState('');

  return (
    <div className="p-4">
      <h2>My Component</h2>
    </div>
  );
}
```

Import and use:
```typescript
// src/app/page.tsx
import MyComponent from '@/components/MyComponent';

// In component
<MyComponent />
```

### Adding a New 3D Object

```typescript
// In src/app/page.tsx, inside handleLoad function

import { MeshBuilder } from "@babylonjs/core";

const sphere = MeshBuilder.CreateSphere("sphere", { 
  diameter: 2 
}, scene);

sphere.position = new Vector3(5, 1, 0);

const material = new StandardMaterial("sphereMat", scene);
material.diffuseColor = new Color3(1, 0, 0); // Red
sphere.material = material;
```

### Adding a New API Endpoint

```typescript
// src/lib/api/myEndpoint.ts

import apiClient from './client';
import type { MyType } from './types';

export const myApi = {
  async getData(): Promise<MyType> {
    const response = await apiClient.get<MyType>('/my-endpoint');
    return response.data;
  },
};
```

Export:
```typescript
// src/lib/api/index.ts
export { myApi } from './myEndpoint';
```

### Adding New TypeScript Types

```typescript
// src/lib/api/types.ts

export interface MyType {
  id: string;
  name: string;
  data: any;
}
```

### Modifying Tailwind Config

```typescript
// tailwind.config.ts

const config: Config = {
  theme: {
    extend: {
      colors: {
        'custom-blue': '#1e40af',
      },
    },
  },
}
```

Use in components:
```tsx
<div className="bg-custom-blue">...</div>
```

## Debugging

### Browser DevTools

**Open DevTools:**
- Chrome/Edge: F12 or Ctrl+Shift+I
- Firefox: F12 or Ctrl+Shift+K

**Console Tab:**
- View API request logs: `[API] GET /api/v1/stats`
- See error messages
- Check FPS: `engine.getFps()`

**Network Tab:**
- Monitor API requests
- Check request/response data
- Verify CORS headers
- Check status codes

**Performance Tab:**
- Profile render performance
- Find bottlenecks
- Monitor memory usage

### VS Code Debugging

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}"
    }
  ]
}
```

**Usage:**
1. Set breakpoints in VS Code
2. Press F5 to start debugging
3. Chrome opens with debugger attached

### Common Issues

#### Port Already in Use

```bash
# Error: Port 3000 is already in use

# Solution: Kill the process
# Windows PowerShell:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port:
npm run dev -- -p 3001
```

#### Module Not Found

```bash
# Error: Cannot find module '@/...'

# Solution: Rebuild
rm -rf .next
npm run dev
```

#### TypeScript Errors

```bash
# Check errors
npm run lint

# Sometimes fixed by:
rm -rf node_modules package-lock.json
npm install
```

#### WebGL Not Available

- Update graphics drivers
- Enable hardware acceleration in browser
- Try different browser
- Check GPU compatibility

#### API Connection Failed

```bash
# Check backend is running
curl http://localhost:8000/health

# Check .env.local is correct
cat .env.local

# Verify network connectivity (VR)
ping 192.168.1.200
```

## Testing

### Manual Testing Checklist

**Basic Functionality:**
- [ ] Page loads without errors
- [ ] 3D scene renders
- [ ] Camera controls work (mouse/touch)
- [ ] Box rotates smoothly
- [ ] Chat panel visible and readable
- [ ] ApiTest shows connection status

**API Integration:**
- [ ] Health check succeeds
- [ ] Stats display correctly
- [ ] Documents load
- [ ] Error handling works (stop backend)

**VR Testing:**
- [ ] WebXR initializes
- [ ] Enter VR mode works
- [ ] Controllers visible
- [ ] Pointer selection works
- [ ] Chat panel readable in VR
- [ ] Performance acceptable

### Automated Testing (Not Implemented)

**Recommended Setup:**

```bash
# Install testing libraries
npm install --save-dev @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom

# Run tests
npm test
```

**Test Examples:**

```typescript
// __tests__/ApiTest.test.tsx
import { render, screen } from '@testing-library/react';
import ApiTest from '@/components/ApiTest';

test('renders API test component', () => {
  render(<ApiTest />);
  expect(screen.getByText('Backend API Test')).toBeInTheDocument();
});
```

## Performance Optimization

### Development Mode

Development builds are slower:
- No minification
- Full source maps
- Extra dev tools
- React strict mode checks

**Measuring Real Performance:**
```bash
npm run build
npm start
```

### Profiling 3D Performance

```typescript
// Add to render loop
scene.onBeforeRenderObservable.add(() => {
  console.log('Draw calls:', scene.getEngine().drawCalls);
  console.log('Active meshes:', scene.getActiveMeshes().length);
});
```

### Optimizing Bundle Size

```bash
# Analyze bundle
npm install --save-dev @next/bundle-analyzer

# In next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);

# Run analysis
ANALYZE=true npm run build
```

## Code Quality

### Linting

```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

### Type Checking

```bash
# Check types without building
npx tsc --noEmit
```

### Code Formatting (Prettier)

```bash
# Install Prettier
npm install --save-dev prettier

# Create .prettierrc
echo '{"semi": true, "singleQuote": true}' > .prettierrc

# Format all files
npx prettier --write .
```

## Environment-Specific Config

### Development

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_ENV=development
```

### Staging

```bash
# .env.production
NEXT_PUBLIC_API_URL=https://api-staging.example.com
NEXT_PUBLIC_ENV=staging
```

### Production

```bash
# .env.production
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_ENV=production
```

## Version Control

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes
git add .
git commit -m "Add my feature"

# Push to remote
git push origin feature/my-feature

# Create pull request on GitHub
```

### .gitignore

Important ignored files:
```
node_modules/
.next/
.env.local
.vscode/
*.log
```

## Collaboration

### Code Reviews

**Checklist:**
- [ ] Code follows TypeScript best practices
- [ ] No console.logs in production code
- [ ] Components properly typed
- [ ] Error handling included
- [ ] Performance considered
- [ ] Documentation updated

### Communication

- Document major changes
- Update specs/ folder
- Comment complex logic
- Use meaningful commit messages

## Useful Commands Reference

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Clean build
rm -rf .next

# Update dependencies
npm update

# Check for outdated packages
npm outdated

# Install specific version
npm install package@version
```

## Next Steps After Setup

1. **Verify everything works:**
   - Start backend server
   - Start frontend dev server
   - Open in browser
   - Check console for errors

2. **Explore the code:**
   - Read through page.tsx
   - Understand ChatPanel3D
   - Review API client

3. **Make a small change:**
   - Modify box color
   - Change chat panel position
   - Add a new mesh

4. **Test VR (if available):**
   - Connect VR headset to network
   - Access from headset browser
   - Enter VR mode

5. **Review documentation:**
   - Read all specs/ files
   - Understand architecture
   - Note known issues

## Getting Help

**Resources:**
- Babylon.js Docs: https://doc.babylonjs.com/
- Next.js Docs: https://nextjs.org/docs
- React Docs: https://react.dev/
- Tailwind Docs: https://tailwindcss.com/docs

**Troubleshooting:**
- Check console errors
- Review Network tab
- Search Babylon.js forum
- Check Next.js GitHub issues
