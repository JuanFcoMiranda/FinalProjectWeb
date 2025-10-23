const { spawn } = require('child_process');
const path = require('path');

console.log('===============================================');
console.log('  Test Runner - Diagnóstico de Karma');
console.log('===============================================\n');

// Verificar Node.js
console.log(`✓ Node.js: ${process.version}`);
console.log(`✓ Platform: ${process.platform}`);
console.log(`✓ Working Directory: ${process.cwd()}\n`);

// Verificar Chrome
const chromePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  process.env.CHROME_BIN
].filter(Boolean);

const fs = require('fs');
let chromeFound = false;
let chromePath = null;

console.log('Buscando Chrome...');
for (const p of chromePaths) {
  if (fs.existsSync(p)) {
    console.log(`✓ Chrome encontrado: ${p}`);
    chromePath = p;
    chromeFound = true;
    break;
  } else {
    console.log(`  ✗ No encontrado: ${p}`);
  }
}

if (!chromeFound) {
  console.log('\n⚠️  ADVERTENCIA: Chrome no encontrado en rutas estándar.');
  console.log('   Configura CHROME_BIN o edita chrome-config.json\n');
}

// Verificar karma
console.log('\nVerificando Karma...');
const karmaPath = path.join(__dirname, 'node_modules', 'karma', 'bin', 'karma');
if (fs.existsSync(karmaPath)) {
  console.log(`✓ Karma instalado: ${karmaPath}`);
} else {
  console.log('✗ Karma no encontrado. Ejecuta: npm install');
  process.exit(1);
}

// Verificar karma.conf.js
const karmaConf = path.join(__dirname, 'karma.conf.js');
if (fs.existsSync(karmaConf)) {
  console.log(`✓ karma.conf.js encontrado`);
} else {
  console.log('✗ karma.conf.js no encontrado');
  process.exit(1);
}

console.log('\n===============================================');
console.log('  Ejecutando Tests con Karma');
console.log('===============================================\n');

// Ejecutar Karma
const isWindows = process.platform === 'win32';
const npm = isWindows ? 'npm.cmd' : 'npm';

const child = spawn(npm, ['test', '--', '--watch=false', '--browsers=ChromeHeadless'], {
  stdio: 'inherit',
  shell: true
});

child.on('error', (error) => {
  console.error('\n✗ Error ejecutando tests:', error.message);
  process.exit(1);
});

child.on('close', (code) => {
  console.log(`\n===============================================`);
  if (code === 0) {
    console.log('  ✓ Tests completados exitosamente');
  } else {
    console.log(`  ✗ Tests fallaron con código: ${code}`);
  }
  console.log('===============================================\n');
  process.exit(code);
});

