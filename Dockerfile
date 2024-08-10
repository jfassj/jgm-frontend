# Utiliza una imagen oficial de Node.js como base
FROM node:18

# Establece el directorio de trabajo
WORKDIR /app

# Copia el package.json y el package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos del proyecto
COPY . .

# Compila la aplicación para producción
RUN npm run build

# Expone el puerto en el que se ejecutará la aplicación
EXPOSE 3000

# Define el comando por defecto para iniciar la aplicación
CMD ["npm", "start"]
