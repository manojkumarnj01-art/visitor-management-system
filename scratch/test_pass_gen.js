const passGeneratorService = require('../backend/services/passGeneratorService');

async function runPassGenTest() {
    console.log('--- TESTING VISITOR PASS GENERATOR SERVICE ---');
    const mockVisitor = {
        id: 'VIS-PASS-999',
        visitor_code: 'VIS-PASS-999',
        name: 'Alex Johnson',
        company: 'Apex Industrial Solutions',
        phone: '9876543210',
        email: 'alex.johnson@apex.com',
        purpose: 'Technical Discussion & Audit',
        host_name: 'Dr. R. Sundaram',
        host_dept: 'Engineering & R&D',
        visit_date: new Date(),
        status: 'Approved'
    };

    console.log('[1/3] Testing QR Code generation...');
    const qrUrl = await passGeneratorService.generateQrCodeDataUrl(mockVisitor);
    console.log('QR Code generated length:', qrUrl ? qrUrl.length : 0);
    if (!qrUrl || !qrUrl.startsWith('data:image/png;base64,')) {
        throw new Error('QR Code generation failed!');
    }

    console.log('[2/3] Testing PDF Pass Buffer generation...');
    const pdfBuffer = await passGeneratorService.generateVisitorPassPdfBuffer(mockVisitor);
    console.log('PDF Pass buffer size bytes:', pdfBuffer ? pdfBuffer.length : 0);
    if (!pdfBuffer || pdfBuffer.length < 1000) {
        throw new Error('PDF Pass generation failed!');
    }

    console.log('[3/3] Testing PNG Canvas Pass Image Data URL generation...');
    const imgDataUrl = await passGeneratorService.generateVisitorPassImageDataUrl(mockVisitor);
    console.log('PNG Pass Data URL length:', imgDataUrl ? imgDataUrl.length : 0);
    if (!imgDataUrl || !imgDataUrl.startsWith('data:image/png;base64,')) {
        throw new Error('PNG Pass Image generation failed!');
    }

    console.log('SUCCESS: All Pass Generator Service tests passed 100%!\n');
}

runPassGenTest().catch(err => {
    console.error('Pass Gen Test Error:', err);
    process.exit(1);
});
