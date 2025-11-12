# Fix: OpenTelemetry HTTP Module Error

**Fecha:** 12 de Noviembre, 2025

## 🐛 Error

```
Could not resolve "http"
node_modules/@opentelemetry/exporter-prometheus/build/src/PrometheusExporter.js:25:23:
  25 │ const http_1 = require("http");
     ╵                        ~~~~~~
The package "http" wasn't found on the file system but is built into node.
Are you trying to bundle for node? You can use "platform: 'node'" to do that, which will remove this error.
```

## 🔍 Causa Raíz

El error ocurría porque:

1. **PrometheusExporter no es compatible con navegadores**: `@opentelemetry/exporter-prometheus` está diseñado para entornos Node.js
2. **Módulos nativos de Node.js**: Intenta importar módulos como `http`, `net`, `fs` que no existen en navegadores
3. **Bundler de Angular**: esbuild (usado por Angular 17+) detecta esta incompatibilidad

## ✅ Solución

### Cambios Realizados

1. **Actualizado `src/otel-metrics.ts`**
   - ❌ Removed: `PrometheusExporter` from `@opentelemetry/exporter-prometheus`
   - ✅ Added: `ConsoleMetricExporter` from `@opentelemetry/sdk-metrics`
   - ✅ Added: `PeriodicExportingMetricReader` para exportar métricas periódicamente

2. **Desinstalado paquete incompatible**
   ```bash
   npm uninstall @opentelemetry/exporter-prometheus
   ```

### Código Antes

```typescript
import { MeterProvider } from '@opentelemetry/sdk-metrics';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';

const exporter = new PrometheusExporter({ port: 9464 }, () => {
  console.log('Prometheus scrape endpoint: http://localhost:9464/metrics');
});

const meterProvider = new MeterProvider({
  readers: [exporter]
});
```

### Código Después

```typescript
import { MeterProvider, PeriodicExportingMetricReader, ConsoleMetricExporter } from '@opentelemetry/sdk-metrics';

// Console exporter for browser environments
const exporter = new ConsoleMetricExporter();

// Periodic reader to export metrics every 60 seconds
const metricReader = new PeriodicExportingMetricReader({
  exporter: exporter,
  exportIntervalMillis: 60000,
});

const meterProvider = new MeterProvider({
  readers: [metricReader]
});
```

## 📦 Paquetes Actuales

### Instalados y en Uso
- ✅ `@opentelemetry/api` - API de OpenTelemetry
- ✅ `@opentelemetry/sdk-metrics` - SDK de métricas (compatible con navegadores)

### Removidos
- ❌ `@opentelemetry/exporter-prometheus` - Incompatible con navegadores

## 🎯 Resultado

- ✅ Build exitoso: `ng build` funciona sin errores
- ✅ Sin dependencias de Node.js en el código del navegador
- ✅ Métricas exportadas a la consola del navegador cada 60 segundos
- ✅ Compatible con todos los navegadores modernos

## 🚀 Próximos Pasos (Opcional)

Para producción, considera usar un exporter que envíe métricas a un backend:

```bash
npm install @opentelemetry/exporter-metrics-otlp-http
```

Y reemplazar `ConsoleMetricExporter` con `OTLPMetricExporter` configurado con tu endpoint de telemetría.

## 📚 Referencias

- [OpenTelemetry JavaScript SDK](https://opentelemetry.io/docs/instrumentation/js/)
- [Browser Support](https://opentelemetry.io/docs/instrumentation/js/getting-started/browser/)
- [Metrics API](https://opentelemetry.io/docs/instrumentation/js/instrumentation/#metrics)

