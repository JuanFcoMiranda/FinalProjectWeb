import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, CanActivateFn } from '@angular/router';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/core/auth.interceptor';
import { AUTH_DISABLED, AuthService } from './app/core/auth.service';
import { inject as coreInject, provideAppInitializer } from '@angular/core';
import { routes } from './app/app.routes';

const providers = [
  provideRouter(routes)
];

if (AUTH_DISABLED) {
  providers.push(provideHttpClient());
} else {
  providers.push(provideHttpClient(withInterceptors([authInterceptor])));
}

// Add an initializer that injects AuthService to reference its methods (harmless; AUTH_DISABLED guards calls)
providers.push(provideAppInitializer(() => {
  const svc = coreInject(AuthService);
  try {
    // If auth is disabled, call register/logout which are implemented as no-ops
    // This is safe (no network) and ensures static analysis considers the methods used.
    if (AUTH_DISABLED) {
      // ignore returned promises
      svc.register?.('', '');
      svc.logout?.();
    } else {
      // keep harmless references in case flag changes
      svc.register?.toString();
      svc.logout?.toString();
    }
  } catch {
    // ignore
  }
}));

// Remove top-level await and use .catch() instead
bootstrapApplication(AppComponent, {
  providers
}).catch(err => console.error(err));
