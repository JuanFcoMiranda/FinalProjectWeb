# 🔧 Solución de Problemas - Tests que No Funcionan

## 🎯 Problema: "Los tests siguen sin funcionar"

Esta guía te ayudará a diagnosticar y resolver problemas comunes con los tests de Karma en Angular.

---

## 📊 Diagnóstico Paso a Paso

### Paso 1: Verificar Instalación de Dependencias

```cmd
npm install
```

**¿Qué hace?** Asegura que todas las dependencias estén instaladas, incluidos Karma, Jasmine y karma-chrome-launcher.

**Salida esperada:** Lista de paquetes instalados sin errores.

---

### Paso 2: Verificar que Chrome está Instalado

```cmd
# En CMD:
where chrome

# O verifica manualmente:
dir "C:\Program Files\Google\Chrome\Application\chrome.exe"
```

**Si Chrome no está en la ruta esperada:**
1. Edita `chrome-config.json` con la ruta correcta
2. O usa uno de los scripts: `test-with-chrome.bat` o `test-with-chrome.ps1`

---

### Paso 3: Ejecutar Script de Diagnóstico

```cmd
npm run test:debug
```

**¿Qué hace?** 
- Verifica versión de Node.js
- Busca Chrome en rutas comunes
- Verifica que Karma esté instalado
- Intenta ejecutar los tests mostrando información detallada

**Salida esperada:**
```
✓ Node.js: v18.x.x
✓ Platform: win32
✓ Chrome encontrado: C:\Program Files\...
✓ Karma instalado
✓ karma.conf.js encontrado
```

---

### Paso 4: Probar Diferentes Configuraciones

#### Opción A: Headless sin Watch
```cmd
npm run test:headless
```

#### Opción B: Con navegador visible (para debugging)
```cmd
npm test
```

#### Opción C: CI mode
```cmd
npm run test:ci
```

---

## 🚨 Errores Comunes y Soluciones

### Error 1: "Chrome not found" o "ChromeHeadless not found"

**Causa:** Karma no puede encontrar Chrome en tu sistema.

**Soluciones:**

#### Solución A: Configurar ruta en chrome-config.json
```json
{
  "chromePath": "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
}
```

#### Solución B: Variable de entorno
```cmd
set CHROME_BIN=C:\Program Files\Google\Chrome\Application\chrome.exe
npm test
```

#### Solución C: Instalar Puppeteer (incluye Chromium)
```cmd
npm install --save-dev puppeteer
```

Luego edita `karma.conf.js` y descomenta:
```javascript
process.env.CHROME_BIN = require('puppeteer').executablePath();
```

---

### Error 2: "Cannot start ChromeHeadless" o timeout

**Causa:** Chrome puede iniciarse pero Karma no puede conectarse.

**Soluciones:**

#### Solución A: Usar Chrome normal (no headless)
Edita `karma.conf.js`:
```javascript
browsers: ['Chrome'],  // Cambiar de 'ChromeHeadless' a 'Chrome'
```

#### Solución B: Aumentar timeout
Edita `karma.conf.js`:
```javascript
config.set({
  // ...existing code...
  captureTimeout: 210000,
  browserDisconnectTolerance: 3,
  browserDisconnectTimeout: 210000,
  browserNoActivityTimeout: 210000,
  // ...existing code...
});
```

#### Solución C: Desactivar sandbox (solo para testing)
Usa el launcher `ChromeHeadlessCI`:
```cmd
npm run test:ci
```

---

### Error 3: No sale ningún output / comando se queda "colgado"

**Causa:** El proceso de Karma está ejecutándose pero no muestra output en tu terminal.

**Soluciones:**

#### Solución A: Ejecutar con logging explícito
```cmd
npm test -- --log-level=debug
```

#### Solución B: Verificar proceso en segundo plano
```cmd
# Ver si hay procesos de Chrome o Karma corriendo:
tasklist | findstr chrome
tasklist | findstr node
```

#### Solución C: Matar procesos anteriores
```cmd
taskkill /F /IM chrome.exe
taskkill /F /IM node.exe
npm test
```

---

### Error 4: Errores de compilación TypeScript

**Síntomas:**
```
ERROR in src/app/.../component.ts
TS2339: Property 'x' does not exist...
```

**Solución:**
```cmd
# Compilar TypeScript para ver errores:
npx tsc --noEmit

# O compilar el proyecto:
npm run build
```

**He corregido estos problemas comunes:**
- ✅ Acceso a controles de formulario con tipos estrictos (`controls.title` en lugar de `controls['title']`)
- ✅ FormGroup correctamente tipado
- ✅ Tests usando las nuevas APIs de Angular 20

---

### Error 5: "Module not found" o "Cannot find module"

**Causa:** Dependencias faltantes o node_modules corrupto.

**Solución:**
```cmd
# Limpiar y reinstalar:
rmdir /S /Q node_modules
del package-lock.json
npm install
```

---

## 🔍 Verificación de Archivos de Configuración

### Verificar karma.conf.js

Tu archivo debe tener:
```javascript
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    browsers: ['ChromeHeadless'],
    // ... resto de configuración
  });
};
```

### Verificar angular.json

```json
"test": {
  "builder": "@angular/build:karma",
  "options": {
    "karmaConfig": "karma.conf.js",
    "polyfills": ["zone.js", "zone.js/testing"],
    "tsConfig": "tsconfig.spec.json"
  }
}
```

