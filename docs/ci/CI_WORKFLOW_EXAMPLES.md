# 📝 Ejemplos de Uso de la Pipeline CI/CD

Esta guía proporciona ejemplos prácticos de cómo trabajar con la pipeline de CI/CD del proyecto.

## 🎯 Workflows Típicos

### 1. Desarrollo de Nueva Funcionalidad

#### Paso 1: Crear una rama

```bash
git checkout -b feature/nueva-funcionalidad
```

#### Paso 2: Desarrollar y verificar localmente

```bash
# Hacer cambios en el código
# ...

# Verificar que compila
npm run build

# Ejecutar tests
npm run test:headless

# Si todo está bien, hacer commit
git add .
git commit -m "feat: añadir nueva funcionalidad"
```

#### Paso 3: Push y crear Pull Request

```bash
git push origin feature/nueva-funcionalidad
```

Luego en GitHub:
1. Ir a la página del repositorio
2. Click en "Pull requests"
3. Click en "New pull request"
4. Seleccionar tu rama
5. Completar descripción y crear PR

#### Paso 4: Revisar resultados de CI

La pipeline se ejecutará automáticamente. Verifica:
- ✅ Todos los tests pasan
- 📊 La cobertura no disminuyó
- 🔍 No hay warnings importantes

#### Paso 5: Merge

Una vez aprobado y con CI en verde, hacer merge del PR.

### 2. Fix de Bug

```bash
# Crear rama desde develop o main
git checkout develop
git pull
git checkout -b fix/corregir-error-login

# Hacer el fix
# Añadir test que reproduzca el bug
# Verificar que el test pasa

# Commit
git add .
git commit -m "fix: corregir validación en login"

# Push y crear PR
git push origin fix/corregir-error-login
```

### 3. Hotfix en Producción

```bash
# Crear rama desde main
git checkout main
git pull
git checkout -b hotfix/error-critico

# Hacer el fix urgente
# Verificar localmente

# Commit y push
git add .
git commit -m "hotfix: corregir error crítico en producción"
git push origin hotfix/error-critico

# Crear PR directo a main
# Una vez aprobado, también merge a develop
```

## 🔄 Escenarios Comunes

### Escenario 1: Tests fallan en CI pero pasan localmente

**Problema:**
```
✅ Tests locales: PASS
❌ Tests CI: FAIL
```

**Solución:**

1. Ejecutar tests con configuración de CI localmente:
```bash
npm run test:ci
```

2. Verificar diferencias de entorno:
```bash
# Verificar versión de Node
node --version

# Verificar versión de npm
npm --version
```

3. Revisar logs detallados en GitHub Actions

4. Posibles causas:
   - Timeouts por recursos limitados
   - Tests que dependen de timing
   - Diferencias en Chrome/ChromeHeadless
   - Variables de entorno faltantes

### Escenario 2: Build falla por errores de TypeScript

**Problema:**
```
❌ Build failed: Type errors
```

**Solución:**

1. Ejecutar build localmente:
```bash
npm run build
```

2. Verificar errores de tipos:
```bash
# Ver errores de TypeScript
npx tsc --noEmit
```

3. Corregir los errores y hacer commit:
```bash
git add .
git commit -m "fix: corregir errores de tipos"
git push
```

### Escenario 3: Cobertura disminuyó

**Problema:**
```
⚠️ Coverage decreased from 85% to 78%
```

**Solución:**

1. Ver qué archivos tienen menos cobertura:
```bash
npm run test:headless
start coverage/proyectoFinal/index.html
```

2. Añadir tests para las líneas no cubiertas

3. Verificar nueva cobertura:
```bash
npm run test:headless
```

4. Hacer commit con tests adicionales:
```bash
git add .
git commit -m "test: añadir tests para mejorar cobertura"
git push
```

### Escenario 4: Merge Conflicts

**Problema:**
```
❌ Cannot merge: conflicts with base branch
```

**Solución:**

1. Actualizar rama local con cambios de develop/main:
```bash
git checkout feature/mi-rama
git fetch origin
git merge origin/develop
```

2. Resolver conflictos manualmente

