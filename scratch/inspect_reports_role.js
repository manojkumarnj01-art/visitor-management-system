const fs = require('fs');
const app = fs.readFileSync('app.js', 'utf8');
const lines = app.split('\n');

for (let i = 4100; i < 4220; i++) {
    console.log(`L${i+1}: ${lines[i]}`);
}
