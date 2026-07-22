const nodemailer = require('nodemailer');

let transporter = null;

async function getTransporter() {
    if (transporter) return transporter;

    const APP_BASE_URL = process.env.APP_BASE_URL || 'http://localhost:5000';
    const SMTP_HOST = process.env.SMTP_HOST || '';
    const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
    const SMTP_USER = process.env.SMTP_USER || '';
    const SMTP_PASS = process.env.SMTP_PASS || '';
    const SMTP_SECURE = process.env.SMTP_SECURE === 'true';

    if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
        console.log(`[SMTP CONNECT] Initializing production SMTP transporter for host: ${SMTP_HOST}:${SMTP_PORT} (User: ${SMTP_USER})`);
        transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: SMTP_PORT,
            secure: SMTP_SECURE,
            auth: { user: SMTP_USER, pass: SMTP_PASS },
            tls: { rejectUnauthorized: false }
        });
    } else {
        console.log('[SMTP CONNECT] Production SMTP credentials not fully provided in .env. Initializing Ethereal Test Account fallback...');
        try {
            const testAccount = await nodemailer.createTestAccount();
            console.log(`[SMTP CONNECT SUCCESS] Created Ethereal Test Account: ${testAccount.user}`);
            transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: { user: testAccount.user, pass: testAccount.pass }
            });
        } catch (err) {
            console.error('[SMTP CONNECT ERROR] Failed to create Ethereal test account:', err.message);
            // Emergency fallback direct transport
            transporter = nodemailer.createTransport({
                jsonTransport: true
            });
        }
    }

    try {
        await transporter.verify();
        console.log('[SMTP CONNECT VERIFY] Transporter connection & authentication verified successfully.');
    } catch (vErr) {
        console.error('[SMTP CONNECT VERIFY WARN] Verification warning:', vErr.message);
    }

    return transporter;
}

async function dispatchEmailWithRetry(mailOptions, maxRetries = 3) {
    const trans = await getTransporter();
    let attempt = 0;
    let lastError = null;

    console.log(`[EMAIL GENERATION] Preparing email to '${mailOptions.to}' | Subject: '${mailOptions.subject}'`);

    while (attempt < maxRetries) {
        attempt++;
        try {
            console.log(`[EMAIL DELIVERY ATTEMPT ${attempt}/${maxRetries}] Sending email to ${mailOptions.to}...`);
            const info = await trans.sendMail(mailOptions);
            
            console.log(`[EMAIL DELIVERY SUCCESS] MessageId: ${info.messageId || 'SENT'} | Accepted: ${JSON.stringify(info.accepted)}`);
            
            // Check for Ethereal Preview URL
            const previewUrl = nodemailer.getTestMessageUrl(info);
            if (previewUrl) {
                console.log(`[EMAIL PREVIEW URL] View live test email: ${previewUrl}`);
            }

            return { success: true, messageId: info.messageId, previewUrl, accepted: info.accepted };
        } catch (err) {
            lastError = err;
            console.error(`[EMAIL DELIVERY FAILURE - ATTEMPT ${attempt}/${maxRetries}] Error sending to ${mailOptions.to}:`, err.message);
            if (attempt < maxRetries) {
                const backoffMs = attempt * 1000;
                console.log(`[EMAIL RETRY] Retrying email delivery in ${backoffMs}ms...`);
                await new Promise(r => setTimeout(r, backoffMs));
            }
        }
    }

    console.error(`[EMAIL DELIVERY FATAL ERROR] All ${maxRetries} attempts failed for email to ${mailOptions.to}. Exact Reason: ${lastError.message}`);
    return { success: false, error: lastError.message, attempts: maxRetries };
}

