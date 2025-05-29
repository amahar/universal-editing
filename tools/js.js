const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

const scriptsDir = path.join(__dirname, '..', 'scripts');
const distDir = path.join(__dirname, '..', 'dist', 'js');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

function buildJs() {
  // eslint-disable-next-line no-console
  console.log('Building JavaScript files...');
  // For now, just copy the files
  fs.readdirSync(scriptsDir).forEach((file) => {
    if (file.endsWith('.js')) {
      const sourcePath = path.join(scriptsDir, file);
      const destPath = path.join(distDir, file);
      fs.copyFileSync(sourcePath, destPath);
      // eslint-disable-next-line no-console
      console.log(`Copied ${file} to dist/js/`);
    }
  });
}

// Watch mode
if (process.argv.includes('watch')) {
  // eslint-disable-next-line no-console
  console.log('Watching for JavaScript changes...');
  chokidar.watch(scriptsDir).on('change', (filePath) => {
    // eslint-disable-next-line no-console
    console.log(`File ${filePath} has been changed`);
    buildJs();
  });
} else {
  buildJs();
}
