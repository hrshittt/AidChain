<#
Starts backend and frontend dev servers in separate PowerShell windows.

Usage:
    .\run-all.ps1

This script does not modify any source files. It simply opens two new PowerShell windows
and runs the dev commands from each project's folder so you can see their output.
#>

param()

function Write-Log { param($m) Write-Output "[$(Get-Date -Format o)] $m" }

$root = Split-Path -Parent $MyInvocation.MyCommand.Definition

# Backend
$backendPath = Join-Path $root 'backend-main'
$backendCmd = "cd '$backendPath'; npm run dev"

Write-Log "Starting backend in new window: $backendPath"
Start-Process -FilePath powershell -ArgumentList '-NoExit','-Command',$backendCmd -WorkingDirectory $backendPath

# Frontend (attempt aidchain inside Hackx frontend first)
$frontendPath1 = Join-Path $root 'Hackx frontend\aidchain'
$frontendPath2 = Join-Path $root 'frontend'

if (Test-Path $frontendPath1) {
    $frontendCmd = "cd '$frontendPath1'; npm run dev"
    Write-Log "Starting frontend (aidchain) in new window: $frontendPath1"
    Start-Process -FilePath powershell -ArgumentList '-NoExit','-Command',$frontendCmd -WorkingDirectory $frontendPath1
} elseif (Test-Path $frontendPath2) {
    $frontendCmd = "cd '$frontendPath2'; npm start"
    Write-Log "Starting frontend in new window: $frontendPath2"
    Start-Process -FilePath powershell -ArgumentList '-NoExit','-Command',$frontendCmd -WorkingDirectory $frontendPath2
} else {
    Write-Log "No frontend folder found at expected locations: $frontendPath1 or $frontendPath2"
}

Write-Log "Launched processes. Check the newly opened PowerShell windows for logs."
