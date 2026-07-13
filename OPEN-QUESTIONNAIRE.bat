@echo off
cd /d "%~dp0"
netstat -ano | findstr /R /C:":8765 .*LISTENING" >nul
if errorlevel 1 (
  where py >nul 2>nul
  if not errorlevel 1 (
    start "WNMU Local Server" /min py -m http.server 8765
    timeout /t 1 /nobreak >nul
    goto open
  )
  where python >nul 2>nul
  if not errorlevel 1 (
    start "WNMU Local Server" /min python -m http.server 8765
    timeout /t 1 /nobreak >nul
    goto open
  )
  echo Python was not found. Opening the questionnaire directly instead.
  start "" "%~dp0index.html"
  exit /b
)
:open
start "" http://localhost:8765/index.html
