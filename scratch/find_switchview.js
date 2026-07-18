const fs = require('fs');
const content = fs.readFileSync('app.js', 'utf8');
content.split('\n').forEach((line, idx) => {
    if (line.includes('function switchView')) {
        console.log((idx + 1) + ': ' + line.trim());
    }
});
