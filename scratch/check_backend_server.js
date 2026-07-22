const http = require('http');

console.log('Probing Express Backend Server on http://localhost:5000/api/health...');
const req = http.get('http://localhost:5000/api/health', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log(`Express Backend Server is active! Status: ${res.statusCode}`);
        console.log('Response body:', data);
        process.exit(0);
    });
});

req.on('error', (err) => {
    console.error('Express Backend Server is not responding on port 5000:', err.message);
    process.exit(1);
});
