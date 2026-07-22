const sql = require('mssql');

const passwords = [
    'YourStrongPass123!',
    'YourPassword123!',
    'Password123!',
    'admin',
    'root',
    '123456',
    'SqlExpress2026!',
    'SqlExpress123!',
    'VmsAdmin123!',
    'Visitor123!'
];

async function testPasswords() {
    for (const pwd of passwords) {
        const config = {
            user: 'sa',
            password: pwd,
            server: 'localhost',
            database: 'VisitorManagement',
            options: {
                encrypt: false,
                trustServerCertificate: true
            }
        };
        try {
            console.log(`Trying password: ${pwd}`);
            const pool = await sql.connect(config);
            console.log(`>>> SUCCESS WITH PASSWORD: ${pwd} <<<`);
            const res = await pool.request().query("SELECT DB_NAME() as dbname");
            console.log("Connected to DB:", res.recordset[0].dbname);
            await sql.close();
            return;
        } catch (err) {
            console.log(`Failed for ${pwd}: ${err.message}`);
        }
    }
}

testPasswords();
