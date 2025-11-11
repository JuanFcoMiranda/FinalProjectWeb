# 🌐 Guía de Configuración de Chrome para Tests de Karma

Esta guía explica cómo configurar Karma para usar Chrome desde una ruta personalizada en tu sistema.

## 📋 Tabla de Contenidos

1. [¿Por qué necesito esto?](#por-qué-necesito-esto)
2. [Métodos de Configuración](#métodos-de-configuración)
3. [Método 1: chrome-config.json (Recomendado)](#método-1-chrome-configjson-recomendado)
4. [Método 2: Variable de Entorno](#método-2-variable-de-entorno)
5. [Método 3: Editar karma.conf.js](#método-3-editar-karmaconfjs)
6. [Rutas Comunes de Chrome](#rutas-comunes-de-chrome)
7. [Verificar Configuración](#verificar-configuración)
8. [Solución de Problemas](#solución-de-problemas)

## ❓ ¿Por qué necesito esto?

Si al ejecutar `npm test` ves un error como:

```
Error: No binary for ChromeHeadless browser on your platform.
```

Significa que Karma no puede encontrar Chrome en tu sistema. Esto puede ocurrir si:
- Chrome está instalado en una ubicación no estándar
- Usas Chrome Beta o Chrome Canary
- Usas otro navegador basado en Chromium (Edge, Brave)
- Estás en un entorno corporativo con instalaciones personalizadas

## 🎯 Métodos de Configuración

Hay 3 métodos principales, ordenados por conveniencia:

1. ✅ **chrome-config.json** - Recomendado, más fácil
2. ⚙️ **Variable de entorno** - Temporal, para pruebas
3. 🔧 **Editar karma.conf.js** - Permanente, requiere cambio de código

## Método 1: chrome-config.json (Recomendado)

### Ventajas
- ✅ No requiere cambios en el código
- ✅ Fácil de configurar
- ✅ No afecta a otros desarrolladores
- ✅ Se puede ignorar en git (`.gitignore`)

### Pasos

1. **Localiza tu archivo chrome-config.json** en la raíz del proyecto

2. **Encuentra la ruta de Chrome** en tu sistema:

   **Windows:**
   - Chrome estándar: `C:\Program Files\Google\Chrome\Application\chrome.exe`
   - Chrome 32-bit: `C:\Program Files (x86)\Google\Chrome\Application\chrome.exe`
   - Chrome Beta: `C:\Program Files\Google\Chrome Beta\Application\chrome.exe`
   - Edge: `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`

   **macOS:**
   - Chrome: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`
   - Brave: `/Applications/Brave Browser.app/Contents/MacOS/Brave Browser`
   - Chromium: `/Applications/Chromium.app/Contents/MacOS/Chromium`

   **Linux:**
   - Chrome: `/usr/bin/google-chrome`
   - Chromium: `/usr/bin/chromium-browser` o `/usr/bin/chromium`

3. **Edita chrome-config.json** y añade la ruta:

   ```json
   {
     "chromePath": "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
   }
   ```

   **⚠️ Importante en Windows:** Usa doble barra invertida `\\` o barra normal `/`

   ```json
   // ✅ Correcto
   "chromePath": "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
   
   // ✅ También correcto
   "chromePath": "C:/Program Files/Google/Chrome/Application/chrome.exe"
   
   // ❌ Incorrecto
   "chromePath": "C:\Program Files\Google\Chrome\Application\chrome.exe"
   ```

4. **Ejecuta los tests:**

   ```bash
   npm test
   ```

   Deberías ver:
   ```
   ✓ Usando Chrome desde chrome-config.json: C:\Program Files\...
   ```

## Método 2: Variable de Entorno

### Ventajas
- ✅ Rápido para pruebas temporales
- ✅ No modifica archivos del proyecto

### Desventajas
- ❌ Temporal (se pierde al cerrar terminal)
- ❌ Hay que configurarlo cada vez

### Pasos

**Windows (CMD):**
```cmd
set CHROME_BIN=C:\Program Files\Google\Chrome\Application\chrome.exe
npm test
```

**Windows (PowerShell):**
```powershell
$env:CHROME_BIN="C:\Program Files\Google\Chrome\Application\chrome.exe"
npm test
```

**macOS / Linux (Bash/Zsh):**
```bash
export CHROME_BIN="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
npm test
```

### Hacer Permanente (Opcional)

**Windows:**
1. Buscar "Variables de entorno" en el menú Inicio
2. Click en "Variables de entorno"
3. En "Variables de usuario", click "Nueva"
4. Nombre: `CHROME_BIN`
5. Valor: Ruta a Chrome
6. Reiniciar terminal

**macOS / Linux:**

Añade al archivo `~/.bashrc` o `~/.zshrc`:

```bash
export CHROME_BIN="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
```

Luego:
```bash
source ~/.bashrc  # o ~/.zshrc
```

## Método 3: Editar karma.conf.js

### Ventajas
- ✅ Permanente
- ✅ Siempre funciona

### Desventajas
- ❌ Modifica código del proyecto
- ❌ Puede afectar a otros desarrolladores
- ❌ Requiere mantener el cambio

### Pasos

1. **Abre karma.conf.js**

2. **Busca la sección de configuración de Chrome** (alrededor de la línea 35)

3. **Descomenta y edita una de estas líneas:**

   ```javascript
   // Windows
   process.env.CHROME_BIN = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
   
   // macOS
   process.env.CHROME_BIN = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
   
   // Linux
   process.env.CHROME_BIN = '/usr/bin/google-chrome';
   ```

4. **Guarda y ejecuta:**

   ```bash
   npm test
   ```

## 📂 Rutas Comunes de Chrome

### Windows

| Navegador | Ruta |
|-----------|------|
| Chrome 64-bit | `C:\Program Files\Google\Chrome\Application\chrome.exe` |
| Chrome 32-bit | `C:\Program Files (x86)\Google\Chrome\Application\chrome.exe` |
| Chrome Beta | `C:\Program Files\Google\Chrome Beta\Application\chrome.exe` |
| Chrome Canary | `C:\Users\TUUSUARIO\AppData\Local\Google\Chrome SxS\Application\chrome.exe` |
| Edge | `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe` |
| Brave | `C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe` |

### macOS

| Navegador | Ruta |
|-----------|------|
| Chrome | `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` |
| Brave | `/Applications/Brave Browser.app/Contents/MacOS/Brave Browser` |
| Chromium | `/Applications/Chromium.app/Contents/MacOS/Chromium` |
| Edge | `/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge` |

### Linux

| Navegador | Ruta |
|-----------|------|
| Chrome | `/usr/bin/google-chrome` |
| Chromium (1) | `/usr/bin/chromium-browser` |
| Chromium (2) | `/usr/bin/chromium` |
| Brave | `/usr/bin/brave-browser` |

### Encontrar Chrome Manualmente

**Windows:**
```cmd
where chrome
```

**macOS:**
```bash
which "Google Chrome"
# o
mdfind -name "Google Chrome.app"
```

**Linux:**
```bash
which google-chrome
which chromium-browser
```

## ✅ Verificar Configuración

Después de configurar, ejecuta:

```bash
npm test
```

**Salida Correcta:**
```
✓ CHROME_BIN configurado: C:\Program Files\Google\Chrome\Application\chrome.exe
✓ Usando Chrome desde chrome-config.json: C:\Program Files\...
Chrome Headless 120.0.0.0 (Windows 10): Executed 17 of 17 SUCCESS
```

**Salida con Error:**
```
Error: No binary for ChromeHeadless browser on your platform.
```
→ La ruta es incorrecta o Chrome no está instalado

## 🔧 Solución de Problemas

### Error: "No such file or directory"

**Causa:** La ruta es incorrecta

**Solución:**
1. Verifica que Chrome esté instalado
2. Usa las rutas comunes de arriba
3. Verifica que las barras sean dobles `\\` en Windows

### Error: "Permission denied"

**Causa:** Sin permisos de ejecución (Linux/macOS)

**Solución:**
```bash
chmod +x /usr/bin/google-chrome
```

### Tests no se ejecutan

**Causa:** Configuración no se aplica

**Solución:**
1. Reinicia la terminal
2. Verifica que `chrome-config.json` esté en la raíz del proyecto
3. Verifica el JSON es válido (sin comas extra)

### Usar Puppeteer Chrome

Si tienes Puppeteer instalado, puedes usar su Chrome:

```javascript
// En karma.conf.js
process.env.CHROME_BIN = require('puppeteer').executablePath();
```

O instalar Chrome estable via Puppeteer:

```bash
npm install --save-dev puppeteer
```

### Usar Edge en lugar de Chrome

```json
// chrome-config.json
{
  "chromePath": "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
}
```

## 📚 Recursos Adicionales

- [Karma Configuration](https://karma-runner.github.io/latest/config/configuration-file.html)
- [karma-chrome-launcher](https://github.com/karma-runner/karma-chrome-launcher)
- [Troubleshooting Guide](../tests/TEST_TROUBLESHOOTING.md)

## 💡 Tips

1. **Usa chrome-config.json** para configuración local personal
2. **Añade chrome-config.json a .gitignore** si tiene rutas específicas de tu máquina
3. **Documenta rutas especiales** en README si tu equipo usa configuraciones específicas
4. **Usa variables de entorno en CI/CD** (GitHub Actions, etc.)

---

¿Sigues teniendo problemas? Consulta la [Guía de Troubleshooting](../tests/TEST_TROUBLESHOOTING.md) o abre un issue en el repositorio.

