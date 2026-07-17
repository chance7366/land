# 부동산소식 수집 Windows 작업 등록 (매일 08:00 / 14:00 / 20:00 로컬=KST)
$ErrorActionPreference = "Stop"

$script = Join-Path $PSScriptRoot "run-news-feed-collect.ps1"
if (-not (Test-Path $script)) {
  throw "Missing $script"
}

$taskName = "Chance-NewsFeed-Collect"
$arg = "-NoProfile -ExecutionPolicy Bypass -File `"$script`""
$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument $arg
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
  -Description "찬스부동산 부동산소식 수집 (08:00/14:00/20:00 KST)" `
  -Force | Out-Null

Write-Host "Registered scheduled task: $taskName"
Write-Host "Triggers: daily 08:00, 14:00, 20:00"
Get-ScheduledTask -TaskName $taskName | Get-ScheduledTaskInfo | Format-List TaskName, NextRunTime, LastRunTime, LastTaskResult
