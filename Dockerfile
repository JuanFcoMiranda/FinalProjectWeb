# Dockerfile único para desarrollo/producción
# Build arg para determinar el entorno (dev o prod)
ARG BUILD_ENV=prod

# Etapa 1: Build
FROM node:20-alpine AS build

# Crear usuario no privilegiado
RUN addgroup -g 1001 -S nodejs && adduser -S angular -u 1001

WORKDIR /app

# Asegurarnos de que /app tiene los permisos adecuados
RUN chown -R root:root /app && chmod 0755 /app

# Copiar archivos de dependencias (establecer owner y permisos en el COPY)
# --chmod requiere BuildKit, pero es ampliamente soportado en entornos modernos
COPY --chown=angular:nodejs --chmod=0444 package*.json ./
# Instalar dependencias como root para que npm pueda escribir node_modules
RUN npm ci --legacy-peer-deps --ignore-scripts \
    && chown -R angular:nodejs /app/node_modules /app/package-lock.json || true

# Copiar solo los archivos necesarios para el build (los sensibles deben estar en .dockerignore)
COPY --chown=angular:nodejs --chmod=0444 tsconfig*.json ./
COPY --chown=angular:nodejs --chmod=0444 angular.json ./
COPY --chown=angular:nodejs src ./src
COPY --chown=angular:nodejs public ./public

# Cambiar a usuario no privilegiado para pasos siguientes
USER angular

# Construir la aplicación para producción si corresponde
ARG BUILD_ENV
RUN if [ "$BUILD_ENV" = "prod" ]; then npm run build; fi

# Etapa 2: Desarrollo
FROM node:20-alpine AS development

# Crear usuario no privilegiado
RUN addgroup -g 1001 -S nodejs && adduser -S angular -u 1001

WORKDIR /app

# Asegurarnos de que /app tiene los permisos adecuados
RUN chown -R root:root /app && chmod 0755 /app

# Copiar package files con permisos de solo lectura y propietario configurado
COPY --chown=angular:nodejs --chmod=0444 package*.json ./
# Instalar dependencias como root, luego asegurar ownership
RUN npm install --ignore-scripts \
    && chown -R angular:nodejs /app/node_modules /app/package-lock.json || true

# Copiar solo los archivos necesarios para desarrollo (excluir sensibles a través de .dockerignore)
COPY --chown=angular:nodejs --chmod=0444 tsconfig*.json ./
COPY --chown=angular:nodejs --chmod=0444 angular.json ./
COPY --chown=angular:nodejs --chmod=0444 karma.conf.js ./
COPY --chown=angular:nodejs src ./src
COPY --chown=angular:nodejs public ./public

# Traspasar propiedad a usuario no privilegiado
RUN chown -R angular:nodejs /app || true

# Cambiar a usuario no privilegiado
USER angular

# Variables de entorno para desarrollo
ENV API_URL=http://finalproject:8080/api
ENV CHOKIDAR_USEPOLLING=true

# Exponer puerto de desarrollo
EXPOSE 4200

# Comando para desarrollo con hot-reload
CMD ["npm", "start", "--", "--host", "0.0.0.0", "--poll", "2000"]

# Etapa 3: Producción con Nginx
FROM nginx:alpine AS production

# Usar usuario nginx (ya no root)
USER nginx

# Copiar archivos construidos desde la etapa de build
COPY --from=build /app/dist/proyecto-final /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto 80
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
