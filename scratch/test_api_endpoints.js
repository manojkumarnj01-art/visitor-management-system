const http = require('http');
const app = require('../server');

const server = app.listen(5001, async () => {
    console.log('[TEST] Express server listening on test port 5001');

    const testEndpoints = [
        '/api/health',
        '/api/visitors',
        '/api/employees',
        '/api/work-permits',
        '/api/dashboard/stats',
        '/api/reports/visitors',
        '/api/reports/departments',
        '/api/blacklist',
        '/api/notifications',
        '/api/purchase-manuals',
        '/api/audit-logs',
        '/api/branches',
        '/api/departments',
        '/api/students'
    ];

    let passed = 0;
    for (const ep of testEndpoints) {
        await new Promise(resolve => {
            http.get(`http://localhost:5001${ep}`, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    console.log(`[TEST] GET ${ep} -> Status ${res.statusCode}`);
                    passed++;
                    resolve();
                });
            }).on('error', err => {
                console.error(`[TEST] GET ${ep} -> Error:`, err.message);
                resolve();
            });
        });
    }

    console.log(`[TEST COMPLETE] Tested ${passed}/${testEndpoints.length} endpoints.`);
    server.close(() => process.exit(0));
});
