$ErrorActionPreference = "Stop"

$src = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$dst = "C:\dev\chance-auction"

New-Item -ItemType Directory -Force -Path $dst | Out-Null

robocopy $src $dst /MIR /NFL /NDL /NJH /NJS /nc /ns /np `
  /XD .next .git node_modules .playwright-mcp public\uploads storage `
  /XF *.db *.db-journal *.db-wal *.db-shm | Out-Null
if ($LASTEXITCODE -ge 8) { exit $LASTEXITCODE }

# SQLite는 미리보기(C:\dev\chance-auction)가 런타임 원본.
# 워크스페이스 DB로 덮어쓰면 관리자 등록/삭제가 유실되므로 절대 복사하지 않음.
# (과거: workspace → stable 강제 복사로 홍성 등록·대구 삭제가 되돌아가던 사고)
# Schema는 serve-stable.ps1의 `db push`로만 맞춤.
New-Item -ItemType Directory -Force -Path (Join-Path $dst "prisma") | Out-Null
$srcDb = Join-Path $src "prisma\dev.db"
$dstDb = Join-Path $dst "prisma\dev.db"
# 미리보기 DB → 워크스페이스로만 역동기화 (로컬 조회용). 미리보기 데이터가 있을 때만.
if ((Test-Path $dstDb) -and ((Get-Item $dstDb).Length -gt 0)) {
  Copy-Item -Force $dstDb $srcDb
  foreach ($suf in @("-wal", "-shm", "-journal")) {
    $d = "$dstDb$suf"
    if (Test-Path $d) { Copy-Item -Force $d "$srcDb$suf" }
  }
  Write-Host "DB: stable → workspace (preview data preserved)"
} elseif (Test-Path $srcDb) {
  Copy-Item -Force $srcDb $dstDb
  Write-Host "DB: workspace → stable (first bootstrap only)"
}

if (-not (Test-Path "$dst\node_modules")) {
  Push-Location $dst
  npm install
  Pop-Location
} else {
  # Ensure new package.json deps are installed without wiping node_modules
  Push-Location $dst
  npm install --prefer-offline --no-audit --no-fund
  Pop-Location
}

Write-Host "Synced to $dst"
