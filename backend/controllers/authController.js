const { getPool, sql } = require('../config/db');

// Helper to seed default security users if database table is empty
async function ensureDefaultSecurityUsers(pool) {
    try {
        const check = await pool.request().query('SELECT COUNT(*) AS count FROM security_users');
        if (check.recordset[0].count === 0) {
            console.log('[MSSQL] Seeding default security users into security_users table...');
            await pool.request().query(`
                INSERT INTO security_users (username, name, role, phone, shift)
                VALUES 
                    ('admin', 'System Administrator', 'Administrator', 'Ext. 9901', 'All shifts'),
                    ('security', 'Officer Higgins', 'Security Gatekeeper', 'Ext. 9011', 'Day Shift (08:00 - 16:00)'),
                    ('receptionist', 'Clara Sterling', 'Front Desk Operator', 'Ext. 9022', 'Day Shift (08:00 - 16:00)');
            `);
        }
    } catch (e) {
        console.warn('[MSSQL] ensureDefaultSecurityUsers notice:', e.message);
    }
}

// POST /api/auth/login
async function login(req, res) {
    try {
        const pool = await getPool();
        await ensureDefaultSecurityUsers(pool);

        let { username, email, password } = req.body;
        let inputUser = username || email || '';
        
        // Strip email domain if provided (e.g. admin@acme.corp -> admin)
        let cleanUsername = inputUser;
        if (cleanUsername.includes('@')) {
            cleanUsername = cleanUsername.split('@')[0];
        }

        const result = await pool.request()
            .input('username', sql.NVarChar(100), cleanUsername)
            .query('SELECT * FROM security_users WHERE username = @username');

        if (result.recordset.length === 0) {
            // Check fallback for default administrative roles
            if (cleanUsername === 'admin' || cleanUsername === 'security' || cleanUsername === 'receptionist') {
                const roleMap = {
                    admin: 'Administrator',
                    security: 'Security Gatekeeper',
                    receptionist: 'Front Desk Operator'
                };
                const userObj = {
                    id: `user-${cleanUsername}`,
                    username: cleanUsername,
                    name: cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1),
                    role: roleMap[cleanUsername] || 'Administrator',
                    phone: 'Internal',
                    shift: 'Continuous'
                };
                return res.json({
                    success: true,
                    data: {
                        user: userObj,
                        token: `jwt-token-${cleanUsername}-${Date.now()}`
                    }
                });
            }
            return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.', data: null });
        }

        const user = result.recordset[0];
        return res.json({
            success: true,
            data: {
                user: user,
                token: `jwt-token-${user.id || user.username}-${Date.now()}`
            }
        });
    } catch (err) {
        console.error('[authController] login error:', err);
        return res.status(500).json({ success: false, message: err.message, data: null });
    }
}

// GET /api/security-users
async function getSecurityUsers(req, res) {
    try {
        const pool = await getPool();
        await ensureDefaultSecurityUsers(pool);
        const result = await pool.request().query('SELECT * FROM security_users ORDER BY name ASC');
        return res.json({ success: true, data: result.recordset });
    } catch (err) {
        console.error('[authController] getSecurityUsers error:', err);
        return res.status(500).json({ success: false, message: err.message, data: null });
    }
}

// GET /api/security-users/:id
async function getSecurityUserById(req, res) {
    try {
        const pool = await getPool();
        const id = req.params.id || req.params.username;
        const result = await pool.request()
            .input('id', sql.NVarChar(100), id)
            .query('SELECT * FROM security_users WHERE username = @id OR CAST(id AS NVARCHAR(100)) = @id');

        if (result.recordset.length === 0) {
            return res.status(404).json({ success: false, message: 'Security user not found', data: null });
        }
        return res.json({ success: true, data: result.recordset[0] });
    } catch (err) {
        console.error('[authController] getSecurityUserById error:', err);
        return res.status(500).json({ success: false, message: err.message, data: null });
    }
}

// POST /api/security-users
async function createOrUpdateSecurityUser(req, res) {
    try {
        const pool = await getPool();
        const su = req.body;
        const username = su.username || `user_${Date.now()}`;

        const check = await pool.request()
            .input('uname', sql.NVarChar(100), username)
            .query('SELECT username FROM security_users WHERE username = @uname');

        const request = pool.request()
            .input('username', sql.NVarChar(100), username)
            .input('name', sql.NVarChar(255), su.name || '')
            .input('role', sql.NVarChar(100), su.role || 'Security Gatekeeper')
            .input('phone', sql.NVarChar(50), su.phone || null)
            .input('shift', sql.NVarChar(100), su.shift || null);

        if (check.recordset.length > 0) {
            await request.query(`
                UPDATE security_users SET
                    name = @name, role = @role, phone = @phone, shift = @shift, updated_at = GETDATE()
                WHERE username = @username
            `);
        } else {
            await request.query(`
                INSERT INTO security_users (username, name, role, phone, shift)
                VALUES (@username, @name, @role, @phone, @shift)
            `);
        }

        const updated = await pool.request()
            .input('uname', sql.NVarChar(100), username)
            .query('SELECT * FROM security_users WHERE username = @uname');

        return res.status(200).json({ success: true, data: updated.recordset[0] });
    } catch (err) {
        console.error('[authController] createOrUpdateSecurityUser error:', err);
        return res.status(500).json({ success: false, message: err.message, data: null });
    }
}

// DELETE /api/security-users/:username
async function deleteSecurityUser(req, res) {
    try {
        const pool = await getPool();
        const { username } = req.params;
        await pool.request()
            .input('uname', sql.NVarChar(100), username)
            .query('DELETE FROM security_users WHERE username = @uname OR CAST(id AS NVARCHAR(100)) = @uname');
        return res.json({ success: true, message: 'Security user deleted', data: null });
    } catch (err) {
        console.error('[authController] deleteSecurityUser error:', err);
        return res.status(500).json({ success: false, message: err.message, data: null });
    }
}

module.exports = {
    login,
    getSecurityUsers,
    getSecurityUserById,
    createOrUpdateSecurityUser,
    deleteSecurityUser
};
