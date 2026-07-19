const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'index.html');

// Read file
let content = fs.readFileSync(filePath, 'utf8');
const origLength = content.length;

console.log(`Loaded index.html: ${origLength} chars, ${Buffer.byteLength(content, 'utf8')} bytes`);

// ============================================================
// REPLACEMENT MAP
// Each entry: [corrupted_pattern, correct_replacement]
// We identify corrupted sequences by their context in the HTML
// ============================================================

// Strategy: Since the corrupted strings themselves get mangled,
// we'll use regex to find lines with known surrounding context
// and replace the corrupted emoji/chars with correct HTML entities.

const lineReplacements = [];

// Helper: replace content within a specific context
function contextReplace(contextBefore, contextAfter, replacement) {
    // Match anything between contextBefore and contextAfter
    const escapedBefore = contextBefore.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const escapedAfter = contextAfter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedBefore + '[^<"]*?' + escapedAfter, 'g');
    const newStr = contextBefore + replacement + contextAfter;
    const before = content;
    content = content.replace(regex, newStr);
    if (content !== before) {
        console.log(`  Fixed: ${contextBefore}...${contextAfter}`);
    }
}

// ============================================================
// FIX PASSWORD PLACEHOLDER (bullets)
// ============================================================
// Password field placeholder should be bullet dots
content = content.replace(
    /placeholder="[^"]*"\s*\n\s*required autocomplete="current-password"/g,
    'placeholder="••••••••" required autocomplete="current-password"'
);
console.log('Fixed: password placeholder');

// ============================================================
// FIX TAMIL TEXT
// ============================================================
// Header language selector
content = content.replace(
    /<option value="ta">[^<]*<\/option>/g,
    (match, offset) => {
        // Check if it's already correct Tamil
        if (match.includes('\u0BA4\u0BAE\u0BBF\u0BB4\u0BCD')) return match;
        return '<option value="ta">\u0BA4\u0BAE\u0BBF\u0BB4\u0BCD</option>';
    }
);
console.log('Fixed: Tamil text');

// ============================================================
// FIX SUMMARY BAR ICONS (top stats)
// ============================================================
// Checked Out icon
content = content.replace(
    /<span class="summary-icon">[^<]*<\/span>\s*\n\s*<div class="summary-details">\s*\n\s*<span class="summary-label">Checked Out/g,
    '<span class="summary-icon">&#x1F4E4;</span>\n                    <div class="summary-details">\n                        <span class="summary-label">Checked Out'
);
// Also fix the dashboard duplicate stats
content = content.replace(
    /<span class="summary-icon" style="font-size: 1\.75rem;">[^<]*<\/span>\s*\n\s*<div class="summary-details">\s*\n\s*<span class="summary-label"\s*\n?\s*style="[^"]*">Checked\s*\n?\s*Out/g,
    '<span class="summary-icon" style="font-size: 1.75rem;">&#x1F4E4;</span>\n                                        <div class="summary-details">\n                                            <span class="summary-label"\n                                                style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 600; display: block;">Checked\n                                                Out'
);
console.log('Fixed: Checked Out icons');

// Visitors Today icon
content = content.replace(
    /<span class="summary-icon">[^<]*<\/span>\s*\n\s*<div class="summary-details">\s*\n\s*<span class="summary-label">Visitors Today/g,
    '<span class="summary-icon">&#x1F4C5;</span>\n                    <div class="summary-details">\n                        <span class="summary-label">Visitors Today'
);
content = content.replace(
    /<span class="summary-icon" style="font-size: 1\.75rem;">[^<]*<\/span>\s*\n\s*<div class="summary-details">\s*\n\s*<span class="summary-label"\s*\n?\s*style="[^"]*">Visitors\s*\n?\s*Today/g,
    '<span class="summary-icon" style="font-size: 1.75rem;">&#x1F4C5;</span>\n                                        <div class="summary-details">\n                                            <span class="summary-label"\n                                                style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 600; display: block;">Visitors\n                                                Today'
);
console.log('Fixed: Visitors Today icons');

