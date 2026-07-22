const fs = require('fs');
const app = fs.readFileSync('app.js', 'utf8');
const lines = app.split('\n');

console.log("=== Target 1 (lines 1505-1527) ===");
for (let i = 1504; i < 1527; i++) {
    console.log(`${i+1}: ${JSON.stringify(lines[i])}`);
}

console.log("\n=== Target 2 (lines 1530-1548) ===");
for (let i = 1531; i < 1548; i++) {
    console.log(`${i+1}: ${JSON.stringify(lines[i])}`);
}

console.log("\n=== Target 3 (lines 1755-1765) ===");
for (let i = 1756; i < 1765; i++) {
    console.log(`${i+1}: ${JSON.stringify(lines[i])}`);
}
