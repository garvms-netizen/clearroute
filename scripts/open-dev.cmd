@echo off
REM ---------------------------------------------------------------------------
REM  ClearRoute (dev) — starts the local dev server and opens it in an app
REM  window, then keeps this console around as the server's log.
REM
REM  Node was installed via winget, which puts it on the *user* PATH. A shell
REM  launched before that install (or by a process holding a stale environment)
REM  will not find it, so the path is resolved explicitly below rather than
REM  assumed.
REM ---------------------------------------------------------------------------

setlocal

set "PROJECT=%~dp0.."
set "NODEDIR=%LOCALAPPDATA%\Microsoft\WinGet\Packages\OpenJS.NodeJS.LTS_Microsoft.Winget.Source_8wekyb3d8bbwe\node-v24.18.1-win-x64"

if exist "%NODEDIR%\node.exe" set "PATH=%NODEDIR%;%PATH%"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo   Node.js was not found.
  echo   Expected it at: %NODEDIR%
  echo   If Node was updated, edit NODEDIR in this file to the new version folder.
  echo.
  pause
  exit /b 1
)

cd /d "%PROJECT%"

if not exist "node_modules" (
  echo Installing dependencies for the first time...
  call npm install --no-audit --no-fund
)

echo.
echo   Starting ClearRoute on http://localhost:3100
echo   Leave this window open. Close it to stop the server.
echo.

REM Give the server a moment to bind before the browser asks for the page.
start "" /b cmd /c "timeout /t 4 /nobreak >nul && start "" "%~dp0open-window.cmd" http://localhost:3100/"

call npm run dev -- -p 3100

endlocal
