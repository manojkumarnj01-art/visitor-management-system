const QRCode = require('qrcode');
const PDFDocument = require('pdfkit');
const { createCanvas } = require('canvas');

async function generateQrCodeDataUrl(data) {
    try {
        const text = typeof data === 'object' ? JSON.stringify(data) : String(data);
        return await QRCode.toDataURL(text, {
            errorCorrectionLevel: 'M',
            margin: 2,
            scale: 6,
            color: {
                dark: '#000000',
                light: '#ffffff'
            }
        });
    } catch (err) {
        console.error('[passGeneratorService] generateQrCodeDataUrl error:', err);
        return null;
    }
}

async function generateVisitorPassPdfBuffer(visitor) {
    return new Promise(async (resolve, reject) => {
        try {
            const doc = new PDFDocument({ size: 'A4', margin: 40 });
            const buffers = [];

            doc.on('data', chunk => buffers.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(buffers)));
            doc.on('error', err => reject(err));

            // Primary Pass Frame
            doc.rect(40, 40, 515, 680).lineWidth(2).strokeColor('#1e3a8a').stroke();

            // Header Background Banner
            doc.rect(42, 42, 511, 75).fill('#1e3a8a');

            // Header Text
            doc.fillColor('#ffffff')
               .fontSize(22)
               .font('Helvetica-Bold')
               .text('BARANI HYDRAULICS', 55, 58, { align: 'center' });
            
            doc.fontSize(12)
               .font('Helvetica')
               .text('CORPORATE VISITOR PASS', 55, 88, { align: 'center', letterSpacing: 2 });

            // Sub-bar
            doc.rect(42, 117, 511, 25).fill('#3b82f6');
            doc.fillColor('#ffffff')
               .fontSize(11)
               .font('Helvetica-Bold')
               .text(`VISITOR ID: ${visitor.visitor_code || visitor.id || 'VMS-PASS'}`, 55, 124, { align: 'center' });

            let y = 160;

            // Visitor Photo Handling
            if (visitor.photo && visitor.photo.startsWith('data:image')) {
                try {
                    const imgData = visitor.photo.split(',')[1];
                    const imgBuffer = Buffer.from(imgData, 'base64');
                    doc.image(imgBuffer, 60, y, { fit: [120, 140], align: 'center', valig: 'center' });
                } catch (e) {
                    doc.rect(60, y, 120, 140).lineWidth(1).strokeColor('#cccccc').stroke();
                    doc.fillColor('#999999').fontSize(10).text('PHOTO', 95, y + 60);
                }
            } else {
                doc.rect(60, y, 120, 140).lineWidth(1).strokeColor('#cbd5e1').stroke();
                doc.fillColor('#64748b').fontSize(10).text('NO PHOTO', 90, y + 60);
            }

            // QR Code Generation & Placement
            const qrPayload = {
                vcode: visitor.visitor_code || visitor.id,
                name: visitor.name,
                host: visitor.host_name,
                status: visitor.status || 'Approved'
            };
            const qrDataUrl = await generateQrCodeDataUrl(qrPayload);
            if (qrDataUrl) {
                const qrBuffer = Buffer.from(qrDataUrl.split(',')[1], 'base64');
                doc.image(qrBuffer, 410, y, { fit: [120, 120] });
            }

            // Visitor Details Grid
            const labelX = 200;
            const valX = 290;
            let fieldY = y;

            const fields = [
                { label: 'Visitor Name:', value: visitor.name || 'N/A', bold: true },
                { label: 'Company Name:', value: visitor.company || 'Individual / Guest' },
                { label: 'Mobile Number:', value: visitor.phone || 'N/A' },
                { label: 'Host Name:', value: visitor.host_name || 'N/A', bold: true },
                { label: 'Department:', value: visitor.host_dept || 'N/A' },
                { label: 'Purpose of Visit:', value: visitor.purpose || 'Official Meeting' },
                { label: 'Visit Date:', value: visitor.visit_date ? new Date(visitor.visit_date).toLocaleDateString() : new Date().toLocaleDateString() },
                { label: 'Valid Until:', value: visitor.valid_until ? new Date(visitor.valid_until).toLocaleString() : 'End of Business Day' }
            ];

            fields.forEach(f => {
                doc.fillColor('#475569').fontSize(10).font('Helvetica-Bold').text(f.label, labelX, fieldY);
                doc.fillColor('#0f172a').fontSize(11).font(f.bold ? 'Helvetica-Bold' : 'Helvetica').text(f.value, valX, fieldY);
                fieldY += 22;
            });

            // Status Seal
            doc.rect(40, 360, 515, 35).fill('#ecfdf5');
            doc.fillColor('#047857')
               .fontSize(13)
               .font('Helvetica-Bold')
               .text('STATUS: AUTHORIZED & APPROVED', 55, 372, { align: 'center' });

            // Instructions Footer
            doc.fillColor('#334155').fontSize(10).font('Helvetica-Bold').text('VISITOR INSTRUCTIONS & SECURITY PROTOCOLS:', 60, 415);
            
            const instructions = [
                '1. Wear this visitor pass visibly on your attire at all times while inside company premises.',
                '2. Visitors must be escorted by their host employee while moving through operational units.',
                '3. Photography and unauthorized audio/video recording are strictly prohibited.',
                '4. Scan this pass at the security exit gate during check-out.'
            ];

            let instY = 435;
            instructions.forEach(inst => {
                doc.fillColor('#64748b').fontSize(9).font('Helvetica').text(inst, 60, instY);
                instY += 16;
            });

            // Signatures block
            doc.lineCap('butt').moveTo(70, 680).lineTo(200, 680).strokeColor('#cbd5e1').stroke();
            doc.fillColor('#64748b').fontSize(9).text('Visitor Signature', 100, 685);

            doc.lineCap('butt').moveTo(385, 680).lineTo(515, 680).strokeColor('#cbd5e1').stroke();
            doc.fillColor('#64748b').fontSize(9).text('Security Authorized Sign', 395, 685);

            doc.end();
        } catch (err) {
            reject(err);
        }
    });
}

