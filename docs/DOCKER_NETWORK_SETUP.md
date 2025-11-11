# Configuración de Red Docker para Conectar con Backend Desplegado

## Escenario
Tu aplicación Angular (app-dev) necesita comunicarse con un backend (finalproject) que ya está desplegado en Docker en el puerto 8080.

## Opciones de Configuración

### Opción 1: Usar la misma red Docker (Recomendado)

Cuando levantes el contenedor del backend, añádelo a la red `finalproject-network`:

```bash
# Si el contenedor ya está corriendo, conéctalo a la red
docker network connect finalproject-network finalproject

# O al levantar un nuevo contenedor del backend
docker run -d --name finalproject --network finalproject-network -p 8080:8080 <imagen-backend>
```

Luego levanta el frontend:
```bash
docker compose up -d app-dev
```

La aplicación Angular accederá al backend usando `http://finalproject:8080/api`.

### Opción 2: Usar host.docker.internal

Si el backend corre en tu máquina local (fuera de Docker o en otro contenedor), modifica la variable de entorno en docker-compose.yml:

```yaml
environment:
  - API_URL=http://host.docker.internal:8080/api
```

### Opción 3: Docker Compose con servicio externo

Si tienes el Dockerfile del backend, puedes incluirlo en el mismo docker-compose.yml:

```yaml
services:
  app-dev:
    # ... configuración actual
  
  finalproject:
    build:
      context: ../ruta-al-backend
      dockerfile: Dockerfile
    container_name: finalproject
    ports:
      - "8080:8080"
    networks:
      - finalproject-network
```

## Verificar Conectividad

Una vez que ambos contenedores estén corriendo:

```bash
# Ver contenedores en la red
docker network inspect finalproject-network

# Probar conectividad desde el contenedor Angular
docker exec -it finalproject-dev sh
apk add curl
curl http://finalproject:8080/api
```

## Troubleshooting

### Error: Cannot reach backend
1. Verifica que ambos contenedores estén en la misma red
2. Verifica que el backend esté escuchando en 0.0.0.0 (no solo localhost)
3. Revisa los logs: `docker logs finalproject`

### Error: Network not found
```bash
# Crear la red manualmente si es necesario
docker network create finalproject-network
```