// Currently In Campus icon
content = content.replace(
    /<span class="summary-icon">[^<]*<\/span>\s*\n\s*<div class="summary-details">\s*\n\s*<span class="summary-label">Currently In Campus/g,
    '<span class="summary-icon">&#x1F3E2;</span>\n                    <div class="summary-details">\n                        <span class="summary-label">Currently In Campus'
);
content = content.replace(
    /<span class="summary-icon" style="font-size: 1\.75rem;">[^<]*<\/span>\s*\n\s*<div class="summary-details">\s*\n\s*<span class="summary-label"\s*\n?\s*style="[^"]*">Currently\s*\n?\s*In Campus/g,
    '<span class="summary-icon" style="font-size: 1.75rem;">&#x1F3E2;</span>\n                                        <div class="summary-details">\n                                            <span class="summary-label"\n                                                style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 600; display: block;">Currently\n                                                In Campus'
);
console.log('Fixed: Currently In Campus icons');

// ============================================================
// FIX DASHBOARD CARD ICONS
// ============================================================
// Student card icon
content = content.replace(
    /card-icon-wrapper" style="margin-bottom: 1rem;">[^<]*\s*<\/div>\s*\n\s*<h3 class="card-title" style="margin-bottom: 0\.5rem;">Student Registration/g,
    'card-icon-wrapper" style="margin-bottom: 1rem;">&#x1F393;</div>\n                                        <h3 class="card-title" style="margin-bottom: 0.5rem;">Student Registration'
);
// Customer card icon
content = content.replace(
    /card-icon-wrapper" style="margin-bottom: 1rem;">[^<]*\s*<\/div>\s*\n\s*<h3 class="card-title" style="margin-bottom: 0\.5rem;">Customer Registration/g,
    'card-icon-wrapper" style="margin-bottom: 1rem;">&#x1F3E2;</div>\n                                        <h3 class="card-title" style="margin-bottom: 0.5rem;">Customer Registration'
);
// Vendor card icon
content = content.replace(
    /card-icon-wrapper" style="margin-bottom: 1rem;">[^<]*\s*<\/div>\s*\n\s*<h3 class="card-title" style="margin-bottom: 0\.5rem;">Vendor Registration/g,
    'card-icon-wrapper" style="margin-bottom: 1rem;">&#x1F69A;</div>\n                                        <h3 class="card-title" style="margin-bottom: 0.5rem;">Vendor Registration'
);
// Check-Out card icon
content = content.replace(
    /card-icon-wrapper" style="margin-bottom: 1rem;">[^<]*\s*<\/div>\s*\n\s*<h3 class="card-title" style="margin-bottom: 0\.5rem;">Check-Out/g,
    'card-icon-wrapper" style="margin-bottom: 1rem;">&#x1F6AA;</div>\n                                        <h3 class="card-title" style="margin-bottom: 0.5rem;">Check-Out'
);
console.log('Fixed: Dashboard card icons');

// ============================================================
// FIX SECTION HEADERS (h2 titles)
// ============================================================
// Pending Host Approvals
content = content.replace(
    /<h2 style="font-size: 1\.4rem; font-weight: 800; color: var\(--accent-primary\); margin: 0;">\s*\n?\s*[^P]*Pending Host Approvals Queue/g,
    '<h2 style="font-size: 1.4rem; font-weight: 800; color: var(--accent-primary); margin: 0;">&#x23F3;\n                                Pending Host Approvals Queue'
);

// Customer Registration header
content = content.replace(
    /<h2>[^<]*Customer Registration<\/h2>/g,
    '<h2>&#x1F3E2; Customer Registration</h2>'
);

// Vendor Registration header  
content = content.replace(
    /<h2>[^<]*Vendor Registration<\/h2>/g,
    (match) => {
        if (match.includes('&#x1F69A;')) return match;
        return '<h2>&#x1F69A; Vendor Registration</h2>';
    }
);

// Check-Out header
content = content.replace(
    /<h2>[^<]*Enter Visitor ID \/ Mobile or Scan QR<\/h2>/g,
    '<h2>&#x1F6AA; Enter Visitor ID / Mobile or Scan QR</h2>'
);

// Contractor Registration header
content = content.replace(
    /<h2>[^<]*Contractor Registration Form<\/h2>/g,
    '<h2>&#x1F477; Contractor Registration Form</h2>'
);

// Delivery Registration header
content = content.replace(
    /<h2>[^<]*Delivery Registration Form<\/h2>/g,
    '<h2>&#x1F4E6; Delivery Registration Form</h2>'
);

// Service Engineer Registration header
content = content.replace(
    /<h2>[^<]*Service Engineer Registration Form<\/h2>/g,
    '<h2>&#x1F6E0; Service Engineer Registration Form</h2>'
);

// Visitor Reports Module header
content = content.replace(
    /<h2>[^<]*Visitor Reports Module<\/h2>/g,
    '<h2>&#x1F4CA; Visitor Reports Module</h2>'
);

