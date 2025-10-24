# Ejemplos de Uso de la Pipeline CI

## 🎯 Workflow típico con Pull Requests

### 1. Crear una rama para tu feature

```bash
git checkout -b feature/nueva-funcionalidad
```

### 2. Realizar cambios y commits

```bash
git add .
git commit -m "feat: añadir nueva funcionalidad"
```

### 3. Antes de hacer push, verifica localmente

```bash
# Verificar que compila
npm run build

# Ejecutar tests
npm run test:headless
```

### 4. Push a tu rama

```bash
git push origin feature/nueva-funcionalidad
```

### 5. Crear Pull Request en GitHub

1. Ve a tu repositorio en GitHub
2. Click en "Pull requests" > "New pull request"
3. Selecciona tu rama
4. Rellena el template de PR
5. Click en "Create pull request"

### 6. La pipeline se ejecutará automáticamente

Verás algo como esto en tu PR:

```
✓ CI / build-and-test (pull_request)
  All checks have passed
```

O si algo falla:

```
✗ CI / build-and-test (pull_request)
  Some checks were not successful
```

## 📊 Interpretando los resultados

### ✅ Build exitoso

```
✓ Checkout código
✓ Configurar Node.js 20.x
✓ Instalar dependencias
✓ Verificar compilación
✓ Ejecutar tests
✓ Subir cobertura de código
```

**Acción**: Tu PR está listo para revisión y merge.

### ❌ Error de compilación

```
✓ Checkout código
✓ Configurar Node.js 20.x
✓ Instalar dependencias
✗ Verificar compilación
  Error: TS2322: Type 'string' is not assignable to type 'number'.
```

**Acción**: 
1. Click en "Details" para ver el error completo
2. Corrige los errores de compilación localmente
3. Haz commit y push de los cambios
4. La pipeline se ejecutará automáticamente de nuevo

### ❌ Tests fallidos

```
✓ Checkout código
✓ Configurar Node.js 20.x
✓ Instalar dependencias
✓ Verificar compilación
✗ Ejecutar tests
  Chrome Headless 119.0.0.0 (Linux x86_64): Executed 15 of 16 (1 FAILED)
```

**Acción**:
1. Click en "Details" para ver qué test falló
2. Ejecuta los tests localmente: `npm run test:headless`
3. Corrige el test o el código
4. Haz commit y push

## 🔍 Ver logs detallados

1. Ve a la pestaña "Actions" en tu repositorio
2. Click en el workflow que falló
3. Click en el job "build-and-test"
4. Expande el paso que falló para ver logs detallados

## 🚦 Estados de la Pipeline

| Estado | Significado | Acción |
|--------|-------------|--------|
| 🟡 Pending | La pipeline está ejecutándose | Espera a que termine |
| ✅ Success | Todo pasó correctamente | Listo para merge |
| ❌ Failed | Algo falló | Revisa los logs y corrige |
| 🔵 Skipped | La pipeline no se ejecutó | Verifica la configuración |
| ⚪ Cancelled | Alguien canceló la ejecución | Re-ejecuta si es necesario |

## 💡 Tips y Buenas Prácticas

### Ejecuta siempre localmente antes de push

```bash
# Crea un script para verificar todo
npm run build && npm run test:headless
```

### Si la pipeline falla en CI pero funciona localmente

1. **Verifica las dependencias**: Asegúrate de que `package-lock.json` está actualizado
   ```bash
   npm install
   git add package-lock.json
   git commit -m "chore: actualizar package-lock.json"
   ```

2. **Verifica variables de entorno**: CI puede tener diferentes variables de entorno

3. **Verifica rutas**: CI usa Linux (case-sensitive), tu local puede ser Windows/Mac

### Re-ejecutar la pipeline

Si crees que fue un error temporal:
1. Ve a la pestaña "Actions"
2. Selecciona el workflow fallido
3. Click en "Re-run all jobs"

### Ver cobertura de código

1. Si configuraste Codecov, ve a `https://codecov.io/gh/USUARIO/REPOSITORIO`
2. Verás gráficos y estadísticas de cobertura
3. Puedes ver qué líneas no están cubiertas por tests

## 📈 Ejemplo de salida de tests exitosos

```
Chrome Headless 119.0.0.0 (Linux x86_64): Executed 16 of 16 SUCCESS (0.234 secs / 0.198 secs)
TOTAL: 16 SUCCESS

=============================== Coverage summary ===============================
Statements   : 85.71% ( 36/42 )
Branches     : 75% ( 9/12 )
Functions    : 83.33% ( 10/12 )
Lines        : 84.21% ( 32/38 )
================================================================================
```

## 🛑 Prevenir merges sin pasar CI

Para asegurar que nadie mergee código sin pasar CI:

1. Ve a Settings > Branches en GitHub
2. Click en "Add rule" o edita la regla de `main`
3. Marca:
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - Selecciona: `build-and-test`
4. Opcionalmente marca:
   - ✅ Require linear history
   - ✅ Include administrators

Ahora **nadie** podrá mergear sin que la pipeline pase, ni siquiera administradores.

## 📚 Recursos Adicionales

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Branch Protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches)
- [Codecov Documentation](https://docs.codecov.com/)

