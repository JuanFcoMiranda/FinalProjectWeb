# Actualización de Pipelines GitHub Actions para Vitest

## Resumen de Cambios

Se han actualizado las pipelines de GitHub Actions para usar Vitest en lugar de Karma/Jasmine.

---

## Archivos Modificados

### 1. `.github/workflows/ci.yml`
Pipeline principal de CI/CD

**Cambios realizados:**

#### Tests
```yaml
# ANTES (Karma/Jasmine)
- name: Run tests
  run: npm run test -- --no-watch --no-progress --browsers=ChromeHeadlessCI --code-coverage

# DESPUÉS (Vitest)
- name: Run tests with Vitest
  id: run-tests
  run: npm run test:ci
  continue-on-error: true

- name: Generate CI Summary (coverage)
  if: always()
  env:
    TEST_OUTCOME: ${{ steps.run-tests.outcome }}
  run: node .github/scripts/generate-summary.js

- name: Check test results
  if: steps.run-tests.outcome == 'failure'
  run: |
    echo "::error::Tests failed. Check the test output for details."
    exit 1
```

#### SonarCloud
```yaml
# ANTES
-Dsonar.typescript.lcov.reportPaths=coverage/final-project-web/lcov.info

# DESPUÉS
-Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
-Dsonar.typescript.lcov.reportPaths=coverage/lcov.info
```

### 2. `.github/workflows/pr-verify.yml`
Pipeline de verificación de Pull Requests

**Cambios realizados:**

```yaml
# ANTES
- name: Run tests
  run: npm run test -- --no-watch --no-progress --browsers=ChromeHeadlessCI

# DESPUÉS
- name: Run tests with Vitest
  id: run-tests
  run: npm run test:run
  continue-on-error: false

- name: Upload test results
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: test-results
    path: coverage/
    retention-days: 7

- name: Comment PR with test results
  # ... comentario automático con resultados y cobertura
```

### 3. `.github/scripts/generate-summary.js`
Script para generar resumen de CI

**Reescritura completa** para trabajar con el formato de coverage de Vitest:

- Antes: leía archivos de Karma en `coverage/proyectoFinal/`
- Ahora: lee archivos de Vitest en `coverage/`
- Simplificado para mostrar solo métricas de coverage (ya no tests individuales)
- Usa `coverage-summary.json` generado por Vitest

### 4. `sonar-project.properties`
Configuración de SonarCloud

```ini
# ANTES
sonar.typescript.lcov.reportPaths=coverage/proyectoFinal/lcov.info
sonar.javascript.lcov.reportPaths=coverage/proyectoFinal/lcov.info

# DESPUÉS
sonar.typescript.lcov.reportPaths=coverage/lcov.info
sonar.javascript.lcov.reportPaths=coverage/lcov.info
```

### 5. `vitest.config.ts`
Configuración de Vitest

**Añadido reporter `json-summary`:**
```typescript
coverage: {
  provider: 'v8',
  reporter: ['text', 'json', 'json-summary', 'html', 'lcov'],
  // ...
}
```

---

## Nuevos Comandos npm

Los workflows ahora usan estos comandos definidos en `package.json`:

```json
{
  "scripts": {
    "test": "vitest",                    // Modo watch
    "test:run": "vitest run",            // Una ejecución (para PRs)
    "test:ci": "vitest run --coverage",  // CI/CD con coverage
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui"
  }
}
```

---

## Archivos de Coverage Generados

Vitest genera los siguientes archivos en `coverage/`:

```
coverage/
├── lcov.info                    # Para SonarCloud
├── coverage-summary.json        # Para GitHub Actions summary
├── coverage-final.json          # Detalles completos
├── index.html                   # Reporte HTML
└── lcov-report/                 # Reporte HTML detallado
```

---

## Funcionalidades Nuevas

### 1. Comentarios Automáticos en PRs