// Enterprise Data Management Console header
content = content.replace(
    /<h2>[^<]*Enterprise Data Management Console<\/h2>/g,
    '<h2>&#x1F5C2; Enterprise Data Management Console</h2>'
);

// Security Alarm header
content = content.replace(
    /<h3>[^<]*SECURITY ALARM: FLAG DETECTED<\/h3>/g,
    '<h3>&#x1F6A8; SECURITY ALARM: FLAG DETECTED</h3>'
);
console.log('Fixed: Section headers');

// ============================================================
// FIX BACK TO DASHBOARD BUTTONS
// ============================================================
content = content.replace(
    />[^<]*Back to Dashboard<\/button>/g,
    (match) => {
        if (match.includes('&#x2190;')) return match;
        return '>&#x2190; Back to Dashboard</button>';
    }
);
console.log('Fixed: Back to Dashboard buttons');

// ============================================================
// FIX SELECT DROPDOWNS (em dash — Select Purpose/Agency —)
// ============================================================
content = content.replace(
    /<option value="">[^<]*Select Purpose\s*\n?\s*[^<]*<\/option>/g,
    '<option value="">&#x2014; Select Purpose &#x2014;</option>'
);
content = content.replace(
    /<option value="">[^<]*Select Agency[^<]*\s*\n?\s*<\/option>/g,
    '<option value="">&#x2014; Select Agency &#x2014;</option>'
);
// Vendor purpose select
content = content.replace(
    /\u00e2\u0080\u0094 Select Purpose \u00e2\u0080\u0094/g,
    '&#x2014; Select Purpose &#x2014;'
);
console.log('Fixed: Select dropdowns');

// ============================================================
// FIX CLOSE MODAL BUTTONS (✕)
// ============================================================
content = content.replace(
    /class="btn-close-modal">[^<]*<\/button>/g,
    (match) => {
        if (match.includes('&#x2715;') || match.includes('\u2715') || match.includes('✕')) return match;
        return 'class="btn-close-modal">&#x2715;</button>';
    }
);
content = content.replace(
    /class="btn-close-modal" style="color: #fff;">[^<]*<\/button>/g,
    'class="btn-close-modal" style="color: #fff;">&#x2715;</button>'
);
// Host sim bubble close
content = content.replace(
    /style="background: none; border: none; color: #fff; cursor: pointer; font-size: 1rem;">[^<]*<\/button>/g,
    'style="background: none; border: none; color: #fff; cursor: pointer; font-size: 1rem;">&#x2715;</button>'
);
// Chatbot close
content = content.replace(
    /style="background:none; border:none; color:#fff; font-size:1rem; cursor:pointer;">[^<]*<\/button>/g,
    'style="background:none; border:none; color:#fff; font-size:1rem; cursor:pointer;">&#x2715;</button>'
);
console.log('Fixed: Close modal buttons');

// ============================================================
// FIX PHOTO BUTTONS (✅ Use Existing / 📷 Capture New)
// ============================================================
content = content.replace(
    /id="btn-existing-photo-student">[^<]*Photo<\/button>/g,
    'id="btn-existing-photo-student">&#x2705; Use Existing Photo</button>'
);
content = content.replace(
    /id="btn-new-photo-student">[^<]*Photo<\/button>/g,
    'id="btn-new-photo-student">&#x1F4F7; Capture New Photo</button>'
);
content = content.replace(
    /id="btn-existing-photo-customer">[^<]*Photo<\/button>/g,
    'id="btn-existing-photo-customer">&#x2705; Use Existing Photo</button>'
);
content = content.replace(
    /id="btn-new-photo-customer">[^<]*Photo<\/button>/g,
    'id="btn-new-photo-customer">&#x1F4F7; Capture New Photo</button>'
);
content = content.replace(
    /id="btn-existing-photo-vendor">[^<]*Photo<\/button>/g,
    'id="btn-existing-photo-vendor">&#x2705; Use Existing Photo</button>'
);
content = content.replace(
    /id="btn-new-photo-vendor">[^<]*Photo<\/button>/g,
    'id="btn-new-photo-vendor">&#x1F4F7; Capture New Photo</button>'
);
console.log('Fixed: Photo buttons');

