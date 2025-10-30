# Merged project (monorepo) notes

This workspace now includes a root-level `package.json` that declares the following folders as npm workspaces:

- `backend-main`
- `frontend`
- `blockchain-main`
- `Hackx frontend` (note: this folder name contains a space)

Important: No source files were modified. Each project remains in its original folder.

Quick PowerShell steps

1. Open PowerShell and change to the workspace root:

```powershell
cd 'C:\Users\91852\Desktop\HackX'
```

2. Install dependencies for all workspaces (recommended):

```powershell
npm run install:all
```

This runs `npm install` in a workspace-aware manner and will install dependencies for each subproject.

3. Running projects

- Backend (in `backend-main`):

```powershell
cd backend-main
npm run dev    # or npm start
```

- Frontend (in `Hackx frontend` — contains a space):

```powershell
# Either change into the folder (recommended)
cd 'Hackx frontend'
npm start

# Or use npm --prefix (note: quoting is required for paths with spaces)
npm --prefix "Hackx frontend" start
```

- Blockchain project (in `blockchain-main`):

```powershell
cd blockchain-main
# follow that project's README (may require Hardhat, node, or other tools)
```

Notes and next tasks

- If you prefer a single `start` script that runs backend and frontend concurrently, I can add a lightweight `run-all.ps1` or add `concurrently` to the root devDependencies and scripts. I didn't add that automatically to avoid modifying package state without your go-ahead.
- After installing, inspect `node_modules` sizes and run each project's tests or dev server separately.
- If you'd like, I can create a `run-all.ps1` to start selected services concurrently using PowerShell jobs (Windows-friendly) so you can start both backend + frontend with one command.
