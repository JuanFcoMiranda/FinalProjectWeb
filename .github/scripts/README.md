# Scripts de GitHub Actions

Este directorio contiene scripts utilizados por los workflows de GitHub Actions.

## generate-summary.js

Script que genera un resumen detallado de los resultados de los tests y la cobertura de código para mostrar en la página de Summary de GitHub Actions.

### Funcionalidad

- **Resumen de Tests**: Muestra el número total de tests ejecutados, pasados, fallados y omitidos
- **Detalle de Tests**: Tabla con cada test individual, su estado y tiempo de ejecución
- **Detalles de Errores**: Muestra información detallada de los tests que fallaron
- **Cobertura de Código**: Muestra métricas de cobertura (líneas, funciones, branches)
- **Barra de Progreso**: Visualización gráfica del porcentaje de cobertura

### Variables de Entorno Requeridas

- `GITHUB_STEP_SUMMARY`: Ruta al archivo de resumen (proporcionada automáticamente por GitHub Actions)
- `TEST_OUTCOME`: Resultado de la ejecución de los tests (`success` o `failure`)

### Archivos de Entrada

- `coverage/proyectoFinal/test-results.json`: Resultados detallados de los tests
- `coverage/proyectoFinal/lcov.info`: Información de cobertura de código

### Uso

Este script se ejecuta automáticamente como parte del workflow de CI/CD. Para ejecutarlo localmente (con fines de testing):

```bash
# Asegúrate de tener los archivos de cobertura generados
npm run test -- --no-watch --code-coverage

# Ejecuta el script (necesitas simular las variables de entorno)
set GITHUB_STEP_SUMMARY=summary.md
set TEST_OUTCOME=success
node .github/scripts/generate-summary.js
```

### Salida

El script genera markdown formateado que se muestra en la página de Summary del workflow de GitHub Actions, incluyendo:

- 📊 Encabezado del reporte
- ✅/❌ Estado de los tests
- 📋 Tabla de resultados individuales
- 🟢/🟡/🔴 Estado de la cobertura con indicador de color
- 📈 Barra visual de progreso de cobertura