// ============================================================
// FIX SORT ARROWS IN REPORTS TABLE (⇅)
// ============================================================
content = content.replace(
    /onclick="sortReports\('id'\)">\s*\n?\s*Visitor ID [^<]*/g,
    'onclick="sortReports(\'id\')">\n                                            Visitor ID &#x21C5;'
);
content = content.replace(
    /onclick="sortReports\('name'\)">\s*\n?\s*Name [^<]*/g,
    'onclick="sortReports(\'name\')">\n                                            Name &#x21C5;'
);
content = content.replace(
    /onclick="sortReports\('phone'\)">\s*\n?\s*Mobile [^<]*/g,
    'onclick="sortReports(\'phone\')">\n                                            Mobile &#x21C5;'
);
content = content.replace(
    /onclick="sortReports\('visitorCategory'\)">Type [^<]*/g,
    'onclick="sortReports(\'visitorCategory\')">Type &#x21C5;'
);
content = content.replace(
    /onclick="sortReports\('hostName'\)">Host Employee [^<]*/g,
    'onclick="sortReports(\'hostName\')">Host Employee &#x21C5;'
);
content = content.replace(
    /onclick="sortReports\('checkIn'\)">[^<]*Check-In [^<]*/g,
    'onclick="sortReports(\'checkIn\')">\n                                            Check-In &#x21C5;'
);
content = content.replace(
    /onclick="sortReports\('checkOut'\)">[^<]*Check-Out [^<]*/g,
    'onclick="sortReports(\'checkOut\')">\n                                            Check-Out &#x21C5;'
);
content = content.replace(
    /onclick="sortReports\('status'\)">[^<]*Status [^<]*/g,
    'onclick="sortReports(\'status\')">\n                                            Status &#x21C5;'
);
content = content.replace(
    /onclick="sortReports\('visitDate'\)">[^<]*Visit Date [^<]*/g,
    'onclick="sortReports(\'visitDate\')">\n                                            Visit Date &#x21C5;'
);
console.log('Fixed: Sort arrows');

// ============================================================
// FIX RECENTLY REGISTERED HEADERS
// ============================================================
content = content.replace(
    />[^<]*Recently Registered Students<\/h2>/g,
    '>&#x1F4CB; Recently Registered Students</h2>'
);
content = content.replace(
    />[^<]*Recently Registered Customers<\/h2>/g,
    '>&#x1F4CB; Recently Registered Customers</h2>'
);
content = content.replace(
    />[^<]*Recently Registered Vendors<\/h2>/g,
    '>&#x1F4CB; Recently Registered Vendors</h2>'
);
console.log('Fixed: Recently Registered headers');

// ============================================================
// FIX REFRESH BUTTONS IN LIVE TABLES
// ============================================================
content = content.replace(
    /title="Refresh Table">[^<]*Refresh<\/button>/g,
    'title="Refresh Table">&#x1F504; Refresh</button>'
);
console.log('Fixed: Refresh buttons');

// ============================================================
// FIX MATCHING EXISTING VISITORS/CUSTOMERS/VENDORS
// ============================================================
content = content.replace(
    />[^<]*Matching Existing Students<\/h3>/g,
    '>&#x1F50D; Matching Existing Students</h3>'
);
content = content.replace(
    />[^<]*Matching Existing Customers<\/h3>/g,
    '>&#x1F50D; Matching Existing Customers</h3>'
);
content = content.replace(
    />[^<]*Matching Existing Vendors<\/h3>/g,
    '>&#x1F50D; Matching Existing Vendors</h3>'
);
console.log('Fixed: Matching Existing headers');

// ============================================================
// FIX WHATSAPP ASSIST MODAL
// ============================================================
// Visitor name placeholder
content = content.replace(
    /id="wa-assist-visitor-name">[^<]*\s*\n?\s*<\/div>/g,
    'id="wa-assist-visitor-name">&#x2014;</div>'
);
// Phone placeholder
content = content.replace(
    /id="wa-assist-phone">[^<]*<\/span>/g,
    'id="wa-assist-phone">&#x2014;</span>'
);
// Pass ID placeholder
content = content.replace(
    /id="wa-assist-pass-id">[^<]*<\/span>/g,
    'id="wa-assist-pass-id">&#x2014;</span>'
);
console.log('Fixed: WhatsApp assist placeholders');

