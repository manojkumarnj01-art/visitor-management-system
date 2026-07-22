const { getPool, sql } = require('../config/db');

// GET /api/students
async function getStudents(req, res) {
    try {
        const pool = await getPool();
        const result = await pool.request().query('SELECT * FROM students ORDER BY name ASC');
        return res.json({ success: true, data: result.recordset });
    } catch (err) {
        console.error('[studentController] getStudents error:', err);
        return res.status(500).json({ success: false, message: err.message, data: null });
    }
}

// POST /api/students
async function createOrUpdateStudent(req, res) {
    try {
        const pool = await getPool();
        const s = req.body;
        const studentId = s.student_id || s.id || `STU-${Date.now()}`;

        const check = await pool.request()
            .input('sid', sql.NVarChar(50), studentId)
            .query('SELECT student_id FROM students WHERE student_id = @sid');

        const request = pool.request()
            .input('student_id', sql.NVarChar(50), studentId)
            .input('name', sql.NVarChar(255), s.name || '')
            .input('phone', sql.NVarChar(50), s.phone || '')
            .input('email', sql.NVarChar(255), s.email || null)
            .input('college', sql.NVarChar(255), s.college || null)
            .input('department', sql.NVarChar(255), s.department || null)
            .input('roll_number', sql.NVarChar(100), s.roll_number || null)
            .input('photo', sql.NVarChar(sql.MAX), s.photo || null);

        if (check.recordset.length > 0) {
            await request.query(`
                UPDATE students SET
                    name = @name, phone = @phone, email = @email, college = @college,
                    department = @department, roll_number = @roll_number,
                    photo = COALESCE(@photo, photo), updated_at = GETDATE()
                WHERE student_id = @student_id
            `);
        } else {
            await request.query(`
                INSERT INTO students (student_id, name, phone, email, college, department, roll_number, photo)
                VALUES (@student_id, @name, @phone, @email, @college, @department, @roll_number, @photo)
            `);
        }

        const updated = await pool.request()
            .input('sid', sql.NVarChar(50), studentId)
            .query('SELECT * FROM students WHERE student_id = @sid');

        return res.status(200).json({ success: true, data: updated.recordset[0] });
    } catch (err) {
        console.error('[studentController] createOrUpdateStudent error:', err);
        return res.status(500).json({ success: false, message: err.message, data: null });
    }
}

module.exports = {
    getStudents,
    createOrUpdateStudent
};
