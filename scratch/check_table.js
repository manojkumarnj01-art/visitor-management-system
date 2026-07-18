const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
console.log('Includes db-active-visitors-table:', content.includes('db-active-visitors-table'));
console.log('Includes db-search-visitors:', content.includes('db-search-visitors'));