async function sendHostApprovalEmail(visitor, host, approveToken, rejectToken) {
    const APP_BASE_URL = process.env.APP_BASE_URL || 'http://localhost:5000';
    const SMTP_FROM = process.env.SMTP_FROM || '"Barani Hydraulics VMS" <vms@barani.com>';
    const DEFAULT_HOST_EMAIL = process.env.DEFAULT_HOST_EMAIL || 'host@barani.com';

    let hostEmail = DEFAULT_HOST_EMAIL;
    let hostName = visitor.host_name || 'Host';

    if (host && host.email) {
        hostEmail = host.email;
        hostName = host.name || hostName;
    } else if (visitor.host_email) {
        hostEmail = visitor.host_email;
    }

    console.log(`[HOST EMAIL RESOLUTION] Visitor Code: ${visitor.visitor_code || visitor.id} | Resolved Host Name: '${hostName}' | Target Host Email: '${hostEmail}'`);

    const approveUrl = `${APP_BASE_URL}/api/approval/approve?token=${encodeURIComponent(approveToken)}`;
    const rejectUrl = `${APP_BASE_URL}/api/approval/reject?token=${encodeURIComponent(rejectToken)}`;

    const photoHtml = visitor.photo ? 
        `<td style="padding: 12px; vertical-align: top;"><img src="${visitor.photo}" alt="Visitor Photo" style="max-width: 140px; max-height: 140px; border-radius: 8px; border: 1px solid #ddd; object-fit: cover;" /></td>` : '';

    const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; color: #333; }
            .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08); border: 1px solid #e1e8ed; }
            .header { background: linear-gradient(135deg, #1e3a8a, #3b82f6); padding: 24px; text-align: center; color: #ffffff; }
            .header h2 { margin: 0; font-size: 22px; font-weight: 700; }
            .header p { margin: 6px 0 0 0; opacity: 0.9; font-size: 13px; letter-spacing: 0.5px; }
            .content { padding: 28px; }
            .badge { display: inline-block; background: #eff6ff; color: #1d4ed8; font-weight: 600; padding: 4px 12px; border-radius: 20px; font-size: 12px; margin-bottom: 16px; border: 1px solid #bfdbfe; }
            .detail-table { width: 100%; border-collapse: collapse; margin: 16px 0; }
            .detail-table td { padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
            .detail-table td.label { font-weight: 600; color: #64748b; width: 35%; }
            .detail-table td.value { color: #0f172a; font-weight: 500; }
            .action-container { text-align: center; margin-top: 32px; padding-top: 24px; border-top: 2px dashed #e2e8f0; }
            .btn { display: inline-block; padding: 14px 28px; margin: 6px 10px; font-size: 15px; font-weight: 700; text-decoration: none; border-radius: 8px; transition: all 0.2s; text-align: center; }
            .btn-approve { background-color: #16a34a; color: #ffffff !important; box-shadow: 0 4px 10px rgba(22,163,74,0.3); }
            .btn-reject { background-color: #dc2626; color: #ffffff !important; box-shadow: 0 4px 10px rgba(220,38,38,0.3); }
            .footer { background: #f8fafc; padding: 16px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
        </style>
    </head>
    <body>
        <div class="card">
            <div class="header">
                <h2>Barani Hydraulics</h2>
                <p>VISITOR APPROVAL REQUEST</p>
            </div>
            <div class="content">
                <div class="badge">Awaiting Host Authorization</div>
                <p style="font-size: 15px; margin-top: 0;">Dear <strong>${hostName}</strong>,</p>
                <p style="font-size: 14px; color: #475569; line-height: 1.5;">
                    A new visitor has arrived at security registration and requested to meet with you. Please review the details below and select <strong>Approve</strong> or <strong>Reject</strong>.
                </p>

                <table style="width: 100%;">
                    <tr>
                        <td>
                            <table class="detail-table">
                                <tr>
                                    <td class="label">Visitor ID:</td>
                                    <td class="value"><strong>${visitor.visitor_code || visitor.id}</strong></td>
                                </tr>
                                <tr>
                                    <td class="label">Visitor Name:</td>
                                    <td class="value"><strong>${visitor.name || 'N/A'}</strong></td>
                                </tr>
                                <tr>
                                    <td class="label">Company:</td>
                                    <td class="value">${visitor.company || 'Individual / Guest'}</td>
                                </tr>
                                <tr>
                                    <td class="label">Mobile Number:</td>
                                    <td class="value">${visitor.phone || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td class="label">Purpose of Visit:</td>
                                    <td class="value">${visitor.purpose || 'Official Meeting'}</td>
                                </tr>
                                <tr>
                                    <td class="label">Date & Time:</td>
                                    <td class="value">${new Date().toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <td class="label">Host Department:</td>
                                    <td class="value">${visitor.host_dept || 'N/A'}</td>
                                </tr>
                            </table>
                        </td>
                        ${photoHtml}
                    </tr>
                </table>

                <div class="action-container">
                    <p style="font-size: 13px; color: #64748b; margin-bottom: 16px;">Direct Authorization (No login required):</p>
                    <a href="${approveUrl}" class="btn btn-approve" target="_blank">✔ APPROVE VISIT</a>
                    <a href="${rejectUrl}" class="btn btn-reject" target="_blank">✖ REJECT VISIT</a>
                </div>
            </div>
            <div class="footer">
                This is an automated system notification from Barani Hydraulics Visitor Management System.<br>
                Links will expire after 24 hours. Do not share these approval links.
            </div>
        </div>
    </body>
    </html>
    `;

    return dispatchEmailWithRetry({
        from: SMTP_FROM,
        to: hostEmail,
        subject: `[VMS Action Required] Visitor Arrival Approval: ${visitor.name} (${visitor.company || 'Guest'})`,
        html: htmlBody
    });
}

async function sendVisitorApprovalEmail(visitor, passPdfBuffer) {
    if (!visitor.email) return { success: true, skipped: 'No visitor email provided' };

    const SMTP_FROM = process.env.SMTP_FROM || '"Barani Hydraulics VMS" <vms@barani.com>';
    const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #16a34a;">Visit Request Approved!</h2>
        <p>Dear <strong>${visitor.name}</strong>,</p>
        <p>Your visit request to meet <strong>${visitor.host_name || 'Host'}</strong> at <strong>Barani Hydraulics</strong> has been approved!</p>
        <p>Your official Visitor Pass is attached to this email as a PDF. Please present the QR code on the pass upon arrival at security check-in.</p>
        <br>
        <p><strong>Visit Details:</strong></p>
        <ul>
            <li><strong>Visitor ID:</strong> ${visitor.visitor_code || visitor.id}</li>
            <li><strong>Host:</strong> ${visitor.host_name || 'N/A'} (${visitor.host_dept || ''})</li>
            <li><strong>Purpose:</strong> ${visitor.purpose || 'Official'}</li>
        </ul>
        <br>
        <p>Thank you,<br><strong>Barani Hydraulics Security Team</strong></p>
    </body>
    </html>
    `;

    const attachments = [];
    if (passPdfBuffer) {
        attachments.push({
            filename: `VisitorPass_${visitor.visitor_code || 'Pass'}.pdf`,
            content: passPdfBuffer,
            contentType: 'application/pdf'
        });
    }

    return dispatchEmailWithRetry({
        from: SMTP_FROM,
        to: visitor.email,
        subject: `Visit Approved - Barani Hydraulics Visitor Pass (${visitor.visitor_code || 'Pass'})`,
        html: htmlBody,
        attachments
    });
}

async function sendHostApprovalConfirmationEmail(visitor, host) {
    const SMTP_FROM = process.env.SMTP_FROM || '"Barani Hydraulics VMS" <vms@barani.com>';
    const DEFAULT_HOST_EMAIL = process.env.DEFAULT_HOST_EMAIL || 'host@barani.com';
    const hostEmail = (host && host.email) ? host.email : (visitor.host_email || DEFAULT_HOST_EMAIL);

    const htmlBody = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h3 style="color: #1e3a8a;">Visit Approval Confirmed</h3>
        <p>Dear <strong>${visitor.host_name || 'Host'}</strong>,</p>
        <p>You have successfully <strong>APPROVED</strong> the visit request for <strong>${visitor.name}</strong> (${visitor.company || 'Visitor'}).</p>
        <p>The visitor has been issued a digital visitor pass and notified via WhatsApp & Email.</p>
    </body>
    </html>
    `;

    return dispatchEmailWithRetry({
        from: SMTP_FROM,
        to: hostEmail,
        subject: `[VMS Confirmed] Approved Visit for ${visitor.name}`,
        html: htmlBody
    });
}

async function sendRejectionNotificationEmails(visitor, host, reason = 'Visit request declined by host') {
    const SMTP_FROM = process.env.SMTP_FROM || '"Barani Hydraulics VMS" <vms@barani.com>';

    if (visitor.email) {
        const visitorHtml = `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h3 style="color: #dc2626;">Visit Request Notice</h3>
            <p>Dear <strong>${visitor.name}</strong>,</p>
            <p>We regret to inform you that your visit request to meet <strong>${visitor.host_name || 'Host'}</strong> at <strong>Barani Hydraulics</strong> could not be approved at this time.</p>
            <p>Please contact your host or security reception for further assistance.</p>
        </body>
        </html>
        `;
        await dispatchEmailWithRetry({
            from: SMTP_FROM,
            to: visitor.email,
            subject: `Visit Request Notice - Barani Hydraulics`,
            html: visitorHtml
        });
    }

    const secHtml = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h3 style="color: #dc2626;">Visitor Request Rejected</h3>
        <p>Visitor <strong>${visitor.name}</strong> (${visitor.visitor_code || ''}) request for host <strong>${visitor.host_name || ''}</strong> has been <strong>REJECTED</strong>.</p>
    </body>
    </html>
    `;
    return dispatchEmailWithRetry({
        from: SMTP_FROM,
        to: process.env.SECURITY_EMAIL || 'security@barani.com',
        subject: `[VMS Alert] Visitor Request Rejected: ${visitor.name}`,
        html: secHtml
    });
}

module.exports = {
    sendHostApprovalEmail,
    sendVisitorApprovalEmail,
    sendHostApprovalConfirmationEmail,
    sendRejectionNotificationEmails,
    getTransporter
};
