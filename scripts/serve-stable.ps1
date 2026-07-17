$ErrorActionPreference = "Stop"

& (Join-Path $PSScriptRoot "sync-dev.ps1")

$dst = "C:\dev\chance-auction"
Push-Location $dst

Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue |
  Select-Object -ExpandProperty OwningProcess -Unique |
  ForEach-Object { if ($_ -and $_ -ne 0) { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue } }

if (Test-Path .next) { Remove-Item -Recurse -Force .next }

npm run db:generate
if ($LASTEXITCODE -ne 0) { Pop-Location; exit $LASTEXITCODE }

# 법원경매 실시간 조회용 Chromium (이미 있으면 즉시 종료)
node ./node_modules/playwright/cli.js install chromium
if ($LASTEXITCODE -ne 0) { Write-Host "WARN: playwright chromium install failed"; }

# Float/Int money column widen may warn; accept cast for local preview DB
node ./node_modules/prisma/build/index.js db push --accept-data-loss
if ($LASTEXITCODE -ne 0) { Pop-Location; exit $LASTEXITCODE }

# 기존 매물/경매에 관리번호 부여 (매물_00000001 / 경매_00000001)
node ./node_modules/tsx/dist/cli.mjs scripts/backfill-manage-codes.ts
if ($LASTEXITCODE -ne 0) { Write-Host "WARN: manageCode backfill failed"; }

npm run build
if ($LASTEXITCODE -ne 0) { Pop-Location; exit $LASTEXITCODE }

npm run start -- -p 3000
