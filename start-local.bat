@echo off
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
  start "" http://localhost:8765
  py -m http.server 8765
  goto :eof
)
where python >nul 2>nul
if %errorlevel%==0 (
  start "" http://localhost:8765
  python -m http.server 8765
  goto :eof
)
echo Python was not found. Open index.html directly, or install Python and run this file again.
pause
