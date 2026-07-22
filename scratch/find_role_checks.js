const fs = require('fs');
const app = fs.readFileSync('app.js', 'utf8');

const lines = app.split('\n');
lines.forEach((line, idx) => {
    if (line.includes('isSecurity') || line.includes('securityViews') || line.includes('isViewAuthorized') || line.includes('role ===') || line.includes('role.')) {
        console.log(`L${idx+1}: ${line.trim()}`);
    }
});
