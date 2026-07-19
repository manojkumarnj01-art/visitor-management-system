const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'index.html');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

console.log('=== Finding div imbalance locations ===');

// Track div balance line by line
let divBalance = 0;
let minBalance = 0;
let minLine = 0;

// Track where balance goes negative (extra </div>)
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Count div opens (but not self-closing)
    const opens = (line.match(/<div[\s>]/g) || []).length;
    const closes = (line.match(/<\/div>/g) || []).length;
    divBalance += opens - closes;
    
    if (divBalance < minBalance) {
        minBalance = divBalance;
        minLine = i;
    }
    
    // Flag lines where balance goes significantly negative
    if (divBalance < -5 && closes > 0) {
        console.log(`  Line ${i+1}: balance=${divBalance} (${opens} opens, ${closes} closes) ${line.trim().substring(0, 80)}`);
    }
}

console.log(`\nFinal div balance: ${divBalance}`);
console.log(`Minimum balance reached: ${minBalance} at line ${minLine + 1}`);

// Now do the same for thead
console.log('\n=== Finding thead imbalance locations ===');
let theadBalance = 0;
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const opens = (line.match(/<thead>/g) || []).length;
    const closes = (line.match(/<\/thead>/g) || []).length;
    theadBalance += opens - closes;
    if (opens > 0 || closes > 0) {
        if (theadBalance < 0) {
            console.log(`  EXTRA </thead> at line ${i+1}: balance=${theadBalance}`);
        }
    }
}
console.log(`Final thead balance: ${theadBalance}`);

// Check the specific area around lines 495-540 (the repaired section)
console.log('\n=== Detailed balance around repaired area (lines 490-550) ===');
let localDiv = 0;
for (let i = 0; i < 490; i++) {
    const line = lines[i];
    localDiv += (line.match(/<div[\s>]/g) || []).length;
    localDiv -= (line.match(/<\/div>/g) || []).length;
}
console.log(`Div balance at line 490: ${localDiv}`);

for (let i = 490; i < 560; i++) {
    const line = lines[i] || '';
    const opens = (line.match(/<div[\s>]/g) || []).length;
    const closes = (line.match(/<\/div>/g) || []).length;
    if (opens || closes) {
        localDiv += opens - closes;
        console.log(`  Line ${i+1}: +${opens} -${closes} = ${localDiv} | ${line.trim().substring(0, 100)}`);
    }
}
