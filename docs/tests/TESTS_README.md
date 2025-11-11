# 🧪 Guía Rápida de Tests

Comandos esenciales para trabajar con tests en el proyecto.

## 🚀 Comandos Básicos

### Desarrollo (con watch)
```bash
npm test
```
Ejecuta tests y observa cambios automáticamente.

### Una sola ejecución
```bash
npm run test:headless
```
Ejecuta tests una vez, en modo headless, con reporte de cobertura.

### CI/CD
```bash
npm run test:ci
```
Configuración optimizada para pipelines de integración continua.

## 📊 Ver Cobertura

Después de ejecutar `npm run test:headless`:

```bash
# Windows
start coverage/proyectoFinal/index.html

# macOS
open coverage/proyectoFinal/index.html

# Linux
xdg-open coverage/proyectoFinal/index.html
```

## 🔍 Ejecutar Tests Específicos

```bash
# Un solo archivo
ng test --include='**/mi-componente.spec.ts'

# Por patrón
ng test --include='**/todos/**/*.spec.ts'
```

## 🌐 Configurar Chrome

Si Chrome no se encuentra, crea `chrome-config.json` en la raíz:

```json
{
  "chromePath": "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
}
```

## 🆘 Solución Rápida de Problemas

### Chrome no encontrado
```bash
# Windows
set CHROME_BIN=C:\Program Files\Google\Chrome\Application\chrome.exe

# PowerShell
$env:CHROME_BIN="C:\Program Files\Google\Chrome\Application\chrome.exe"
```

### Reinstalar dependencias
```bash
rm -rf node_modules package-lock.json
npm install
```

### Puerto en uso
```bash
# Cambiar puerto en karma.conf.js
port: 9877
```

## 📚 Más Información

- [Guía Completa de Tests](TEST_GUIDE.md)
- [Solución de Problemas](TEST_TROUBLESHOOTING.md)
- [Configuración de Chrome](../config/CHROME_SETUP_GUIDE.md)

## ✅ Estado de Tests

Para ver el estado actual de los tests, revisa:
- [Summary Preview](summary-preview.md) - Reporte detallado con cobertura
- GitHub Actions - Pipeline de CI/CD automática

