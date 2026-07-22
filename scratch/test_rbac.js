const http = require('http');
const app = require('../server');

const server = app.listen(5002, async () => {
    console.log('[RBAC TEST] Express server listening on test port 5002');

    function makeRequest(path, role) {
        return new Promise(resolve => {
            const req = http.request({
                hostname: 'localhost',
                port: 5002,
                path: path,
                method: 'GET',
                headers: {
                    'X-User-Role': role
                }
            }, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    resolve({ status: res.statusCode, body: data });
                });
            });
            req.on('error', err => resolve({ status: 500, error: err.message }));
            req.end();
        });
    }

    console.log('\n--- ADMIN ROLE TESTS ---');
    const adminDash = await makeRequest('/api/dashboard/stats', 'Administrator');
    console.log(`[Admin] GET /api/dashboard/stats -> Status ${adminDash.status}`);
    const adminEmp = await makeRequest('/api/employees', 'Administrator');
    console.log(`[Admin] GET /api/employees -> Status ${adminEmp.status}`);

    console.log('\n--- SECURITY ROLE TESTS ---');
    const secDash = await makeRequest('/api/dashboard/stats', 'Security Gatekeeper');
    console.log(`[Security] GET /api/dashboard/stats -> Status ${secDash.status} (Expected: 200 or 500 DB err, not 403)`);
    const secRep = await makeRequest('/api/reports/visitors', 'Security Gatekeeper');
    console.log(`[Security] GET /api/reports/visitors -> Status ${secRep.status} (Expected: 200 or 500 DB err, not 403)`);

    const secEmp = await makeRequest('/api/employees', 'Security Gatekeeper');
    console.log(`[Security BLOCKED] GET /api/employees -> Status ${secEmp.status} (Expected: 403 FORBIDDEN)`);
    const secWp = await makeRequest('/api/work-permits', 'Security Gatekeeper');
    console.log(`[Security BLOCKED] GET /api/work-permits -> Status ${secWp.status} (Expected: 403 FORBIDDEN)`);
    const secUsers = await makeRequest('/api/security-users', 'Security Gatekeeper');
    console.log(`[Security BLOCKED] GET /api/security-users -> Status ${secUsers.status} (Expected: 403 FORBIDDEN)`);

    server.close(() => process.exit(0));
});
