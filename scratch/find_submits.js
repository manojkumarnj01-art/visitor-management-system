const fs = require('fs');
const content = fs.readFileSync('app.js', 'utf8');
const lines = content.split('\n');

function printFunc(name) {
    let inside = false;
    let braces = 0;
    lines.forEach((line, idx) => {
        if (line.includes('function ' + name)) {
            inside = true;
            console.log('--- ' + name + ' ---');
        }
        if (inside) {
            console.log((idx + 1) + ': ' + line);
            if (line.includes('{')) braces += (line.match(/{/g) || []).length;
            if (line.includes('}')) braces -= (line.match(/}/g) || []).length;
            if (braces === 0 && line.includes('}')) {
                inside = false;
            }
        }
    });
}

printFunc('handleStudentRegistrationSubmit');
printFunc('handleCustomerRegistrationSubmit');
printFunc('handleVendorRegistrationSubmit');
