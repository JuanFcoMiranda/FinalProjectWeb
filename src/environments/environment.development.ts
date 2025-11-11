export const environment = {
  production: false,
  apiUrl: (typeof globalThis !== 'undefined' && (globalThis as any).__env?.apiUrl) || (typeof globalThis !== 'undefined' && (globalThis as any)['API_URL']) || 'http://finalproject:8080/api'
};
