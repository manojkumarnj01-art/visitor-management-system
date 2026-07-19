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

async function testUpsert() {
    const email = 'suren.saravanan29@gmail.com';
    const pass = '123456';
    
    console.log(`Signing in as ${email}...`);
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass
    });

    if (error) {
        console.error('Sign in failed:', error.message);
        return;
    }

    console.log('Sign in success. User ID:', data.user.id);

    const dbProfile = {
        id: data.user.id,
        username: 'suren.saravanan29',
        name: 'Suren.saravanan29',
        role: 'Security Gatekeeper',
        phone: 'Supabase Session',
        shift: 'Continuous'
    };

    console.log('Attempting upsert to security_users...');
    const { data: upsertData, error: upsertErr } = await supabase
        .from('security_users')
        .upsert(dbProfile);

    if (upsertErr) {
        console.error('Upsert failed:', upsertErr);
    } else {
        console.log('Upsert succeeded!', upsertData);
    }
}

testUpsert();
