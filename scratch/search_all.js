const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        if (file === 'node_modules' || file === '.git' || file === 'dist') return;
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(fullPath));
        } else {
            results.push(fullPath);
        }
    });
    return results;
}

const files = walk('.');
files.forEach(file => {
    try {
        const content = fs.readFileSync(file, 'utf8');
        if (content.includes('db-active-visitors-table')) {
            console.log('Found in:', file);
        }
    } catch (e) {}
});
