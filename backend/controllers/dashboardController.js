const { getPool } = require('../config/db');

// GET /api/dashboard/stats
async function getDashboardStats(req, res) {
    try {
        const pool = await getPool();

        const todayVisResult = await pool.request().query(`
            SELECT COUNT(*) AS count FROM visitors WHERE visit_date = CAST(GETDATE() AS DATE)
        `);

        const checkedInResult = await pool.request().query(`
            SELECT COUNT(*) AS count FROM visitors WHERE status = 'Checked In'
        `);

        const checkedOutResult = await pool.request().query(`
            SELECT COUNT(*) AS count FROM visitors WHERE status = 'Checked Out'
        `);

        const pendingResult = await pool.request().query(`
            SELECT COUNT(*) AS count FROM visitors WHERE status = 'Pending'
        `);

        const empResult = await pool.request().query(`
            SELECT COUNT(*) AS count FROM employees
        `);

        const deptDistResult = await pool.request().query(`
            SELECT host_dept AS dept, COUNT(*) AS count FROM visitors GROUP BY host_dept
        `);

        return res.json({
            success: true,
            data: {
                totalVisitorsToday: todayVisResult.recordset[0].count,
                currentlyCheckedIn: checkedInResult.recordset[0].count,
                totalCheckedOut: checkedOutResult.recordset[0].count,
                pendingApprovals: pendingResult.recordset[0].count,
                totalEmployees: empResult.recordset[0].count,
                departmentDistribution: deptDistResult.recordset
            }
        });
    } catch (err) {
        console.error('[dashboardController] getDashboardStats error:', err);
        return res.status(500).json({ success: false, message: err.message, data: null });
    }
}

module.exports = {
    getDashboardStats
};
