const fs = require('fs');

const appJs = fs.readFileSync('app.js', 'utf8');
const lines = appJs.split('\n');

console.log(`Total lines in app.js: ${lines.length}`);

const matches = [];
lines.forEach((line, index) => {
    if (line.includes('supabase') || line.includes('supabaseClient') || line.includes('from(') || line.includes('fetch(')) {
        matches.push({ lineNum: index + 1, content: line.trim() });
    }
});

console.log(`Found ${matches.length} matching lines:`);
matches.forEach(m => {
    console.log(`L${m.lineNum}: ${m.content.substring(0, 120)}`);
});
