const fs = require('fs');
const path = require('path');

const srcDir = __dirname;
const distDir = path.join(__dirname, 'dist');

if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

let html = fs.readFileSync(path.join(srcDir, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(srcDir, 'style.css'), 'utf8');
const js = fs.readFileSync(path.join(srcDir, 'script.js'), 'utf8');

// Inline CSS
html = html.replace('<link rel="stylesheet" href="style.css">', `<style>${css}</style>`);

// Inline JS
html = html.replace('<script src="script.js"></script>', `<script>${js}</script>`);

fs.writeFileSync(path.join(distDir, 'index.html'), html);
console.log('Build complete! Single file created at dist/index.html');
