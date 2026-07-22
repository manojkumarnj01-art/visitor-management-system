const { getPool, sql } = require('../config/db');
const tokenService = require('../services/tokenService');
const passGeneratorService = require('../services/passGeneratorService');
const emailService = require('../services/emailService');
const whatsappService = require('../services/whatsappService');

function renderHtmlResponse(title, statusType, heading, message, detailsHtml = '') {
    const isSuccess = statusType === 'success';
    const isWarning = statusType === 'warning';
    const headerBg = isSuccess ? '#16a34a' : (isWarning ? '#d97706' : '#dc2626');
    const icon = isSuccess ? '✔' : (isWarning ? '⚠' : '✖');

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${title}</title>
        <style>
            body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; background-color: #f1f5f9; margin: 0; padding: 40px 16px; color: #1e293b; display: flex; align-items: center; justify-content: center; min-height: 80vh; }
            .card { max-width: 520px; width: 100%; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; text-align: center; }
            .header { background: ${headerBg}; padding: 32px 20px; color: #ffffff; }
            .icon-circle { width: 64px; height: 64px; background: rgba(255,255,255,0.25); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto; font-size: 32px; font-weight: bold; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 700; }
            .content { padding: 32px 24px; }
            .content p { font-size: 15px; color: #475569; line-height: 1.6; margin-top: 0; }
            .details-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; text-align: left; margin-top: 20px; font-size: 14px; }
            .footer { background: #f8fafc; padding: 16px; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
        </style>
    </head>
    <body>
        <div class="card">
            <div class="header">
                <div class="icon-circle">${icon}</div>
                <h1>${heading}</h1>
            </div>
            <div class="content">
                <p>${message}</p>
                ${detailsHtml}
            </div>
            <div class="footer">
                Barani Hydraulics — Visitor Management System
            </div>
        </div>
    </body>
    </html>
    `;
}

async function handleApproveLink(req, res) {
    try {
        const { token } = req.query;
        console.log(`[APPROVAL API] Received approval request with token: ${token ? token.slice(0, 35) + '...' : '(none)'}`);
        const verification = tokenService.verifyApprovalToken(token);

        if (!verification.valid) {
            console.warn(`[APPROVAL API WARN] Token verification failed: ${verification.message}`);
            return res.send(renderHtmlResponse(
                'Invalid Link',
                'danger',
                'Approval Link Invalid or Expired',
                verification.message || 'This approval link is invalid or has expired. Please contact security.'
            ));
        }

        const { visitor_code, host_id } = verification.payload;
        console.log(`[APPROVAL API SUCCESS] Token verified for Visitor Code: '${visitor_code}' | Host ID: '${host_id || 'N/A'}'`);
        const pool = await getPool();

        // Retrieve visitor
        const visResult = await pool.request()
            .input('vcode', sql.NVarChar(50), visitor_code)
            .query('SELECT * FROM visitors WHERE visitor_code = @vcode OR CAST(id AS NVARCHAR(100)) = @vcode');

        if (visResult.recordset.length === 0) {
            return res.send(renderHtmlResponse(
                'Visitor Not Found',
                'danger',
                'Visitor Record Not Found',
                'No visitor record matching this authorization code was found in the database.'
            ));
        }

        const visitor = visResult.recordset[0];

        // Anti-Replay Check
        if (visitor.status === 'Approved') {
            const approvedDate = visitor.approved_at ? new Date(visitor.approved_at).toLocaleString() : 'Previously';
            return res.send(renderHtmlResponse(
                'Already Approved',
                'warning',
                'Visit Previously Approved',
                `This visit request for <strong>${visitor.name}</strong> was already approved on <strong>${approvedDate}</strong> by <strong>${visitor.approved_by || visitor.host_name}</strong>.`,
                `<div class="details-box">
                    <strong>Visitor:</strong> ${visitor.name}<br>
                    <strong>Company:</strong> ${visitor.company || 'N/A'}<br>
                    <strong>Status:</strong> Approved & Active
                </div>`
            ));
        }

        if (visitor.status === 'Rejected') {
            return res.send(renderHtmlResponse(
                'Already Actioned',
                'danger',
                'Visit Previously Rejected',
                `This visit request for <strong>${visitor.name}</strong> was previously rejected.`
            ));
        }

        // Update database record to Approved
        const approvedBy = visitor.host_name || host_id || 'Host Authorization';

        // Synchronously generate QR Code and Passes
        console.log(`[approvalController] Generating Visitor Pass for ${visitor.visitor_code}...`);
        const qrCodeDataUrl = await passGeneratorService.generateQrCodeDataUrl({
            vcode: visitor.visitor_code,
            name: visitor.name,
            host: visitor.host_name,
            status: 'Approved'
        });

        const passPdfBuffer = await passGeneratorService.generateVisitorPassPdfBuffer(visitor);
        const passImageDataUrl = await passGeneratorService.generateVisitorPassImageDataUrl(visitor);
        const passPdfBase64 = passPdfBuffer ? passPdfBuffer.toString('base64') : null;

        await pool.request()
            .input('vcode', sql.NVarChar(50), visitor.visitor_code)
            .input('approved_by', sql.NVarChar(255), approvedBy)
            .input('qr_code', sql.NVarChar(sql.MAX), qrCodeDataUrl)
            .input('pass_img', sql.NVarChar(sql.MAX), passImageDataUrl)
            .input('pass_pdf', sql.NVarChar(sql.MAX), passPdfBase64)
            .query(`
                UPDATE visitors SET 
                    status = 'Approved',
                    approved_by = @approved_by,
                    approved_at = GETDATE(),
                    qr_code = COALESCE(@qr_code, qr_code),
                    visitor_pass_image = COALESCE(@pass_img, visitor_pass_image),
                    visitor_pass_pdf = COALESCE(@pass_pdf, visitor_pass_pdf),
                    updated_at = GETDATE()
                WHERE visitor_code = @vcode
            `);

        // Fetch refreshed record
        const refResult = await pool.request()
            .input('vcode', sql.NVarChar(50), visitor.visitor_code)
            .query('SELECT * FROM visitors WHERE visitor_code = @vcode');
        const updatedVisitor = refResult.recordset[0];

        // Background WhatsApp & Email Dispatches
        setImmediate(async () => {
            try {
                console.log(`[approvalController] Dispatching WhatsApp & Email notifications for ${updatedVisitor.visitor_code}...`);
                await whatsappService.sendVisitorPassWhatsApp(updatedVisitor, passImageDataUrl);
                await emailService.sendVisitorApprovalEmail(updatedVisitor, passPdfBuffer);
                await emailService.sendHostApprovalConfirmationEmail(updatedVisitor);
            } catch (bgErr) {
                console.error('[approvalController background notifications error]', bgErr);
            }
        });

        return res.send(renderHtmlResponse(
            'Visit Approved',
            'success',
            'Visit Approved Successfully!',
            `You have successfully authorized the visit for <strong>${updatedVisitor.name}</strong> (${updatedVisitor.company || 'Visitor'}).`,
            `<div class="details-box">
                <strong>Visitor:</strong> ${updatedVisitor.name}<br>
                <strong>Company:</strong> ${updatedVisitor.company || 'Individual Guest'}<br>
                <strong>Purpose:</strong> ${updatedVisitor.purpose || 'Meeting'}<br>
                <strong>Pass Status:</strong> Issued & Delivered via WhatsApp & Email
            </div>`
        ));
    } catch (err) {
        console.error('[approvalController] handleApproveLink error:', err);
        return res.status(500).send(renderHtmlResponse(
            'Server Error',
            'danger',
            'System Processing Error',
            'An internal error occurred while processing approval. Please contact system support.'
        ));
    }
}

async function handleRejectLink(req, res) {
    try {
        const { token } = req.query;
        const verification = tokenService.verifyApprovalToken(token);

        if (!verification.valid) {
            return res.send(renderHtmlResponse(
                'Invalid Link',
                'danger',
                'Rejection Link Invalid or Expired',
                verification.message || 'This link is invalid or has expired.'
            ));
        }

        const { visitor_code, host_id } = verification.payload;
        const pool = await getPool();

        const visResult = await pool.request()
            .input('vcode', sql.NVarChar(50), visitor_code)
            .query('SELECT * FROM visitors WHERE visitor_code = @vcode OR CAST(id AS NVARCHAR(100)) = @vcode');

        if (visResult.recordset.length === 0) {
            return res.send(renderHtmlResponse(
                'Visitor Not Found',
                'danger',
                'Visitor Record Not Found',
                'No matching visitor record was found in the database.'
            ));
        }

        const visitor = visResult.recordset[0];

        if (visitor.status === 'Rejected') {
            return res.send(renderHtmlResponse(
                'Already Actioned',
                'warning',
                'Visit Previously Rejected',
                `This visit request for <strong>${visitor.name}</strong> was already rejected.`
            ));
        }

        const approvedBy = visitor.host_name || host_id || 'Host Authorization';
        await pool.request()
            .input('vcode', sql.NVarChar(50), visitor.visitor_code)
            .input('approved_by', sql.NVarChar(255), approvedBy)
            .query(`
                UPDATE visitors SET 
                    status = 'Rejected',
                    approved_by = @approved_by,
                    approved_at = GETDATE(),
                    updated_at = GETDATE()
                WHERE visitor_code = @vcode
            `);

        setImmediate(async () => {
            try {
                await emailService.sendRejectionNotificationEmails(visitor);
            } catch (bgErr) {
                console.error('[approvalController background rejection error]', bgErr);
            }
        });

        return res.send(renderHtmlResponse(
            'Visit Rejected',
            'warning',
            'Visit Request Declined',
            `You have declined the visit request for <strong>${visitor.name}</strong>. Security and the visitor have been notified.`,
            `<div class="details-box">
                <strong>Visitor:</strong> ${visitor.name}<br>
                <strong>Company:</strong> ${visitor.company || 'N/A'}<br>
                <strong>Status:</strong> Rejected
            </div>`
        ));
    } catch (err) {
        console.error('[approvalController] handleRejectLink error:', err);
        return res.status(500).send(renderHtmlResponse(
            'Server Error',
            'danger',
            'System Error',
            'An internal error occurred while processing rejection.'
        ));
    }
}

module.exports = {
    handleApproveLink,
    handleRejectLink
};
