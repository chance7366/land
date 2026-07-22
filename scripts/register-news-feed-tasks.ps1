# 부동산소식 수집 Windows 작업 등록 (매일 08:00 / 14:00 / 20:00 로컬=KST)
# 콘솔 창이 뜨지 않도록 wscript + Hidden PowerShell로 등록합니다.
# 당일 첫 수집 시작 시 run-news-feed-collect.ps1 이 +10분 후 소식 메일 발송을 예약합니다.
$ErrorActionPreference = "Stop"

$script = Join-Path $PSScriptRoot "run-news-feed-collect.ps1"
$hiddenVbs = Join-Path $PSScriptRoot "run-news-feed-collect-hidden.vbs"
if (-not (Test-Path $script)) {
  throw "Missing $script"
}
if (-not (Test-Path $hiddenVbs)) {
  throw "Missing $hiddenVbs"
}

$taskName = "Chance-NewsFeed-Collect"
# //B = wscript 자체 UI 숨김, VBS가 PowerShell을 창 스타일 0으로 실행
$action = New-ScheduledTaskAction `
  -Execute "wscript.exe" `
  -Argument "//B `"$hiddenVbs`""
$triggers = @(
  (New-ScheduledTaskTrigger -Daily -At "08:00"),
  (New-ScheduledTaskTrigger -Daily -At "14:00"),
  (New-ScheduledTaskTrigger -Daily -At "20:00")
)
$settings = New-ScheduledTaskSettingsSet `
  -AllowStartIfOnBatteries `
  -DontStopIfGoingOnBatteries `
  -StartWhenAvailable `
  -ExecutionTimeLimit (New-TimeSpan -Hours 2)

$principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive -RunLevel Limited

Unregister-ScheduledTask -TaskName $taskName -Confirm:$false -ErrorAction SilentlyContinue
Register-ScheduledTask `
  -TaskName $taskName `
  -Action $action `
  -Trigger $triggers `
  -Settings $settings `
  -Principal $principal `
  -Description "찬스부동산 부동산소식 수집 (08/14/20 KST). 첫 수집+10분 메일 예약 포함" `
  -Force | Out-Null

Write-Host "Registered scheduled task: $taskName (hidden window)"
Write-Host "Triggers: daily 08:00, 14:00, 20:00"
Write-Host "Action: wscript.exe //B `"$hiddenVbs`""
Get-ScheduledTask -TaskName $taskName | Get-ScheduledTaskInfo | Format-List TaskName, NextRunTime, LastRunTime, LastTaskResult
