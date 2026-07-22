const { getPool, sql } = require('../config/db');

// GET /api/blacklist
async function getBlacklist(req, res) {
    try {
        const pool = await getPool();
        const result = await pool.request().query('SELECT * FROM blacklist ORDER BY created_at DESC');
        return res.json({ success: true, data: result.recordset });
    } catch (err) {
        console.error('[blacklistController] getBlacklist error:', err);
        return res.status(500).json({ success: false, message: err.message, data: null });
    }
}

// POST /api/blacklist
async function addToBlacklist(req, res) {
    try {
        const pool = await getPool();
        const bl = req.body;
        const phone = bl.phone || '';

        const check = await pool.request()
            .input('phone', sql.NVarChar(50), phone)
            .query('SELECT phone FROM blacklist WHERE phone = @phone');

        const request = pool.request()
            .input('name', sql.NVarChar(255), bl.name || '')
            .input('phone', sql.NVarChar(50), phone)
            .input('id_type', sql.NVarChar(50), bl.id_type || bl.idType || null)
            .input('id_number', sql.NVarChar(100), bl.id_number || bl.idNumber || null)
            .input('reason', sql.NVarChar(sql.MAX), bl.reason || null);

        if (check.recordset.length > 0) {
            await request.query(`
                UPDATE blacklist SET
                    name = @name, id_type = @id_type, id_number = @id_number, reason = @reason, updated_at = GETDATE()
                WHERE phone = @phone
            `);
        } else {
            await request.query(`
                INSERT INTO blacklist (name, phone, id_type, id_number, reason)
                VALUES (@name, @phone, @id_type, @id_number, @reason)
            `);
        }

        const updated = await pool.request()
            .input('phone', sql.NVarChar(50), phone)
            .query('SELECT * FROM blacklist WHERE phone = @phone');

        return res.status(201).json({ success: true, data: updated.recordset[0] });
    } catch (err) {
        console.error('[blacklistController] addToBlacklist error:', err);
        return res.status(500).json({ success: false, message: err.message, data: null });
    }
}

// DELETE /api/blacklist/:phone
async function removeFromBlacklist(req, res) {
    try {
        const pool = await getPool();
        const { phone } = req.params;
        await pool.request()
            .input('phone', sql.NVarChar(50), phone)
            .query('DELETE FROM blacklist WHERE phone = @phone OR CAST(id AS NVARCHAR(100)) = @phone');
        return res.json({ success: true, message: 'Removed from blacklist', data: null });
    } catch (err) {
        console.error('[blacklistController] removeFromBlacklist error:', err);
        return res.status(500).json({ success: false, message: err.message, data: null });
    }
}

module.exports = {
    getBlacklist,
    addToBlacklist,
    removeFromBlacklist
};
