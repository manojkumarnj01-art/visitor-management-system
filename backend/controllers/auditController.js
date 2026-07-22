const { getPool, sql } = require('../config/db');

// GET /api/audit-logs
async function getAuditLogs(req, res) {
    try {
        const pool = await getPool();
        const result = await pool.request().query('SELECT TOP 100 * FROM audit_logs ORDER BY created_at DESC');
        return res.json({ success: true, data: result.recordset });
    } catch (err) {
        console.error('[auditController] getAuditLogs error:', err);
        return res.status(500).json({ success: false, message: err.message, data: null });
    }
}

// POST /api/audit-logs
async function createAuditLog(req, res) {
    try {
        const pool = await getPool();
        const log = req.body;

        await pool.request()
            .input('action', sql.NVarChar(100), log.action || 'System Action')
            .input('actor', sql.NVarChar(100), log.actor || 'System')
            .input('details', sql.NVarChar(sql.MAX), log.details || null)
            .query(`
                INSERT INTO audit_logs (action, actor, details)
                VALUES (@action, @actor, @details)
            `);

        return res.status(201).json({ success: true, message: 'Audit log created' });
    } catch (err) {
        console.error('[auditController] createAuditLog error:', err);
        return res.status(500).json({ success: false, message: err.message, data: null });
    }
}

module.exports = {
    getAuditLogs,
    createAuditLog
};
