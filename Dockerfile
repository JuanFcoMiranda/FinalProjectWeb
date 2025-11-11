FROM node:20-alpine

WORKDIR /app

# Instalar dependencias para desarrollo
COPY package*.json ./
RUN npm install

# Copiar código fuente
COPY . .

# Exponer puerto de desarrollo
EXPOSE 4200

# Variables de entorno para desarrollo
ENV API_URL=http://finalproject:8080/api
ENV CHOKIDAR_USEPOLLING=true

# Comando para desarrollo con hot-reload
CMD ["npm", "start", "--", "--host", "0.0.0.0", "--poll", "2000"]

