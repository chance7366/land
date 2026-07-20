' 콘솔 창 없이 부동산소식 수집 실행 (작업 스케줄러용)
Option Explicit
Dim sh, fso, scriptDir, ps1, cmd
Set sh = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)
ps1 = scriptDir & "\run-news-feed-collect.ps1"
cmd = "powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File """ & ps1 & """"
' 0 = 창 숨김, False = 대기하지 않음
sh.Run cmd, 0, False
