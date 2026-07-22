const fs = require('fs');
const appJs = fs.readFileSync('app.js', 'utf8');
const lines = appJs.split('\n');

lines.forEach((line, index) => {
    if (line.includes('currentUser') || line.includes('role') || line.includes('Security Gatekeeper') || line.includes('nav-') || line.includes('renderNav')) {
        if (line.includes('role') || line.includes('Security') || line.includes('currentUser') || line.includes('nav')) {
            console.log(`L${index + 1}: ${line.trim().substring(0, 120)}`);
        }
    }
});
