# Merge Instructions

This repository now includes a small PowerShell helper script to copy (merge) three project folders into a single target location without modifying the source files.

Files added:
- `merge_projects.ps1` — PowerShell script that copies the folders using `robocopy` and preserves file attributes/timestamps.

How it works
- The script copies each source folder into a subfolder inside the target directory. The source folders are not modified.
- By default the script uses these source paths (the ones you gave earlier):
  - `C:\Users\91852\Desktop\Hackx frontend`
  - `C:\Users\91852\Desktop\blockchain-main`
  - `C:\Users\91852\Desktop\HackX`
- By default the target is the folder where you run the script. You can provide a different target folder with `-Target`.

Usage (PowerShell)

1. Open PowerShell (preferably with normal user privileges; Administrator not required unless some files require it).

2. Change to the folder where `merge_projects.ps1` is located (example):

```powershell
cd 'C:\Users\91852\Desktop\HackX'
```

3. Dry run (shows what would be copied):

```powershell
.\merge_projects.ps1 -DryRun
```

4. Run the actual merge (copies default sources into the current folder as subfolders):

```powershell
.\merge_projects.ps1
```

5. Specify a different target folder (creates the folder if necessary):

```powershell
.\merge_projects.ps1 -Target 'C:\Users\91852\Desktop\Merged'
```

Notes & post-merge steps
- The script copies files; it does not attempt to merge or reconcile `package.json`, `.env`, or port configurations. You must manually inspect and resolve any conflicts after copying.
- If a destination subfolder already exists, the script will append a timestamp to the destination directory name to avoid overwriting.
- The script uses `robocopy` (bundled with Windows) and preserves file metadata. If `robocopy` isn't available on the machine, the script will abort.
- After the merge you may want to:
  - Create a monorepo root (optional) and combine `package.json` files or use workspaces (npm/yarn/pnpm).
  - Search for duplicated file names or conflicting ports (common in frontend/backend combos).
  - Run `npm install` separately in each copied project folder.

If you'd like, I can next:
- Run a quick scan of the copied folders (once you run the script) and propose a monorepo `package.json` or scripts to run the frontend and backend together.
- Or create a simple top-level `README.md` with run instructions for the merged project.
