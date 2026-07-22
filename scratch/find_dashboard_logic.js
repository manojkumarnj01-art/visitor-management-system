const fs = require('fs');

const app = fs.readFileSync('app.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');

console.log("=== APP.JS SEARCH ===");
app.split('\n').forEach((line, idx) => {
    if (line.toLowerCase().includes('security gatekeeper') || line.toLowerCase().includes('applyrole') || line.toLowerCase().includes('updateuiforrole') || line.toLowerCase().includes('showdashboard') || line.toLowerCase().includes('currentuser') || line.toLowerCase().includes('reg-form-card')) {
        console.log(`L${idx+1}: ${line.trim()}`);
    }
});

console.log("\n=== INDEX.HTML SEARCH ===");
html.split('\n').forEach((line, idx) => {
    if (line.includes('id="view-dashboard"') || line.includes('dashboard-card') || line.includes('reg-form-card') || line.includes('registration-dashboard')) {
        console.log(`L${idx+1}: ${line.trim()}`);
    }
});
