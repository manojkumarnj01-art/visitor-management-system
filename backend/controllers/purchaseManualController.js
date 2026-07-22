const { getPool, sql } = require('../config/db');

// GET /api/purchase-manuals
async function getPurchaseManuals(req, res) {
    try {
        const pool = await getPool();
        const result = await pool.request().query('SELECT * FROM purchase_manuals ORDER BY created_at DESC');
        return res.json({ success: true, data: result.recordset });
    } catch (err) {
        console.error('[purchaseManualController] getPurchaseManuals error:', err);
        return res.status(500).json({ success: false, message: err.message, data: null });
    }
}

// POST /api/purchase-manuals
async function createOrUpdatePurchaseManual(req, res) {
    try {
        const pool = await getPool();
        const pm = req.body;
        const manualCode = pm.manual_code || pm.id || `PM-${Date.now()}`;

        const check = await pool.request()
            .input('code', sql.NVarChar(50), manualCode)
            .query('SELECT manual_code FROM purchase_manuals WHERE manual_code = @code');

        const request = pool.request()
            .input('manual_code', sql.NVarChar(50), manualCode)
            .input('dept', sql.NVarChar(100), pm.dept || null)
            .input('agent_name', sql.NVarChar(255), pm.agent_name || '')
            .input('agent_auth_detail', sql.NVarChar(255), pm.agent_auth_detail || null)
            .input('company_name', sql.NVarChar(255), pm.company_name || '')
            .input('company_address', sql.NVarChar(sql.MAX), pm.company_address || null)
            .input('contact_number', sql.NVarChar(50), pm.contact_number || null)
            .input('contract_type', sql.NVarChar(100), pm.contract_type || null)
            .input('contract_no', sql.NVarChar(100), pm.contract_no || null)
            .input('nature_work', sql.NVarChar(sql.MAX), pm.nature_work || null)
            .input('num_workers', sql.Int, pm.num_workers || 1)
            .input('status', sql.NVarChar(50), pm.status || 'Submitted');

        if (check.recordset.length > 0) {
            await request.query(`
                UPDATE purchase_manuals SET
                    dept = @dept, agent_name = @agent_name, agent_auth_detail = @agent_auth_detail,
                    company_name = @company_name, company_address = @company_address,
                    contact_number = @contact_number, contract_type = @contract_type,
                    contract_no = @contract_no, nature_work = @nature_work,
                    num_workers = @num_workers, status = @status, updated_at = GETDATE()
                WHERE manual_code = @manual_code
            `);
        } else {
            await request.query(`
                INSERT INTO purchase_manuals (
                    manual_code, dept, agent_name, agent_auth_detail, company_name, company_address,
                    contact_number, contract_type, contract_no, nature_work, num_workers, status
                ) VALUES (
                    @manual_code, @dept, @agent_name, @agent_auth_detail, @company_name, @company_address,
                    @contact_number, @contract_type, @contract_no, @nature_work, @num_workers, @status
                )
            `);
        }

        const updated = await pool.request()
            .input('code', sql.NVarChar(50), manualCode)
            .query('SELECT * FROM purchase_manuals WHERE manual_code = @code');

        return res.status(200).json({ success: true, data: updated.recordset[0] });
    } catch (err) {
        console.error('[purchaseManualController] createOrUpdatePurchaseManual error:', err);
        return res.status(500).json({ success: false, message: err.message, data: null });
    }
}

// PUT /api/purchase-manuals/:id
async function updatePurchaseManual(req, res) {
    try {
        const pool = await getPool();
        const { id } = req.params;
        const pm = req.body;

        const request = pool.request().input('id', sql.NVarChar(100), id);
        const updates = [];

        if (pm.status !== undefined) {
            updates.push('status = @status');
            request.input('status', sql.NVarChar(50), pm.status);
            if (pm.status === 'Approved') {
                updates.push('date_approved = CAST(GETDATE() AS DATE)');
            }
        }
        updates.push('updated_at = GETDATE()');

        await request.query(`
            UPDATE purchase_manuals SET ${updates.join(', ')}
            WHERE manual_code = @id OR CAST(id AS NVARCHAR(100)) = @id
        `);

        const result = await pool.request()
            .input('id', sql.NVarChar(100), id)
            .query('SELECT * FROM purchase_manuals WHERE manual_code = @id OR CAST(id AS NVARCHAR(100)) = @id');

        return res.json({ success: true, data: result.recordset[0] || null });
    } catch (err) {
        console.error('[purchaseManualController] updatePurchaseManual error:', err);
        return res.status(500).json({ success: false, message: err.message, data: null });
    }
}

// DELETE /api/purchase-manuals/:id
async function deletePurchaseManual(req, res) {
    try {
        const pool = await getPool();
        const { id } = req.params;
        await pool.request()
            .input('id', sql.NVarChar(100), id)
            .query('DELETE FROM purchase_manuals WHERE manual_code = @id OR CAST(id AS NVARCHAR(100)) = @id');
        return res.json({ success: true, message: 'Purchase manual deleted', data: null });
    } catch (err) {
        console.error('[purchaseManualController] deletePurchaseManual error:', err);
        return res.status(500).json({ success: false, message: err.message, data: null });
    }
}

module.exports = {
    getPurchaseManuals,
    createOrUpdatePurchaseManual,
    updatePurchaseManual,
    deletePurchaseManual
};
