# 🧪 Guía Rápida para Ejecutar Tests

## ⚡ Inicio Rápido

### Método 1: Script de Diagnóstico Automático (RECOMENDADO)

```cmd
diagnose-and-test.bat
```

Este script:
- ✅ Verifica Node.js y npm
- ✅ Instala dependencias si faltan
- ✅ Busca Chrome automáticamente
- ✅ Limpia procesos previos
- ✅ Verifica compilación TypeScript
- ✅ Ejecuta los tests
- ✅ Muestra errores claros

### Método 2: Comando npm Directo

```cmd
npm test
```

### Método 3: Sin Watch Mode

```cmd
npm run test:headless
```

---

## 🔧 Si los Tests No Funcionan

### Paso 1: Ejecutar Diagnóstico

```cmd
npm run test:debug
```

### Paso 2: Configurar Chrome (si está en ruta no estándar)

Edita `chrome-config.json`:
```json
{
  "chromePath": "C:\\TU\\RUTA\\chrome.exe"
}
```

### Paso 3: Consultar Guía de Solución de Problemas

Lee `TEST_TROUBLESHOOTING.md` para soluciones detalladas a problemas comunes.

---

## 📊 Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm test` | Ejecutar tests en modo watch |
| `npm run test:headless` | Tests sin watch, headless |
| `npm run test:ci` | Tests para CI/CD (con flags especiales) |
| `npm run test:once` | Una sola ejecución |
| `npm run test:debug` | Diagnóstico completo + tests |

---

## ✅ Tests Disponibles

El proyecto tiene **14 tests** distribuidos en 4 archivos:

### AppComponent (2 tests)
- ✓ Debe crear la aplicación
- ✓ Debe renderizar el header

### TodosComponent (5 tests)
- ✓ Debe crear el componente
- ✓ Debe llamar a list() al iniciar
- ✓ create() debe llamar al servicio y resetear formulario
- ✓ remove() debe llamar al servicio y recargar
- ✓ goToEdit debe navegar a página de edición

### TodoService (4 tests)
- ✓ list() debe retornar lista paginada
- ✓ create() debe lanzar error si API retorna null
- ✓ delete() debe llamar DELETE en URL correcta
- ✓ update() debe llamar PUT en URL correcta

### ModalComponent (3 tests)
- ✓ No debe renderizar cuando está cerrado
- ✓ Debe renderizar cuando está abierto
- ✓ Debe emitir close al hacer click en backdrop

---

## 🚀 Resultado Esperado

Cuando los tests funcionen correctamente, verás:

```
Chrome Headless 107.0.0.0 (Windows 10): Executed 14 of 14 SUCCESS

TOTAL: 14 SUCCESS
```

---

## 📚 Documentación Adicional

- **TEST_TROUBLESHOOTING.md** - Guía completa de solución de problemas
- **CHROME_SETUP_GUIDE.md** - Configuración detallada de Chrome
- **CHROME_CONFIG_README.md** - Resumen de configuración de Chrome

---

## ⚠️ Problemas Comunes

### Chrome no encontrado
→ Edita `chrome-config.json` o ejecuta `test-with-chrome.bat`

### Tests se quedan colgados
→ Ejecuta `diagnose-and-test.bat` para diagnóstico completo

### Errores de compilación
→ Ejecuta `npx tsc --noEmit` para ver errores TypeScript

---

## 🎯 Siguiente Paso

**Ejecuta el diagnóstico automático:**

```cmd
diagnose-and-test.bat
```

Si tienes problemas, consulta `TEST_TROUBLESHOOTING.md` para ayuda detallada.

