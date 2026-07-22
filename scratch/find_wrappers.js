const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const lines = html.split('\n');
lines.forEach((line, idx) => {
    if (line.includes('wrapper') || line.includes('dashboard')) {
        if (line.includes('id=')) console.log(`L${idx+1}: ${line.trim()}`);
    }
});
