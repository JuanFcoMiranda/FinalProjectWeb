# 🔧 Solución de Problemas - Tests

Esta guía contiene soluciones para problemas comunes al ejecutar tests en el proyecto.

## 📋 Problemas Comunes

### 1. Chrome no se encuentra

**Síntoma:**
```
Error: No binary for ChromeHeadless browser on your platform.
```

**Solución:**

Opción A - Usar archivo de configuración (Recomendado):

1. Crea/edita el archivo `chrome-config.json` en la raíz del proyecto:

```json
{
  "chromePath": "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
}
```

2. Ajusta la ruta según tu instalación de Chrome.

Opción B - Variable de entorno:

```bash
# Windows (CMD)
set CHROME_BIN=C:\Program Files\Google\Chrome\Application\chrome.exe

# Windows (PowerShell)
$env:CHROME_BIN="C:\Program Files\Google\Chrome\Application\chrome.exe"

# macOS
export CHROME_BIN="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# Linux
export CHROME_BIN=/usr/bin/google-chrome
```

Ver más detalles en [Guía de Configuración de Chrome](../config/CHROME_SETUP_GUIDE.md).

### 2. Tests fallan con "timeout"

**Síntoma:**
```
Error: Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL.
```

**Solución:**

Incrementa el timeout en tu test:

```typescript
beforeEach(async () => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000; // 10 segundos
  // ... resto del código
});
```

### 3. Error "Cannot find module '@angular-devkit/build-angular'"

**Síntoma:**
```
Error: Cannot find module '@angular-devkit/build-angular'
```

**Solución:**

Instala las dependencias del proyecto:

```bash
npm install
```

Si el problema persiste:

```bash
rm -rf node_modules package-lock.json
npm install
```

### 4. Tests pasan localmente pero fallan en CI

**Síntomas:**
- Los tests funcionan en tu máquina pero fallan en GitHub Actions o CI

**Soluciones:**

1. Verifica que estés usando el launcher correcto en CI:

```bash
npm run test:ci
```

2. Asegúrate de que el workflow de CI use `ChromeHeadlessCI`:

```yaml
- name: Run tests
  run: npm run test -- --no-watch --browsers=ChromeHeadlessCI --code-coverage
```

3. Verifica que no haya timeouts por recursos limitados en CI.

### 5. Error "No provider for HttpClient"

**Síntoma:**
```
NullInjectorError: No provider for HttpClient!
```

**Solución:**

En tus tests, asegúrate de importar `provideHttpClient()` y `provideHttpClientTesting()`:

```typescript
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [
      MiServicio,
      provideHttpClient(),
      provideHttpClientTesting()
    ]
  });
});
```

### 6. Error "Cannot read property of undefined" en tests

**Síntoma:**
```
TypeError: Cannot read property 'xxx' of undefined
```

**Solución:**

Asegúrate de llamar a `fixture.detectChanges()` después de configurar el componente:

```typescript
beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [MiComponente]
  }).compileComponents();

  fixture = TestBed.createComponent(MiComponente);
  component = fixture.componentInstance;
  fixture.detectChanges(); // ← Importante
});
```

### 7. Tests de routing no funcionan

**Síntoma:**
```
Error: NG04002: Cannot match any routes
```

**Solución:**

Usa `provideRouter()` con rutas de prueba:

```typescript
import { provideRouter } from '@angular/router';

beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [MiComponente],
    providers: [
      provideRouter([
        { path: 'test', component: MiComponente }
      ])
    ]
  }).compileComponents();
});
```

### 8. Cobertura de código no se genera

**Síntoma:**
- No se crea la carpeta `coverage/` después de ejecutar los tests

**Solución:**

Ejecuta los tests con la flag `--code-coverage`:

```bash
npm run test:headless
```

O manualmente:

```bash
ng test --no-watch --code-coverage
```

### 9. "Port 9876 is already in use"

**Síntoma:**
```
Error: Port 9876 in use
```

**Solución:**

Mata el proceso que está usando el puerto:

```bash
# Windows
netstat -ano | findstr :9876
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:9876 | xargs kill -9
```

O cambia el puerto en `karma.conf.js`:

```javascript
config.set({
  port: 9877, // Usar otro puerto
  // ...
});
```

### 10. Tests muy lentos

**Síntomas:**
- Los tests tardan mucho en ejecutarse

**Soluciones:**

1. Usa `ChromeHeadless` en lugar de `Chrome`:

```bash
npm run test:headless
```

2. Ejecuta tests específicos:

```bash
ng test --include='**/mi-componente.spec.ts'
```

3. Desactiva la generación de cobertura durante el desarrollo:

```bash
npm test
```

## 🆘 ¿Necesitas más ayuda?

Si ninguna de estas soluciones funciona:

1. Revisa la [Guía de Tests](TEST_GUIDE.md)
2. Revisa la [Guía de Configuración de Chrome](../config/CHROME_SETUP_GUIDE.md)
3. Verifica los logs completos de error
4. Busca el error en [Stack Overflow](https://stackoverflow.com/)
5. Revisa la documentación de [Angular Testing](https://angular.dev/guide/testing)

## 📝 Reportar un Bug

Si encuentras un bug en el proyecto:

1. Verifica que no sea un problema de configuración local
2. Documenta los pasos para reproducir el error
3. Incluye el mensaje de error completo
4. Menciona tu sistema operativo y versión de Node.js

