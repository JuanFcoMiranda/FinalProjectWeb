# 📦 Resumen de Configuración de Chrome para Tests

## ✅ Archivo de Configuración

El proyecto incluye `chrome-config.json` para facilitar la configuración de Chrome en diferentes sistemas.

## 🚀 Quick Start

### 1. Edita chrome-config.json

```json
{
  "chromePath": "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
}
```

### 2. Ejecuta los tests

```bash
npm test
```

¡Eso es todo! 🎉

## 📂 Rutas Comunes

### Windows
- Chrome: `C:\Program Files\Google\Chrome\Application\chrome.exe`
- Edge: `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`

### macOS
- Chrome: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`

### Linux
- Chrome: `/usr/bin/google-chrome`
- Chromium: `/usr/bin/chromium-browser`

## 📚 Más Información

Para configuración detallada y solución de problemas, consulta:

- **[Guía Completa de Configuración de Chrome](CHROME_SETUP_GUIDE.md)**
- **[Solución de Problemas de Tests](../tests/TEST_TROUBLESHOOTING.md)**
- **[Guía de Tests](../tests/TEST_GUIDE.md)**

## 💡 Métodos Alternativos

### Variable de Entorno

```bash
# Windows (PowerShell)
$env:CHROME_BIN="C:\Program Files\Google\Chrome\Application\chrome.exe"

# macOS/Linux
export CHROME_BIN="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
```

### Editar karma.conf.js

Descomenta y edita en `karma.conf.js`:

```javascript
process.env.CHROME_BIN = 'RUTA_A_CHROME';
```

## ⚙️ Configuración en CI/CD

El proyecto está configurado para usar `ChromeHeadlessCI` en GitHub Actions, que funciona automáticamente sin configuración adicional.

## 🔍 Verificar Configuración

Después de configurar, deberías ver:

```
✓ Usando Chrome desde chrome-config.json: C:\Program Files\...
Chrome Headless 120.0.0.0: Executed 17 of 17 SUCCESS ✅
```

## 🆘 Problemas?

Consulta la [Guía de Solución de Problemas](../tests/TEST_TROUBLESHOOTING.md) para errores comunes y sus soluciones.

---

**Última actualización:** Noviembre 2025

