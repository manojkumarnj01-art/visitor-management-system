const fs = require('fs');
const content = fs.readFileSync('app.js', 'utf8');
const lines = content.split('\n');
let insideFunc = false;
lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.includes('function isViewAuthorized')) {
        insideFunc = true;
    }
    if (insideFunc) {
        console.log((idx + 1) + ': ' + line);
        if (trimmed.startsWith('}')) {
            insideFunc = false;
        }
    }
});
