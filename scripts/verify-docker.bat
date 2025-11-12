@echo off
echo ========================================
echo Verificacion de Dockerfile
echo ========================================
echo.

echo [1/5] Construyendo imagen de desarrollo...
docker build --target development -t proyectofinal-web:test-dev . > nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Imagen de desarrollo construida exitosamente
) else (
    echo [ERROR] Error al construir imagen de desarrollo
    exit /b 1
)
echo.

echo [2/5] Verificando usuario no privilegiado...
for /f %%i in ('docker run --rm proyectofinal-web:test-dev whoami 2^>nul') do set USER_CHECK=%%i
if "%USER_CHECK%"=="angular" (
    echo [OK] Ejecuta como usuario 'angular' ^(no root^)
) else (
    echo [ERROR] Ejecuta como '%USER_CHECK%' ^(deberia ser 'angular'^)
)
echo.

echo [3/5] Verificando UID...
for /f %%i in ('docker run --rm proyectofinal-web:test-dev id -u 2^>nul') do set UID_CHECK=%%i
if "%UID_CHECK%"=="1001" (
    echo [OK] UID es 1001 ^(no privilegiado^)
) else (
    echo [ERROR] UID es %UID_CHECK% ^(deberia ser 1001^)
)
echo.

echo [4/5] Construyendo imagen de produccion...
docker build --target production -t proyectofinal-web:test-prod . > nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Imagen de produccion construida exitosamente
) else (
    echo [ERROR] Error al construir imagen de produccion
)
echo.

echo [5/5] Verificando tamanos de imagenes...
echo Desarrollo:
docker images proyectofinal-web:test-dev --format "  - Tamano: {{.Size}}"
echo Produccion:
docker images proyectofinal-web:test-prod --format "  - Tamano: {{.Size}}"
echo.

echo ========================================
echo Limpiando imagenes de prueba...
docker rmi proyectofinal-web:test-dev proyectofinal-web:test-prod > nul 2>&1
echo.
echo [OK] Verificacion completada!
echo ========================================
pause

