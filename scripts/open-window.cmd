@echo off
REM Opens a URL in a chromeless app window, so the site looks like an
REM application rather than a tab. Prefers Edge, falls back to Chrome, then to
REM whatever the system default browser is.

set "URL=%~1"
if "%URL%"=="" set "URL=https://garvms-netizen.github.io/clearroute/"

set "EDGE=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
if not exist "%EDGE%" set "EDGE=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"

set "CHROME=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if not exist "%CHROME%" set "CHROME=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"

if exist "%EDGE%" (
  start "" "%EDGE%" --app="%URL%" --window-size=1440,900
) else if exist "%CHROME%" (
  start "" "%CHROME%" --app="%URL%" --window-size=1440,900
) else (
  start "" "%URL%"
)
