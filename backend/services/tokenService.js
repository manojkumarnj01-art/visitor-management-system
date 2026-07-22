const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'barani-vms-secret-key-2026-secure-approval-token';
const TOKEN_EXPIRE_HOURS = parseInt(process.env.TOKEN_EXPIRE_HOURS || '24', 10);

function generateApprovalTokens(visitorCode, hostId) {
    const expireTime = Math.floor(Date.now() / 1000) + (TOKEN_EXPIRE_HOURS * 3600);
    
    const approvePayload = {
        visitor_code: visitorCode,
        host_id: hostId,
        action: 'approve',
        exp: expireTime
    };

    const rejectPayload = {
        visitor_code: visitorCode,
        host_id: hostId,
        action: 'reject',
        exp: expireTime
    };

    let approveToken, rejectToken;
    try {
        approveToken = jwt.sign(approvePayload, JWT_SECRET);
        rejectToken = jwt.sign(rejectPayload, JWT_SECRET);
    } catch (e) {
        // Crypto fallback signature
        const appStr = JSON.stringify(approvePayload);
        const rejStr = JSON.stringify(rejectPayload);
        const appSig = crypto.createHmac('sha256', JWT_SECRET).update(appStr).digest('hex');
        const rejSig = crypto.createHmac('sha256', JWT_SECRET).update(rejStr).digest('hex');
        approveToken = Buffer.from(appStr).toString('base64url') + '.' + appSig;
        rejectToken = Buffer.from(rejStr).toString('base64url') + '.' + rejSig;
    }

    return { approveToken, rejectToken, expiresAt: new Date(expireTime * 1000) };
}

function verifyApprovalToken(token) {
    if (!token) {
        return { valid: false, message: 'Token missing' };
    }

    try {
        // Try jwt verify
        const decoded = jwt.verify(token, JWT_SECRET);
        return { valid: true, payload: decoded };
    } catch (err) {
        // Try fallback verify
        try {
            const parts = token.split('.');
            if (parts.length === 2) {
                const payloadStr = Buffer.from(parts[0], 'base64url').toString('utf8');
                const sig = parts[1];
                const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(payloadStr).digest('hex');
                if (sig === expectedSig) {
                    const payload = JSON.parse(payloadStr);
                    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) {
                        return { valid: false, message: 'Approval link has expired' };
                    }
                    return { valid: true, payload };
                }
            }
        } catch (e2) {}

        if (err.name === 'TokenExpiredError') {
            return { valid: false, message: 'Approval link has expired' };
        }
        return { valid: false, message: 'Invalid token signature' };
    }
}

module.exports = {
    generateApprovalTokens,
    verifyApprovalToken
};
