# 🌐 Guía de Configuración de Chrome para Tests de Karma

Esta guía explica cómo configurar Karma para usar Chrome desde una ruta personalizada en tu sistema.

## 📋 Tabla de Contenidos

1. [Métodos de Configuración](#métodos-de-configuración)
2. [Método 1: Archivo chrome-config.json (Recomendado)](#método-1-archivo-chrome-configjson-recomendado)
3. [Método 2: Scripts de Ejecución](#método-2-scripts-de-ejecución)
4. [Método 3: Variable de Entorno Manual](#método-3-variable-de-entorno-manual)
5. [Método 4: Editar karma.conf.js Directamente](#método-4-editar-karmaconfjs-directamente)
6. [Rutas Comunes de Chrome](#rutas-comunes-de-chrome)
7. [Solución de Problemas](#solución-de-problemas)

---

## Métodos de Configuración

Hay **4 métodos** para configurar la ruta de Chrome. Elige el que prefieras:

| Método | Dificultad | Persistencia | Recomendado para |
|--------|------------|--------------|------------------|
| 1. chrome-config.json | ⭐ Fácil | ✓ Permanente | Todos los usuarios |
| 2. Scripts (.bat/.ps1) | ⭐ Fácil | Por sesión | Uso ocasional |
| 3. Variable de entorno | ⭐⭐ Media | Configurable | Usuarios avanzados |
| 4. Editar karma.conf.js | ⭐⭐⭐ Avanzada | ✓ Permanente | Desarrolladores |

---

## Método 1: Archivo chrome-config.json (Recomendado)

### ✅ Ventajas
- Fácil de configurar
- No requiere conocimientos técnicos
- Configuración persistente
- Fácil de compartir con el equipo

### 📝 Pasos

1. **Abre el archivo `chrome-config.json`** en la raíz del proyecto

2. **Encuentra tu ruta de Chrome**:
   - Abre el Explorador de Windows
   - Navega a `C:\Program Files\Google\Chrome\Application\`
   - Busca el archivo `chrome.exe`
   - Copia la ruta completa

3. **Edita el campo `chromePath`** en `chrome-config.json`:

```json
{
  "chromePath": "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  ...
}
```

⚠️ **IMPORTANTE**: Usa doble barra invertida `\\` en Windows

4. **Guarda el archivo** y ejecuta los tests:

```cmd
npm test
```

### 📄 Ejemplo completo de chrome-config.json

```json
{
  "comment": "Archivo de configuración para rutas personalizadas de Chrome",
  "chromePath": "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  ...
}
```

---

## Método 2: Scripts de Ejecución

### Para usuarios de CMD (Símbolo del sistema)

1. **Edita `test-with-chrome.bat`**
2. **Encuentra esta línea**:
   ```bat
   set CHROME_BIN=C:\Program Files\Google\Chrome\Application\chrome.exe
   ```
3. **Cámbiala por tu ruta**:
   ```bat
   set CHROME_BIN=D:\MiCarpeta\Chrome\chrome.exe
   ```
4. **Guarda y ejecuta**:
   ```cmd
   test-with-chrome.bat
   ```

### Para usuarios de PowerShell

1. **Edita `test-with-chrome.ps1`**
2. **Encuentra esta línea**:
   ```powershell
   $chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
   ```
3. **Cámbiala por tu ruta**:
   ```powershell
   $chromePath = "D:\MiCarpeta\Chrome\chrome.exe"
   ```
4. **Ejecuta** (puede requerir permisos):
   ```powershell
   powershell -ExecutionPolicy Bypass -File test-with-chrome.ps1
   ```

---

## Método 3: Variable de Entorno Manual

### Temporal (solo para la sesión actual)

#### CMD:
```cmd
set CHROME_BIN=C:\Program Files\Google\Chrome\Application\chrome.exe
npm test
```

#### PowerShell:
```powershell
$env:CHROME_BIN = "C:\Program Files\Google\Chrome\Application\chrome.exe"
npm test
```

### Permanente (para todo el sistema)

#### Windows:

1. **Abre la configuración de Variables de Entorno**:
   - Presiona `Win + R`
   - Escribe `sysdm.cpl` y presiona Enter
   - Ve a la pestaña "Opciones avanzadas"
   - Click en "Variables de entorno..."

2. **Crea una nueva variable**:
   - En "Variables de usuario", click en "Nueva..."
   - Nombre: `CHROME_BIN`
   - Valor: `C:\Program Files\Google\Chrome\Application\chrome.exe`
   - Click "Aceptar"

3. **Reinicia** tu terminal y ejecuta:
   ```cmd
   npm test
   ```

---

## Método 4: Editar karma.conf.js Directamente

Para usuarios avanzados que prefieren modificar la configuración de Karma.

1. **Abre `karma.conf.js`**

2. **Busca la sección de configuración** (cerca de la línea 23):

```javascript
// Alternativa: Configurar directamente aquí (descomenta una de estas líneas)
// Ejemplos de rutas comunes en Windows:
// process.env.CHROME_BIN = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
```

3. **Descomenta y modifica** la línea con tu ruta:

```javascript
process.env.CHROME_BIN = 'D:\\MiCarpeta\\Chrome\\chrome.exe';
```

4. **Guarda** y ejecuta los tests:

```cmd
npm test
```

---

## Rutas Comunes de Chrome

### Windows

| Navegador | Ruta Típica |
|-----------|-------------|
| Chrome 64-bit | `C:\Program Files\Google\Chrome\Application\chrome.exe` |
| Chrome 32-bit | `C:\Program Files (x86)\Google\Chrome\Application\chrome.exe` |
| Chrome Canary | `C:\Users\TU_USUARIO\AppData\Local\Google\Chrome SxS\Application\chrome.exe` |
| Chromium | `C:\Program Files\Chromium\Application\chrome.exe` |
| Brave | `C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe` |
| Edge | `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe` |

### macOS

| Navegador | Ruta Típica |
|-----------|-------------|
| Chrome | `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` |
| Chromium | `/Applications/Chromium.app/Contents/MacOS/Chromium` |
| Brave | `/Applications/Brave Browser.app/Contents/MacOS/Brave Browser` |

### Linux

| Navegador | Ruta Típica |
|-----------|-------------|
| Chrome | `/usr/bin/google-chrome` |
| Chromium | `/usr/bin/chromium-browser` o `/usr/bin/chromium` |
| Brave | `/usr/bin/brave-browser` |

---

## Solución de Problemas

### ❌ Error: "Chrome not found"

**Causa**: La ruta especificada no es correcta o Chrome no está instalado.

**Solución**:
1. Verifica que Chrome esté instalado
2. Busca el ejecutable manualmente:
   - Abre el Explorador de Windows
   - Ve a `C:\Program Files\` o `C:\Program Files (x86)\`
   - Busca la carpeta `Google\Chrome\Application\`
   - Verifica que exista `chrome.exe`

### ❌ Error: "Cannot find module 'fs'"

**Causa**: Problema con Node.js.

**Solución**:
```cmd
npm install
```

### ❌ Los tests no se ejecutan

**Solución paso a paso**:

1. **Verifica que Chrome funciona**:
   ```cmd
   "C:\Program Files\Google\Chrome\Application\chrome.exe" --version
   ```

2. **Verifica la variable de entorno**:
   ```cmd
   echo %CHROME_BIN%
   ```

3. **Prueba con ruta completa**:
   ```cmd
   set CHROME_BIN=C:\Program Files\Google\Chrome\Application\chrome.exe
   npm test
   ```

### 🔍 Cómo encontrar la ruta de Chrome automáticamente

#### En Windows (CMD):
```cmd
where chrome
```

#### En Windows (PowerShell):
```powershell
(Get-Command chrome).Path
```

O busca manualmente:
```powershell
Get-ChildItem "C:\Program Files\" -Recurse -Filter chrome.exe -ErrorAction SilentlyContinue
```

### 🛠️ Usar Puppeteer (Chrome incluido)

Si no quieres instalar Chrome por separado, puedes usar Puppeteer que incluye Chromium:

1. **Instala Puppeteer**:
   ```cmd
   npm install --save-dev puppeteer
   ```

2. **Edita `karma.conf.js`** y descomenta:
   ```javascript
   process.env.CHROME_BIN = require('puppeteer').executablePath();
   ```

3. **Ejecuta los tests**:
   ```cmd
   npm test
   ```

---

## 🎯 Método Recomendado por Situación

### Para desarrollo personal
→ **Método 1** (chrome-config.json)

### Para CI/CD o servidores
→ **Método 3** (Variable de entorno del sistema) o usar Puppeteer

### Para compartir con el equipo
→ **Método 1** (chrome-config.json) + documentar la ruta en el README

### Para instalaciones portables de Chrome
→ **Método 2** (Scripts) o **Método 4** (karma.conf.js directo)

---

## 📚 Recursos Adicionales

- [Karma Configuration](https://karma-runner.github.io/latest/config/configuration-file.html)
- [karma-chrome-launcher](https://github.com/karma-runner/karma-chrome-launcher)
- [Angular Testing Guide](https://angular.dev/guide/testing)

---

## ✅ Verificación Final

Para verificar que tu configuración funciona:

```cmd
# Verifica que Chrome está en la ruta configurada
dir "%CHROME_BIN%"

# Ejecuta los tests
npm test
```

Si ves los tests ejecutándose sin errores de "Chrome not found", ¡la configuración es correcta! 🎉

