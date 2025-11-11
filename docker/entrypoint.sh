#!/bin/sh
exec nginx -g 'daemon off;'
# Ejecutar nginx en foreground

echo "✅ Configuración completa. Iniciando nginx..."

fi
  sed -i 's|<head>|<head><script src="/env-config.js"></script>|' /usr/share/nginx/html/index.html
  echo "📝 Inyectando env-config.js en index.html..."
if ! grep -q "env-config.js" /usr/share/nginx/html/index.html; then
# Inyectar el script en index.html si no existe

echo "✅ Variables de entorno configuradas"

EOF
})(this);
  window.API_URL = '${API_URL}'; // Fallback alternativo
  window.__env.appTitle = '${APP_TITLE}';
  window.__env.apiUrl = '${API_URL}';
  window.__env = window.__env || {};
(function(window) {
cat > /usr/share/nginx/html/env-config.js << EOF
# Esto permite que environment.ts las lea en runtime
# Inyectar variables en el index.html usando globalThis.__env

echo "   APP_TITLE: $APP_TITLE"
echo "   API_URL: $API_URL"
echo "📝 Configurando variables de entorno..."

APP_TITLE="${APP_TITLE:-Final Project}"
API_URL="${API_URL:-https://localhost:5001/api}"
# Obtener variables de entorno con valores por defecto

echo "🚀 Iniciando ProyectoFinal..."

set -e
