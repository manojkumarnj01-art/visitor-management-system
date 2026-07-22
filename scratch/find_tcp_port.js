const { exec } = require('child_process');

const keys = [
    'HKLM\\SOFTWARE\\Microsoft\\Microsoft SQL Server\\MSSQL16.SQLEXPRESS\\MSSQLServer\\SuperSocketNetLib\\Tcp\\IPAll',
    'HKLM\\SOFTWARE\\Microsoft\\Microsoft SQL Server\\MSSQL15.SQLEXPRESS\\MSSQLServer\\SuperSocketNetLib\\Tcp\\IPAll',
    'HKLM\\SOFTWARE\\Microsoft\\Microsoft SQL Server\\MSSQL14.SQLEXPRESS\\MSSQLServer\\SuperSocketNetLib\\Tcp\\IPAll'
];

function checkRegistry(index) {
    if (index >= keys.length) {
        console.log('Done checking registry.');
        return;
    }
    const key = keys[index];
    console.log(`Querying Registry: ${key}`);
    exec(`reg query "${key}"`, (err, stdout, stderr) => {
        if (err) {
            console.log(`Failed to query key or it doesn't exist.\n`);
        } else {
            console.log('--- Registry Output ---');
            console.log(stdout);
        }
        checkRegistry(index + 1);
    });
}

checkRegistry(0);
