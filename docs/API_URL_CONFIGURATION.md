# Configuración de API URL - Resumen de Cambios

## Problema Resuelto
La aplicación Angular estaba intentando conectarse a `https://localhost:5001/api` que no existe. Se ha actualizado para usar `http://finalproject:8080/api`.

## Cambios Realizados

### 1. Archivos de Environment
Actualizados ambos archivos de configuración de entorno:

**src/environments/environment.development.ts**
```typescript
apiUrl: 'http://finalproject:8080/api'  // Antes: https://localhost:5001/api
```

**src/environments/environment.ts**
```typescript
apiUrl: 'http://finalproject:8080/api'  // Antes: https://localhost:5001/api
```

### 2. Dockerfile
```dockerfile
ENV API_URL=http://finalproject:8080/api  # Antes: https://localhost:5001/api
```

### 3. docker-compose.yml
```yaml
environment:
  - API_URL=http://finalproject:8080/api
```

## Cómo Funciona

1. **Dentro de Docker**: Los contenedores en la misma red Docker pueden comunicarse usando sus nombres de servicio como hostname. Por eso usamos `http://finalproject:8080/api`.

2. **Fallback en Environment**: Los archivos de environment intentan leer la variable en este orden:
   - `globalThis.__env?.apiUrl` (si existe)
   - `globalThis['API_URL']` (si existe)
   - Valor por defecto: `http://finalproject:8080/api`

## Para Conectar con el Backend

Cuando levantes tu contenedor backend, asegúrate de que esté en la misma red:

```bash
# Opción 1: Conectar un contenedor existente
docker network connect finalproject-network finalproject

# Opción 2: Al crear el contenedor
docker run -d --name finalproject --network finalproject-network -p 8080:8080 <tu-imagen>
```

## Verificar Conectividad

```bash
# Ver contenedores en la red
docker network inspect finalproject-network

# Probar desde el contenedor Angular
docker exec -it finalproject-dev sh
# Dentro del contenedor:
wget -O- http://finalproject:8080/api
```

## URLs de Acceso

- **Frontend**: http://localhost:4200
- **Backend (desde el host)**: http://localhost:8080
- **Backend (desde el contenedor Angular)**: http://finalproject:8080

## Notas Importantes

⚠️ **HTTP vs HTTPS**: Se cambió de `https://` a `http://` porque la comunicación entre contenedores en desarrollo generalmente no usa SSL.

⚠️ **Producción**: Para producción, considera usar HTTPS y un proxy reverso (nginx) que maneje los certificados SSL.

