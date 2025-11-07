This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

### Quick Start with Startup Script (Recommended)

The easiest way to start the application with proper network configuration:

**Windows (PowerShell):**
```powershell
.\start.ps1
# or
npm run startup
```

**Mac/Linux (Bash):**
```bash
./start.sh
# or
npm run startup:bash
```

The startup script will:
- Auto-detect or prompt for backend location
- Check backend connectivity
- Display network addresses for VR headset access
- Start the Next.js development server

### Manual Start

Alternatively, run the development server directly:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

**For VR headset access:** Use your computer's network IP address instead of localhost (e.g., `http://192.168.1.100:3000`). The startup script displays these automatically.

### Configuration

Copy `.env.example` to `.env.local` and configure your backend URL:

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

For detailed setup instructions including network scenarios and VR headset connectivity, see [STARTUP_GUIDE.md](./STARTUP_GUIDE.md).

## Documentation

### Getting Started
- **[STARTUP_GUIDE.md](./STARTUP_GUIDE.md)** - Comprehensive startup guide with network setup, VR configuration, and troubleshooting
- **[QUICK_START.md](./QUICK_START.md)** - Quick reference for common startup commands
- **[specs/SETUP.md](./specs/SETUP.md)** - Complete developer onboarding and environment setup

### Project Information
- **[HANDOFF.md](./HANDOFF.md)** - Project handoff document with overview and next steps
- **[PRIORITIZED_TASKS.md](./PRIORITIZED_TASKS.md)** - Phase-based development plan
- **[GITHUB_ISSUES.md](./GITHUB_ISSUES.md)** - Detailed issue descriptions
- **[specs/](./specs/)** - Full technical documentation (13 documents)

### GitHub Issues
View and track development: https://github.com/buddha314/beabodocl-babylon/issues

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
