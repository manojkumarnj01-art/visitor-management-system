const fs = require('fs');
const css = fs.readFileSync('styles.css', 'utf8');
const lines = css.split('\n');

for (let i = 1975; i < 2080; i++) {
    console.log(`L${i+1}: ${lines[i]}`);
}
