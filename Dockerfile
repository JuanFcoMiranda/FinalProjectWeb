# Dockerfile único para desarrollo y producción
# Build arg para determinar el entorno (dev o prod)
ARG BUILD_ENV=prod

# Etapa 1: Build
FROM node:20-alpine AS build

# Crear usuario no privilegiado
RUN addgroup -g 1001 -S nodejs && adduser -S angular -u 1001

WORKDIR /app

# Cambiar propietario del directorio de trabajo
RUN chown -R angular:nodejs /app

# Copiar archivos de dependencias
COPY --chown=angular:nodejs package*.json ./

# Cambiar a usuario no privilegiado antes de instalar dependencias
USER angular

RUN npm ci --legacy-peer-deps --ignore-scripts

# Copiar solo los archivos necesarios para el build
# Evita copiar archivos sensibles o innecesarios (.dockerignore los excluye)
COPY --chown=angular:nodejs tsconfig*.json ./
COPY --chown=angular:nodejs angular.json ./
COPY --chown=angular:nodejs src ./src
COPY --chown=angular:nodejs public ./public

# Construir la aplicación para producción
ARG BUILD_ENV
RUN if [ "$BUILD_ENV" = "prod" ]; then npm run build; fi

# Etapa 2: Desarrollo
FROM node:20-alpine AS development

# Crear usuario no privilegiado
RUN addgroup -g 1001 -S nodejs && adduser -S angular -u 1001

WORKDIR /app

# Cambiar propietario del directorio de trabajo
RUN chown -R angular:nodejs /app

# Copiar package files
COPY --chown=angular:nodejs package*.json ./

# Cambiar a usuario no privilegiado
USER angular

RUN npm install --ignore-scripts

# Copiar solo los archivos necesarios para desarrollo
# Los archivos sensibles están excluidos por .dockerignore
COPY --chown=angular:nodejs tsconfig*.json ./
COPY --chown=angular:nodejs angular.json ./
COPY --chown=angular:nodejs karma.conf.js ./
COPY --chown=angular:nodejs src ./src
COPY --chown=angular:nodejs public ./public

# Variables de entorno para desarrollo
ENV API_URL=http://finalproject:8080/api
ENV CHOKIDAR_USEPOLLING=true

# Exponer puerto de desarrollo
EXPOSE 4200

# Comando para desarrollo con hot-reload
CMD ["npm", "start", "--", "--host", "0.0.0.0", "--poll", "2000"]

# Etapa 3: Producción con Nginx
FROM nginx:alpine AS production

USER nginx

# Copiar archivos construidos desde la etapa de build
COPY --from=build /app/dist/proyecto-final /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto 80
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]

