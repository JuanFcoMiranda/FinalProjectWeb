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
