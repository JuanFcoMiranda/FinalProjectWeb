# Guía para ejecutar los tests del proyecto

## Estado actual de los tests

Los tests del proyecto están correctamente configurados con las siguientes características:

### Archivos de test disponibles:
1. **src/app/app.spec.ts** - Tests del componente principal
2. **src/app/todos/todos.component.spec.ts** - Tests del componente de lista de todos
3. **src/app/todos/todo.service.spec.ts** - Tests del servicio de todos
4. **src/app/shared/modal.component.spec.ts** - Tests del componente modal

### Configuración:
- ✅ Karma configurado con ChromeHeadless
- ✅ Tests usando Jasmine
- ✅ Uso de nuevas APIs de Angular (provideHttpClient, provideHttpClientTesting)
- ✅ Tests con mocks apropiados
- ✅ Sin errores de TypeScript detectados

## Cómo ejecutar los tests localmente

### Opción 1: Ejecución normal (con watch mode)
```cmd
npm test
```

### Opción 2: Ejecución única (sin watch mode)
```cmd
npm test -- --watch=false
```

### Opción 3: Con ChromeHeadless (para CI/CD)
```cmd
npm test -- --watch=false --browsers=ChromeHeadless
```

### Opción 4: Con ChromeHeadlessCI (para entornos sin GUI)
```cmd
npm test -- --watch=false --browsers=ChromeHeadlessCI
```

## Requisitos

Para ejecutar los tests necesitas:
1. **Node.js** instalado (versión 18 o superior recomendada)
2. **Google Chrome** instalado en el sistema
3. Todas las dependencias instaladas (`npm install`)

## Verificación de la configuración

### 1. Verificar que Chrome está instalado
```cmd
where chrome
```

Si Chrome no está en el PATH, Karma intentará encontrarlo en las ubicaciones estándar.

### 2. Verificar dependencias
```cmd
npm list karma karma-chrome-launcher karma-jasmine
```

### 3. Ejecutar compilación TypeScript
```cmd
npx tsc --noEmit
```

## Problemas comunes y soluciones

### Chrome no encontrado
Si recibes un error de que Chrome no se encuentra:
- Instala Google Chrome
- O instala Puppeteer: `npm install --save-dev puppeteer karma-chrome-launcher`
- Configura Karma para usar el Chrome de Puppeteer

### Tests fallan con timeout
- Aumenta el timeout en karma.conf.js
- Verifica que la API mock no esté haciendo llamadas reales

### Errores de compilación
- Ejecuta `npm install` para asegurar todas las dependencias
- Verifica que tsconfig.spec.json esté correctamente configurado

## Análisis de cobertura

Para ver la cobertura de código:
```cmd
npm test -- --watch=false --code-coverage
```

El reporte se generará en `coverage/proyectoFinal/index.html`

## Tests implementados

### AppComponent
- ✅ Debe crear la aplicación
- ✅ Debe renderizar el header correctamente

### TodosComponent
- ✅ Debe crear el componente
- ✅ Debe llamar a list() al inicializar
- ✅ create() debe llamar al servicio y resetear el formulario
- ✅ remove() debe llamar al servicio y recargar la lista
- ✅ goToEdit debe navegar a la página de edición

### TodoService
- ✅ list() debe retornar una lista paginada
- ✅ create() debe lanzar error si la API retorna null/undefined
- ✅ delete() debe llamar a DELETE en la URL correcta
- ✅ update() debe llamar a PUT en la URL correcta

### ModalComponent
- ✅ No debe renderizar cuando está cerrado
- ✅ Debe renderizar cuando está abierto
- ✅ Debe emitir close al hacer click en el backdrop

## Nota importante

Los tests están diseñados para ejecutarse en tu entorno local donde:
- Tienes acceso a un navegador (Chrome)
- Puedes ver la salida de Karma en consola
- El sistema puede lanzar procesos de navegador headless

Si los tests no se ejecutan en este entorno remoto, es normal debido a limitaciones de:
- Falta de navegador instalado o accesible
- Restricciones de seguridad del entorno
- Limitaciones de procesos headless

**Recomendación**: Ejecuta `npm test` en tu máquina local para ver los resultados completos.
