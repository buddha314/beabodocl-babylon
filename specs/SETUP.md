# Developer Setup Guide

**Project**: Beabodocl-Babylon  
**Last Updated**: November 7, 2025  
**Target Audience**: New developers joining the project

This guide provides comprehensive setup instructions for developers who are new to the Beabodocl-Babylon project.

## Table of Contents

1. [Overview](#overview)
2. [System Requirements](#system-requirements)
3. [Prerequisites](#prerequisites)
4. [Installation Steps](#installation-steps)
5. [Project Structure](#project-structure)
6. [Configuration](#configuration)
7. [Running the Application](#running-the-application)
8. [Development Workflow](#development-workflow)
9. [Testing](#testing)
10. [Troubleshooting](#troubleshooting)
11. [Additional Resources](#additional-resources)

---

## Overview

**Beabodocl-Babylon** is a Next.js application with Babylon.js integration for 3D/VR experiences. The application provides:

- 3D scene rendering with Babylon.js
- WebXR/VR support
- API integration for backend services
- React-based UI with Tailwind CSS
- TypeScript for type safety

### Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | JavaScript runtime |
| Next.js | 14.2.32 | React framework |
| React | 18 | UI library |
| TypeScript | 5.8.3 | Type safety |
| Babylon.js | 8.33.2 | 3D engine |
| Tailwind CSS | 3.3.0 | Styling |
| Axios | 1.13.2 | HTTP client |

---

## System Requirements

### Minimum Requirements

- **OS**: Windows 10/11, macOS 10.15+, or Linux
- **RAM**: 8GB (16GB recommended)
- **Storage**: 500MB free space
- **Browser**: Chrome 90+, Firefox 88+, Edge 90+, or Safari 14+
- **GPU**: WebGL 2.0 compatible graphics card

### Recommended for VR Development

- **RAM**: 16GB+
- **GPU**: NVIDIA GTX 1060 or equivalent
- **VR Headset**: Meta Quest 2/3, HTC Vive, or similar
- **Network**: Stable Wi-Fi for wireless VR development

---

## Prerequisites

### Required Software

#### 1. Node.js (v18 or higher)

**Windows:**
```powershell
# Download from https://nodejs.org/
# Or use Chocolatey
choco install nodejs-lts
```

**macOS:**
```bash
# Using Homebrew
brew install node@18
```

**Linux:**
```bash
# Using Node Version Manager (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

**Verify Installation:**
```bash
node --version  # Should show v18.x.x or higher
npm --version   # Should show 9.x.x or higher
```

#### 2. Git

**Windows:**
```powershell
# Download from https://git-scm.com/
# Or use Chocolatey
choco install git
```

**macOS:**
```bash
# Usually pre-installed, or use Homebrew
brew install git
```

**Linux:**
```bash
sudo apt-get install git  # Debian/Ubuntu
sudo yum install git      # RHEL/CentOS
```

**Verify Installation:**
```bash
git --version  # Should show version 2.x.x or higher
```

#### 3. Code Editor

**Recommended: Visual Studio Code**
- Download: https://code.visualstudio.com/
- Lightweight, excellent TypeScript support
- Great extension ecosystem

**Alternatives:**
- WebStorm (JetBrains)
- Sublime Text
- Atom

### Recommended VS Code Extensions

Install these extensions for the best development experience:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "julien.babylon-js-viewer",
    "usernamehw.errorlens",
    "christian-kohler.path-intellisense",
    "formulahendry.auto-rename-tag"
  ]
}
```

**To install extensions:**
1. Open VS Code
2. Press `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (macOS)
3. Search for each extension by name
4. Click "Install"

---

## Installation Steps

### 1. Clone the Repository

```bash
# Navigate to your projects directory
cd ~/projects  # macOS/Linux
cd C:\Users\YourName\projects  # Windows

# Clone the repository
git clone <repository-url> beabodocl-babylon
cd beabodocl-babylon
```

**Alternative: Download ZIP**
1. Download the project as ZIP from GitHub
2. Extract to desired location
3. Open terminal in extracted folder

### 2. Install Dependencies

```bash
npm install
```

This command installs all dependencies listed in `package.json`, including:

- **Framework**: Next.js, React
- **3D Engine**: Babylon.js core, GUI, materials, Havok physics
- **Utilities**: Axios, Babylon.js Editor tools
- **Dev Tools**: TypeScript, ESLint, Tailwind CSS

**Expected Output:**
```
added 423 packages, and audited 424 packages in 45s
```

**Installation Time**: 2-5 minutes depending on network speed

**Troubleshooting Installation:**

If you encounter permission errors on macOS/Linux:
```bash
sudo chown -R $USER ~/.npm
npm install
```

If you encounter network errors:
```bash
npm install --registry https://registry.npmjs.org/
```

### 3. Verify Installation

```bash
# Check that node_modules folder was created
ls node_modules  # macOS/Linux
dir node_modules  # Windows

# Verify key dependencies
npm list @babylonjs/core next react typescript
```

**Expected Output:**
```
beabodocl-babylon@0.1.0
├── @babylonjs/core@8.33.2
├── next@14.2.32
├── react@18.0.0
└── typescript@5.8.3
```

---

## Project Structure

Understanding the project layout is crucial for effective development.

```
beabodocl-babylon/
├── .next/                      # Next.js build output (auto-generated)
│   └── (build files)
├── node_modules/               # Installed dependencies (auto-generated)
│   └── (packages)
├── public/                     # Static assets (served as-is)
│   ├── assets/                # Public assets
│   │   └── country.env        # Environment map for reflections
│   └── scene/                 # Babylon.js scene configuration
│       ├── config.json        # Scene metadata
│       ├── cameras/           # Camera configurations
│       ├── lights/            # Light configurations
│       ├── meshes/            # Mesh data
│       ├── geometries/        # Geometry binary data
│       └── shadowGenerators/  # Shadow generator configs
├── specs/                      # Project documentation
│   ├── USER_STORIES.md        # User stories and requirements
│   ├── SETUP.md               # This file
│   ├── DEVELOPMENT.md         # Development guidelines
│   ├── ARCHITECTURE.md        # System architecture
│   ├── API_INTEGRATION.md     # API integration details
│   ├── COMPONENTS.md          # Component documentation
│   └── (other docs)
├── src/                        # Source code
│   ├── app/                   # Next.js App Router
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout component
│   │   └── page.tsx           # Home page (main scene)
│   ├── components/            # React components
│   │   └── ApiTest.tsx        # API testing overlay component
│   ├── lib/                   # Library/utility code
│   │   ├── api/              # API client modules
│   │   │   ├── client.ts     # Base Axios client
│   │   │   ├── documents.ts  # Document API endpoints
│   │   │   ├── stats.ts      # Stats API endpoints
│   │   │   ├── types.ts      # TypeScript type definitions
│   │   │   └── index.ts      # API exports
│   │   └── ChatPanel3D.ts    # 3D chat panel class
│   ├── scripts/               # Babylon.js scripts
│   │   └── box.ts            # Box rotation behavior script
│   └── scripts.ts             # Script registry exports
├── .gitignore                  # Git ignore rules
├── next.config.js              # Next.js configuration
├── next-env.d.ts               # Next.js TypeScript declarations
├── package.json                # Project metadata & dependencies
├── package-lock.json           # Locked dependency versions
├── postcss.config.js           # PostCSS configuration
├── project.bjseditor           # Babylon.js Editor project file
├── README.md                   # Project readme
├── tailwind.config.ts          # Tailwind CSS configuration
└── tsconfig.json               # TypeScript compiler configuration
```

### Key Directories

| Directory | Purpose | Modify? |
|-----------|---------|---------|
| `src/app/` | Next.js pages and layouts | ✅ Yes |
| `src/components/` | React components | ✅ Yes |
| `src/lib/` | Utilities and APIs | ✅ Yes |
| `src/scripts/` | Babylon.js scripts | ✅ Yes |
| `public/` | Static assets | ✅ Yes |
| `specs/` | Documentation | ✅ Yes |
| `.next/` | Build artifacts | ❌ No (auto-generated) |
| `node_modules/` | Dependencies | ❌ No (managed by npm) |

---

## Configuration

### Environment Variables

Create a `.env.local` file in the project root for environment-specific configuration:

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Notes:**
- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- Never commit `.env.local` to version control (it's in `.gitignore`)
- Create separate env files for different environments

**Environment Files:**
- `.env.local` - Local development (gitignored)
- `.env.development` - Development defaults
- `.env.production` - Production build
- `.env.test` - Testing environment

### Backend API Setup

The frontend requires a running backend API server. If you don't have the backend repository:

1. **Clone Backend Repository** (if separate):
   ```bash
   cd ..
   git clone <backend-repo-url> babocument-backend
   cd babocument-backend
   ```

2. **Install Backend Dependencies**:
   ```bash
   # Python backend example
   pip install -r requirements.txt
   ```

3. **Start Backend Server**:
   ```bash
   python main.py
   # or
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

4. **Verify Backend**:
   ```bash
   curl http://localhost:8000/health
   # Expected: {"status": "healthy"}
   ```

### Network Configuration (for VR Development)

To access the application from a VR headset on the same network:

1. **Find Your Local IP Address:**

   **Windows:**
   ```powershell
   ipconfig
   # Look for "IPv4 Address" under your active network adapter
   # Example: 192.168.1.100
   ```

   **macOS/Linux:**
   ```bash
   ifconfig | grep "inet "
   # or
   ip addr show
   # Example: 192.168.1.100
   ```

2. **Update Environment Variables:**
   ```bash
   # .env.local
   NEXT_PUBLIC_API_URL=http://192.168.1.100:8000
   ```

3. **Ensure Firewall Allows Connections:**
   - Allow port 3000 (Next.js dev server)
   - Allow port 8000 (backend API)

4. **Access from VR Headset:**
   ```
   http://192.168.1.100:3000
   ```

### TypeScript Configuration

The `tsconfig.json` file is pre-configured. Key settings:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Path Aliases:**
- `@/components/*` → `src/components/*`
- `@/lib/*` → `src/lib/*`
- `@/app/*` → `src/app/*`

**Usage:**
```typescript
import ApiTest from '@/components/ApiTest';
import { documentsApi } from '@/lib/api';
```

### Tailwind Configuration

Tailwind CSS is configured in `tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Custom theme extensions
    },
  },
  plugins: [],
};
```

---

## Running the Application

### Development Mode

Start the development server with hot reload:

```bash
npm run dev
```

**Expected Output:**
```
> babylonjs-editor-nextjs-template@0.1.0 dev
> next dev

- ready started server on 0.0.0.0:3000, url: http://localhost:3000
- event compiled client and server successfully in 2.5s
- wait  compiling...
- event compiled client and server successfully in 350ms
```

**Access Points:**
- **Local**: http://localhost:3000
- **Network**: http://YOUR_IP:3000
- **Loopback**: http://127.0.0.1:3000

**Development Server Features:**
- ✅ **Hot Module Replacement** - Changes reflected instantly
- ✅ **Fast Refresh** - Preserves component state
- ✅ **Error Overlay** - Shows errors in browser
- ✅ **Source Maps** - Debug original TypeScript code
- ✅ **Auto Compilation** - Watches file changes

**Note**: Some Babylon.js scene changes may require a full page reload.

### Production Build

Build an optimized production bundle:

```bash
npm run build
```

**Build Process:**
1. Compiles TypeScript to JavaScript
2. Bundles and minifies code
3. Optimizes images and assets
4. Generates static pages
5. Creates server-side rendering bundles

**Expected Output:**
```
> next build

- info Creating an optimized production build...
- info Compiled successfully
- info Collecting page data...
- info Generating static pages (3/3)
- info Finalizing page optimization...

Route (app)                              Size     First Load JS
┌ ○ /                                   5.2 kB        123 kB
└ ○ /api/hello                          0 B               0 B

○ (Static)  prerendered as static HTML
```

**Build Time**: 20-60 seconds depending on project size

### Start Production Server

After building, start the production server:

```bash
npm start
```

**Expected Output:**
```
> next start

- ready started server on 0.0.0.0:3000, url: http://localhost:3000
```

**Production vs Development:**
- ✅ Faster performance
- ✅ Minified code
- ✅ No source maps (by default)
- ❌ No hot reload
- ❌ No error overlay

### Custom Port

Run on a different port:

```bash
npm run dev -- -p 3001
# or
PORT=3001 npm run dev  # macOS/Linux
```

### Linting

Check code quality:

```bash
npm run lint
```

Fix auto-fixable issues:

```bash
npm run lint -- --fix
```

---

## Development Workflow

### Daily Workflow

1. **Pull Latest Changes:**
   ```bash
   git pull origin main
   ```

2. **Install Updated Dependencies:**
   ```bash
   npm install
   ```

3. **Start Backend Server** (in separate terminal):
   ```bash
   cd ../babocument-backend
   python main.py
   ```

4. **Start Frontend Dev Server:**
   ```bash
   npm run dev
   ```

5. **Make Changes:**
   - Edit files in `src/`
   - Save to see hot reload
   - Check browser console for errors

6. **Test Changes:**
   - Verify in browser
   - Check different screen sizes
   - Test VR mode (if applicable)

7. **Commit Changes:**
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin feature-branch
   ```

### Creating a Feature Branch

```bash
# Create and switch to new branch
git checkout -b feature/my-feature-name

# Make changes and commit
git add .
git commit -m "Implement my feature"

# Push to remote
git push origin feature/my-feature-name

# Create Pull Request on GitHub
```

### Adding a New Component

1. **Create Component File:**
   ```bash
   # src/components/MyComponent.tsx
   ```

2. **Component Template:**
   ```typescript
   'use client';
   
   import { useState } from 'react';
   
   interface MyComponentProps {
     title: string;
     onAction?: () => void;
   }
   
   export default function MyComponent({ title, onAction }: MyComponentProps) {
     const [count, setCount] = useState(0);
   
     return (
       <div className="p-4 bg-white rounded shadow">
         <h2 className="text-xl font-bold">{title}</h2>
         <p>Count: {count}</p>
         <button 
           onClick={() => setCount(count + 1)}
           className="px-4 py-2 bg-blue-500 text-white rounded"
         >
           Increment
         </button>
       </div>
     );
   }
   ```

3. **Import and Use:**
   ```typescript
   import MyComponent from '@/components/MyComponent';
   
   <MyComponent title="My Title" />
   ```

### Adding a 3D Object

In `src/app/page.tsx`, inside the `handleLoad` function:

```typescript
import { MeshBuilder, StandardMaterial, Color3, Vector3 } from "@babylonjs/core";

// Create a sphere
const sphere = MeshBuilder.CreateSphere("sphere", { 
  diameter: 2,
  segments: 32 
}, scene);

sphere.position = new Vector3(5, 1, 0);

// Create material
const material = new StandardMaterial("sphereMat", scene);
material.diffuseColor = new Color3(1, 0, 0); // Red
material.specularColor = new Color3(0.5, 0.5, 0.5);
sphere.material = material;
```

### Adding an API Endpoint

1. **Create API Module:**
   ```typescript
   // src/lib/api/myEndpoint.ts
   import apiClient from './client';
   import type { MyDataType } from './types';
   
   export const myApi = {
     async getData(id: string): Promise<MyDataType> {
       const response = await apiClient.get<MyDataType>(`/my-endpoint/${id}`);
       return response.data;
     },
     
     async postData(data: MyDataType): Promise<void> {
       await apiClient.post('/my-endpoint', data);
     },
   };
   ```

2. **Add Type Definitions:**
   ```typescript
   // src/lib/api/types.ts
   export interface MyDataType {
     id: string;
     name: string;
     value: number;
   }
   ```

3. **Export from Index:**
   ```typescript
   // src/lib/api/index.ts
   export { myApi } from './myEndpoint';
   ```

4. **Use in Component:**
   ```typescript
   import { myApi } from '@/lib/api';
   
   const data = await myApi.getData('123');
   ```

---

## Testing

### Manual Testing

1. **Visual Inspection:**
   - Load http://localhost:3000
   - Verify 3D scene renders
   - Check console for errors
   - Test camera controls (mouse drag, scroll)

2. **API Testing:**
   - Open browser DevTools (F12)
   - Check Network tab for API calls
   - Verify responses in Console
   - Test error handling (stop backend)

3. **VR Testing:**
   - Connect VR headset to same network
   - Navigate to http://YOUR_IP:3000
   - Click "Enter VR" button
   - Verify controllers work
   - Test performance (>60 FPS)

### Automated Testing (Future)

The project is set up for future test implementation:

```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom jest

# Run tests (when implemented)
npm test
```

### Performance Testing

Monitor 3D performance:

```typescript
// Add to render loop in page.tsx
scene.onBeforeRenderObservable.add(() => {
  const fps = engine.getFps().toFixed();
  const drawCalls = scene.getEngine().drawCalls;
  console.log(`FPS: ${fps} | Draw Calls: ${drawCalls}`);
});
```

**Performance Targets:**
- Desktop: 60+ FPS
- VR: 72-90 FPS (headset-dependent)
- Draw calls: < 100 for optimal performance

---

## Troubleshooting

### Common Issues

#### Port Already in Use

**Problem:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**

**Windows:**
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace <PID> with actual PID)
taskkill /PID <PID> /F

# Or use different port
npm run dev -- -p 3001
```

**macOS/Linux:**
```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

#### Module Not Found Error

**Problem:**
```
Error: Cannot find module '@/components/MyComponent'
```

**Solutions:**

1. **Rebuild Next.js cache:**
   ```bash
   rm -rf .next
   npm run dev
   ```

2. **Verify path alias in tsconfig.json:**
   ```json
   "paths": {
     "@/*": ["./src/*"]
   }
   ```

3. **Check file exists:**
   ```bash
   ls src/components/MyComponent.tsx
   ```

#### TypeScript Errors

**Problem:**
```
Type error: Property 'foo' does not exist on type 'Bar'
```

**Solutions:**

1. **Check types are correct:**
   ```typescript
   // Ensure interfaces match usage
   interface Props {
     foo: string; // Add missing property
   }
   ```

2. **Rebuild:**
   ```bash
   npm run build
   ```

3. **Clean install:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

#### API Connection Failed

**Problem:**
```
[API] Error: Network Error - connect ECONNREFUSED 127.0.0.1:8000
```

**Solutions:**

1. **Verify backend is running:**
   ```bash
   curl http://localhost:8000/health
   ```

2. **Check .env.local:**
   ```bash
   cat .env.local
   # Should show: NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

3. **Check firewall:**
   - Allow port 8000
   - Try accessing from browser: http://localhost:8000/health

4. **Network connectivity (VR):**
   ```bash
   ping 192.168.1.100
   ```

#### WebGL Not Available

**Problem:**
```
WebGL: CONTEXT_LOST_WEBGL
```

**Solutions:**

1. **Update graphics drivers**
2. **Enable hardware acceleration:**
   - Chrome: `chrome://settings/system`
   - Enable "Use hardware acceleration when available"
3. **Try different browser**
4. **Check GPU compatibility:**
   - Visit: https://get.webgl.org/

#### Build Fails

**Problem:**
```
Error: Build failed
```

**Solutions:**

1. **Check for syntax errors:**
   ```bash
   npm run lint
   ```

2. **Clear cache:**
   ```bash
   rm -rf .next
   npm run build
   ```

3. **Update dependencies:**
   ```bash
   npm update
   ```

#### Slow Development Server

**Solutions:**

1. **Disable Fast Refresh temporarily:**
   ```javascript
   // next.config.js
   module.exports = {
     reactStrictMode: false,
   }
   ```

2. **Reduce source map detail:**
   ```javascript
   // next.config.js
   module.exports = {
     webpack: (config, { dev }) => {
       if (dev) {
         config.devtool = 'eval-source-map';
       }
       return config;
     },
   }
   ```

3. **Close unused applications**
4. **Increase Node.js memory:**
   ```bash
   NODE_OPTIONS=--max_old_space_size=4096 npm run dev
   ```

### Getting Help

**Internal Resources:**
- Check `specs/` documentation
- Review related GitHub issues
- Ask team members

**External Resources:**
- **Babylon.js**: https://forum.babylonjs.com/
- **Next.js**: https://github.com/vercel/next.js/discussions
- **React**: https://react.dev/community
- **Stack Overflow**: Tag questions with `babylonjs`, `next.js`, `reactjs`

**Before Asking:**
1. Search existing issues
2. Check documentation
3. Reproduce with minimal example
4. Include error messages and screenshots
5. List steps to reproduce

---

## Additional Resources

### Documentation

- **Project Docs**: See all files in `specs/` folder
- **Babylon.js Docs**: https://doc.babylonjs.com/
- **Next.js Docs**: https://nextjs.org/docs
- **React Docs**: https://react.dev/
- **TypeScript Docs**: https://www.typescriptlang.org/docs/
- **Tailwind CSS Docs**: https://tailwindcss.com/docs

### Tutorials

- **Babylon.js Getting Started**: https://doc.babylonjs.com/journey
- **Next.js Learn**: https://nextjs.org/learn
- **React Tutorial**: https://react.dev/learn
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/handbook/

### Community

- **Babylon.js Forum**: https://forum.babylonjs.com/
- **Next.js Discord**: https://nextjs.org/discord
- **React Community**: https://react.dev/community

### Tools

- **Babylon.js Playground**: https://playground.babylonjs.com/
- **TypeScript Playground**: https://www.typescriptlang.org/play
- **Tailwind Play**: https://play.tailwindcss.com/
- **Can I Use**: https://caniuse.com/ (Check browser compatibility)

### Related Projects

- **Babocument**: Main backend repository
- **Babylon.js Editor**: Scene editor tool

---

## Next Steps

After completing setup:

1. ✅ **Verify Installation**
   - Run `npm run dev`
   - Open http://localhost:3000
   - Check console for errors

2. ✅ **Explore Codebase**
   - Read `src/app/page.tsx` (main scene)
   - Review `src/lib/api/` (API client)
   - Check `src/components/` (UI components)

3. ✅ **Make a Test Change**
   - Modify box color in `page.tsx`
   - Add a new 3D object
   - Create a simple component

4. ✅ **Read Documentation**
   - Review all files in `specs/`
   - Understand architecture
   - Note known issues

5. ✅ **Test VR Mode** (if available)
   - Connect VR headset
   - Access from headset browser
   - Enter VR mode

6. ✅ **Join Communication Channels**
   - Team chat/Slack
   - Project management tool
   - Code review process

---

## Useful Commands Cheat Sheet

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Fix linting issues
npm run lint -- --fix

# Clean build cache
rm -rf .next

# Clean install
rm -rf node_modules package-lock.json && npm install

# Update dependencies
npm update

# Check outdated packages
npm outdated

# Install specific package
npm install package-name

# Install dev dependency
npm install --save-dev package-name

# Uninstall package
npm uninstall package-name

# Check Node/npm version
node --version && npm --version

# Run on different port
npm run dev -- -p 3001
```

---

**Welcome to the team! Happy coding! 🚀**

For questions or issues with this setup guide, please contact the project maintainer or create an issue in the repository.
