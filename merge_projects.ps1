<#
.SYNOPSIS
    Merge multiple project folders into a single target folder by copying them as subfolders.

.DESCRIPTION
    Copies the full contents of each source folder into a subfolder under the given target.
    Uses Robocopy to preserve attributes and timestamps. The script never modifies the source
    folders. If the destination subfolder already exists, a timestamped suffix will be used
    to avoid overwriting existing files.

.PARAMETER Sources
    Array of source folder paths to copy.

.PARAMETER Target
    Target folder where subfolders will be created. Defaults to current working directory.

.PARAMETER DryRun
    If specified, the script will print the robocopy commands it would run but won't execute them.

EXAMPLE
    .\merge_projects.ps1
    (Uses the built-in defaults matching the paths you provided earlier.)

    .\merge_projects.ps1 -Target 'C:\Users\91852\Desktop\Merged' -DryRun
#>

param(
    [string[]]$Sources = @(
        'C:\Users\91852\Desktop\Hackx frontend',
        'C:\Users\91852\Desktop\blockchain-main',
        'C:\Users\91852\Desktop\HackX'
    ),
    [string]$Target = (Get-Location).Path,
    [switch]$DryRun
)

function Write-Log {
    param([string]$Message)
    $ts = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')
    Write-Output "$ts`t$Message"
}

if (-not (Get-Command robocopy -ErrorAction SilentlyContinue)) {
    Write-Error "robocopy is not available on this system. This script requires robocopy (Windows)."
    exit 2
}

Write-Log "Target merge folder: $Target"

if (-not (Test-Path -Path $Target)) {
    Write-Log "Target does not exist. Creating: $Target"
    New-Item -ItemType Directory -Path $Target -Force | Out-Null
}

$summary = @()

foreach ($src in $Sources) {
    if (-not $src) { continue }
    Write-Log "Processing source: $src"
    if (-not (Test-Path -Path $src)) {
        Write-Log "WARNING: Source not found: $src -- skipped"
        $summary += @{ Source = $src; Status = 'Missing' }
        continue
    }

    $basename = Split-Path -Path $src -Leaf
    if (-not $basename -or $basename -eq '') {
        # fallback to sanitized path name
        $basename = ($src -replace '[:\\/]','_')
    }

    $dest = Join-Path -Path $Target -ChildPath $basename

    if (Test-Path -Path $dest) {
        $stamp = (Get-Date).ToString('yyyyMMdd_HHmmss')
        $dest = $dest + '_' + $stamp
        Write-Log "Destination already existed; using timestamped destination: $dest"
    }

    # Build robocopy arguments
    # /E : copy subdirectories, including empty ones
    # /COPYALL : copy all file info (equivalent to /COPY:DATSOU)
    # /DCOPY:T : copy directory timestamps
    # /R:1 /W:1 : retry once on failure
    # /NFL /NDL /NP : minimal logging to console (we still write our own messages)
    $args = @($src, $dest, '/E', '/COPYALL', '/DCOPY:T', '/R:1', '/W:1')

    Write-Log "Will copy into: $dest"
    if ($DryRun) {
        Write-Log "DryRun: robocopy $($args -join ' ')"
        $summary += @{ Source = $src; Destination = $dest; Status = 'DryRun' }
        continue
    }

    # Ensure parent folder exists
    New-Item -ItemType Directory -Path $dest -Force | Out-Null

    Write-Log "Starting robocopy from '$src' to '$dest'"
    $proc = Start-Process -FilePath robocopy -ArgumentList $args -NoNewWindow -Wait -PassThru -WindowStyle Hidden

    # Robocopy exit codes: 0 and 1 are success (1 means some files copied). We'll treat <8 as success.
    $rc = $proc.ExitCode
    if ($rc -lt 8) {
        Write-Log "robocopy finished with exit code $rc (OK)"
        $summary += @{ Source = $src; Destination = $dest; Status = 'Copied'; ExitCode = $rc }
    } else {
        Write-Log "robocopy finished with exit code $rc (ERROR)"
        $summary += @{ Source = $src; Destination = $dest; Status = 'Error'; ExitCode = $rc }
    }
}

Write-Log "Merge summary:"
foreach ($s in $summary) {
    Write-Output " - Source: $($s.Source) -> Dest: $($s.Destination) Status: $($s.Status) ExitCode: $($s.ExitCode)"
}

Write-Log "Done. Please inspect the destination folder and resolve any package/env conflicts manually."
