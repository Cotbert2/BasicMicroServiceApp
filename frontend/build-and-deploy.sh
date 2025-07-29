#!/bin/bash

# Script para construir el proyecto Angular y crear la imagen Docker

set -e  # Salir si algún comando falla

echo "🔨 Construyendo el proyecto Angular..."
cd smart-store

# Instalar dependencias si no existen
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

# Construir el proyecto para producción
echo "🏗️  Construyendo para producción..."
npm run build -- --configuration production

cd ..

echo "🐳 Construyendo imagen Docker..."
docker build -t smart-store-frontend .

echo "✅ ¡Imagen creada exitosamente!"
echo "Para ejecutar el contenedor, usa:"
echo "docker run -p 8080:80 smart-store-frontend"
