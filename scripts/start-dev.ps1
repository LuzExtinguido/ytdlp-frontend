$ErrorActionPreference = "Stop"

$frontendPath = Resolve-Path (Join-Path $PSScriptRoot "..")
$backendPath = Resolve-Path (Join-Path $frontendPath "..\ytdlp-backend")

if (-not (Test-Path (Join-Path $backendPath "package.json"))) {
  Write-Host "Could not find backend package.json at $backendPath" -ForegroundColor Red
  exit 1
}

if (-not (Test-Path (Join-Path $frontendPath "package.json"))) {
  Write-Host "Could not find frontend package.json at $frontendPath" -ForegroundColor Red
  exit 1
}

Write-Host "Starting yt-dlp backend and frontend..." -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:3000"
Write-Host "Frontend: http://localhost:5173"

Start-Process powershell -ArgumentList @(
  "-NoExit",
  "-Command",
  "Set-Location '$backendPath'; npm.cmd run start:dev"
)

Start-Process powershell -ArgumentList @(
  "-NoExit",
  "-Command",
  "Set-Location '$frontendPath'; npm.cmd run dev"
)

Start-Sleep -Seconds 2
Start-Process "http://localhost:5173"
