const http = require('http');
const app = require('../server');

const server = app.listen(5003, async () => {
    console.log('[WORKFLOW TEST] Express server listening on test port 5003');

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
        console.log('\n--- 1. Registering Test Visitor ---');
        const vCode = `VIS-WORKFLOW-${Date.now().toString().slice(-4)}`;
        const regRes = await httpPost('http://localhost:5003/api/visitors', {
            visitor_code: vCode,
            name: 'Sarah Connor',
            phone: '9988776655',
            email: 'sarah.connor@cyber.com',
            company: 'Cyberdyne Systems',
            purpose: 'Executive Meeting & Tour',
            host_name: 'John Connor',
            host_dept: 'IT & Security'
        });

        console.log(`Registration status: ${regRes.status}, Code: ${regRes.body.data.visitor_code}`);
        const createdVisitor = regRes.body.data;

        if (!createdVisitor.approve_token || !createdVisitor.reject_token) {
            throw new Error('Approval tokens were not generated during visitor registration!');
        }

        console.log('[OK] Approval token generated:', createdVisitor.approve_token.slice(0, 30) + '...');
        console.log('[OK] Reject token generated:', createdVisitor.reject_token.slice(0, 30) + '...');

        console.log('\n--- 2. Executing Host Approval Link ---');
        const approveUrl = `http://localhost:5003/api/approval/approve?token=${encodeURIComponent(createdVisitor.approve_token)}`;
        const approveRes = await httpGet(approveUrl);
        console.log(`Approve Link HTTP Status: ${approveRes.status}`);

        if (approveRes.status !== 200 || !approveRes.body.includes('Visit Approved Successfully')) {
            throw new Error('Approve link HTML response failed!');
        }
        console.log('[OK] Host approval web page returned success confirmation!');

        // Wait 1.5 seconds for background pass generation
        await new Promise(r => setTimeout(r, 1500));

        console.log('\n--- 3. Verifying Database Status Update & Pass Generation ---');
        const getRes = await httpGet(`http://localhost:5003/api/visitors/${vCode}`);
        const updatedVisitor = JSON.parse(getRes.body).data;

        console.log('Updated Visitor Status:', updatedVisitor.status);
        console.log('Approved By:', updatedVisitor.approved_by);
        console.log('Approved At:', updatedVisitor.approved_at);
        console.log('QR Code present:', !!updatedVisitor.qr_code);
        console.log('Pass Image present:', !!updatedVisitor.visitor_pass_image);
        console.log('Pass PDF present:', !!updatedVisitor.visitor_pass_pdf);

        if (updatedVisitor.status !== 'Approved') {
            throw new Error(`Expected status 'Approved', got '${updatedVisitor.status}'`);
        }
        if (!updatedVisitor.qr_code || !updatedVisitor.visitor_pass_image) {
            throw new Error('Visitor pass image or QR code missing from database after approval!');
        }

        console.log('\n--- 4. Testing Anti-Replay Check on Already Approved Link ---');
        const replayRes = await httpGet(approveUrl);
        console.log(`Replay Link HTTP Status: ${replayRes.status}`);
        if (!replayRes.body.includes('Visit Previously Approved')) {
            throw new Error('Anti-replay check failed! Token should be blocked after approval.');
        }
        console.log('[OK] Anti-replay check successfully blocked duplicate approval!');

        console.log('\n--- 5. Testing Rejection Workflow ---');
        const rejCode = `VIS-REJ-${Date.now().toString().slice(-4)}`;
        const regRejRes = await httpPost('http://localhost:5003/api/visitors', {
            visitor_code: rejCode,
            name: 'Rejection Test Visitor',
            phone: '9112233445',
            company: 'Unknown Corp',
            host_name: 'John Connor'
        });

        const rejVisitor = regRejRes.body.data;
        const rejectUrl = `http://localhost:5003/api/approval/reject?token=${encodeURIComponent(rejVisitor.reject_token)}`;
        const rejectRes = await httpGet(rejectUrl);
        console.log(`Reject Link HTTP Status: ${rejectRes.status}`);
        if (rejectRes.status !== 200 || !rejectRes.body.includes('Visit Request Declined')) {
            throw new Error('Rejection link execution failed!');
        }

        const getRejRes = await httpGet(`http://localhost:5003/api/visitors/${rejCode}`);
        const updatedRejVisitor = JSON.parse(getRejRes.body).data;
        console.log('Updated Rejection Status:', updatedRejVisitor.status);
        if (updatedRejVisitor.status !== 'Rejected') {
            throw new Error('Rejection status did not update to Rejected!');
        }
        console.log('[OK] Rejection workflow completed successfully!');

        console.log('\n======================================================');
        console.log('SUCCESS: END-TO-END WORKFLOW VERIFICATION PASSED 100%!');
        console.log('======================================================\n');
        server.close(() => process.exit(0));
    } catch (err) {
        console.error('WORKFLOW TEST FAILED:', err);
        server.close(() => process.exit(1));
    }
});