El workflow `pr-verify.yml` ahora comenta automáticamente en los PRs con:
- ✅/❌ Estado de los tests
- 📊 Tabla de cobertura (statements, branches, functions, lines)
- 🟢🟡🔴 Indicadores visuales de calidad

### 2. GitHub Actions Summary

El workflow `ci.yml` genera un resumen visual en la pestaña "Summary" con:
- 📊 Tabla de métricas de coverage
- 📈 Barra de progreso visual
- 📁 Coverage por archivo (desplegable)
- 💡 Tips y recomendaciones

### 3. Sin necesidad de Chrome

Los workflows ya no necesitan:
- ❌ Instalación de Chrome/Chromium
- ❌ ChromeHeadless
- ❌ Configuraciones de browser

Vitest usa `jsdom` directamente, lo que hace los tests más rápidos y simples.

---

## Ventajas de los Nuevos Workflows

### 1. **Más rápidos** ⚡
- No necesitan instalar/configurar Chrome
- Vitest es significativamente más rápido que Karma

### 2. **Más simples** 🎯
- Menos configuración
- Comandos más claros
- Sin dependencia de navegadores

### 3. **Mejor feedback** 📊
- Comentarios automáticos en PRs
- Summaries visuales en CI
- Reportes más claros

### 4. **Más modernos** 🚀
- Usa herramientas modernas (Vite, Vitest)
- Compatible con el ecosistema actual
- Mejor mantenibilidad

---

## Verificación de la Configuración

Para verificar que todo funciona correctamente:

### Localmente:
```bash
# Ejecutar tests
npm test

# Ejecutar tests con coverage (como en CI)
npm run test:ci

# Verificar archivos generados
ls coverage/
# Deberías ver: lcov.info, coverage-summary.json, index.html

# Verificar que SonarCloud puede leer el coverage
cat coverage/lcov.info | head -20
```

### En GitHub Actions:

1. **Push a develop/main**: Se ejecutará `ci.yml`
   - Verifica el tab "Summary" para ver el reporte de coverage
   - Verifica que SonarCloud reciba el coverage correctamente

2. **Crear un PR**: Se ejecutará `pr-verify.yml`
   - Verifica que se añada un comentario con los resultados
   - Verifica el artifact "test-results" en el workflow

---

## Troubleshooting

### Si los tests fallan en CI pero funcionan localmente:

1. Verifica que todas las dependencias estén en `package.json`
2. Asegúrate de que `npm ci` se ejecuta antes de los tests
3. Revisa los logs del workflow para errores específicos

### Si SonarCloud no recibe coverage:

1. Verifica que existe `coverage/lcov.info`
2. Revisa la configuración en `sonar-project.properties`
3. Verifica los parámetros en el workflow

### Si el summary no se genera:

1. Verifica que `coverage/coverage-summary.json` existe
2. Revisa el script `.github/scripts/generate-summary.js`
3. Asegúrate de que `npm run test:ci` genera coverage

---

## Próximos Pasos

### Opcional: Habilitar Codecov

Si quieres usar Codecov además de SonarCloud:

```yaml
- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v4
  with:
    files: ./coverage/lcov.info
    token: ${{ secrets.CODECOV_TOKEN }}
```

### Opcional: Paralelizar Tests

Para proyectos más grandes, puedes paralelizar:

```yaml
strategy:
  matrix:
    shard: [1, 2, 3, 4]
    
steps:
  - run: npm run test:ci -- --shard=${{ matrix.shard }}/4
```

---

## Referencias

- [Vitest CI Documentation](https://vitest.dev/guide/ci.html)
- [GitHub Actions - Job Summaries](https://github.blog/2022-05-09-supercharging-github-actions-with-job-summaries/)
- [SonarCloud JavaScript Coverage](https://docs.sonarcloud.io/enriching/test-coverage/javascript-typescript-test-coverage/)

---

**Estado**: ✅ Pipelines actualizadas y funcionando
**Fecha**: 29/11/2025
**Framework**: Vitest 4.0.14
**Angular**: 21.0.1

