const { getPool, sql } = require('../config/db');

// GET /api/departments
async function getDepartments(req, res) {
    try {
        const pool = await getPool();
        const result = await pool.request().query('SELECT * FROM departments ORDER BY name ASC');
        return res.json({ success: true, data: result.recordset });
    } catch (err) {
        console.error('[departmentController] getDepartments error:', err);
        return res.status(500).json({ success: false, message: err.message, data: null });
    }
}

// POST /api/departments
async function createOrUpdateDepartment(req, res) {
    try {
        const pool = await getPool();
        const d = req.body;
        const name = d.name;

        if (!name) return res.status(400).json({ success: false, message: 'Department name required' });

        const check = await pool.request()
            .input('name', sql.NVarChar(100), name)
            .query('SELECT name FROM departments WHERE name = @name');

        const request = pool.request()
            .input('name', sql.NVarChar(100), name)
            .input('location', sql.NVarChar(255), d.location || null);

        if (check.recordset.length > 0) {
            await request.query('UPDATE departments SET location = @location, updated_at = GETDATE() WHERE name = @name');
        } else {
            await request.query('INSERT INTO departments (name, location) VALUES (@name, @location)');
        }

        const updated = await pool.request()
            .input('name', sql.NVarChar(100), name)
            .query('SELECT * FROM departments WHERE name = @name');

        return res.status(200).json({ success: true, data: updated.recordset[0] });
    } catch (err) {
        console.error('[departmentController] createOrUpdateDepartment error:', err);
        return res.status(500).json({ success: false, message: err.message, data: null });
    }
}

module.exports = {
    getDepartments,
    createOrUpdateDepartment
};
