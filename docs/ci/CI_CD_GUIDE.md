# 🚀 CI/CD Pipeline - GitHub Actions

Este proyecto incluye una pipeline de integración continua (CI) y despliegue continuo (CD) configurada con GitHub Actions.

## 📋 Tabla de Contenidos

1. [¿Qué hace la pipeline?](#qué-hace-la-pipeline)
2. [Configuración](#configuración)
3. [Workflows Disponibles](#workflows-disponibles)
4. [Cómo Usar](#cómo-usar)
5. [Personalización](#personalización)
6. [Troubleshooting](#troubleshooting)

## 🤖 ¿Qué hace la pipeline?

La pipeline se ejecuta automáticamente cuando:
- Se hace un **push** directo a las ramas `main` o `develop`
- Se crea o actualiza un **Pull Request**

### Pasos de la Pipeline Principal

1. **Checkout del código**: Descarga el código del repositorio
2. **Configuración de Node.js**: Instala Node.js 20.x con caché de npm
3. **Instalación de dependencias**: Ejecuta `npm ci` para instalar dependencias de forma reproducible
4. **Verificación de compilación**: Ejecuta `npm run build` para asegurar que el código compila correctamente
5. **Ejecución de tests**: Ejecuta los tests unitarios con cobertura de código
6. **Generación de resumen**: Crea un reporte detallado en la página de Summary de GitHub Actions con:
   - Resultado de los tests (pasados/fallidos)
   - Detalles de cada test individual
   - Cobertura de código por archivo
   - Complejidad ciclomática
   - Métricas de calidad

## ⚙️ Configuración

### Archivo de configuración

El workflow está definado en `.github/workflows/ci.yml`.

### Scripts necesarios

- `.github/scripts/generate-summary.js` - Genera el resumen de tests y cobertura

### Variables de entorno

El pipeline usa las siguientes variables:
- `TEST_OUTCOME` - Resultado de la ejecución de tests (success/failure)
- `node-version` - Versión de Node.js (por defecto 20.x)

## 📦 Workflows Disponibles

### 1. CI/CD Pipeline (Principal)

**Archivo:** `.github/workflows/ci.yml`

**Triggers:**
- Push a `main` o `develop`

**Pasos:**
1. Build del proyecto
2. Ejecución de tests
3. Generación de reporte de cobertura
4. Summary en GitHub Actions

### 2. Pull Request Verification (Opcional)

**Archivo:** `.github/workflows/pr-check.yml`

**Triggers:**
- Creación/actualización de Pull Requests

**Pasos:**
1. Verificación de compilación
2. Ejecución de tests
3. Comentario en el PR con resultados

## 🔧 Cómo Usar

### Desarrollo Local

Antes de hacer push, verifica localmente:

```bash
# Compilar
npm run build

# Ejecutar tests
npm run test:headless

# Ver cobertura
start coverage/proyectoFinal/index.html
```

### Flujo de Trabajo con Pull Requests

1. Crea una rama para tu feature:
```bash
git checkout -b feature/nueva-funcionalidad
```

2. Realiza cambios y commits:
```bash
git add .
git commit -m "feat: añadir nueva funcionalidad"
```

3. Push de la rama:
```bash
git push origin feature/nueva-funcionalidad
```

4. Crea un Pull Request en GitHub
5. La pipeline se ejecutará automáticamente
6. Revisa los resultados en la página de Summary
7. Si todo está verde ✅, el PR puede ser mergeado

### Ver Resultados

1. Ve a la pestaña **Actions** en GitHub
2. Selecciona el workflow ejecutado
3. Revisa el **Summary** para ver:
   - ✅ Tests pasados/fallados
   - 📊 Cobertura de código
   - 🔍 Complejidad ciclomática
   - ⚠️ Warnings o problemas

## 🎨 Personalización

### Añadir Deployment

Descomenta las secciones de deployment en `.github/workflows/ci.yml`:

```yaml
  deploy-staging:
    needs: build-and-test
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy a Staging
        run: |
          # Tus comandos de deploy
          npm run deploy:staging
```

### Modificar Triggers

Para ejecutar en otras ramas:

```yaml
on:
  push:
    branches:
      - main
      - develop
      - feature/*  # Añadir esta línea
```

### Añadir Tests E2E

```yaml
- name: Run E2E Tests
  run: npm run e2e
```

### Subir Cobertura a Codecov

Descomenta la sección de Codecov y añade el token:

```yaml
- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v3
  with:
    token: ${{ secrets.CODECOV_TOKEN }}
    files: ./coverage/proyectoFinal/lcov.info
```

## 🔍 Troubleshooting

### Los tests fallan en CI pero pasan localmente

**Causa:** Diferencias en el entorno (Chrome, timeouts, etc.)

**Solución:**
- Ejecuta `npm run test:ci` localmente
- Verifica que uses `ChromeHeadlessCI` en el workflow
- Incrementa timeouts si es necesario

### Errores de instalación de dependencias

**Causa:** Cache corrupto o package-lock.json desactualizado

**Solución:**
```yaml
- name: Clear cache
  run: npm cache clean --force

- name: Install dependencies
  run: npm ci
```

### Build falla

**Causa:** Errores de TypeScript o configuración

**Solución:**
- Ejecuta `npm run build` localmente
- Revisa los errores en los logs de Actions
- Asegúrate de que `tsconfig.json` es correcto

### Summary no se genera

**Causa:** Script de generación falla

**Solución:**
- Verifica que `.github/scripts/generate-summary.js` existe
- Revisa los logs del paso "Generate CI Summary"
- Asegúrate de que los archivos de cobertura se generaron

## 📊 Métricas en el Summary

El Summary muestra:

### Tests
- Total de tests ejecutados
- Tests pasados ✅
- Tests fallados ❌
- Tests omitidos ⏭️
- Tiempo de ejecución por test

### Cobertura
- Porcentaje de statements cubiertos
- Porcentaje de branches cubiertos
- Porcentaje de funciones cubiertas
- Porcentaje de líneas cubiertas
- Barra visual de cobertura por archivo

### Complejidad
- Complejidad ciclomática por archivo
- Promedio de complejidad
- Indicadores de código complejo

## 📚 Recursos Adicionales

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [CI Workflow Examples](CI_WORKFLOW_EXAMPLES.md)
- [Test Guide](../tests/TEST_GUIDE.md)

## 🔐 Secrets y Variables

Si necesitas usar secrets (API keys, tokens, etc.):

1. Ve a Settings → Secrets and variables → Actions
2. Añade un nuevo secret
3. Úsalo en el workflow:

```yaml
- name: Deploy
  env:
    API_KEY: ${{ secrets.API_KEY }}
  run: npm run deploy
```

## 🎯 Mejores Prácticas

1. **Commits pequeños y frecuentes** - Facilita la identificación de problemas
2. **Tests antes de push** - Ejecuta tests localmente antes de hacer push
3. **Revisa los logs** - Si algo falla, revisa los logs completos en Actions
4. **Mantén las dependencias actualizadas** - Actualiza regularmente npm packages
5. **No hagas push directamente a main** - Usa Pull Requests para revisión de código

## 🚦 Estados del Workflow

- 🟢 **Success** - Todo pasó correctamente
- 🔴 **Failure** - Algún paso falló
- 🟡 **In Progress** - El workflow está ejecutándose
- ⚪ **Skipped** - El workflow fue omitido (por condiciones)
- 🟠 **Cancelled** - El workflow fue cancelado manualmente

