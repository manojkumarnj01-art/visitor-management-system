const fs = require('fs');
const css = fs.readFileSync('styles.css', 'utf8');

const lines = css.split('\n');
lines.forEach((line, idx) => {
    if (line.includes('dashboard') || line.includes('registration-card') || line.includes('top-summary-bar') || line.includes('summary-item')) {
        console.log(`L${idx+1}: ${line.trim()}`);
    }
});
