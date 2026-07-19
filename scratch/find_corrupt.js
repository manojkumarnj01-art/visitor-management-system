const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        if (file === 'node_modules' || file === '.git' || file === 'dist' || file === 'venv' || file === '.vscode' || file === '.agents') return;
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
console.log(`Auditing ${files.length} files for encoding and corruption...`);

// Corruption indicators in UTF-8 representation of text:
// Common mojibake pattern: Ã followed by another byte (e.g. Ã©, Ã¡, etc.)
// Also replacement char \uFFFD ()
// Also raw high-ASCII control characters or double UTF-8 encodings.
const patterns = [
    { name: 'Double UTF-8 / Mojibake (Ã, Â, etc)', regex: /[\u00C2-\u00DF][\u0080-\u00BF]/ },
    { name: 'Replacement Character ()', regex: /\uFFFD/ },
    { name: 'Tamil Corruption (à®)', regex: /à®/ },
    { name: 'Triple UTF-8 encoding patterns', regex: /\u00C3[\u0080-\u00BF]/ }
];

files.forEach(file => {
    // Only inspect text files (html, css, js, ts, json, sql, txt, py, etc)
    const ext = path.extname(file).toLowerCase();
    if (!['.html', '.css', '.js', '.ts', '.json', '.sql', '.txt', '.py', '.md', '.xml'].includes(ext)) {
        return;
    }

    try {
        const buffer = fs.readFileSync(file);
        
        // 1. Check if it's valid UTF-8
        // A simple way to check is to decode and encode back, or see if it has invalid byte sequences
        const contentStr = buffer.toString('utf8');
        const reencoded = Buffer.from(contentStr, 'utf8');
        
        // Check for specific corruption patterns in decoded text
        patterns.forEach(p => {
            if (p.regex.test(contentStr)) {
                // Find line number
                const lines = contentStr.split('\n');
                lines.forEach((line, index) => {
                    if (p.regex.test(line)) {
                        console.log(`[CORRUPT] ${file}:${index + 1} - Found ${p.name}: "${line.trim().substring(0, 100)}"`);
                    }
                });
            }
        });

    } catch (e) {
        console.error(`Error reading ${file}:`, e);
    }
});

console.log('Audit complete.');
