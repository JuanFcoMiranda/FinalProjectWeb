# 📝 ProyectoFinal

![CI](https://github.com/USUARIO/REPOSITORIO/workflows/CI/badge.svg)

> **Nota**: Reemplaza `USUARIO` y `REPOSITORIO` en el badge anterior con tu usuario y nombre de repositorio de GitHub.

Proyecto Angular para gestión de tareas (Todo List) con autenticación, CRUD completo y pipeline de CI/CD.

**Generado con:** [Angular CLI](https://github.com/angular/angular-cli) version 20.3.6

---

## 🚀 Quick Start

```bash
# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm start
# Navega a http://localhost:4200/

# Ejecutar tests
npm test

# Compilar para producción
npm run build
```

## 🧪 Tests

### Ejecutar tests

```bash
# Tests en modo watch (desarrollo)
npm test

# Tests una sola vez con cobertura
npm run test:headless

# Tests para CI/CD
npm run test:ci
```

### Ver cobertura de código

```bash
npm run test:headless

# Ver reporte HTML
start coverage/proyectoFinal/index.html  # Windows
open coverage/proyectoFinal/index.html   # macOS
```

## 📚 Documentación

La documentación del proyecto está organizada en carpetas temáticas:

### 🧪 Tests
- **[Guía de Tests](docs/tests/TEST_GUIDE.md)** - Guía completa para ejecutar y escribir tests
- **[Guía Rápida](docs/tests/TESTS_README.md)** - Comandos esenciales y quick reference
- **[Solución de Problemas](docs/tests/TEST_TROUBLESHOOTING.md)** - Problemas comunes y sus soluciones
- **[Summary Preview](docs/tests/summary-preview.md)** - Reporte de tests y cobertura

### 🚀 CI/CD
- **[Guía de CI/CD](docs/ci/CI_CD_GUIDE.md)** - Pipeline de GitHub Actions completa
- **[Ejemplos de Workflow](docs/ci/CI_WORKFLOW_EXAMPLES.md)** - Casos de uso y ejemplos prácticos

### ⚙️ Configuración
- **[Configuración de Chrome](docs/config/CHROME_SETUP_GUIDE.md)** - Guía detallada para configurar Chrome
- **[Chrome Quick Start](docs/config/CHROME_CONFIG_README.md)** - Resumen rápido de configuración

## 🏗️ Estructura del Proyecto

```
src/
├── app/
│   ├── core/              # Servicios core (auth, interceptors)
│   ├── login/             # Módulo de autenticación
│   ├── shared/            # Componentes compartidos (modal)
│   └── todos/             # Feature de gestión de tareas
│       ├── todos.component.ts           # Lista de todos
│       ├── todo-edit-page.component.ts  # Edición en página separada
│       └── todo.service.ts              # Servicio de datos
├── environments/          # Configuración de entornos (dev/prod)
└── ...

docs/                      # 📚 Documentación organizada
├── ci/                    # Documentación de CI/CD
├── config/                # Guías de configuración
└── tests/                 # Documentación de tests

.github/
├── workflows/             # Pipelines de GitHub Actions
└── scripts/               # Scripts de CI/CD
```

## 🛠️ Tecnologías

- **Angular 20** - Framework principal
- **TypeScript** - Lenguaje de programación
- **RxJS** - Programación reactiva
- **Standalone Components** - Arquitectura moderna de Angular
- **Signals** - Sistema de reactividad de Angular
- **Karma + Jasmine** - Testing unitario
- **GitHub Actions** - CI/CD automático

## 🎯 Características

- ✅ **CRUD completo** de tareas (crear, leer, actualizar, eliminar)
- ✅ **Autenticación** (puede deshabilitarse para desarrollo)
- ✅ **Edición en página separada** con navegación
- ✅ **Modal de errores** para feedback al usuario
- ✅ **Tests unitarios** con cobertura de código
- ✅ **CI/CD** con GitHub Actions
- ✅ **Reportes automáticos** de tests y cobertura en GitHub

## 📊 Estado del Proyecto

- ✅ **Tests**: Pasando (17 tests)
- 📈 **Cobertura**: Ver [Summary Preview](docs/tests/summary-preview.md)
- 🚀 **CI/CD**: Configurado y funcionando
- 🔄 **Pipeline**: Verificación automática en PRs

## 🤝 Contribuir

1. **Crear rama:**
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```

2. **Desarrollar y verificar:**
   ```bash
   npm run build
   npm run test:headless
   ```

3. **Commit con mensaje descriptivo:**
   ```bash
   git commit -m "feat: añadir nueva funcionalidad"
   ```

4. **Push y crear Pull Request:**
   ```bash
   git push origin feature/nueva-funcionalidad
   ```

5. **Esperar CI** y solicitar revisión

Ver [Ejemplos de Workflow](docs/ci/CI_WORKFLOW_EXAMPLES.md) para más detalles.

## 📝 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm start` | Inicia servidor de desarrollo en http://localhost:4200 |
| `npm run build` | Compila el proyecto para producción |
| `npm test` | Ejecuta tests en modo watch |
| `npm run test:headless` | Tests una vez con cobertura de código |
| `npm run test:ci` | Tests optimizados para CI/CD |
| `npm run test:once` | Tests una vez sin watch |

## 🔧 Comandos de Angular CLI

```bash
# Generar componente
ng generate component nombre-componente

# Generar servicio
ng generate service nombre-servicio

# Generar interfaz
ng generate interface nombre-interface

# Ver todos los comandos
ng generate --help
```

## 🆘 ¿Necesitas Ayuda?

### Tests no funcionan
- 📖 [Solución de Problemas de Tests](docs/tests/TEST_TROUBLESHOOTING.md)
- 🔍 Revisa que Chrome esté instalado

### Chrome no se encuentra
- 🌐 [Configuración de Chrome](docs/config/CHROME_SETUP_GUIDE.md)
- ⚡ [Quick Start de Chrome](docs/config/CHROME_CONFIG_README.md)

### Problemas con CI/CD
- 🚀 [Guía de CI/CD](docs/ci/CI_CD_GUIDE.md)
- 📝 [Ejemplos de Workflow](docs/ci/CI_WORKFLOW_EXAMPLES.md)

### Otros recursos
- [Angular Documentation](https://angular.dev)
- [Angular CLI Reference](https://angular.dev/tools/cli)
- [RxJS Documentation](https://rxjs.dev)

## 📄 Licencia

Este proyecto fue creado con fines educativos.

---

**Última actualización:** Noviembre 2025

