// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

const fs = require('fs');
const path = require('path');

module.exports = function (config) {
  // ============================================
  // CONFIGURACIÓN DE RUTAS PERSONALIZADAS PARA CHROME
  // ============================================

  // Prioridad de configuración:
  // 1. Variable de entorno CHROME_BIN (si está configurada)
  // 2. Archivo chrome-config.json (si tiene chromePath configurado)
  // 3. Rutas predeterminadas del sistema

  // Intentar leer desde chrome-config.json
  try {
    const configFile = path.join(__dirname, 'chrome-config.json');
    if (fs.existsSync(configFile)) {
      const chromeConfig = JSON.parse(fs.readFileSync(configFile, 'utf8'));
      if (chromeConfig.chromePath && chromeConfig.chromePath.trim() !== '') {
        process.env.CHROME_BIN = chromeConfig.chromePath;
        console.log('✓ Usando Chrome desde chrome-config.json:', chromeConfig.chromePath);
      }
    }
  } catch (e) {
    // Si hay error leyendo el config, continuar con defaults
    console.warn('Advertencia: No se pudo leer chrome-config.json, usando configuración predeterminada');
  }

  // Alternativa: Configurar directamente aquí (descomenta una de estas líneas)
  // Ejemplos de rutas comunes en Windows:
  // process.env.CHROME_BIN = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  // process.env.CHROME_BIN = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
  // process.env.CHROME_BIN = require('puppeteer').executablePath(); // Si usas Puppeteer

  // Ejemplo en macOS:
  // process.env.CHROME_BIN = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

  // Ejemplo en Linux:
  // process.env.CHROME_BIN = '/usr/bin/google-chrome';
  // process.env.CHROME_BIN = '/usr/bin/chromium-browser';

  // Mostrar ruta de Chrome que se usará
  if (process.env.CHROME_BIN) {
    console.log('✓ CHROME_BIN configurado:', process.env.CHROME_BIN);
  }

  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('karma-json-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      jasmine: {
        // you can add configuration options for Jasmine here
        // the possible options are listed at https://jasmine.github.io/api/edge/Configuration.html
        // for example, you can disable the random execution with `random: false`
        // or set a specific seed with `seed: 4321`
      },
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    jasmineHtmlReporter: {
      suppressAll: true // removes the duplicated traces
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/proyectoFinal'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
        { type: 'lcov' }
      ]
    },
    jsonReporter: {
      stdout: false,
      outputFile: require('path').join(__dirname, './coverage/proyectoFinal/test-results.json')
    },
    reporters: ['progress', 'kjhtml', 'json'],
    browsers: ['ChromeHeadless'],
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--disable-extensions'
        ]
      },
      ChromeCustomPath: {
        base: 'ChromeHeadless',
        // La ruta se toma de process.env.CHROME_BIN
        flags: [
          '--no-sandbox',
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--disable-extensions'
        ]
      },
      ChromeDebug: {
        base: 'Chrome',
        flags: ['--remote-debugging-port=9333']
      }
    },
    // Aumentar timeouts para evitar fallos por lentitud
    captureTimeout: 210000,
    browserDisconnectTolerance: 3,
    browserDisconnectTimeout: 210000,
    browserNoActivityTimeout: 210000,
    // Logging mejorado
    logLevel: config.LOG_INFO,
    // Permitir reinicio en caso de error
    restartOnFileChange: true,
    singleRun: false,
    // Configuración adicional para mejor estabilidad
    concurrency: 1,
    browserConsoleLogOptions: {
      level: 'log',
      format: '%b %T: %m',
      terminal: true
    }
  });
};

