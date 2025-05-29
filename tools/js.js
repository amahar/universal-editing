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
    console.log('Building JavaScript files...');
    // For now, just copy the files
    fs.readdirSync(scriptsDir).forEach(file => {
        if (file.endsWith('.js')) {
            const sourcePath = path.join(scriptsDir, file);
            const destPath = path.join(distDir, file);
            fs.copyFileSync(sourcePath, destPath);
            console.log(`Copied ${file} to dist/js/`);
        }
    });
}

// Watch mode
if (process.argv.includes('watch')) {
    console.log('Watching for JavaScript changes...');
    chokidar.watch(scriptsDir).on('change', (path) => {
        console.log(`File ${path} has been changed`);
        buildJs();
    });
} else {
    buildJs();
} 