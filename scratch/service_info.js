const { exec } = require('child_process');

console.log('Querying SQL Server service configuration...');
exec('sc qc MSSQL$SQLEXPRESS', (err, stdout, stderr) => {
    if (err) {
        console.error('Error querying service:', err.message);
        console.error(stderr);
        return;
    }
    console.log('--- Service config info ---');
    console.log(stdout);

    // Parse path to binary
    const match = stdout.match(/BINARY_PATH_NAME\s+:\s+(.+)/i);
    if (match) {
        const binPath = match[1].trim();
        console.log('Executable binary path:', binPath);
    }
});
