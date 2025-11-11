# 🧪 Guía de Tests

Esta guía explica cómo ejecutar y escribir tests en el proyecto ProyectoFinal.

## 📋 Tabla de Contenidos

1. [Ejecutar Tests](#ejecutar-tests)
2. [Configuración de Chrome](#configuración-de-chrome)
3. [Escribir Tests](#escribir-tests)
4. [Cobertura de Código](#cobertura-de-código)
5. [Solución de Problemas](#solución-de-problemas)

## 🚀 Ejecutar Tests

### Tests en modo desarrollo (con watch)

```bash
npm test
```

Este comando ejecutará los tests y permanecerá observando cambios en los archivos.

### Tests una sola vez (headless)

```bash
npm run test:headless
```

Ejecuta todos los tests una vez en modo headless (sin interfaz gráfica) y genera un reporte de cobertura.

### Tests para CI/CD

```bash
npm run test:ci
```

Ejecuta los tests con la configuración optimizada para entornos de integración continua.

### Tests sin watch

```bash
npm run test:once
```

Ejecuta los tests una sola vez sin modo watch.

## 🌐 Configuración de Chrome

Si tienes Chrome instalado en una ruta no estándar, consulta la [Guía de Configuración de Chrome](../config/CHROME_SETUP_GUIDE.md).

## ✍️ Escribir Tests

### Estructura básica de un test

```typescript
import { TestBed } from '@angular/core/testing';
import { MiComponente } from './mi-componente.component';

describe('MiComponente', () => {
  let component: MiComponente;
  let fixture: ComponentFixture<MiComponente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiComponente]
    }).compileComponents();

    fixture = TestBed.createComponent(MiComponente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

### Tests de servicios

```typescript
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { MiServicio } from './mi-servicio.service';

describe('MiServicio', () => {
  let service: MiServicio;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MiServicio,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(MiServicio);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch data', () => {
    const mockData = { id: 1, name: 'Test' };
    
    service.getData().subscribe(data => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('api/data');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});
```

## 📊 Cobertura de Código

La cobertura de código se genera automáticamente al ejecutar:

```bash
npm run test:headless
```

Los reportes se encuentran en:
- HTML: `coverage/proyectoFinal/index.html`
- LCOV: `coverage/proyectoFinal/lcov.info`
- JSON Summary: `coverage/proyectoFinal/coverage-summary.json`

### Ver reporte de cobertura

Abre el archivo HTML en tu navegador:

```bash
# Windows
start coverage/proyectoFinal/index.html

# macOS
open coverage/proyectoFinal/index.html

# Linux
xdg-open coverage/proyectoFinal/index.html
```

## 🔧 Solución de Problemas

Para problemas comunes y sus soluciones, consulta la [Guía de Solución de Problemas](TEST_TROUBLESHOOTING.md).

## 📚 Recursos Adicionales

- [Jasmine Documentation](https://jasmine.github.io/)
- [Angular Testing Guide](https://angular.dev/guide/testing)
- [Karma Configuration](https://karma-runner.github.io/latest/config/configuration-file.html)

