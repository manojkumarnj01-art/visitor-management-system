const { getPool, sql } = require('../config/db');

// GET /api/work-permits
async function getAllWorkPermits(req, res) {
    try {
        const pool = await getPool();
        const result = await pool.request().query('SELECT * FROM work_permits ORDER BY created_at DESC');
        return res.json({ success: true, data: result.recordset });
    } catch (err) {
        console.error('[workPermitController] getAllWorkPermits error:', err);
        return res.status(500).json({ success: false, message: err.message, data: null });
    }
}

// GET /api/work-permits/:id
async function getWorkPermitById(req, res) {
    try {
        const pool = await getPool();
        const { id } = req.params;
        const result = await pool.request()
            .input('id', sql.NVarChar(100), id)
            .query('SELECT * FROM work_permits WHERE permit_code = @id OR CAST(id AS NVARCHAR(100)) = @id');

        if (result.recordset.length === 0) {
            return res.status(404).json({ success: false, message: 'Work permit not found', data: null });
        }
        return res.json({ success: true, data: result.recordset[0] });
    } catch (err) {
        console.error('[workPermitController] getWorkPermitById error:', err);
        return res.status(500).json({ success: false, message: err.message, data: null });
    }
}

// POST /api/work-permits
async function createOrUpdateWorkPermit(req, res) {
    try {
        const pool = await getPool();
        const wp = req.body;
        const permitCode = wp.permit_code || wp.id || `WP-${Date.now()}`;

        const check = await pool.request()
            .input('code', sql.NVarChar(50), permitCode)
            .query('SELECT permit_code FROM work_permits WHERE permit_code = @code');

        const request = pool.request()
            .input('permit_code', sql.NVarChar(50), permitCode)
            .input('purchase_manual_id', sql.NVarChar(50), wp.purchase_manual_id || null)
            .input('company_entity', sql.NVarChar(255), wp.company_entity || null)
            .input('location_site', sql.NVarChar(255), wp.location_site || null)
            .input('rep_name', sql.NVarChar(255), wp.rep_name || null)
            .input('work_activity', sql.NVarChar(sql.MAX), wp.work_activity || null)
            .input('high_risk_work', sql.NVarChar(100), wp.high_risk_work || null)
            .input('description', sql.NVarChar(sql.MAX), wp.description || null)
            .input('status', sql.NVarChar(50), wp.status || 'Submitted')
            .input('safety_officer_approved', sql.Bit, wp.safety_officer_approved ? 1 : 0)
            .input('final_authorized', sql.Bit, wp.final_authorized ? 1 : 0);

        if (check.recordset.length > 0) {
            await request.query(`
                UPDATE work_permits SET
                    company_entity = @company_entity, location_site = @location_site,
                    rep_name = @rep_name, work_activity = @work_activity,
                    high_risk_work = @high_risk_work, description = @description,
                    status = @status, safety_officer_approved = @safety_officer_approved,
                    final_authorized = @final_authorized, updated_at = GETDATE()
                WHERE permit_code = @permit_code
            `);
        } else {
            await request.query(`
                INSERT INTO work_permits (
                    permit_code, purchase_manual_id, company_entity, location_site,
                    rep_name, work_activity, high_risk_work, description, status,
                    safety_officer_approved, final_authorized
                ) VALUES (
                    @permit_code, @purchase_manual_id, @company_entity, @location_site,
                    @rep_name, @work_activity, @high_risk_work, @description, @status,
                    @safety_officer_approved, @final_authorized
                )
            `);
        }

        const updated = await pool.request()
            .input('code', sql.NVarChar(50), permitCode)
            .query('SELECT * FROM work_permits WHERE permit_code = @code');

        return res.status(200).json({ success: true, data: updated.recordset[0] });
    } catch (err) {
        console.error('[workPermitController] createOrUpdateWorkPermit error:', err);
        return res.status(500).json({ success: false, message: err.message, data: null });
    }
}

// PUT /api/work-permits/:id
async function updateWorkPermit(req, res) {
    try {
        const pool = await getPool();
        const { id } = req.params;
        const wp = req.body;

        const request = pool.request().input('id', sql.NVarChar(100), id);
        const updates = [];

        if (wp.status !== undefined) {
            updates.push('status = @status');
            request.input('status', sql.NVarChar(50), wp.status);
        }
        if (wp.safety_officer_approved !== undefined) {
            updates.push('safety_officer_approved = @safety_officer_approved');
            request.input('safety_officer_approved', sql.Bit, wp.safety_officer_approved ? 1 : 0);
        }
        if (wp.final_authorized !== undefined) {
            updates.push('final_authorized = @final_authorized');
            request.input('final_authorized', sql.Bit, wp.final_authorized ? 1 : 0);
        }

        updates.push('updated_at = GETDATE()');

        await request.query(`
            UPDATE work_permits SET ${updates.join(', ')}
            WHERE permit_code = @id OR CAST(id AS NVARCHAR(100)) = @id
        `);

        const result = await pool.request()
            .input('id', sql.NVarChar(100), id)
            .query('SELECT * FROM work_permits WHERE permit_code = @id OR CAST(id AS NVARCHAR(100)) = @id');

        return res.json({ success: true, data: result.recordset[0] || null });
    } catch (err) {
        console.error('[workPermitController] updateWorkPermit error:', err);
        return res.status(500).json({ success: false, message: err.message, data: null });
    }
}

// DELETE /api/work-permits/:id
async function deleteWorkPermit(req, res) {
    try {
        const pool = await getPool();
        const { id } = req.params;
        await pool.request()
            .input('id', sql.NVarChar(100), id)
            .query('DELETE FROM work_permits WHERE permit_code = @id OR CAST(id AS NVARCHAR(100)) = @id');
        return res.json({ success: true, message: 'Work permit deleted', data: null });
    } catch (err) {
        console.error('[workPermitController] deleteWorkPermit error:', err);
        return res.status(500).json({ success: false, message: err.message, data: null });
    }
}

module.exports = {
    getAllWorkPermits,
    getWorkPermitById,
    createOrUpdateWorkPermit,
    updateWorkPermit,
    deleteWorkPermit
};
