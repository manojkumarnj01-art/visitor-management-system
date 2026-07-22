const http = require('http');

console.log('Probing Vite Dev Server on http://localhost:5173...');
const req = http.get('http://localhost:5173', (res) => {
    console.log(`Vite Dev Server is active! Response status: ${res.statusCode}`);
    process.exit(0);
});

req.on('error', (err) => {
    console.error('Vite Dev Server is not responding on port 5173:', err.message);
    console.log('Let us check port 3000...');
    const req2 = http.get('http://localhost:3000', (res2) => {
        console.log(`Vite Dev Server is active on port 3000! Status: ${res2.statusCode}`);
        process.exit(0);
    });
    req2.on('error', (err2) => {
        console.error('Vite Dev Server is not responding on port 3000:', err2.message);
        process.exit(1);
    });
});
