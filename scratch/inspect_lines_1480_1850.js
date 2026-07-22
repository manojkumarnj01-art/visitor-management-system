const fs = require('fs');
const app = fs.readFileSync('app.js', 'utf8');
const lines = app.split('\n');

for (let i = 1480; i < 1850; i++) {
    console.log(`L${i+1}: ${lines[i]}`);
}