async function generateVisitorPassImageDataUrl(visitor) {
    try {
        const width = 600;
        const height = 800;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        // Outer Border
        ctx.strokeStyle = '#1e3a8a';
        ctx.lineWidth = 6;
        ctx.strokeRect(10, 10, width - 20, height - 20);

        // Header
        ctx.fillStyle = '#1e3a8a';
        ctx.fillRect(13, 13, width - 26, 90);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 26px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('BARANI HYDRAULICS', width / 2, 55);

        ctx.font = '16px sans-serif';
        ctx.fillText('CORPORATE VISITOR PASS', width / 2, 85);

        // ID Banner
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(13, 103, width - 26, 35);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText(`VISITOR ID: ${visitor.visitor_code || visitor.id || 'PASS'}`, width / 2, 126);

        // Details Section
        ctx.textAlign = 'left';
        ctx.fillStyle = '#1e293b';

        let y = 180;
        const drawField = (label, val, isBold = false) => {
            ctx.font = 'bold 14px sans-serif';
            ctx.fillStyle = '#64748b';
            ctx.fillText(label, 40, y);

            ctx.font = isBold ? 'bold 15px sans-serif' : '15px sans-serif';
            ctx.fillStyle = '#0f172a';
            ctx.fillText(String(val), 200, y);
            y += 30;
        };

        drawField('Visitor Name:', visitor.name || 'N/A', true);
        drawField('Company:', visitor.company || 'Individual Guest');
        drawField('Mobile:', visitor.phone || 'N/A');
        drawField('Host Name:', visitor.host_name || 'N/A', true);
        drawField('Department:', visitor.host_dept || 'N/A');
        drawField('Purpose:', visitor.purpose || 'Official Visit');
        drawField('Visit Date:', visitor.visit_date ? new Date(visitor.visit_date).toLocaleDateString() : new Date().toLocaleDateString());
        drawField('Valid Until:', visitor.valid_until ? new Date(visitor.valid_until).toLocaleString() : 'End of Business Day');

        // Status Badge
        ctx.fillStyle = '#16a34a';
        ctx.fillRect(40, y + 10, width - 80, 45);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('STATUS: AUTHORIZED & APPROVED', width / 2, y + 38);

        // QR Code
        const qrPayload = {
            vcode: visitor.visitor_code || visitor.id,
            name: visitor.name,
            host: visitor.host_name,
            status: visitor.status || 'Approved'
        };
        const qrDataUrl = await generateQrCodeDataUrl(qrPayload);
        if (qrDataUrl) {
            const { Image } = require('canvas');
            const img = new Image();
            img.src = qrDataUrl;
            ctx.drawImage(img, width / 2 - 75, y + 75, 150, 150);
        }

        // Instructions Footer
        ctx.fillStyle = '#64748b';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Please present this pass at Security Check-in & Exit Gates.', width / 2, height - 30);

        return canvas.toDataURL('image/png');
    } catch (err) {
        console.error('[passGeneratorService] generateVisitorPassImageDataUrl error:', err);
        return null;
    }
}

module.exports = {
    generateQrCodeDataUrl,
    generateVisitorPassPdfBuffer,
    generateVisitorPassImageDataUrl
};
