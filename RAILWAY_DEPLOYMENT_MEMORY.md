# Railway Deployment Memory (Next.js Frontend + Separate Backend)

This file documents the exact issues we hit deploying this project to Railway and the fixes, so future projects avoid them. It doubles as a checklist/playbook.

## 0) TL;DR Checklist

- Git hygiene
  - Add a proper `.gitignore` (exclude `.next/`, `node_modules/`, build caches, `.env*`).
  - If build artifacts were committed, `git rm -r --cached` them and recommit.
- Environment
  - Set `NEXT_PUBLIC_API_URL` in Railway Service → Variables BEFORE build.
  - Never commit `.env.railway` or secrets; `.env.example` should not use quotes.
- Next.js config
  - Do NOT use `output: 'export'` with i18n.
  - Prefer Nixpacks default; if you keep a Dockerfile, make it consistent with scripts.
- Health checks
  - Add `/pages/api/health.ts` and set `healthcheckPath` to `/` or `/api/health`.
- API URL handling
  - Centralize API calls through a single axios instance; avoid raw `fetch` with env strings.
  - For SSR, guard against localhost envs; prefer the actual deployed backend URL.
  - For client, detect Railway domain and prefer Railway backend URL.
- Data cleanup
  - Normalize image URLs coming back as `http://localhost:3001/...`.
- After fixes
  - Force redeploy; hard-refresh browser cache.

---

## 1) Git push hanging due to huge repo

- Symptom: `git push` stalls or uploads ~70–90 MB. `.next/` and cache files were tracked.
- Fix:
  - Add `.gitignore` that excludes `.next/`, `out/`, `dist/`, `node_modules/`, `.env*`.
  - `git rm -r --cached .next node_modules` then commit.
  - If history is polluted, start a fresh repo or rewrite history.

## 2) Wrong remote / pushing to the wrong repo

- Symptom: pushing to a non-existent or unintended repo.
- Fix:
  - `git remote set-url origin <correct_repo_url>`
  - If remote branch is `master`, push `main:master` explicitly.

## 3) Railway health check failing (Service Unavailable)

- Root causes encountered:
  - Using `output: 'standalone'` with `next start` mismatch.
  - No health endpoint.
  - Security headers applied to health path.
- Fixes:
  - We disabled `output: 'standalone'` to keep `next start` simple (Nixpacks).
  - Added `pages/api/health.ts` and set `healthcheckPath` to `/` (or `/api/health`).
  - If you set custom headers, exclude `/api/health` from restrictions.

## 4) NEXT_PUBLIC variables not applied at build

- Symptom: Client logs show `NEXT_PUBLIC_API_URL: http://localhost:3001` in prod, despite Railway variable set.
- Why: NEXT_PUBLIC_* are baked at build time. If not set before build, the fallback sticks.
- Fix:
  - Set `NEXT_PUBLIC_API_URL` in Railway Variables BEFORE build.
  - Add build logging (`echo $NEXT_PUBLIC_API_URL`) to confirm in logs.
  - Force a clean redeploy.

## 5) Centralize API calls and dynamic baseURL

- Problems fixed:
  - Multiple raw `fetch` calls using `process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'` → caused prod to call localhost.
  - SSR tried to use `localhost` too.
- Fix:
  - Created a single axios client in `utils/api.ts` with a request interceptor:
    - On client: if domain includes `railway.app`, force `https://rimna-backend-production.up.railway.app`.
    - Otherwise use `process.env.NEXT_PUBLIC_API_URL` or local fallback.
  - Converted pages to use `articlesAPI`, `celebritiesAPI`, etc.

## 6) SSR (getServerSideProps) must not use localhost

- Symptom: ECONNREFUSED `::1:3001` during SSR on Railway.
- Fix:
  - In SSR code, if `NEXT_PUBLIC_API_URL` is missing or contains `localhost/127.0.0.1/::1`, override to the Railway backend URL.
  - Example (see `pages/articles/[id].tsx`).

## 7) Image URLs stored as localhost in DB

- Symptom: Images fail to load in prod because API returns `http://localhost:3001/...`.
- Fix:
  - `utils/imageUrl.ts` → `fixImageUrl(url)` replaces localhost with Railway domain and resolves relative URLs.
  - Use `fixImageUrl` in UI components (`NewsCard`, article image, etc.).
  - When uploading/creating content, convert relative URLs to absolute using a Railway-aware base.

## 8) TypeScript param mismatches causing build failures

- Symptom: `articlesAPI.getAll({ trending: 'true' })` failed type-check.
- Fix:
  - Extended `articlesAPI.getAll` params type to include `status?: string` and `trending?: string | boolean`.

## 9) i18n setup

- Added `appWithTranslation(MyApp)` in `_app.tsx` and fixed `next-i18next.config.js` localePath.
- Avoid `output: 'export'` with i18n.

## 10) Dockerfile vs Nixpacks

- Railway will prefer a Dockerfile if present. If you want Nixpacks behavior, remove Dockerfile.
- If keeping a Dockerfile for Next.js:
  - Use `npm ci --only=production`, copy source, run `npm run build`, then `npm start` (with matching scripts), or ensure a consistent standalone setup.

## 11) Caching

- After redeploys, use hard refresh (Ctrl/Cmd+Shift+R) or incognito to avoid stale JS bundles.

---

## Code References (where we applied fixes)

- API client and types: `utils/api.ts`
- Image URL normalization: `utils/imageUrl.ts`
- Home/news/trending pages switched to centralized APIs: `pages/index.tsx`, `pages/news.tsx`, `pages/trending.tsx`
- Article page SSR/client fixes: `pages/articles/[id].tsx`
- Comments: `components/common/CommentSystem.tsx`
- Celebrities list/admin: `pages/celebrities.tsx`, `components/CelebritiesAdminPanel.tsx`, `pages/admin/celebrities/*`
- Admin articles: `pages/admin/articles/*`
- Health endpoint: `pages/api/health.ts`
- Railway config (optional): `railway.json` (healthcheckPath, startCommand, build echo)

---

## Example Environment Setup (Railway → Variables)

- `NEXT_PUBLIC_API_URL = https://<your-backend>.up.railway.app`
- Do not set to localhost in production. Set BEFORE building.

---

## Example Scripts (package.json)

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "railway:build": "npm install && npm run build",
    "railway:start": "npm start"
  }
}
```

---

## Typical Errors and Quick Fixes

- `ECONNREFUSED ::1:3001` during SSR
  - SSR is calling localhost. Guard in `getServerSideProps` and force Railway backend URL.
- Client still fetches localhost
  - Some page uses raw `fetch` with env fallback. Switch to centralized API client or add a Railway-aware base.
- Health check `Service Unavailable`
  - Add `/api/health`, ensure health path is not blocked by headers, and start script matches config.
- Build type error
  - Adjust types for API params to match usage (e.g., `status`, `trending`).

---

## Playbook for New Projects

1. Start with `.gitignore` for Next.js; never commit `.next/`, `node_modules/`, or `.env*`.
2. Create `utils/api.ts` with a dynamic baseURL and use it everywhere.
3. Add `utils/imageUrl.ts` and normalize any media URLs.
4. Add `/pages/api/health.ts`.
5. Set Railway Variables (API URL) before first deploy.
6. Deploy using Nixpacks (simplest) or a consistent Dockerfile.
7. If things error, check build logs for `echo $NEXT_PUBLIC_API_URL` and hard-refresh the browser.

This doc should be copied into any new frontend project targeting Railway.
