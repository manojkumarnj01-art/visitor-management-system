const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = {};
try {
    const envFile = fs.readFileSync('.env', 'utf8');
    envFile.split('\n').forEach(line => {
        const parts = line.split('=');
        if (parts.length >= 2) {
            env[parts[0].trim()] = parts.slice(1).join('=').trim();
        }
    });
} catch (e) {
    console.error('Error reading .env', e);
}

const supabaseUrl = env['VITE_SUPABASE_URL'];
const supabaseAnonKey = env['VITE_SUPABASE_ANON_KEY'];

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspectTables() {
    const { data: su, error: suErr } = await supabase.from('security_users').select('*');
    console.log('--- security_users contents ---');
    console.log(suErr ? suErr.message : su);

    const { data: emp, error: empErr } = await supabase.from('employees').select('*');
    console.log('--- employees contents ---');
    console.log(empErr ? empErr.message : emp);
}

inspectTables();
