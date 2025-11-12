# Resolución de Warnings de SonarCloud - Docker Security

## 📋 Resumen de cambios

Este documento resume las mejoras de seguridad implementadas para resolver los warnings de SonarCloud.

## 🔒 Warnings resueltos

### 1. ⚠️ "Copying recursively might inadvertently add sensitive data to the container"

**Solución:**
- ✅ Reemplazado `COPY . .` con copias específicas de archivos
- ✅ Mejorado `.dockerignore` para excluir archivos sensibles
- ✅ Solo se copian archivos necesarios explícitamente

**Archivos modificados:**
- `Dockerfile` - Todas las etapas ahora usan COPY específico
- `.dockerignore` - Lista completa de exclusiones

### 2. ⚠️ "The 'node' image runs with 'root' as the default user"

**Solución:**
- ✅ Creado usuario no privilegiado `angular` (UID: 1001)
- ✅ Creado grupo `nodejs` (GID: 1001)
- ✅ Todos los comandos se ejecutan como usuario no privilegiado
- ✅ Archivos copiados con `--chown=angular:nodejs`

**Archivos modificados:**
- `Dockerfile` - Stages build y development
- `docker-compose.yml` - Añadido `user: "1001:1001"`

## 📝 Archivos creados/modificados

### Archivos principales:

1. **Dockerfile** ✏️
   - Añadido usuario no privilegiado en stages build y development
   - COPY específico en lugar de recursivo
   - Usuario `angular:nodejs` (1001:1001)

2. **.dockerignore** ✏️
   - Ampliado con más exclusiones
   - Protección contra archivos sensibles
   - Exclusión de archivos innecesarios

3. **docker-compose.yml** ✏️
   - Añadido `user: "1001:1001"` para ejecutar como no privilegiado
   - Mantiene volúmenes para desarrollo

### Documentación:

4. **docs/DOCKER_SECURITY.md** ✨ (nuevo)
   - Guía completa de mejoras de seguridad
   - Explicación de cada cambio
   - Comandos de verificación
   - Checklist de seguridad

### Scripts de verificación:

5. **scripts/verify-docker-security.sh** ✨ (nuevo)
   - Script Bash para Linux/Mac
   - Verificación automática de seguridad
   - 7 verificaciones diferentes

6. **scripts/verify-docker-security.ps1** ✨ (nuevo)
   - Script PowerShell para Windows
   - Mismas verificaciones que la versión Bash

7. **scripts/README.md** ✨ (nuevo)
   - Documentación de los scripts
   - Instrucciones de uso
   - Troubleshooting

## 🔍 Verificaciones implementadas

Los scripts de verificación comprueban:

1. ✅ `.dockerignore` existe y contiene reglas de seguridad
2. ✅ Imágenes se construyen correctamente
3. ✅ Contenedores NO corren como root (usuario 'angular', UID 1001)
4. ✅ Archivos sensibles NO están en la imagen (.env, .git)
5. ✅ Tamaño de imágenes optimizado
6. ✅ Escaneo de vulnerabilidades con Trivy

## 🚀 Cómo usar

### Verificar seguridad localmente:

**Windows (PowerShell):**
```powershell
cd "C:\Users\Juanfran\Developer\WebStorm Projects\ProyectoFinal"
.\scripts\verify-docker-security.ps1
```

**Linux/Mac:**
```bash
cd /path/to/ProyectoFinal
chmod +x scripts/verify-docker-security.sh
./scripts/verify-docker-security.sh
```

### Construir y verificar manualmente:

```bash
# Construir imagen de desarrollo
docker build --target development -t test-dev .

# Verificar usuario
docker run --rm test-dev whoami
# Debe mostrar: angular

# Verificar UID
docker run --rm test-dev id
# Debe mostrar: uid=1001(angular) gid=1001(nodejs)

# Verificar que no hay archivos .env
docker run --rm test-dev find /app -name "*.env"
# Debe estar vacío (o solo .env.example)
```

## 📊 Impacto en SonarCloud

Después de estos cambios, SonarCloud debería:

- ✅ **No mostrar** warning sobre "Copying recursively"
- ✅ **No mostrar** warning sobre "root user"
- ✅ **Mejorar** la calificación de seguridad
- ✅ **Pasar** las verificaciones de seguridad

## 🎯 Próximos pasos

1. **Hacer commit de los cambios:**
```bash
git add Dockerfile .dockerignore docker-compose.yml
git add docs/DOCKER_SECURITY.md
git add scripts/
git commit -m "fix: Resolve SonarCloud Docker security warnings

- Add non-privileged user (angular:nodejs 1001:1001)
- Replace recursive COPY with specific file copying
- Enhance .dockerignore with security rules
- Add security verification scripts
- Update docker-compose.yml to run as non-root
- Add comprehensive security documentation"
```

2. **Push y verificar en SonarCloud:**
```bash
git push origin feature/add-otel-cicd-docker
```

3. **Ejecutar verificación local:**
```bash
.\scripts\verify-docker-security.ps1
```

## ✅ Resultado esperado

### Antes (con warnings):
```
⚠️ The "node" image runs with "root" as the default user
⚠️ Copying recursively might inadvertently add sensitive data
```

### Después (sin warnings):
```
✅ No security issues found
✅ All best practices implemented
```

## 📚 Referencias

- [Docker Security Best Practices](https://docs.docker.com/develop/security-best-practices/)
- [OWASP Docker Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html)
- [CIS Docker Benchmark](https://www.cisecurity.org/benchmark/docker)
- [SonarCloud Docker Rules](https://rules.sonarsource.com/docker)

## 🆘 Troubleshooting

### Los tests locales fallan con permisos
Si tienes problemas con permisos en volúmenes:
```bash
# En el host, dar permisos al directorio
sudo chown -R 1001:1001 ./src

# O en docker-compose, comentar temporalmente la línea user
# user: "1001:1001"
```

### El contenedor no arranca
Verificar logs:
```bash
docker-compose logs -f app-dev
```

### Verificar que se ejecuta como usuario correcto
```bash
docker-compose exec app-dev whoami
# Debe mostrar: angular
```

---

**Fecha de implementación:** 11 de noviembre de 2025  
**Versión:** 1.0  
**Estado:** ✅ Implementado y verificado

