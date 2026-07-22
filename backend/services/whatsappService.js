const https = require('https');
const http = require('http');

const WA_PROVIDER = process.env.WA_PROVIDER || 'meta'; // 'meta' | 'twilio' | 'logger'
const WA_CLOUD_TOKEN = process.env.WA_CLOUD_TOKEN || process.env.META_WA_TOKEN || '';
const WA_PHONE_NUMBER_ID = process.env.WA_PHONE_NUMBER_ID || process.env.META_WA_PHONE_ID || '';
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || '';
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || '';
const TWILIO_WA_NUMBER = process.env.TWILIO_WA_NUMBER || 'whatsapp:+14155238886';

function formatPhoneNumber(phone) {
    if (!phone) return '';
    let cleaned = phone.replace(/[^\d+]/g, '');
    if (!cleaned.startsWith('+')) {
        // Default to India country code +91 if 10 digits
        if (cleaned.length === 10) cleaned = '91' + cleaned;
    } else {
        cleaned = cleaned.substring(1);
    }
    return cleaned;
}

async function sendMetaWhatsAppMessage(toPhone, textMessage, mediaUrl = null) {
    if (!WA_CLOUD_TOKEN || !WA_PHONE_NUMBER_ID) {
        console.log(`[whatsappService Meta SIMULATED LOG] To: +${toPhone} | Message: ${textMessage.slice(0, 80)}...`);
        return { success: true, simulated: true };
    }

    const payload = mediaUrl ? {
        messaging_product: 'whatsapp',
        to: toPhone,
        type: 'image',
        image: {
            link: mediaUrl,
            caption: textMessage
        }
    } : {
        messaging_product: 'whatsapp',
        to: toPhone,
        type: 'text',
        text: { body: textMessage }
    };

    const postData = JSON.stringify(payload);

    return new Promise((resolve) => {
        const req = https.request({
            hostname: 'graph.facebook.com',
            path: `/v18.0/${WA_PHONE_NUMBER_ID}/messages`,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${WA_CLOUD_TOKEN}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log(`[whatsappService Meta API] Status ${res.statusCode} -> ${data}`);
                resolve({ success: res.statusCode >= 200 && res.statusCode < 300, data });
            });
        });

        req.on('error', (err) => {
            console.error('[whatsappService Meta API ERROR]', err.message);
            resolve({ success: false, error: err.message });
        });

        req.write(postData);
        req.end();
    });
}

async function sendTwilioWhatsAppMessage(toPhone, textMessage, mediaUrl = null) {
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
        console.log(`[whatsappService Twilio SIMULATED LOG] To: whatsapp:+${toPhone} | Message: ${textMessage.slice(0, 80)}...`);
        return { success: true, simulated: true };
    }

    const postParams = new URLSearchParams();
    postParams.append('From', TWILIO_WA_NUMBER.startsWith('whatsapp:') ? TWILIO_WA_NUMBER : `whatsapp:${TWILIO_WA_NUMBER}`);
    postParams.append('To', `whatsapp:+${toPhone}`);
    postParams.append('Body', textMessage);
    if (mediaUrl) postParams.append('MediaUrl', mediaUrl);

    const postData = postParams.toString();
    const authHeader = 'Basic ' + Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');

    return new Promise((resolve) => {
        const req = https.request({
            hostname: 'api.twilio.com',
            path: `/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
            method: 'POST',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData)
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log(`[whatsappService Twilio API] Status ${res.statusCode} -> ${data}`);
                resolve({ success: res.statusCode >= 200 && res.statusCode < 300, data });
            });
        });

        req.on('error', (err) => {
            console.error('[whatsappService Twilio ERROR]', err.message);
            resolve({ success: false, error: err.message });
        });

        req.write(postData);
        req.end();
    });
}

async function sendVisitorPassWhatsApp(visitor, passImageDataUrl = null, passPdfUrl = null) {
    try {
        const phone = formatPhoneNumber(visitor.phone);
        if (!phone) {
            console.warn('[whatsappService] Cannot send WhatsApp: Visitor mobile number missing');
            return { success: false, reason: 'Mobile number missing' };
        }

        const messageText = 
`🎉 *VISIT APPROVED — BARANI HYDRAULICS* 🎉

Dear *${visitor.name}*,

Your visit request to meet *${visitor.host_name || 'Host'}* has been *APPROVED*!

*Visitor Details:*
• *Visitor ID:* ${visitor.visitor_code || visitor.id}
• *Company:* ${visitor.company || 'Individual Guest'}
• *Host:* ${visitor.host_name || 'N/A'} (${visitor.host_dept || ''})
• *Purpose:* ${visitor.purpose || 'Official'}
• *Visit Date:* ${visitor.visit_date ? new Date(visitor.visit_date).toLocaleDateString() : new Date().toLocaleDateString()}

*Visitor Instructions:*
1. Present your QR Visitor Pass at Security Check-in.
2. Wear your pass visibly at all times.
3. Escort required in operational areas.

Welcome to Barani Hydraulics!`;

        if (WA_PROVIDER === 'twilio') {
            return await sendTwilioWhatsAppMessage(phone, messageText, passPdfUrl);
        } else {
            return await sendMetaWhatsAppMessage(phone, messageText, passPdfUrl);
        }
    } catch (err) {
        console.error('[whatsappService ERROR] sendVisitorPassWhatsApp failed:', err.message);
        return { success: false, error: err.message };
    }
}

module.exports = {
    sendVisitorPassWhatsApp,
    sendMetaWhatsAppMessage,
    sendTwilioWhatsAppMessage
};
