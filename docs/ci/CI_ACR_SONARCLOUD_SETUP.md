# Configuración de CI/CD con Azure Container Registry y SonarCloud

Este documento describe cómo configurar los secretos necesarios para la pipeline de CI/CD.

## Secretos requeridos en GitHub

Para que la pipeline funcione correctamente, necesitas configurar los siguientes secretos en tu repositorio de GitHub:

### 1. Azure Container Registry (ACR)

- **ACR_REGISTRY**: URL de tu Azure Container Registry (ejemplo: `miregistry.azurecr.io`)
- **ACR_USERNAME**: Nombre de usuario para autenticación en ACR
- **ACR_PASSWORD**: Contraseña para autenticación en ACR

#### Cómo obtener las credenciales de ACR:

```bash
# Habilitar admin user en tu ACR
az acr update -n <nombre-acr> --admin-enabled true

# Obtener las credenciales
az acr credential show -n <nombre-acr>
```

### 2. SonarCloud

- **SONAR_TOKEN**: Token de autenticación de SonarCloud
- **GITHUB_TOKEN**: Token de GitHub (ya disponible automáticamente en GitHub Actions)

#### Cómo obtener el token de SonarCloud:

1. Ve a [SonarCloud](https://sonarcloud.io/)
2. Inicia sesión con tu cuenta de GitHub
3. Ve a **My Account** → **Security**
4. Genera un nuevo token
5. Copia el token y guárdalo como secreto en GitHub

### 3. Configurar el archivo sonar-project.properties

Edita el archivo `sonar-project.properties` en la raíz del proyecto:

```properties
sonar.projectKey=tu-organizacion_ProyectoFinal
sonar.organization=tu-organizacion
```

Reemplaza:
- `tu-organizacion`: con el nombre de tu organización en SonarCloud
- El `projectKey` debe coincidir con el que configures en SonarCloud

### 4. Cómo añadir secretos en GitHub:

1. Ve a tu repositorio en GitHub
2. Click en **Settings** → **Secrets and variables** → **Actions**
3. Click en **New repository secret**
4. Añade cada secreto con su nombre y valor correspondiente

## Pipeline de CI/CD

La pipeline realiza las siguientes acciones:

### Job 1: Build and Test
1. Checkout del código
2. Instalación de dependencias
3. Build del proyecto
4. Ejecución de tests con cobertura
5. **Análisis de código con SonarCloud**
6. Generación de resumen de CI

### Job 2: Build and Push Docker
(Solo se ejecuta en las ramas `main` y `develop`)

1. Checkout del código
2. Configuración de Docker Buildx
3. Login en Azure Container Registry
4. Construcción de la imagen Docker
5. **Escaneo de vulnerabilidades con Trivy**
   - Genera un reporte SARIF
   - Sube los resultados a GitHub Security
   - Falla si encuentra vulnerabilidades CRITICAL o HIGH
6. Push de la imagen a ACR (solo si el escaneo pasa)

## Estructura de la imagen Docker

La imagen Docker utiliza multi-stage build con un único Dockerfile:

1. **Stage Build**: Construye la aplicación Angular con Node.js
2. **Stage Development**: Imagen para desarrollo local con hot-reload
3. **Stage Production**: Sirve la aplicación con Nginx Alpine

### Uso de stages:

- **Desarrollo local**: `docker-compose up` usa `target: development`
- **CI/CD**: La pipeline usa `target: production`
- **Manual**: `docker build --target <stage> ...`

### Tags generados:

- `latest`: Para la rama main
- `<branch>-<sha>`: Para cada commit
- `<branch>`: Para cada rama

## Escaneo de vulnerabilidades

Trivy escanea la imagen Docker en busca de:
- Vulnerabilidades CRITICAL
- Vulnerabilidades HIGH

Si se encuentran vulnerabilidades, el pipeline falla y NO se sube la imagen a ACR.

Los resultados se pueden ver en:
- GitHub Security tab → Code scanning alerts
- En los logs de la pipeline

## Métricas de SonarCloud

SonarCloud analiza:
- Cobertura de código
- Code smells
- Bugs
- Vulnerabilidades de seguridad
- Duplicación de código
- Complejidad ciclomática

Los resultados están disponibles en el dashboard de SonarCloud.

## Próximos pasos

1. Configurar todos los secretos en GitHub
2. Crear el proyecto en SonarCloud
3. Actualizar `sonar-project.properties` con tu organización
4. Hacer push a las ramas `main` o `develop` para activar la pipeline
5. Verificar que la imagen se construye y se sube correctamente a ACR

