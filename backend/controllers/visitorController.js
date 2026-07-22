const { getPool, sql } = require('../config/db');
const tokenService = require('../services/tokenService');
const emailService = require('../services/emailService');

// GET /api/visitors
async function getAllVisitors(req, res) {
    try {
        const pool = await getPool();
        const { status, search } = req.query;
        let query = 'SELECT * FROM visitors';
        const request = pool.request();

        const conditions = [];
        if (status) {
            conditions.push('status = @status');
            request.input('status', sql.NVarChar(50), status);
        }
        if (search) {
            conditions.push('(name LIKE @search OR phone LIKE @search OR company LIKE @search OR visitor_code LIKE @search)');
            request.input('search', sql.NVarChar(255), `%${search}%`);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
        query += ' ORDER BY created_at DESC';

        const result = await request.query(query);
        return res.json({ success: true, data: result.recordset });
    } catch (err) {
        console.error('[visitorController] getAllVisitors error:', err);
        return res.status(500).json({ success: false, message: err.message, data: null });
    }
}

// GET /api/visitors/:id
async function getVisitorById(req, res) {
    try {
        const pool = await getPool();
        const { id } = req.params;
        const result = await pool.request()
            .input('id', sql.NVarChar(100), id)
            .query(`
                SELECT * FROM visitors 
                WHERE CAST(id AS NVARCHAR(100)) = @id OR visitor_code = @id
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ success: false, message: 'Visitor not found', data: null });
        }
        return res.json({ success: true, data: result.recordset[0] });
    } catch (err) {
        console.error('[visitorController] getVisitorById error:', err);
        return res.status(500).json({ success: false, message: err.message, data: null });
    }
}

// POST /api/visitors
async function createVisitor(req, res) {
    try {
        const pool = await getPool();
        const v = req.body;
        const visitorCode = v.visitor_code || v.id || `VIS-${Date.now().toString().slice(-6)}`;
        const hostId = v.host_id || v.hostId || null;

        // Generate secure tokens
        const tokens = tokenService.generateApprovalTokens(visitorCode, hostId);
        const approveToken = v.approve_token || v.approveToken || tokens.approveToken;
        const rejectToken = v.reject_token || v.rejectToken || tokens.rejectToken;
        const hostDept = v.host_dept || v.hostDept || null;

        // Auto-ensure department exists in departments table if provided
        if (hostDept) {
            try {
                await pool.request()
                    .input('deptName', sql.NVarChar(100), hostDept)
                    .query('IF NOT EXISTS (SELECT 1 FROM departments WHERE name = @deptName) INSERT INTO departments (name) VALUES (@deptName)');
            } catch (deptErr) {
                console.warn('[visitorController] Department insert warning:', deptErr.message);
            }
        }

        const request = pool.request()
            .input('visitor_code', sql.NVarChar(50), visitorCode)
            .input('name', sql.NVarChar(255), v.name || '')
            .input('phone', sql.NVarChar(50), v.phone || '')
            .input('email', sql.NVarChar(255), v.email || null)
            .input('address', sql.NVarChar(sql.MAX), v.address || null)
            .input('company', sql.NVarChar(255), v.company || null)
            .input('purpose', sql.NVarChar(255), v.purpose || null)
            .input('vehicle', sql.NVarChar(50), v.vehicle || null)
            .input('num_visitors', sql.Int, v.num_visitors || v.numVisitors || 1)
            .input('id_type', sql.NVarChar(50), v.id_type || v.idType || null)
            .input('id_number', sql.NVarChar(100), v.id_number || v.idNumber || null)
            .input('host_id', sql.NVarChar(50), hostId)
            .input('host_name', sql.NVarChar(255), v.host_name || v.hostName || null)
            .input('host_dept', sql.NVarChar(100), hostDept)
            .input('status', sql.NVarChar(50), v.status || 'Pending')
            .input('photo', sql.NVarChar(sql.MAX), v.photo || null)
            .input('photo_id_doc', sql.NVarChar(sql.MAX), v.photo_id_doc || v.photoIdDoc || null)
            .input('approve_token', sql.NVarChar(255), approveToken)
            .input('reject_token', sql.NVarChar(255), rejectToken)
            .input('branch', sql.NVarChar(100), v.branch || null)
            .input('qr_code', sql.NVarChar(sql.MAX), v.qr_code || v.qrCode || null)
            .input('visitor_pass_image', sql.NVarChar(sql.MAX), v.visitor_pass_image || v.visitorPassImage || null)
            .input('visitor_pass_pdf', sql.NVarChar(sql.MAX), v.visitor_pass_pdf || v.visitorPassPdf || null);

        // Check if exists for upsert
        const check = await pool.request()
            .input('vcode', sql.NVarChar(50), visitorCode)
            .query('SELECT visitor_code FROM visitors WHERE visitor_code = @vcode');

        if (check.recordset.length > 0) {
            // Update
            await request.query(`
                UPDATE visitors SET
                    name = @name, phone = @phone, email = @email, address = @address,
                    company = @company, purpose = @purpose, vehicle = @vehicle,
                    num_visitors = @num_visitors, id_type = @id_type, id_number = @id_number,
                    host_id = @host_id, host_name = @host_name, host_dept = @host_dept,
                    status = @status, photo = COALESCE(@photo, photo),
                    photo_id_doc = COALESCE(@photo_id_doc, photo_id_doc),
                    approve_token = COALESCE(@approve_token, approve_token),
                    reject_token = COALESCE(@reject_token, reject_token),
                    branch = COALESCE(@branch, branch), qr_code = COALESCE(@qr_code, qr_code),
                    updated_at = GETDATE()
                WHERE visitor_code = @visitor_code
            `);
        } else {
            // Insert
            await request.query(`
                INSERT INTO visitors (
                    visitor_code, name, phone, email, address, company, purpose, vehicle,
                    num_visitors, id_type, id_number, host_id, host_name, host_dept, status,
                    photo, photo_id_doc, approve_token, reject_token, branch, qr_code,
                    visitor_pass_image, visitor_pass_pdf
                ) VALUES (
                    @visitor_code, @name, @phone, @email, @address, @company, @purpose, @vehicle,
                    @num_visitors, @id_type, @id_number, @host_id, @host_name, @host_dept, @status,
                    @photo, @photo_id_doc, @approve_token, @reject_token, @branch, @qr_code,
                    @visitor_pass_image, @visitor_pass_pdf
                )
            `);
        }

        const updated = await pool.request()
            .input('vcode', sql.NVarChar(50), visitorCode)
            .query('SELECT * FROM visitors WHERE visitor_code = @vcode');

        const createdVisitor = updated.recordset[0];

        // Trigger Async Host Email Dispatch
        setImmediate(async () => {
            try {
                let hostRecord = null;
                if (hostId) {
                    const empRes = await pool.request()
                        .input('hid', sql.NVarChar(50), hostId)
                        .query('SELECT * FROM employees WHERE employee_code = @hid OR name = @hid OR email = @hid');
                    if (empRes.recordset.length > 0) {
                        hostRecord = empRes.recordset[0];
                    }
                }
                console.log(`[visitorController] Triggering automatic host email for visitor: ${createdVisitor.visitor_code}`);
                await emailService.sendHostApprovalEmail(createdVisitor, hostRecord, approveToken, rejectToken);
            } catch (emailErr) {
                console.error('[visitorController] Async host email error:', emailErr);
            }
        });

        return res.status(201).json({ success: true, data: createdVisitor });
    } catch (err) {
        console.error('[visitorController] createVisitor error:', err);
        return res.status(500).json({ success: false, message: err.message, data: null });
    }
}

// PUT /api/visitors/:id
async function updateVisitor(req, res) {
    try {
        const pool = await getPool();
        const { id } = req.params;
        const v = req.body;

        const request = pool.request().input('id', sql.NVarChar(100), id);
        const updates = [];

        if (v.status !== undefined) {
            updates.push('status = @status');
            request.input('status', sql.NVarChar(50), v.status);
            if (v.status === 'Checked In' && !v.check_in) {
                updates.push('check_in = GETDATE()');
            } else if (v.status === 'Checked Out' && !v.check_out) {
                updates.push('check_out = GETDATE()');
            }
        }
        if (v.name !== undefined) { updates.push('name = @name'); request.input('name', sql.NVarChar(255), v.name); }
        if (v.phone !== undefined) { updates.push('phone = @phone'); request.input('phone', sql.NVarChar(50), v.phone); }
        if (v.email !== undefined) { updates.push('email = @email'); request.input('email', sql.NVarChar(255), v.email); }
        if (v.company !== undefined) { updates.push('company = @company'); request.input('company', sql.NVarChar(255), v.company); }
        if (v.purpose !== undefined) { updates.push('purpose = @purpose'); request.input('purpose', sql.NVarChar(255), v.purpose); }
        if (v.approved_by !== undefined) { updates.push('approved_by = @approved_by'); request.input('approved_by', sql.NVarChar(255), v.approved_by); }
        if (v.qr_code !== undefined) { updates.push('qr_code = @qr_code'); request.input('qr_code', sql.NVarChar(sql.MAX), v.qr_code); }

        updates.push('updated_at = GETDATE()');

        await request.query(`
            UPDATE visitors SET ${updates.join(', ')}
            WHERE CAST(id AS NVARCHAR(100)) = @id OR visitor_code = @id
        `);

        const result = await pool.request()
            .input('id', sql.NVarChar(100), id)
            .query('SELECT * FROM visitors WHERE CAST(id AS NVARCHAR(100)) = @id OR visitor_code = @id');

        return res.json({ success: true, data: result.recordset[0] || null });
    } catch (err) {
        console.error('[visitorController] updateVisitor error:', err);
        return res.status(500).json({ success: false, message: err.message, data: null });
    }
}

// PUT /api/visitors/:id/checkin
async function checkInVisitor(req, res) {
    req.body = { ...req.body, status: 'Checked In' };
    return updateVisitor(req, res);
}

// PUT /api/visitors/:id/checkout
async function checkOutVisitor(req, res) {
    req.body = { ...req.body, status: 'Checked Out' };
    return updateVisitor(req, res);
}

// DELETE /api/visitors/:id
async function deleteVisitor(req, res) {
    try {
        const pool = await getPool();
        const { id } = req.params;
        await pool.request()
            .input('id', sql.NVarChar(100), id)
            .query('DELETE FROM visitors WHERE CAST(id AS NVARCHAR(100)) = @id OR visitor_code = @id');
        return res.json({ success: true, message: 'Visitor deleted', data: null });
    } catch (err) {
        console.error('[visitorController] deleteVisitor error:', err);
        return res.status(500).json({ success: false, message: err.message, data: null });
    }
}

module.exports = {
    getAllVisitors,
    getVisitorById,
    createVisitor,
    updateVisitor,
    checkInVisitor,
    checkOutVisitor,
    deleteVisitor
};
