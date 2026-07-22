# Sleep 10 minutes then send daily news digest mail.
# Spawned once per day from run-news-feed-collect.ps1 (first collect start).
$ErrorActionPreference = "Stop"

$workspace = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$logDir = Join-Path $workspace "storage\logs"
New-Item -ItemType Directory -Force -Path $logDir | Out-Null
$logFile = Join-Path $logDir ("news-digest-delay-{0:yyyyMMdd}.log" -f (Get-Date))

function Write-Log {
  param([string]$Msg)
  $line = "{0:yyyy-MM-dd HH:mm:ss} {1}" -f (Get-Date), $Msg
  Add-Content -Path $logFile -Value $line -Encoding UTF8
  Write-Host $line
}

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

Write-Log "DELAY_START sleep 600s"
Start-Sleep -Seconds 600

Import-DotEnv -Path (Join-Path $workspace ".env")
Import-DotEnv -Path (Join-Path $workspace ".env.local")

Write-Log ("SEND start DATA_PROVIDER={0}" -f $env:DATA_PROVIDER)

Push-Location $workspace
try {
  $scriptPath = Join-Path $workspace "scripts\send-news-digest.ts"
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

Write-Log "OK"
exit 0
