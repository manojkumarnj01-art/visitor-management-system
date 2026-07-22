const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const lines = html.split('\n');
lines.forEach((line, idx) => {
    if (line.includes('nav-link') || line.includes('data-target')) {
        console.log(`L${idx+1}: ${line.trim()}`);
    }
});
