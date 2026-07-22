# News feed one-shot collect
# If DATA_PROVIDER=supabase -> write to Supabase using workspace .env.local
# Else -> write to local SQLite (C:\dev\chance-auction preview DB when present)
$ErrorActionPreference = "Stop"

$workspace = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$stable = "C:\dev\chance-auction"
$stableDb = Join-Path $stable "prisma\dev.db"
$workspaceDb = Join-Path $workspace "prisma\dev.db"

function Import-DotEnv {
  param([string]$Path)
  if (-not (Test-Path $Path)) { return }
  foreach ($raw in Get-Content -Path $Path -Encoding UTF8) {
    $line = $raw.Trim()
    if (-not $line) { continue }
    if ($line.StartsWith("#")) { continue }
    $eq = $line.IndexOf("=")
    if ($eq -lt 1) { continue }
    $k = $line.Substring(0, $eq).Trim()
    $v = $line.Substring($eq + 1).Trim()
    if (($v.StartsWith('"') -and $v.EndsWith('"')) -or ($v.StartsWith("'") -and $v.EndsWith("'"))) {
      $v = $v.Substring(1, $v.Length - 2)
    }
    Set-Item -Path ("Env:" + $k) -Value $v
  }
}

Import-DotEnv -Path (Join-Path $workspace ".env")
Import-DotEnv -Path (Join-Path $workspace ".env.local")

$useSupabase = ($env:DATA_PROVIDER -eq "supabase")
$runDir = $workspace

if (-not $useSupabase) {
  if (Test-Path $stableDb) {
    $env:DATABASE_URL = "file:C:/dev/chance-auction/prisma/dev.db"
  } else {
    $env:DATABASE_URL = "file:./dev.db"
  }
}

$logDir = Join-Path $workspace "storage\logs"
New-Item -ItemType Directory -Force -Path $logDir | Out-Null
$logFile = Join-Path $logDir ("news-feed-collect-{0:yyyyMMdd}.log" -f (Get-Date))

function Write-Log {
  param([string]$Msg)
  $line = "{0:yyyy-MM-dd HH:mm:ss} {1}" -f (Get-Date), $Msg
  Add-Content -Path $logFile -Value $line -Encoding UTF8
  Write-Host $line
}

$mode = "sqlite"
if ($useSupabase) { $mode = "supabase" }
Write-Log ("START mode={0} cwd={1} DATA_PROVIDER={2} DATABASE_URL={3}" -f $mode, $runDir, $env:DATA_PROVIDER, $env:DATABASE_URL)

Push-Location $runDir
try {
  $scriptPath = Join-Path $workspace "scripts\collect-news-feed.ts"
  & node ./node_modules/tsx/dist/cli.mjs $scriptPath 2>&1 | ForEach-Object {
    Write-Log ("{0}" -f $_)
  }
  if ($LASTEXITCODE -ne 0) {
    Write-Log ("FAIL exit={0}" -f $LASTEXITCODE)
    exit $LASTEXITCODE
  }
}
finally {
  Pop-Location
}

if ((-not $useSupabase) -and (Test-Path $stableDb) -and (Test-Path $workspaceDb)) {
  Copy-Item -Force $stableDb $workspaceDb
  foreach ($suf in @("-wal", "-shm", "-journal")) {
    $d = ($stableDb + $suf)
    if (Test-Path $d) {
      Copy-Item -Force $d ($workspaceDb + $suf)
    }
  }
  Write-Log "DB synced stable -> workspace"
}

Write-Log "OK"
exit 0
