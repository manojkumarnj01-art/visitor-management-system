const sql = require('mssql');

const configs = [
    {
        name: 'localhost (Default Port 1433)',
        user: 'sa',
        password: 'YourStrongPass123!',
        server: 'localhost',
        database: 'VisitorManagement',
        options: {
            encrypt: true,
            trustServerCertificate: true,
            enableArithAbort: true
        }
    },
    {
        name: 'localhost\\SQLEXPRESS (Named Instance)',
        user: 'sa',
        password: 'YourStrongPass123!',
        server: 'localhost\\SQLEXPRESS',
        database: 'VisitorManagement',
        options: {
            encrypt: true,
            trustServerCertificate: true,
            enableArithAbort: true
        }
    },
    {
        name: 'localhost (Default Port 1433, no encrypt)',
        user: 'sa',
        password: 'YourStrongPass123!',
        server: 'localhost',
        database: 'VisitorManagement',
        options: {
            encrypt: false,
            trustServerCertificate: true,
            enableArithAbort: true
        }
    },
    {
        name: 'localhost\\SQLEXPRESS (Named Instance, no encrypt)',
        user: 'sa',
        password: 'YourStrongPass123!',
        server: 'localhost\\SQLEXPRESS',
        database: 'VisitorManagement',
        options: {
            encrypt: false,
            trustServerCertificate: true,
            enableArithAbort: true
        }
    }
];

async function runTests() {
    for (const config of configs) {
        console.log(`--- Testing connection with: ${config.name} ---`);
        try {
            const pool = await sql.connect(config);
            console.log('CONNECTED SUCCESSFULLY!');
            const result = await pool.request().query('SELECT COUNT(*) as count FROM security_users');
            console.log('security_users count:', result.recordset[0].count);
            await sql.close();
            console.log('SUCCESS\n');
            return;
        } catch (err) {
            console.error('FAILED:', err.message);
        }
        console.log('');
    }
}

runTests();
