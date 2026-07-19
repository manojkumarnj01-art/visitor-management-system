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

async function testSelect() {
    const email = 'manojkumarnj01@gmail.com';
    const pass = '123';
    
    console.log(`Signing in as Administrator ${email}...`);
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass
    });

    if (error) {
        console.error('Sign in failed:', error.message);
        return;
    }

    console.log('Sign in success.');

    const { data: su, error: suErr } = await supabase.from('security_users').select('*');
    if (suErr) {
        console.error('Fetch security_users failed:', suErr);
    } else {
        console.log('All Security Users in DB:', su);
    }
}

testSelect();
