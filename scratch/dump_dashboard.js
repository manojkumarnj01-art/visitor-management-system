const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

let insideDashboard = false;
let dashLines = [];
lines.forEach((line, idx) => {
    if (line.includes('id="view-dashboard"')) {
        insideDashboard = true;
    }
    if (insideDashboard) {
        dashLines.push(`L${idx+1}: ${line}`);
        if (line.includes('</section>')) {
            insideDashboard = false;
        }
    }
});

console.log(`Found ${dashLines.length} lines for view-dashboard`);
fs.writeFileSync('scratch/view_dashboard_dump.txt', dashLines.join('\n'));