3. Verificar que todo funciona:
```bash
npm install
npm run build
npm run test:headless
```

4. Completar merge:
```bash
git add .
git commit -m "merge: resolver conflictos con develop"
git push
```

## 📊 Interpretando Resultados del CI

### Summary Page

La página de Summary muestra:

```
📊 Test & Coverage Report

✅ Tests: Passed
Total: 17 | Passed: ✅ 17 | Failed: ❌ 0 | Skipped: ⏭️ 0

📋 Test Details
Suite             | Test                              | Status | Time
TodoService       | should create todo                | ✅     | 23ms
TodoService       | should update todo                | ✅     | 15ms
...

📈 Code Coverage
File                    | Statements | Branches | Functions | Lines
todo.service.ts         | ████████░░ 85.2%
todos.component.ts      | ██████████ 100%
...

🧮 Complexity Analysis
File                    | Complexity | Status
todo.service.ts         | 12         | ⚠️ Moderate
todos.component.ts      | 6          | ✅ Low
```

### Interpretación de Iconos

- ✅ **Verde** - Todo correcto
- ❌ **Rojo** - Algo falló
- ⚠️ **Amarillo** - Warning, requiere atención
- 🟢 **85%+** - Cobertura excelente
- 🟡 **60-85%** - Cobertura aceptable
- 🔴 **<60%** - Cobertura insuficiente

## 🚀 Workflows Avanzados

### Deploy Automático a Staging

```yaml
# En .github/workflows/ci.yml
deploy-staging:
  needs: build-and-test
  if: github.ref == 'refs/heads/develop'
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - name: Deploy to Staging
      run: npm run deploy:staging
```

Usar:
```bash
# Hacer merge a develop
git checkout develop
git merge feature/mi-rama
git push

# CI desplegará automáticamente a staging
```

### Tags y Releases

```bash
# Crear tag después de merge a main
git checkout main
git pull
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

### Matrix Testing (múltiples versiones)

```yaml
strategy:
  matrix:
    node-version: [18.x, 20.x, 22.x]
```

## 📝 Convenciones de Commits

Usar [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Nueva funcionalidad
git commit -m "feat: añadir filtro de búsqueda"

# Bug fix
git commit -m "fix: corregir error en validación"

# Tests
git commit -m "test: añadir tests para TodoService"

# Documentación
git commit -m "docs: actualizar README"

# Refactoring
git commit -m "refactor: simplificar lógica de filtrado"

# Performance
git commit -m "perf: optimizar carga de lista"

# Build/CI
git commit -m "ci: actualizar workflow de GitHub Actions"
```

## 🎓 Tips y Mejores Prácticas

### 1. Commits Pequeños
```bash
# ❌ Mal
git commit -m "feat: implementar toda la funcionalidad de usuarios"

# ✅ Bien
git commit -m "feat: añadir modelo de usuario"
git commit -m "feat: añadir servicio de usuarios"
git commit -m "feat: añadir componente de lista de usuarios"
```

### 2. Tests Antes de Push
```bash
# Script útil
npm run build && npm run test:headless && git push
```

### 3. Revisar Cambios Antes de Commit
```bash
git diff
git status
git add -p  # Añadir cambios interactivamente
```

### 4. Usar Branches Descriptivos
```bash
# ❌ Mal
git checkout -b fix

# ✅ Bien
git checkout -b fix/login-validation-error
```

### 5. Pull Antes de Push
```bash
git pull --rebase origin develop
git push
```

## 🔗 Recursos Adicionales

- [Guía de CI/CD](CI_CD_GUIDE.md)
- [Guía de Tests](../tests/TEST_GUIDE.md)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Conventional Commits](https://www.conventionalcommits.org/)

## 🆘 ¿Necesitas Ayuda?

Si tienes problemas con la pipeline:

1. Revisa los logs en GitHub Actions
2. Ejecuta los comandos localmente
3. Consulta la [Guía de Troubleshooting](../tests/TEST_TROUBLESHOOTING.md)
4. Busca el error en los issues del repositorio
5. Pregunta al equipo

¡Feliz coding! 🎉

