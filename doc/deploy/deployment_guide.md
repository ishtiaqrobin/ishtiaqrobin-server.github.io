# 🚀 Build and Deployment Setup Guide

This guide explains how to configure your Express/Prisma backend for professional building and deployment to Vercel using the modern **ESM (.mjs)** standard.

---

## 1. Configure Build Scripts (`package.json`)

Add these scripts to your `package.json` to handle Prisma generation and the compilation process:

```json
"scripts": {
  "build": "prisma generate && tsup",
  "postinstall": "prisma generate"
}
```

- **`postinstall`**: Automatically generates the Prisma client after dependencies are installed on Vercel.
- **`build`**: This is the command Vercel will call to compile your code into the production-ready `api/` folder.

---

## 2. Configure the Bundler (`tsup.config.ts`)

first install tsup after installing
Create a `tsup.config.ts` file in your project root. This converts your TypeScript code into a single, optimized `.mjs` file that works perfectly in serverless environments.

** and add this at the end of server.ts`export default app` **

```typescript
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["esm"],
  platform: "node",
  target: "node20",
  outDir: "api",
  external: ["pg-native"],
  skipNodeModulesBundle: true, // Prevents bundling node_modules (Avoids Vercel crashes)
  shims: true, // Fixes __dirname and other ESM compatibility issues
  outExtension() {
    return { js: ".mjs" }; // Outputs server.mjs
  },
  clean: true, // Clears the api/ folder before every build
});
```

---

## 3. Configure Vercel Routing (`vercel.json`)

Create a `vercel.json` file in your root directory. This tells Vercel how to route web traffic to your compiled backend.

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/server.mjs",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/api/server.mjs"
    }
  ]
}
```

---

## 4. Deployment Steps

Follow these steps to push your project to production:

### Step 1: Set Environment Variables

Go to the **Vercel Dashboard** > **Project Settings** > **Environment Variables** and add all keys from your `.env` (e.g., `DATABASE_URL`, `BETTER_AUTH_SECRET`, etc.).

### Step 2: Install Vercel CLI

If you don't have it yet, install the CLI globally:

```bash
npm i -g vercel
```

### Step 3: Production Deployment

Run the following command in your terminal to deploy:

```bash
vercel --prod
```

---

## 5. Redeploying (after code changes)

The project is linked to Vercel as **`ishtiaqrobin-server`**
(`projectId: prj_FayKWjFNTo3kFc593MC4nMvzcKbF`).

### Option A — Git push (automatic)

If the Vercel project is connected to the GitHub repo
(`ishtiaqrobin/ishtiaqrobin-server.github.io`), every push to `main`
triggers a production build automatically:

```bash
git add -A
git commit -m "your message"
git push origin main
```

### Option B — Vercel CLI (manual)

```bash
# 1. Authenticate once (token expires periodically)
npx vercel login

# 2. Verify you're logged in
npx vercel whoami

# 3. Deploy to production
npx vercel --prod
```

> **Note:** `api/server.js` is gitignored — Vercel regenerates it during the
> build via the `build` script (`prisma generate && tsup`). Never commit it.

### Option C — Vercel Dashboard

1. Go to <https://vercel.com/dashboard>
2. Open the **`ishtiaqrobin-server`** project
3. **Deployments** tab → find the latest deployment
4. Click **⋯** → **Redeploy**
5. (Optional) Uncheck *"Use existing Build Cache"* for a clean rebuild

### Verifying a deploy

```bash
# Should return 401 (route exists + auth-protected), NOT 404
curl -X POST https://<your-domain>/api/v1/chatbot/ai-config/test \
  -H "Content-Type: application/json" -d '{}'
```

---

## 💡 Why this setup?

1. **ESM Support**: Using `.mjs` prevents "Dynamic require" errors that often crash backends on Vercel.
2. **Speed**: `tsup` uses `esbuild` under the hood, making your builds nearly instant.
3. **Reliability**: Running `prisma generate` in the `postinstall` ensures your database types never go out of sync in the cloud.
