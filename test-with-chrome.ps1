# Script PowerShell para configurar la ruta de Chrome antes de ejecutar los tests
# Edita este archivo para especificar la ruta de tu instalación de Chrome

# ============================================
# CONFIGURA AQUI LA RUTA DE CHROME
# ============================================

# Opción 1: Chrome en Program Files (64-bit) - MÁS COMÚN
$chromePath = "C:\Program Files\Google\Chrome Beta\Application\chrome.exe"

# Opción 2: Chrome en Program Files (x86) (32-bit)
# $chromePath = "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"

# Opción 3: Chrome Canary
# $chromePath = "$env:LOCALAPPDATA\Google\Chrome SxS\Application\chrome.exe"

# Opción 4: Chromium
# $chromePath = "C:\Program Files\Chromium\Application\chrome.exe"

# Opción 5: Brave Browser
# $chromePath = "C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe"

# Opción 6: Microsoft Edge (también funciona con Chromium)
# $chromePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

# Opción 7: Ruta personalizada - descomenta y modifica según tu necesidad
# $chromePath = "TU_RUTA_PERSONALIZADA_AQUI"

# ============================================
# BUSCAR CHROME AUTOMATICAMENTE
# ============================================

# Si prefieres que el script busque Chrome automáticamente, descomenta lo siguiente:
# $possiblePaths = @(
#     "C:\Program Files\Google\Chrome\Application\chrome.exe",
#     "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
#     "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe",
#     "$env:LOCALAPPDATA\Google\Chrome SxS\Application\chrome.exe"
# )
#
# foreach ($path in $possiblePaths) {
#     if (Test-Path $path) {
#         $chromePath = $path
#         break
#     }
# }

# ============================================
# EJECUTAR TESTS
# ============================================

Write-Host ""
Write-Host "Configurando Chrome en: $chromePath" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path $chromePath)) {
    Write-Host "ERROR: Chrome no encontrado en la ruta especificada." -ForegroundColor Red
    Write-Host "Por favor, edita test-with-chrome.ps1 y configura la ruta correcta." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Presiona cualquier tecla para salir..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

Write-Host "Chrome encontrado! Ejecutando tests..." -ForegroundColor Green
Write-Host ""

# Configurar variable de entorno
$env:CHROME_BIN = $chromePath

# Ejecutar los tests con npm
npm test -- --watch=false --browsers=ChromeHeadless

Write-Host ""
Write-Host "Tests completados." -ForegroundColor Green
Write-Host "Presiona cualquier tecla para salir..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

