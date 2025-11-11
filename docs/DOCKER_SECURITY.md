# Seguridad en Docker - Mejores Prácticas Implementadas

## 🔒 Mejoras de seguridad aplicadas al Dockerfile

### 1. Evitar copiar archivos recursivamente

**Problema identificado por SonarCloud:**
```dockerfile
# ❌ ANTES - Copiaba todo recursivamente
COPY . .
```

**Solución implementada:**
```dockerfile
# ✅ AHORA - Solo copia archivos necesarios explícitamente
COPY tsconfig*.json ./
COPY angular.json ./
COPY src ./src
COPY public ./public
```

**Ventajas:**
- ✅ Evita copiar archivos sensibles accidentalmente
- ✅ Reduce el tamaño de la imagen
- ✅ Mejora la seguridad del contenedor
- ✅ Cache de Docker más eficiente

### 2. Archivo .dockerignore mejorado

El archivo `.dockerignore` excluye:

#### Archivos sensibles:
- `.env` y `.env.*` (excepto `.env.example`)
- Logs y archivos temporales
- Configuraciones de IDE
- Credenciales de Git

#### Archivos innecesarios:
- `node_modules` (se instalan en el contenedor)
- `dist` y `coverage` (generados en el build)
- Archivos de documentación
- Configuraciones de CI/CD

### 3. Multi-stage build optimizado

Cada stage solo copia lo necesario:

**Stage Build (Producción):**
- `package*.json` - Gestión de dependencias
- `tsconfig*.json` - Configuración TypeScript
- `angular.json` - Configuración Angular
- `src/` - Código fuente
- `public/` - Assets públicos

**Stage Development:**
- Mismo que build + `karma.conf.js` para tests

**Stage Production:**
- Solo copia el output del build (`dist/`)
- No incluye código fuente ni dependencias de desarrollo

### 4. Usuario no privilegiado

**Problema identificado por SonarCloud:**
```
The "node" image runs with "root" as the default user. Make sure it is safe here.
```

**Solución implementada:**
```dockerfile
# Crear usuario no privilegiado
RUN addgroup -g 1001 -S nodejs && adduser -S angular -u 1001

# Cambiar propietario del directorio
RUN chown -R angular:nodejs /app

# Cambiar a usuario no privilegiado
USER angular

# Copiar archivos con el propietario correcto
COPY --chown=angular:nodejs package*.json ./
```

**Ventajas:**
- ✅ No ejecuta procesos como root
- ✅ Limita el impacto de vulnerabilidades
- ✅ Cumple con el principio de mínimo privilegio
- ✅ Mejora la seguridad del contenedor

**Usuarios creados:**
- Usuario: `angular` (UID: 1001)
- Grupo: `nodejs` (GID: 1001)

**Aplicado en:**
- ✅ Stage Build
- ✅ Stage Development
- ✅ Stage Production (Nginx ya usa usuario no privilegiado por defecto)

### 5. Variables de entorno

No se incluyen valores sensibles hardcodeados:
```dockerfile
# ✅ Variables sin valores sensibles
ENV API_URL=http://finalproject:8080/api
ENV CHOKIDAR_USEPOLLING=true
```

Las configuraciones sensibles deben pasarse en runtime:
```bash
docker run -e API_KEY=secret proyectofinal-web
```

## 📋 Checklist de seguridad en Docker

- [x] Usar `.dockerignore` completo
- [x] Copiar archivos específicamente (no `COPY . .`)
- [x] No incluir archivos `.env` en la imagen
- [x] No incluir credenciales hardcodeadas
- [x] Usar multi-stage build
- [x] Usar imágenes base oficiales y específicas (`node:20-alpine`)
- [x] **Ejecutar como usuario no privilegiado (no root)**
- [x] Minimizar el tamaño de la imagen final
- [x] Usar `--chown` en COPY para permisos correctos
- [x] Escanear vulnerabilidades con Trivy en CI/CD

## 🔍 Verificación de seguridad

### Script de verificación automática:

Hemos creado scripts para verificar automáticamente todas las mejoras de seguridad:

**En Linux/Mac:**
```bash
chmod +x scripts/verify-docker-security.sh
./scripts/verify-docker-security.sh
```

**En Windows (PowerShell):**
```powershell
.\scripts\verify-docker-security.ps1
```

**El script verifica:**
- ✅ Existencia y contenido de `.dockerignore`
- ✅ Construcción exitosa de imágenes
- ✅ Usuario no privilegiado (UID 1001)
- ✅ Ausencia de archivos sensibles (`.env`, `.git`)
- ✅ Tamaño de imágenes
- ✅ Escaneo de vulnerabilidades con Trivy (si está instalado)

### Verificación manual:

#### Verificar que el contenedor no corre como root:

```bash
# Construir la imagen de desarrollo
docker build --target development -t proyectofinal-web:dev .

# Verificar el usuario que ejecuta el proceso
docker run --rm proyectofinal-web:dev whoami
# Debería mostrar: angular

# Verificar UID/GID
docker run --rm proyectofinal-web:dev id
# Debería mostrar: uid=1001(angular) gid=1001(nodejs)

# Construir imagen de producción
docker build --target production -t proyectofinal-web:prod .

# Verificar usuario en Nginx (debería ser nginx, no root)
docker run --rm proyectofinal-web:prod whoami || echo "nginx user"
```

### Verificar que archivos sensibles no están en la imagen:

```bash
# Construir la imagen
docker build -t proyectofinal-web:test .

# Inspeccionar el contenido
docker run --rm proyectofinal-web:test ls -la /app

# Buscar archivos .env
docker run --rm proyectofinal-web:test find /app -name "*.env"

# Verificar tamaño de la imagen
docker images proyectofinal-web:test
```

### Escaneo de vulnerabilidades:

La pipeline CI/CD incluye Trivy que escanea:
- Vulnerabilidades en dependencias
- Vulnerabilidades en la imagen base
- Configuraciones inseguras

## 📚 Referencias

- [Docker Security Best Practices](https://docs.docker.com/develop/security-best-practices/)
- [OWASP Docker Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html)
- [Trivy Documentation](https://aquasecurity.github.io/trivy/)

## 🚨 Archivos que NUNCA deben estar en la imagen

- ❌ `.env` con credenciales reales
- ❌ Claves SSH privadas
- ❌ Tokens de API
- ❌ Certificados privados
- ❌ Contraseñas o secretos
- ❌ Archivos `.git` (historial completo)
- ❌ Configuraciones locales de IDE
- ❌ Credenciales de bases de datos

## ✅ Resultado

Con estas mejoras:
1. ✅ SonarCloud no muestra warnings de seguridad
2. ✅ La imagen es más pequeña y rápida
3. ✅ No hay archivos sensibles en el contenedor
4. ✅ Cache de Docker funciona mejor
5. ✅ Cumple con las mejores prácticas de seguridad

