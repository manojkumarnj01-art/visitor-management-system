const fs = require('fs');
const app = fs.readFileSync('app.js', 'utf8');

const lines = app.split('\n');
lines.forEach((line, idx) => {
    if (line.includes('isAdmin') || line.includes('isSecurity') || line.includes('isGatekeeper') || line.includes('security') || line.includes('admin') || line.includes('role')) {
        if (line.includes('if') || line.includes('?') || line.includes('hidden') || line.includes('display')) {
            console.log(`L${idx+1}: ${line.trim()}`);
        }
    }
});
