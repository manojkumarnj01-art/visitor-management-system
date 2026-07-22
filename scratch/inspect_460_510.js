const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

for (let i = 460; i < 510; i++) {
    console.log(`L${i+1}: ${lines[i]}`);
}