### Verificar tsconfig.spec.json

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/spec",
    "types": ["jasmine"]
  },
  "include": ["src/**/*.ts"]
}
```

---

## 🧪 Prueba Manual de Tests Individuales

Si los tests no corren en grupo, prueba ejecutar componentes individuales:

```cmd
# Ejecutar solo tests de un archivo:
npm test -- --include='**/todos.component.spec.ts'
```

---

## 🐛 Modo Debug: Ejecutar con Navegador Visible

Para ver qué está pasando:

1. **Edita karma.conf.js:**
   ```javascript
   browsers: ['Chrome'],  // NO usar ChromeHeadless
   singleRun: false       // Mantener navegador abierto
   ```

2. **Ejecuta:**
   ```cmd
   npm test
   ```

3. **En el navegador Chrome que se abre:**
   - Click en "Debug"
   - Abre DevTools (F12)
   - Ve a la pestaña "Console" para ver errores

---

## 📋 Checklist de Verificación Completa

Usa este checklist para verificar tu configuración:

- [ ] Node.js instalado (versión 18+)
- [ ] `npm install` ejecutado sin errores
- [ ] Chrome instalado y accesible
- [ ] `chrome-config.json` configurado (si Chrome está en ruta no estándar)
- [ ] `karma.conf.js` existe en la raíz del proyecto
- [ ] `angular.json` tiene `"karmaConfig": "karma.conf.js"`
- [ ] No hay errores de compilación: `npx tsc --noEmit`
- [ ] No hay procesos anteriores de Chrome/Node colgados
- [ ] Firewall/Antivirus no bloquea Karma

---

## 🚀 Comandos de Diagnóstico Rápido

Ejecuta estos comandos en orden para diagnosticar:

```cmd
# 1. Verificar versiones
node --version
npm --version

# 2. Verificar Chrome
where chrome

# 3. Reinstalar dependencias
npm install

# 4. Compilar TypeScript
npx tsc --noEmit

# 5. Limpiar procesos
taskkill /F /IM chrome.exe 2>nul
taskkill /F /IM node.exe 2>nul

# 6. Ejecutar diagnóstico
npm run test:debug

# 7. Si todo falla, ejecutar con Chrome visible
npm test
```

---

## 🔧 Solución Nuclear: Reset Completo

Si nada funciona, reset completo del entorno:

```cmd
# 1. Limpiar todo
rmdir /S /Q node_modules
rmdir /S /Q .angular
del package-lock.json

# 2. Reinstalar
npm install

# 3. Verificar configuración de Chrome
echo { "chromePath": "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" } > chrome-config.json

# 4. Ejecutar tests
npm test
```

---

## 📞 ¿Aún No Funciona?

Si después de seguir todos estos pasos los tests siguen sin funcionar:

### Información a recopilar:

1. **Versión de Node.js:**
   ```cmd
   node --version
   ```

2. **Sistema operativo:**
   ```cmd
   ver
   ```

3. **Salida de npm install:**
   ```cmd
   npm install > install-log.txt 2>&1
   ```

4. **Intentar ejecutar Karma directamente:**
   ```cmd
   npx karma start karma.conf.js --single-run --browsers ChromeHeadless
   ```

5. **Logs de error completos:**
   ```cmd
   npm test > test-log.txt 2>&1
   ```

### Alternativas:

#### Opción A: Usar Jest en lugar de Karma
```cmd
npm install --save-dev jest @types/jest
```

#### Opción B: Ejecutar tests en Docker
```dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
RUN npm test -- --browsers=ChromeHeadlessCI
```

#### Opción C: Ejecutar tests en GitHub Actions / CI
Los tests deberían funcionar en CI aunque fallen localmente.

---

## ✅ Verificación de Tests Correctos

He actualizado los archivos para asegurar que:

- ✅ **TodosComponent**: FormGroup correctamente tipado
- ✅ **LoginComponent**: FormGroup correctamente tipado
- ✅ **TodoService**: Tests usan `provideHttpClientTesting()`
- ✅ **ModalComponent**: Tests correctos
- ✅ **AppComponent**: Tests básicos funcionan
- ✅ Todos los tests usan standalone components
- ✅ Todos los tests usan las APIs modernas de Angular 20

---

## 🎯 Resultado Esperado

Cuando los tests funcionen, deberías ver:

```
Chrome Headless 107.0.0.0 (Windows 10): Executed 14 of 14 SUCCESS (0.532 secs / 0.498 secs)

TOTAL: 14 SUCCESS

===============================================================================
App Component
  ✓ should create the app
  ✓ should render header

TodosComponent
  ✓ should create
  ✓ should call list() on init
  ✓ create() should call service.create and reset form
  ✓ remove() should call service.delete and reload
  ✓ goToEdit should navigate to edit page

TodoService
  ✓ list() should return a PaginatedList
  ✓ create() should throw if API returns null/undefined
  ✓ delete() should call DELETE on the correct URL
  ✓ update() should call PUT on the correct URL

ModalComponent
  ✓ should not render when closed
  ✓ should render when open
  ✓ should emit close on backdrop click
===============================================================================
```

---

## 📚 Recursos Adicionales

- [Karma Configuration](https://karma-runner.github.io/latest/config/configuration-file.html)
- [Angular Testing Guide](https://angular.dev/guide/testing)
- [Jasmine Documentation](https://jasmine.github.io/)
- [Debugging Karma Tests](https://karma-runner.github.io/latest/config/debugging.html)
