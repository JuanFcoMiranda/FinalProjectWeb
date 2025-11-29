# Migración de Tests de Karma/Jasmine a Vitest

## Resumen de cambios realizados

Se ha realizado una migración parcial del sistema de testing de Karma/Jasmine a Vitest, pero hay problemas de compatibilidad con Angular 20.

### Cambios completados

1. **Dependencias actualizadas**:
   - Instalado Vitest 3.2.4 (compatible con @angular/build@20.3)
   - Instalado @analogjs/vite-plugin-angular para soporte de Angular en Vite
   - Instalado @vitest/ui y @vitest/coverage-v8 para interfaz y cobertura
   - Instalado jsdom para el entorno de testing
   - Instalado @angular/platform-browser-dynamic para el testing setup
   - Eliminadas las dependencias de Karma y Jasmine

2. **Archivos de configuración creados/modificados**:
   - `vitest.config.ts`: Configuración de Vitest con el plugin de Angular
   - `src/test-setup.ts`: Setup para inicializar el entorno de testing de Angular
   - `tsconfig.spec.json`: Actualizado para usar tipos de Vitest en lugar de Jasmine
   - `package.json`: Scripts de test actualizados para usar Vitest
   - `angular.json`: Eliminada la configuración de Karma

3. **Tests actualizados**:
   - `src/app/todos/todos.component.spec.ts`: Migrado de Jasmine spies a Vitest mocks (vi.fn())
   - `src/app/shared/modal.component.spec.ts`: Actualizado para usar vi.spyOn()
   - `src/app/todos/todo.service.spec.ts`: Actualizado para usar expect().rejects.toThrow()
   - `src/app/app.spec.ts`: No requiere cambios específicos

### Problemas actuales

**Error principal**: `Cannot read properties of null (reading 'ngModule')`

Este error indica un problema de compatibilidad entre:
- Angular 20.3.x
- @analogjs/vite-plugin-angular 2.1.1
- TestBed de Angular

El plugin de Analog no está manejando correctamente la inicialización del TestBed con Angular 20.

### Opciones para resolver

#### Opción 1: Esperar actualización del plugin (RECOMENDADO)
El equipo de AnalogJS necesita actualizar su plugin para soportar completamente Angular 20. Mientras tanto, puedes:
- Mantener Karma/Jasmine para los tests existentes
- Monitorear actualizaciones de @analogjs/vite-plugin-angular

#### Opción 2: Usar Angular CLI para tests
Angular 20 ahora tiene soporte experimental para Vitest a través de `@angular/build`. Podrías:
1. Esperar a que el soporte de Vitest sea estable en Angular CLI
2. Usar el builder experimental: `@angular/build:vitest`

#### Opción 3: Testing sin TestBed
Para tests de servicios puros (sin componentes), puedes escribir tests que no usen TestBed:
```typescript
// Ejemplo para servicios sin dependencias de Angular
describe('TodoService', () => {
  it('should process data', () => {
    const service = new TodoService(mockHttpClient);
    expect(service.someMethod()).toBe(expected);
  });
});
```

### Scripts disponibles

```bash
# Ejecutar tests (actualmente fallan por el problema de compatibilidad)
npm test

# Ejecutar tests en modo watch
npm test

# Ejecutar tests con interfaz gráfica
npm run test:ui

# Ejecutar tests una vez
npm run test:run

# Ejecutar tests con cobertura
npm run test:coverage
```

### Reverting a Karma/Jasmine

Si necesitas volver a Karma/Jasmine temporalmente:

```bash
# Reinstalar dependencias de Karma/Jasmine
npm install -D @types/jasmine jasmine-core karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter

# Restaurar scripts en package.json
"test": "ng test"
"test:headless": "ng test --watch=false --browsers=ChromeHeadless --code-coverage"

# Restaurar test builder en angular.json
"test": {
  "builder": "@angular/build:karma",
  "options": {
    "codeCoverage": true,
    "karmaConfig": "karma.conf.js",
    ...
  }
}

# Actualizar tsconfig.spec.json
"types": ["jasmine"]
```

### Estado del proyecto

- ✅ Configuración de Vitest instalada y configurada
- ✅ Tests actualizados a sintaxis de Vitest
- ❌ Tests no pueden ejecutarse debido a incompatibilidad Angular 20 + TestBed + Vitest
- ⚠️ Se recomienda mantener Karma/Jasmine hasta que haya mejor soporte

###  Referencias

- [AnalogJS Vitest Plugin](https://analogjs.org/docs/packages/vite-plugin-angular/overview)
- [Angular Testing with Vitest](https://github.com/angular/angular-cli/issues/26263)
- [Vitest Documentation](https://vitest.dev/)

