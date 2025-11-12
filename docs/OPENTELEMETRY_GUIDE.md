# OpenTelemetry en Aplicaciones Angular - Guía de Implementación

## ⚠️ Problema Resuelto

**Error Original:**
```
Could not resolve "http"
The package "http" wasn't found on the file system but is built into node.
```

**Causa:**
El código estaba intentando usar `@opentelemetry/exporter-prometheus` que depende de módulos nativos de Node.js (`http`, `net`, etc.) que no están disponibles en el navegador. El PrometheusExporter crea un servidor HTTP para exponer métricas, lo cual solo funciona en entornos Node.js.

## 🔧 Solución Aplicada

1. **Reemplazado** `PrometheusExporter` con `ConsoleMetricExporter` en `src/otel-metrics.ts`
   - ConsoleMetricExporter es compatible con navegadores
   - Exporta métricas a la consola del navegador para desarrollo
   
2. **Desinstalado** el paquete incompatible:
   ```bash
   npm uninstall @opentelemetry/exporter-prometheus
   ```

3. **Actualizado** el código para usar exporters compatibles con navegadores:
   ```typescript
   import { MeterProvider, PeriodicExportingMetricReader, ConsoleMetricExporter } from '@opentelemetry/sdk-metrics';
   ```

## 📊 Implementación Actual de Métricas

### Archivo: `src/otel-metrics.ts`

```typescript
import { MeterProvider, PeriodicExportingMetricReader, ConsoleMetricExporter } from '@opentelemetry/sdk-metrics';

// Console exporter for browser environments
const exporter = new ConsoleMetricExporter();

// Periodic reader to export metrics every 60 seconds
const metricReader = new PeriodicExportingMetricReader({
  exporter: exporter,
  exportIntervalMillis: 60000, // Export every 60 seconds
});

const meterProvider = new MeterProvider({
  readers: [metricReader]
});

const meter = meterProvider.getMeter('angular-app-meter');
const requestCounter = meter.createCounter('http_requests', {
  description: 'Count all HTTP requests',
});

export { requestCounter };
```

## 🎯 Opciones de Exporters para Navegadores

### 1. ConsoleMetricExporter (Actual - Para Desarrollo)
✅ **Ventajas:**
- Compatible con navegadores
- Perfecto para desarrollo y debugging
- Sin dependencias externas

❌ **Desventajas:**
- Solo para desarrollo, no para producción
- Las métricas se pierden al cerrar el navegador

### 2. OTLP HTTP Exporter (Recomendado para Producción)
Para enviar métricas a un backend de OpenTelemetry:

```typescript
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';

const exporter = new OTLPMetricExporter({
  url: 'https://your-collector:4318/v1/metrics',
  headers: {},
});
```

### 3. Custom Exporter
Puedes crear tu propio exporter que envíe métricas a tu API backend.

## 🚀 Para Implementar en Producción

1. Instala el exporter OTLP:
   ```bash
   npm install @opentelemetry/exporter-metrics-otlp-http
   ```

2. Configura un OpenTelemetry Collector o servicio compatible (Jaeger, Grafana Cloud, etc.)

3. Actualiza `otel-metrics.ts` para usar el OTLP exporter

4. Configura la URL del collector en las variables de entorno
    url: 'http://localhost:4318/v1/traces', // URL del OTLP collector
  });

  const provider = new WebTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: 'angular-frontend',
    }),
  });

  provider.addSpanProcessor(new BatchSpanProcessor(exporter));
  provider.register();

  // Instrumentar automáticamente fetch y XMLHttpRequest
  registerInstrumentations({
    instrumentations: [
      new FetchInstrumentation(),
      new XMLHttpRequestInstrumentation(),
    ],
  });
}
```

### 3. Inicializar en main.ts

```typescript
// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { initTelemetry } from './otel-web';

// Inicializar telemetría antes de bootstrap
if (environment.production) {
  initTelemetry();
}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
```

## 🏗️ Arquitectura Recomendada

Para una solución completa de monitorización:

```
┌─────────────────────┐
│  Angular Frontend   │
│  (Browser)          │
│  - Web SDK          │
│  - OTLP HTTP Export │
└──────────┬──────────┘
           │ HTTP
           ▼
┌─────────────────────┐
│  OTLP Collector     │
│  (Docker Container) │
└──────────┬──────────┘
           │
           ├──────────► Prometheus (métricas)
           │
           └──────────► Jaeger/Tempo (trazas)
```

### Docker Compose para el Collector

```yaml
version: '3.8'

services:
  otel-collector:
    image: otel/opentelemetry-collector:latest
    command: ["--config=/etc/otel-collector-config.yaml"]
    volumes:
      - ./otel-collector-config.yaml:/etc/otel-collector-config.yaml
    ports:
      - "4318:4318"  # OTLP HTTP receiver
      - "8889:8889"  # Prometheus metrics exporter

  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
```

## 📝 Notas Importantes

1. **Frontend vs Backend:**
   - Frontend (Angular): usa `@opentelemetry/sdk-trace-web` y exporta a OTLP
   - Backend (Node.js API): usa `@opentelemetry/sdk-node` con PrometheusExporter

2. **PrometheusExporter NO funciona en el navegador** porque:
   - Necesita crear un servidor HTTP (Node.js)
   - Requiere módulos nativos como `http`, `net`
   - El navegador no puede exponer endpoints HTTP

3. **Alternativa Simple:**
   - Implementa OpenTelemetry solo en tu API backend (puerto 8080)
   - El frontend simplemente hace peticiones HTTP normales
   - El backend registra todas las métricas y trazas

## 🔗 Referencias

- [OpenTelemetry JavaScript](https://opentelemetry.io/docs/instrumentation/js/)
- [Web SDK Documentation](https://opentelemetry.io/docs/instrumentation/js/getting-started/browser/)
- [OTLP Exporter](https://www.npmjs.com/package/@opentelemetry/exporter-trace-otlp-http)

