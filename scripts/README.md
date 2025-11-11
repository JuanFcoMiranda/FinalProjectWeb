# Scripts de Verificación

Este directorio contiene scripts útiles para el proyecto.

## verify-docker-security

Script para verificar que se han implementado correctamente las mejores prácticas de seguridad en Docker.

### Uso

**Linux/Mac:**
```bash
chmod +x verify-docker-security.sh
./verify-docker-security.sh
```

**Windows (PowerShell):**
```powershell
.\verify-docker-security.ps1
```

### Verificaciones realizadas

1. **`.dockerignore` existe y contiene reglas de seguridad**
   - Verifica que archivos sensibles están excluidos

2. **Construcción de imágenes**
   - Construye imagen de desarrollo
   - Construye imagen de producción

3. **Usuario no privilegiado**
   - Verifica que el contenedor NO corre como root
   - Verifica UID 1001 (usuario angular)

4. **Ausencia de archivos sensibles**
   - Verifica que no hay archivos `.env` (excepto `.env.example`)
   - Verifica que no hay directorio `.git`

5. **Tamaño de imágenes**
   - Muestra el tamaño de las imágenes construidas

6. **Escaneo de vulnerabilidades**
   - Si Trivy está instalado, escanea vulnerabilidades

### Requisitos

- Docker instalado y corriendo
- (Opcional) Trivy para escaneo de vulnerabilidades

### Instalar Trivy

**Linux/Mac:**
```bash
# Usando Homebrew
brew install trivy

# O descarga el binario
wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo apt-key add -
echo "deb https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main" | sudo tee -a /etc/apt/sources.list.d/trivy.list
sudo apt-get update
sudo apt-get install trivy
```

**Windows:**
```powershell
# Usando Chocolatey
choco install trivy

# O usando Scoop
scoop install trivy
```

### Ejemplo de salida

```
🔍 Verificación de Seguridad de Docker
======================================

1️⃣ Verificando .dockerignore...
✅ .dockerignore existe
✅ .dockerignore contiene reglas de seguridad

2️⃣ Construyendo imagen de desarrollo...
✅ Imagen de desarrollo construida exitosamente

3️⃣ Verificando usuario no privilegiado (desarrollo)...
✅ Ejecuta como usuario 'angular' (no root)
✅ UID es 1001 (no privilegiado)

4️⃣ Verificando ausencia de archivos sensibles...
✅ No hay archivos .env en la imagen
✅ Directorio .git no está en la imagen

5️⃣ Construyendo imagen de producción...
✅ Imagen de producción construida exitosamente

6️⃣ Verificando tamaño de imágenes...
   📦 Desarrollo: 500MB
   📦 Producción: 45MB
✅ Imágenes optimizadas

7️⃣ Escaneando vulnerabilidades...
   Escaneando con Trivy...
✅ Escaneo de vulnerabilidades completado

======================================
✅ Verificación de seguridad completada
======================================
```

### Integración con CI/CD

Puedes añadir este script a tu pipeline para verificar automáticamente la seguridad:

```yaml
- name: Verify Docker Security
  run: ./scripts/verify-docker-security.sh
```

## Troubleshooting

### Error: "permission denied"
```bash
chmod +x verify-docker-security.sh
```

### Error: "Docker daemon not running"
```bash
# Inicia Docker Desktop o el daemon de Docker
sudo systemctl start docker  # Linux
```

### Script tarda mucho
Es normal. La construcción de imágenes y el escaneo pueden tardar varios minutos.

