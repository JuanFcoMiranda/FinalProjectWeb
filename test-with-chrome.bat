@echo off
REM Script para configurar la ruta de Chrome antes de ejecutar los tests
REM Edita este archivo para especificar la ruta de tu instalación de Chrome

REM ============================================
REM CONFIGURA AQUI LA RUTA DE CHROME
REM ============================================

REM Opción 1: Chrome en Program Files (64-bit)
set CHROME_BIN=C:\Program Files\Google\Chrome Beta\Application\chrome.exe

REM Opción 2: Chrome en Program Files (x86) (32-bit)
REM set CHROME_BIN=C:\Program Files (x86)\Google\Chrome\Application\chrome.exe

REM Opción 3: Chrome Canary
REM set CHROME_BIN=C:\Users\%USERNAME%\AppData\Local\Google\Chrome SxS\Application\chrome.exe

REM Opción 4: Chromium
REM set CHROME_BIN=C:\Program Files\Chromium\Application\chrome.exe

REM Opción 5: Brave Browser
REM set CHROME_BIN=C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe

REM Opción 6: Microsoft Edge (también funciona con Chromium)
REM set CHROME_BIN=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe

REM Opción 7: Ruta personalizada - descomenta y modifica según tu necesidad
REM set CHROME_BIN=TU_RUTA_PERSONALIZADA_AQUI

REM ============================================
REM EJECUTAR TESTS
REM ============================================

echo.
echo Configurando Chrome en: %CHROME_BIN%
echo.

if not exist "%CHROME_BIN%" (
    echo ERROR: Chrome no encontrado en la ruta especificada.
    echo Por favor, edita test-with-chrome.bat y configura la ruta correcta.
    echo.
    pause
    exit /b 1
)

echo Chrome encontrado! Ejecutando tests...
echo.

REM Ejecutar los tests con npm
call npm test -- --watch=false --browsers=ChromeHeadless

echo.
echo Tests completados.
pause

