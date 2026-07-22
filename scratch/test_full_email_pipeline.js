const http = require('http');
const app = require('../server');
const emailService = require('../backend/services/emailService');

const server = app.listen(5004, async () => {
    console.log('=======================================================');
    console.log('[FULL EMAIL PIPELINE VERIFICATION] Starting Server on Port 5004');
    console.log('=======================================================');

    function httpGet(urlStr) {
        return new Promise((resolve, reject) => {
            http.get(urlStr, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => resolve({ status: res.statusCode, body: data }));
            }).on('error', reject);
        });
    }

    function httpPost(urlStr, bodyObj) {
        return new Promise((resolve, reject) => {
            const dataStr = JSON.stringify(bodyObj);
            const req = http.request(urlStr, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(dataStr),
                    'X-User-Role': 'Administrator'
                }
            }, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
            });
            req.on('error', reject);
            req.write(dataStr);
            req.end();
        });
    }

    try {
        // Step 1: Verify Transporter
        console.log('\n--- 1. Testing Transporter Initialization ---');
        const trans = await emailService.getTransporter();
        if (!trans) throw new Error('Transporter initialization failed!');
        console.log('[OK] Transporter initialized and ready.');

        // Step 2: Register Visitor
        console.log('\n--- 2. Registering Visitor via API ---');
        const vCode = `VIS-LIVE-${Date.now().toString().slice(-4)}`;
        const regRes = await httpPost('http://localhost:5004/api/visitors', {
            visitor_code: vCode,
            name: 'Robert Langdon',
            phone: '9876543210',
            email: 'robert.langdon@harvard.edu',
            company: 'Harvard Symbology',
            purpose: 'Symbology & Artifact Inspection',
            host_name: 'Dr. R. Sundaram',
            host_dept: 'Engineering & R&D',
            host_email: 'sundaram@barani.com'
        });

        console.log(`[API Response] Registration Status: ${regRes.status}`);
        const visitor = regRes.body.data;
        console.log(`[Registered Visitor Code]: ${visitor.visitor_code}`);
        console.log(`[Approve Token Generated]: ${!!visitor.approve_token}`);
        console.log(`[Reject Token Generated]: ${!!visitor.reject_token}`);

        // Wait 2 seconds for async email dispatch
        await new Promise(r => setTimeout(r, 2000));

        // Step 3: Execute Approve Link
        console.log('\n--- 3. Testing Host Email Approval Link Click ---');
        const approveUrl = `http://localhost:5004/api/approval/approve?token=${encodeURIComponent(visitor.approve_token)}`;
        const approveRes = await httpGet(approveUrl);
        console.log(`[Approval API Status]: ${approveRes.status}`);
        if (approveRes.status !== 200 || !approveRes.body.includes('Visit Approved Successfully')) {
            throw new Error('Approval API link execution failed!');
        }
        console.log('[OK] Approval link returned success web page to host!');

        // Step 4: Verify Database Update & Pass Generation
        console.log('\n--- 4. Verifying Visitor Status & Pass Generation in Database ---');
        const fetchRes = await httpGet(`http://localhost:5004/api/visitors/${vCode}`);
        const updatedVisitor = JSON.parse(fetchRes.body).data;

        console.log(`[DB Status]: ${updatedVisitor.status}`);
        console.log(`[Approved By]: ${updatedVisitor.approved_by}`);
        console.log(`[Approved At]: ${updatedVisitor.approved_at}`);
        console.log(`[QR Code Present]: ${!!updatedVisitor.qr_code}`);
        console.log(`[Visitor Pass Image Present]: ${!!updatedVisitor.visitor_pass_image}`);
        console.log(`[Visitor Pass PDF Present]: ${!!updatedVisitor.visitor_pass_pdf}`);

        if (updatedVisitor.status !== 'Approved' || !updatedVisitor.qr_code || !updatedVisitor.visitor_pass_image) {
            throw new Error('Database status or generated pass items missing after approval!');
        }

        // Step 5: Test Rejection Link
        console.log('\n--- 5. Testing Rejection Link Workflow ---');
        const rejCode = `VIS-REJ-${Date.now().toString().slice(-4)}`;
        const regRejRes = await httpPost('http://localhost:5004/api/visitors', {
            visitor_code: rejCode,
            name: 'Declined Guest',
            phone: '9123456789',
            company: 'External Vendors Inc',
            host_name: 'Dr. R. Sundaram',
            host_email: 'sundaram@barani.com'
        });
        const rejVisitor = regRejRes.body.data;
        const rejectUrl = `http://localhost:5004/api/approval/reject?token=${encodeURIComponent(rejVisitor.reject_token)}`;
        const rejRes = await httpGet(rejectUrl);
        console.log(`[Rejection API Status]: ${rejRes.status}`);
        if (rejRes.status !== 200 || !rejRes.body.includes('Visit Request Declined')) {
            throw new Error('Rejection link execution failed!');
        }
        console.log('[OK] Rejection link returned decline page!');

        console.log('\n=======================================================');
        console.log('[FULL EMAIL PIPELINE VERIFICATION] ALL 5 STAGES PASSED 100%');
        console.log('=======================================================\n');
        server.close(() => process.exit(0));
    } catch (err) {
        console.error('FULL PIPELINE VERIFICATION FAILED:', err);
        server.close(() => process.exit(1));
    }
});
