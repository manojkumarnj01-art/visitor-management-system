const fs = require('fs');
const app = fs.readFileSync('app.js', 'utf8');
const lines = app.split('\n');

[8020, 8455].forEach(start => {
    console.log(`\n=== Lines ${start} to ${start+20} ===`);
    for (let i = start; i < start + 20 && i < lines.length; i++) {
        console.log(`L${i+1}: ${lines[i]}`);
    }
});
