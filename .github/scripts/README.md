# Scripts de GitHub Actions

Este directorio contiene scripts utilizados por los workflows de GitHub Actions.

## generate-summary.js

Script modular y bien estructurado que genera un resumen detallado de los resultados de los tests y la cobertura de código para mostrar en la página de Summary de GitHub Actions.

### 📁 Estructura del Código

El script está organizado en las siguientes secciones:

#### 1. **Constants** (Constantes)
- `FILES`: Rutas de archivos de entrada (test results, lcov, coverage summary)
- `COMPLEXITY_THRESHOLDS`: Umbrales para clasificar la complejidad (Low, Medium, High)
- `COVERAGE_THRESHOLDS`: Umbrales para clasificar la cobertura (Excellent, Good, Needs Improvement)

#### 2. **Utility Functions** (Funciones de Utilidad)
- `getTestIcon()`: Obtiene el icono según el estado del test (✅/⏭️/❌)
- `getComplexityIndicator()`: Obtiene el indicador de complejidad (🟢/🟡/🟠/🔴)
- `getCoverageIcon()`: Obtiene el icono según el porcentaje de cobertura
- `getStatusEmoji()`: Obtiene el emoji según el porcentaje de cobertura
- `getFileName()`: Extrae el nombre del archivo de una ruta completa

#### 3. **Data Reading Functions** (Funciones de Lectura de Datos)
- `readTestResults()`: Lee y parsea el archivo JSON de resultados de tests
- `readCoverageSummary()`: Lee y parsea el archivo JSON de resumen de cobertura
- `parseLcovFile()`: Parsea el archivo LCOV y extrae métricas de cobertura
- `collectAllTests()`: Recopila todos los tests desde los resultados

#### 4. **Calculation Functions** (Funciones de Cálculo)
- `calculateCoveragePercentages()`: Calcula porcentajes de cobertura
- `calculateComplexity()`: Calcula la complejidad ciclomática
- `calculateFileComplexity()`: Calcula la complejidad de un archivo específico

#### 5. **Report Generation Functions** (Funciones de Generación de Reportes)
- `generateHeader()`: Genera el encabezado del reporte
- `generateTestSummary()`: Genera el resumen de tests
- `generateTestDetailsTable()`: Genera la tabla con detalles de cada test
- `generateFailedTestDetails()`: Genera detalles de tests fallidos
- `generateCoverageMetricsTable()`: Genera tabla de métricas de cobertura
- `generateComplexityByFileTable()`: Genera tabla de complejidad por archivo
- `generateCoverageProgressBar()`: Genera barra visual de progreso
- `generateCoverageNotFound()`: Genera mensaje cuando no hay cobertura

#### 6. **Main Function** (Función Principal)
- `generateSummary()`: Orquesta todo el proceso de generación del resumen

### 🎯 Funcionalidad

- **Resumen de Tests**: Muestra el número total de tests ejecutados, pasados, fallados y omitidos
- **Detalle de Tests**: Tabla con cada test individual, su estado y tiempo de ejecución
- **Detalles de Errores**: Muestra información detallada de los tests que fallaron
- **Cobertura de Código**: Muestra métricas de cobertura (statements, líneas, funciones, branches)
- **Complejidad Ciclomática**: Análisis de complejidad general y por archivo
- **Barra de Progreso**: Visualización gráfica del porcentaje de cobertura

### 🔧 Variables de Entorno Requeridas

- `GITHUB_STEP_SUMMARY`: Ruta al archivo de resumen (proporcionada automáticamente por GitHub Actions)
- `TEST_OUTCOME`: Resultado de la ejecución de los tests (`success` o `failure`)

### 📥 Archivos de Entrada

- `coverage/proyectoFinal/test-results.json`: Resultados detallados de los tests
- `coverage/proyectoFinal/lcov.info`: Información de cobertura de código en formato LCOV
- `coverage/proyectoFinal/coverage-summary.json`: Resumen de cobertura por archivo

### 🚀 Uso

Este script se ejecuta automáticamente como parte del workflow de CI/CD. Para ejecutarlo localmente (con fines de testing):

```bash
# Asegúrate de tener los archivos de cobertura generados
npm run test -- --no-watch --code-coverage

# Ejecuta el script (necesitas simular las variables de entorno)
set GITHUB_STEP_SUMMARY=summary.md
set TEST_OUTCOME=success
node .github/scripts/generate-summary.js
```

### 📊 Salida

El script genera markdown formateado que se muestra en la página de Summary del workflow de GitHub Actions, incluyendo:

- 📊 Encabezado del reporte
- ✅/❌ Estado de los tests con resumen numérico
- 📋 Tabla de resultados individuales con tiempos
- ❌ Detalles de tests fallidos (si existen)
- 🟢/🟡/🔴 Estado de la cobertura con indicador de color
- 📊 Tabla completa de métricas (Statements, Lines, Functions, Branches, Complexity)
- 🔍 Análisis de complejidad por archivo con indicadores visuales
- 📈 Barra visual de progreso de cobertura

### 🎨 Características de Diseño

- **Código modular**: Cada función tiene una responsabilidad específica
- **Fácil mantenimiento**: Cambios localizados en funciones específicas
- **Constantes configurables**: Umbrales ajustables sin modificar lógica
- **Manejo de errores**: Validación de existencia de archivos y manejo de excepciones
- **Documentación clara**: Cada función está documentada con JSDoc
- **Separación de concerns**: Lectura, cálculo y generación están separados

