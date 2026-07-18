const fs = require('fs');
const content = fs.readFileSync('app.js', 'utf8');
content.split('\n').forEach((line, idx) => {
    if (line.includes('btn-select-visitor-flow')) {
        console.log((idx + 1) + ': ' + line.trim());
    }
});
