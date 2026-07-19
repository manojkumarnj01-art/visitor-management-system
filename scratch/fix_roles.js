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

async function fixRoles() {
    const adminEmail = 'manojkumarnj01@gmail.com';
    const adminPass = '123';
    
    console.log(`Signing in as Administrator ${adminEmail}...`);
    const { data, error } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password: adminPass
    });

    if (error) {
        console.error('Sign in failed:', error.message);
        return;
    }

    console.log('Sign in success. Running role updates...');

    // 1. Suren (Security)
    const surenId = 'a94618be-185f-48f0-b96e-5ff0c90b7ce0';
    console.log(`Upserting Suren profile (${surenId}) to 'Security Gatekeeper'...`);
    const { error: errSuren } = await supabase.from('security_users').upsert({
        id: surenId,
        username: 'suren',
        name: 'Suren',
        role: 'Security Gatekeeper',
        phone: '9876543219',
        shift: 'Continuous'
    });
    if (errSuren) console.error('Error updating Suren:', errSuren);
    else console.log('Suren profile updated successfully.');

    // 2. Yogesh (Receptionist)
    const yogeshId = 'e9ca9923-ca6c-477a-b0a2-f38c148bb954';
    console.log(`Upserting Yogesh profile (${yogeshId}) to 'Front Desk Operator'...`);
    const { error: errYogesh } = await supabase.from('security_users').upsert({
        id: yogeshId,
        username: 'Gandhi',
        name: 'yogesh',
        role: 'Front Desk Operator',
        phone: '8667452989',
        shift: 'Day Shift'
    });
    if (errYogesh) console.error('Error updating Yogesh:', errYogesh);
    else console.log('Yogesh profile updated successfully.');

    // Verify all profiles now
    const { data: users, error: selectErr } = await supabase.from('security_users').select('*');
    if (selectErr) console.error('Error fetching security_users:', selectErr);
    else console.log('All updated Security Users in DB:', users);
}

fixRoles();
