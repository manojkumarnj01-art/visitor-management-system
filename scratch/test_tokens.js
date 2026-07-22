const tokenService = require('../backend/services/tokenService');

function runTokenTests() {
    console.log('--- TESTING TOKEN SERVICE ---');
    const visitorCode = 'VIS-TEST-101';
    const hostId = 'EMP-001';

    const tokens = tokenService.generateApprovalTokens(visitorCode, hostId);
    console.log('[Token Gen] Approve Token:', tokens.approveToken.slice(0, 40) + '...');
    console.log('[Token Gen] Reject Token:', tokens.rejectToken.slice(0, 40) + '...');

    // Verify Approve Token
    const appVerify = tokenService.verifyApprovalToken(tokens.approveToken);
    console.log('[Verify Approve Token]', appVerify);
    if (!appVerify.valid || appVerify.payload.action !== 'approve' || appVerify.payload.visitor_code !== visitorCode) {
        throw new Error('Approve token verification failed!');
    }

    // Verify Reject Token
    const rejVerify = tokenService.verifyApprovalToken(tokens.rejectToken);
    console.log('[Verify Reject Token]', rejVerify);
    if (!rejVerify.valid || rejVerify.payload.action !== 'reject' || rejVerify.payload.visitor_code !== visitorCode) {
        throw new Error('Reject token verification failed!');
    }

    // Verify Tampered Token
    const tamperedToken = tokens.approveToken.slice(0, -5) + 'xxxxx';
    const tamperedVerify = tokenService.verifyApprovalToken(tamperedToken);
    console.log('[Verify Tampered Token]', tamperedVerify);
    if (tamperedVerify.valid) {
        throw new Error('Tampered token should not be valid!');
    }

    console.log('SUCCESS: Token service test passed 100%!\n');
}

runTokenTests();
