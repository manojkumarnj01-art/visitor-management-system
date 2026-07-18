const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');
let insideDashboard = false;
lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.includes('id="view-dashboard"')) {
        insideDashboard = true;
    }
    if (trimmed.includes('id="view-registration"')) {
        insideDashboard = false;
    }
    if (insideDashboard) {
        if (trimmed.includes('-wrapper"') && trimmed.startsWith('<div')) {
            console.log((idx + 1) + ': ' + trimmed);
        }
    }
});
