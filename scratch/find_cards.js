const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const lines = html.split('\n');
lines.forEach((line, idx) => {
    if (line.includes('class="registration-card"') || line.includes('class="dashboard-card"')) {
        console.log(`L${idx+1}: ${line.trim()}`);
    }
});
