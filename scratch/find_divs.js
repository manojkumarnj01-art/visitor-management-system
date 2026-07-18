const fs = require('fs');
const content = fs.readFileSync('styles.css', 'utf8');
const lines = content.split('\n');

function printClass(name) {
    let inside = false;
    lines.forEach((line, idx) => {
        if (line.trim().startsWith(name)) {
            inside = true;
            console.log('--- ' + name + ' ---');
        }
        if (inside) {
            console.log((idx + 1) + ': ' + line);
            if (line.includes('}')) {
                inside = false;
            }
        }
    });
}

printClass('.top-summary-bar');
printClass('.summary-item');
