const { getPool, sql } = require('../config/db');

// GET /api/employees
async function getAllEmployees(req, res) {
    try {
        const pool = await getPool();
        const result = await pool.request().query('SELECT * FROM employees ORDER BY name ASC');
        return res.json({ success: true, data: result.recordset });
    } catch (err) {
        console.error('[employeeController] getAllEmployees error:', err);
        return res.status(500).json({ success: false, message: err.message, data: null });
    }
}

// GET /api/employees/:id or /code/:code
async function getEmployeeByCode(req, res) {
    try {
        const pool = await getPool();
        const id = req.params.code || req.params.id;
        const result = await pool.request()
            .input('code', sql.NVarChar(100), id)
            .query('SELECT * FROM employees WHERE employee_code = @code OR CAST(id AS NVARCHAR(100)) = @code');

        if (result.recordset.length === 0) {
            return res.status(404).json({ success: false, message: 'Employee not found', data: null });
        }
        return res.json({ success: true, data: result.recordset[0] });
    } catch (err) {
        console.error('[employeeController] getEmployeeByCode error:', err);
        return res.status(500).json({ success: false, message: err.message, data: null });
    }
}

// POST /api/employees
async function createOrUpdateEmployee(req, res) {
    try {
        const pool = await getPool();
        const emp = req.body;
        const empCode = emp.employee_code || emp.id || `EMP-${Date.now()}`;

        const check = await pool.request()
            .input('code', sql.NVarChar(50), empCode)
            .query('SELECT employee_code FROM employees WHERE employee_code = @code');

        const request = pool.request()
            .input('employee_code', sql.NVarChar(50), empCode)
            .input('name', sql.NVarChar(255), emp.name || '')
            .input('dept', sql.NVarChar(100), emp.dept || null)
            .input('designation', sql.NVarChar(100), emp.designation || null)
            .input('email', sql.NVarChar(255), emp.email || '')
            .input('phone', sql.NVarChar(50), emp.phone || null)
            .input('cabin', sql.NVarChar(100), emp.cabin || null)
            .input('status', sql.NVarChar(50), emp.status || 'In Office')
            .input('campus_status', sql.NVarChar(50), emp.campus_status || emp.campusStatus || 'Outside')
            .input('photo', sql.NVarChar(sql.MAX), emp.photo || null);

        if (check.recordset.length > 0) {
            await request.query(`
                UPDATE employees SET
                    name = @name, dept = @dept, designation = @designation,
                    email = @email, phone = @phone, cabin = @cabin, status = @status,
                    campus_status = @campus_status, photo = COALESCE(@photo, photo),
                    updated_at = GETDATE()
                WHERE employee_code = @employee_code
            `);
        } else {
            await request.query(`
                INSERT INTO employees (
                    employee_code, name, dept, designation, email, phone, cabin, status, campus_status, photo
                ) VALUES (
                    @employee_code, @name, @dept, @designation, @email, @phone, @cabin, @status, @campus_status, @photo
                )
            `);
        }

        const updated = await pool.request()
            .input('code', sql.NVarChar(50), empCode)
            .query('SELECT * FROM employees WHERE employee_code = @code');

        return res.status(200).json({ success: true, data: updated.recordset[0] });
    } catch (err) {
        console.error('[employeeController] createOrUpdateEmployee error:', err);
        return res.status(500).json({ success: false, message: err.message, data: null });
    }
}

// PUT /api/employees/:id
async function updateEmployee(req, res) {
    return createOrUpdateEmployee(req, res);
}

// DELETE /api/employees/:id
async function deleteEmployee(req, res) {
    try {
        const pool = await getPool();
        const id = req.params.code || req.params.id;
        await pool.request()
            .input('code', sql.NVarChar(100), id)
            .query('DELETE FROM employees WHERE employee_code = @code OR CAST(id AS NVARCHAR(100)) = @code');
        return res.json({ success: true, message: 'Employee deleted', data: null });
    } catch (err) {
        console.error('[employeeController] deleteEmployee error:', err);
        return res.status(500).json({ success: false, message: err.message, data: null });
    }
}

module.exports = {
    getAllEmployees,
    getEmployeeByCode,
    createOrUpdateEmployee,
    updateEmployee,
    deleteEmployee
};
