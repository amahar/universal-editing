const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

const stylesDir = path.join(__dirname, '..', 'styles');
const distDir = path.join(__dirname, '..', 'dist', 'css');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

function buildCss() {
  // eslint-disable-next-line no-console
  console.log('Building CSS files...');
  // For now, just copy the files
  fs.readdirSync(stylesDir).forEach((file) => {
    if (file.endsWith('.css')) {
      const sourcePath = path.join(stylesDir, file);
      const destPath = path.join(distDir, file);
      fs.copyFileSync(sourcePath, destPath);
      // eslint-disable-next-line no-console
      console.log(`Copied ${file} to dist/css/`);
    }
  });
}

// Watch mode
if (process.argv.includes('watch')) {
  // eslint-disable-next-line no-console
  console.log('Watching for CSS changes...');
  chokidar.watch(stylesDir).on('change', (filePath) => {
    // eslint-disable-next-line no-console
    console.log(`File ${filePath} has been changed`);
    buildCss();
  });
} else {
  buildCss();
}
