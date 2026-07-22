const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const lines = html.split('\n');
let inside = false;
lines.forEach((line, idx) => {
    if (line.includes('id="view-dashboard"')) inside = true;
    if (inside) {
        console.log(`L${idx+1}: ${line}`);
        if (line.includes('</section>')) inside = false;
    }
});
