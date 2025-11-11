# OpenTelemetry en Aplicaciones Angular - Guía de Implementación

## ⚠️ Problema Resuelto

**Error Original:**
```
The package "http" wasn't found on the file system but is built into node.
```

**Causa:**
El código estaba intentando usar `@opentelemetry/exporter-prometheus` que depende de módulos nativos de Node.js (`http`, `net`, etc.) que no están disponibles en el navegador.

## 🔧 Solución Aplicada

1. **Eliminado** el archivo `src/otel-metrics.ts` que contenía código incompatible con el navegador
2. **Desinstalados** los paquetes de OpenTelemetry específicos de Node.js:
   - `@opentelemetry/exporter-prometheus`
   - `@opentelemetry/sdk-metrics`
   - `@opentelemetry/api`
3. **Removida** la importación en `todo.service.ts`

## 📊 Implementación Correcta de OpenTelemetry para Frontend

Si necesitas monitorización en tu aplicación Angular, usa estos paquetes compatibles con navegadores:

### 1. Instalar Dependencias Correctas

```bash
npm install @opentelemetry/api \
  @opentelemetry/sdk-trace-web \
  @opentelemetry/instrumentation-fetch \
  @opentelemetry/instrumentation-xml-http-request \
  @opentelemetry/exporter-trace-otlp-http
```

### 2. Configurar OpenTelemetry para Web

```typescript
// src/otel-web.ts
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

export function initTelemetry() {
  // Crear un exporter que envía trazas a un OpenTelemetry Collector
  const exporter = new OTLPTraceExporter({
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

