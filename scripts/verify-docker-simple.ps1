# Script simple de verificación de Dockerfile
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Verificación de Dockerfile" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Construir imagen de desarrollo
Write-Host "[1/5] Construyendo imagen de desarrollo..." -ForegroundColor Yellow
$buildDev = docker build --target development -t proyectofinal-web:test-dev . 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Imagen de desarrollo construida" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Error al construir imagen de desarrollo" -ForegroundColor Red
    Write-Host $buildDev
    exit 1
}
Write-Host ""

# 2. Verificar usuario
Write-Host "[2/5] Verificando usuario no privilegiado..." -ForegroundColor Yellow
$user = docker run --rm proyectofinal-web:test-dev whoami 2>$null
if ($user -eq "angular") {
    Write-Host "[OK] Ejecuta como usuario 'angular' (no root)" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Ejecuta como '$user' (debería ser 'angular')" -ForegroundColor Red
}
Write-Host ""

# 3. Verificar UID
Write-Host "[3/5] Verificando UID..." -ForegroundColor Yellow
$uid = docker run --rm proyectofinal-web:test-dev id -u 2>$null
if ($uid -eq "1001") {
    Write-Host "[OK] UID es 1001 (no privilegiado)" -ForegroundColor Green
} else {
    Write-Host "[ERROR] UID es $uid (debería ser 1001)" -ForegroundColor Red
}
Write-Host ""

# 4. Construir imagen de producción
Write-Host "[4/5] Construyendo imagen de producción..." -ForegroundColor Yellow
$buildProd = docker build --target production -t proyectofinal-web:test-prod . 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Imagen de producción construida" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Error al construir imagen de producción" -ForegroundColor Red
    Write-Host $buildProd
}
Write-Host ""

# 5. Ver tamaños
Write-Host "[5/5] Verificando tamaños de imágenes..." -ForegroundColor Yellow
$devSize = docker images proyectofinal-web:test-dev --format "{{.Size}}"
$prodSize = docker images proyectofinal-web:test-prod --format "{{.Size}}"
Write-Host "Desarrollo: $devSize" -ForegroundColor Cyan
Write-Host "Producción: $prodSize" -ForegroundColor Cyan
Write-Host ""

# Limpiar
Write-Host "Limpiando imágenes de prueba..." -ForegroundColor Yellow
docker rmi proyectofinal-web:test-dev proyectofinal-web:test-prod 2>$null | Out-Null

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "[OK] Verificación completada!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

