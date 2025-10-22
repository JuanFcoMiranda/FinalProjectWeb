export const environment = {
  production: false,
  // Read runtime API URL from a global (globalThis.__env?.apiUrl or globalThis['API_URL']) if provided,
  // otherwise fall back to the default used during development.
  apiUrl: (typeof globalThis !== 'undefined' && (globalThis as any).__env?.apiUrl) || (typeof globalThis !== 'undefined' && (globalThis as any)['API_URL']) || 'https://localhost:5001/api'
};
