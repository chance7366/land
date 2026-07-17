# 부동산 소식 1회 수집 — 미리보기 DB(C:\dev\chance-auction)에 기록
$ErrorActionPreference = "Stop"

$workspace = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$stable = "C:\dev\chance-auction"
$stableDb = Join-Path $stable "prisma\dev.db"
$workspaceDb = Join-Path $workspace "prisma\dev.db"

# 런타임 DB가 있으면 그쪽을 원본으로 사용
if (Test-Path $stableDb) {
  $env:DATABASE_URL = "file:C:/dev/chance-auction/prisma/dev.db"
  $runDir = if (Test-Path (Join-Path $stable "node_modules")) { $stable } else { $workspace }
} else {
  $env:DATABASE_URL = "file:./dev.db"
  $runDir = $workspace
}

$logDir = Join-Path $workspace "storage\logs"
New-Item -ItemType Directory -Force -Path $logDir | Out-Null
$logFile = Join-Path $logDir ("news-feed-collect-{0:yyyyMMdd}.log" -f (Get-Date))

function Write-Log([string]$msg) {
  $line = "{0:yyyy-MM-dd HH:mm:ss} {1}" -f (Get-Date), $msg
  Add-Content -Path $logFile -Value $line -Encoding UTF8
  Write-Host $line
}

Write-Log "START cwd=$runDir DATABASE_URL=$env:DATABASE_URL"

Push-Location $runDir
try {
  & node ./node_modules/tsx/dist/cli.mjs scripts/collect-news-feed.ts 2>&1 | ForEach-Object {
    Write-Log "$_"
  }
  if ($LASTEXITCODE -ne 0) {
    Write-Log "FAIL exit=$LASTEXITCODE"
    exit $LASTEXITCODE
  }
} finally {
  Pop-Location
}

# 미리보기 DB → 워크스페이스 동기화 (로컬 조회 일치)
if ((Test-Path $stableDb) -and (Test-Path $workspaceDb)) {
  Copy-Item -Force $stableDb $workspaceDb
  foreach ($suf in @("-wal", "-shm", "-journal")) {
    $d = "$stableDb$suf"
    if (Test-Path $d) { Copy-Item -Force $d "$workspaceDb$suf" }
  }
  Write-Log "DB synced stable → workspace"
}

Write-Log "OK"
exit 0
