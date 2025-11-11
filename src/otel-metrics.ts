import { MeterProvider } from '@opentelemetry/sdk-metrics';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';

const exporter = new PrometheusExporter({ port: 9464 }, () => {
  console.log('Prometheus scrape endpoint: http://localhost:9464/metrics');
});

const meterProvider = new MeterProvider({
  readers: [exporter]
});

const meter = meterProvider.getMeter('angular-app-meter');
const requestCounter = meter.createCounter('http_requests', {
  description: 'Count all HTTP requests',
});

export { requestCounter };
