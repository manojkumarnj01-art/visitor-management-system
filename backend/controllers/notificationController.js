const { getPool, sql } = require('../config/db');

// GET /api/notifications
async function getNotifications(req, res) {
    try {
        const pool = await getPool();
        const result = await pool.request().query('SELECT TOP 50 * FROM notifications ORDER BY created_at DESC');
        return res.json({ success: true, data: result.recordset });
    } catch (err) {
        console.error('[notificationController] getNotifications error:', err);
        return res.status(500).json({ success: false, message: err.message, data: null });
    }
}

// POST /api/notifications
async function createNotification(req, res) {
    try {
        const pool = await getPool();
        const n = req.body;
        const code = n.notification_code || `NOTIF-${Date.now()}`;

        await pool.request()
            .input('code', sql.NVarChar(50), code)
            .input('title', sql.NVarChar(255), n.title || 'Notification')
            .input('message', sql.NVarChar(sql.MAX), n.message || '')
            .input('type', sql.NVarChar(50), n.type || 'info')
            .input('time', sql.NVarChar(50), n.time || new Date().toISOString())
            .query(`
                INSERT INTO notifications (notification_code, title, message, type, time)
                VALUES (@code, @title, @message, @type, @time)
            `);

        return res.status(201).json({ success: true, message: 'Notification created' });
    } catch (err) {
        console.error('[notificationController] createNotification error:', err);
        return res.status(500).json({ success: false, message: err.message, data: null });
    }
}

module.exports = {
    getNotifications,
    createNotification
};
