# Configuración de Docker para ProyectoFinal

Este proyecto utiliza un **único Dockerfile multi-stage** que soporta tanto desarrollo como producción.

## 1. Dockerfile Multi-Stage

El Dockerfile tiene tres etapas (stages):

### Stage 1: Build
- Construye la aplicación Angular con Node.js 20 Alpine
- Se usa solo para producción

### Stage 2: Development
- Imagen para desarrollo con hot-reload habilitado
- Node.js 20 Alpine
- Montaje de volúmenes para desarrollo en tiempo real

### Stage 3: Production
- Imagen optimizada con Nginx Alpine
- Sirve los archivos estáticos construidos
- Configuración de seguridad y caché

## Uso

### Desarrollo Local con Docker Compose

```bash
# Iniciar el entorno de desarrollo (usa el stage 'development')
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

La aplicación estará disponible en `http://localhost:4200` con hot-reload habilitado.

### Producción con Docker

```bash
# Construir la imagen de producción (usa el stage 'production')
docker build --target production -t proyectofinal-web:latest .

# Ejecutar el contenedor
docker run -p 80:80 proyectofinal-web:latest
```

La aplicación estará disponible en `http://localhost`

### Desarrollo sin Docker Compose

```bash
# Construir la imagen de desarrollo
docker build --target development -t proyectofinal-web:dev .

# Ejecutar con volúmenes montados
docker run -p 4200:4200 \
  -v $(pwd)/src:/app/src \
  -v $(pwd)/angular.json:/app/angular.json \
  proyectofinal-web:dev
```

## Arquitectura del Dockerfile

```
┌─────────────────────────────────────────┐
│          Dockerfile (Multi-Stage)       │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  Stage 1: Build (node:20-alpine)  │ │
│  │  - npm ci                          │ │
│  │  - npm run build (solo prod)      │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  Stage 2: Development             │ │
│  │  (node:20-alpine)                 │ │
│  │  - npm install                     │ │
│  │  - Hot reload                      │ │
│  │  - Puerto 4200                     │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  Stage 3: Production              │ │
│  │  (nginx:alpine)                   │ │
│  │  - Copia archivos de build        │ │
│  │  - Puerto 80                       │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## Selección de Stage

- **Docker Compose**: Usa `target: development` automáticamente
- **CI/CD Pipeline**: Usa `target: production` para construir la imagen
- **Build manual**: Especifica `--target <stage>` en el comando docker build

El proyecto está configurado para conectarse automáticamente al contenedor `finalproject` que ejecuta la API en el puerto 8080.

### Requisitos:

1. El contenedor `finalproject` debe estar ejecutándose
2. Debe estar en la red `finalproject-network`

### Verificar la red:

```bash
# Listar redes Docker
docker network ls

# Inspeccionar la red finalproject-network
docker network inspect finalproject-network

# Verificar que el contenedor finalproject está en la red
docker network inspect finalproject-network | grep finalproject
```

### Si la red no existe:

```bash
# Crear la red
docker network create finalproject-network

# Conectar el contenedor finalproject a la red
docker network connect finalproject-network finalproject
```

## Variables de entorno

### Desarrollo (Dockerfile.dev):
- `API_URL=http://finalproject:8080/api`: URL de la API backend
- `CHOKIDAR_USEPOLLING=true`: Habilitar polling para hot-reload

### Producción (Dockerfile):
La configuración de la API se gestiona en tiempo de build de Angular.

## Arquitectura de la red

```
┌─────────────────────────────────────┐
│  finalproject-network (Docker)     │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  proyectofinal-web-dev       │  │
│  │  (Angular - Puerto 4200)     │  │
│  └───────────┬──────────────────┘  │
│              │                      │
│              │ HTTP                 │
│              │                      │
│  ┌───────────▼──────────────────┐  │
│  │  finalproject                │  │
│  │  (API Backend - Puerto 8080) │  │
│  └──────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

## Configuración de Nginx (Producción)

El archivo `docker/nginx.conf` contiene:

- Configuración de caché para assets estáticos
- Headers de seguridad
- Soporte para SPA (Single Page Application)
- Health check endpoint en `/health`

## CI/CD Pipeline

La pipeline de GitHub Actions construye automáticamente la imagen de producción y la sube a Azure Container Registry después de:

1. Ejecutar los tests
2. Analizar el código con SonarCloud
3. Escanear vulnerabilidades con Trivy

Ver más detalles en: [CI_ACR_SONARCLOUD_SETUP.md](./ci/CI_ACR_SONARCLOUD_SETUP.md)

## Troubleshooting

### El hot-reload no funciona en Windows/Mac:

Ya está configurado con `CHOKIDAR_USEPOLLING=true` y `--poll 2000`

### No se conecta al contenedor finalproject:

```bash
# Verificar que ambos contenedores están en la misma red
docker network inspect finalproject-network

# Verificar que el contenedor finalproject está corriendo
docker ps | grep finalproject

# Probar conexión desde el contenedor web
docker exec -it proyectofinal-web-dev sh
wget -O- http://finalproject:8080/health
```

### Error al construir la imagen:

```bash
# Limpiar cache de Docker
docker builder prune -a

# Reconstruir sin cache
docker build --no-cache -t proyectofinal-web:latest .
```

## Comandos útiles

```bash
# Ver logs del contenedor
docker logs -f proyectofinal-web-dev

# Acceder al shell del contenedor
docker exec -it proyectofinal-web-dev sh

# Ver el tamaño de la imagen
docker images proyectofinal-web

# Inspeccionar el contenedor
docker inspect proyectofinal-web-dev

# Ver las redes del contenedor
docker inspect proyectofinal-web-dev | grep -A 10 Networks
```

