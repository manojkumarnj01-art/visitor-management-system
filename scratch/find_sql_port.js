const fs = require('fs');

const logPath = 'C:\\Program Files\\Microsoft SQL Server\\MSSQL16.SQLEXPRESS\\MSSQL\\Log\\ERRORLOG';

console.log(`Reading SQL Server ERRORLOG from: ${logPath}`);
try {
    const content = fs.readFileSync(logPath, 'utf8');
    const lines = content.split('\n');
    console.log('--- Matching Lines in ERRORLOG ---');
    for (const line of lines) {
        if (line.includes('Server is listening on') || line.includes('listening on [') || line.includes('port')) {
            console.log(line.trim());
        }
    }
} catch (e) {
    console.error('Error reading log:', e.message);
}
