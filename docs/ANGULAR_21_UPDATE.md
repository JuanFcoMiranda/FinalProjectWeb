# Actualización a Angular 21

## Resumen

Se ha actualizado exitosamente el proyecto de Angular 20.3.6 a Angular 21.0.1, completando también la migración de tests de Karma/Jasmine a Vitest.

## Fecha de actualización
29 de noviembre de 2025

## Versiones

### Antes
- **Angular**: 20.3.6
- **Angular CLI**: 20.3.6
- **Testing**: Karma + Jasmine
- **Vitest**: 3.2.4 (no funcional)

### Después
- **Angular**: 21.0.1
- **Angular CLI**: 21.0.1
- **Testing**: Vitest 4.0.14 (completamente funcional)
- **Node.js**: 24.8.0
- **npm**: 11.6.0

## Cambios realizados por Angular CLI

### 1. Migración a Block Control Flow Syntax
Angular 21 introdujo la nueva sintaxis de control flow que reemplaza las directivas estructurales:

**Antes (Angular 20):**
```typescript
<div *ngIf="condition">Content</div>
<div *ngFor="let item of items">{{item}}</div>
```

**Después (Angular 21):**
```typescript
@if (condition) {
  <div>Content</div>
}
@for (item of items; track item.id) {
  <div>{{item}}</div>
}
```

**Archivos migrados automáticamente:**
- `src/app/shared/modal.component.ts`
- `src/app/todos/todos.component.ts`
- `src/app/todos/todo-edit.component.ts`
- `src/app/todos/todo-edit-page.component.ts`
- `src/app/login/login.component.ts`

### 2. Migración al Application Builder
- Proyecto migrado del builder `browser` al nuevo `application` builder
- Mejora en el rendimiento de compilación
- Mejor soporte para Vite y herramientas modernas

### 3. Bootstrap Options a Providers
El archivo `src/main.ts` fue actualizado automáticamente para usar el nuevo sistema de providers:

**Cambios en main.ts:**
```typescript
// Bootstrap options migrados a providers
bootstrapApplication(AppComponent, appConfig)
```

## Paquetes actualizados

### Core Angular
```json
{
  "@angular/animations": "21.0.1",
  "@angular/common": "21.0.1",
  "@angular/compiler": "21.0.1",
  "@angular/core": "21.0.1",
  "@angular/forms": "21.0.1",
  "@angular/platform-browser": "21.0.1",
  "@angular/platform-browser-dynamic": "21.0.1",
  "@angular/router": "21.0.1"
}
```

### Build Tools
```json
{
  "@angular/build": "21.0.1",
  "@angular/cli": "21.0.1",
  "@angular/compiler-cli": "21.0.1",
  "@angular-devkit/build-angular": "21.0.1"
}
```

### Testing (Vitest)
```json
{
  "vitest": "4.0.14",
  "@vitest/ui": "4.0.14",
  "@vitest/coverage-v8": "4.0.14",
  "@analogjs/vite-plugin-angular": "2.1.1"
}
```

### Nuevas dependencias
```json
{
  "@standard-schema/spec": "1.0.0",
  "jsdom": "27.2.0",
  "code-block-writer": "13.0.3"
}
```

## Verificación post-actualización

### ✅ Build exitoso
```bash
npm run build
# Output: Application bundle generation complete. [3.661 seconds]
```

### ✅ Tests pasando
```bash
npm test -- --run
# Test Files  4 passed (4)
# Tests  17 passed (17)
# Duration  ~2s
```

### ✅ Cobertura funcional
```bash
npm run test:coverage
# Coverage report from v8
# All files: 55.65% statements
```

### ✅ Sin errores de TypeScript
```bash
# Compilación exitosa sin errores
```

## Beneficios de Angular 21

### 1. **Rendimiento mejorado**
- Compilación más rápida con el nuevo application builder
- Mejor tree-shaking
- Optimizaciones en el runtime

### 2. **Nueva sintaxis de control flow**
- Más legible y cercana a JavaScript estándar
- Mejor rendimiento en runtime
- Mejor detección de errores en tiempo de compilación

### 3. **Mejor soporte para herramientas modernas**
- Integración nativa con Vite
- Soporte mejorado para Vitest
- Mejor compatibilidad con el ecosistema moderno de JavaScript

### 4. **Signals estables**
- Sistema de reactividad más eficiente
- Mejor rendimiento en change detection
- Preparación para futuras mejoras

## Impacto en el proyecto

### Archivos modificados
- **5 componentes** migrados a block control flow
- **1 archivo** de configuración principal (main.ts)
- **4 archivos** de tests actualizados
- **3 archivos** de configuración creados/modificados

### Sin breaking changes
- ✅ Todas las funcionalidades existentes siguen funcionando
- ✅ No se requieren cambios en la lógica de negocio
- ✅ API del proyecto se mantiene igual
- ✅ Los servicios y componentes funcionan sin cambios

## Comandos útiles

```bash
# Verificar versión de Angular
ng version

# Compilar el proyecto
npm run build

# Iniciar servidor de desarrollo
npm start

# Ejecutar tests
npm test

# Ejecutar tests con cobertura
npm run test:coverage

# Ejecutar tests con UI
npm run test:ui
```

## Próximos pasos recomendados

### 1. Opcional: Migración a Signals
Angular 21 tiene soporte completo para Signals. Considera migrar gradualmente:
```typescript
// Antes
value: number = 0;

// Después
value = signal(0);
```

### 2. Opcional: Eliminar archivos legacy
```bash
# Puedes eliminar si ya no son necesarios:
rm karma.conf.js
rm chrome-config.json
```

### 3. Actualizar documentación
- ✅ Documentación de Vitest actualizada
- ✅ Documentación de Angular 21 creada
- ⚠️  Revisar README.md si es necesario

### 4. Actualizar CI/CD
- Verificar que los pipelines usen los nuevos comandos de test
- Actualizar Docker images si es necesario
- Validar que SonarCloud funcione correctamente

## Problemas conocidos y soluciones

### ⚠️ Warnings de peer dependencies
**Problema**: Algunos warnings sobre peer dependencies
**Solución**: Son advertencias normales, el proyecto funciona correctamente

### ⚠️ CRLF warnings en Git
**Problema**: Warnings sobre CRLF en commits
**Solución**: Configuración normal de Git en Windows, no afecta funcionalidad

## Referencias

- [Angular 21 Release Notes](https://blog.angular.dev/angular-v21-is-here-bc4ad26f7c5f)
- [Block Control Flow Documentation](https://angular.dev/guide/templates/control-flow)
- [Application Builder Guide](https://angular.dev/tools/cli/build-system-migration)
- [Signals Documentation](https://angular.dev/guide/signals)
- [Vitest Migration Guide](./VITEST_MIGRATION.md)

## Contacto y soporte

Para preguntas sobre esta actualización:
- Revisar la documentación oficial de Angular 21
- Consultar los archivos de documentación en `/docs`
- Revisar los commits del repositorio para ver cambios específicos

---

**Estado**: ✅ Actualización completada exitosamente
**Tests**: ✅ 17/17 pasando
**Build**: ✅ Sin errores
**Fecha**: 29/11/2025

