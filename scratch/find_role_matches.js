const fs = require('fs');
const app = fs.readFileSync('app.js', 'utf8');

const matches = [];
const lines = app.split('\n');
lines.forEach((line, idx) => {
    if (line.includes('isAdmin') || line.includes('isSecurity') || line.includes('isGatekeeper') || line.includes('role ===') || line.includes('role.')) {
        matches.push(`L${idx+1}: ${line.trim()}`);
    }
});

console.log(`Found ${matches.length} role check occurrences in app.js`);
fs.writeFileSync('scratch/all_role_matches.txt', matches.join('\n'));
