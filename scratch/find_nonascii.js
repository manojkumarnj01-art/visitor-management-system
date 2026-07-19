const fs = require('fs');
const content = fs.readFileSync('app.js', 'utf8');

const nonAscii = [];
const lines = content.split('\n');
lines.forEach((line, index) => {
    // Check if line contains non-ASCII characters
    // (excluding common clean characters like Tamil, bullet points, em-dashes, smart quotes, etc. if they are intentionally used, but we want to see everything first)
    if (/[^\x00-\x7F]/.test(line)) {
        nonAscii.push({ lineNum: index + 1, content: line.trim() });
    }
});

console.log(`Found ${nonAscii.length} lines with non-ASCII characters in app.js:`);
// Display a sample of them
nonAscii.slice(0, 50).forEach(item => {
    console.log(`  Line ${item.lineNum}: "${item.content.substring(0, 100)}"`);
});
