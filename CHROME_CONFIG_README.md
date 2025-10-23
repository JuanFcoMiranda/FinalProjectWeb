# 📦 Resumen de Configuración de Chrome para Tests

## ✅ Archivos Creados

He creado los siguientes archivos para facilitar la configuración de Chrome:

1. **`chrome-config.json`** - Archivo de configuración JSON (método recomendado)
2. **`test-with-chrome.bat`** - Script para CMD/Símbolo del sistema
3. **`test-with-chrome.ps1`** - Script para PowerShell
4. **`CHROME_SETUP_GUIDE.md`** - Guía completa de configuración
5. **`karma.conf.js`** - Actualizado para leer configuraciones personalizadas

---

## 🚀 Inicio Rápido

### Método más fácil: Usar chrome-config.json

1. **Abre** `chrome-config.json`
2. **Edita** el campo `chromePath`:
   ```json
   {
     "chromePath": "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
   }
   ```
3. **Guarda** y ejecuta:
   ```cmd
   npm test
   ```

---

## 🎯 Otros Métodos Disponibles

### Opción A: Scripts de Ejecución

**Para CMD:**
```cmd
# Edita test-with-chrome.bat y luego ejecuta:
test-with-chrome.bat
```

**Para PowerShell:**
```powershell
# Edita test-with-chrome.ps1 y luego ejecuta:
powershell -ExecutionPolicy Bypass -File test-with-chrome.ps1
```

### Opción B: Variable de Entorno Temporal

**CMD:**
```cmd
set CHROME_BIN=C:\Program Files\Google\Chrome\Application\chrome.exe
npm test
```

**PowerShell:**
```powershell
$env:CHROME_BIN = "C:\Program Files\Google\Chrome\Application\chrome.exe"
npm test
```

### Opción C: Editar karma.conf.js Directamente

Abre `karma.conf.js` y descomenta/edita esta línea (alrededor de línea 24):
```javascript
process.env.CHROME_BIN = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
```

---

## 📍 Rutas Comunes de Chrome en Windows

```
✓ Chrome 64-bit (más común):
  C:\Program Files\Google\Chrome\Application\chrome.exe

✓ Chrome 32-bit:
  C:\Program Files (x86)\Google\Chrome\Application\chrome.exe

✓ Chrome Canary:
  C:\Users\TU_USUARIO\AppData\Local\Google\Chrome SxS\Application\chrome.exe

✓ Chromium:
  C:\Program Files\Chromium\Application\chrome.exe

✓ Brave Browser:
  C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe

✓ Microsoft Edge:
  C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe
```

---

## 🔍 Cómo Encontrar Tu Ruta de Chrome

### Método 1: Explorador de Windows
1. Abre el Explorador de Windows
2. Navega a `C:\Program Files\Google\Chrome\Application\`
3. Busca `chrome.exe`
4. Copia la ruta completa

### Método 2: Comando
```cmd
where chrome
```

O en PowerShell:
```powershell
(Get-Command chrome).Path
```

---

## ⚙️ Cómo Funciona la Configuración (Prioridad)

El sistema busca Chrome en este orden:

1. **Variable de entorno `CHROME_BIN`** (si está configurada)
2. **Archivo `chrome-config.json`** (campo `chromePath`)
3. **Configuración en `karma.conf.js`** (si está descomentada)
4. **Rutas predeterminadas del sistema** (búsqueda automática de Karma)

---

## 🛠️ Solución de Problemas

### Error: "Chrome not found"

**Verifica que Chrome existe:**
```cmd
dir "C:\Program Files\Google\Chrome\Application\chrome.exe"
```

**Si usas otra ruta, verifica que sea correcta:**
```cmd
dir "TU_RUTA_AQUI\chrome.exe"
```

### Los scripts .bat o .ps1 no funcionan

**Para .bat:** Ejecuta directamente haciendo doble clic o desde CMD

**Para .ps1:** Puede requerir permisos de ejecución:
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

### Usar Puppeteer (Chrome incluido)

Si no tienes Chrome instalado o prefieres no configurar rutas:

```cmd
npm install --save-dev puppeteer
```

Luego edita `karma.conf.js` y descomenta:
```javascript
process.env.CHROME_BIN = require('puppeteer').executablePath();
```

---

## 📖 Documentación Completa

Para instrucciones detalladas y más opciones, consulta:
- **[CHROME_SETUP_GUIDE.md](CHROME_SETUP_GUIDE.md)** - Guía completa paso a paso

---

## ✨ Ejemplo Completo: Configuración Rápida

```cmd
# 1. Edita chrome-config.json:
{
  "chromePath": "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
}

# 2. Ejecuta los tests:
npm test

# 3. Para ejecución única sin watch:
npm test -- --watch=false
```

---

## 🎉 ¡Listo!

Ahora tienes **4 formas diferentes** de configurar la ruta de Chrome:

✅ **chrome-config.json** - La más fácil y recomendada
✅ **Scripts (.bat/.ps1)** - Ideal para uso ocasional  
✅ **Variables de entorno** - Configuración del sistema
✅ **karma.conf.js directo** - Para usuarios avanzados

Elige el método que prefieras y ¡ejecuta tus tests! 🚀

