# 🚀 Aditya Kumawat Portfolio — Setup & Deployment Guide

## 📦 Tech Stack

- React 19
- Vite
- TailwindCSS
- GitHub Pages (Static Hosting)

---

# 🛠 1️⃣ Initial Setup (After Cloning Project)

```bash
npm install
```

This installs all dependencies.

---

# 💻 2️⃣ Run Development Version (Local Dev Mode)

For live development with hot reload:

```bash
npm run dev
```

App runs on:

```
http://localhost:3000
```

Use this mode for:

- UI changes
- Animations
- Styling updates
- Layout adjustments

---

# 🏗 3️⃣ Create Production Build (Optimized Build)

To generate optimized production files:

```bash
npm run build
```

This creates:

```
/dist
```

Folder contains:

- Minified JS
- Optimized CSS
- Production-ready assets

---

# 👀 4️⃣ Test Production Build Locally

Before deploying, always test the build:

```bash
npm run preview
```

This simulates production environment.

If everything works correctly here,
it will work on GitHub Pages.

---

# 🌍 5️⃣ Deploy to GitHub Pages

### Step 1 — Build + Deploy

```bash
npm run deploy
```

This:

1. Runs build
2. Pushes `/dist` to `gh-pages` branch

---

### Step 2 — GitHub Settings

Go to:

```
Repo → Settings → Pages
```

Set:

```
Source → gh-pages branch
```

Save.

Your site will be live at:

```
https://adikumaw.github.io/portfolio
```

---

# ⚙ Important Configuration Notes

## ✅ Vite Base Path (VERY IMPORTANT)

Inside `vite.config.ts`:

```ts
base: '/REPO_NAME/',
```

Example:

```ts
base: '/portfolio/',
```

If you change repository name,
you must update this.

---

## 🔐 API Keys Warning

This is a static website.

Never expose:

- Gemini API keys
- Any secret keys
- Backend credentials

If API integration is needed in future:
→ Create a backend server
→ Do not expose secrets in frontend build

---

# 🔄 6️⃣ How To Redeploy After Changes

Whenever you update anything:

```
1. npm run dev        (test locally)
2. npm run build      (create optimized build)
3. npm run preview    (test production build)
4. npm run deploy     (push to GitHub Pages)
```

That’s it.

---

# 🧹 7️⃣ Clean Rebuild (If Something Breaks)

If build acts weird:

```bash
rm -rf node_modules
rm -rf dist
npm install
npm run build
```

---

# 📈 8️⃣ Performance Check

After deployment:

Open Chrome DevTools → Lighthouse → Run Audit

Target:

- Performance: 95+
- Best Practices: 100
- Accessibility: 90+

---

# 🧠 Future Upgrade Ideas

- Add custom domain
- Add analytics
- Add backend API
- Convert to SSR (if needed)
- Add CI/CD auto deploy via GitHub Actions

---

# 📌 Quick Command Summary

| Task                 | Command           |
| -------------------- | ----------------- |
| Install dependencies | `npm install`     |
| Run dev server       | `npm run dev`     |
| Build production     | `npm run build`   |
| Preview production   | `npm run preview` |
| Deploy to GitHub     | `npm run deploy`  |

---

# ✅ Final Reminder

Always test with:

```bash
npm run preview
```

before deploying.

If preview works → GitHub Pages will work.

---
