const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const regex = /id="([^"]+)"/g;
const ids = {};
let match;
while ((match = regex.exec(content)) !== null) {
  const id = match[1];
  ids[id] = (ids[id] || 0) + 1;
}
const dupes = Object.entries(ids).filter(([, count]) => count > 1);
if (dupes.length === 0) {
  console.log('No duplicate IDs found');
} else {
  console.log('Duplicate IDs:');
  dupes.forEach(([id, count]) => console.log(`  "${id}" appears ${count} times`));
}
