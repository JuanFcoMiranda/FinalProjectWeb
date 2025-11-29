# Migración de Tests de Karma/Jasmine a Vitest

## ✅ Estado: COMPLETADO EXITOSAMENTE

La migración a Vitest se completó exitosamente después de actualizar a Angular 21.

### Resumen de la migración

Se migró exitosamente el sistema de testing de Karma/Jasmine a Vitest con Angular 21.

## Cambios realizados

### 1. Actualización a Angular 21

**Versiones actualizadas:**
- Angular: 20.3.6 → 21.0.1
- Angular CLI: 20.3.6 → 21.0.1
- Vitest: 3.2.4 → 4.0.14
- @vitest/ui: 3.2.4 → 4.0.14
- @vitest/coverage-v8: 3.2.4 → 4.0.14

**Migraciones automáticas aplicadas por Angular CLI:**
- ✅ Migración a block control flow syntax (@if, @for)
- ✅ Migración a application builder
- ✅ Bootstrap options convertidos a providers

### 2. Dependencias instaladas

```json
{
  "devDependencies": {
    "@analogjs/vite-plugin-angular": "^2.1.1",
    "@vitest/ui": "^4.0.14",
    "@vitest/coverage-v8": "^4.0.14",
    "@angular/platform-browser-dynamic": "^21.0.1",
    "@standard-schema/spec": "^1.0.0",
    "vitest": "^4.0.14",
    "jsdom": "^27.2.0",
    "code-block-writer": "^13.0.3"
  }
}
```

**Dependencias eliminadas:**
- karma
- karma-chrome-launcher
- karma-coverage
- karma-jasmine
- karma-jasmine-html-reporter
- karma-json-reporter
- @types/jasmine
- jasmine-core

### 3. Archivos de configuración

#### `vitest.config.ts`
```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [angular()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test-setup.ts',
        '**/*.spec.ts',
        '**/environments/**'
      ]
    },
    server: {
      deps: {
        inline: ['@angular/**']
      }
    }
  },
  define: {
    'import.meta.vitest': false,
  },
});
```

#### `src/test-setup.ts`
```typescript
import 'zone.js';
import 'zone.js/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { beforeEach } from 'vitest';

// Initialize the Angular testing environment only once
try {
  getTestBed().initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting(),
    {
      teardown: { destroyAfterEach: false }
    }
  );
} catch (e) {
  // Already initialized
}

// Reset TestBed before each test to ensure isolation
beforeEach(() => {
  TestBed.resetTestingModule();
});
```

### 4. Tests actualizados

**Cambios de sintaxis Jasmine → Vitest:**

| Jasmine | Vitest |
|---------|--------|
| `jasmine.createSpyObj()` | `vi.fn().mockResolvedValue()` |
| `spyOn(obj, 'method')` | `vi.spyOn(obj, 'method')` |
| `spy.and.returnValue()` | `spy.mockReturnValue()` |
| `spy.calls.reset()` | `spy.mockClear()` |
| `expectAsync().toBeRejected()` | `expect().rejects.toThrow()` |

**Archivos actualizados:**
- ✅ `src/app/app.spec.ts`
- ✅ `src/app/shared/modal.component.spec.ts`
- ✅ `src/app/todos/todo.service.spec.ts`
- ✅ `src/app/todos/todos.component.spec.ts`

### 5. Scripts de package.json

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:ci": "vitest run --coverage"
  }
}
```

## Resultados

### ✅ Tests ejecutándose correctamente

```
Test Files  4 passed (4)
     Tests  17 passed (17)
  Duration  ~2s
```

### ✅ Cobertura de código

```
File                    % Stmts  % Branch  % Funcs  % Lines
All files                 55.65      19.6    63.63    57.79
  app.component.ts          100       100      100      100
  modal.component.ts      19.23      9.09       40    21.27
  todo.service.ts         93.75      62.5      100    93.33
  todos.component.ts      80.48        20    71.42    80.48
```

## Problemas resueltos

### 1. ✅ Compatibilidad Angular 20 → Angular 21
**Problema:** TestBed no funcionaba correctamente con Angular 20 + Vitest
**Solución:** Actualización a Angular 21.0.1 que tiene mejor soporte para Vitest

### 2. ✅ ExpressionChangedAfterItHasBeenCheckedError
**Problema:** Error en tests del ModalComponent
**Solución:** No llamar `detectChanges()` en el `beforeEach`, dejar que cada test lo controle

### 3. ✅ Dependencias peer
**Problema:** Conflictos de versiones entre paquetes
**Solución:** Uso de `--force` y `--legacy-peer-deps` para instalar dependencias correctas

## Comandos disponibles

```bash
# Ejecutar tests en modo watch
npm test

# Ejecutar tests una sola vez
npm run test:run

# Ejecutar tests con interfaz gráfica
npm run test:ui

# Ejecutar tests con cobertura
npm run test:coverage

# Tests para CI/CD
npm run test:ci
```

## Ventajas de Vitest sobre Karma/Jasmine

1. **⚡ Más rápido**: Ejecución de tests significativamente más rápida
2. **🔥 HMR**: Hot Module Replacement para tests
3. **🎨 UI moderna**: Interfaz gráfica con `--ui`
4. **📊 Mejor cobertura**: Reportes más detallados
5. **🔧 Configuración simple**: Sin necesidad de múltiples archivos de configuración
6. **🚀 Compatible con Vite**: Aprovecha el ecosistema moderno

## Notas importantes

- ✅ Todos los tests funcionan correctamente
- ✅ La cobertura de código se genera correctamente
- ✅ Compatible con CI/CD pipelines
- ✅ No se requiere Chrome instalado (usa jsdom)
- ⚠️  Se puede eliminar `karma.conf.js` y `chrome-config.json` si ya no se necesitan

## Referencias

- [Angular 21 Release](https://blog.angular.dev/angular-v21-is-here-bc4ad26f7c5f)
- [AnalogJS Vitest Plugin](https://analogjs.org/docs/packages/vite-plugin-angular/overview)
- [Vitest Documentation](https://vitest.dev/)
- [Angular Testing Guide](https://angular.dev/guide/testing)

