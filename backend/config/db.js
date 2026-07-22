const sql = require('mssql');
require('dotenv').config();

const config = {
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || 'YourPassword123!',
    server: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_DATABASE || 'VisitorManagement',
    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true
    },
    pool: {
        max: 20,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

let pool = null;

async function getPool() {
    if (!pool) {
        try {
            pool = await sql.connect(config);
            console.log(`[MSSQL] Connected to database '${config.database}' on server '${config.server}'.`);
        } catch (err) {
            console.error('[MSSQL] Database connection failed:', err.message);
            throw err;
        }
    }
    return pool;
}

module.exports = {
    sql,
    getPool
};
