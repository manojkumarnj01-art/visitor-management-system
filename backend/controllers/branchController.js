const { getPool, sql } = require('../config/db');

// GET /api/branches
async function getBranches(req, res) {
    try {
        const pool = await getPool();
        const result = await pool.request().query('SELECT * FROM branches ORDER BY name ASC');
        return res.json({ success: true, data: result.recordset });
    } catch (err) {
        console.error('[branchController] getBranches error:', err);
        return res.status(500).json({ success: false, message: err.message, data: null });
    }
}

// POST /api/branches
async function createOrUpdateBranch(req, res) {
    try {
        const pool = await getPool();
        const b = req.body;
        const name = b.name;

        if (!name) return res.status(400).json({ success: false, message: 'Branch name required' });

        const check = await pool.request()
            .input('name', sql.NVarChar(100), name)
            .query('SELECT name FROM branches WHERE name = @name');

        const request = pool.request()
            .input('name', sql.NVarChar(100), name)
            .input('location', sql.NVarChar(255), b.location || null);

        if (check.recordset.length > 0) {
            await request.query('UPDATE branches SET location = @location, updated_at = GETDATE() WHERE name = @name');
        } else {
            await request.query('INSERT INTO branches (name, location) VALUES (@name, @location)');
        }

        const updated = await pool.request()
            .input('name', sql.NVarChar(100), name)
            .query('SELECT * FROM branches WHERE name = @name');

        return res.status(200).json({ success: true, data: updated.recordset[0] });
    } catch (err) {
        console.error('[branchController] createOrUpdateBranch error:', err);
        return res.status(500).json({ success: false, message: err.message, data: null });
    }
}

module.exports = {
    getBranches,
    createOrUpdateBranch
};
