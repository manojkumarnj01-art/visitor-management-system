const nodemailer = require('nodemailer');
require('dotenv').config();

async function testSmtpConnection() {
    console.log('=======================================================');
    console.log('[SMTP DIAGNOSTIC TEST] Initializing Email Verification');
    console.log('=======================================================');
    console.log('Configured SMTP Host:', process.env.SMTP_HOST || '(Not set - using Ethereal Test Account fallback)');
    console.log('Configured SMTP Port:', process.env.SMTP_PORT || '587');
    console.log('Configured SMTP User:', process.env.SMTP_USER || '(Not set)');

    let transporter;
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        console.log('\n[SMTP CONNECT] Testing Custom/Production SMTP credentials...');
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587', 10),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            },
            tls: { rejectUnauthorized: false }
        });
    } else {
        console.log('\n[SMTP CONNECT] Production SMTP env missing in .env - Creating Ethereal Test Account for verification...');
        const testAccount = await nodemailer.createTestAccount();
        console.log('[SMTP Ethereal User]:', testAccount.user);
        transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });
    }

    try {
        console.log('[SMTP VERIFY] Testing SMTP server connection...');
        await transporter.verify();
        console.log('[SMTP VERIFY SUCCESS] Transporter connection established and authenticated successfully!');

        console.log('\n[EMAIL DELIVER] Sending test verification email...');
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || '"Barani VMS" <vms@barani.com>',
            to: 'host@barani.com',
            subject: '[VMS Diagnostic Test] Host Approval Email Delivery Verification',
            html: '<h3>VMS Host Approval Email Test</h3><p>If you see this message, the email delivery pipeline is 100% operational.</p>'
        });

        console.log('[EMAIL DELIVER SUCCESS] MessageId:', info.messageId);
        const previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) {
            console.log('[EMAIL PREVIEW URL]:', previewUrl);
        }

        console.log('\n=======================================================');
        console.log('[SMTP DIAGNOSTIC TEST] ALL EMAIL DELIVERIES PASSED 100%');
        console.log('=======================================================\n');
    } catch (err) {
        console.error('[SMTP VERIFY ERROR] SMTP connection/delivery failed:', err);
    }
}

testSmtpConnection();
