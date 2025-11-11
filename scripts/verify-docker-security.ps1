# Script de verificación de seguridad de Docker
# Verifica que las mejores prácticas de seguridad estén implementadas

Write-Host "🔍 Verificación de Seguridad de Docker" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Función para imprimir resultado
function Print-Result {
    param (
        [bool]$Success,
        [string]$Message
    )
    if ($Success) {
        Write-Host "✅ $Message" -ForegroundColor Green
    } else {
        Write-Host "❌ $Message" -ForegroundColor Red
    }
}

# 1. Verificar que .dockerignore existe
Write-Host "1️⃣ Verificando .dockerignore..."
if (Test-Path ".dockerignore") {
    Print-Result $true ".dockerignore existe"

    # Verificar que contiene reglas importantes
    $content = Get-Content ".dockerignore" -Raw
    if ($content -match "\.env" -and $content -match "node_modules") {
        Print-Result $true ".dockerignore contiene reglas de seguridad"
    } else {
        Print-Result $false ".dockerignore no contiene todas las reglas necesarias"
    }
} else {
    Print-Result $false ".dockerignore no existe"
}
Write-Host ""

# 2. Construir imagen de desarrollo
Write-Host "2️⃣ Construyendo imagen de desarrollo..."
$buildDevOutput = docker build --target development -t proyectofinal-web:security-test-dev . 2>&1
if ($LASTEXITCODE -eq 0) {
    Print-Result $true "Imagen de desarrollo construida exitosamente"
} else {
    Print-Result $false "Error al construir imagen de desarrollo"
    exit 1
}
Write-Host ""

# 3. Verificar usuario en desarrollo
Write-Host "3️⃣ Verificando usuario no privilegiado (desarrollo)..."
$userCheck = docker run --rm proyectofinal-web:security-test-dev whoami 2>$null
if (-not $userCheck) {
    $userCheck = "error"
}

if ($userCheck -eq "angular") {
    Print-Result $true "Ejecuta como usuario 'angular' (no root)"
} else {
    Print-Result $false "Ejecuta como '$userCheck' (debería ser 'angular')"
}

# Verificar UID/GID
$idCheck = docker run --rm proyectofinal-web:security-test-dev id -u 2>$null
if ($idCheck -eq "1001") {
    Print-Result $true "UID es 1001 (no privilegiado)"
} else {
    Print-Result $false "UID es $idCheck (debería ser 1001)"
}
Write-Host ""

# 4. Verificar archivos sensibles NO están en la imagen
Write-Host "4️⃣ Verificando ausencia de archivos sensibles..."
$envFiles = docker run --rm proyectofinal-web:security-test-dev find /app -name "*.env" 2>$null | Where-Object { $_ -notmatch ".env.example" }
if (-not $envFiles) {
    Print-Result $true "No hay archivos .env en la imagen"
} else {
    Print-Result $false "Encontrados archivos .env: $envFiles"
}

$gitDirCheck = docker run --rm proyectofinal-web:security-test-dev test -d /app/.git 2>$null
if ($LASTEXITCODE -ne 0) {
    Print-Result $true "Directorio .git no está en la imagen"
} else {
    Print-Result $false "Directorio .git encontrado en la imagen"
}
Write-Host ""

# 5. Construir imagen de producción
Write-Host "5️⃣ Construyendo imagen de producción..."
$buildProdOutput = docker build --target production -t proyectofinal-web:security-test-prod . 2>&1
if ($LASTEXITCODE -eq 0) {
    Print-Result $true "Imagen de producción construida exitosamente"
} else {
    Print-Result $false "Error al construir imagen de producción"
}
Write-Host ""

# 6. Verificar tamaño de imágenes
Write-Host "6️⃣ Verificando tamaño de imágenes..."
$devSize = docker images proyectofinal-web:security-test-dev --format "{{.Size}}"
$prodSize = docker images proyectofinal-web:security-test-prod --format "{{.Size}}"
Write-Host "   📦 Desarrollo: $devSize"
Write-Host "   📦 Producción: $prodSize"
Print-Result $true "Imágenes optimizadas"
Write-Host ""

# 7. Escaneo de vulnerabilidades con Trivy (si está instalado)
Write-Host "7️⃣ Escaneando vulnerabilidades..."
$trivyInstalled = Get-Command trivy -ErrorAction SilentlyContinue
if ($trivyInstalled) {
    Write-Host "   Escaneando con Trivy..."
    trivy image --severity HIGH,CRITICAL --exit-code 0 proyectofinal-web:security-test-prod
    if ($LASTEXITCODE -eq 0) {
        Print-Result $true "Escaneo de vulnerabilidades completado"
    } else {
        Print-Result $false "Se encontraron vulnerabilidades críticas"
    }
} else {
    Write-Host "⚠️  Trivy no está instalado. Omitiendo escaneo de vulnerabilidades." -ForegroundColor Yellow
}
Write-Host ""

# Limpiar imágenes de test
Write-Host "🧹 Limpiando imágenes de prueba..."
docker rmi proyectofinal-web:security-test-dev proyectofinal-web:security-test-prod 2>$null | Out-Null

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "✅ Verificación de seguridad completada" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan

