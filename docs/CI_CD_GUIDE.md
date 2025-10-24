# CI/CD Pipeline - GitHub Actions

Este proyecto incluye una pipeline de integración continua (CI) configurada con GitHub Actions.

## 🚀 ¿Qué hace la pipeline?

La pipeline se ejecuta automáticamente cuando:
- Se crea o actualiza un **Pull Request** hacia las ramas `main` o `develop`
- Se hace un **push** directo a las ramas `main` o `develop`

### Pasos de la pipeline:

1. **Checkout del código**: Descarga el código del repositorio
2. **Configuración de Node.js**: Instala Node.js 20.x
3. **Instalación de dependencias**: Ejecuta `npm ci` para instalar dependencias de forma reproducible
4. **Verificación de compilación**: Ejecuta `npm run build` para asegurar que el código compila correctamente
5. **Ejecución de tests**: Ejecuta `npm run test:headless` para correr todos los tests unitarios
6. **Subida de cobertura**: (Opcional) Sube el reporte de cobertura a Codecov

## 📋 Requisitos previos

### Para que funcione en GitHub Actions:

- El repositorio debe estar en GitHub
- No se requiere configuración adicional de Chrome ya que GitHub Actions provee runners con Chrome preinstalado

### Scripts necesarios en package.json:

```json
{
  "scripts": {
    "build": "ng build",
    "test:headless": "ng test --watch=false --browsers=ChromeHeadless"
  }
}
```

## 🔧 Configuración de cobertura (Opcional)

Si deseas visualizar la cobertura de código:

1. Crea una cuenta en [Codecov.io](https://codecov.io/)
2. Conecta tu repositorio de GitHub
3. Los reportes de cobertura se subirán automáticamente

Si no deseas usar Codecov, puedes eliminar el último paso del archivo `.github/workflows/ci.yml`.

## 📊 Ver el estado de la pipeline

- Ve a la pestaña **Actions** en tu repositorio de GitHub
- Verás todas las ejecuciones de la pipeline
- Cada Pull Request mostrará el estado de los checks (✓ o ✗)

## 🛠️ Personalización

### Cambiar la versión de Node.js

Edita `.github/workflows/ci.yml` y modifica:

```yaml
strategy:
  matrix:
    node-version: [20.x]  # Cambia esto a la versión deseada
```

### Agregar más ramas

Modifica las secciones `on.pull_request.branches` y `on.push.branches`:

```yaml
on:
  pull_request:
    branches:
      - main
      - develop
      - feature/*  # Agrega más patrones de ramas
```

### Ejecutar en diferentes sistemas operativos

Cambia `runs-on`:

```yaml
runs-on: ubuntu-latest  # También: windows-latest, macos-latest
```

O usa una matriz para probar en múltiples sistemas:

```yaml
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest, macos-latest]
    node-version: [20.x]

runs-on: ${{ matrix.os }}
```

## ❌ Solución de problemas

### Los tests fallan en CI pero funcionan localmente

- Asegúrate de que `ChromeHeadless` esté configurado en `karma.conf.js`
- Verifica que todos los tests sean determinísticos (no dependan de timings específicos)
- Revisa los logs en GitHub Actions para ver errores específicos

### Error de compilación

- Ejecuta `npm run build` localmente antes de hacer commit
- Asegúrate de que todas las dependencias estén en `package.json`
- Verifica que no haya errores de TypeScript

### Los tests tardan mucho

- Considera usar `--code-coverage=false` para tests más rápidos
- Optimiza tests lentos o con muchos timeouts

## 📝 Buenas prácticas

1. **Siempre** ejecuta `npm run build` y `npm run test:headless` localmente antes de crear un PR
2. Mantén los tests rápidos y confiables
3. No ignores fallos de CI - investígalos y corrígelos
4. Revisa los reportes de cobertura para mantener calidad del código

## 📚 Más información

- [Ejemplos de Workflow CI](CI_WORKFLOW_EXAMPLES.md) - Guía práctica con ejemplos de uso
- [Documentación de GitHub Actions](https://docs.github.com/en/actions)
- [Angular Testing Guide](https://angular.dev/guide/testing)
- [Karma Configuration](https://karma-runner.github.io/latest/config/configuration-file.html)

