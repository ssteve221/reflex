# Reflex — Deployment Guide

> Deploy the Reflex SPA as a static site. Two options: **Render** and **Vercel**.  
> Both are free. Pick the one your team is already familiar with.

---

## Option A — Render (Recommended)

Render hosts static sites for free on its free tier with no credit card required.

### Step 1 — Build the app

```bash
npm run build
```

This creates a `dist/` folder with the compiled static files.

### Step 2 — Push to GitHub

Make sure your latest code (including the `dist/` folder, OR configure Render to build for you — see Step 3) is on the `main` branch.

```bash
git add .
git commit -m "chore: production build"
git push origin main
```

> **Recommended**: Let Render run the build — don't commit `dist/` to git. Add `dist/` to `.gitignore` and use Render's build command (see Step 3).

### Step 3 — Create a Render Static Site

1. Go to [render.com](https://render.com) and sign in (free account)
2. Click **New → Static Site**
3. Connect your GitHub repo (`reflex`)
4. Set these values:

   | Setting | Value |
   |---------|-------|
   | **Name** | `reflex-delivery` |
   | **Branch** | `main` |
   | **Build Command** | `npm install && npm run build` |
   | **Publish Directory** | `dist` |

5. Click **Create Static Site**

Render will:
- Clone your repo
- Run `npm install && npm run build`
- Serve the `dist/` folder at `https://reflex-delivery.onrender.com`

### Step 4 — Verify

Open the Render URL in a browser. The app should load and work exactly as in development.

> **Important**: Because the app uses `localStorage`, each browser that visits the deployed URL has its own separate data. This is a known trade-off (see `docs/TRADE_OFFS.md`).

### Re-deploying after changes

Render auto-deploys every time you push to `main`. No manual steps needed.

---

## Option B — Vercel

Vercel is optimised for frontend frameworks and deploys in seconds.

### Step 1 — Install the Vercel CLI (optional)

```bash
npm install -g vercel
```

Or use the web dashboard at [vercel.com](https://vercel.com).

### Step 2 — Deploy via CLI

```bash
cd /path/to/reflex
vercel
```

Follow the prompts:
- Framework: **Vite**
- Build Command: `npm run build`
- Output Directory: `dist`

Your app will be live at `https://reflex-<random>.vercel.app`.

### Step 3 — Deploy via Dashboard (alternative to CLI)

1. Sign in at [vercel.com](https://vercel.com)
2. Click **Add New → Project**
3. Import your GitHub repo
4. Vercel auto-detects Vite — accept the defaults
5. Click **Deploy**

### Custom domain (optional)

Both Render and Vercel support custom domains on the free tier. Go to your project settings and add a domain (e.g. `reflex.co.ke`).

---

## Comparison

| Feature | Render | Vercel |
|---------|--------|--------|
| Free tier | ✅ | ✅ |
| Auto-deploy from GitHub | ✅ | ✅ |
| Build command | ✅ | ✅ |
| Custom domain | ✅ | ✅ |
| Time to first deploy | ~2 min | ~1 min |
| Full-stack support (when we add a backend) | ✅ Web Services | ❌ (serverless functions only) |

> **Recommendation**: Use **Render** for this project. When the team adds the Express/SQLite backend, Render can host both the static frontend and the Node.js server in one place. Vercel is better for pure frontend.

---

## Troubleshooting deployments

### App loads but shows blank screen
Check the browser console for errors. Most likely cause: a missing environment variable or a broken import path. Run `npm run build` locally first to catch errors before pushing.

### Build fails on Render / Vercel
```
Error: Cannot find module 'xyz'
```
Make sure all imports are correct and that `package.json` includes the dependency (not just installed locally but not in `dependencies`/`devDependencies`).

### SPA routing — 404 on page refresh
If you add React Router later and users get a 404 on refresh, add a rewrite rule:

**Render** — create `public/_redirects`:
```
/* /index.html 200
```

**Vercel** — add to `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## What the deployed URL looks like

After deploying, share this URL with your panel:

```
https://reflex-delivery.onrender.com
```

The app is fully functional from any browser — no installation required. Demonstrate all three roles from that URL during the presentation.
