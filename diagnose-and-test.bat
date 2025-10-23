@echo off
setlocal enabledelayedexpansion

echo ===============================================
echo   Diagnostico y Ejecucion de Tests
echo ===============================================
echo.

REM Verificar Node.js
echo [1/7] Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo   X Node.js no esta instalado
    echo   Instala Node.js desde https://nodejs.org/
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo   + Node.js instalado: !NODE_VERSION!
)
echo.

REM Verificar npm
echo [2/7] Verificando npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo   X npm no esta disponible
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo   + npm instalado: !NPM_VERSION!
)
echo.

REM Verificar node_modules
echo [3/7] Verificando dependencias...
if not exist "node_modules" (
    echo   ! node_modules no encontrado
    echo   Instalando dependencias...
    call npm install
    if errorlevel 1 (
        echo   X Error instalando dependencias
        pause
        exit /b 1
    )
) else (
    echo   + node_modules encontrado
)
echo.

REM Verificar Chrome
echo [4/7] Buscando Chrome...
set CHROME_FOUND=0
set "CHROME_PATH_1=C:\Program Files\Google\Chrome\Application\chrome.exe"
set "CHROME_PATH_2=C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
set "CHROME_PATH_3=%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"

if exist "!CHROME_PATH_1!" (
    echo   + Chrome encontrado: !CHROME_PATH_1!
    set CHROME_BIN=!CHROME_PATH_1!
    set CHROME_FOUND=1
) else if exist "!CHROME_PATH_2!" (
    echo   + Chrome encontrado: !CHROME_PATH_2!
    set CHROME_BIN=!CHROME_PATH_2!
    set CHROME_FOUND=1
) else if exist "!CHROME_PATH_3!" (
    echo   + Chrome encontrado: !CHROME_PATH_3!
    set CHROME_BIN=!CHROME_PATH_3!
    set CHROME_FOUND=1
) else (
    echo   ! Chrome no encontrado en rutas estandar
    echo   Intentando buscar con 'where'...
    for /f "tokens=*" %%i in ('where chrome 2^>nul') do (
        echo   + Chrome encontrado: %%i
        set CHROME_BIN=%%i
        set CHROME_FOUND=1
        goto :chrome_found
    )
)

:chrome_found
if !CHROME_FOUND! EQU 0 (
    echo   X Chrome no encontrado
    echo   Por favor instala Chrome o edita chrome-config.json
    echo   con la ruta correcta.
    echo.
    echo   Puedes continuar si tienes Puppeteer instalado.
    choice /C YN /M "Continuar de todas formas"
    if errorlevel 2 exit /b 1
)
echo.

REM Verificar karma.conf.js
echo [5/7] Verificando karma.conf.js...
if not exist "karma.conf.js" (
    echo   X karma.conf.js no encontrado
    pause
    exit /b 1
) else (
    echo   + karma.conf.js encontrado
)
echo.

REM Matar procesos previos
echo [6/7] Limpiando procesos previos...
taskkill /F /IM chrome.exe >nul 2>&1
if errorlevel 1 (
    echo   + No hay procesos Chrome previos
) else (
    echo   + Procesos Chrome cerrados
)
echo.

REM Compilar TypeScript
echo [7/7] Verificando compilacion TypeScript...
call npx tsc --noEmit >nul 2>&1
if errorlevel 1 (
    echo   ! Hay errores de TypeScript
    echo   Ejecutando compilacion para ver errores...
    call npx tsc --noEmit
    echo.
    choice /C YN /M "Continuar con los tests de todas formas"
    if errorlevel 2 exit /b 1
) else (
    echo   + TypeScript compila sin errores
)
echo.

echo ===============================================
echo   Ejecutando Tests
echo ===============================================
echo.

REM Ejecutar tests
call npm test -- --watch=false --browsers=ChromeHeadless

set TEST_EXIT_CODE=%errorlevel%

echo.
echo ===============================================
if %TEST_EXIT_CODE% EQU 0 (
    echo   EXITO: Tests completados correctamente
) else (
    echo   ERROR: Tests fallaron [codigo: %TEST_EXIT_CODE%]
    echo.
    echo   Consulta TEST_TROUBLESHOOTING.md para solucion de problemas
)
echo ===============================================
echo.

pause
exit /b %TEST_EXIT_CODE%