// ============================================================
// FIX WHATSAPP INSTRUCTION TEXT (em dashes)
// ============================================================
// "below — your" pattern
content = content.replace(
    />"Share via WhatsApp"<\/strong> below\s*\n?\s*[^\s]* your/g,
    '>"Share via WhatsApp"</strong> below &#x2014; your'
);
// "share sheet — the pass" pattern
content = content.replace(
    /from the share sheet\s*\n?\s*[^\s]*\s*\n?\s*the pass image and message will be sent directly\. [^<]*/g,
    'from the share sheet &#x2014;\n                                the pass image and message will be sent directly. &#x2705;'
);
// "below — the visitor pass"
content = content.replace(
    />"Copy Pass Image"<\/strong> below\s*\n?\s*[^\s]* the/g,
    '>"Copy Pass Image"</strong> below &#x2014; the'
);
// "Open WhatsApp Web" — the visitor's
content = content.replace(
    />"Open WhatsApp Web"<\/strong>\s*\n?\s*[^\s]* the visitor's/g,
    '>"Open WhatsApp Web"</strong> &#x2014; the visitor\'s'
);
// Ctrl+V ... Send. ✅
content = content.replace(
    /then <strong>Send<\/strong>\.\s*\n?\s*[^<]*<\/span>/g,
    'then <strong>Send</strong>. &#x2705;</span>'
);
console.log('Fixed: WhatsApp instruction text');

// ============================================================
// FIX "Open WhatsApp Web ↗" BUTTON
// ============================================================
content = content.replace(
    /Open WhatsApp Web [^<]*\n\s*<\/button>/g,
    'Open WhatsApp Web &#x2197;\n                </button>'
);
console.log('Fixed: Open WhatsApp Web button');

// ============================================================
// FIX WARNING ICON (⚠️)
// ============================================================
content = content.replace(
    /animation: alarmPulse[^"]*">\s*\n?\s*[^<]*\s*\n?\s*<\/div>/g,
    (match) => {
        if (match.includes('&#x26A0;')) return match;
        return match.replace(/>\s*\n?\s*[^<]*\s*\n?\s*<\/div>/, '>&#x26A0;&#xFE0F;</div>');
    }
);
// Inactivity Warning
content = content.replace(
    />[^<]*Inactivity Warning/g,
    (match) => {
        if (match.includes('&#x26A0;')) return match;
        return '>\n                    &#x26A0;&#xFE0F; Inactivity Warning';
    }
);
console.log('Fixed: Warning icons');

// ============================================================
// FIX ROBOT ICON (🤖)
// ============================================================
content = content.replace(
    /display: flex; align-items: center; justify-content: center;">\s*\n?\s*[^<]*<\/div>\s*\n\s*<div>\s*\n\s*<strong[^>]*>GateKeeper/g,
    (match) => {
        return match.replace(/center;">\s*\n?\s*[^<]*<\/div>/, 'center;">&#x1F916;</div>');
    }
);
console.log('Fixed: Robot icon');

// ============================================================
// FIX PASSWORD TOKEN PLACEHOLDER (dots)
// ============================================================
content = content.replace(
    /id="cfg-wa-token"\s*\n?\s*value="[^"]*"/g,
    'id="cfg-wa-token"\n                                        value="••••••••••••••••••••••••••••"'
);
console.log('Fixed: WhatsApp token placeholder');

// ============================================================
// FIX NO CONTRACT EN DASH
// ============================================================
content = content.replace(
    />No contract [^<]* One time work<\/label>/g,
    '>No contract &#x2013; One time work</label>'
);
console.log('Fixed: No contract en dash');

// ============================================================
// WRITE FILE
// ============================================================
fs.writeFileSync(filePath, content, 'utf8');
console.log(`\nFile saved. ${origLength} -> ${content.length} chars`);

// ============================================================
// VERIFY
// ============================================================
const verify = fs.readFileSync(filePath, 'utf8');
// Check for common corruption patterns
const patterns = [
    /\u00C3\u0083/g,     // Ã followed by Ã
    /\u00C3\u0085/g,     // Ã followed by Å
    /\u00C3\u0082/g,     // Ã followed by Â
    /\u00C3\u00A2/g,     // Ã¢
];

let totalCorrupt = 0;
const lines = verify.split('\n');
for (let i = 0; i < lines.length; i++) {
    for (const p of patterns) {
        if (p.test(lines[i])) {
            totalCorrupt++;
            console.log(`  Still corrupted line ${i + 1}: ${lines[i].trim().substring(0, 100)}`);
            break;
        }
    }
}

if (totalCorrupt === 0) {
    console.log('\n✅ SUCCESS: No corrupted UTF-8 text remaining!');
} else {
    console.log(`\n⚠️ WARNING: ${totalCorrupt} lines still have corrupted text`);
}
