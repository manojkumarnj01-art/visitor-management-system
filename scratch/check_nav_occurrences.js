const fs = require('fs');
const appJs = fs.readFileSync('app.js', 'utf8');
const lines = appJs.split('\n');

lines.forEach((line, index) => {
    if (line.includes('nav-link') || line.includes('isViewAuthorized') || line.includes('securityViews')) {
        console.log(`L${index + 1}: ${line.trim()}`);
    }
});
