const { getPool, sql } = require('../config/db');

// GET /api/reports/visitors
async function getVisitorReports(req, res) {
    try {
        const pool = await getPool();
        const { startDate, endDate, department, status, branch } = req.query;

        let query = 'SELECT * FROM visitors';
        const request = pool.request();
        const conditions = [];

        if (startDate) {
            conditions.push('visit_date >= @startDate');
            request.input('startDate', sql.Date, startDate);
        }
        if (endDate) {
            conditions.push('visit_date <= @endDate');
            request.input('endDate', sql.Date, endDate);
        }
        if (department) {
            conditions.push('host_dept = @department');
            request.input('department', sql.NVarChar(100), department);
        }
        if (status) {
            conditions.push('status = @status');
            request.input('status', sql.NVarChar(50), status);
        }
        if (branch) {
            conditions.push('branch = @branch');
            request.input('branch', sql.NVarChar(100), branch);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
        query += ' ORDER BY created_at DESC';

        const result = await request.query(query);
        return res.json({ success: true, data: result.recordset });
    } catch (err) {
        console.error('[reportsController] getVisitorReports error:', err);
        return res.status(500).json({ success: false, message: err.message, data: null });
    }
}

// GET /api/reports/departments
async function getDepartmentAnalytics(req, res) {
    try {
        const pool = await getPool();
        const result = await pool.request().query(`
            SELECT 
                host_dept AS department,
                COUNT(*) AS total_visitors,
                SUM(CASE WHEN status = 'Checked In' THEN 1 ELSE 0 END) AS checked_in,
                SUM(CASE WHEN status = 'Checked Out' THEN 1 ELSE 0 END) AS checked_out
            FROM visitors
            GROUP BY host_dept
        `);
        return res.json({ success: true, data: result.recordset });
    } catch (err) {
        console.error('[reportsController] getDepartmentAnalytics error:', err);
        return res.status(500).json({ success: false, message: err.message, data: null });
    }
}

module.exports = {
    getVisitorReports,
    getDepartmentAnalytics
};
