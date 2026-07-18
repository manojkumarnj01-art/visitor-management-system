const fs = require('fs');
const content = fs.readFileSync('app.js', 'utf8');
content.split('\n').forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.includes('link.addEventListener("click"') || trimmed.includes('link.addEventListener(\'click\'')) {
        console.log((idx + 1) + ': ' + trimmed);
    }
});
