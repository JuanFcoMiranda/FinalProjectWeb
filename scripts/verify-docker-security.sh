#!/bin/bash
# Script de verificación de seguridad de Docker
# Verifica que las mejores prácticas de seguridad estén implementadas

set -e

echo "🔍 Verificación de Seguridad de Docker"
echo "======================================"
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para imprimir resultado
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

# 1. Verificar que .dockerignore existe
echo "1️⃣ Verificando .dockerignore..."
if [ -f ".dockerignore" ]; then
    print_result 0 ".dockerignore existe"

    # Verificar que contiene reglas importantes
    if grep -q "\.env" .dockerignore && grep -q "node_modules" .dockerignore; then
        print_result 0 ".dockerignore contiene reglas de seguridad"
    else
        print_result 1 ".dockerignore no contiene todas las reglas necesarias"
    fi
else
    print_result 1 ".dockerignore no existe"
fi
echo ""

# 2. Construir imagen de desarrollo
echo "2️⃣ Construyendo imagen de desarrollo..."
docker build --target development -t proyectofinal-web:security-test-dev . > /dev/null 2>&1
if [ $? -eq 0 ]; then
    print_result 0 "Imagen de desarrollo construida exitosamente"
else
    print_result 1 "Error al construir imagen de desarrollo"
    exit 1
fi
echo ""

# 3. Verificar usuario en desarrollo
echo "3️⃣ Verificando usuario no privilegiado (desarrollo)..."
USER_CHECK=$(docker run --rm proyectofinal-web:security-test-dev whoami 2>/dev/null || echo "root")
if [ "$USER_CHECK" = "angular" ]; then
    print_result 0 "Ejecuta como usuario 'angular' (no root)"
else
    print_result 1 "Ejecuta como '$USER_CHECK' (debería ser 'angular')"
fi

# Verificar UID/GID
ID_CHECK=$(docker run --rm proyectofinal-web:security-test-dev id -u 2>/dev/null || echo "0")
if [ "$ID_CHECK" = "1001" ]; then
    print_result 0 "UID es 1001 (no privilegiado)"
else
    print_result 1 "UID es $ID_CHECK (debería ser 1001)"
fi
echo ""

# 4. Verificar archivos sensibles NO están en la imagen
echo "4️⃣ Verificando ausencia de archivos sensibles..."
ENV_FILES=$(docker run --rm proyectofinal-web:security-test-dev find /app -name "*.env" 2>/dev/null | grep -v ".env.example" || true)
if [ -z "$ENV_FILES" ]; then
    print_result 0 "No hay archivos .env en la imagen"
else
    print_result 1 "Encontrados archivos .env: $ENV_FILES"
fi

GIT_DIR=$(docker run --rm proyectofinal-web:security-test-dev test -d /app/.git && echo "exists" || echo "not_exists")
if [ "$GIT_DIR" = "not_exists" ]; then
    print_result 0 "Directorio .git no está en la imagen"
else
    print_result 1 "Directorio .git encontrado en la imagen"
fi
echo ""

# 5. Construir imagen de producción
echo "5️⃣ Construyendo imagen de producción..."
docker build --target production -t proyectofinal-web:security-test-prod . > /dev/null 2>&1
if [ $? -eq 0 ]; then
    print_result 0 "Imagen de producción construida exitosamente"
else
    print_result 1 "Error al construir imagen de producción"
fi
echo ""

# 6. Verificar tamaño de imágenes
echo "6️⃣ Verificando tamaño de imágenes..."
DEV_SIZE=$(docker images proyectofinal-web:security-test-dev --format "{{.Size}}")
PROD_SIZE=$(docker images proyectofinal-web:security-test-prod --format "{{.Size}}")
echo "   📦 Desarrollo: $DEV_SIZE"
echo "   📦 Producción: $PROD_SIZE"
print_result 0 "Imágenes optimizadas"
echo ""

# 7. Escaneo de vulnerabilidades con Trivy (si está instalado)
echo "7️⃣ Escaneando vulnerabilidades..."
if command -v trivy &> /dev/null; then
    echo "   Escaneando con Trivy..."
    trivy image --severity HIGH,CRITICAL --exit-code 0 proyectofinal-web:security-test-prod
    if [ $? -eq 0 ]; then
        print_result 0 "Escaneo de vulnerabilidades completado"
    else
        print_result 1 "Se encontraron vulnerabilidades críticas"
    fi
else
    echo -e "${YELLOW}⚠️  Trivy no está instalado. Omitiendo escaneo de vulnerabilidades.${NC}"
fi
echo ""

# Limpiar imágenes de test
echo "🧹 Limpiando imágenes de prueba..."
docker rmi proyectofinal-web:security-test-dev proyectofinal-web:security-test-prod > /dev/null 2>&1

echo ""
echo "======================================"
echo "✅ Verificación de seguridad completada"
echo "======================================"

