/* ==========================================================================
   GATEKEEPER WEB APP LOGIC (LOCALSTORAGE PERSISTED WORKFLOW)
   ========================================================================== */

// 1. Core Mock Data Seed & Storage Configuration

function getLocalDateStr() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
const DEFAULT_EMPLOYEES = [
    { id: "EMP101", name: "Manoj Kumar", dept: "IT", designation: "Lead IT Architect", email: "mkumar@acme.corp", phone: "+91 98765 01101", cabin: "Floor 2 Cabin IT-A", status: "In Office", campusStatus: "Outside", photo: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%233b82f6'/><path d='M30 75c0-10 10-15 20-15s20 5 20 15' stroke='white' stroke-width='4' fill='none'/><circle cx='50' cy='40' r='12' fill='white'/></svg>" },
    { id: "EMP102", name: "Sarah Jenkins", dept: "Engineering", designation: "Senior Tech Lead", email: "sjenkins@acme.corp", phone: "+91 98765 01102", cabin: "Floor 1 Cabin ENG-4", status: "In Office", campusStatus: "Outside", photo: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23ec4899'/><path d='M30 75c0-10 10-15 20-15s20 5 20 15' stroke='white' stroke-width='4' fill='none'/><circle cx='50' cy='40' r='12' fill='white'/></svg>" },
    { id: "EMP103", name: "Michael Chang", dept: "Engineering", designation: "Principal Architect", email: "mchang@acme.corp", phone: "+91 98765 01103", cabin: "Floor 1 Cabin ENG-9", status: "In Meeting", campusStatus: "Inside", photo: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%2310b981'/><path d='M30 75c0-10 10-15 20-15s20 5 20 15' stroke='white' stroke-width='4' fill='none'/><circle cx='50' cy='40' r='12' fill='white'/></svg>" },
    { id: "EMP104", name: "David Miller", dept: "HR & Recruitment", designation: "HR Executive Manager", email: "dmiller@acme.corp", phone: "+91 98765 01104", cabin: "Floor 3 Cabin HR-2", status: "In Office", campusStatus: "Outside", photo: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23f59e0b'/><path d='M30 75c0-10 10-15 20-15s20 5 20 15' stroke='white' stroke-width='4' fill='none'/><circle cx='50' cy='40' r='12' fill='white'/></svg>" },
    { id: "EMP105", name: "Amanda Ross", dept: "Marketing", designation: "Brand Creative Director", email: "aross@acme.corp", phone: "+91 98765 01105", cabin: "Floor 3 Cabin MKT-12", status: "Out of Office", campusStatus: "Outside", photo: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%238b5cf6'/><path d='M30 75c0-10 10-15 20-15s20 5 20 15' stroke='white' stroke-width='4' fill='none'/><circle cx='50' cy='40' r='12' fill='white'/></svg>" },
    { id: "EMP106", name: "Robert Taylor", dept: "Finance", designation: "Chief Financial Officer", email: "rtaylor@acme.corp", phone: "+91 98765 01106", cabin: "Floor 2 Cabin FIN-5", status: "In Office", campusStatus: "Outside", photo: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%236366f1'/><path d='M30 75c0-10 10-15 20-15s20 5 20 15' stroke='white' stroke-width='4' fill='none'/><circle cx='50' cy='40' r='12' fill='white'/></svg>" },
    { id: "EMP107", name: "Elena Rostova", dept: "Legal", designation: "General Counsel", email: "erostova@acme.corp", phone: "+91 98765 01107", cabin: "Floor 4 Cabin LEG-2", status: "In Meeting", campusStatus: "Inside", photo: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23f97316'/><path d='M30 75c0-10 10-15 20-15s20 5 20 15' stroke='white' stroke-width='4' fill='none'/><circle cx='50' cy='40' r='12' fill='white'/></svg>" },
    { id: "EMP108", name: "James Wilson", dept: "Sales", designation: "VP Global Sales", email: "jwilson@acme.corp", phone: "+91 98765 01108", cabin: "Floor 4 Cabin SAL-8", status: "In Office", campusStatus: "Outside", photo: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%2314b8a6'/><path d='M30 75c0-10 10-15 20-15s20 5 20 15' stroke='white' stroke-width='4' fill='none'/><circle cx='50' cy='40' r='12' fill='white'/></svg>" }
];

const DEFAULT_SECURITY_USERS = [
    { username: "admin", name: "System Administrator", role: "Administrator", phone: "Ext. 9901", shift: "All shifts" },
    { username: "security", name: "Officer Higgins", role: "Security Gatekeeper", phone: "Ext. 9011", shift: "Day Shift (08:00 - 16:00)" },
    { username: "receptionist", name: "Clara Sterling", role: "Front Desk Operator", phone: "Ext. 9022", shift: "Day Shift (08:00 - 16:00)" }
];

const DEFAULT_BLACKLIST = [
    { id: "BL101", name: "John Doe", phone: "+91 99999 88888", idType: "Aadhaar", idNumber: "1111-2222-3333", reason: "Hostile behavior and unauthorized photography inside Cabin IT-A.", dateAdded: "2026-06-15" },
    { id: "BL102", name: "Mary Smith", phone: "+91 88888 77777", idType: "PAN Card", idNumber: "ABCDE1234Z", reason: "Refused gate identity verification checks.", dateAdded: "2026-06-20" }
];

const DEFAULT_DEPARTMENTS = [
    { name: "IT", location: "Floor 2 Cabin IT-A to IT-M" },
    { name: "Engineering", location: "Floor 1 Cabin ENG-1 to ENG-15" },
    { name: "HR & Recruitment", location: "Floor 3 Cabin HR-1 to HR-4" },
    { name: "Marketing", location: "Floor 3 Cabin MKT-1 to MKT-12" },
    { name: "Finance", location: "Floor 2 Cabin FIN-1 to FIN-8" },
    { name: "Legal", location: "Floor 4 Cabin LEG-1 to LEG-3" },
    { name: "Sales", location: "Floor 4 Cabin SAL-1 to SAL-10" }
];

const DEFAULT_VISITORS = [
    {
        id: "V20260012",
        name: "Rahul Sharma",
        phone: "+91 99887 76655",
        email: "rahul.sharma@example.com",
        address: "Bangalore, India",
        company: "ABC Industries",
        purpose: "Meeting",
        vehicle: "MH-12-AB-3456",
        numVisitors: 1,
        idType: "Aadhaar",
        idNumber: "1234-5678-9012",
        hostId: "EMP101",
        hostName: "Manoj Kumar",
        hostDept: "IT",
        visitDate: "2026-07-07",
        checkIn: "2026-07-07T10:30:00",
        checkOut: "2026-07-07T18:00:00",
        expectedExit: "2026-07-07T18:00:00",
        status: "Checked Out",
        photo: ""
    },
    {
        id: "V20260013",
        name: "Devon Carter",
        phone: "+91 98989 89898",
        email: "dcarter@sysfix.com",
        address: "Mumbai, India",
        company: "SysFix Solutions",
        purpose: "Maintenance",
        vehicle: "KA-51-MM-9999",
        numVisitors: 2,
        idType: "Driver License",
        idNumber: "DL-MH1220199923847",
        hostId: "EMP103",
        hostName: "Michael Chang",
        hostDept: "Engineering",
        visitDate: "2026-07-08",
        checkIn: "2026-07-08T09:40:00",
        checkOut: null,
        expectedExit: "2026-07-08T18:00:00",
        status: "Checked In",
        photo: ""
    },
    {
        id: "V20260014",
        name: "Alice Vance",
        phone: "+91 97766 55443",
        email: "alice@vance.io",
        address: "Chennai, India",
        company: "Vance Tech",
        purpose: "Interview",
        vehicle: "",
        numVisitors: 1,
        idType: "PAN Card",
        idNumber: "ABCDE1234F",
        hostId: "EMP104",
        hostName: "David Miller",
        hostDept: "HR & Recruitment",
        visitDate: "2026-07-08",
        checkIn: null,
        checkOut: null,
        expectedExit: "2026-07-10T18:00:00",
        status: "Pending",
        photo: ""
    }
];

// Translation Mappings (English and Tamil)
const TRANSLATIONS = {
    en: {
        // Login Card
        "login-title": "Barani Hydraulics VMS",
        "login-subtitle": "Visitor Management System Portal Login",
        "username": "Username",
        "password": "Password",
        "placeholder-username": "e.g. security or admin",
        "placeholder-password": "••••••••",
        "login-btn": "Login",
        "login-hint": "Use <strong>admin</strong>, <strong>security</strong>, or <strong>receptionist</strong> to log in.",

        // Sidebar Navigation
        "nav-dashboard": "Dashboard",
        "nav-register": "Register Visitor",
        "nav-emp-search": "Employee Search",
        "nav-checkout": "Check-Out",
        "nav-history": "Visitor History",
        "nav-reports": "Reports",
        "nav-settings": "Settings & Admin",
        "display-gate-name": "Main Security Gate",

        // Header
        "welcome-officer": "Welcome Security Officer",
        "header-user-role": "Gate Operator",
        "logout-btn": "Logout",

        // Dashboard Stats
        "visitors-today": "Visitors Today",
        "inside-campus": "Inside Campus",
        "checked-out": "Checked Out",
        "pending-approval": "Pending Approval",

        // Dashboard Quick Actions & Tables
        "quick-actions": "Quick Actions Menu",
        "checkout-visitor-btn": "Check-Out Visitor",
        "reports-page-btn": "Reports Page",
        "current-visitors": "Current Visitors inside Campus",
        "filter-visitors-placeholder": "Filter current visitors...",

        // Tables & Fields
        "tbl-visitor-id": "Visitor ID",
        "tbl-visitor-details": "Visitor Details",
        "tbl-host-employee": "Host Employee",
        "tbl-checked-in": "Checked In",
        "tbl-status": "Status",
        "tbl-actions": "Actions",
        "tbl-name": "Name",
        "tbl-department": "Department",
        "tbl-email": "Email",
        "tbl-phone": "Phone",
        "tbl-cabin": "Cabin",

        // Intake Portal / New Visitor
        "visitor-flow-btn": "Visitor Entry Flow",
        "emp-flow-btn": "Employee Entry Flow",
        "visitor-info-hdr": "Visitor Information",
        "visitor-name-label": "Visitor Name *",
        "fullname-placeholder": "Full Name",
        "phone-label": "Phone Number *",
        "phone-placeholder": "e.g. +91 98765 01234",
        "email-label": "Email Address",
        "email-placeholder": "name@company.com",
        "company-label": "Company Name",
        "company-placeholder": "e.g. Acme Corp",
        "address-label": "Address",
        "address-placeholder": "City, Country",
        "purpose-label": "Purpose of Visit *",
        "opt-select-purpose": "Select Purpose",
        "opt-meeting": "Meeting",
        "opt-interview": "Interview",
        "opt-delivery": "Delivery",
        "opt-maintenance": "Maintenance",
        "opt-other": "Other",
        "vehicle-label": "Vehicle Number",
        "vehicle-placeholder": "e.g. MH-12-AB-1234",
        "id-type-label": "ID Type (Optional)",
        "opt-select-id": "Select ID Type",
        "opt-aadhaar": "Aadhaar Card",
        "opt-pan": "PAN Card",
        "opt-cnic": "CNIC Card",
        "opt-passport": "Passport",
        "opt-dl": "Driver License",
        "opt-company-id": "Company ID",
        "opt-none": "None",
        "id-number-label": "ID Number (Optional)",
        "id-serial-placeholder": "Enter ID serial",
        "placeholder-aadhaar": "Enter 12-digit Aadhaar Card number",
        "placeholder-pan": "Enter 10-digit PAN Card (e.g. ABCDE1234F)",
        "placeholder-cnic": "Enter 13-digit CNIC (e.g. 12345-1234567-1)",
        "placeholder-passport": "Enter Passport number",
        "placeholder-dl": "Enter Driver License number",
        "placeholder-company-id": "Enter Company ID number",
        "num-visitors-label": "No. of Visitors",
        "id-proof-label": "ID Document Proof (Optional)",
        "upload-id-btn": "Upload ID",
        "ocr-btn": "OCR",
        "whom-to-meet-label": "Whom to Meet *",
        "search-host-placeholder": "Type employee name to search...",
        "visit-date-label": "Visit Date",
        "expected-exit-label": "Expected Exit Time",
        "capture-photo-hdr": "Capture Photo",
        "enable-camera-btn": "Enable Camera",
        "capture-btn": "Capture",
        "retake-btn": "Retake",
        "upload-photo-hint": "Or upload a photo file",
        "upload-img-btn": "Upload Image",
        "clear-form-btn": "Clear Form",

        // Employee Gate Attendance
        "emp-gate-entry-hdr": "Employee Gate Entry / Exit",
        "search-emp-label": "Search Employee by Name or ID",
        "search-emp-placeholder": "Search by name, department or employee ID...",
        "or-text": "OR",
        "sim-emp-qr-label": "Simulate Employee QR Scan",
        "sim-emp-qr-desc": "Simulate Scanning Employee ID Pass Badge via Gate Camera Scanner",
        "choose-emp-qr-opt": "-- Choose Employee QR --",
        "scan-qr-btn": "Scan QR",
        "emp-entry-details-placeholder-text": "Search or choose employee QR to verify and log entry.",
        "lbl-employee-id": "Employee ID",
        "lbl-department": "Department",
        "lbl-cabin-location": "Cabin Location",
        "lbl-duty-status": "Duty Status",
        "lbl-corp-email": "Corporate Email",
        "lbl-phone-ext": "Phone Ext",
        "check-in-entry-btn": "Check-In Entry",
        "check-out-exit-btn": "Check-Out Exit",

        // Employee Search
        "search-corp-emp-hdr": "Search Corporate Employee",
        "search-emp-input-label": "Search Employee",
        "search-emp-input-placeholder": "Enter Employee ID, Name, or Phone Number...",
        "search-employee-btn": "Search Employee",
        "matching-emp-hdr": "Matching Employees Details",

        // Check-Out
        "check-out-hdr": "Enter Visitor ID or Scan QR",
        "checkout-id-placeholder": "e.g. V20260012",
        "verify-pass-btn": "Verify Pass",
        "scan-qr-pass-btn": "Scan QR Code Pass",
        "verified-record-hdr": "Verified Visitor Record",
        "tbl-host-dept": "Host Department",
        "tbl-checked-in-time": "Check-In Time",
        "tbl-expected-exit": "Expected Exit",
        "mark-checkout-btn": "Mark Check-Out",

        // Visitor History
        "visitor-audit-hdr": "Visitor Audit Logs",
        "search-history-label": "Search Visitor/Host Details",
        "search-history-placeholder": "Search by ID, Name, Company, Host Employee...",
        "datepicker-label": "Date Picker",
        "clear-btn": "Clear",
        "tbl-entry-datetime": "Entry Date / Time",
        "tbl-exit-datetime": "Exit Date / Time",

        // Reports
        "total-logged-visits": "Total Logged Visits",
        "active-checks-inside": "Active Checks Inside",
        "checkout-success": "Checked Out Successfully",
        "select-rep-cat": "Select Report Category",
        "export-csv-btn": "Export Excel (CSV)",
        "print-pdf-btn": "Print Report PDF",
        "rep-btn-today": "Today's Visitors",
        "rep-btn-weekly": "Weekly Visitors",
        "rep-btn-monthly": "Monthly Visitors",
        "rep-btn-dept": "Department Wise",
        "rep-btn-employee": "Employee Wise",
        "rep-btn-inside": "Inside Campus",
        "rep-tbl-title-today": "Today's Visitors List",
        "visit-purposes-breakdown": "Visit Purposes Breakdown",
        "gate-hourly-traffic": "Gate Hourly Traffic profile",

        // Settings & Admin Tab Navigation
        "set-tab-emp": "Employee Management",
        "set-tab-users": "Security Users",
        "set-tab-depts": "Departments",
        "set-tab-sms": "SMS & Email settings",
        "set-tab-backup": "Database Backup / Restore",
        "set-tab-blacklist": "Blacklist Management",
        "emp-directories": "Employee Directories",
        "add-host-btn": "Add Host Employee",

        // Dynamic Page Titles inside app.js Router
        "title-dashboard": "Dashboard Control Panel",
        "sub-dashboard": "Welcome, {name}",
        "title-registration": "Visitor Intake Portal",
        "sub-registration": "Capture credentials and details to register walk-ins",
        "title-employee-search": "Employee Corporate Index",
        "sub-employee-search": "Locate office spaces, extension lines, and duty stations",
        "title-checkout": "Visitor Gate Clearance Terminal",
        "sub-checkout": "Enter temporary pass serials to execute check-outs",
        "title-history": "Gate Audit Logs & Archives",
        "sub-history": "Historical entries database files registry",
        "title-reports": "Analytical Reports Hub",
        "sub-reports": "Export CSV records and review peak operational visitor logs",
        "title-settings": "VMS System Configurations",
        "sub-settings": "Configure profiles, notifications, and manage backups",
        "no-new-alerts": "No new system alerts.",
        "role-administrator": "Administrator",
        "role-security-gatekeeper": "Security Gatekeeper",
        "role-front-desk-operator": "Front Desk Operator",
        "Excel Export Done": "Excel Export Done",
        "Restricted XML XLS database sheet saved.": "Restricted XML XLS database sheet saved.",
        "Popup Blocked": "Popup Blocked",
        "Please allow popups to download report PDF.": "Please allow popups to download report PDF.",
        "PDF Report Compiled": "PDF Report Compiled",
        "PDF print window opened successfully.": "PDF print window opened successfully.",
        "Restricted Record Added": "Restricted Record Added",
        "added to security blacklist.": "added to security blacklist.",
        "Restricted Record Updated": "Restricted Record Updated",
        "blacklist details modified.": "blacklist details modified.",
        "Restriction Revoked": "Restriction Revoked",
        "removed from security blacklist.": "removed from security blacklist.",
        "CSV Failed": "CSV Failed",
        "No records found in database system.": "No records found in database system.",
        "Export Completed": "Export Completed",
        "Excel CSV database sheet saved.": "Excel CSV database sheet saved.",
        "ID Attached": "ID Attached",
        "ID Card document attached.": "ID Card document attached.",
        "Scan Error": "Scan Error",
        "Please choose a mock employee QR pass.": "Please choose a mock employee QR pass.",
        "QR Scan Successful": "QR Scan Successful",
        "Detected Employee Code:": "Detected Employee Code:",
        "No simulated SMS/Email logs logged yet.": "No simulated SMS/Email logs logged yet.",
        "No restricted visitor records flagged in system.": "No restricted visitor records flagged in system.",
        "removed-from-security-blacklist": "removed from security blacklist.",
        "pm-list-hdr": "Purchase Manual Registers",
        "create-new-pm-btn": "Create Purchase Manual",
        "tbl-pm-id": "PM ID",
        "tbl-agent-name": "Agent Name",
        "tbl-company-name": "Company Name",
        "tbl-contract-type": "Contract Type",
        "new-pm-hdr": "New Purchase Manual",
        "pm-sec-general": "General Information",
        "pm-placeholder-dept": "e.g. IT, Operations",
        "pm-lbl-agent": "Agent Name *",
        "pm-lbl-contract": "Contract Type *",
        "pm-opt-annual": "Annual",
        "pm-opt-onetime": "One-Time",
        "pm-opt-oral": "Oral Agreement",
        "pm-lbl-nature": "Nature of Work",
        "pm-lbl-output": "Required Output",
        "pm-lbl-exp": "Experience (Years)",
        "pm-lbl-eligibility": "Eligibility",
        "pm-sec-details": "Work Details",
        "pm-lbl-duration": "Estimated Duration",
        "pm-lbl-special-equip": "Special Equipment Required",
        "pm-lbl-equip-avail": "Equipment Available",
        "pm-lbl-skills": "Special Skills Required",
        "pm-chk-inspect": "Inspection Required",
        "pm-chk-inspect-rep": "Inspection Report Required",
        "pm-chk-spares": "Spare Parts Required",
        "pm-chk-procedure": "Documented Work Procedure Available",
        "pm-chk-perf": "Performance Measurement Required",
        "pm-chk-fail": "Failure Analysis Required",
        "pm-sec-env": "Environmental Checklist",
        "pm-chk-haz": "Hazardous Materials Used",
        "pm-chk-waste": "Waste Generated",
        "pm-chk-emissions": "Emissions Expected",
        "pm-chk-legal": "Legal Requirements Applicable",
        "pm-chk-controls": "Environmental Control Measures",
        "pm-sec-safety": "Safety Checklist",
        "pm-lbl-workers": "Number of Workers *",
        "pm-chk-insurance": "Insurance Available",
        "pm-chk-drawing": "Technical Drawing Understood",
        "pm-chk-briefing": "Safety Briefing Completed",
        "pm-chk-emergency": "Emergency Procedure Explained",
        "pm-chk-height": "Working at Height",
        "pm-chk-hot": "Hot Work",
        "pm-chk-electrical": "Electrical Work",
        "pm-chk-confined": "Confined Space Work",
        "pm-chk-isolated": "Work Area Isolated",
        "pm-chk-risk": "Risk Assessment Completed",
        "pm-chk-ppe": "PPE Available",
        "pm-sec-attachments": "Attachments",
        "pm-attachment-desc": "Click to browse and upload work procedure files or insurance certificates",
        "pm-btn-draft": "Save Draft",
        "pm-btn-submit": "Submit Manual",
        "wp-list-hdr": "Work Permit Registry",
        "create-new-wp-btn": "Apply for Work Permit",
        "tbl-wp-id": "Permit ID",
        "new-wp-hdr": "New Work Permit Application",
        "wp-sec-link": "Link Approved Purchase Manual",
        "wp-lbl-select-pm": "Select Approved Purchase Manual *",
        "choose-pm-opt": "-- Choose Approved Purchase Manual --",
        "wp-sec-duration": "Permit Validity & Details",
        "wp-lbl-rep": "Contractor Representative *",
        "wp-lbl-start": "Start Date *",
        "wp-lbl-end": "End Date *",
        "wp-sec-agreement": "Safety Terms & Declaration",
        "wp-agree-standards": "I confirm that all safety standards, isolated zones, and PPE lists will be strictly maintained on-site.",
        "wp-btn-submit": "Submit Work Permit",
        "pm-drafts": "Purchase Manuals (Draft)",
        "pm-pending": "Purchase Manuals (Pending)",
        "pm-approved": "Purchase Manuals (Approved)",
        "pm-rejected": "Purchase Manuals (Rejected)",
        "active-work-permits": "Active Work Permits",
        // Dynamic Page Titles inside app.js Router
        "title-purchase-manual": "Purchase Manual Management",
        "sub-purchase-manual": "Draft, submit, and manage facility purchase manual registers",
        "title-work-permit": "Work Permit & Access Clearance",
        "sub-work-permit": "Submit and authorize high-risk activity permits linked to approved manuals"
    },
    ta: {
        // Login Card
        "login-title": "பரணி ஹைட்ராலிக்ஸ் VMS",
        "login-subtitle": "வருகையாளர் மேலாண்மை அமைப்பு உள்நுழைவு",
        "username": "பயனர் பெயர்",
        "password": "கடவுச்சொல்",
        "placeholder-username": "எ.கா. security அல்லது admin",
        "placeholder-password": "••••••••",
        "login-btn": "உள்நுழைக",
        "login-hint": "உள்நுழைய <strong>admin</strong>, <strong>security</strong>, அல்லது <strong>receptionist</strong> ஐப் பயன்படுத்தவும்.",

        // Sidebar Navigation
        "nav-dashboard": "முகப்புப்பலகை",
        "nav-register": "வருகையாளர் பதிவு",
        "nav-emp-search": "பணியாளர் தேடல்",
        "nav-checkout": "வெளியேற்றம்",
        "nav-history": "வருகையாளர் வரலாறு",
        "nav-reports": "அறிக்கைகள்",
        "nav-settings": "நிர்வாக அமைப்புகள்",
        "display-gate-name": "முதன்மை பாதுகாப்பு வாயில்",

        // Header
        "welcome-officer": "பாதுகாப்பு அதிகாரிக்கு வரவேற்பு",
        "header-user-role": "வாயில் ஆபரேட்டர்",
        "logout-btn": "வெளியேறு",

        // Dashboard Stats
        "visitors-today": "இன்றைய வருகையாளர்கள்",
        "inside-campus": "வளாகத்திற்குள்",
        "checked-out": "வெளியேறியவர்கள்",
        "pending-approval": "அனுமதி நிலுவையில்",

        // Dashboard Quick Actions & Tables
        "quick-actions": "விரைவு செயல்பாடுகள்",
        "checkout-visitor-btn": "வருகையாளர் வெளியேற்றம்",
        "reports-page-btn": "அறிக்கைகள் பக்கம்",
        "current-visitors": "தற்போது வளாகத்தில் உள்ளவர்கள்",
        "filter-visitors-placeholder": "வருகையாளர்களை வடிகட்டவும்...",

        // Tables & Fields
        "tbl-visitor-id": "வருகையாளர் ஐடி",
        "tbl-visitor-details": "வருகையாளர் விவரங்கள்",
        "tbl-host-employee": "சந்திக்கவேண்டிய பணியாளர்",
        "tbl-checked-in": "உள்நுழைவு நேரம்",
        "tbl-status": "நிலை",
        "tbl-actions": "செயல்பாடுகள்",
        "tbl-name": "பெயர்",
        "tbl-department": "துறை",
        "tbl-email": "மின்னஞ்சல்",
        "tbl-phone": "தொலைபேசி",
        "tbl-cabin": "அறை எண்",

        // Intake Portal / New Visitor
        "visitor-flow-btn": "வருகையாளர் நுழைவு",
        "emp-flow-btn": "பணியாளர் நுழைவு",
        "visitor-info-hdr": "வருகையாளர் தகவல்",
        "visitor-name-label": "வருகையாளர் பெயர் *",
        "fullname-placeholder": "முழு பெயர்",
        "phone-label": "தொலைபேசி எண் *",
        "phone-placeholder": "எ.கா. +91 98765 01234",
        "email-label": "மின்னஞ்சல் முகவரி",
        "email-placeholder": "name@company.com",
        "company-label": "நிறுவனத்தின் பெயர்",
        "company-placeholder": "எ.கா. Acme Corp",
        "address-label": "முகவரி",
        "address-placeholder": "நகரம், நாடு",
        "purpose-label": "வருகையின் நோக்கம் *",
        "opt-select-purpose": "நோக்கத்தைத் தேர்ந்தெடுக்கவும்",
        "opt-meeting": "கூட்டம் (Meeting)",
        "opt-interview": "நேர்காணல் (Interview)",
        "opt-delivery": "விநியோகம் (Delivery)",
        "opt-maintenance": "பராமரிப்பு (Maintenance)",
        "opt-other": "இதர",
        "vehicle-label": "வாகன எண்",
        "vehicle-placeholder": "எ.கா. MH-12-AB-1234",
        "id-type-label": "அடையாள அட்டை வகை (விரும்பினால்)",
        "opt-select-id": "அடையாள வகையைத் தேர்ந்தெடுக்கவும்",
        "opt-aadhaar": "ஆதார் கார்டு",
        "opt-pan": "பான் கார்டு",
        "opt-cnic": "CNIC கார்டு",
        "opt-passport": "பாஸ்போர்ட்",
        "opt-dl": "ஓட்டுநர் உரிமம்",
        "opt-company-id": "நிறுவன ஐடி",
        "opt-none": "எதுவுமில்லை",
        "id-number-label": "அடையாள அட்டை எண் (விரும்பினால்)",
        "id-serial-placeholder": "அட்டை எண்ணை உள்ளிடவும்",
        "placeholder-aadhaar": "12-இலக்க ஆதார் எண்ணை உள்ளிடவும்",
        "placeholder-pan": "பான் கார்டு எண்ணை உள்ளிடவும் (எ.கா. ABCDE1234F)",
        "placeholder-cnic": "13-இலக்க CNIC ஐ உள்ளிடவும் (எ.கா. 12345-1234567-1)",
        "placeholder-passport": "பாஸ்போர்ட் எண்ணை உள்ளிடவும்",
        "placeholder-dl": "ஓட்டுநர் உரிம எண்ணை உள்ளிடவும்",
        "placeholder-company-id": "நிறுவன ஐடி எண்ணை உள்ளிடவும்",
        "num-visitors-label": "வருகையாளர்களின் எண்ணிக்கை",
        "id-proof-label": "அடையாள ஆவணச் சான்று (விரும்பினால்)",
        "upload-id-btn": "ஐடியை பதிவேற்று",
        "ocr-btn": "வாசி (OCR)",
        "whom-to-meet-label": "யாரைச் சந்திக்க வேண்டும் *",
        "search-host-placeholder": "தேட பணியாளர் பெயரை தட்டச்சு செய்க...",
        "visit-date-label": "வருகை தேதி",
        "expected-exit-label": "எதிர்பார்க்கும் வெளியேறும் நேரம்",
        "capture-photo-hdr": "புகைப்படம் எடுக்கவும்",
        "enable-camera-btn": "கேமராவை இயக்கு",
        "capture-btn": "படம் பிடி",
        "retake-btn": "மீண்டும் பிடி",
        "upload-photo-hint": "அல்லது புகைப்பட கோப்பை பதிவேற்றவும்",
        "upload-img-btn": "படத்தைப் பதிவேற்றவும்",
        "clear-form-btn": "படிவத்தை துடைக்கவும்",

        // Employee Gate Attendance
        "emp-gate-entry-hdr": "பணியாளர் வாயில் நுழைவு / வெளியேற்றம்",
        "search-emp-label": "பணியாளர் பெயர் அல்லது ஐடி மூலம் தேடவும்",
        "search-emp-placeholder": "பெயர், துறை அல்லது பணியாளர் ஐடி மூலம் தேடவும்...",
        "or-text": "அல்லது",
        "sim-emp-qr-label": "பணியாளர் QR ஸ்கேன் செய்",
        "sim-emp-qr-desc": "வாயில் கேமரா மூலம் பணியாளர் ஐடி பாஸை ஸ்கேன் செய்வதை உருவகப்படுத்துங்கள்",
        "choose-emp-qr-opt": "-- பணியாளர் QR ஐத் தேர்ந்தெடுக்கவும் --",
        "scan-qr-btn": "QR ஸ்கேன்",
        "emp-entry-details-placeholder-text": "நுழைவைச் சரிபார்க்க பணியாளர் QR-ஐத் தேடவும் அல்லது தேர்ந்தெடுக்கவும்.",
        "lbl-employee-id": "பணியாளர் ஐடி",
        "lbl-department": "துறை",
        "lbl-cabin-location": "அறை இருப்பிடம்",
        "lbl-duty-status": "பணி நிலை",
        "lbl-corp-email": "நிறுவன மின்னஞ்சல்",
        "lbl-phone-ext": "தொலைபேசி நீட்டிப்பு",
        "check-in-entry-btn": "உள்வருகை பதிவு",
        "check-out-exit-btn": "வெளிவருகை பதிவு",

        // Employee Search
        "search-corp-emp-hdr": "நிறுவன பணியாளர் தேடல்",
        "search-emp-input-label": "பணியாளர் தேடல்",
        "search-emp-input-placeholder": "பணியாளர் ஐடி, பெயர் அல்லது தொலைபேசியை உள்ளிடவும்...",
        "search-employee-btn": "பணியாளரைத் தேடு",
        "matching-emp-hdr": "பொருந்தும் பணியாளர்களின் விவரங்கள்",

        // Check-Out
        "check-out-hdr": "வருகையாளர் ஐடி உள்ளிடவும் அல்லது QR ஸ்கேன் செய்யவும்",
        "checkout-id-placeholder": "எ.கா. V20260012",
        "verify-pass-btn": "பாஸை சரிபார்",
        "scan-qr-pass-btn": "QR பாஸை ஸ்கேன் செய்",
        "verified-record-hdr": "சரிபார்க்கப்பட்ட வருகையாளர் பதிவு",
        "tbl-host-dept": "பணியாளர் துறை",
        "tbl-checked-in-time": "உள்நுழைந்த நேரம்",
        "tbl-expected-exit": "எதிர்பார்க்கப்பட்ட வெளியேற்றம்",
        "mark-checkout-btn": "வெளியேறியதாகப் பதிவுசெய்",

        // Visitor History
        "visitor-audit-hdr": "வருகையாளர் தணிக்கை பதிவுகள்",
        "search-history-label": "வருகையாளர்/அழைப்பாளர் விவரங்களை தேடுக",
        "search-history-placeholder": "ஐடி, பெயர், நிறுவனம் அல்லது பணியாளர் மூலம் தேடவும்...",
        "datepicker-label": "தேதி தேர்வி",
        "clear-btn": "துடைக்கவும்",
        "tbl-entry-datetime": "நுழைவு தேதி / நேரம்",
        "tbl-exit-datetime": "வெளியேற்றம் தேதி / நேரம்",

        // Reports
        "total-logged-visits": "மொத்த வருகைகள்",
        "active-checks-inside": "வளாகத்தினுள் இருப்பவர்கள்",
        "checkout-success": "வெற்றிகரமாக வெளியேறியவர்கள்",
        "select-rep-cat": "அறிக்கை வகையைத் தேர்ந்தெடுக்கவும்",
        "export-csv-btn": "எக்செல் (CSV) ஏற்றுமதி",
        "print-pdf-btn": "அறிக்கையை PDF அச்சிடுக",
        "rep-btn-today": "இன்றைய வருகையாளர்கள்",
        "rep-btn-weekly": "வாராந்திர வருகையாளர்கள்",
        "rep-btn-monthly": "மாதாந்திர வருகையாளர்கள்",
        "rep-btn-dept": "துறை வாரியாக",
        "rep-btn-employee": "பணியாளர் வாரியாக",
        "rep-btn-inside": "வளாகத்தினுள் உள்ளவர்கள்",
        "rep-tbl-title-today": "இன்றைய வருகையாளர்கள் பட்டியல்",
        "visit-purposes-breakdown": "வருகை நோக்கங்களின் பகுப்பாய்வு",
        "gate-hourly-traffic": "வாயில் மணிநேர போக்குவரத்து விவரம்",

        // Settings & Admin Tab Navigation
        "set-tab-emp": "பணியாளர் மேலாண்மை",
        "set-tab-users": "பாதுகாப்பு பயனர்கள்",
        "set-tab-depts": "துறைகள்",
        "set-tab-sms": "SMS & மின்னஞ்சல் அமைப்புகள்",
        "set-tab-backup": "தரவுத்தள காப்பு & மீட்பு",
        "set-tab-blacklist": "கருப்புப்பட்டியல் மேலாண்மை",
        "emp-directories": "பணியாளர் கோப்புகள்",
        "add-host-btn": "புதிய பணியாளரைச் சேர்",

        // Dynamic Page Titles inside app.js Router
        "title-dashboard": "முகப்புப்பலகை கட்டுப்பாட்டு மையம்",
        "sub-dashboard": "வரவேற்கிறோம், {name}",
        "title-registration": "வருகையாளர் நுழைவு போர்டல்",
        "sub-registration": "வருகையாளர்களுக்கான நற்சான்றிதழ்கள் மற்றும் விவரங்களைப் பதிவு செய்யவும்",
        "title-employee-search": "கார்ப்பரேட் பணியாளர் அட்டவணை",
        "sub-employee-search": "அலுவலக அறைகள், தொலைபேசி நீட்டிப்புகள் மற்றும் பணியிடங்களைக் கண்டறியவும்",
        "title-checkout": "வருகையாளர் வெளியேற்ற வாயில் முனையம்",
        "sub-checkout": "வெளியேற்றத்தைச் செயல்படுத்த தற்காலிக பாஸ் எண்ணை உள்ளிடவும்",
        "title-history": "வாயில் தணிக்கை பதிவுகள் & காப்பகங்கள்",
        "sub-history": "வரலாற்று நுழைவுத் தரவுத்தள கோப்புகளின் பதிவேடு",
        "title-reports": "பகுப்பாய்வு அறிக்கைகள் மையம்",
        "sub-reports": "CSV பதிவுகளை ஏற்றுமதி செய்து, வருகையாளர் போக்குவரத்துப் புள்ளிவிவரங்களை மதிப்பாய்வு செய்யவும்",
        "title-settings": "VMS கணினி உள்ளமைவுகள்",
        "sub-settings": "சுயவிவரங்கள், அறிவிப்புகளை உள்ளமைக்கவும் மற்றும் காப்புப்பிரதிகளை நிர்வகிக்கவும்",
        "no-new-alerts": "புதிய கணினி விழிப்பூட்டல்கள் எதுவும் இல்லை.",
        "role-administrator": "நிர்வாகி",
        "role-security-gatekeeper": "பாதுகாப்பு வாயில்காப்பாளர்",
        "role-front-desk-operator": "முன்னணி மேசை ஆபரேட்டர்",
        "Excel Export Done": "எக்செல் ஏற்றுமதி செய்யப்பட்டது",
        "Restricted XML XLS database sheet saved.": "எக்செல் தாளாக சேமிக்கப்பட்டது.",
        "Popup Blocked": "பாப்அப் தடுக்கப்பட்டது",
        "Please allow popups to download report PDF.": "அறிக்கை PDF-ஐப் பதிவிறக்க பாப்அப்களை அனுமதிக்கவும்.",
        "PDF Report Compiled": "PDF அறிக்கை தொகுக்கப்பட்டது",
        "PDF print window opened successfully.": "PDF அச்சிடும் சாளரம் வெற்றிகரமாக திறக்கப்பட்டது.",
        "Restricted Record Added": "தடுக்கப்பட்ட பதிவு சேர்க்கப்பட்டது",
        "added to security blacklist.": "பாதுகாப்பு கருப்புப்பட்டியலில் சேர்க்கப்பட்டார்.",
        "Restricted Record Updated": "தடுக்கப்பட்ட பதிவு புதுப்பிக்கப்பட்டது",
        "blacklist details modified.": "கருப்புப்பட்டியல் விவரங்கள் மாற்றப்பட்டன.",
        "Restriction Revoked": "கட்டுப்பாடு நீக்கப்பட்டது",
        "removed from security blacklist.": "பாதுகாப்பு கருப்புப்பட்டியலில் இருந்து நீக்கப்பட்டார்.",
        "CSV Failed": "CSV ஏற்றுமதி தோல்வி",
        "No records found in database system.": "தரவுத்தள அமைப்பில் பதிவுகள் எதுவும் இல்லை.",
        "Export Completed": "ஏற்றுமதி முடிந்தது",
        "Excel CSV database sheet saved.": "எக்செல் CSV தரவுத்தாள் சேமிக்கப்பட்டது.",
        "ID Attached": "ஐடி இணைக்கப்பட்டது",
        "ID Card document attached.": "அடையாள அட்டை ஆவணம் இணைக்கப்பட்டது.",
        "Scan Error": "ஸ்கேன் பிழை",
        "Please choose a mock employee QR pass.": "போலி பணியாளர் QR பாஸைத் தேர்ந்தெடுக்கவும்.",
        "QR Scan Successful": "QR ஸ்கேன் வெற்றி பெற்றது",
        "Detected Employee Code:": "கண்டறியப்பட்ட பணியாளர் குறியீடு:",
        "No simulated SMS/Email logs logged yet.": "SMS/மின்னஞ்சல் பதிவுகள் எதுவும் இல்லை.",
        "No restricted visitor records flagged in system.": "கருப்புப்பட்டியல் பதிவுகள் எதுவும் இல்லை.",
        "logged-in-as": "{name} உள்நுழைந்துள்ளார்",
        "added-to-security-blacklist": "{name} பாதுகாப்பு கருப்புப்பட்டியலில் சேர்க்கப்பட்டார்.",
        "blacklist-details-modified": "{name} கருப்புப்பட்டியல் விவரங்கள் மாற்றப்பட்டன.",
        "removed-from-security-blacklist": "{name} பாதுகாப்பு கருப்புப்பட்டியலில் இருந்து நீக்கப்பட்டார்.",
        "edit-btn": "தொகு",
        "pm-list-hdr": "கொள்முதல் கையேடு பதிவேடுகள்",
        "create-new-pm-btn": "புதிய கொள்முதல் கையேட்டை உருவாக்கு",
        "tbl-pm-id": "கொள்முதல் கையேடு ஐடி",
        "tbl-agent-name": "முகவர் பெயர்",
        "tbl-company-name": "நிறுவனத்தின் பெயர்",
        "tbl-contract-type": "ஒப்பந்த வகை",
        "new-pm-hdr": "புதிய கொள்முதல் கையேடு",
        "pm-sec-general": "பொதுவான தகவல்",
        "pm-placeholder-dept": "எ.கா. IT, செயல்பாடுகள்",
        "pm-lbl-agent": "முகவர் பெயர் *",
        "pm-lbl-contract": "ஒப்பந்த வகை *",
        "pm-opt-annual": "ஆண்டு ஒப்பந்தம்",
        "pm-opt-onetime": "ஒரு முறை ஒப்பந்தம்",
        "pm-opt-oral": "வாய்மொழி ஒப்பந்தம்",
        "pm-lbl-nature": "வேலையின் தன்மை",
        "pm-lbl-output": "தேவைப்படும் வெளியீடு",
        "pm-lbl-exp": "அனுபவம் (ஆண்டுகள்)",
        "pm-lbl-eligibility": "தகுதி",
        "pm-sec-details": "வேலை விவரங்கள்",
        "pm-lbl-duration": "மதிப்பிடப்பட்ட கால அளவு",
        "pm-lbl-special-equip": "சிறப்பு உபகரணங்கள் தேவை",
        "pm-lbl-equip-avail": "கிடைக்கும் உபகரணங்கள்",
        "pm-lbl-skills": "சிறப்பு திறன்கள் தேவை",
        "pm-chk-inspect": "ஆய்வு தேவை",
        "pm-chk-inspect-rep": "ஆய்வு அறிக்கை தேவை",
        "pm-chk-spares": "உதிரி பாகங்கள் தேவை",
        "pm-chk-procedure": "வேலை நடைமுறை உள்ளது",
        "pm-chk-perf": "செயல்திறன் அளவீடு தேவை",
        "pm-chk-fail": "தோல்வி பகுப்பாய்வு தேவை",
        "pm-sec-env": "சுற்றுச்சூழல் சரிபார்ப்பு பட்டியல்",
        "pm-chk-haz": "ஆபத்தான பொருட்கள் பயன்படுத்தப்படுகின்றன",
        "pm-chk-waste": "கழிவு உருவாக்கப்படுகிறது",
        "pm-chk-emissions": "உமிழ்வு எதிர்பார்க்கப்படுகிறது",
        "pm-chk-legal": "சட்ட தேவைகள் பொருந்தும்",
        "pm-chk-controls": "சுற்றுச்சூழல் கட்டுப்பாட்டு நடவடிக்கைகள்",
        "pm-sec-safety": "பாதுகாப்பு சரிபார்ப்பு பட்டியல்",
        "pm-lbl-workers": "பணியாளர்களின் எண்ணிக்கை *",
        "pm-chk-insurance": "காப்பீடு உள்ளது",
        "pm-chk-drawing": "தொழில்நுட்ப வரைபடம் புரிந்து கொள்ளப்பட்டது",
        "pm-chk-briefing": "பாதுகாப்பு விளக்கம் முடிந்தது",
        "pm-chk-emergency": "அவசரகால நடைமுறை விளக்கப்பட்டது",
        "pm-chk-height": "உயரத்தில் வேலை செய்தல்",
        "pm-chk-hot": "வெப்ப வேலை (தீப்பொறி வேலை)",
        "pm-chk-electrical": "மின்சார வேலை",
        "pm-chk-confined": "நெருக்கடியான இடத்தில் வேலை",
        "pm-chk-isolated": "வேலை பகுதி தனிமைப்படுத்தப்பட்டுள்ளது",
        "pm-chk-risk": "ஆபத்து மதிப்பீடு முடிந்தது",
        "pm-chk-ppe": "PPE உபகரணங்கள் உள்ளன",
        "pm-sec-attachments": "இணைப்புகள்",
        "pm-attachment-desc": "கோப்புகள் அல்லது காப்பீட்டு சான்றிதழ்களை பதிவேற்ற கிளிக் செய்யவும்",
        "pm-btn-draft": "வரைவைச் சேமி",
        "pm-btn-submit": "கையேட்டைச் சமர்ப்பி",
        "wp-list-hdr": "வேலை அனுமதிச்சீட்டு பதிவேடு",
        "create-new-wp-btn": "வேலை அனுமதிச்சீட்டுக்கு விண்ணப்பி",
        "tbl-wp-id": "அனுமதிச்சீட்டு ஐடி",
        "new-wp-hdr": "புதிய வேலை அனுமதிச்சீட்டு விண்ணப்பம்",
        "wp-sec-link": "அங்கீகரிக்கப்பட்ட கொள்முதல் கையேட்டை இணைக்கவும்",
        "wp-lbl-select-pm": "அங்கீகரிக்கப்பட்ட கொள்முதல் கையேட்டைத் தேர்ந்தெடுக்கவும் *",
        "choose-pm-opt": "-- அங்கீகரிக்கப்பட்ட கொள்முதல் கையேட்டைத் தேர்ந்தெடுக்கவும் --",
        "wp-sec-duration": "அனுமதிச்சீட்டு கால அளவு & விவரங்கள்",
        "wp-lbl-rep": "ஒப்பந்தக்காரர் பிரதிநிதி *",
        "wp-lbl-start": "ஆரம்ப தேதி *",
        "wp-lbl-end": "முடிவு தேதி *",
        "wp-sec-agreement": "பாதுகாப்பு விதிமுறைகள் & பிரகடனம்",
        "wp-agree-standards": "அனைத்து பாதுகாப்பு விதிமுறைகளும் தளத்தில் பராமரிக்கப்படும் என்பதை உறுதிப்படுத்துகிறேன்.",
        "wp-btn-submit": "வேலை அனுமதிச்சீட்டை சமர்ப்பி",
        "pm-drafts": "கொள்முதல் கையேடுகள் (வரைவு)",
        "pm-pending": "கொள்முதல் கையேடுகள் (நிலுவையில்)",
        "pm-approved": "கொள்முதல் கையேடுகள் (அங்கீகரிக்கப்பட்டது)",
        "pm-rejected": "கொள்முதல் கையேடுகள் (நிராகரிக்கப்பட்டது)",
        "active-work-permits": "செயலில் உள்ள வேலை அனுமதிச்சீட்டுகள்",
        "title-purchase-manual": "கொள்முதல் கையேடு மேலாண்மை",
        "sub-purchase-manual": "கொள்முதல் கையேடுகளை வரைவு செய்ய, சமர்ப்பிக்க மற்றும் நிர்வகிக்க",
        "title-work-permit": "வேலை அனுமதிச்சீட்டு & அணுகல் அனுமதி",
        "sub-work-permit": "அங்கீகரிக்கப்பட்ட கையேடுகளுடன் இணைக்கப்பட்ட வேலை அனுமதிச்சீட்டுகளைச் சமர்ப்பித்து அங்கீகரிக்க"
    }
};

// 1a. Purchase Manual & Work Permit Default Mock Seeds
const DEFAULT_PURCHASE_MANUALS = [
    {
        id: "PM1001",
        dept: "IT",
        agentName: "Rajesh Kumar",
        agentAuthDetail: "Aadhaar: 1234-5678-9012",
        companyName: "Infosys Ltd",
        companyAddress: "Chennai, India",
        contactNumber: "+91 98765 43210",
        contractType: "One-Time",
        contractNo: "SC-2026-IT01",
        contractDate: "2026-07-01",
        noContract: "No",
        natureWork: "Server maintenance and cabling",
        requiredOutput: "IT rack clean room setup completed",
        experience: 5,
        competencyAssess: "Expert in Fiber Cabling",
        eligibility: "Yes",
        risksInvolved: "Minor electric shock risk, cable clutter tripping hazard.",
        qualityReq: "Cat6 standards compliant cabling setup.",
        duration: "3 Days",
        specialToolNeeded: "Yes",
        specialEquip: "Laser cabling splicer",
        equipAvailable: "Handheld tools",
        skillTrainingReq: "Yes",
        specialSkills: "Fibre splicing certification",
        sparesProvider: "Infosys Ltd",
        inspectReq: "Yes",
        procedureAvail: "Yes",
        inspectRepReq: "Yes",
        estDefectiveProb: "No",
        correctionPlanPrepared: "Yes",
        sparePartsReq: "No",
        envHaz: "No",
        envWaste: "Yes",
        envEmissions: "No",
        envLegal: "Yes",
        envOcpsFollowed: "Yes",
        envControls: "Dust extraction during drywall drilling",
        numWorkers: 2,
        safInsurance: "Yes",
        safDrawing: "Yes",
        safBriefing: "Yes",
        safEmergency: "Yes",
        safHeight: "No",
        safHot: "No",
        safElectrical: "Yes",
        safConfined: "No",
        safIsolated: "Yes",
        safRisk: "Yes",
        safPermitProvided: "Yes",
        safConductBriefed: "Yes",
        safPpe: "Yes",
        status: "Approved",
        dateCreated: "2026-07-08",
        dateSubmitted: "2026-07-08",
        dateApproved: "2026-07-08",
        attachments: [
            { id: "ATT101", fileName: "cabling_safety_procedure.pdf" }
        ]
    },
    {
        id: "PM1002",
        dept: "Operations",
        agentName: "Sanjay Singh",
        agentAuthDetail: "PAN: AB1234CD",
        companyName: "Thermal Solutions",
        companyAddress: "Delhi, India",
        contactNumber: "+91 99880 11223",
        contractType: "Annual",
        contractNo: "SC-2026-OP02",
        contractDate: "2026-06-15",
        noContract: "No",
        natureWork: "HVAC boiler pipeline repairs",
        requiredOutput: "Leak-free boiler connection",
        experience: 8,
        competencyAssess: "Grade A pressure pipe welder",
        eligibility: "Yes",
        risksInvolved: "High temperature burns, confined space asphyxiation risk.",
        qualityReq: "Leak testing at 5 bar pressure.",
        duration: "2 Weeks",
        specialToolNeeded: "Yes",
        specialEquip: "Argon welding machine, gas detectors",
        equipAvailable: "Welding torch",
        skillTrainingReq: "Yes",
        specialSkills: "Welder license class-1",
        sparesProvider: "Client",
        inspectReq: "Yes",
        procedureAvail: "Yes",
        inspectRepReq: "Yes",
        estDefectiveProb: "Yes",
        correctionPlanPrepared: "Yes",
        sparePartsReq: "Yes",
        envHaz: "Yes",
        envWaste: "Yes",
        envEmissions: "Yes",
        envLegal: "Yes",
        envOcpsFollowed: "Yes",
        envControls: "Welding fume extraction setup",
        numWorkers: 4,
        safInsurance: "Yes",
        safDrawing: "Yes",
        safBriefing: "Yes",
        safEmergency: "Yes",
        safHeight: "Yes",
        safHot: "Yes",
        safElectrical: "No",
        safConfined: "Yes",
        safIsolated: "Yes",
        safRisk: "Yes",
        safPermitProvided: "Yes",
        safConductBriefed: "Yes",
        safPpe: "Yes",
        status: "Submitted",
        dateCreated: "2026-07-09",
        dateSubmitted: "2026-07-09",
        dateApproved: null,
        attachments: []
    }
];

const DEFAULT_WORK_PERMITS = [
    {
        id: "WP20260001",
        purchaseManualId: "PM1001",
        companyEntity: "Infosys Ltd",
        locationSite: "Server Room B, 2nd Floor",
        conductedOn: "2026-07-09",
        workActivity: "Running Cat6 Ethernet cables and installing racks.",
        highRiskWork: "General",
        startTime: "09:00",
        endTime: "18:00",
        repName: "Rajesh Kumar",
        startDate: "2026-07-09",
        endDate: "2026-07-11",
        description: "Executing fiber layout for Server Cabin B.",
        chkStandards: true,
        decRiskReviewed: "Yes",
        decControlsAdequate: "Yes",
        decCompetentCoord: "Yes",
        decImplementControls: "Yes",
        decWorkersInformed: "Yes",
        decMonitorHazards: "Yes",
        decReqApproval: "Yes",
        decSupervisorSig: "Karthik Subramanian",
        engReviewedDocs: "Yes",
        engMonitorMethods: "Yes",
        engInformedPersons: "Yes",
        engContractorSig: "Rajesh Kumar",
        authReviewedDocs: "Yes",
        authRegistered: "Yes",
        authPersonSig: "Arun Moorthy (Safety Head)",
        status: "Approved",
        safetyOfficerApproved: true,
        finalAuthorized: true,
        dateCreated: "2026-07-08"
    }
];

window.lastMatchedVisitor = { student: null, customer: null, vendor: null };

// App State Store
let state = {
    employees: [],
    visitors: [],
    securityUsers: [],
    departments: [],
    notifications: [],
    dispatchLogs: [],
    blacklist: [],
    purchaseManuals: [],
    purchaseManualApprovals: [],
    purchaseManualAttachments: [],
    workPermits: [],
    auditLogs: [],
    studentMaster: [],
    customerMaster: [],
    vendorMaster: [],
    contractorMaster: [],
    deliveryMaster: [],
    serviceEngineerMaster: [],
    currentUser: null,
    activeView: "view-reports",
    cameraStream: null,
    qrStream: null,
    tempVisitorPhoto: "",
    currentLang: "en",
    settings: {
        smsProvider: "Twilio",
        waToken: "",
        waPhoneId: "",
        smtpHost: "smtp.barani.in",
        smtpPort: 587,
        terminalGate: "Barani Security Gate",
        supabaseUrl: "",
        supabaseKey: "",
        supabaseBucket: "visitor-passes",
        gcpBackendUrl: "",
        gcpAiUrl: "",
        jwtToken: "",
        waMethod: "url-local",
        autoSendWhatsApp: true,
        publicWebUrl: ""
    }
};

// Storage Utilities
async function loadState() {
    if (supabaseClient) {
        try {
            const { data, error } = await supabaseClient
                .from("employees")
                .select("*");

            if (error) {
                console.error("Error fetching employees:", error);
                state.employees = JSON.parse(localStorage.getItem("gk_employees")) || DEFAULT_EMPLOYEES;
            } else {
                state.employees = data;
                localStorage.setItem("gk_employees", JSON.stringify(data));
            }
        } catch (err) {
            console.error("Supabase loadState exception:", err);
            state.employees = JSON.parse(localStorage.getItem("gk_employees")) || DEFAULT_EMPLOYEES;
        }
    } else {
        state.employees = JSON.parse(localStorage.getItem("gk_employees")) || DEFAULT_EMPLOYEES;
    }
    state.visitors = JSON.parse(localStorage.getItem("gk_visitors")) || DEFAULT_VISITORS;
    state.securityUsers = JSON.parse(localStorage.getItem("gk_security_users")) || DEFAULT_SECURITY_USERS;
    state.departments = JSON.parse(localStorage.getItem("gk_departments")) || DEFAULT_DEPARTMENTS;
    state.notifications = JSON.parse(localStorage.getItem("gk_notifications")) || [];
    state.dispatchLogs = JSON.parse(localStorage.getItem("gk_dispatch_logs")) || [];
    state.blacklist = JSON.parse(localStorage.getItem("gk_blacklist")) || DEFAULT_BLACKLIST;
    state.purchaseManuals = JSON.parse(localStorage.getItem("gk_purchase_manuals")) || DEFAULT_PURCHASE_MANUALS;
    state.purchaseManualApprovals = JSON.parse(localStorage.getItem("gk_purchase_manual_approvals")) || [];
    state.purchaseManualAttachments = JSON.parse(localStorage.getItem("gk_purchase_manual_attachments")) || [];
    state.workPermits = JSON.parse(localStorage.getItem("gk_work_permits")) || DEFAULT_WORK_PERMITS;
    state.auditLogs = JSON.parse(localStorage.getItem("gk_audit_logs")) || [];
    state.studentMaster = JSON.parse(localStorage.getItem("gk_student_master")) || [];
    state.customerMaster = JSON.parse(localStorage.getItem("gk_customer_master")) || [];
    state.vendorMaster = JSON.parse(localStorage.getItem("gk_vendor_master")) || [];
    state.contractorMaster = JSON.parse(localStorage.getItem("gk_contractor_master")) || [];
    state.deliveryMaster = JSON.parse(localStorage.getItem("gk_delivery_master")) || [];
    state.serviceEngineerMaster = JSON.parse(localStorage.getItem("gk_service_engineer_master")) || [];
    state.currentUser = JSON.parse(localStorage.getItem("gk_current_user")) || null;
    state.currentLang = localStorage.getItem("gk_lang") || "en";

    const defaultSettings = {
        smsProvider: "Twilio",
        waToken: "",
        waPhoneId: "",
        smtpHost: "smtp.barani.in",
        smtpPort: 587,
        terminalGate: "Barani Security Gate",
        supabaseUrl: "",
        supabaseKey: "",
        supabaseBucket: "visitor-passes",
        gcpBackendUrl: "",
        gcpAiUrl: "",
        jwtToken: "",
        waMethod: "url-local",
        autoSendWhatsApp: true,
        publicWebUrl: ""
    };
    state.settings = JSON.parse(localStorage.getItem("gk_settings")) || defaultSettings;

    // --- Data Migration: Update stale demo visitor dates to today ---
    // If gk_visitors was never saved (first run), visitors use DEFAULT_VISITORS which have hardcoded past dates.
    // Refresh them to today so "Today's Visitors" report shows data immediately.
    const todayLocal = getLocalDateStr();
    const DEMO_DATES = ["2026-07-07", "2026-07-08"]; // hardcoded dates in DEFAULT_VISITORS seed
    let dataMigrated = false;
    state.visitors.forEach(v => {
        if (DEMO_DATES.includes(v.visitDate)) {
            v.visitDate = todayLocal;
            // Also fix check-in timestamps so they display as today
            if (v.checkIn && DEMO_DATES.some(d => v.checkIn.startsWith(d))) {
                v.checkIn = todayLocal + v.checkIn.slice(10);
            }
            if (v.checkOut && DEMO_DATES.some(d => v.checkOut.startsWith(d))) {
                v.checkOut = todayLocal + v.checkOut.slice(10);
            }
            dataMigrated = true;
        }
    });
    if (dataMigrated) {
        localStorage.setItem("gk_visitors", JSON.stringify(state.visitors));
    }

    // Performance Maps initialization
    rebuildVisitorIndexes();
}

let visitorsIdMap = new Map();
let visitorsPhoneMap = new Map();

function rebuildVisitorIndexes() {
    visitorsIdMap.clear();
    visitorsPhoneMap.clear();
    if (state.visitors) {
        state.visitors.forEach(v => {
            if (v.id) visitorsIdMap.set(v.id.toUpperCase(), v);
            if (v.phone) visitorsPhoneMap.set(v.phone.trim(), v);
        });
    }
}

function saveState() {
    // Rebuild Map indexes on state updates to maintain cache synchronization
    rebuildVisitorIndexes();

    localStorage.setItem("gk_employees", JSON.stringify(state.employees));
    localStorage.setItem("gk_visitors", JSON.stringify(state.visitors));
    localStorage.setItem("gk_security_users", JSON.stringify(state.securityUsers));
    localStorage.setItem("gk_departments", JSON.stringify(state.departments));
    localStorage.setItem("gk_notifications", JSON.stringify(state.notifications));
    localStorage.setItem("gk_dispatch_logs", JSON.stringify(state.dispatchLogs));
    localStorage.setItem("gk_blacklist", JSON.stringify(state.blacklist));
    localStorage.setItem("gk_purchase_manuals", JSON.stringify(state.purchaseManuals));
    localStorage.setItem("gk_purchase_manual_approvals", JSON.stringify(state.purchaseManualApprovals));
    localStorage.setItem("gk_purchase_manual_attachments", JSON.stringify(state.purchaseManualAttachments));
    localStorage.setItem("gk_work_permits", JSON.stringify(state.workPermits));
    localStorage.setItem("gk_audit_logs", JSON.stringify(state.auditLogs));
    localStorage.setItem("gk_student_master", JSON.stringify(state.studentMaster));
    localStorage.setItem("gk_customer_master", JSON.stringify(state.customerMaster));
    localStorage.setItem("gk_vendor_master", JSON.stringify(state.vendorMaster));
    localStorage.setItem("gk_contractor_master", JSON.stringify(state.contractorMaster));
    localStorage.setItem("gk_delivery_master", JSON.stringify(state.deliveryMaster));
    localStorage.setItem("gk_service_engineer_master", JSON.stringify(state.serviceEngineerMaster));
    localStorage.setItem("gk_lang", state.currentLang);
    localStorage.setItem("gk_settings", JSON.stringify(state.settings));
    if (state.currentUser) {
        localStorage.setItem("gk_current_user", JSON.stringify(state.currentUser));
    } else {
        localStorage.removeItem("gk_current_user");
    }

    // Automatically trigger AI model updates on state changes (self-learning pipeline)
    if (window.vmsAi) {
        window.vmsAi.train(state);
    }
}

// CNIC Formatting Helper (12345-1234567-1 format)
function formatCNIC(value) {
    const numbers = value.replace(/\D/g, "");
    let formatted = "";
    for (let i = 0; i < numbers.length && i < 13; i++) {
        if (i === 5 || i === 12) {
            formatted += "-";
        }
        formatted += numbers[i];
    }
    return formatted;
}

// Update Placeholder of ID Number input dynamically
function updateIdNumberPlaceholder() {
    const idTypeSelect = document.getElementById("reg-visitor-id-type");
    const idNumberInput = document.getElementById("reg-visitor-id-number");
    if (!idTypeSelect || !idNumberInput) return;

    const idType = idTypeSelect.value;
    let key = "id-serial-placeholder";
    if (idType === "Aadhaar") key = "placeholder-aadhaar";
    else if (idType === "PAN Card") key = "placeholder-pan";
    else if (idType === "CNIC") key = "placeholder-cnic";
    else if (idType === "Passport") key = "placeholder-passport";
    else if (idType === "Driver License") key = "placeholder-dl";
    else if (idType === "Company ID") key = "placeholder-company-id";

    idNumberInput.setAttribute("data-i18n-placeholder", key);

    const lang = state.currentLang || "en";
    if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key] !== undefined) {
        idNumberInput.placeholder = TRANSLATIONS[lang][key];
    }
}

// Translation Engine Helpers
function getTranslatedText(key, defaultVal = "") {
    const lang = state.currentLang || "en";
    if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key] !== undefined) {
        return TRANSLATIONS[lang][key];
    }
    return defaultVal;
}

function translatePage() {
    const lang = state.currentLang || "en";

    // Update HTML element lang attribute
    document.documentElement.setAttribute("lang", lang);

    // Translate standard text nodes
    document.querySelectorAll("[data-i18n]").forEach(elem => {
        const key = elem.getAttribute("data-i18n");
        if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key] !== undefined) {
            elem.innerText = TRANSLATIONS[lang][key];
        }
    });

    // Translate nodes containing HTML tags
    document.querySelectorAll("[data-i18n-html]").forEach(elem => {
        const key = elem.getAttribute("data-i18n-html");
        if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key] !== undefined) {
            elem.innerHTML = TRANSLATIONS[lang][key];
        }
    });

    // Translate element placeholder attributes
    document.querySelectorAll("[data-i18n-placeholder]").forEach(elem => {
        const key = elem.getAttribute("data-i18n-placeholder");
        if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key] !== undefined) {
            elem.setAttribute("placeholder", TRANSLATIONS[lang][key]);
        }
    });

    // Sync active values of both language selector selects
    const loginSelect = document.getElementById("login-lang-select");
    const headerSelect = document.getElementById("header-lang-select");
    if (loginSelect) loginSelect.value = lang;
    if (headerSelect) headerSelect.value = lang;

    // Update Welcome greeting and dynamic active page title
    const pageTitle = document.getElementById("page-title");
    const pageSubtitle = document.getElementById("page-subtitle");
    if (pageTitle && pageSubtitle) {
        // Find the title matching the active view ID
        const titleKeyMap = {
            "view-dashboard": { titleKey: "title-dashboard", subKey: "sub-dashboard" },
            "view-registration": { titleKey: "title-registration", subKey: "sub-registration" },
            "view-employee-search": { titleKey: "title-employee-search", subKey: "sub-employee-search" },
            "view-checkout": { titleKey: "title-checkout", subKey: "sub-checkout" },
            "view-history": { titleKey: "title-history", subKey: "sub-history" },
            "view-reports": { titleKey: "title-reports", subKey: "sub-reports" },
            "view-settings": { titleKey: "title-settings", subKey: "sub-settings" }
        };

        const activeMap = titleKeyMap[state.activeView];
        if (activeMap) {
            pageTitle.innerText = getTranslatedText(activeMap.titleKey, pageTitle.innerText);
            let sub = getTranslatedText(activeMap.subKey, pageSubtitle.innerText);
            if (activeMap.subKey === "sub-dashboard") {
                sub = sub.replace("{name}", state.currentUser ? state.currentUser.name : (lang === "ta" ? 'பாதுகாப்பு அதிகாரி' : 'Officer'));
            }
            pageSubtitle.innerText = sub;
        }
    }
    updateIdNumberPlaceholder();
}

function setLanguage(lang) {
    state.currentLang = lang;
    saveState();
    translatePage();
}

// 2. Initial Setup and DOM Lifecycles
document.addEventListener("DOMContentLoaded", () => {
    // Initialize Theme Mode
    const savedTheme = localStorage.getItem("gk_theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    setTimeout(() => updateThemeIcons(savedTheme), 50);

    loadState();
    translatePage();
    setupClock();
    setupEventListeners();
    initializeNewFeatures();
    initializeCloudSettings();
    checkAuthSession();

    // Check if returning from host email approval link click
    checkUrlApprovalAction();
    renderSimulatedEmailInbox();
});

// System Real-time Clock
function setupClock() {
    const timeEl = document.getElementById("real-time");
    function updateClock() {
        const now = new Date();
        timeEl.innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
    updateClock();
    setInterval(updateClock, 1000);
}

// Authentication Session State Check
async function checkAuthSession() {
    const loginContainer = document.getElementById("login-container");
    const mainAppContainer = document.getElementById("main-app-container");
    const loginLoadingOverlay = document.getElementById("login-loading-overlay");

    // Hide any login loading overlays if present
    if (loginLoadingOverlay) loginLoadingOverlay.classList.add("hidden");

    // Restore active Supabase session on startup / page refresh
    if (supabaseClient && !state.currentUser) {
        try {
            const { data, error } = await supabaseClient.auth.getSession();
            if (data && data.session && data.session.user) {
                const profile = await fetchUserProfileAndRole(data.session.user);
                if (profile) {
                    state.currentUser = profile;
                    saveState();
                    showToast("Session Restored", getTranslatedText("logged-in-as", "Logged in as {name}").replace("{name}", state.currentUser.name), "success");
                }
            }
        } catch (e) {
            console.error("[checkAuthSession] Session restoration failed:", e);
        }
    }

    if (state.currentUser) {
        loginContainer.classList.add("hidden");
        mainAppContainer.classList.remove("hidden");

        // Configure User Profile UI elements in header
        document.getElementById("header-user-name").innerText = state.currentUser.name;
        document.getElementById("header-user-role").innerText = getTranslatedText("role-" + state.currentUser.role.toLowerCase().replace(/ /g, "-"), state.currentUser.role);
        document.getElementById("header-user-avatar").innerText = state.currentUser.name.split(" ").map(n => n[0]).join("");

        const role = state.currentUser.role.toLowerCase();
        const isAdmin = role === "admin" || role === "administrator";
        const isGatekeeper = role === "gatekeeper" || role === "security gatekeeper";
        const isReception = role === "receptionist" || role === "front desk operator";
        const isSecurity = isGatekeeper || isReception || role === "security";
        const isEmployee = role === "employee";

        // Show/Hide sidebar navigation links based on role privileges
        document.querySelectorAll(".nav-link").forEach(link => {
            const target = link.getAttribute("data-target");
            if (isAdmin) {
                const adminViews = ["view-dashboard", "view-reports", "view-data-management", "view-work-permit", "view-purchase-manual", "view-settings"];
                if (adminViews.includes(target)) {
                    link.classList.remove("hidden");
                } else {
                    link.classList.add("hidden");
                }
            } else if (isSecurity) {
                const securityViews = ["view-dashboard", "view-reports"];
                if (securityViews.includes(target)) {
                    link.classList.remove("hidden");
                } else {
                    link.classList.add("hidden");
                }
            } else if (isEmployee) {
                const employeeViews = ["view-dashboard", "view-reports"];
                if (employeeViews.includes(target)) {
                    link.classList.remove("hidden");
                } else {
                    link.classList.add("hidden");
                }
            }
        });

        // Toggle Dashboard wrappers based on Administrator/Security vs Employee portal
        const visitorWrapper = document.getElementById("visitor-registration-wrapper");
        const empDashboardWrapper = document.getElementById("employee-dashboard-wrapper");

        if (isAdmin || isSecurity) {
            if (visitorWrapper) visitorWrapper.classList.remove("hidden");
            if (empDashboardWrapper) empDashboardWrapper.classList.add("hidden");

            const selector = document.querySelector(".entry-type-selector");
            if (selector) {
                if (isGatekeeper) selector.classList.add("hidden");
                else selector.classList.remove("hidden");
            }
        } else if (isEmployee) {
            if (visitorWrapper) visitorWrapper.classList.add("hidden");
            if (empDashboardWrapper) empDashboardWrapper.classList.remove("hidden");
            renderEmployeeDashboard();
        }

        // Parse initial URL path for routing
        const initialPath = window.location.pathname || "/";
        window.navigateTo(initialPath, false);

        // Welcome subtitle greeting
        document.getElementById("page-subtitle").innerText = getTranslatedText("sub-dashboard", "Welcome, {name}").replace("{name}", state.currentUser.name);

        // Route to active view
        switchView(state.activeView);
        refreshAllDataViews();
    } else {
        loginContainer.classList.remove("hidden");
        mainAppContainer.classList.add("hidden");
        stopCamera();
    }
}

// Dynamically fetch role from security_users or employees Supabase tables
async function fetchUserProfileAndRole(user) {
    if (!supabaseClient) return null;
    try {
        // Query security_users table
        const { data: profile, error: profileErr } = await supabaseClient
            .from('security_users')
            .select('*')
            .eq('id', user.id)
            .single();

        if (!profileErr && profile) {
            return {
                username: profile.username,
                name: profile.name,
                role: profile.role,
                phone: profile.phone,
                shift: profile.shift
            };
        }

        // Query employees table by email fallback (for host/employee accounts)
        if (user.email) {
            const { data: emp, error: empErr } = await supabaseClient
                .from('employees')
                .select('*')
                .eq('email', user.email)
                .single();

            if (!empErr && emp) {
                return {
                    username: emp.employee_code.toLowerCase(),
                    name: emp.name,
                    role: "Employee",
                    employeeCode: emp.employee_code,
                    phone: emp.phone,
                    shift: "Regular",
                    dept: emp.dept,
                    designation: emp.designation,
                    cabin: emp.cabin
                };
            }
        }
    } catch (e) {
        console.error("[fetchUserProfileAndRole] Profiles table role retrieval error:", e);
    }
    return null;
}

// Render Host Employee Dashboard portal logs and clearances
function renderEmployeeDashboard() {
    if (!state.currentUser || state.currentUser.role.toLowerCase() !== "employee") return;

    const name = state.currentUser.name || "";
    const code = state.currentUser.employeeCode || state.currentUser.username || "";
    const dept = state.currentUser.dept || "Engineering";
    const designation = state.currentUser.designation || "Staff Member";
    const phone = state.currentUser.phone || "Ext. 9988";
    const cabin = state.currentUser.cabin || "Room 101";

    const avatarEl = document.getElementById("emp-dash-avatar");
    if (avatarEl) avatarEl.innerText = name.split(" ").map(n => n[0]).join("");

    const nameEl = document.getElementById("emp-dash-name");
    if (nameEl) nameEl.innerText = name;

    const codeEl = document.getElementById("emp-dash-code");
    if (codeEl) codeEl.innerText = code.toUpperCase();

    const deptEl = document.getElementById("emp-dash-dept");
    if (deptEl) deptEl.innerText = dept;

    const desEl = document.getElementById("emp-dash-designation");
    if (desEl) desEl.innerText = designation;

    const phoneEl = document.getElementById("emp-dash-phone");
    if (phoneEl) phoneEl.innerText = phone;

    const cabinEl = document.getElementById("emp-dash-cabin");
    if (cabinEl) cabinEl.innerText = cabin;

    // Filter Pending guest clearances where current employee is the host
    const pendingGuests = state.visitors.filter(v => {
        const hostIdMatch = v.hostId && code && v.hostId.toLowerCase() === code.toLowerCase();
        const hostNameMatch = v.hostName && name && v.hostName.toLowerCase() === name.toLowerCase();
        return (hostIdMatch || hostNameMatch) && v.status === "Pending";
    });

    const countEl = document.getElementById("emp-dash-pending-count");
    if (countEl) countEl.innerText = `${pendingGuests.length} Waiting`;

    const pendingList = document.getElementById("emp-dash-pending-list");
    if (pendingList) {
        pendingList.innerHTML = "";
        if (pendingGuests.length === 0) {
            pendingList.innerHTML = `
                <div style="text-align: center; color: var(--text-muted); padding: 3.5rem 0;" class="text-sm">
                    No pending visitor approval requests.
                </div>
            `;
        } else {
            pendingGuests.forEach(v => {
                const card = document.createElement("div");
                card.style.padding = "0.75rem 1rem";
                card.style.border = "1px solid var(--border-color)";
                card.style.borderRadius = "var(--border-radius-md)";
                card.style.background = "var(--bg-body)";
                card.style.display = "flex";
                card.style.justifyContent = "space-between";
                card.style.alignItems = "center";
                card.style.gap = "10px";
                card.style.marginBottom = "0.5rem";

                card.innerHTML = `
                    <div style="flex-grow: 1;">
                        <div style="font-weight: 700; color: var(--text-primary);">${v.name}</div>
                        <div style="font-size: 0.75rem; color: var(--text-secondary);">${v.company || "Independent"} | Purpose: ${v.purpose}</div>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <button type="button" class="btn btn-primary btn-sm" onclick="handleEmployeeClearance('${v.id}', 'Approve')" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;">Approve</button>
                        <button type="button" class="btn btn-danger btn-sm" onclick="handleEmployeeClearance('${v.id}', 'Reject')" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;">Reject</button>
                    </div>
                `;
                pendingList.appendChild(card);
            });
        }
    }

    // Filter host visit history logs
    const historyLogs = state.visitors.filter(v => {
        const hostIdMatch = v.hostId && code && v.hostId.toLowerCase() === code.toLowerCase();
        const hostNameMatch = v.hostName && name && v.hostName.toLowerCase() === name.toLowerCase();
        return (hostIdMatch || hostNameMatch);
    });

    const historyBody = document.getElementById("emp-dash-history-body");
    if (historyBody) {
        historyBody.innerHTML = "";
        if (historyLogs.length === 0) {
            historyBody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 2rem 0; color: var(--text-muted);">No visit logs found.</td></tr>`;
        } else {
            historyLogs.forEach(v => {
                const tr = document.createElement("tr");
                tr.style.borderBottom = "1px solid var(--border-color)";

                const checkInFormatted = v.checkIn ? new Date(v.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-";
                const checkOutFormatted = v.checkOut ? new Date(v.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-";
                const statusClass = v.status.toLowerCase().replace(/ /g, "-");

                tr.innerHTML = `
                    <td style="padding: 10px;"><code>${v.id}</code></td>
                    <td style="padding: 10px;">
                        <div style="font-weight: 600;">${v.name}</div>
                        <div style="font-size: 0.75rem; color: var(--text-secondary);">${v.company || "Independent"} | ${v.phone}</div>
                    </td>
                    <td style="padding: 10px;">${v.purpose}</td>
                    <td style="padding: 10px;">${v.visitDate}</td>
                    <td style="padding: 10px;">${checkInFormatted}</td>
                    <td style="padding: 10px;">${checkOutFormatted}</td>
                    <td style="padding: 10px;"><span class="badge-status ${statusClass}">${v.status}</span></td>
                `;
                historyBody.appendChild(tr);
            });
        }
    }
}

// Handle approvals/rejections directly inside the Employee Dashboard
window.handleEmployeeClearance = async function (visitorId, action) {
    if (action === 'Approve') {
        await window.approvePendingVisitor(visitorId);
    } else {
        const visitor = state.visitors.find(v => v.id === visitorId);
        if (visitor) {
            const reason = prompt("Enter rejection reason:", "Unavailable") || "Denied by host";
            visitor.rejectionReason = reason;
        }
        rejectPendingVisitor(visitorId);
    }
    renderEmployeeDashboard();
};

// Role checking helper
function isViewAuthorized(viewId) {
    if (!state.currentUser) return false;
    const role = state.currentUser.role.toLowerCase();

    // Admin bypasses all restrictions
    if (role === "admin" || role === "administrator") return true;

    // Security Users (Security Gatekeeper, Front Desk Operator)
    if (role === "security gatekeeper" || role === "front desk operator" || role === "gatekeeper" || role === "security") {
        const allowed = [
            "view-dashboard",
            "view-reports",
            "view-student-registration",
            "view-customer-registration",
            "view-vendor-registration",
            "view-contractor-registration",
            "view-delivery-registration",
            "view-service-engineer-registration"
        ];
        return allowed.includes(viewId);
    }

    // Host Employees
    if (role === "employee") {
        const allowed = [
            "view-dashboard",
            "view-reports"
        ];
        return allowed.includes(viewId);
    }

    return false;
}

// Navigation Routing Router
window.navigateTo = function (path, pushState = true) {
    if (!state.currentUser) {
        document.getElementById("login-container").classList.remove("hidden");
        document.getElementById("main-app-container").classList.add("hidden");
        stopCamera();
        return;
    }

    // Path mapping to viewId
    const pathMap = {
        "/": "view-dashboard",
        "/dashboard": "view-dashboard",
        "/student-registration": "view-student-registration",
        "/customer-registration": "view-customer-registration",
        "/vendor-registration": "view-vendor-registration",
        "/reports": "view-reports",
        "/data-management": "view-data-management",
        "/work-permit": "view-work-permit",
        "/purchase-manual": "view-purchase-manual",
        "/settings": "view-settings"
    };

    let viewId = pathMap[path] || "view-dashboard";

    if (!isViewAuthorized(viewId)) {
        showToast(
            "Access Denied",
            `Your security role (${state.currentUser.role}) is not authorized to access this page.`,
            "danger"
        );
        // Redirect to Dashboard if logged in to prevent loop
        if (path !== "/dashboard" && path !== "/") {
            window.navigateTo("/dashboard", false);
        }
        return;
    }

    state.activeView = viewId;
    saveState();

    if (pushState) {
        try {
            history.pushState(null, "", path);
        } catch (e) {
            console.warn("history.pushState not supported in local file context:", e);
        }
    }

    switchView(viewId);
};

function switchView(viewId) {
    state.activeView = viewId;

    // Toggle active view panel
    document.querySelectorAll(".page-view").forEach(view => {
        view.classList.remove("active");
    });

    const activePanel = document.getElementById(viewId);
    if (activePanel) {
        activePanel.classList.add("active");
    }

    // Toggle active link styles
    document.querySelectorAll(".nav-link").forEach(link => {
        link.classList.remove("active");
        const linkTarget = link.getAttribute("data-target");
        if (state.activeSidebarTarget) {
            if (linkTarget === state.activeSidebarTarget) {
                link.classList.add("active");
            }
        } else {
            if (linkTarget === viewId ||
                (viewId === "view-student-registration" && linkTarget === "reg-student") ||
                (viewId === "view-customer-registration" && linkTarget === "reg-customer") ||
                (viewId === "view-vendor-registration" && linkTarget === "reg-vendor")) {
                link.classList.add("active");
            }
        }
    });

    // Update Header Text Titles (Translated)
    const titleMap = {
        "view-dashboard": {
            title: getTranslatedText("title-dashboard", "Dashboard Control Panel"),
            sub: getTranslatedText("sub-dashboard", "Welcome, {name}").replace("{name}", state.currentUser ? state.currentUser.name : 'Officer')
        },
        "view-student-registration": {
            title: "Student Registration",
            sub: "Search profiles and check-in student visits"
        },
        "view-customer-registration": {
            title: "Customer Registration",
            sub: "Search profiles and check-in customer visits"
        },
        "view-vendor-registration": {
            title: "Vendor Registration",
            sub: "Search profiles and check-in vendor visits"
        },
        "view-employee-search": {
            title: getTranslatedText("title-employee-search", "Employee Corporate Index"),
            sub: getTranslatedText("sub-employee-search", "Locate office spaces, extension lines, and duty stations")
        },
        "view-checkout": {
            title: getTranslatedText("title-checkout", "Visitor Gate Clearance Terminal"),
            sub: getTranslatedText("sub-checkout", "Enter temporary pass serials to execute check-outs")
        },
        "view-history": {
            title: getTranslatedText("title-history", "Gate Audit Logs & Archives"),
            sub: getTranslatedText("sub-history", "Historical entries database files registry")
        },
        "view-reports": {
            title: getTranslatedText("title-reports", "Analytical Reports Hub"),
            sub: getTranslatedText("sub-reports", "Export CSV records and review peak operational visitor logs")
        },
        "view-settings": {
            title: getTranslatedText("title-settings", "VMS System Configurations"),
            sub: getTranslatedText("sub-settings", "Configure profiles, notifications, and manage backups")
        },
        "view-purchase-manual": {
            title: getTranslatedText("title-purchase-manual", "Purchase Manual Management"),
            sub: getTranslatedText("sub-purchase-manual", "Draft, submit, and manage facility purchase manual registers")
        },
        "view-work-permit": {
            title: getTranslatedText("title-work-permit", "Work Permit & Access Clearance"),
            sub: getTranslatedText("sub-work-permit", "Submit and authorize high-risk activity permits linked to approved manuals")
        },
        "view-data-management": {
            title: "Data Management Console",
            sub: "Access, filter, export, and print master database logs"
        }
    };

    if (titleMap[viewId]) {
        document.getElementById("page-title").innerText = titleMap[viewId].title;
        document.getElementById("page-subtitle").innerText = titleMap[viewId].sub;
    }

    // Dynamic breadcrumb updates
    const breadcrumbs = document.getElementById("app-breadcrumbs");
    if (breadcrumbs) {
        if (viewId === "view-student-registration") {
            breadcrumbs.innerHTML = `
                <span style="cursor: pointer; font-weight: 500;" onclick="navigateTo('/dashboard')">Dashboard</span>
                <span style="margin: 0 4px;">&rsaquo;</span>
                <span id="breadcrumb-active" style="color: var(--accent-primary); font-weight: 500;">Student Registration</span>
            `;
        } else if (viewId === "view-customer-registration") {
            breadcrumbs.innerHTML = `
                <span style="cursor: pointer; font-weight: 500;" onclick="navigateTo('/dashboard')">Dashboard</span>
                <span style="margin: 0 4px;">&rsaquo;</span>
                <span id="breadcrumb-active" style="color: var(--accent-primary); font-weight: 500;">Customer Registration</span>
            `;
        } else if (viewId === "view-vendor-registration") {
            breadcrumbs.innerHTML = `
                <span style="cursor: pointer; font-weight: 500;" onclick="navigateTo('/dashboard')">Dashboard</span>
                <span style="margin: 0 4px;">&rsaquo;</span>
                <span id="breadcrumb-active" style="color: var(--accent-primary); font-weight: 500;">Vendor Registration</span>
            `;
        } else if (viewId === "view-data-management") {
            breadcrumbs.innerHTML = `
                <span style="cursor: pointer; font-weight: 500;" onclick="navigateTo('/dashboard')">Dashboard</span>
                <span style="margin: 0 4px;">&rsaquo;</span>
                <span id="breadcrumb-active" style="color: var(--accent-primary); font-weight: 500;">Data Management</span>
            `;
        } else {
            const label = viewId === "view-dashboard" ? "Dashboard" : (titleMap[viewId] ? titleMap[viewId].title : "VMS");
            breadcrumbs.innerHTML = `
                <span style="cursor: pointer;" onclick="navigateTo('/dashboard')">VMS</span>
                <span style="margin: 0 4px;">&rsaquo;</span>
                <span id="breadcrumb-active" style="color: var(--accent-primary); font-weight: 500;">${label}</span>
            `;
        }
    }

    // Dynamic execution specific view setups
    if (viewId === "view-reports") {
        renderReportsData("today");
    } else if (viewId === "view-settings") {
        renderSettingsData();
    } else if (viewId === "view-data-management") {
        renderDataManagementTab(state.activeDMTab || "dm-tab-students");
    } else if (viewId === "view-student-registration") {
        openCategoryForm("student");
    } else if (viewId === "view-customer-registration") {
        openCategoryForm("customer");
    } else if (viewId === "view-vendor-registration") {
        openCategoryForm("vendor");
    }

    // Hide drawer overlay
    document.getElementById("notifications-panel").classList.remove("active");
}

// Global Event Bindings
function setupEventListeners() {
    // Language selectors
    const loginSelect = document.getElementById("login-lang-select");
    if (loginSelect) {
        loginSelect.addEventListener("change", (e) => setLanguage(e.target.value));
    }
    const headerSelect = document.getElementById("header-lang-select");
    if (headerSelect) {
        headerSelect.addEventListener("change", (e) => setLanguage(e.target.value));
    }

    // 1. Auth Forms
    document.getElementById("login-form").addEventListener("submit", handleLoginSubmit);
    document.getElementById("btn-logout").addEventListener("click", handleLogoutClick);

    // 2. Navigation Clicks
    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", (e) => {
            const target = link.getAttribute("data-target");
            if (target === "view-work-permit" && link.classList.contains("disabled")) {
                showToast(
                    state.currentLang === "ta" ? "அனுமதி மறுக்கப்பட்டது" : "Access Denied",
                    state.currentLang === "ta" ? "வேலை அனுமதிச்சீட்டை உருவாக்குவதற்கு முன் கொள்முதல் கையேடு பூர்த்தி செய்யப்பட்டு அங்கீகரிக்கப்பட வேண்டும்." : "Purchase Manual must be completed and approved before a Work Permit can be created.",
                    "warning"
                );
                return;
            }

            state.activeSidebarTarget = target;

            // Map target to path
            const targetToPathMap = {
                "view-dashboard": "/dashboard",
                "reg-student": "/student-registration",
                "reg-customer": "/customer-registration",
                "reg-vendor": "/vendor-registration",
                "view-reports": "/reports",
                "view-data-management": "/data-management",
                "view-employee-search": "/employee-search",
                "view-checkout": "/checkout",
                "view-purchase-manual": "/purchase-manual",
                "view-settings": "/settings"
            };

            const path = targetToPathMap[target] || "/dashboard";
            window.navigateTo(path);
        });
    });

    // 3. Quick Action Clicks in Dashboard (Guarded for dashboard simplification)
    const btnQuickRegister = document.getElementById("btn-quick-register");
    if (btnQuickRegister) btnQuickRegister.addEventListener("click", () => switchView("view-registration"));

    const btnQuickSearch = document.getElementById("btn-quick-search");
    if (btnQuickSearch) btnQuickSearch.addEventListener("click", () => switchView("view-employee-search"));

    const btnQuickCheckout = document.getElementById("btn-quick-checkout");
    if (btnQuickCheckout) btnQuickCheckout.addEventListener("click", () => switchView("view-checkout"));

    const btnQuickHistory = document.getElementById("btn-quick-history");
    if (btnQuickHistory) btnQuickHistory.addEventListener("click", () => switchView("view-history"));

    const btnQuickReports = document.getElementById("btn-quick-reports");
    if (btnQuickReports) btnQuickReports.addEventListener("click", () => switchView("view-reports"));

    // 4. Employee Autocomplete setup for Category Forms
    setupAutocompleteInput("reg-student-host", "reg-student-host-suggestions");
    setupAutocompleteInput("reg-customer-host", "reg-customer-host-suggestions");
    setupAutocompleteInput("reg-vendor-host", "reg-vendor-host-suggestions");
    setupAutocompleteInput("reg-contractor-host", "reg-contractor-host-suggestions");
    setupAutocompleteInput("reg-delivery-host", "reg-delivery-host-suggestions");
    setupAutocompleteInput("reg-service-engineer-host", "reg-service-engineer-host-suggestions");

    // 5. Category Photo File Upload actions
    const categories = ["student", "customer", "vendor", "contractor", "delivery", "service-engineer"];
    categories.forEach(cat => {
        const input = document.getElementById(`visitor-photo-file-${cat}`);
        if (input) {
            input.addEventListener("change", (e) => handleCategoryPhotoFileUpload(e, cat));
        }
    });

    // Student ID doc upload proof binding
    const studentIdDocInput = document.getElementById("reg-student-id-doc-file");
    if (studentIdDocInput) {
        studentIdDocInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const label = document.getElementById("student-id-doc-label");
            if (label) label.innerText = file.name;

            const reader = new FileReader();
            reader.onload = function (evt) {
                state.tempVisitorIdDoc = evt.target.result;
                showToast("ID Attached", "College ID document attached successfully.", "success");
            };
            reader.readAsDataURL(file);
        });
    }

    // 6. Registration Forms Submissions
    document.getElementById("student-registration-form").addEventListener("submit", handleStudentRegistrationSubmit);
    document.getElementById("customer-registration-form").addEventListener("submit", handleCustomerRegistrationSubmit);
    document.getElementById("vendor-registration-form").addEventListener("submit", handleVendorRegistrationSubmit);
    document.getElementById("contractor-registration-form").addEventListener("submit", handleContractorRegistrationSubmit);
    document.getElementById("delivery-registration-form").addEventListener("submit", handleDeliveryRegistrationSubmit);
    document.getElementById("service-engineer-registration-form").addEventListener("submit", handleServiceEngineerRegistrationSubmit);

    document.getElementById("btn-confirm-registration").addEventListener("click", finalizeVisitorIntake);

    const idTypeSelect = document.getElementById("reg-visitor-id-type");
    if (idTypeSelect) {
        idTypeSelect.addEventListener("change", () => {
            updateIdNumberPlaceholder();
            const idNumberInput = document.getElementById("reg-visitor-id-number");
            if (idNumberInput && idTypeSelect.value === "CNIC") {
                idNumberInput.value = formatCNIC(idNumberInput.value);
            }
        });
    }

    const idNumberInput = document.getElementById("reg-visitor-id-number");
    if (idNumberInput) {
        idNumberInput.addEventListener("input", (e) => {
            const idType = document.getElementById("reg-visitor-id-type").value;
            if (idType === "CNIC") {
                const start = e.target.selectionStart;
                const value = e.target.value;
                const formatted = formatCNIC(value);
                e.target.value = formatted;
                if (start < value.length) {
                    e.target.setSelectionRange(start, start);
                }
            }
        });
    }

    // 7. Employee Search Screen
    document.getElementById("employee-search-form").addEventListener("submit", handleEmployeeSearch);

    // 8. Checkout Screens
    document.getElementById("checkout-search-form").addEventListener("submit", handleCheckoutSearch);
    document.getElementById("btn-execute-checkout").addEventListener("click", executeCheckoutAction);
    document.getElementById("btn-trigger-qr-scanner").addEventListener("click", openQRScannerModal);
    document.getElementById("btn-simulate-qr-scan").addEventListener("click", executeQRScanSimulation);

    // 9. History Filter
    document.getElementById("history-search-keyword").addEventListener("input", filterHistoryLogs);
    document.getElementById("history-filter-date").addEventListener("change", filterHistoryLogs);
    document.getElementById("btn-clear-history-filters").addEventListener("click", () => {
        setTimeout(renderHistoryView, 100);
    });


    // 11. Admin Panel Tabs Selector
    document.querySelectorAll(".admin-tab-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            document.querySelectorAll(".admin-tab-btn").forEach(b => b.classList.remove("active"));
            document.querySelectorAll(".admin-panel-tab").forEach(p => p.classList.remove("active"));

            btn.classList.add("active");
            const targetTab = btn.getAttribute("data-tab");
            document.getElementById(targetTab).classList.add("active");

            if (targetTab === "admin-tab-audit") {
                renderAuditLogsTable();
            }
        });
    });

    // CRUD modals triggers
    document.getElementById("btn-add-employee-modal").addEventListener("click", () => openEmployeeModal());
    document.getElementById("employee-crud-form").addEventListener("submit", saveEmployeeCRUD);
    document.getElementById("btn-add-security-modal").addEventListener("click", () => openSecurityModal());
    document.getElementById("security-user-crud-form").addEventListener("submit", saveSecurityCRUD);

    // Settings config submission
    document.getElementById("cfg-terminal-gate").addEventListener("change", (e) => {
        document.getElementById("display-gate-name").innerText = e.target.value;
        showToast("Settings Updated", "Gate terminal branding name changed.", "success");
        addAuditLog("Update Gate Name", "Settings", `Changed gate branding name to: ${e.target.value}`);
    });

    // Add additional settings triggers
    const settingsInputs = [
        "cfg-sms-provider", "cfg-wa-token", "cfg-wa-phone-id",
        "cfg-smtp-host", "cfg-smtp-port", "cfg-camera-select",
        "cfg-printer-select", "cfg-pass-template"
    ];
    settingsInputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener("change", (e) => {
                showToast("Settings Updated", `Configured value saved for ${id.replace('cfg-', '').toUpperCase()}`, "success");
                addAuditLog("Update System Config", "Settings", `Modified configuration parameter: ${id}`);
            });
        }
    });

    // Clear Audit Logs button
    const btnClearAudit = document.getElementById("btn-clear-audit-logs");
    if (btnClearAudit) {
        btnClearAudit.addEventListener("click", () => {
            state.auditLogs = [];
            saveState();
            renderAuditLogsTable();
            showToast("Cleaned", "Audit trail records deleted.", "info");
        });
    }

    // 12. Backup Database exports & imports file triggers
    document.getElementById("btn-export-db").addEventListener("click", exportDatabaseJSON);
    document.getElementById("import-db-file").addEventListener("change", importDatabaseJSON);

    // 13. Notifications alerts Bell triggers overlay
    document.getElementById("trigger-notifications-panel").addEventListener("click", (e) => {
        e.stopPropagation();
        document.getElementById("notifications-panel").classList.toggle("active");
    });

    document.getElementById("btn-clear-notifications").addEventListener("click", () => {
        state.notifications = [];
        saveState();
        renderNotificationsDrawer();
        showToast("Cleaned", "Alert messages deleted.", "info");
    });

    // 14. Modals close click bindings
    document.querySelectorAll(".btn-close-modal").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".app-modal").forEach(m => m.classList.remove("active"));
            stopCamera();
            if (typeof stopQRScannerStream === "function") stopQRScannerStream();
            if (typeof stopCategoryCameras === "function") stopCategoryCameras();
        });
    });

    // Theme Switcher click
    const btnToggleTheme = document.getElementById("btn-toggle-theme");
    if (btnToggleTheme) {
        btnToggleTheme.addEventListener("click", () => {
            const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
            const newTheme = currentTheme === "dark" ? "light" : "dark";

            document.documentElement.setAttribute("data-theme", newTheme);
            localStorage.setItem("gk_theme", newTheme);
            updateThemeIcons(newTheme);

            showToast("Theme Switched", `Switched to ${newTheme === "dark" ? "Dark Mode" : "Light Mode"}.`, "info");
        });
    }

    // Badge Actions: Print, Download, WhatsApp Share
    document.getElementById("btn-print-badge").addEventListener("click", () => {
        window.print();
        const visitorId = document.getElementById("badge-serial-id").innerText;
        addAuditLog("Print Pass Card", "Security", `Printed ID pass card for visitor code: ${visitorId}`);
    });

    const btnPrintWP = document.getElementById("btn-print-work-permit");
    if (btnPrintWP) {
        btnPrintWP.addEventListener("click", () => {
            window.print();
            const wpId = document.getElementById("wp-preview-id").innerText;
            addAuditLog("Print Work Permit", "Admin", `Printed high risk work permit: ${wpId}`);
        });
    }




    const btnSharePassWA = document.getElementById("btn-share-badge-wa");
    if (btnSharePassWA) {
        btnSharePassWA.addEventListener("click", () => {
            const visitorId = document.getElementById("badge-serial-id").innerText;
            const visitor = state.visitors.find(v => v.id === visitorId);
            if (visitor) {
                let targetWindow = null;
                const method = state.settings?.waMethod || "url-local";
                if (method !== "meta" && method !== "sim") {
                    targetWindow = window.open("", "_blank");
                }
                autoSendPassToWhatsApp(visitor, true, targetWindow);
            }
        });
    }

    // Global document clicks handles popups dismissals
    document.addEventListener("click", (e) => {
        const notificationsPanel = document.getElementById("notifications-panel");
        if (notificationsPanel.classList.contains("active") &&
            !notificationsPanel.contains(e.target) &&
            !e.target.closest("#trigger-notifications-panel")) {
            notificationsPanel.classList.remove("active");
        }

        // Hide autocomplete suggestion box
        document.querySelectorAll(".suggestions-box").forEach(s => s.style.display = "none");
    });

    // Wire up Employee Entry and ID Proof Document Upload handlers
    setupEmployeeEntryAndDocUpload();
    bindAutoSearchListeners();
}

// 3. User Authentication Submit Controller
async function handleLoginSubmit(e) {
    e.preventDefault();
    const userVal = document.getElementById("login-username").value.trim().toLowerCase();
    const passVal = document.getElementById("login-password").value;

    const btnSubmit = document.querySelector("#login-form button[type='submit']");
    const overlay = document.getElementById("login-loading-overlay");
    const loadingText = document.getElementById("login-loading-text");

    // Disable login button and show overlay
    if (btnSubmit) btnSubmit.disabled = true;
    if (overlay) overlay.classList.remove("hidden");
    if (loadingText) loadingText.innerText = "Authenticating...";

    if (supabaseClient) {
        try {
            // Map simple local usernames to domain emails for Supabase Auth
            let email = userVal;
            if (!email.includes("@")) {
                email = `${userVal}@acme.corp`;
            }

            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: email,
                password: passVal
            });

            if (error) {
                console.error("[Login] Supabase Auth error:", error);
                // Attempt offline login fallback
                if (loadingText) loadingText.innerText = "Fallback to offline database...";
                await performOfflineLogin(userVal, passVal);
                return;
            }

            if (data && data.user) {
                if (loadingText) loadingText.innerText = "Loading user profile...";

                const profile = await fetchUserProfileAndRole(data.user);

                if (!profile) {
                    console.warn("[Login] Custom profile not found in database. Falling back to default metadata.");
                    state.currentUser = {
                        username: userVal,
                        name: userVal.charAt(0).toUpperCase() + userVal.slice(1),
                        role: userVal === "admin" ? "Administrator" : "Security Gatekeeper",
                        phone: "Supabase Session",
                        shift: "Continuous"
                    };
                } else {
                    state.currentUser = profile;
                }

                saveState();
                showToast("Access Granted", getTranslatedText("logged-in-as", "Logged in as {name}").replace("{name}", state.currentUser.name), "success");
                document.getElementById("login-form").reset();
                await checkAuthSession();

                // Sync latest state updates from Supabase
                syncFromSupabase();
            }
        } catch (err) {
            console.error("[Login] Supabase auth exception:", err);
            showToast("Auth Service Offline", "Could not connect to Supabase server. Falling back to offline local auth.", "warning");
            await performOfflineLogin(userVal, passVal);
        }
    } else {
        await performOfflineLogin(userVal, passVal);
    }
}

async function performOfflineLogin(userVal, passVal) {
    const btnSubmit = document.querySelector("#login-form button[type='submit']");
    const overlay = document.getElementById("login-loading-overlay");

    const matchedUser = state.securityUsers.find(u => u.username === userVal);
    const matchedEmp = state.employees ? state.employees.find(e => (e.id && e.id.toLowerCase() === userVal) || (e.email && e.email.toLowerCase() === userVal)) : null;

    if (matchedUser && passVal !== "") {
        state.currentUser = matchedUser;
        saveState();
        showToast("Access Granted", getTranslatedText("logged-in-as", "Logged in as {name}").replace("{name}", matchedUser.name), "success");
        document.getElementById("login-form").reset();
        await checkAuthSession();
    } else if (matchedEmp && passVal !== "") {
        state.currentUser = {
            username: matchedEmp.id.toLowerCase(),
            name: matchedEmp.name,
            role: "Employee",
            employeeCode: matchedEmp.id,
            phone: matchedEmp.phone,
            shift: "Regular",
            dept: matchedEmp.dept,
            designation: matchedEmp.designation,
            cabin: matchedEmp.cabin
        };
        saveState();
        showToast("Access Granted", getTranslatedText("logged-in-as", "Logged in as {name}").replace("{name}", matchedEmp.name), "success");
        document.getElementById("login-form").reset();
        await checkAuthSession();
    } else {
        // Invalid credentials error handling
        showToast("Access Denied", "Invalid credentials. Use admin, security, receptionist, or an employee code.", "danger");
        if (btnSubmit) btnSubmit.disabled = false;
        if (overlay) overlay.classList.add("hidden");
    }
}

function handleLogoutClick() {
    state.currentUser = null;
    saveState();
    showToast("Logged Out", "Active session terminated.", "info");
    checkAuthSession();
}

// 4. Data Sync Views Refresher
function refreshAllDataViews() {
    renderDashboardView();
    renderHistoryView();
    renderNotificationsDrawer();
    renderPurchaseManuals();
    renderWorkPermits();
    renderPMDashboardStats();
    updateRegistrationDashboardStats();
    updateTopSummaryBar();
}

function updateTopSummaryBar() {
    const todayStr = getLocalDateStr();
    const registeredToday = state.visitors.filter(v => v.visitDate === todayStr).length;
    const insideCampus = state.visitors.filter(v => v.status === "Checked In").length;
    const checkedOutCount = state.visitors.filter(v => v.status === "Checked Out").length;

    const elCheckedOut = document.getElementById("summary-checked-out");
    const elVisitorsToday = document.getElementById("summary-visitors-today");
    const elInCampus = document.getElementById("summary-in-campus");

    if (elCheckedOut) elCheckedOut.innerText = checkedOutCount;
    if (elVisitorsToday) elVisitorsToday.innerText = registeredToday;
    if (elInCampus) elInCampus.innerText = insideCampus;
}

// 5. View Renderer: Dashboard Portal
function renderDashboardView(searchQuery = "") {
    // 1. Calculations & Statistics counts
    const todayStr = getLocalDateStr();
    const registeredToday = state.visitors.filter(v => v.visitDate === todayStr).length;
    const insideCampus = state.visitors.filter(v => v.status === "Checked In").length;
    const checkedOutCount = state.visitors.filter(v => v.status === "Checked Out").length;
    const pendingApproval = state.visitors.filter(v => v.status === "Pending").length;
    const waitingCount = state.visitors.filter(v => v.status === "Pending" || v.status === "Approved").length;
    const rejectedCount = state.visitors.filter(v => v.status === "Rejected" || v.status === "Denied").length;
    const blacklistedCount = state.blacklist.length;

    // Frequent visitor unique counts (visited 2 or more times)
    const visitCounts = {};
    state.visitors.forEach(v => {
        if (v.phone) {
            visitCounts[v.phone] = (visitCounts[v.phone] || 0) + 1;
        }
    });
    const frequentCount = Object.values(visitCounts).filter(c => c >= 2).length;

    if (document.getElementById("stat-waiting")) document.getElementById("stat-waiting").innerText = waitingCount;
    if (document.getElementById("stat-pending")) document.getElementById("stat-pending").innerText = pendingApproval;
    if (document.getElementById("stat-active-in")) document.getElementById("stat-active-in").innerText = insideCampus;
    if (document.getElementById("stat-checked-out")) document.getElementById("stat-checked-out").innerText = checkedOutCount;
    if (document.getElementById("stat-rejected")) document.getElementById("stat-rejected").innerText = rejectedCount;
    if (document.getElementById("stat-blacklisted")) document.getElementById("stat-blacklisted").innerText = blacklistedCount;
    if (document.getElementById("stat-frequent")) document.getElementById("stat-frequent").innerText = frequentCount;
    if (document.getElementById("stat-total-today")) document.getElementById("stat-total-today").innerText = registeredToday;

    // 2. Render Active visitors table
    const tableBody = document.getElementById("db-active-visitors-table");
    tableBody.innerHTML = "";

    const activeList = state.visitors.filter(v =>
        (v.status === "Checked In" || v.status === "Pending") &&
        (v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.id.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (activeList.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg>
                    <p>No active visitors inside campus matching filters.</p>
                </td>
            </tr>
        `;
    } else {
        activeList.forEach(v => {
            const tr = document.createElement("tr");
            const entryTimeFormatted = v.checkIn ? new Date(v.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Awaiting Approval";

            tr.innerHTML = `
                <td><code>${v.id}</code></td>
                <td>
                    <div style="font-weight: 600;">${v.name}</div>
                    <div class="text-secondary text-xs">${v.company || "Independent"} | ${v.phone}</div>
                </td>
                <td>
                    <div>Host: ${v.hostName}</div>
                    <div class="text-secondary text-xs">${v.hostDept} | Purpose: ${v.purpose}</div>
                </td>
                <td>${entryTimeFormatted}</td>
                <td>
                    <span class="badge-status ${v.status.toLowerCase()}">${v.status}</span>
                </td>
                <td>
                    <div class="flex gap-2" style="flex-wrap:wrap;">
                        ${v.status === "Pending" ? `
                            <button class="btn btn-accent btn-sm" onclick="approveEntryAction('${v.id}')">Approve</button>
                        ` : `
                            <button class="btn btn-secondary btn-sm" onclick="checkoutVisitorById('${v.id}')">Check-Out</button>
                        `}
                        <button class="btn btn-secondary btn-sm" onclick="viewPrintPassModal('${v.id}')" title="Preview Pass Card">Badge</button>
                        ${v.status === 'Checked In' ? `<button class="btn btn-success btn-sm" onclick="resendPassWhatsApp('${v.id}')" title="Resend via WhatsApp">?? WA</button>` : ''}
                    </div>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    }

    // Bind Dashboard live filter
    const dbFilter = document.getElementById("db-search-visitors");
    dbFilter.oninput = (e) => renderDashboardView(e.target.value);

    // Render interactive analytics charts
    renderDashboardCharts();

    // Render pending approval queue
    renderDashboardPendingQueue();
}

// Renders the Pending Approval Queue table on the dashboard
function renderDashboardPendingQueue() {
    const tbody = document.getElementById("db-pending-approval-table");
    const countBadge = document.getElementById("pending-queue-count");
    if (!tbody) return;

    const pendingList = state.visitors.filter(v => v.status === "Pending");
    if (countBadge) countBadge.innerText = `${pendingList.length} Pending`;

    tbody.innerHTML = "";

    if (pendingList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="empty-state">No visitors awaiting host approval.</td></tr>`;
        return;
    }

    const defaultPhoto = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><circle cx='12' cy='8' r='4' fill='%2394a3b8'/><path d='M4 20c0-4 3.6-7 8-7s8 3 8 7' fill='%2394a3b8'/></svg>";

    pendingList.forEach(v => {
        const tr = document.createElement("tr");
        const registeredTime = v.visitDate ? v.visitDate : "?";
        tr.innerHTML = `
            <td>
                <div style="display:flex; align-items:center; gap:8px;">
                    <img src="${v.photo || defaultPhoto}" style="width:32px;height:32px;border-radius:50%;object-fit:cover;border:1.5px solid var(--border-color);">
                    <div>
                        <div style="font-weight:600;">${v.name}</div>
                        <div class="text-secondary text-xs">${v.phone}</div>
                    </div>
                </div>
            </td>
            <td>${v.company || "Independent"}</td>
            <td>${v.hostName}</td>
            <td>${v.hostDept}</td>
            <td><span class="badge-status pending" style="font-size:0.7rem;">${v.purpose}</span></td>
            <td>${registeredTime}</td>
            <td>
                <div class="flex gap-2">
                    <button class="btn btn-accent btn-sm" onclick="approvePendingVisitor('${v.id}')">? Approve</button>
                    <button class="btn btn-danger btn-sm" onclick="promptRejectVisitor('${v.id}')">? Reject</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Quick reject prompt from dashboard table
window.promptRejectVisitor = function (visitorId) {
    const reason = prompt("Enter reason for rejection (required):");
    if (reason === null) return; // Cancelled
    const idx = state.visitors.findIndex(v => v.id === visitorId);
    if (idx !== -1) state.visitors[idx].rejectionReason = reason || "Rejected by security";
    rejectPendingVisitor(visitorId);
};



// Actions from Table Buttons
window.approveEntryAction = async function (visitorId) {
    const idx = state.visitors.findIndex(v => v.id === visitorId);
    if (idx === -1) return;

    const hostEmp = await resolveLatestHost(state.visitors[idx].hostId);
    if (hostEmp) {
        state.visitors[idx].hostName = hostEmp.name;
        state.visitors[idx].hostDept = hostEmp.dept;
    }

    state.visitors[idx].status = "Checked In";
    state.visitors[idx].checkIn = new Date().toISOString();
    saveState();
    refreshAllDataViews();

    showToast("Visitor Approved", `${state.visitors[idx].name} checked in successfully.`, "success");
    addNotificationAlert("Access Approved", `${state.visitors[idx].name} approved for entry by ${state.currentUser.name}.`, "success");

    // Simulated alerts dispatch
    dispatchSimulatedAlerts(state.visitors[idx]);
};

window.checkoutVisitorById = async function (visitorId) {
    const idx = state.visitors.findIndex(v => v.id === visitorId);
    if (idx === -1) return;

    const hostEmp = await resolveLatestHost(state.visitors[idx].hostId);
    if (hostEmp) {
        state.visitors[idx].hostName = hostEmp.name;
        state.visitors[idx].hostDept = hostEmp.dept;
    }

    state.visitors[idx].status = "Checked Out";
    state.visitors[idx].checkOut = new Date().toISOString();
    saveState();
    syncSingleVisitorToCloud(state.visitors[idx]);
    refreshAllDataViews();

    showToast("Checked Out Completed", `${state.visitors[idx].name} cleared at gate.`, "info");
    addNotificationAlert("Visitor Checked-Out", `${state.visitors[idx].name} has exited campus boundaries.`, "info");

    const host = state.employees.find(e => e.id === state.visitors[idx].hostId);
    if (host) {
        logNotificationSimulator(
            "Checked-Out",
            "Email/SMS",
            host.email,
            `Hello ${host.name}, your visitor ${state.visitors[idx].name} has officially checked out at the exit gate.`
        );
    }
};

window.viewPrintPassModal = function (visitorId) {
    const visitor = state.visitors.find(v => v.id === visitorId);
    if (visitor) {
        renderBadgeAndOpenModal(visitor);
    }
};

// 6. Employee Search & Selection Controller
function handleEmployeeSearch(e) {
    e.preventDefault();
    const query = document.getElementById("emp-search-query").value.trim().toLowerCase();
    const resultsContainer = document.getElementById("emp-search-results-container");
    const resultsTable = document.getElementById("emp-search-results-table");

    resultsTable.innerHTML = "";
    if (query === "") {
        resultsContainer.classList.add("hidden");
        showToast("Search Criteria Empty", "Type name, ID, or phone extension to locate.", "warning");
        return;
    }

    const matches = state.employees.filter(emp =>
        emp.id.toLowerCase().includes(query) ||
        emp.name.toLowerCase().includes(query) ||
        emp.phone.toLowerCase().includes(query) ||
        emp.dept.toLowerCase().includes(query)
    );

    resultsContainer.classList.remove("hidden");

    if (matches.length === 0) {
        resultsTable.innerHTML = `
            <tr>
                <td colspan="8" class="empty-state">No matching employees found in corporate directory.</td>
            </tr>
        `;
        return;
    }

    matches.forEach(emp => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><code>${emp.id}</code></td>
            <td><strong>${emp.name}</strong></td>
            <td>${emp.dept}</td>
            <td>${emp.email}</td>
            <td>${emp.phone}</td>
            <td>${emp.cabin}</td>
            <td>
                <span class="badge-status ${emp.status === 'In Office' ? 'checked-in' : (emp.status === 'In Meeting' ? 'expected' : 'denied')}">${emp.status}</span>
            </td>
            <td>
                <button type="button" class="btn btn-primary btn-sm" onclick="selectEmployeeAsHost('${emp.id}')">Select Host</button>
            </td>
        `;
        resultsTable.appendChild(tr);
    });
}

window.selectEmployeeAsHost = function (empId) {
    const employee = state.employees.find(e => e.id === empId);
    if (!employee) return;

    // Fill Host Selection in Registration form
    const select = document.getElementById("reg-host-select");
    select.value = employee.name;
    select.dataset.empId = employee.id;
    select.dataset.empDept = employee.dept;

    showToast("Host Selected", `${employee.name} set as host employee.`, "success");

    // Redirect to registration tab
    switchView("view-registration");
};

// 7. Autocomplete Input Handlers
function setupAutocompleteInput(inputID, suggestionsID) {
    const input = document.getElementById(inputID);
    const box = document.getElementById(suggestionsID);

    input.addEventListener("input", () => {
        const val = input.value.trim().toLowerCase();
        box.innerHTML = "";
        if (!val) {
            box.style.display = "none";
            return;
        }

        const matches = state.employees.filter(emp => emp.name.toLowerCase().includes(val) || emp.dept.toLowerCase().includes(val));
        if (matches.length === 0) {
            box.style.display = "none";
            return;
        }

        matches.forEach(emp => {
            const div = document.createElement("div");
            div.className = "suggestion-item";
            div.innerHTML = `
                <div class="item-title">${emp.name}</div>
                <div class="item-desc">${emp.dept} - ${emp.cabin} (${emp.status})</div>
            `;
            div.addEventListener("mousedown", async (e) => {
                e.preventDefault();
                input.value = emp.name;
                input.dataset.empId = emp.id;
                input.dataset.empDept = emp.dept;
                box.style.display = "none";
                await resolveLatestHost(emp.id);
            });
            box.appendChild(div);
        });
        box.style.display = "block";
    });

    input.addEventListener("blur", () => {
        setTimeout(() => { box.style.display = "none"; }, 200);
    });
}

// 8. Camera Capture Hardware API Emulator / Controller
function initCamera() {
    const video = document.getElementById("camera-stream");
    const preview = document.getElementById("photo-preview");
    const canvas = document.getElementById("photo-canvas");
    const btnEnable = document.getElementById("btn-enable-camera");
    const btnCap = document.getElementById("btn-capture");
    const btnRet = document.getElementById("btn-retake");
    const cameraStatus = document.getElementById("camera-status");

    navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } })
        .then(stream => {
            state.cameraStream = stream;
            video.srcObject = stream;
            video.classList.remove("hidden");
            canvas.classList.add("hidden");
            preview.classList.add("hidden");

            btnEnable.classList.add("hidden");
            btnCap.classList.remove("hidden");
            btnRet.classList.add("hidden");
            cameraStatus.innerText = "Live Camera Active";

            // Show AI Face recognition bounding overlay
            const faceOverlay = document.getElementById("camera-face-overlay");
            if (faceOverlay) faceOverlay.classList.remove("hidden");
        })
        .catch(err => {
            console.error("Camera access error:", err);
            showToast("Camera Error", "Unable to start webcam stream.", "danger");
        });
}

function capturePhoto() {
    const video = document.getElementById("camera-stream");
    const preview = document.getElementById("photo-preview");
    const canvas = document.getElementById("photo-canvas");
    const btnCap = document.getElementById("btn-capture");
    const btnRet = document.getElementById("btn-retake");
    const cameraStatus = document.getElementById("camera-status");

    if (!state.cameraStream) return;

    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imgData = canvas.toDataURL("image/jpeg");
    state.tempVisitorPhoto = imgData;
    preview.src = imgData;

    video.classList.add("hidden");
    preview.classList.remove("hidden");
    btnCap.classList.add("hidden");
    btnRet.classList.remove("hidden");
    cameraStatus.innerText = "Snapshot Captured";

    // Hide AI Face recognition overlay
    const faceOverlay = document.getElementById("camera-face-overlay");
    if (faceOverlay) faceOverlay.classList.add("hidden");

    stopCamera();

    // Trigger simulated face recognition match lookup
    setTimeout(simulateFaceMatch, 600);
}

function retakePhoto() {
    state.tempVisitorPhoto = "";
    initCamera();
}

function stopCamera() {
    if (state.cameraStream) {
        state.cameraStream.getTracks().forEach(track => track.stop());
        state.cameraStream = null;
    }
    // Make sure face overlay is hidden
    const faceOverlay = document.getElementById("camera-face-overlay");
    if (faceOverlay) faceOverlay.classList.add("hidden");
}

function handlePhotoFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (evt) {
        const preview = document.getElementById("photo-preview");
        const video = document.getElementById("camera-stream");

        video.classList.add("hidden");
        preview.classList.remove("hidden");
        preview.src = evt.target.result;
        state.tempVisitorPhoto = evt.target.result;

        document.getElementById("btn-enable-camera").classList.remove("hidden");
        document.getElementById("btn-capture").classList.add("hidden");
        document.getElementById("btn-retake").classList.add("hidden");
        document.getElementById("camera-status").innerText = "Uploaded Image Selected";

        showToast("Photo Loaded", "File uploaded successfully.", "success");
    };
    reader.readAsDataURL(file);
}

// 9. Visitor Registration Submission Controller
let pendingRegistrationObj = null;

function handleRegistrationSubmit(e) {
    e.preventDefault();

    const name = document.getElementById("reg-visitor-name").value.trim();
    const phone = document.getElementById("reg-visitor-phone").value.trim();
    const email = document.getElementById("reg-visitor-email").value.trim();
    const company = document.getElementById("reg-visitor-company").value.trim();
    const address = document.getElementById("reg-visitor-address").value.trim();
    const purpose = document.getElementById("reg-visitor-purpose").value;
    const vehicle = document.getElementById("reg-visitor-vehicle").value.trim();
    const numVisitors = parseInt(document.getElementById("reg-visitor-num-visitors").value) || 1;
    const idType = document.getElementById("reg-visitor-id-type").value;
    const idNumber = document.getElementById("reg-visitor-id-number").value.trim();
    const hostInput = document.getElementById("reg-host-select");
    const visitDate = document.getElementById("reg-visit-date").value;
    const expectedExit = document.getElementById("reg-expected-exit").value;

    // ID number format validation (only if provided)
    if (idNumber !== "") {
        if (idType === "Aadhaar") {
            const cleanAadhaar = idNumber.replace(/\s|-/g, "");
            if (!/^\d{12}$/.test(cleanAadhaar)) {
                showToast("Invalid ID Number", "Aadhaar Card number must be exactly 12 digits.", "danger");
                return;
            }
        } else if (idType === "PAN Card") {
            const cleanPan = idNumber.toUpperCase().replace(/\s/g, "");
            if (!/^[A-Z]{5}\d{4}[A-Z]{1}$/.test(cleanPan)) {
                showToast("Invalid ID Number", "PAN Card must be 10 alphanumeric characters (e.g. ABCDE1234F).", "danger");
                return;
            }
        } else if (idType === "CNIC") {
            const cleanCnic = idNumber.replace(/\s|-/g, "");
            if (!/^\d{13}$/.test(cleanCnic)) {
                showToast("Invalid ID Number", "CNIC must be 13 digits (formatted as XXXXX-XXXXXXX-X).", "danger");
                return;
            }
        }
    }

    const matchedHost = state.employees.find(emp => emp.name === hostInput.value);
    if (!matchedHost) {
        showToast("Host Not Found", "Please choose an employee from suggestions dropdown list.", "danger");
        return;
    }

    // Capture registration structure
    const visitorId = "V" + new Date().getFullYear() + String(state.visitors.length + 10001).substring(1);

    pendingRegistrationObj = {
        id: visitorId,
        name,
        phone,
        email: email || `${name.toLowerCase().replace(/ /g, "")}@example.com`,
        company: company || "Independent Partners",
        address,
        purpose,
        vehicle,
        numVisitors,
        idType,
        idNumber,
        hostId: matchedHost.id,
        hostName: matchedHost.name,
        hostDept: matchedHost.dept,
        visitDate,
        checkIn: null, // Awaiting confirmation
        checkOut: null,
        expectedExit,
        status: "Pending", // Default Awaiting host approval
        photo: state.tempVisitorPhoto,
        photoIdDoc: state.tempVisitorIdDoc || ""
    };

    // Open Visitor Preview Modal
    openVisitorPreview(pendingRegistrationObj);
}
function openVisitorPreview(visitor) {
    const modal = document.getElementById("modal-visitor-preview");

    document.getElementById("prev-visitor-photo").src = visitor.photo || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23cbd5e1' stroke-width='1.5'><path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/><circle cx='12' cy='7' r='4'/></svg>";
    document.getElementById("prev-visitor-name").innerText = visitor.name;
    document.getElementById("prev-visitor-company").innerText = visitor.company;
    document.getElementById("prev-visitor-phone").innerText = visitor.phone;
    document.getElementById("prev-visitor-email").innerText = visitor.email;
    const idDisplay = (visitor.idType || visitor.idNumber)
        ? `${visitor.idType || "Unspecified"} (${visitor.idNumber || "No number"})`
        : "Not Provided";
    document.getElementById("prev-visitor-id-type").innerText = idDisplay;
    document.getElementById("prev-visitor-address").innerText = visitor.address || "Not Specified";
    document.getElementById("prev-visitor-vehicle").innerText = visitor.vehicle || "None";
    document.getElementById("prev-visitor-host").innerText = visitor.hostName;
    document.getElementById("prev-visitor-dept").innerText = visitor.hostDept;
    document.getElementById("prev-visitor-count").innerText = `${visitor.numVisitors} Person(s)`;
    document.getElementById("prev-visitor-purpose").innerText = visitor.purpose;
    document.getElementById("prev-visitor-exit").innerText = visitor.expectedExit;

    // Render uploaded ID card image
    const prevDocImg = document.getElementById("prev-visitor-id-doc");
    const prevDocNone = document.getElementById("prev-visitor-id-doc-none");
    if (visitor.photoIdDoc) {
        prevDocImg.src = visitor.photoIdDoc;
        prevDocImg.style.display = "block";
        prevDocNone.style.display = "none";
    } else {
        prevDocImg.src = "";
        prevDocImg.style.display = "none";
        prevDocNone.style.display = "block";
    }

    // AI Risk Alert check using local AI Engine
    const riskPanel = document.getElementById("prev-visitor-ai-risk-panel");
    const riskDesc = document.getElementById("prev-visitor-ai-risk-desc");
    if (riskPanel && window.vmsAi) {
        const blacklist = state.blacklist || [];
        const checkedInVisitors = state.visitors.filter(v => v.status === "Checked In" && v.id !== visitor.id);
        const check = window.vmsAi.detectAnomaly(visitor, blacklist, checkedInVisitors);
        if (check && check.isAnomalous) {
            riskPanel.classList.remove("hidden");
            if (riskDesc) {
                riskDesc.innerText = check.anomalies.join(" | ");
            }
            addNotificationAlert("AI Risk Notice", `AI Check: suspicious registration signature detected for ${visitor.name}: ${check.anomalies.join(", ")}`, "warning");
        } else {
            riskPanel.classList.add("hidden");
        }
    } else if (riskPanel) {
        riskPanel.classList.add("hidden");
    }

    modal.classList.add("active");
}

function finalizeVisitorIntake() {
    if (!pendingRegistrationObj) return;

    // 1. Check Security Blacklist first
    const isBlacklisted = checkBlacklistMatch(
        pendingRegistrationObj.name,
        pendingRegistrationObj.phone,
        pendingRegistrationObj.idNumber
    );

    if (isBlacklisted) {
        openBlacklistAlarmScreen(isBlacklisted);
        return;
    }

    // Pre-open target window synchronously to prevent browser popup block
    let targetWindow = null;
    const method = state.settings?.waMethod || "url-local";
    if (method !== "meta" && method !== "sim") {
        try {
            targetWindow = window.open("", "_blank");
        } catch (e) {
            console.warn("Could not pre-open window:", e);
        }
    }

    // 2. Close preview modal and proceed directly to host approval flow
    document.getElementById("modal-visitor-preview").classList.remove("active");
    executeFinalVisitorApprovalFlow(targetWindow);
}

async function executeFinalVisitorApprovalFlow(preOpenedWindow = null) {
    if (!pendingRegistrationObj) return;

    // Fetch latest host details to ensure dynamic email lookup and non-hardcoding
    const hostEmp = await resolveLatestHost(pendingRegistrationObj.hostId);
    if (hostEmp) {
        pendingRegistrationObj.hostName = hostEmp.name;
        pendingRegistrationObj.hostDept = hostEmp.dept;
    }

    // Set initial status to Pending for Host Approval
    pendingRegistrationObj.status = "Pending";
    pendingRegistrationObj.checkIn = null;

    // Add to state list
    state.visitors.unshift(pendingRegistrationObj);
    saveState();
    await syncSingleVisitorToCloud(pendingRegistrationObj);
    refreshAllDataViews();

    showToast("Approval Requested", `Notification sent to host employee ${pendingRegistrationObj.hostName}.`, "info");

    // Add alerts
    addNotificationAlert("Approval Needed", `[Reception] Visitor Waiting: ${pendingRegistrationObj.name} registered. Waiting for host approval.`, "warning");
    addNotificationAlert("Visitor Registered", `[Host] Visitor Waiting: Guest ${pendingRegistrationObj.name} from ${pendingRegistrationObj.company || 'Independent'} is waiting for your clearance.`, "warning");

    // Display simulated phone notification bubble
    triggerHostApprovalNotification(pendingRegistrationObj);

    // Auto-open Gmail compose to host's registered email for real approval
    sendHostApprovalGmail(pendingRegistrationObj, hostEmp);

    // 1. SMS to Guest
    logNotificationSimulator(
        "Visitor Registered",
        "SMS",
        pendingRegistrationObj.phone,
        `Your visit request has been submitted successfully. Waiting for host approval.`
    );

    // 2. SMS to Host Employee
    logNotificationSimulator(
        "Host Notification Request",
        "SMS",
        hostEmp ? hostEmp.phone : "+91 94421 00220",
        `Visitor ${pendingRegistrationObj.name} from ${pendingRegistrationObj.company || 'Independent'} is waiting at reception. Please approve or reject the request.`
    );

    // 3. Email to Host Employee (Host Approval Email)
    const hostEmail = "manojkumarnj01@gmail.com";
    logNotificationSimulator(
        "Urgent: Visitor Approval Request",
        "Email",
        hostEmail,
        `Dear ${pendingRegistrationObj.hostName},\nVisitor ${pendingRegistrationObj.name} from ${pendingRegistrationObj.company || 'Independent'} is waiting at the main gate reception. Please approve or reject this request.`
    );

    // Audit logs
    addAuditLog("Register Visitor", "Security", `Registered visitor details for code: ${pendingRegistrationObj.id}`);
    addAuditLog("Outbound Comm Sent", "Communications", `Dispatched Twilio SMS & Host Email request to: ${pendingRegistrationObj.hostName}`);

    // Clear form inputs based on registered visitor category
    const registeredCategory = (registeredVisitor.purpose || "").toLowerCase();
    if (registeredCategory === "student") {
        resetCategoryFormState("student");
    } else if (registeredCategory === "customer") {
        resetCategoryFormState("customer");
    } else if (registeredCategory === "vendor") {
        resetCategoryFormState("vendor");
    } else {
        resetCategoryFormState("visitor");
    }

    // Standard reset for default form just in case
    try {
        document.getElementById("visitor-registration-form").reset();
        document.getElementById("photo-preview").src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='1.5'><path d='M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z'/><circle cx='12' cy='13' r='4'/></svg>";
        document.getElementById("btn-enable-camera").classList.remove("hidden");
        document.getElementById("btn-capture").classList.add("hidden");
        document.getElementById("btn-retake").classList.add("hidden");
        document.getElementById("camera-status").innerText = "Camera Inactive";
        state.tempVisitorPhoto = "";
        state.tempVisitorIdDoc = "";
        const uploadLabel = document.getElementById("id-doc-upload-label");
        if (uploadLabel) uploadLabel.innerText = "Upload ID Proof";
        document.getElementById("visitor-id-doc-file").value = "";
    } catch (e) { }

    // Render and capture pass image in background at registration
    const registeredVisitor = pendingRegistrationObj;
    renderBadgeData(registeredVisitor);

    setTimeout(async () => {
        try {
            const badgeEl = document.getElementById('printable-badge');
            if (badgeEl) {
                const canvas = await html2canvas(badgeEl, {
                    scale: 2,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: '#ffffff'
                });
                const imgData = canvas.toDataURL('image/png');

                const vIdx = state.visitors.findIndex(vv => vv.id === registeredVisitor.id);
                if (vIdx !== -1) {
                    state.visitors[vIdx].passImage = imgData;
                    saveState();
                    await syncSingleVisitorToCloud(state.visitors[vIdx]);

                    // Auto-send pass image to visitor's WhatsApp after generation
                    autoSendPassToWhatsApp(state.visitors[vIdx], false, preOpenedWindow);
                }
            }
        } catch (captureErr) {
            console.warn('[VMS] Pass image auto-capture failed on creation:', captureErr);
        }
    }, 1000);

    pendingRegistrationObj = null;
}

// Simulated SMS Alerts Dispatcher
function dispatchSimulatedAlerts(visitor) {
    const host = state.employees.find(e => e.id === visitor.hostId);
    const gateName = document.getElementById("cfg-terminal-gate").value;

    // 1. SMS to Visitor
    logNotificationSimulator(
        "Welcome Alert",
        "SMS",
        visitor.phone,
        `ABC INDUSTRIES\nWelcome.\nVisitor ID: ${visitor.id}\nHost: ${visitor.hostName}\nEntry Time: ${new Date(visitor.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    );

    // 2. SMS to Host Employee
    if (host) {
        logNotificationSimulator(
            "Host Notification",
            "SMS",
            host.phone,
            `Visitor ${visitor.name} has arrived at ${gateName}.\nPurpose: ${visitor.purpose}\nPlease receive them.`
        );

        // Email backup
        logNotificationSimulator(
            "Visitor Arrival Email",
            "Email",
            host.email,
            `Dear ${host.name},\nThis is an automated alert. Your pre-scheduled guest ${visitor.name} from ${visitor.company} has cleared gate clearance and is checked-in.`
        );
    }

    // 3. SMS to Security Operations Center
    logNotificationSimulator(
        "Security Log Update",
        "SMS",
        "+91 99999 88888 (Duty Desk)",
        `Visitor Checked In\nVisitor: ${visitor.name}\nHost: ${visitor.hostName}\nPass Code: ${visitor.id}`
    );
}

// Sim Log Generator
function logNotificationSimulator(subject, channel, destination, content) {
    const container = document.getElementById("sms-email-logs-panel");
    if (container) {
        const emptyState = container.querySelector(".empty-state");
        if (emptyState) emptyState.remove();

        const timestamp = new Date().toLocaleTimeString([], { hour12: false });
        const logItem = document.createElement("div");
        logItem.className = "sim-log-item success";
        logItem.innerHTML = `
            <strong>[${timestamp}] Outbound Alert (${channel})</strong><br>
            To: ${destination} | Subject: ${subject}<br>
            Message: "${content.replace(/\n/g, ' ')}"
        `;
        container.insertBefore(logItem, container.firstChild);
    }

    // Persist log state
    state.dispatchLogs = state.dispatchLogs || [];
    state.dispatchLogs.unshift({
        time: new Date().toLocaleTimeString([], { hour12: false }),
        channel,
        destination,
        subject,
        content
    });
    if (state.dispatchLogs.length > 50) state.dispatchLogs.pop();
    saveState();
}

// 10. QR Pass Generator & Badges Modal Handler
function renderBadgeData(visitor) {
    // Setup Pass Card fields
    document.getElementById("badge-serial-id").innerText = visitor.id;
    document.getElementById("badge-name").innerText = visitor.name;
    document.getElementById("badge-company-name").innerText = visitor.company || "Independent";
    document.getElementById("badge-host-name").innerText = visitor.hostName;
    document.getElementById("badge-host-dept").innerText = visitor.hostDept;
    document.getElementById("badge-purpose").innerText = visitor.purpose || "Meeting";

    const entryDate = visitor.checkIn ? new Date(visitor.checkIn) : new Date();
    document.getElementById("badge-date").innerText = entryDate.toLocaleDateString([], { month: '2-digit', day: '2-digit', year: 'numeric' });
    document.getElementById("badge-time").innerText = entryDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.getElementById("badge-exit-time").innerText = visitor.expectedExit || "06:00 PM";

    // Student validity rows rendering
    const rowStartDate = document.getElementById("badge-row-start-date");
    const rowEndDate = document.getElementById("badge-row-end-date");
    const rowValidity = document.getElementById("badge-row-validity");
    const valStartDate = document.getElementById("badge-start-date");
    const valEndDate = document.getElementById("badge-end-date");
    const valValidity = document.getElementById("badge-validity");

    if (visitor.startDate && visitor.endDate) {
        if (rowStartDate) rowStartDate.classList.remove("hidden");
        if (rowEndDate) rowEndDate.classList.remove("hidden");
        if (rowValidity) rowValidity.classList.remove("hidden");

        if (valStartDate) valStartDate.innerText = visitor.startDate;
        if (valEndDate) valEndDate.innerText = visitor.endDate;
        if (valValidity) valValidity.innerText = visitor.startDate + " to " + visitor.endDate;
    } else {
        if (rowStartDate) rowStartDate.classList.add("hidden");
        if (rowEndDate) rowEndDate.classList.add("hidden");
        if (rowValidity) rowValidity.classList.add("hidden");
    }

    // Visitor Photo setup
    const photoEl = document.getElementById("badge-photo");
    if (photoEl) {
        if (visitor.photo) {
            photoEl.src = visitor.photo;
        } else {
            photoEl.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23cbd5e1' stroke-width='1.5'><path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/><circle cx='12' cy='7' r='4'/></svg>";
        }
    }

    // Generate Real QR Code
    const qrContainer = document.getElementById("badge-qr-code");
    if (qrContainer) {
        qrContainer.innerHTML = "";
        try {
            const qrPayloadObj = {
                id: visitor.id,
                name: visitor.name,
                company: visitor.company || "Independent",
                host: visitor.hostName,
                dept: visitor.hostDept,
                purpose: visitor.purpose,
                date: entryDate.toLocaleDateString(),
                entry: entryDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                exit: visitor.expectedExit || "06:00 PM",
                phone: visitor.phone,
                valid: "BARANI-VMS-AUTHORIZED"
            };
            if (visitor.startDate) qrPayloadObj.startDate = visitor.startDate;
            if (visitor.endDate) qrPayloadObj.endDate = visitor.endDate;
            const qrPayload = JSON.stringify(qrPayloadObj);
            new QRCode(qrContainer, {
                text: qrPayload,
                width: 80,
                height: 80,
                colorDark: "#0f172a",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.M
            });
        } catch (err) {
            console.error("QR Code library generation error:", err);
            qrContainer.innerText = "[QR CODE]";
        }
    }
}

function renderBadgeAndOpenModal(visitor) {
    const modal = document.getElementById("modal-badge-preview");
    if (!modal) return;

    renderBadgeData(visitor);

    modal.classList.add("active");
}

// 11. Visitor Check-Out Controller
let activeCheckoutRecord = null;

function handleCheckoutSearch(e) {
    if (e) e.preventDefault();
    const idVal = document.getElementById("checkout-visitor-id").value.trim().toUpperCase();

    const visitor = visitorsIdMap.get(idVal) || visitorsPhoneMap.get(idVal);

    if (!visitor) {
        showToast("Invalid ID", "Visitor code not found in databases.", "danger");
        document.getElementById("checkout-details-card").classList.add("hidden");
        return;
    }

    loadCheckoutRecordCard(visitor);
}
function loadCheckoutRecordCard(visitor) {
    activeCheckoutRecord = visitor;

    const photoEl = document.getElementById("checkout-visitor-photo");
    const nameEl = document.getElementById("checkout-visitor-name");
    const companyEl = document.getElementById("checkout-visitor-company");
    const statusEl = document.getElementById("checkout-visitor-status");

    const infoId = document.getElementById("checkout-info-id");
    const infoHost = document.getElementById("checkout-info-host");
    const infoDept = document.getElementById("checkout-info-dept");
    const infoCheckIn = document.getElementById("checkout-info-checkin");
    const infoExit = document.getElementById("checkout-info-exit");
    const infoPurpose = document.getElementById("checkout-info-purpose");
    const infoStatus = document.getElementById("checkout-info-status");
    const checkoutBtn = document.getElementById("btn-execute-checkout");

    if (photoEl) photoEl.src = visitor.photo || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23cbd5e1' stroke-width='1.5'><path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/><circle cx='12' cy='7' r='4'/></svg>";
    if (nameEl) nameEl.innerText = visitor.name;
    if (companyEl) companyEl.innerText = visitor.company || "Independent";

    if (statusEl) {
        statusEl.innerText = visitor.status;
        statusEl.className = "badge-status " + (visitor.status === "Checked In" ? "checked-in" : (visitor.status === "Checked Out" ? "checked-out" : "pending"));
    }

    if (infoId) infoId.innerText = visitor.id;
    if (infoHost) infoHost.innerText = visitor.hostName;
    if (infoDept) infoDept.innerText = visitor.hostDept;
    if (infoCheckIn) infoCheckIn.innerText = visitor.checkIn ? new Date(visitor.checkIn).toLocaleString() : "?";
    if (infoExit) infoExit.innerText = visitor.checkOut ? new Date(visitor.checkOut).toLocaleString() : (visitor.expectedExit || "?");
    if (infoPurpose) infoPurpose.innerText = visitor.purpose;
    if (infoStatus) infoStatus.innerText = visitor.status;

    if (checkoutBtn) {
        if (visitor.status === "Checked Out") {
            checkoutBtn.disabled = true;
            checkoutBtn.style.opacity = "0.5";
            checkoutBtn.style.cursor = "not-allowed";
        } else {
            checkoutBtn.disabled = false;
            checkoutBtn.style.opacity = "1";
            checkoutBtn.style.cursor = "pointer";
        }
    }

    document.getElementById("checkout-details-card").classList.remove("hidden");
}

function executeCheckoutAction() {
    if (!activeCheckoutRecord) return;

    if (activeCheckoutRecord.status === "Checked Out") {
        showToast("Already Checked Out", "This visitor has already checked out of campus.", "warning");
        return;
    }

    checkoutVisitorById(activeCheckoutRecord.id);
    loadCheckoutRecordCard(activeCheckoutRecord);
}

function openQRScannerModal() {
    const modal = document.getElementById("modal-qr-scanner");
    const select = document.getElementById("qr-mock-selector");
    const video = document.getElementById("qr-camera-stream");
    if (!modal || !select) return;

    select.innerHTML = '<option value="">-- Select Mock Pass to Scan --</option>';
    state.visitors.filter(v => v.status === "Checked In").forEach(v => {
        const opt = document.createElement("option");
        opt.value = v.id;
        opt.innerText = `${v.id} - ${v.name} (Host: ${v.hostName})`;
        select.appendChild(opt);
    });

    navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 320 } })
        .then(stream => {
            state.qrStream = stream;
            video.srcObject = stream;
            modal.classList.add("active");
        })
        .catch(err => {
            console.error("QR stream capture failed:", err);
            modal.classList.add("active");
        });
}

function executeQRScanSimulation() {
    const select = document.getElementById("qr-mock-selector");
    const val = select.value;
    if (!val) {
        showToast("Scan Error", "Please select a mock visitor pass to simulate camera scan.", "warning");
        return;
    }

    const visitor = state.visitors.find(v => v.id === val);
    if (visitor) {
        loadCheckoutRecordCard(visitor);
        showToast(
            "? QR Scan Verified",
            `Pass: ${visitor.id} | Visitor: ${visitor.name} | Host: ${visitor.hostName} | Status: ${visitor.status}`,
            "success"
        );
        addAuditLog("QR Gate Scan", "Security", `QR code scanned at gate for visitor: ${visitor.name} (${visitor.id}). Status: ${visitor.status}`);
        document.getElementById("modal-qr-scanner").classList.remove("active");
        stopQRScannerStream();
    }
}

function stopQRScannerStream() {
    if (state.qrStream) {
        state.qrStream.getTracks().forEach(track => track.stop());
        state.qrStream = null;
    }
}

let historyCurrentPage = 0;
const historyPageSize = 10;

function renderHistoryView() {
    const keywordInput = document.getElementById("history-search-keyword");
    const dateInput = document.getElementById("history-filter-date");
    const tableBody = document.getElementById("history-logs-table");

    if (!tableBody) return;

    const keyword = keywordInput ? keywordInput.value.trim().toLowerCase() : "";
    const dateVal = dateInput ? dateInput.value : "";

    tableBody.innerHTML = "";

    const filtered = state.visitors.filter(v => {
        if (state.currentUser && state.currentUser.role.toLowerCase() === "employee") {
            const empCode = state.currentUser.employeeCode || state.currentUser.username || "";
            const empName = state.currentUser.name || "";
            const hostIdMatch = v.hostId && empCode && v.hostId.toLowerCase() === empCode.toLowerCase();
            const hostNameMatch = v.hostName && empName && v.hostName.toLowerCase() === empName.toLowerCase();
            if (!hostIdMatch && !hostNameMatch) return false;
        }

        const matchesKeyword = v.id.toLowerCase().includes(keyword) ||
            (v.name && v.name.toLowerCase().includes(keyword)) ||
            (v.company && v.company.toLowerCase().includes(keyword)) ||
            (v.hostName && v.hostName.toLowerCase().includes(keyword));
        const matchesDate = dateVal === "" || v.visitDate === dateVal;

        return matchesKeyword && matchesDate;
    });

    const totalRecords = filtered.length;
    const totalPages = Math.ceil(totalRecords / historyPageSize);
    if (historyCurrentPage >= totalPages && totalPages > 0) {
        historyCurrentPage = totalPages - 1;
    }

    const startIdx = historyCurrentPage * historyPageSize;
    const endIdx = Math.min(startIdx + historyPageSize, totalRecords);
    const visibleData = filtered.slice(startIdx, endIdx);

    let pagEl = document.getElementById("history-pagination-container");
    if (!pagEl) {
        pagEl = document.createElement("div");
        pagEl.id = "history-pagination-container";
        pagEl.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding: 1rem; border-top: 1px solid var(--border-color); font-size: 0.75rem; color: var(--text-secondary);";
        tableBody.closest(".table-container").appendChild(pagEl);
    }

    if (totalRecords === 0) {
        pagEl.innerHTML = `<span>Showing 0 to 0 of 0 entries</span>`;
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">No history transaction archives found matching query.</td>
            </tr>
        `;
        return;
    }

    pagEl.innerHTML = `
        <span>Showing ${startIdx + 1} to ${endIdx} of ${totalRecords} entries</span>
        <div class="flex gap-1">
            <button type="button" class="btn btn-secondary btn-sm" id="btn-history-prev" style="padding:2px 8px; font-size:0.7rem; cursor:pointer;">Prev</button>
            <button type="button" class="btn btn-secondary btn-sm" id="btn-history-next" style="padding:2px 8px; font-size:0.7rem; cursor:pointer;">Next</button>
        </div>
    `;

    document.getElementById("btn-history-prev").onclick = () => {
        if (historyCurrentPage > 0) {
            historyCurrentPage--;
            renderHistoryView();
        }
    };
    document.getElementById("btn-history-next").onclick = () => {
        if (historyCurrentPage < totalPages - 1) {
            historyCurrentPage++;
            renderHistoryView();
        }
    };

    visibleData.forEach(v => {
        const tr = document.createElement("tr");
        const entryTime = v.checkIn ? new Date(v.checkIn).toLocaleString() : "?";
        const exitTime = v.checkOut ? new Date(v.checkOut).toLocaleString() : "?";
        const canSendWA = (v.status === 'Checked In' || v.status === 'Checked Out');

        tr.innerHTML = `
            <td><code>${v.id}</code></td>
            <td>
                <div style="font-weight: 600;">${v.name}</div>
                <div class="text-secondary text-xs">${v.company || 'Private'}</div>
            </td>
            <td>${v.hostName} (${v.hostDept})</td>
            <td>${entryTime}</td>
            <td>${exitTime}</td>
            <td>
                <span class="badge-status ${v.status.toLowerCase()}">${v.status}</span>
            </td>
            <td>
                <div class="flex gap-2" style="flex-wrap:wrap;">
                    <button type="button" class="btn btn-secondary btn-sm" onclick="viewPrintPassModal('${v.id}')" title="Preview Pass Card">Pass</button>
                    ${canSendWA ? `<button type="button" class="btn btn-success btn-sm" onclick="resendPassWhatsApp('${v.id}')" title="Resend Pass via WhatsApp" style="min-width:40px;">?? WA</button>` : ''}
                </div>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

function filterHistoryLogs() {
    historyCurrentPage = 0;
    renderHistoryView();
}

let reportsFilteredData = [];
let reportsCurrentPage = 0;
const reportsPageSize = 10;

function setupReportsConsoleListeners() {
    console.log("[Reports] Initializing dynamic filter console sensors...");
    const inputs = [
        "report-filter-search",
        "report-filter-category",
        "report-filter-dept",
        "report-filter-status",
        "report-filter-start-date",
        "report-filter-end-date"
    ];

    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.oninput = el.onchange = () => {
                reportsCurrentPage = 0;
                renderReportsData();
            };
        }
    });

    const deptSelect = document.getElementById("report-filter-dept");
    if (deptSelect) {
        deptSelect.innerHTML = '<option value="all">All Departments</option>';
        state.departments.forEach(d => {
            const opt = document.createElement("option");
            opt.value = d.name;
            opt.innerText = d.name;
            deptSelect.appendChild(opt);
        });
    }

    const bindQuickRange = (btnId, rangeType) => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.onclick = () => {
                const startInput = document.getElementById("report-filter-start-date");
                const endInput = document.getElementById("report-filter-end-date");
                const todayStr = getLocalDateStr();

                if (rangeType === "today") {
                    startInput.value = endInput.value = todayStr;
                } else if (rangeType === "week") {
                    const start = new Date();
                    start.setDate(start.getDate() - 7);
                    startInput.value = start.toISOString().split("T")[0];
                    endInput.value = todayStr;
                } else if (rangeType === "month") {
                    const start = new Date();
                    start.setDate(start.getDate() - 30);
                    startInput.value = start.toISOString().split("T")[0];
                    endInput.value = todayStr;
                } else {
                    startInput.value = endInput.value = "";
                }
                reportsCurrentPage = 0;
                renderReportsData();
            };
        }
    };

    bindQuickRange("btn-report-quick-today", "today");
    bindQuickRange("btn-report-quick-week", "week");
    bindQuickRange("btn-report-quick-month", "month");
    bindQuickRange("btn-report-quick-all", "all");

    const btnCsv = document.getElementById("btn-export-reports-csv");
    if (btnCsv) btnCsv.onclick = exportReportsCSV;

    const btnXls = document.getElementById("btn-export-reports-xls");
    if (btnXls) btnXls.onclick = exportReportsXLS;

    const btnPdf = document.getElementById("btn-print-reports");
    if (btnPdf) btnPdf.onclick = downloadPDFReportFile;

    const btnScheduleModal = document.getElementById("btn-schedule-report-modal");
    if (btnScheduleModal) {
        btnScheduleModal.onclick = () => {
            document.getElementById("modal-schedule-report").classList.add("active");
        };
    }

    const btnConfirmSchedule = document.getElementById("btn-confirm-schedule-report");
    if (btnConfirmSchedule) {
        btnConfirmSchedule.onclick = scheduleReportAction;
    }
}

function renderReportsData() {
    const tableHead = document.getElementById("report-table-head");
    const tableBody = document.getElementById("report-table-body");
    const tableTitle = document.getElementById("report-table-title");

    if (!tableBody) return;

    const isGatekeeper = state.currentUser && (state.currentUser.role.toLowerCase() === "gatekeeper" || state.currentUser.role.toLowerCase() === "security gatekeeper");

    const searchVal = (document.getElementById("report-filter-search")?.value || "").trim().toLowerCase();
    const categoryVal = document.getElementById("report-filter-category")?.value || "all";
    const deptVal = document.getElementById("report-filter-dept")?.value || "all";
    const statusVal = document.getElementById("report-filter-status")?.value || "all";
    const startVal = document.getElementById("report-filter-start-date")?.value || "";
    const endVal = document.getElementById("report-filter-end-date")?.value || "";

    reportsFilteredData = state.visitors.filter(v => {
        if (state.currentUser && state.currentUser.role.toLowerCase() === "employee") {
            const empCode = state.currentUser.employeeCode || state.currentUser.username || "";
            const empName = state.currentUser.name || "";
            const hostIdMatch = v.hostId && empCode && v.hostId.toLowerCase() === empCode.toLowerCase();
            const hostNameMatch = v.hostName && empName && v.hostName.toLowerCase() === empName.toLowerCase();
            if (!hostIdMatch && !hostNameMatch) return false;
        }

        let textMatch = true;
        if (searchVal !== "") {
            textMatch = (v.name && v.name.toLowerCase().includes(searchVal)) ||
                (v.id && v.id.toLowerCase().includes(searchVal)) ||
                (v.company && v.company.toLowerCase().includes(searchVal)) ||
                (v.hostName && v.hostName.toLowerCase().includes(searchVal));
        }

        let catMatch = true;
        if (categoryVal !== "all") {
            const lowerPurpose = (v.purpose || "").toLowerCase();
            const lowerMasterId = (v.masterId || "").toLowerCase();
            const lowerId = (v.id || "").toLowerCase();

            if (categoryVal === "Student") {
                catMatch = lowerPurpose === "student" || lowerPurpose === "iv" || lowerMasterId.startsWith("stu") || lowerId.startsWith("stu") || (v.notes && v.notes.toLowerCase().includes("student"));
            } else if (categoryVal === "Customer") {
                catMatch = lowerPurpose === "customer" || lowerPurpose === "meeting" || lowerMasterId.startsWith("cust") || lowerId.startsWith("cust");
            } else if (categoryVal === "Vendor") {
                catMatch = lowerPurpose === "vendor" || lowerMasterId.startsWith("vnd") || lowerId.startsWith("vnd");
            } else if (categoryVal === "Contractor") {
                catMatch = lowerPurpose === "contractor" || lowerMasterId.startsWith("cnt") || lowerId.startsWith("cnt");
            } else if (categoryVal === "Delivery") {
                catMatch = lowerPurpose === "delivery" || lowerMasterId.startsWith("dlv") || lowerId.startsWith("dlv");
            } else {
                catMatch = !["student", "customer", "vendor", "contractor", "delivery"].includes(lowerPurpose);
            }
        }

        let deptMatch = true;
        if (deptVal !== "all") {
            deptMatch = v.hostDept === deptVal;
        }

        let statusMatch = true;
        if (statusVal !== "all") {
            statusMatch = v.status === statusVal;
        }

        let dateMatch = true;
        if (startVal !== "") {
            dateMatch = dateMatch && v.visitDate >= startVal;
        }
        if (endVal !== "") {
            dateMatch = dateMatch && v.visitDate <= endVal;
        }

        return textMatch && catMatch && deptMatch && statusMatch && dateMatch;
    });

    const totalEl = document.getElementById("rep-summary-total");
    const activeEl = document.getElementById("rep-summary-active");
    const checkoutEl = document.getElementById("rep-summary-checkout");
    if (totalEl) totalEl.innerText = reportsFilteredData.length;
    if (activeEl) activeEl.innerText = reportsFilteredData.filter(v => v.status === "Checked In").length;
    if (checkoutEl) checkoutEl.innerText = reportsFilteredData.filter(v => v.status === "Checked Out").length;

    // Toggle reports widgets based on role
    const repSummary = document.querySelector(".report-summary-boxes");
    if (repSummary) {
        if (isGatekeeper) repSummary.classList.add("hidden");
        else repSummary.classList.remove("hidden");
    }
    const repLayout = document.querySelector(".reports-layout");
    if (repLayout) {
        if (isGatekeeper) repLayout.classList.add("hidden");
        else repLayout.classList.remove("hidden");
    }
    const insightsCard = document.getElementById("reports-ai-insights")?.closest(".dashboard-card");
    if (insightsCard) {
        if (isGatekeeper) insightsCard.classList.add("hidden");
        else insightsCard.classList.remove("hidden");
    }
    const exportHeader = document.querySelector("#view-reports .card-header .flex.gap-2");
    if (exportHeader) {
        if (isGatekeeper) exportHeader.classList.add("hidden");
        else exportHeader.classList.remove("hidden");
    }

    if (tableTitle) tableTitle.innerText = `Audit logs matching queries (${reportsFilteredData.length} records found)`;
    if (tableHead) {
        if (isGatekeeper) {
            tableHead.innerHTML = `
                <tr>
                    <th>Visitor Name</th>
                    <th>Visitor Type</th>
                    <th>Host</th>
                    <th>Check-In Time</th>
                    <th>Check-Out Time</th>
                    <th>Status</th>
                    <th>Date</th>
                </tr>
            `;
        } else {
            tableHead.innerHTML = `
                <tr>
                    <th>Visitor ID</th>
                    <th>Visitor Name</th>
                    <th>Company</th>
                    <th>Host Employee</th>
                    <th>Visit Date</th>
                    <th>Check-In</th>
                    <th>Check-Out</th>
                    <th>Status</th>
                </tr>
            `;
        }
    }

    tableBody.innerHTML = "";

    const totalRecords = reportsFilteredData.length;
    const totalPages = Math.ceil(totalRecords / reportsPageSize);
    if (reportsCurrentPage >= totalPages && totalPages > 0) {
        reportsCurrentPage = totalPages - 1;
    }

    const startIdx = reportsCurrentPage * reportsPageSize;
    const endIdx = Math.min(startIdx + reportsPageSize, totalRecords);
    const visibleData = reportsFilteredData.slice(startIdx, endIdx);

    let pagEl = document.getElementById("reports-pagination-container");
    if (!pagEl) {
        pagEl = document.createElement("div");
        pagEl.id = "reports-pagination-container";
        pagEl.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding: 1rem; border-top: 1px solid var(--border-color); font-size: 0.75rem; color: var(--text-secondary);";
        tableBody.closest(".table-container").appendChild(pagEl);
    }

    if (totalRecords === 0) {
        pagEl.innerHTML = `<span>Showing 0 to 0 of 0 entries</span>`;
        if (isGatekeeper) {
            tableBody.innerHTML = `<tr><td colspan="7" class="empty-state" style="text-align:center; padding:2rem;">No visitor audit logs match the current query criteria.</td></tr>`;
        } else {
            tableBody.innerHTML = `<tr><td colspan="8" class="empty-state" style="text-align:center; padding:2rem;">No visitor audit logs match the current query criteria.</td></tr>`;
        }
    } else {
        pagEl.innerHTML = `
            <span>Showing ${startIdx + 1} to ${endIdx} of ${totalRecords} entries</span>
            <div class="flex gap-1">
                <button type="button" class="btn btn-secondary btn-sm" id="btn-reports-prev" style="padding:2px 8px; font-size:0.7rem; cursor:pointer;">Prev</button>
                <button type="button" class="btn btn-secondary btn-sm" id="btn-reports-next" style="padding:2px 8px; font-size:0.7rem; cursor:pointer;">Next</button>
            </div>
        `;

        document.getElementById("btn-reports-prev").onclick = () => {
            if (reportsCurrentPage > 0) {
                reportsCurrentPage--;
                renderReportsData();
            }
        };
        document.getElementById("btn-reports-next").onclick = () => {
            if (reportsCurrentPage < totalPages - 1) {
                reportsCurrentPage++;
                renderReportsData();
            }
        };

        visibleData.forEach(v => {
            const tr = document.createElement("tr");
            if (isGatekeeper) {
                let vType = v.purpose || "Regular";
                if (vType === "IV" || vType === "Student") vType = "Student";
                else if (vType === "Meeting" || vType === "Customer") vType = "Customer";
                else if (vType === "Vendor") vType = "Vendor";

                let statusBadgeClass = "pending";
                if (vType === "Student") statusBadgeClass = "pending";
                else if (vType === "Customer") statusBadgeClass = "checked-in";
                else if (vType === "Vendor") statusBadgeClass = "expected";

                tr.innerHTML = `
                    <td><strong>${v.name}</strong></td>
                    <td><span class="badge-status ${statusBadgeClass}">${vType}</span></td>
                    <td>${v.hostName || "-"}</td>
                    <td>${v.checkIn ? new Date(v.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                    <td>${v.checkOut ? new Date(v.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                    <td><span class="badge-status ${v.status.toLowerCase()}">${v.status}</span></td>
                    <td>${v.visitDate || "-"}</td>
                `;
            } else {
                tr.innerHTML = `
                    <td><code>${v.id}</code></td>
                    <td><strong>${v.name}</strong></td>
                    <td>${v.company || "Private Guest"}</td>
                    <td>${v.hostName} (${v.hostDept})</td>
                    <td>${v.visitDate}</td>
                    <td>${v.checkIn ? new Date(v.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '?'}</td>
                    <td>${v.checkOut ? new Date(v.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '?'}</td>
                    <td><span class="badge-status ${v.status.toLowerCase()}">${v.status}</span></td>
                `;
            }
            tableBody.appendChild(tr);
        });
    }

    renderReportsCharts();

    const insightsEl = document.getElementById("reports-ai-insights");
    if (insightsEl && window.vmsAi) {
        insightsEl.innerHTML = window.vmsAi.generateInsightsText(reportsFilteredData, state.blacklist);
    }
}

function renderReportsCharts() {
    const purposes = {};
    reportsFilteredData.forEach(v => {
        const p = v.purpose || "Other";
        purposes[p] = (purposes[p] || 0) + 1;
    });

    const purposeSvg = document.getElementById("reports-chart-donut");
    const legendContainer = document.getElementById("reports-legend");
    if (!purposeSvg || !legendContainer) return;

    purposeSvg.innerHTML = "";
    legendContainer.innerHTML = "";

    const purposeColors = {
        "Meeting": "#2563eb",
        "Interview": "#10b981",
        "Maintenance": "#fbbf24",
        "Delivery": "#06b6d4",
        "Other": "#a855f7"
    };

    const totalPurposes = Object.values(purposes).reduce((a, b) => a + b, 0);

    if (totalPurposes === 0) {
        purposeSvg.innerHTML = `<text x="50" y="50" text-anchor="middle" fill="#94a3b8" font-size="6">No purpose data</text>`;
    } else {
        let accumulativePercent = 0;
        Object.entries(purposes).forEach(([purpose, count]) => {
            const pct = (count / totalPurposes) * 100;
            const color = purposeColors[purpose] || "#64748b";

            const dashArray = `${pct} ${100 - pct}`;
            const dashOffset = 100 - accumulativePercent + 25;
            accumulativePercent += pct;

            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("cx", "50");
            circle.setAttribute("cy", "50");
            circle.setAttribute("r", "35");
            circle.setAttribute("stroke", color);
            circle.setAttribute("stroke-dasharray", dashArray);
            circle.setAttribute("stroke-dashoffset", dashOffset.toString());

            const titleEl = document.createElementNS("http://www.w3.org/2000/svg", "title");
            titleEl.textContent = `${purpose}: ${count} visit(s) (${Math.round(pct)}%)`;
            circle.appendChild(titleEl);

            purposeSvg.appendChild(circle);

            const leg = document.createElement("div");
            leg.className = "legend-item";
            leg.innerHTML = `
                <span class="legend-color" style="background-color: ${color}"></span>
                <span>${purpose} (${count})</span>
            `;
            legendContainer.appendChild(leg);
        });
    }

    const arrivals = Array(11).fill(0);
    reportsFilteredData.forEach(v => {
        if (!v.checkIn) return;
        const date = new Date(v.checkIn);
        const hrs = date.getHours();
        if (hrs >= 8 && hrs <= 18) {
            arrivals[hrs - 8]++;
        }
    });

    const trafficSvg = document.getElementById("reports-chart-bar");
    if (!trafficSvg) return;
    trafficSvg.innerHTML = "";

    const maxArrivals = Math.max(...arrivals, 1);
    const colWidth = 14;
    const gap = 6;
    const maxBarHeight = 80;

    arrivals.forEach((count, idx) => {
        const xPos = idx * (colWidth + gap) + 12;
        const barHeight = (count / maxArrivals) * maxBarHeight;
        const yPos = 90 - barHeight;

        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", xPos.toString());
        rect.setAttribute("y", yPos.toString());
        rect.setAttribute("width", colWidth.toString());
        rect.setAttribute("height", barHeight.toString());
        rect.setAttribute("rx", "2");
        rect.setAttribute("fill", "var(--accent-primary)");

        const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
        title.textContent = `Hour Slot: ${idx + 8}:00 | Arrivals: ${count}`;
        rect.appendChild(title);
        trafficSvg.appendChild(rect);

        if (count > 0) {
            const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
            txt.setAttribute("x", (xPos + colWidth / 2).toString());
            txt.setAttribute("y", (yPos - 2).toString());
            txt.setAttribute("text-anchor", "middle");
            txt.setAttribute("fill", "#64748b");
            txt.setAttribute("font-size", "5");
            txt.textContent = count.toString();
            trafficSvg.appendChild(txt);
        }
    });
}

function exportReportsCSV() {
    if (reportsFilteredData.length === 0) {
        showToast("CSV Failed", "No records found matching current query.", "warning");
        return;
    }

    const headers = ["Visitor ID", "Name", "Phone", "Email", "Company", "Purpose", "Vehicle No", "ID Type", "ID Number", "Host Employee", "Host Department", "Check-In Date/Time", "Check-Out Date/Time", "Status"];
    let csvRows = [];
    csvRows.push(headers.join(","));

    reportsFilteredData.forEach(v => {
        const row = [
            `"${v.id}"`,
            `"${v.name}"`,
            `"${v.phone}"`,
            `"${v.email || ''}"`,
            `"${v.company || 'Individual'}"`,
            `"${v.purpose}"`,
            `"${v.vehicle || 'None'}"`,
            `"${v.idType || 'None'}"`,
            `"${v.idNumber || 'None'}"`,
            `"${v.hostName}"`,
            `"${v.hostDept}"`,
            `"${v.checkIn ? new Date(v.checkIn).toLocaleString() : 'N/A'}"`,
            `"${v.checkOut ? new Date(v.checkOut).toLocaleString() : 'N/A'}"`,
            `"${v.status}"`
        ];
        csvRows.push(row.join(","));
    });

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);

    const dateStr = getLocalDateStr();
    link.setAttribute("download", `gatekeeper_visitor_reports_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Export Completed", "Filtered records downloaded as CSV.", "success");
}

function exportReportsXLS() {
    if (reportsFilteredData.length === 0) {
        showToast("XLS Failed", "No records found matching current query.", "warning");
        return;
    }

    let xlsTemplate = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
            <!--[if gte mso 9]>
            <xml>
                <x:ExcelWorkbook>
                    <x:ExcelWorksheets>
                        <x:ExcelWorksheet>
                            <x:Name>Visitor Logs</x:Name>
                            <x:WorksheetOptions>
                                <x:DisplayGridlines/>
                            </x:WorksheetOptions>
                        </x:ExcelWorksheet>
                    </x:ExcelWorksheets>
                </x:ExcelWorkbook>
            </xml>
            <![endif]-->
            <style>
                table { border-collapse: collapse; width: 100%; font-family: sans-serif; }
                th { background-color: #0f172a; color: #ffffff; padding: 8px; font-weight: bold; border: 1px solid #cbd5e1; }
                td { padding: 6px; border: 1px solid #cbd5e1; font-size: 11px; }
            </style>
        </head>
        <body>
            <h2>Barani Hydraulics - Visitor Log Audit Report</h2>
            <p>Generated: ${new Date().toLocaleString()}</p>
            <table>
                <thead>
                    <tr>
                        <th>Visitor ID</th>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Company</th>
                        <th>Purpose</th>
                        <th>Host Employee</th>
                        <th>Department</th>
                        <th>Check-In Time</th>
                        <th>Check-Out Time</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
    `;

    reportsFilteredData.forEach(v => {
        xlsTemplate += `
            <tr>
                <td>${v.id}</td>
                <td><b>${v.name}</b></td>
                <td>${v.phone || ''}</td>
                <td>${v.company || 'Private'}</td>
                <td>${v.purpose}</td>
                <td>${v.hostName}</td>
                <td>${v.hostDept}</td>
                <td>${v.checkIn ? new Date(v.checkIn).toLocaleString() : 'N/A'}</td>
                <td>${v.checkOut ? new Date(v.checkOut).toLocaleString() : 'N/A'}</td>
                <td>${v.status}</td>
            </tr>
        `;
    });

    xlsTemplate += `
                </tbody>
            </table>
        </body>
        </html>
    `;

    const blob = new Blob([xlsTemplate], { type: "application/vnd.ms-excel" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);

    const dateStr = getLocalDateStr();
    link.download = `gatekeeper_visitor_reports_${dateStr}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Export Completed", "Excel XLS document spreadsheet saved.", "success");
}

function downloadPDFReportFile() {
    if (typeof window.jspdf === 'undefined') {
        showToast("PDF Export Error", "jsPDF library is not loaded.", "danger");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("BARANI HYDRAULICS VMS", 14, 18);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(226, 232, 240);
    doc.text("Corporate Visitor Log Audit Report", 14, 25);
    doc.text("Generated: " + new Date().toLocaleString(), 14, 32);

    const branchSelect = document.getElementById("header-branch-select");
    const branchVal = branchSelect ? branchSelect.value : "all";
    doc.text("Security Branch Profile: " + branchVal.toUpperCase(), 140, 25);
    doc.text("Duty Terminal: Main Gate 1", 140, 32);

    doc.setFillColor(248, 250, 252);
    doc.rect(14, 48, 182, 18, "F");
    doc.setStrokeColor(226, 232, 240);
    doc.rect(14, 48, 182, 18);

    const total = reportsFilteredData.length;
    const inside = reportsFilteredData.filter(v => v.status === "Checked In").length;
    const exited = reportsFilteredData.filter(v => v.status === "Checked Out").length;

    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text("TOTAL RECORDS", 20, 54);
    doc.text("ACTIVE INSIDE", 85, 54);
    doc.text("CHECKED OUT", 150, 54);

    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text(String(total), 20, 61);
    doc.text(String(inside), 85, 61);
    doc.text(String(exited), 150, 61);

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setFillColor(241, 245, 249);
    doc.rect(14, 74, 182, 8, "F");
    doc.rect(14, 74, 182, 8);

    doc.setTextColor(71, 85, 105);
    doc.text("Visitor ID", 16, 79.5);
    doc.text("Visitor Details", 42, 79.5);
    doc.text("Host Details", 90, 79.5);
    doc.text("Entry time", 138, 79.5);
    doc.text("Status", 182, 79.5);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);

    let y = 88;
    const pageHeight = doc.internal.pageSize.getHeight();

    reportsFilteredData.forEach((v, idx) => {
        if (y + 14 > pageHeight) {
            doc.addPage();
            y = 20;
            doc.setFillColor(241, 245, 249);
            doc.rect(14, y - 6, 182, 8, "F");
            doc.rect(14, y - 6, 182, 8);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(71, 85, 105);
            doc.text("Visitor ID", 16, y - 0.5);
            doc.text("Visitor Details", 42, y - 0.5);
            doc.text("Host Details", 90, y - 0.5);
            doc.text("Entry time", 138, y - 0.5);
            doc.text("Status", 182, y - 0.5);

            doc.setFont("helvetica", "normal");
            doc.setTextColor(15, 23, 42);
            y += 8;
        }

        doc.setFontSize(8);
        doc.text(v.id, 16, y);
        doc.setFont("helvetica", "bold");
        doc.text(v.name.substring(0, 20), 42, y);
        doc.setFont("helvetica", "normal");
        doc.text(v.company ? v.company.substring(0, 20) : "Independent", 42, y + 4.5);

        doc.text(v.hostName.substring(0, 20), 90, y);
        doc.text(v.hostDept, 90, y + 4.5);

        const checkInStr = v.checkIn ? new Date(v.checkIn).toLocaleString() : v.visitDate;
        doc.text(checkInStr.substring(0, 22), 138, y);
        doc.text(v.status, 182, y);

        doc.setStrokeColor(241, 245, 249);
        doc.line(14, y + 6.5, 196, y + 6.5);

        y += 11;
    });

    const dateStr = getLocalDateStr();
    doc.save("gatekeeper_audit_report_" + dateStr + ".pdf");
    showToast("PDF Exported", "Analytical report PDF saved successfully.", "success");
}

function scheduleReportAction() {
    const format = document.getElementById("schedule-format").value;
    const frequency = document.getElementById("schedule-frequency").value;
    const email = document.getElementById("schedule-email").value.trim();
    const time = document.getElementById("schedule-time").value;

    if (!email) {
        showToast("Validation Error", "Please provide a valid recipient email address.", "warning");
        return;
    }

    state.scheduledReports = state.scheduledReports || [];
    const newSchedule = {
        id: "SCH-" + Date.now().toString().substring(8),
        format,
        frequency,
        email,
        time,
        created: new Date().toISOString(),
        active: true
    };
    state.scheduledReports.push(newSchedule);
    saveState();

    logNotificationSimulator(
        "Automated Report Schedule Created",
        "Email & SysLog",
        email,
        "System set to compile & dispatch " + format + " reports (" + frequency + " at " + time + ") starting tomorrow morning."
    );

    addAuditLog("Report Configured", "Admin", "Scheduled automatic " + format + " report dispatches to: " + email + " (Interval: " + frequency + ")");

    document.getElementById("modal-schedule-report").classList.remove("active");
    showToast("Schedule Activated", "Report delivery scheduled to " + email + " successfully.", "success");
}
// 14. Settings / Admin Management Portal
function renderSettingsData() {
    // 1. Employee Management List Table
    const empTable = document.getElementById("admin-employees-list-body");
    empTable.innerHTML = "";
    state.employees.forEach(emp => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><code>${emp.id}</code></td>
            <td><strong>${emp.name}</strong></td>
            <td>${emp.dept}</td>
            <td>${emp.email}</td>
            <td>${emp.phone}</td>
            <td>
                <div class="flex gap-2">
                    <button class="btn btn-secondary btn-sm" onclick="openEmployeeModal('${emp.id}')">Edit</button>
                    <button class="btn btn-secondary btn-sm" onclick="deleteEmployeeCRUD('${emp.id}')" style="color:var(--accent-danger);">Delete</button>
                </div>
            </td>
        `;
        empTable.appendChild(tr);
    });

    // 2. Security User List Table
    const secTable = document.getElementById("admin-security-list-body");
    secTable.innerHTML = "";
    state.securityUsers.forEach(user => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><code>${user.username}</code></td>
            <td><strong>${user.name}</strong></td>
            <td>${user.phone}</td>
            <td>${user.shift}</td>
            <td>
                <div class="flex gap-2">
                    <button class="btn btn-secondary btn-sm" onclick="openSecurityModal('${user.username}')">Edit</button>
                    <button class="btn btn-secondary btn-sm" onclick="deleteSecurityCRUD('${user.username}')" style="color:var(--accent-danger);">Delete</button>
                </div>
            </td>
        `;
        secTable.appendChild(tr);
    });

    // 3. Departments List Table
    const deptTable = document.getElementById("admin-depts-list-body");
    deptTable.innerHTML = "";
    state.departments.forEach(dept => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${dept.name}</strong></td>
            <td>${dept.location}</td>
        `;
        deptTable.appendChild(tr);
    });

    // 4. SMS simulator list
    const simPanel = document.getElementById("sms-email-logs-panel");
    simPanel.innerHTML = "";
    if (state.dispatchLogs.length === 0) {
        simPanel.innerHTML = '<div class="empty-state">No simulated SMS/Email logs logged yet.</div>';
    } else {
        state.dispatchLogs.forEach(log => {
            const div = document.createElement("div");
            div.className = "sim-log-item success";
            div.innerHTML = `
                <strong>[${log.time}] Outbound Alert (${log.channel})</strong><br>
                To: ${log.destination} | Subject: ${log.subject}<br>
                Message: "${log.content.replace(/\n/g, ' ')}"
            `;
            simPanel.appendChild(div);
        });
    }

    // 5. Blacklisted Visitors Directory Table
    const blacklistTable = document.getElementById("admin-blacklist-list-body");
    if (blacklistTable) {
        blacklistTable.innerHTML = "";
        if (state.blacklist.length === 0) {
            blacklistTable.innerHTML = `<tr><td colspan="6" class="empty-state">No restricted visitor records flagged in system.</td></tr>`;
        } else {
            state.blacklist.forEach(item => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td><strong>${item.name}</strong></td>
                    <td><code>${item.phone}</code></td>
                    <td>${item.idType || 'None'} (${item.idNumber || 'N/A'})</td>
                    <td><span style="color: var(--accent-danger); font-weight: 500; font-size: 0.8rem;">${item.reason}</span></td>
                    <td>${item.dateAdded}</td>
                    <td>
                        <div class="flex gap-2">
                            <button class="btn btn-secondary btn-sm" onclick="openBlacklistModal('${item.id}')">Edit</button>
                            <button class="btn btn-secondary btn-sm" onclick="deleteBlacklistCRUD('${item.id}')" style="color:var(--accent-danger);">Delete</button>
                        </div>
                    </td>
                `;
                blacklistTable.appendChild(tr);
            });
        }
    }

    // 6. System Audit Logs Table
    renderAuditLogsTable();

    // Wire up clear audit logs button (idempotent)
    const btnClearAudit = document.getElementById("btn-clear-audit-logs");
    if (btnClearAudit && !btnClearAudit._auditBound) {
        btnClearAudit._auditBound = true;
        btnClearAudit.addEventListener("click", () => {
            if (!confirm("Clear all system audit trail records?")) return;
            state.auditLogs = [];
            saveState();
            renderAuditLogsTable();
            showToast("Audit Logs Cleared", "All audit trail records have been wiped.", "warning");
        });
    }
}

// 15. Employee database CRUD Controllers
function openEmployeeModal(empId = "") {
    const modal = document.getElementById("modal-employee");
    const form = document.getElementById("employee-crud-form");
    const title = document.getElementById("employee-modal-title");

    form.reset();

    if (empId === "") {
        title.innerText = "Add New Host Employee";
        document.getElementById("crud-emp-id").value = "";
    } else {
        title.innerText = "Modify Host Employee Details";
        const emp = state.employees.find(e => e.id === empId);
        if (emp) {
            document.getElementById("crud-emp-id").value = emp.id;
            document.getElementById("crud-emp-name").value = emp.name;
            document.getElementById("crud-emp-dept").value = emp.dept;
            document.getElementById("crud-emp-cabin").value = emp.cabin;
            document.getElementById("crud-emp-email").value = emp.email;
            document.getElementById("crud-emp-phone").value = emp.phone;
        }
    }

    modal.classList.add("active");
}

function saveEmployeeCRUD(e) {
    e.preventDefault();
    const id = document.getElementById("crud-emp-id").value;
    const name = document.getElementById("crud-emp-name").value.trim();
    const dept = document.getElementById("crud-emp-dept").value.trim();
    const cabin = document.getElementById("crud-emp-cabin").value.trim();
    const email = document.getElementById("crud-emp-email").value.trim();
    const phone = document.getElementById("crud-emp-phone").value.trim();

    let targetEmp = null;
    if (id === "") {
        // Add new
        const newId = "EMP" + (101 + state.employees.length);
        targetEmp = { id: newId, name, dept, cabin, email, phone, status: "In Office" };
        state.employees.push(targetEmp);
        showToast("Employee Added", `${name} added to corporate files.`, "success");
    } else {
        // Edit existing
        const idx = state.employees.findIndex(emp => emp.id === id);
        if (idx !== -1) {
            state.employees[idx] = { ...state.employees[idx], name, dept, cabin, email, phone };
            targetEmp = state.employees[idx];
            showToast("Employee Updated", `${name} details modified.`, "success");
        }
    }

    saveState();
    if (supabaseClient && targetEmp) {
        supabaseClient.from('employees').upsert(mapEmployeeToDb(targetEmp), { onConflict: 'employee_code' })
            .then(({ error }) => { if (error) console.error("Employee cloud sync error:", error); });
    }
    document.getElementById("modal-employee").classList.remove("active");
    renderSettingsData();
}

window.deleteEmployeeCRUD = function (empId) {
    if (!confirm("Are you sure you want to delete this employee from the roster?")) return;

    const idx = state.employees.findIndex(e => e.id === empId);
    if (idx !== -1) {
        const name = state.employees[idx].name;
        state.employees.splice(idx, 1);
        saveState();
        if (supabaseClient) {
            supabaseClient.from('employees').delete().eq('employee_code', empId)
                .then(({ error }) => { if (error) console.error("Employee cloud delete error:", error); });
        }
        renderSettingsData();
        showToast("Deleted", `${name} deleted from databases.`, "warning");
    }
};

// Security accounts CRUD
function openSecurityModal(username = "") {
    const modal = document.getElementById("modal-security-user");
    const form = document.getElementById("security-user-crud-form");
    const title = document.getElementById("security-modal-title");

    form.reset();
    document.getElementById("crud-sec-login").readOnly = false;

    if (username === "") {
        title.innerText = "Add New Security Officer";
        document.getElementById("crud-sec-id").value = "";
    } else {
        title.innerText = "Modify Security Officer Details";
        const user = state.securityUsers.find(u => u.username === username);
        if (user) {
            document.getElementById("crud-sec-id").value = user.username;
            document.getElementById("crud-sec-login").value = user.username;
            document.getElementById("crud-sec-login").readOnly = true;
            document.getElementById("crud-sec-name").value = user.name;
            document.getElementById("crud-sec-phone").value = user.phone;
            document.getElementById("crud-sec-shift").value = user.shift;
        }
    }

    modal.classList.add("active");
}

function saveSecurityCRUD(e) {
    e.preventDefault();
    const id = document.getElementById("crud-sec-id").value;
    const login = document.getElementById("crud-sec-login").value.trim().toLowerCase();
    const name = document.getElementById("crud-sec-name").value.trim();
    const phone = document.getElementById("crud-sec-phone").value.trim();
    const shift = document.getElementById("crud-sec-shift").value;

    let targetSec = null;
    if (id === "") {
        // Add new
        targetSec = { username: login, name, role: "Security Gatekeeper", phone, shift };
        state.securityUsers.push(targetSec);
        showToast("Operator Added", `${name} registered for Duty.`, "success");
    } else {
        // Edit existing
        const idx = state.securityUsers.findIndex(u => u.username === id);
        if (idx !== -1) {
            state.securityUsers[idx] = { ...state.securityUsers[idx], name, phone, shift };
            targetSec = state.securityUsers[idx];
            showToast("Details Updated", `Officer ${name} details modified.`, "success");
        }
    }

    saveState();
    if (supabaseClient && targetSec) {
        supabaseClient.from('security_users').upsert(mapSecurityUserToDb(targetSec), { onConflict: 'username' })
            .then(({ error }) => { if (error) console.error("Security profile cloud sync error:", error); });
    }
    document.getElementById("modal-security-user").classList.remove("active");
    renderSettingsData();
}

window.deleteSecurityCRUD = function (username) {
    if (username === "admin") {
        showToast("Action Forbidden", "System Admin account cannot be deleted.", "danger");
        return;
    }

    if (!confirm(`Remove operator username "${username}"?`)) return;

    const idx = state.securityUsers.findIndex(u => u.username === username);
    if (idx !== -1) {
        state.securityUsers.splice(idx, 1);
        saveState();
        if (supabaseClient) {
            supabaseClient.from('security_users').delete().eq('username', username)
                .then(({ error }) => { if (error) console.error("Security profile cloud delete error:", error); });
        }
        renderSettingsData();
        showToast("Deleted", "Officer credentials revoked.", "warning");
    }
};

// 16. JSON Backups Database management
function exportDatabaseJSON() {
    const backupData = {
        employees: state.employees,
        visitors: state.visitors,
        securityUsers: state.securityUsers,
        departments: state.departments,
        notifications: state.notifications,
        dispatchLogs: state.dispatchLogs,
        blacklist: state.blacklist,
        studentMaster: state.studentMaster,
        customerMaster: state.customerMaster,
        vendorMaster: state.vendorMaster,
        contractorMaster: state.contractorMaster,
        deliveryMaster: state.deliveryMaster,
        serviceEngineerMaster: state.serviceEngineerMaster,
        backupTime: new Date().toISOString()
    };

    const str = JSON.stringify(backupData, null, 2);
    const encoded = "data:text/json;charset=utf-8," + encodeURIComponent(str);
    const link = document.createElement("a");
    link.setAttribute("href", encoded);
    link.setAttribute("download", `gatekeeper_database_backup_${getLocalDateStr()}.json`);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Backup Created", "Database backup archive compiled successfully.", "success");
}

function importDatabaseJSON(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!confirm("Caution: Restoring a backup will overwrite the current local database files. Proceed?")) {
        e.target.value = "";
        return;
    }

    const reader = new FileReader();
    reader.onload = function (evt) {
        try {
            const dataObj = JSON.parse(evt.target.result);

            if (dataObj.employees && dataObj.visitors && dataObj.securityUsers) {
                state.employees = dataObj.employees;
                state.visitors = dataObj.visitors;
                state.securityUsers = dataObj.securityUsers;
                state.departments = dataObj.departments || state.departments;
                state.notifications = dataObj.notifications || [];
                state.dispatchLogs = dataObj.dispatchLogs || [];
                state.blacklist = dataObj.blacklist || [];
                state.studentMaster = dataObj.studentMaster || [];
                state.customerMaster = dataObj.customerMaster || [];
                state.vendorMaster = dataObj.vendorMaster || [];
                state.contractorMaster = dataObj.contractorMaster || [];
                state.deliveryMaster = dataObj.deliveryMaster || [];
                state.serviceEngineerMaster = dataObj.serviceEngineerMaster || [];

                saveState();
                showToast("Database Restored", "Archives successfully restored.", "success");

                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                showToast("Import Failed", "Invalid database backup file format structure.", "danger");
            }
        } catch (err) {
            console.error(err);
            showToast("Import Error", "Unable to parse files JSON structure.", "danger");
        }
    };
    reader.readAsText(file);
}

// 17. Alert Toast Notifications & Drawer Systems
function showToast(title, message, type = "info") {
    const translatedTitle = getTranslatedText(title, title);
    const translatedMessage = getTranslatedText(message, message);
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    toast.innerHTML = `
        <div class="toast-body">
            <div class="toast-title">${translatedTitle}</div>
            <div class="toast-message">${translatedMessage}</div>
        </div>
        <button type="button" class="toast-close">✕</button>
    `;

    toast.querySelector(".toast-close").addEventListener("click", () => {
        toast.classList.add("fade-out");
        toast.addEventListener("animationend", () => toast.remove());
    });

    container.appendChild(toast);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.classList.add("fade-out");
            toast.addEventListener("animationend", () => toast.remove());
        }
    }, 4000);
}

function addNotificationAlert(title, message, type = "info") {
    const translatedTitle = getTranslatedText(title, title);
    const translatedMessage = getTranslatedText(message, message);
    const notification = {
        id: "NT-" + Math.floor(Math.random() * 90000 + 10000),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: translatedTitle,
        message: translatedMessage,
        type
    };

    state.notifications.unshift(notification);
    if (state.notifications.length > 50) state.notifications.pop(); // Cap at 50 logs
    saveState();
    if (supabaseClient) {
        supabaseClient.from('notifications').insert(mapNotificationToDb(notification))
            .then(({ error }) => { if (error) console.error("Notification cloud sync error:", error); });
    }
    renderNotificationsDrawer();
}

function renderNotificationsDrawer() {
    const list = document.getElementById("notifications-list");
    const countBadge = document.getElementById("notification-badge-count");

    countBadge.innerText = state.notifications.length;
    list.innerHTML = "";

    if (state.notifications.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <p data-i18n="no-new-alerts">${getTranslatedText("no-new-alerts", "No new system alerts.")}</p>
            </div>
        `;
        return;
    }

    state.notifications.forEach(n => {
        const item = document.createElement("div");
        item.className = "drawer-item";
        item.innerHTML = `
            <div style="font-weight:600; color:var(--text-primary);">${n.title}</div>
            <div class="text-secondary text-xs" style="margin-top: 2px;">${n.message}</div>
            <div class="item-time">${n.time}</div>
        `;
        list.appendChild(item);
    });
}

// ==========================================================================
// 18. Employee Entry and Visitor Document Upload Workflow Upgrades
// ==========================================================================

function setupEmployeeEntryAndDocUpload() {
    // 1. Entry Flow Switcher (Segmented Buttons)
    const btnSelectVisitor = document.getElementById("btn-select-visitor-flow");
    const btnSelectEmployee = document.getElementById("btn-select-employee-flow");
    const visitorWrapper = document.getElementById("visitor-registration-wrapper");
    const employeeWrapper = document.getElementById("employee-entry-wrapper");

    if (btnSelectVisitor && btnSelectEmployee) {
        btnSelectVisitor.addEventListener("click", () => {
            switchView("view-dashboard");
        });

        btnSelectEmployee.addEventListener("click", () => {
            btnSelectEmployee.className = "btn btn-primary";
            btnSelectVisitor.className = "btn btn-secondary";
            employeeWrapper.classList.remove("hidden");
            if (visitorWrapper) visitorWrapper.classList.add("hidden");

            // Populate the employee mock QR dropdown list
            populateEmployeeMockQRDropdown();
        });
    }

    // 2. ID Document Proof File Upload Handler
    const idDocInput = document.getElementById("visitor-id-doc-file");
    const idDocLabel = document.getElementById("id-doc-upload-label");
    state.tempVisitorIdDoc = "";

    if (idDocInput) {
        idDocInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (!file) return;

            if (idDocLabel) {
                idDocLabel.innerText = file.name;
            }
            const reader = new FileReader();
            reader.onload = function (evt) {
                state.tempVisitorIdDoc = evt.target.result;
                showToast("ID Attached", `ID Card document attached.`, "success");
            };
            reader.readAsDataURL(file);
        });
    }

    // 3. Employee Autocomplete search inside Employee Entry Flow
    setupEmployeeEntryAutocomplete();

    // 4. Employee QR Scan simulation click
    const btnScanEmpQR = document.getElementById("btn-scan-emp-qr");
    if (btnScanEmpQR) {
        btnScanEmpQR.addEventListener("click", () => {
            const select = document.getElementById("emp-qr-mock-selector");
            const empId = select.value;
            if (!empId) {
                showToast("Scan Error", "Please choose a mock employee QR pass.", "warning");
                return;
            }

            const employee = state.employees.find(emp => emp.id === empId);
            if (employee) {
                loadEmployeeEntryCard(employee);
                showToast("QR Scan Successful", `Detected Employee Code: ${employee.id}`, "success");
            }
        });
    }

    // 5. Employee gate entry button click actions
    const btnEmpGateIn = document.getElementById("btn-emp-gate-in");
    if (btnEmpGateIn) {
        btnEmpGateIn.addEventListener("click", () => {
            const empId = document.getElementById("emp-entry-id").innerText;
            executeEmployeeGateAction(empId, "Inside");
        });
    }

    const btnEmpGateOut = document.getElementById("btn-emp-gate-out");
    if (btnEmpGateOut) {
        btnEmpGateOut.addEventListener("click", () => {
            const empId = document.getElementById("emp-entry-id").innerText;
            executeEmployeeGateAction(empId, "Outside");
        });
    }

    // 6. Host approval simulated Email client buttons
    const btnToggleHostSim = document.getElementById("btn-toggle-host-sim");
    const hostSimBubble = document.getElementById("host-sim-bubble");
    if (btnToggleHostSim && hostSimBubble) {
        btnToggleHostSim.addEventListener("click", () => {
            hostSimBubble.classList.toggle("hidden");
        });
    }

    const btnHostEmailApprove = document.getElementById("btn-host-email-approve");
    if (btnHostEmailApprove) {
        btnHostEmailApprove.addEventListener("click", () => {
            if (!activeSimulatedVisitor) {
                showToast("No Request", "There are no pending approval requests.", "info");
                return;
            }
            // Execute approval
            approvePendingVisitor(activeSimulatedVisitor.id);
            closeHostSimBubble();
        });
    }

    const btnHostEmailReject = document.getElementById("btn-host-email-reject");
    if (btnHostEmailReject) {
        btnHostEmailReject.addEventListener("click", () => {
            if (!activeSimulatedVisitor) {
                showToast("No Request", "There are no pending approval requests.", "info");
                return;
            }
            // Check if rejection reason textarea is visible
            const rejectWrapper = document.getElementById("host-email-reject-wrapper");
            const rejectTextarea = document.getElementById("host-email-rejection-reason");
            const btnCancelReject = document.getElementById("btn-host-email-cancel-reject");
            const btnApprove = document.getElementById("btn-host-email-approve");

            if (rejectWrapper.style.display === "none" || rejectWrapper.style.display === "") {
                // First click: show reason textarea
                rejectWrapper.style.display = "block";
                if (btnCancelReject) btnCancelReject.style.display = "inline-block";
                btnHostEmailReject.textContent = "Confirm Reject";
                if (btnApprove) btnApprove.style.display = "none";
                rejectTextarea.focus();
            } else {
                // Second click: confirm rejection
                const reason = (rejectTextarea.value.trim()) || "Denied by host";
                if (activeSimulatedVisitor) {
                    const idx = state.visitors.findIndex(v => v.id === activeSimulatedVisitor.id);
                    if (idx !== -1) state.visitors[idx].rejectionReason = reason;
                }
                rejectPendingVisitor(activeSimulatedVisitor.id);
                closeHostSimBubble();
            }
        });
    }

    const btnCancelReject = document.getElementById("btn-host-email-cancel-reject");
    if (btnCancelReject) {
        btnCancelReject.addEventListener("click", () => {
            // Cancel rejection, reset to normal view
            const rejectWrapper = document.getElementById("host-email-reject-wrapper");
            const rejectTextarea = document.getElementById("host-email-rejection-reason");
            const btnApprove = document.getElementById("btn-host-email-approve");
            const btnReject = document.getElementById("btn-host-email-reject");

            if (rejectWrapper) rejectWrapper.style.display = "none";
            if (rejectTextarea) rejectTextarea.value = "";
            btnCancelReject.style.display = "none";
            if (btnReject) btnReject.textContent = "Reject Link";
            if (btnApprove) btnApprove.style.display = "inline-block";
        });
    }
}

function closeHostSimBubble() {
    const hostSimBubble = document.getElementById("host-sim-bubble");
    const rejectWrapper = document.getElementById("host-email-reject-wrapper");
    const rejectTextarea = document.getElementById("host-email-rejection-reason");
    const btnApprove = document.getElementById("btn-host-email-approve");
    const btnReject = document.getElementById("btn-host-email-reject");
    const btnCancel = document.getElementById("btn-host-email-cancel-reject");

    if (hostSimBubble) hostSimBubble.classList.add("hidden");
    if (rejectWrapper) rejectWrapper.style.display = "none";
    if (rejectTextarea) rejectTextarea.value = "";
    if (btnCancel) btnCancel.style.display = "none";
    if (btnReject) btnReject.textContent = "Reject Link";
    if (btnApprove) btnApprove.style.display = "inline-block";

    // Hide indicator badge on header host-sim icon
    const headerBadge = document.getElementById("host-header-badge");
    if (headerBadge) headerBadge.style.display = "none";

    activeSimulatedVisitor = null;
    clearHostSimTimer();
}

function populateEmployeeMockQRDropdown() {
    const select = document.getElementById("emp-qr-mock-selector");
    if (!select) return;
    select.innerHTML = '<option value="">-- Choose Employee QR --</option>';
    state.employees.forEach(emp => {
        const opt = document.createElement("option");
        opt.value = emp.id;
        opt.innerText = `${emp.id} - ${emp.name} (${emp.dept})`;
        select.appendChild(opt);
    });
}

function setupEmployeeEntryAutocomplete() {
    const input = document.getElementById("emp-entry-search");
    const box = document.getElementById("emp-entry-suggestions");

    if (!input || !box) return;

    input.addEventListener("input", () => {
        const val = input.value.trim().toLowerCase();
        box.innerHTML = "";
        if (!val) {
            box.style.display = "none";
            return;
        }

        const matches = state.employees.filter(emp =>
            emp.name.toLowerCase().includes(val) ||
            emp.id.toLowerCase().includes(val) ||
            emp.dept.toLowerCase().includes(val)
        );

        if (matches.length === 0) {
            box.style.display = "none";
            return;
        }

        matches.forEach(emp => {
            const div = document.createElement("div");
            div.className = "suggestion-item";
            div.innerHTML = `
                <div class="item-title">${emp.name} (${emp.id})</div>
                <div class="item-desc">${emp.designation || 'Roster Employee'} - ${emp.dept} (${emp.campusStatus || 'Outside'})</div>
            `;
            div.addEventListener("mousedown", (e) => {
                e.preventDefault();
                input.value = "";
                box.style.display = "none";
                loadEmployeeEntryCard(emp);
            });
            box.appendChild(div);
        });
        box.style.display = "block";
    });

    input.addEventListener("blur", () => {
        setTimeout(() => { box.style.display = "none"; }, 200);
    });
}

function loadEmployeeEntryCard(employee) {
    const placeholder = document.getElementById("emp-entry-details-placeholder");
    if (placeholder) placeholder.classList.add("hidden");

    const card = document.getElementById("emp-entry-details-card");
    if (card) card.classList.remove("hidden");

    document.getElementById("emp-entry-id").innerText = employee.id;
    document.getElementById("emp-entry-name").innerText = employee.name;
    document.getElementById("emp-entry-designation").innerText = employee.designation || "Roster Employee";
    document.getElementById("emp-entry-dept").innerText = employee.dept;
    document.getElementById("emp-entry-cabin").innerText = employee.cabin;
    document.getElementById("emp-entry-status").innerText = employee.status || "Active";
    document.getElementById("emp-entry-email").innerText = employee.email;
    document.getElementById("emp-entry-phone").innerText = employee.phone;

    // Photo
    document.getElementById("emp-entry-photo").src = employee.photo || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%2364748b'/><path d='M30 75c0-10 10-15 20-15s20 5 20 15' stroke='white' stroke-width='4' fill='none'/><circle cx='50' cy='40' r='12' fill='white'/></svg>";

    const campusStatus = employee.campusStatus || "Outside";
    const statusBadge = document.getElementById("emp-entry-campus-status");
    statusBadge.innerText = campusStatus === "Inside" ? "Inside Campus" : "Outside Campus";

    if (campusStatus === "Inside") {
        statusBadge.className = "badge-status checked-in";
        document.getElementById("btn-emp-gate-in").disabled = true;
        document.getElementById("btn-emp-gate-out").disabled = false;
    } else {
        statusBadge.className = "badge-status denied";
        document.getElementById("btn-emp-gate-in").disabled = false;
        document.getElementById("btn-emp-gate-out").disabled = true;
    }
}

function executeEmployeeGateAction(empId, action) {
    const idx = state.employees.findIndex(emp => emp.id === empId);
    if (idx === -1) return;

    const emp = state.employees[idx];
    emp.campusStatus = action;
    emp.status = action === "Inside" ? "In Office" : "Out of Office";
    saveState();

    // Log the transaction in alerts notifications
    addNotificationAlert(
        action === "Inside" ? "Employee Checked In" : "Employee Checked Out",
        `${emp.name} (${emp.id}) has passed security check ${action === "Inside" ? "inward" : "outward"} at gates.`,
        action === "Inside" ? "success" : "info"
    );

    showToast("Gate Clearance Success", `${emp.name} marked ${action === "Inside" ? "IN" : "OUT"}.`, "success");

    // Simulated alerts dispatcher for employees
    logNotificationSimulator(
        action === "Inside" ? "Shift Clock In" : "Shift Clock Out",
        "Email",
        emp.email,
        `Hello ${emp.name}, your gate transition (${action === 'Inside' ? 'Entry' : 'Exit'}) has been logged at gatekeepers terminal.`
    );

    // Refresh layout card
    loadEmployeeEntryCard(emp);

    // Refresh dashboard calculations
    refreshAllDataViews();
}

// 19. Host Mobile App Notification Simulator & Approvals logic
let activeSimulatedVisitor = null;
let _hostSimTimerInterval = null;

function clearHostSimTimer() {
    if (_hostSimTimerInterval) {
        clearInterval(_hostSimTimerInterval);
        _hostSimTimerInterval = null;
    }
}

function triggerHostApprovalNotification(visitor) {
    activeSimulatedVisitor = visitor;

    const bubble = document.getElementById("host-sim-bubble");
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' });

    // --- Populate the Corporate Email Client fields ---
    const emailRecipientEl = document.getElementById("host-email-recipient");
    const emailSubjectEl = document.getElementById("host-email-subject");
    const emailHostNameEl = document.getElementById("host-email-host-name");
    const emailVisitorName = document.getElementById("host-email-visitor-name");
    const emailVisitorCo = document.getElementById("host-email-visitor-company");
    const emailVisitorPurp = document.getElementById("host-email-visitor-purpose");
    const emailVisitorTime = document.getElementById("host-email-visitor-time");

    // Resolve host email from employees
    const hostEmp = state.employees.find(e => e.id === visitor.hostId);
    const hostEmail = "manojkumarnj01@gmail.com";

    if (emailRecipientEl) emailRecipientEl.innerText = hostEmail;
    if (emailSubjectEl) emailSubjectEl.innerText = `Visitor Approval Request - ${visitor.name} (${visitor.id})`;
    if (emailHostNameEl) emailHostNameEl.innerText = visitor.hostName;
    if (emailVisitorName) emailVisitorName.innerText = visitor.name;
    if (emailVisitorCo) emailVisitorCo.innerText = visitor.company || 'Independent';
    if (emailVisitorPurp) emailVisitorPurp.innerText = visitor.purpose || 'Meeting';
    if (emailVisitorTime) emailVisitorTime.innerText = (visitor.visitDate || "") + ' ' + (visitor.expectedExit || '06:00 PM');

    // Also populate legacy phone-sim IDs (if they still exist)
    const nameEl = document.getElementById("host-sim-visitor-name");
    const companyEl = document.getElementById("host-sim-visitor-company");
    const timerEl = document.getElementById("host-sim-timer");
    if (nameEl) nameEl.innerText = visitor.name;
    if (companyEl) companyEl.innerText = visitor.company || 'Independent';

    // Start countdown timer (2 minutes)
    clearHostSimTimer();
    let remaining = 120;
    const updateTimer = () => {
        if (timerEl) {
            const mins = String(Math.floor(remaining / 60)).padStart(2, '0');
            const secs = String(remaining % 60).padStart(2, '0');
            timerEl.textContent = `${mins}:${secs}`;
        }
        if (remaining <= 0) {
            clearHostSimTimer();
            if (activeSimulatedVisitor) {
                const idx = state.visitors.findIndex(v => v.id === activeSimulatedVisitor.id);
                if (idx !== -1) state.visitors[idx].rejectionReason = "Host did not respond within 2 minutes.";
                rejectPendingVisitor(activeSimulatedVisitor.id);
                closeHostSimBubble();
                showToast("Timeout", "Host did not respond. Visitor request auto-rejected.", "warning");
            }
        }
        remaining--;
    };
    updateTimer();
    _hostSimTimerInterval = setInterval(updateTimer, 1000);

    // Show the email client panel automatically
    if (bubble) {
        bubble.classList.remove("hidden");
    }

    // Show indicator badge on header envelope icon
    const headerBadge = document.getElementById("host-header-badge");
    if (headerBadge) headerBadge.style.display = "block";

    renderSimulatedEmailInbox();
}

window.approvePendingVisitor = async function (visitorId) {
    const idx = state.visitors.findIndex(v => v.id === visitorId);
    if (idx === -1) return;

    const visitor = state.visitors[idx];
    const hostEmp = await resolveLatestHost(visitor.hostId);
    if (hostEmp) {
        visitor.hostName = hostEmp.name;
        visitor.hostDept = hostEmp.dept;
    }
    const now = new Date();
    visitor.status = "Checked In";           // Auto check-in on host approval
    visitor.dateApproved = now.toISOString();
    visitor.checkIn = now.toISOString();     // Set check-in time
    saveState();
    syncSingleVisitorToCloud(visitor);
    refreshAllDataViews();
    renderSimulatedEmailInbox();

    showToast("Visitor Approved & Checked In", `${visitor.name} approved by host ${visitor.hostName} and checked in at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`, "success");

    // Reception & Security alerts
    addNotificationAlert("Visitor Approved", `[Reception] ${visitor.name} approved by host ${visitor.hostName}. Auto checked-in at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`, "success");
    addNotificationAlert("Security Gate", `[Security] ${visitor.name} (${visitor.id}) has been cleared to enter. Host: ${visitor.hostName} / ${visitor.hostDept}.`, "info");

    // SMS to Visitor (Twilio simulation)
    logNotificationSimulator(
        "Visit Approved",
        "SMS",
        visitor.phone,
        `Dear ${visitor.name}, your visit to Barani Hydraulics has been APPROVED by ${visitor.hostName}. Entry Time: ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Pass ID: ${visitor.id}.`
    );

    // Note: Automatic WhatsApp visitor pass dispatch is disabled per user request.
    // The pass can be shared manually using the "Share on WA" button on the badge preview.

    // Security desk SMS
    logNotificationSimulator(
        "Security Gate Alert",
        "SMS",
        "+91 99999 88888 (Security Desk)",
        `VISITOR CLEARED: ${visitor.name} from ${visitor.company || 'Independent'} approved by ${visitor.hostName}. Pass: ${visitor.id}. Allow entry.`
    );

    // Audit logs
    addAuditLog("Host Approved Access", "Host Approval", `Host ${visitor.hostName} approved visitor: ${visitor.name} (${visitor.id})`);
    addAuditLog("Outbound Comm Sent", "Communications", `Dispatched WhatsApp QR pass and approval SMS to: ${visitor.phone}`);
    addAuditLog("Pass Card Generated", "Security", `Generated pass card files for visitor code: ${visitor.id}`);
    addAuditLog("Auto Check-In", "Security", `Visitor ${visitor.name} auto checked-in at ${now.toLocaleString()}`);

    // Launch pass preview card
    renderBadgeAndOpenModal(visitor);

    // === FEATURE: Auto-capture and store visitor pass PNG on the visitor object ===
    // This enables re-downloading the pass later from History or Dashboard tables.
    setTimeout(async () => {
        try {
            const badgeEl = document.getElementById('printable-badge');
            if (badgeEl) {
                const canvas = await html2canvas(badgeEl, {
                    scale: 2,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: '#ffffff'
                });
                const imgData = canvas.toDataURL('image/png');
                const vIdx = state.visitors.findIndex(vv => vv.id === visitor.id);
                if (vIdx !== -1) {
                    state.visitors[vIdx].passImage = imgData;
                    saveState();
                    console.log('[VMS] Pass image stored for visitor:', visitor.id);
                }
            }
        } catch (captureErr) {
            console.warn('[VMS] Pass image auto-capture failed (non-critical):', captureErr);
        }
    }, 900);

    // Auto-send pass image to visitor's WhatsApp after modal renders
    let targetWindow = null;
    if (state.settings?.autoSendWhatsApp !== false) {
        const method = state.settings?.waMethod || "url-local";
        if (method !== "meta" && method !== "sim") {
            try {
                if (window.event && (window.event.type === "click" || window.event.type === "submit")) {
                    targetWindow = window.open("", "_blank");
                }
            } catch (e) {
                console.warn("Could not pre-open window:", e);
            }
        }
    }

    setTimeout(() => {
        autoSendPassToWhatsApp(visitor, false, targetWindow);
    }, 1200);
}

/* ==========================================================================
   NEW FEATURE: Download Pass PNG & Resend WhatsApp Pass helpers
   Called from History view rows and Dashboard active visitors table.
   ========================================================================== */



/**
 * Re-populate the badge card (needed for html2canvas) and resend the pass
 * image to the visitor's registered WhatsApp number.
 */
window.resendPassWhatsApp = function (visitorId) {
    const visitor = state.visitors.find(v => v.id === visitorId);
    if (!visitor) {
        showToast('Not Found', 'Visitor record not found.', 'danger');
        return;
    }

    // Populate badge modal (required so html2canvas can capture the pass)
    renderBadgeAndOpenModal(visitor);

    let targetWindow = null;
    const method = state.settings?.waMethod || 'url-local';
    if (method !== 'meta' && method !== 'sim') {
        try {
            targetWindow = window.open('', '_blank');
        } catch (e) {
            console.warn('[VMS] Could not pre-open window for WA resend:', e);
        }
    }

    setTimeout(() => {
        autoSendPassToWhatsApp(visitor, true, targetWindow);
    }, 1000);

    addAuditLog('Resend WA Pass', 'Communications', `Manually resent pass to ${visitor.name} (${visitorId}) via WhatsApp`);
};

function rejectPendingVisitor(visitorId) {
    const idx = state.visitors.findIndex(v => v.id === visitorId);
    if (idx === -1) return;

    const visitor = state.visitors[idx];
    const reason = visitor.rejectionReason || "Denied by host";
    visitor.status = "Rejected";
    visitor.dateRejected = new Date().toISOString();
    saveState();
    syncSingleVisitorToCloud(visitor);
    refreshAllDataViews();
    renderSimulatedEmailInbox();

    showToast("Visitor Rejected", `${visitor.name} entry was rejected by host ${visitor.hostName}.`, "danger");

    // Add reception alerts
    addNotificationAlert("Visitor Rejected", `[Reception] Visitor Rejected: ${visitor.name} entry was denied by host ${visitor.hostName}. Reason: ${reason}`, "danger");

    // Outbound SMS Alert
    logNotificationSimulator(
        "Visitor Rejected Alert",
        "SMS",
        visitor.phone,
        `Your visit request has been rejected. Please contact reception.`
    );

    // Audit log entry
    addAuditLog("Host Rejected Access", "Host Approval", `Host ${visitor.hostName} rejected visitor: ${visitor.name}. Reason: ${reason}`);
}

function updateThemeIcons(theme) {
    const sunIcon = document.getElementById("theme-icon-sun");
    const moonIcon = document.getElementById("theme-icon-moon");
    if (!sunIcon || !moonIcon) return;

    if (theme === "dark") {
        sunIcon.classList.remove("hidden");
        moonIcon.classList.add("hidden");
    } else {
        sunIcon.classList.add("hidden");
        moonIcon.classList.remove("hidden");
    }
}

// ==========================================================================
// 20. SECURITY FEATURE: Blacklist restrictions checks & alarms
// ==========================================================================
function checkBlacklistMatch(name, phone, idNumber) {
    return state.blacklist.find(b =>
        b.name.toLowerCase() === name.toLowerCase().trim() ||
        b.phone === phone.trim() ||
        (idNumber && b.idNumber && b.idNumber.trim() === idNumber.trim())
    );
}

function openBlacklistAlarmScreen(blacklistItem) {
    // Dismiss preview modal
    document.getElementById("modal-visitor-preview").classList.remove("active");

    document.getElementById("alarm-visitor-name").innerText = blacklistItem.name;
    document.getElementById("alarm-reason").innerText = blacklistItem.reason;
    document.getElementById("alarm-phone-info").innerText = blacklistItem.phone;
    document.getElementById("alarm-id-info").innerText = `${blacklistItem.idType || 'ID'} (${blacklistItem.idNumber || 'N/A'})`;

    // Play flashing alarm beep
    playSecurityAlarmBeep();

    // Create audit log warning
    addNotificationAlert(
        "SECURITY BREACH THREAT",
        `Restriction Directive Triggered: Blacklisted guest ${blacklistItem.name} (${blacklistItem.phone}) attempted registration!`,
        "danger"
    );
    addAuditLog("Blacklist Breach Alert", "Security", `Blacklisted visitor ${blacklistItem.name} (${blacklistItem.phone}) attempted system access check. Reason flagged: ${blacklistItem.reason}`, "Failed");

    document.getElementById("modal-blacklist-alarm").classList.add("active");
}

function playSecurityAlarmBeep() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        const playBeepNode = (freq, duration, delay) => {
            setTimeout(() => {
                let osc = audioCtx.createOscillator();
                let gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
                gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
                osc.start();
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
                osc.stop(audioCtx.currentTime + duration);
            }, delay);
        };

        playBeepNode(500, 0.35, 0);
        playBeepNode(500, 0.35, 450);
        playBeepNode(500, 0.35, 900);
    } catch (err) {
        console.error("Audio beep synthesis failed:", err);
    }
}

function handleAdminOverrideBypass() {
    const password = prompt("ADMINISTRATIVE SECURITY CONSOLE OVERRIDE\nEnter admin bypass credential password:", "");
    if (password === "admin" || password === "123") {
        showToast("Bypass Authorized", "Admin authorization accepted. Visitor registration cleared.", "warning");
        document.getElementById("modal-blacklist-alarm").classList.remove("active");

        // Proceed directly to visitor approval flow (OTP removed)
        executeFinalVisitorApprovalFlow();
    } else {
        alert("Bypass Authorization Refused: Incorrect password.");
    }
}



// ==========================================================================
// 22. AI FEATURE: Face Recognition & Duplicates analysis
// ==========================================================================
function simulateFaceMatch() {
    if (state.visitors.length === 0) return;

    // Scan matching previous visitors names to match templates
    const match = state.visitors[Math.floor(Math.random() * state.visitors.length)];

    showToast("AI Face Match Detected", `Recognized Returning Visitor: ${match.name} (99.4% Match)`, "success");
    addNotificationAlert("AI Face Identification", `Matched face biometric template to historic guest ${match.name} (${match.id}).`, "success");
    addAuditLog("AI Face Biometrics Match", "Security", `Recognized returning visitor face profile as: ${match.name} (99.4% match confidence)`);

    // Add auto-fill prompt button
    const container = document.querySelector(".photo-fallback");
    if (container) {
        const oldBtn = document.getElementById("btn-ai-autofill-face");
        if (oldBtn) oldBtn.remove();

        const btn = document.createElement("button");
        btn.type = "button";
        btn.id = "btn-ai-autofill-face";
        btn.className = "btn btn-accent btn-sm mt-2";
        btn.style.width = "100%";
        btn.innerHTML = `<span>Autofill: ${match.name}</span>`;
        btn.onclick = () => {
            document.getElementById("reg-visitor-name").value = match.name;
            document.getElementById("reg-visitor-phone").value = match.phone;
            document.getElementById("reg-visitor-email").value = match.email;
            document.getElementById("reg-visitor-company").value = match.company;
            document.getElementById("reg-visitor-address").value = match.address || "";
            document.getElementById("reg-visitor-id-type").value = match.idType;
            document.getElementById("reg-visitor-id-number").value = match.idNumber;
            showToast("AI Autofilled", "Visitor history credentials imported.", "success");
            btn.remove();
        };
        container.appendChild(btn);
    }
}

function checkDuplicateVisitor(phone, idNumber) {
    let dup = null;
    if (phone) {
        dup = state.visitors.find(v => v.phone === phone);
    }
    if (!dup && idNumber) {
        dup = state.visitors.find(v => v.idNumber === idNumber);
    }

    if (dup) {
        const visits = state.visitors.filter(v => v.phone === dup.phone || (idNumber && v.idNumber === idNumber)).length;

        showToast("AI Duplicate Alert", `Returning Visitor Detected: ${dup.name} (${dup.company}) - ${visits} previous visits.`, "warning");
        addNotificationAlert("Security Log Check", `AI Check: duplicate visitor matching details: ${dup.name}. Visits: ${visits}.`, "warning");

        const badgeSpan = document.getElementById("frequent-visitor-badge");
        if (badgeSpan) {
            badgeSpan.innerText = `Frequent Visitor (${visits} Visits)`;
            badgeSpan.classList.remove("hidden");
        }
        addAuditLog("AI Duplicate Match", "Security", `Biometric/Duplicate Match: phone: ${phone}, id: ${idNumber}. Visitor detected: ${dup.name}`);
    } else {
        const badgeSpan = document.getElementById("frequent-visitor-badge");
        if (badgeSpan) {
            badgeSpan.classList.add("hidden");
        }
    }
}

// ==========================================================================
// 23. AI FEATURE: Optical Character Recognition (OCR) Simulator
// ==========================================================================
function triggerOCRScanSimulation() {
    const ocrOverlay = document.getElementById("ocr-scan-overlay");
    if (!ocrOverlay) return;

    ocrOverlay.classList.remove("hidden");
    showToast("AI OCR Processor", "Scanning uploaded document file structure...", "info");

    setTimeout(() => {
        ocrOverlay.classList.add("hidden");

        const mockDocuments = [
            { name: "Manoj Kumar", phone: "+91 98765 01101", idType: "Aadhaar", idNumber: "1234-5678-9012", address: "Peelamedu, Coimbatore, TN", company: "Barani Vendor" },
            { name: "Sarah Jenkins", phone: "+91 99443 88123", idType: "Aadhaar", idNumber: "9876-5432-1098", address: "Gandinagar, Chennai, TN", company: "TUV Sud Audits" },
            { name: "Rahul Sharma", phone: "+91 99887 76655", idType: "Aadhaar", idNumber: "8827-3618-2736", address: "Sector 4, Bangalore, KA", company: "Acme Tech Partner" },
            { name: "Amir Khan", phone: "+92 300 1234567", idType: "CNIC", idNumber: "35201-1234567-8", address: "Lahore, Punjab", company: "Indus Logistics" }
        ];

        const doc = mockDocuments[Math.floor(Math.random() * mockDocuments.length)];

        // Fill form fields
        document.getElementById("reg-visitor-name").value = doc.name;
        document.getElementById("reg-visitor-phone").value = doc.phone;
        document.getElementById("reg-visitor-id-type").value = doc.idType;
        document.getElementById("reg-visitor-id-number").value = doc.idNumber;
        document.getElementById("reg-visitor-address").value = doc.address;
        document.getElementById("reg-visitor-company").value = doc.company;

        const label = document.getElementById("id-doc-upload-label");
        if (label) label.innerText = `${doc.idType}_ID_Proof_Verified.png`;

        showToast("AI OCR Completed", `Scanned details for ${doc.name} successfully.`, "success");
        addNotificationAlert("AI OCR Extract", `Scanned ${doc.idType} document with ID number: ${doc.idNumber}.`, "success");
        addAuditLog("OCR Document Scan", "Security", `Processed AI OCR parsing for ${doc.name} (${doc.idType})`);

        // Duplicate analyze
        checkDuplicateVisitor(doc.phone, doc.idNumber);
    }, 2000);
}
// 24. AI FEATURE: Interactive Assistant Chatbot Concierge
// ==========================================================================
function toggleChatbotPanel() {
    const panel = document.getElementById("chatbot-panel");
    if (!panel) return;
    panel.classList.toggle("hidden");

    if (!panel.classList.contains("hidden")) {
        const msgs = document.getElementById("chatbot-messages");
        if (msgs.children.length === 0) {
            addChatbotMessage("Welcome to the ABC Facilities Portal! Ask me anything about hosts, cabin locations, blacklist details, or today's stats.", "bot");
        }
        setTimeout(() => {
            const input = document.getElementById("chatbot-input");
            if (input) input.focus();
        }, 200);
    }
}

function handleChatbotQuery(e) {
    e.preventDefault();
    const input = document.getElementById("chatbot-input");
    const query = input.value.trim();
    if (!query) return;

    addChatbotMessage(query, "user");
    input.value = "";

    // Simulated thinking bubble
    const typing = addChatbotMessage("Agent is typing...", "bot-typing");

    setTimeout(() => {
        typing.remove();
        const reply = processChatbotNLP(query);
        addChatbotMessage(reply, "bot");
    }, 850);
}

function addChatbotMessage(text, sender) {
    const container = document.getElementById("chatbot-messages");
    if (!container) return;

    const bubble = document.createElement("div");

    if (sender === "user") {
        bubble.style.background = "var(--accent-primary-gradient)";
        bubble.style.color = "#ffffff";
        bubble.style.padding = "8px 12px";
        bubble.style.borderRadius = "var(--border-radius-lg)";
        bubble.style.borderTopRightRadius = "2px";
        bubble.style.maxWidth = "85%";
        bubble.style.alignSelf = "flex-end";
        bubble.style.fontSize = "0.75rem";
        bubble.style.lineHeight = "1.4";
        bubble.innerText = text;
    } else if (sender === "bot-typing") {
        bubble.style.background = "var(--bg-card)";
        bubble.style.border = "1px solid var(--border-color)";
        bubble.style.padding = "8px 12px";
        bubble.style.borderRadius = "var(--border-radius-lg)";
        bubble.style.borderTopLeftRadius = "2px";
        bubble.style.maxWidth = "85%";
        bubble.style.alignSelf = "flex-start";
        bubble.style.fontSize = "0.75rem";
        bubble.style.color = "var(--text-muted)";
        bubble.innerText = text;
    } else {
        bubble.style.background = "var(--bg-card)";
        bubble.style.border = "1px solid var(--border-color)";
        bubble.style.padding = "8px 12px";
        bubble.style.borderRadius = "var(--border-radius-lg)";
        bubble.style.borderTopLeftRadius = "2px";
        bubble.style.maxWidth = "85%";
        bubble.style.alignSelf = "flex-start";
        bubble.style.fontSize = "0.75rem";
        bubble.style.lineHeight = "1.4";
        bubble.innerHTML = text;
    }

    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
    return bubble;
}

function processChatbotNLP(query) {
    if (window.vmsAi) {
        return window.vmsAi.answerQuestion(query, state);
    }
    return `AI Engine offline. Please check developer settings.`;
}



// ==========================================================================
// 25b. ADMIN FEATURE: Blacklist CRUD Operations
// ==========================================================================
window.openBlacklistModal = function (id = "") {
    const modal = document.getElementById("modal-blacklist");
    const form = document.getElementById("blacklist-crud-form");
    const title = document.getElementById("blacklist-modal-title");
    form.reset();

    if (id === "") {
        title.innerText = "Add Blacklist Restricted Record";
        document.getElementById("crud-blacklist-id").value = "";
    } else {
        title.innerText = "Modify Blacklist Restricted Record";
        const item = state.blacklist.find(b => b.id === id);
        if (item) {
            document.getElementById("crud-blacklist-id").value = item.id;
            document.getElementById("crud-blacklist-name").value = item.name;
            document.getElementById("crud-blacklist-phone").value = item.phone;
            document.getElementById("crud-blacklist-id-type").value = item.idType || "Aadhaar";
            document.getElementById("crud-blacklist-id-number").value = item.idNumber || "";
            document.getElementById("crud-blacklist-reason").value = item.reason;
        }
    }
    modal.classList.add("active");
};

window.saveBlacklistCRUD = function (e) {
    e.preventDefault();
    const id = document.getElementById("crud-blacklist-id").value;
    const name = document.getElementById("crud-blacklist-name").value.trim();
    const phone = document.getElementById("crud-blacklist-phone").value.trim();
    const idType = document.getElementById("crud-blacklist-id-type").value;
    const idNumber = document.getElementById("crud-blacklist-id-number").value.trim();
    const reason = document.getElementById("crud-blacklist-reason").value.trim();

    let targetBl = null;
    if (id === "") {
        const newId = "BL" + (101 + state.blacklist.length);
        targetBl = {
            id: newId,
            name,
            phone,
            idType,
            idNumber,
            reason,
            dateAdded: getLocalDateStr()
        };
        state.blacklist.push(targetBl);
        showToast("Restricted Record Added", getTranslatedText("added-to-security-blacklist", "{name} added to security blacklist.").replace("{name}", name), "success");
    } else {
        const idx = state.blacklist.findIndex(b => b.id === id);
        if (idx !== -1) {
            state.blacklist[idx] = { ...state.blacklist[idx], name, phone, idType, idNumber, reason };
            targetBl = state.blacklist[idx];
            showToast("Restricted Record Updated", getTranslatedText("blacklist-details-modified", "{name} blacklist details modified.").replace("{name}", name), "success");
        }
    }
    saveState();
    if (supabaseClient && targetBl) {
        supabaseClient.from('blacklist').upsert(mapBlacklistToDb(targetBl))
            .then(({ error }) => { if (error) console.error("Blacklist cloud sync error:", error); });
    }
    document.getElementById("modal-blacklist").classList.remove("active");
    renderSettingsData();
};

window.deleteBlacklistCRUD = function (id) {
    if (!confirm("Are you sure you want to remove this restriction record?")) return;
    const idx = state.blacklist.findIndex(b => b.id === id);
    if (idx !== -1) {
        const name = state.blacklist[idx].name;
        const item = state.blacklist[idx];
        state.blacklist.splice(idx, 1);
        saveState();
        if (supabaseClient) {
            supabaseClient.from('blacklist').delete().eq('phone', item.phone)
                .then(({ error }) => { if (error) console.error("Blacklist cloud delete error:", error); });
        }
        renderSettingsData();
        showToast("Restriction Revoked", getTranslatedText("removed-from-security-blacklist", "{name} removed from security blacklist.").replace("{name}", name), "warning");
    }
};

// ==========================================================================
// 26. INITIALIZER: Bind event listeners for all new features
// ==========================================================================
function initializeNewFeatures() {
    // OCR trigger click
    const btnOcr = document.getElementById("btn-ocr-scan");
    if (btnOcr) {
        btnOcr.addEventListener("click", triggerOCRScanSimulation);
    }

    // Blacklist crud button
    const btnAddBlacklist = document.getElementById("btn-add-blacklist-modal");
    if (btnAddBlacklist) {
        btnAddBlacklist.addEventListener("click", () => openBlacklistModal());
    }

    const formBlacklist = document.getElementById("blacklist-crud-form");
    if (formBlacklist) {
        formBlacklist.addEventListener("submit", saveBlacklistCRUD);
    }

    const btnOverride = document.getElementById("btn-override-blacklist");
    if (btnOverride) {
        btnOverride.addEventListener("click", handleAdminOverrideBypass);
    }



    // Chatbot toggles (original floating + new header icon)
    const btnToggleBot = document.getElementById("btn-toggle-chatbot");
    if (btnToggleBot) {
        btnToggleBot.addEventListener("click", toggleChatbotPanel);
    }
    const btnToggleBotHeader = document.getElementById("btn-toggle-chatbot-header");
    if (btnToggleBotHeader) {
        btnToggleBotHeader.addEventListener("click", toggleChatbotPanel);
    }
    const btnCloseBot = document.getElementById("btn-close-chatbot");
    if (btnCloseBot) {
        btnCloseBot.addEventListener("click", toggleChatbotPanel);
    }
    const formBot = document.getElementById("chatbot-input-form");
    if (formBot) {
        formBot.addEventListener("submit", handleChatbotQuery);
    }

    // Host-sim toggle - new header icon
    const btnToggleHostSimHeader = document.getElementById("btn-toggle-host-sim-header");
    if (btnToggleHostSimHeader) {
        btnToggleHostSimHeader.addEventListener("click", () => {
            const bubble = document.getElementById("host-sim-bubble");
            if (bubble) {
                const isHidden = bubble.classList.contains("hidden");
                bubble.classList.toggle("hidden");
                if (isHidden) {
                    renderSimulatedEmailInbox();
                }
            }
        });
    }

    // Export Excel XLS button
    const btnExportXls = document.getElementById("btn-export-reports-xls");
    if (btnExportXls) {
        btnExportXls.addEventListener("click", exportReportsXLS);
    }

    // PDF download button
    const btnDownloadPdf = document.getElementById("btn-download-pdf-report");
    if (btnDownloadPdf) {
        btnDownloadPdf.addEventListener("click", downloadPDFReportFile);
    }



    // Auto duplicate warnings checking on phone/Aadhaar text input focus loss (AI Improvements)
    const phoneInput = document.getElementById("reg-visitor-phone");
    if (phoneInput) {
        phoneInput.addEventListener("blur", (e) => {
            const idVal = document.getElementById("reg-visitor-id-number").value.trim();
            if (e.target.value.trim() !== "" || idVal !== "") {
                checkDuplicateVisitor(e.target.value.trim(), idVal);
            }
        });
    }

    const idNumberInput = document.getElementById("reg-visitor-id-number");
    if (idNumberInput) {
        idNumberInput.addEventListener("blur", (e) => {
            const phoneVal = document.getElementById("reg-visitor-phone").value.trim();
            if (e.target.value.trim() !== "" || phoneVal !== "") {
                checkDuplicateVisitor(phoneVal, e.target.value.trim());
            }
        });
    }

    // Purchase Manual & Work Permit module event listeners
    updateWorkPermitMenuState();

    const btnCreatePm = document.getElementById("btn-create-pm");
    if (btnCreatePm) {
        btnCreatePm.addEventListener("click", () => {
            document.getElementById("pm-list-container").classList.add("hidden");
            document.getElementById("pm-form-container").classList.remove("hidden");
            document.getElementById("purchase-manual-form").reset();
            document.getElementById("pm-edit-id").value = "";
            document.getElementById("pm-form-title").innerText = getTranslatedText("new-pm-hdr", "New Purchase Manual");
            document.getElementById("pm-file-list").innerHTML = "";
            uploadedFiles = [];
            enablePmFormFields(true);
        });
    }

    const btnCancelPm = document.getElementById("btn-cancel-pm");
    if (btnCancelPm) {
        btnCancelPm.addEventListener("click", () => {
            document.getElementById("pm-list-container").classList.remove("hidden");
            document.getElementById("pm-form-container").classList.add("hidden");
        });
    }

    const btnPmDraft = document.getElementById("btn-pm-draft");
    if (btnPmDraft) {
        btnPmDraft.addEventListener("click", (e) => {
            savePurchaseManual(e, "Draft");
        });
    }

    const btnPmEdit = document.getElementById("btn-pm-edit");
    if (btnPmEdit) {
        btnPmEdit.addEventListener("click", () => {
            const editId = document.getElementById("pm-edit-id").value;
            enablePmFormFields(true);
            document.getElementById("pm-form-title").innerText = (state.currentLang === "ta" ? "கொள்முதல் கையேட்டைத் தொகு" : "Edit Purchase Manual") + " - " + editId;
        });
    }

    const formPm = document.getElementById("purchase-manual-form");
    if (formPm) {
        formPm.addEventListener("submit", (e) => {
            e.preventDefault();
            savePurchaseManual(e, "Submitted");
        });
    }

    const pmFile = document.getElementById("pm-attachment-file");
    if (pmFile) {
        pmFile.addEventListener("change", handlePmAttachmentsUpload);
    }

    const btnCreateWp = document.getElementById("btn-create-wp");
    if (btnCreateWp) {
        btnCreateWp.addEventListener("click", () => {
            document.getElementById("wp-list-container").classList.add("hidden");
            document.getElementById("wp-form-container").classList.remove("hidden");
            document.getElementById("work-permit-form").reset();
            populateApprovedPMDropdown();
        });
    }

    const btnCancelWp = document.getElementById("btn-cancel-wp");
    if (btnCancelWp) {
        btnCancelWp.addEventListener("click", () => {
            document.getElementById("wp-list-container").classList.remove("hidden");
            document.getElementById("wp-form-container").classList.add("hidden");
        });
    }

    const formWp = document.getElementById("work-permit-form");
    if (formWp) {
        formWp.addEventListener("submit", handleWorkPermitSubmit);
    }

    // Initialize Smart Search and Auto Fill Features
    setupFormSearchListeners("student");
    setupFormSearchListeners("customer");
    setupFormSearchListeners("vendor");

    setupPhotoChoiceListeners("student");
    setupPhotoChoiceListeners("customer");
    setupPhotoChoiceListeners("vendor");

    // Initialize VMS Upgrades: Dashboard sensors, AI training, Reports Console & Session Tracker
    setupInteractiveDashboard();
    setupReportsConsoleListeners();
    renderReportsData();
    initSessionTimeoutTracker();
    if (window.vmsAi) {
        window.vmsAi.train(state);
    }
}

// ==========================================================================
// CLOUD SYNC & DATABASE (SUPABASE) SUPPORT
// ==========================================================================
let supabaseClient = null;

// Mapping helper functions between JS CamelCase and PostgreSQL snake_case
function mapVisitorToDb(v) {
    return {
        visitor_code: v.id,
        name: v.name,
        phone: v.phone,
        email: v.email,
        address: v.address,
        company: v.company,
        purpose: v.purpose,
        vehicle: v.vehicle,
        num_visitors: v.numVisitors || 1,
        id_type: v.idType,
        id_number: v.idNumber,
        host_id: v.hostId,
        host_name: v.hostName,
        host_dept: v.hostDept,
        visit_date: v.visitDate || new Date().toISOString().split('T')[0],
        check_in: v.checkIn,
        check_out: v.checkOut,
        expected_exit: v.expectedExit,
        status: v.status,
        photo: v.photo,
        photo_id_doc: v.photoIdDoc,
        approve_token: v.approveToken,
        reject_token: v.rejectToken,
        branch: v.branch,
        start_date: v.startDate || null,
        end_date: v.endDate || null
    };
}

function mapVisitorFromDb(row) {
    return {
        id: row.visitor_code,
        name: row.name,
        phone: row.phone,
        email: row.email,
        address: row.address,
        company: row.company,
        purpose: row.purpose,
        vehicle: row.vehicle,
        numVisitors: row.num_visitors,
        idType: row.id_type,
        idNumber: row.id_number,
        hostId: row.host_id,
        hostName: row.host_name,
        hostDept: row.host_dept,
        visitDate: row.visit_date,
        checkIn: row.check_in,
        checkOut: row.check_out,
        expectedExit: row.expected_exit,
        status: row.status,
        photo: row.photo,
        photoIdDoc: row.photo_id_doc,
        approveToken: row.approve_token,
        rejectToken: row.reject_token,
        branch: row.branch,
        startDate: row.start_date || null,
        endDate: row.end_date || null
    };
}

function mapStudentToDb(s) {
    return {
        student_id: s.studentId,
        name: s.name,
        phone: s.phone,
        email: s.email,
        college: s.college,
        department: s.department,
        roll_number: s.rollNumber,
        photo: s.photo,
        start_date: s.startDate || null,
        end_date: s.endDate || null
    };
}

function mapEmployeeToDb(e) {
    return {
        employee_code: e.id,
        name: e.name,
        dept: e.dept,
        designation: e.designation,
        email: e.email,
        phone: e.phone,
        cabin: e.cabin,
        status: e.status,
        campus_status: e.campusStatus || 'Outside',
        photo: e.photo
    };
}

function mapEmployeeFromDb(row) {
    return {
        id: row.employee_code,
        name: row.name,
        dept: row.dept,
        designation: row.designation,
        email: row.email,
        phone: row.phone,
        cabin: row.cabin,
        status: row.status,
        campusStatus: row.campus_status,
        photo: row.photo
    };
}

function mapBlacklistToDb(b) {
    return {
        name: b.name,
        phone: b.phone,
        id_type: b.idType,
        id_number: b.idNumber,
        reason: b.reason,
        date_added: b.dateAdded || new Date().toISOString().split('T')[0]
    };
}

function mapBlacklistFromDb(row) {
    return {
        id: row.id,
        name: row.name,
        phone: row.phone,
        idType: row.id_type,
        idNumber: row.id_number,
        reason: row.reason,
        dateAdded: row.date_added
    };
}

function mapNotificationToDb(n) {
    return {
        notification_code: n.id,
        title: n.title,
        message: n.message,
        type: n.type,
        time: n.time
    };
}

function mapNotificationFromDb(row) {
    return {
        id: row.notification_code,
        title: row.title,
        message: row.message,
        type: row.type,
        time: row.time
    };
}

function mapPurchaseManualToDb(pm) {
    return {
        manual_code: pm.id,
        dept: pm.dept,
        agent_name: pm.agentName,
        agent_auth_detail: pm.agentAuthDetail,
        company_name: pm.companyName,
        company_address: pm.companyAddress,
        contact_number: pm.contactNumber,
        contract_type: pm.contractType,
        contract_no: pm.contractNo,
        contract_date: pm.contractDate,
        no_contract: pm.noContract,
        nature_work: pm.natureWork,
        required_output: pm.requiredOutput,
        experience: pm.experience,
        competency_assess: pm.competencyAssess,
        eligibility: pm.eligibility,
        risks_involved: pm.risksInvolved,
        quality_req: pm.qualityReq,
        duration: pm.duration,
        special_tool_needed: pm.specialToolNeeded,
        special_equip: pm.specialEquip,
        equip_available: pm.equipAvailable,
        skill_training_req: pm.skillTrainingReq,
        special_skills: pm.specialSkills,
        spares_provider: pm.sparesProvider,
        inspect_req: pm.inspectReq,
        procedure_avail: pm.procedureAvail,
        inspect_rep_req: pm.inspectRepReq,
        est_defective_prob: pm.estDefectiveProb,
        correction_plan_prepared: pm.correctionPlanPrepared,
        spare_parts_req: pm.sparePartsReq,
        env_haz: pm.envHaz,
        env_waste: pm.envWaste,
        env_emissions: pm.envEmissions,
        env_legal: pm.envLegal,
        env_ocps_followed: pm.envOcpsFollowed,
        env_controls: pm.envControls,
        num_workers: pm.numWorkers,
        saf_insurance: pm.safInsurance,
        saf_drawing: pm.safDrawing,
        saf_briefing: pm.safBriefing,
        saf_emergency: pm.safEmergency,
        saf_height: pm.safHeight,
        saf_hot: pm.safHot,
        saf_electrical: pm.safElectrical,
        saf_confined: pm.safConfined,
        saf_isolated: pm.safIsolated,
        saf_risk: pm.safRisk,
        saf_permit_provided: pm.safPermitProvided,
        saf_conduct_briefed: pm.safConductBriefed,
        saf_ppe: pm.safPpe,
        status: pm.status,
        date_created: pm.dateCreated,
        date_submitted: pm.dateSubmitted,
        date_approved: pm.dateApproved
    };
}

function mapPurchaseManualFromDb(row) {
    return {
        id: row.manual_code,
        dept: row.dept,
        agentName: row.agent_name,
        agentAuthDetail: row.agent_auth_detail,
        companyName: row.company_name,
        companyAddress: row.company_address,
        contactNumber: row.contact_number,
        contractType: row.contract_type,
        contractNo: row.contract_no,
        contractDate: row.contract_date,
        noContract: row.no_contract,
        natureWork: row.nature_work,
        requiredOutput: row.required_output,
        experience: row.experience,
        competencyAssess: row.competency_assess,
        eligibility: row.eligibility,
        risksInvolved: row.risks_involved,
        qualityReq: row.quality_req,
        duration: row.duration,
        specialToolNeeded: row.special_tool_needed,
        specialEquip: row.special_equip,
        equipAvailable: row.equip_available,
        skillTrainingReq: row.skill_training_req,
        specialSkills: row.special_skills,
        sparesProvider: row.spares_provider,
        inspectReq: row.inspect_req,
        procedureAvail: row.procedure_avail,
        inspectRepReq: row.inspect_rep_req,
        estDefectiveProb: row.est_defective_prob,
        correctionPlanPrepared: row.correction_plan_prepared,
        sparePartsReq: row.spare_parts_req,
        envHaz: row.env_haz,
        envWaste: row.env_waste,
        envEmissions: row.env_emissions,
        envLegal: row.env_legal,
        envOcpsFollowed: row.env_ocps_followed,
        envControls: row.env_controls,
        numWorkers: row.num_workers,
        safInsurance: row.saf_insurance,
        safDrawing: row.saf_drawing,
        safBriefing: row.saf_briefing,
        safEmergency: row.saf_emergency,
        safHeight: row.saf_height,
        safHot: row.saf_hot,
        safElectrical: row.saf_electrical,
        safConfined: row.saf_confined,
        safIsolated: row.saf_isolated,
        safRisk: row.saf_risk,
        safPermitProvided: row.saf_permit_provided,
        safConductBriefed: row.saf_conduct_briefed,
        safPpe: row.saf_ppe,
        status: row.status,
        dateCreated: row.date_created,
        dateSubmitted: row.date_submitted,
        dateApproved: row.date_approved,
        attachments: []
    };
}

function mapWorkPermitToDb(wp) {
    return {
        permit_code: wp.id,
        purchase_manual_id: wp.purchaseManualId,
        company_entity: wp.companyEntity,
        location_site: wp.locationSite,
        conducted_on: wp.conductedOn,
        work_activity: wp.workActivity,
        high_risk_work: wp.highRiskWork,
        start_time: wp.startTime,
        end_time: wp.endTime,
        rep_name: wp.repName,
        start_date: wp.startDate,
        end_date: wp.endDate,
        description: wp.description,
        chk_standards: wp.chkStandards || false,
        dec_risk_reviewed: wp.decRiskReviewed,
        dec_controls_adequate: wp.decControlsAdequate,
        dec_competent_coord: wp.decCompetentCoord,
        dec_implement_controls: wp.decImplementControls,
        dec_workers_informed: wp.decWorkersInformed,
        dec_monitor_hazards: wp.decMonitorHazards,
        dec_req_approval: wp.decReqApproval,
        dec_supervisor_sig: wp.decSupervisorSig,
        eng_reviewed_docs: wp.engReviewedDocs,
        eng_monitor_methods: wp.engMonitorMethods,
        eng_informed_persons: wp.engInformedPersons,
        eng_contractor_sig: wp.engContractorSig,
        auth_reviewed_docs: wp.authReviewedDocs,
        auth_registered: wp.authRegistered,
        auth_person_sig: wp.authPersonSig,
        status: wp.status,
        safety_officer_approved: wp.safetyOfficerApproved || false,
        final_authorized: wp.finalAuthorized || false
    };
}

function mapWorkPermitFromDb(row) {
    return {
        id: row.permit_code,
        purchaseManualId: row.purchase_manual_id,
        companyEntity: row.company_entity,
        locationSite: row.location_site,
        conductedOn: row.conducted_on,
        workActivity: row.work_activity,
        highRiskWork: row.high_risk_work,
        startTime: row.start_time,
        endTime: row.end_time,
        repName: row.rep_name,
        startDate: row.start_date,
        endDate: row.end_date,
        description: row.description,
        chkStandards: row.chk_standards,
        decRiskReviewed: row.dec_risk_reviewed,
        decControlsAdequate: row.dec_controls_adequate,
        decCompetentCoord: row.dec_competent_coord,
        decImplementControls: row.dec_implement_controls,
        decWorkersInformed: row.dec_workers_informed,
        decMonitorHazards: row.dec_monitor_hazards,
        decReqApproval: row.dec_req_approval,
        decSupervisorSig: row.dec_supervisor_sig,
        engReviewedDocs: row.eng_reviewed_docs,
        engMonitorMethods: row.eng_monitor_methods,
        engInformedPersons: row.eng_informed_persons,
        engContractorSig: row.eng_contractor_sig,
        authReviewedDocs: row.auth_reviewed_docs,
        authRegistered: row.auth_registered,
        authPersonSig: row.auth_person_sig,
        status: row.status,
        safetyOfficerApproved: row.safety_officer_approved,
        finalAuthorized: row.final_authorized
    };
}

function mapSecurityUserToDb(su) {
    return {
        username: su.username,
        name: su.name,
        role: su.role,
        phone: su.phone,
        shift: su.shift
    };
}

function mapSecurityUserFromDb(row) {
    return {
        username: row.username,
        name: row.name,
        role: row.role,
        phone: row.phone,
        shift: row.shift
    };
}

async function resolveLatestHost(hostId) {
    if (!hostId) return null;
    if (supabaseClient) {
        try {
            const { data, error } = await supabaseClient
                .from('employees')
                .select('*')
                .eq('employee_code', hostId)
                .single();
            if (!error && data) {
                const latest = mapEmployeeFromDb(data);
                const idx = state.employees.findIndex(e => e.id === hostId);
                if (idx !== -1) {
                    state.employees[idx] = latest;
                } else {
                    state.employees.push(latest);
                }
                saveState();
                return latest;
            }
        } catch (e) {
            console.error("[VMS resolveLatestHost] Error fetching latest host details:", e);
        }
    }
    return state.employees.find(e => e.id === hostId) || null;
}

function initSupabase() {
    if (window.supabaseClient) {
        supabaseClient = window.supabaseClient;
        console.log("[VMS Cloud] Supabase Client loaded from Vite global.");
        return;
    }
    const url = state.settings?.supabaseUrl;
    const key = state.settings?.supabaseKey;
    if (url && key && window.supabase) {
        try {
            supabaseClient = window.supabase.createClient(url, key);
            console.log("[VMS Cloud] Supabase Client Initialized from local settings.");
        } catch (e) {
            console.error("[VMS Cloud] Failed to initialize Supabase client:", e);
        }
    } else {
        supabaseClient = null;
    }
}

async function syncFromSupabase() {
    if (!supabaseClient) return;
    try {
        showToast("Syncing Database", "Fetching latest data from Supabase...", "info");

        // Sync Branches
        const { data: branches, error: branchErr } = await supabaseClient.from('branches').select('*');
        if (!branchErr && branches) {
            state.branches = branches;
        }

        // Sync Departments
        const { data: departments, error: deptErr } = await supabaseClient.from('departments').select('*');
        if (!deptErr && departments) {
            state.departments = departments;
            localStorage.setItem("gk_departments", JSON.stringify(state.departments));
        }

        // Sync Employees
        const { data: employees, error: empErr } = await supabaseClient.from('employees').select('*');
        if (!empErr && employees) {
            state.employees = employees.map(mapEmployeeFromDb);
            localStorage.setItem("gk_employees", JSON.stringify(state.employees));
        }

        // Sync Visitors
        const { data: visitors, error: visErr } = await supabaseClient.from('visitors').select('*');
        if (!visErr && visitors) {
            state.visitors = visitors.map(mapVisitorFromDb);
            localStorage.setItem("gk_visitors", JSON.stringify(state.visitors));
        }

        // Sync Blacklist
        const { data: blacklist, error: blErr } = await supabaseClient.from('blacklist').select('*');
        if (!blErr && blacklist) {
            state.blacklist = blacklist.map(mapBlacklistFromDb);
            localStorage.setItem("gk_blacklist", JSON.stringify(state.blacklist));
        }

        // Sync Purchase Manuals
        const { data: pms, error: pmErr } = await supabaseClient.from('purchase_manuals').select('*');
        if (!pmErr && pms) {
            state.purchaseManuals = pms.map(mapPurchaseManualFromDb);
            localStorage.setItem("gk_purchase_manuals", JSON.stringify(state.purchaseManuals));
        }

        // Sync Work Permits
        const { data: wps, error: wpErr } = await supabaseClient.from('work_permits').select('*');
        if (!wpErr && wps) {
            state.workPermits = wps.map(mapWorkPermitFromDb);
            localStorage.setItem("gk_work_permits", JSON.stringify(state.workPermits));
        }

        // Sync Notifications
        const { data: notifications, error: notifErr } = await supabaseClient.from('notifications').select('*').order('created_at', { ascending: false }).limit(50);
        if (!notifErr && notifications) {
            state.notifications = notifications.map(mapNotificationFromDb);
            localStorage.setItem("gk_notifications", JSON.stringify(state.notifications));
        }

        refreshAllDataViews();
        showToast("Sync Complete", "Database synced with Supabase Cloud successfully.", "success");
        addAuditLog("Sync Database", "Cloud", "Synced local database tables with Supabase cloud");
    } catch (e) {
        console.error("Supabase sync error:", e);
        showToast("Sync Error", "Failed to sync database tables from cloud.", "danger");
    }
}

async function pushLocalToSupabase() {
    if (!supabaseClient) {
        showToast("Error", "Supabase is not configured.", "danger");
        return;
    }
    try {
        showToast("Syncing Database", "Uploading local data to Supabase...", "info");

        // Upsert branches
        const branchesToPush = [
            { name: "Chennai HQ", location: "Chennai, Tamil Nadu, India" },
            { name: "Coimbatore Plant", location: "Coimbatore, Tamil Nadu, India" },
            { name: "Bangalore R&D", location: "Bangalore, Karnataka, India" }
        ];
        await supabaseClient.from('branches').upsert(branchesToPush, { onConflict: 'name' });

        // Upsert departments
        if (state.departments && state.departments.length > 0) {
            const { error: deptErr } = await supabaseClient.from('departments').upsert(state.departments, { onConflict: 'name' });
            if (deptErr) throw new Error("Departments upsert: " + deptErr.message);
        }

        // Upsert employees
        if (state.employees && state.employees.length > 0) {
            const dbEmployees = state.employees.map(mapEmployeeToDb);
            const { error: empErr } = await supabaseClient.from('employees').upsert(dbEmployees, { onConflict: 'employee_code' });
            if (empErr) throw new Error("Employees upsert: " + empErr.message);
        }

        // Upsert blacklist
        if (state.blacklist && state.blacklist.length > 0) {
            const dbBlacklist = state.blacklist.map(mapBlacklistToDb);
            const { error: blErr } = await supabaseClient.from('blacklist').upsert(dbBlacklist);
            if (blErr) throw new Error("Blacklist upsert: " + blErr.message);
        }

        // Upsert visitors
        if (state.visitors && state.visitors.length > 0) {
            const dbVisitors = state.visitors.map(mapVisitorToDb);
            const { error: visErr } = await supabaseClient.from('visitors').upsert(dbVisitors, { onConflict: 'visitor_code' });
            if (visErr) throw new Error("Visitors upsert: " + visErr.message);
        }

        // Upsert students
        if (state.studentMaster && state.studentMaster.length > 0) {
            const dbStudents = state.studentMaster.map(mapStudentToDb);
            const { error: stuErr } = await supabaseClient.from('students').upsert(dbStudents, { onConflict: 'student_id' });
            if (stuErr) {
                console.error("Students upsert error:", stuErr);
            }
        }

        // Upsert purchase manuals
        if (state.purchaseManuals && state.purchaseManuals.length > 0) {
            const dbPms = state.purchaseManuals.map(mapPurchaseManualToDb);
            const { error: pmErr } = await supabaseClient.from('purchase_manuals').upsert(dbPms, { onConflict: 'manual_code' });
            if (pmErr) throw new Error("Purchase manuals upsert: " + pmErr.message);
        }

        // Upsert work permits
        if (state.workPermits && state.workPermits.length > 0) {
            const dbWps = state.workPermits.map(mapWorkPermitToDb);
            const { error: wpErr } = await supabaseClient.from('work_permits').upsert(dbWps, { onConflict: 'permit_code' });
            if (wpErr) throw new Error("Work permits upsert: " + wpErr.message);
        }

        // Upsert notifications
        if (state.notifications && state.notifications.length > 0) {
            const dbNotifications = state.notifications.map(mapNotificationToDb);
            const { error: notifErr } = await supabaseClient.from('notifications').upsert(dbNotifications);
            if (notifErr) throw new Error("Notifications upsert: " + notifErr.message);
        }

        showToast("Cloud Seeding Successful", "Local data pushed to Supabase tables.", "success");
        addAuditLog("Push to Cloud", "Cloud", "Pushed local tables to Supabase Cloud");
    } catch (e) {
        console.error("Cloud push failed:", e);
        showToast("Cloud Push Failed", e.message, "danger");
    }
}

async function syncSingleVisitorToCloud(visitor) {
    if (supabaseClient) {
        try {
            const dbRow = mapVisitorToDb(visitor);
            const { error } = await supabaseClient.from('visitors').upsert(dbRow, { onConflict: 'visitor_code' });
            if (error) {
                console.error("Failed to sync visitor to Supabase:", error);
            } else {
                console.log("Visitor synced to Supabase:", visitor.id);
            }
        } catch (e) {
            console.error("Supabase visitor sync error:", e);
        }
    }
}



function loadSettingsIntoForm() {
    const s = state.settings || {};
    if (document.getElementById("cfg-sms-provider")) document.getElementById("cfg-sms-provider").value = s.smsProvider || "Twilio";
    if (document.getElementById("cfg-wa-token")) document.getElementById("cfg-wa-token").value = s.waToken || "";
    if (document.getElementById("cfg-wa-phone-id")) document.getElementById("cfg-wa-phone-id").value = s.waPhoneId || "";
    if (document.getElementById("cfg-smtp-host")) document.getElementById("cfg-smtp-host").value = s.smtpHost || "";
    if (document.getElementById("cfg-smtp-port")) document.getElementById("cfg-smtp-port").value = s.smtpPort || "587";
    if (document.getElementById("cfg-terminal-gate")) {
        document.getElementById("cfg-terminal-gate").value = s.terminalGate || "Barani Security Gate";
        document.getElementById("display-gate-name").innerText = s.terminalGate || "Barani Security Gate";
    }

    // Cloud Sync Settings
    if (document.getElementById("cfg-supabase-url")) document.getElementById("cfg-supabase-url").value = s.supabaseUrl || "";
    if (document.getElementById("cfg-supabase-key")) document.getElementById("cfg-supabase-key").value = s.supabaseKey || "";
    if (document.getElementById("cfg-supabase-bucket")) document.getElementById("cfg-supabase-bucket").value = s.supabaseBucket || "visitor-passes";

    // GCP Settings (Legacy/Deprecated)
    if (document.getElementById("cfg-gcp-backend-url")) document.getElementById("cfg-gcp-backend-url").value = s.gcpBackendUrl || "";
    if (document.getElementById("cfg-gcp-ai-url")) document.getElementById("cfg-gcp-ai-url").value = s.gcpAiUrl || "";
    if (document.getElementById("cfg-public-web-url")) document.getElementById("cfg-public-web-url").value = s.publicWebUrl || "";

    if (document.getElementById("cfg-wa-method")) document.getElementById("cfg-wa-method").value = s.waMethod || "url-local";
    if (document.getElementById("cfg-auto-send-wa")) document.getElementById("cfg-auto-send-wa").checked = s.autoSendWhatsApp !== false;
}

function initializeCloudSettings() {
    // Inject inputs values
    loadSettingsIntoForm();

    // Listen for settings inputs changes
    const cloudInputs = [
        "cfg-sms-provider", "cfg-wa-token", "cfg-wa-phone-id",
        "cfg-smtp-host", "cfg-smtp-port", "cfg-terminal-gate",
        "cfg-supabase-url", "cfg-supabase-key", "cfg-supabase-bucket",
        "cfg-gcp-backend-url", "cfg-gcp-ai-url", "cfg-public-web-url",
        "cfg-wa-method"
    ];
    cloudInputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener("change", (e) => {
                const prop = id.replace('cfg-', '').replace(/-([a-z])/g, g => g[1].toUpperCase());
                state.settings = state.settings || {};
                state.settings[prop] = el.value;
                localStorage.setItem("gk_settings", JSON.stringify(state.settings));

                // Re-initialize Supabase client
                if (prop === "supabaseUrl" || prop === "supabaseKey") {
                    initSupabase();
                }

                showToast("Settings Updated", `Configured value saved for ${id.replace('cfg-', '').toUpperCase()}`, "success");
                addAuditLog("Update System Config", "Settings", `Modified configuration parameter: ${id}`);
            });
        }
    });

    const chkAutoSend = document.getElementById("cfg-auto-send-wa");
    if (chkAutoSend) {
        chkAutoSend.addEventListener("change", (e) => {
            state.settings = state.settings || {};
            state.settings.autoSendWhatsApp = e.target.checked;
            localStorage.setItem("gk_settings", JSON.stringify(state.settings));
            showToast("Settings Updated", `Auto-Send WhatsApp set to ${e.target.checked}`, "success");
            addAuditLog("Update System Config", "Settings", `Auto-send WhatsApp set to: ${e.target.checked}`);
        });
    }

    // Cloud Database Buttons Event Listeners
    const btnSeedCloud = document.getElementById("btn-seed-cloud-db");
    if (btnSeedCloud) {
        btnSeedCloud.addEventListener("click", pushLocalToSupabase);
    }

    const btnSyncCloud = document.getElementById("btn-sync-cloud-db");
    if (btnSyncCloud) {
        btnSyncCloud.addEventListener("click", syncFromSupabase);
    }



    // Initialize Supabase Client
    initSupabase();

    // Trigger sync
    state.activeDMTab = "dm-tab-students";
    state.dmCurrentPage = 1;
    state.dmPageSize = 10;

    if (supabaseClient) {
        syncFromSupabase();
    }
}

// ==========================================================================
// DATA MANAGEMENT MODULE (ADMINISTRATOR ONLY)
// ==========================================================================
let dmSortColumn = "";
let dmSortOrder = "asc";
let dmFilteredData = [];

window.switchDataManagementTab = function (tabId) {
    state.activeDMTab = tabId;
    state.dmCurrentPage = 1;

    document.querySelectorAll(".admin-tab-btn").forEach(btn => {
        const btnTab = btn.getAttribute("data-dm-tab");
        if (btnTab === tabId) {
            btn.classList.add("active");
            btn.style.color = "var(--accent-primary)";
            btn.style.borderBottom = "2px solid var(--accent-primary)";
        } else {
            btn.classList.remove("active");
            btn.style.color = "var(--text-secondary)";
            btn.style.borderBottom = "2px solid transparent";
        }
    });

    renderDataManagementTab(tabId);
};

window.changeDataManagementPageSize = function () {
    state.dmPageSize = parseInt(document.getElementById("dm-page-size").value) || 10;
    state.dmCurrentPage = 1;
    renderDataManagementTab(state.activeDMTab);
};

window.filterDataManagementTable = function () {
    state.dmCurrentPage = 1;
    renderDataManagementTab(state.activeDMTab);
};

window.handleDMHeaderClick = function (key) {
    if (dmSortColumn === key) {
        dmSortOrder = dmSortOrder === "asc" ? "desc" : "asc";
    } else {
        dmSortColumn = key;
        dmSortOrder = "asc";
    }
    renderDataManagementTab(state.activeDMTab);
};

window.editMasterRecord = function (category, id) {
    let match = null;
    if (category === "student") match = state.studentMaster.find(s => s.studentId === id);
    else if (category === "customer") match = state.customerMaster.find(c => c.customerId === id);
    else if (category === "vendor") match = state.vendorMaster.find(v => v.vendorId === id);

    if (match) {
        window.navigateTo(`/${category}-registration`);
        setTimeout(() => {
            // Fill form fields
            autoFillVisitorFields(category, match);
            const searchInput = document.getElementById(`search-visitor-${category}`);
            if (searchInput) searchInput.value = match.phone || "";
        }, 100);
    }
};

window.deleteMasterRecord = function (category, id) {
    if (confirm(`Are you sure you want to delete this ${category} record from the master database?`)) {
        if (category === "student") {
            state.studentMaster = state.studentMaster.filter(s => s.studentId !== id);
            localStorage.setItem("gk_student_master", JSON.stringify(state.studentMaster));
        } else if (category === "customer") {
            state.customerMaster = state.customerMaster.filter(c => c.customerId !== id);
            localStorage.setItem("gk_customer_master", JSON.stringify(state.customerMaster));
        } else if (category === "vendor") {
            state.vendorMaster = state.vendorMaster.filter(v => v.vendorId !== id);
            localStorage.setItem("gk_vendor_master", JSON.stringify(state.vendorMaster));
        }
        showToast("Record Deleted", `Successfully removed the record from ${category} master database.`, "success");
        renderDataManagementTab(state.activeDMTab);
    }
};

function getDMRawData(tabId) {
    const todayStr = getLocalDateStr();
    if (tabId === "dm-tab-students") {
        return state.studentMaster.map(s => {
            const visits = state.visitors.filter(v => v.masterId === s.studentId || v.phone === s.phone);
            const currentVisit = visits.find(v => v.status === "Checked In");
            return {
                photo: s.photo || "",
                studentId: s.studentId,
                name: s.name,
                phone: s.phone,
                college: s.college || "",
                department: s.department || "",
                hostName: visits.length > 0 ? visits[0].hostName : "-",
                purpose: visits.length > 0 ? visits[0].purpose : "-",
                visitCount: visits.length,
                lastVisit: visits.length > 0 ? visits[0].visitDate : "-",
                status: currentVisit ? "Checked In" : "Checked Out"
            };
        });
    } else if (tabId === "dm-tab-customers") {
        return state.customerMaster.map(c => {
            const visits = state.visitors.filter(v => v.masterId === c.customerId || v.phone === c.phone);
            const currentVisit = visits.find(v => v.status === "Checked In");
            return {
                photo: c.photo || "",
                customerId: c.customerId,
                name: c.name,
                company: c.company || "",
                phone: c.phone,
                department: c.department || (visits.length > 0 ? visits[0].department : "-"),
                hostName: visits.length > 0 ? visits[0].hostName : "-",
                purpose: visits.length > 0 ? visits[0].purpose : "-",
                visitCount: visits.length,
                lastVisit: visits.length > 0 ? visits[0].visitDate : "-",
                status: currentVisit ? "Checked In" : "Checked Out"
            };
        });
    } else if (tabId === "dm-tab-vendors") {
        return state.vendorMaster.map(v => {
            const visits = state.visitors.filter(vRecord => vRecord.masterId === v.vendorId || vRecord.phone === v.phone);
            const currentVisit = visits.find(vRecord => vRecord.status === "Checked In");
            return {
                photo: v.photo || "",
                vendorId: v.vendorId,
                name: v.name,
                company: v.company || "",
                phone: v.phone,
                department: v.department || (visits.length > 0 ? visits[0].department : "-"),
                hostName: visits.length > 0 ? visits[0].hostName : "-",
                visitCount: visits.length,
                lastVisit: visits.length > 0 ? visits[0].visitDate : "-",
                status: currentVisit ? "Checked In" : "Checked Out"
            };
        });
    } else if (tabId === "dm-tab-workpermits") {
        return state.workPermits.map(wp => ({
            permitCode: wp.permitCode,
            companyEntity: wp.companyEntity || "",
            workActivity: wp.workActivity || "",
            repName: wp.repName || "",
            startDate: wp.startDate || "",
            endDate: wp.endDate || "",
            status: wp.status
        }));
    } else if (tabId === "dm-tab-purchasemanuals") {
        return state.purchaseManuals.map(pm => ({
            manualCode: pm.manualCode,
            companyName: pm.companyName || "",
            dept: pm.dept || "",
            agentName: pm.agentName || "",
            dateCreated: pm.dateCreated || "",
            status: pm.status
        }));
    }
    return [];
}

function getDMHeaders(tabId) {
    if (tabId === "dm-tab-students") {
        return [
            { label: "Photo", key: "photo", sortable: false },
            { label: "Student ID", key: "studentId", sortable: true },
            { label: "Name", key: "name", sortable: true },
            { label: "Phone", key: "phone", sortable: true },
            { label: "College", key: "college", sortable: true },
            { label: "Department", key: "department", sortable: true },
            { label: "Host", key: "hostName", sortable: true },
            { label: "Purpose", key: "purpose", sortable: true },
            { label: "Visits", key: "visitCount", sortable: true },
            { label: "Last Visit", key: "lastVisit", sortable: true },
            { label: "Status", key: "status", sortable: true },
            { label: "Actions", key: "actions", sortable: false }
        ];
    } else if (tabId === "dm-tab-customers") {
        return [
            { label: "Photo", key: "photo", sortable: false },
            { label: "Customer ID", key: "customerId", sortable: true },
            { label: "Name", key: "name", sortable: true },
            { label: "Company", key: "company", sortable: true },
            { label: "Phone", key: "phone", sortable: true },
            { label: "Department", key: "department", sortable: true },
            { label: "Host", key: "hostName", sortable: true },
            { label: "Purpose", key: "purpose", sortable: true },
            { label: "Visits", key: "visitCount", sortable: true },
            { label: "Last Visit", key: "lastVisit", sortable: true },
            { label: "Status", key: "status", sortable: true },
            { label: "Actions", key: "actions", sortable: false }
        ];
    } else if (tabId === "dm-tab-vendors") {
        return [
            { label: "Photo", key: "photo", sortable: false },
            { label: "Vendor ID", key: "vendorId", sortable: true },
            { label: "Name", key: "name", sortable: true },
            { label: "Company", key: "company", sortable: true },
            { label: "Phone", key: "phone", sortable: true },
            { label: "Department", key: "department", sortable: true },
            { label: "Host", key: "hostName", sortable: true },
            { label: "Visits", key: "visitCount", sortable: true },
            { label: "Last Visit", key: "lastVisit", sortable: true },
            { label: "Status", key: "status", sortable: true },
            { label: "Actions", key: "actions", sortable: false }
        ];
    } else if (tabId === "dm-tab-workpermits") {
        return [
            { label: "Permit Code", key: "permitCode", sortable: true },
            { label: "Contractor Entity", key: "companyEntity", sortable: true },
            { label: "Work Activity", key: "workActivity", sortable: true },
            { label: "Supervisor", key: "repName", sortable: true },
            { label: "Start Date", key: "startDate", sortable: true },
            { label: "End Date", key: "endDate", sortable: true },
            { label: "Status", key: "status", sortable: true },
            { label: "Actions", key: "actions", sortable: false }
        ];
    } else if (tabId === "dm-tab-purchasemanuals") {
        return [
            { label: "Manual Code", key: "manualCode", sortable: true },
            { label: "Vendor Company", key: "companyName", sortable: true },
            { label: "Department", key: "dept", sortable: true },
            { label: "Created By", key: "agentName", sortable: true },
            { label: "Date Created", key: "dateCreated", sortable: true },
            { label: "Status", key: "status", sortable: true },
            { label: "Actions", key: "actions", sortable: false }
        ];
    }
    return [];
}

function renderDataManagementTab(tabId) {
    const rawData = getDMRawData(tabId);
    const searchVal = document.getElementById("dm-search-input") ? document.getElementById("dm-search-input").value.trim().toLowerCase() : "";
    const statusFilterVal = document.getElementById("dm-filter-status") ? document.getElementById("dm-filter-status").value : "all";

    // 1. Filter
    let filtered = rawData.filter(row => {
        let matchesSearch = false;
        for (const val of Object.values(row)) {
            if (val && String(val).toLowerCase().includes(searchVal)) {
                matchesSearch = true;
                break;
            }
        }
        if (searchVal === "") matchesSearch = true;

        let matchesStatus = true;
        if (statusFilterVal !== "all") {
            matchesStatus = (row.status && row.status.toLowerCase() === statusFilterVal.toLowerCase());
        }

        return matchesSearch && matchesStatus;
    });

    // 2. Sort
    if (dmSortColumn) {
        filtered.sort((a, b) => {
            let valA = a[dmSortColumn];
            let valB = b[dmSortColumn];

            if (typeof valA === "number" && typeof valB === "number") {
                return dmSortOrder === "asc" ? valA - valB : valB - valA;
            }
            valA = String(valA || "").toLowerCase();
            valB = String(valB || "").toLowerCase();
            if (valA < valB) return dmSortOrder === "asc" ? -1 : 1;
            if (valA > valB) return dmSortOrder === "asc" ? 1 : -1;
            return 0;
        });
    }

    dmFilteredData = filtered;

    // 3. Paginate
    const totalRecords = filtered.length;
    const totalPages = Math.ceil(totalRecords / state.dmPageSize) || 1;
    if (state.dmCurrentPage > totalPages) state.dmCurrentPage = totalPages;

    const startIndex = (state.dmCurrentPage - 1) * state.dmPageSize;
    const endIndex = Math.min(startIndex + state.dmPageSize, totalRecords);
    const paginatedData = filtered.slice(startIndex, endIndex);

    // 4. Update Header
    const tableHead = document.getElementById("dm-table-head");
    if (tableHead) {
        const headers = getDMHeaders(tabId);
        let headHTML = "<tr>";
        headers.forEach(h => {
            if (h.sortable) {
                const isSorted = dmSortColumn === h.key;
                const caret = isSorted ? (dmSortOrder === "asc" ? " ▲" : " ▼") : " ↕";
                headHTML += `<th onclick="handleDMHeaderClick('${h.key}')" style="cursor: pointer; user-select: none;">${h.label}${caret}</th>`;
            } else {
                headHTML += `<th>${h.label}</th>`;
            }
        });
        headHTML += "</tr>";
        tableHead.innerHTML = headHTML;
    }

    // 5. Update Body
    const tableBody = document.getElementById("dm-table-body");
    if (tableBody) {
        tableBody.innerHTML = "";
        const headers = getDMHeaders(tabId);

        if (paginatedData.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="${headers.length}" style="text-align: center; color: var(--text-secondary);">No records found matching filters.</td></tr>`;
        } else {
            paginatedData.forEach((row, i) => {
                const tr = document.createElement("tr");
                let rowHTML = "";
                headers.forEach(h => {
                    const val = row[h.key];
                    if (h.key === "photo") {
                        const defaultImg = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23cbd5e1' stroke-width='1.5'><path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/><circle cx='12' cy='7' r='4'/></svg>";
                        rowHTML += `<td><img src="${val || defaultImg}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;"></td>`;
                    } else if (h.key === "status") {
                        const badgeClass = String(val).toLowerCase().replace(/ /g, "-");
                        rowHTML += `<td><span class="badge-status ${badgeClass}">${val}</span></td>`;
                    } else if (h.key === "actions") {
                        let cat = "";
                        let recId = "";
                        if (tabId === "dm-tab-students") { cat = "student"; recId = row.studentId; }
                        else if (tabId === "dm-tab-customers") { cat = "customer"; recId = row.customerId; }
                        else if (tabId === "dm-tab-vendors") { cat = "vendor"; recId = row.vendorId; }

                        if (cat) {
                            rowHTML += `<td>
                                <button type="button" class="btn btn-primary btn-xs" onclick="editMasterRecord('${cat}', '${recId}')" style="margin-right: 0.25rem; padding: 0.2rem 0.4rem; font-size: 0.75rem;">Edit</button>
                                <button type="button" class="btn btn-danger btn-xs" onclick="deleteMasterRecord('${cat}', '${recId}')" style="padding: 0.2rem 0.4rem; font-size: 0.75rem;">Delete</button>
                            </td>`;
                        } else {
                            rowHTML += `<td>-</td>`;
                        }
                    } else {
                        rowHTML += `<td>${val === undefined || val === null ? "-" : val}</td>`;
                    }
                });
                tr.innerHTML = rowHTML;
                tableBody.appendChild(tr);
            });
        }
    }

    // 6. Update Pagination Footer Info
    const displayStart = totalRecords === 0 ? 0 : startIndex + 1;
    const paginationInfo = document.getElementById("dm-pagination-info");
    if (paginationInfo) {
        paginationInfo.innerText = `Showing ${displayStart} to ${endIndex} of ${totalRecords} entries`;
    }

    // 7. Update Pagination Controls
    const controls = document.getElementById("dm-pagination-controls");
    if (controls) {
        controls.innerHTML = "";

        // Prev Button
        const prevBtn = document.createElement("button");
        prevBtn.type = "button";
        prevBtn.className = `btn btn-secondary btn-xs ${state.dmCurrentPage === 1 ? "disabled" : ""}`;
        prevBtn.innerText = "Previous";
        prevBtn.onclick = () => {
            if (state.dmCurrentPage > 1) {
                state.dmCurrentPage--;
                renderDataManagementTab(tabId);
            }
        };
        controls.appendChild(prevBtn);

        // Page Numbers
        const maxPageNumbers = 5;
        let startPage = Math.max(1, state.dmCurrentPage - Math.floor(maxPageNumbers / 2));
        let endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);
        if (endPage - startPage + 1 < maxPageNumbers) {
            startPage = Math.max(1, endPage - maxPageNumbers + 1);
        }

        for (let p = startPage; p <= endPage; p++) {
            const pageBtn = document.createElement("button");
            pageBtn.type = "button";
            pageBtn.className = `btn btn-xs ${p === state.dmCurrentPage ? "btn-primary" : "btn-secondary"}`;
            pageBtn.innerText = p;
            pageBtn.onclick = () => {
                state.dmCurrentPage = p;
                renderDataManagementTab(tabId);
            };
            controls.appendChild(pageBtn);
        }

        // Next Button
        const nextBtn = document.createElement("button");
        nextBtn.type = "button";
        nextBtn.className = `btn btn-secondary btn-xs ${state.dmCurrentPage === totalPages ? "disabled" : ""}`;
        nextBtn.innerText = "Next";
        nextBtn.onclick = () => {
            if (state.dmCurrentPage < totalPages) {
                state.dmCurrentPage++;
                renderDataManagementTab(tabId);
            }
        };
        controls.appendChild(nextBtn);
    }
}

window.exportDataManagement = function (type) {
    const tabId = state.activeDMTab;
    const headers = getDMHeaders(tabId).filter(h => h.key !== "photo" && h.key !== "actions");
    const rows = dmFilteredData;

    if (type === 'csv') {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += headers.map(h => `"${h.label}"`).join(",") + "\n";
        rows.forEach(r => {
            const rowVal = headers.map(h => {
                let val = r[h.key];
                return `"${String(val === undefined || val === null ? "" : val).replace(/"/g, '""')}"`;
            }).join(",");
            csvContent += rowVal + "\n";
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `DataManagement_${tabId}_${getLocalDateStr()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else if (type === 'excel') {
        let xlsContent = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">`;
        xlsContent += `<head><meta charset="utf-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Sheet1</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table><thead><tr>`;
        headers.forEach(h => {
            xlsContent += `<th>${h.label}</th>`;
        });
        xlsContent += `</tr></thead><tbody>`;
        rows.forEach(r => {
            xlsContent += `<tr>`;
            headers.forEach(h => {
                xlsContent += `<td>${r[h.key] === undefined || r[h.key] === null ? "" : r[h.key]}</td>`;
            });
            xlsContent += `</tr>`;
        });
        xlsContent += `</tbody></table></body></html>`;

        const blob = new Blob([xlsContent], { type: "application/vnd.ms-excel" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `DataManagement_${tabId}_${getLocalDateStr()}.xls`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else if (type === 'pdf') {
        if (typeof window.jspdf === 'undefined') {
            showToast("PDF Export Error", "jsPDF library is not loaded.", "danger");
            return;
        }
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

        // Colors
        const primaryColor = [13, 40, 24]; // #0d2818
        const headerTextColor = [240, 250, 244]; // #f0faf4
        const borderLight = [226, 232, 240]; // #e2e8f0

        // Title
        let title = "Data Management Register";
        if (tabId === "dm-tab-students") title = "Students Master Register";
        else if (tabId === "dm-tab-customers") title = "Customers Master Register";
        else if (tabId === "dm-tab-vendors") title = "Vendors Master Register";
        else if (tabId === "dm-tab-workpermits") title = "Work Permits Access Clearance Register";
        else if (tabId === "dm-tab-purchasemanuals") title = "Purchase Manual Registers Log";

        // Branch and user details
        const branchName = state.settings?.terminalGate || "Barani Security Gate";
        const printedBy = state.currentUser ? state.currentUser.name : "System Operator";
        const printedOn = new Date().toLocaleString();

        // 1. Draw Company Header Block
        doc.setFillColor(...primaryColor);
        doc.rect(0, 0, 297, 25, "F");

        doc.setTextColor(...headerTextColor);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("BHARANI HYDRAULICS VMS", 15, 10);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(title, 15, 18);

        // Meta block
        doc.setFontSize(8);
        doc.text(`Branch: ${branchName}`, 215, 8);
        doc.text(`Printed By: ${printedBy}`, 215, 13);
        doc.text(`Date & Time: ${printedOn}`, 215, 18);

        // 2. Build Grid Layout
        let startY = 32;
        const totalWidth = 267; // 297 - 30 margin
        const colWidth = totalWidth / headers.length;

        // Render Table Headers
        doc.setFillColor(240, 250, 244);
        doc.rect(15, startY, totalWidth, 8, "F");
        doc.setDrawColor(...borderLight);
        doc.rect(15, startY, totalWidth, 8, "S");

        doc.setTextColor(13, 40, 24);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);

        headers.forEach((h, idx) => {
            doc.text(h.label, 17 + (idx * colWidth), startY + 5.5);
        });

        // Render Data Rows
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(51, 65, 85);

        let currentY = startY + 8;

        rows.forEach((r, rIdx) => {
            // Draw alternating row backgrounds
            if (rIdx % 2 === 1) {
                doc.setFillColor(248, 250, 252);
                doc.rect(15, currentY, totalWidth, 7, "F");
            }

            headers.forEach((h, cIdx) => {
                let val = r[h.key];
                val = val === undefined || val === null ? "-" : String(val);
                // Truncate if too long
                if (val.length > 25) val = val.substring(0, 22) + "...";
                doc.text(val, 17 + (cIdx * colWidth), currentY + 4.5);
            });

            // Grid bottom line
            doc.setDrawColor(...borderLight);
            doc.line(15, currentY + 7, 15 + totalWidth, currentY + 7);

            currentY += 7;

            // Page Break Check
            if (currentY > 185 && rIdx < rows.length - 1) {
                doc.addPage();

                // Redraw Company title
                doc.setFillColor(...primaryColor);
                doc.rect(0, 0, 297, 20, "F");
                doc.setTextColor(...headerTextColor);
                doc.setFont("helvetica", "bold");
                doc.setFontSize(14);
                doc.text(`BHARANI HYDRAULICS VMS - ${title}`, 15, 12);

                // Redraw headers
                startY = 25;
                doc.setFillColor(240, 250, 244);
                doc.rect(15, startY, totalWidth, 8, "F");
                doc.setDrawColor(...borderLight);
                doc.rect(15, startY, totalWidth, 8, "S");

                doc.setTextColor(13, 40, 24);
                doc.setFont("helvetica", "bold");
                doc.setFontSize(7.5);

                headers.forEach((h, idx) => {
                    doc.text(h.label, 17 + (idx * colWidth), startY + 5.5);
                });

                doc.setFont("helvetica", "normal");
                doc.setFontSize(7);
                doc.setTextColor(51, 65, 85);
                currentY = startY + 8;
            }
        });

        // Add Footer text on last page
        doc.setFontSize(6);
        doc.setTextColor(148, 163, 184);
        doc.text("Generated via Barani VMS Secure Data Management Portal", 15, 202);
        doc.text("Landscape A4 Page Layout", 245, 202);

        doc.save(`DataManagement_${tabId}_${getLocalDateStr()}.pdf`);
    }
};

window.printDataManagement = function () {
    const tabId = state.activeDMTab;
    const headers = getDMHeaders(tabId).filter(h => h.key !== "photo" && h.key !== "actions");
    const rows = dmFilteredData;

    let title = "Data Management Register";
    if (tabId === "dm-tab-students") title = "Students Master Register";
    else if (tabId === "dm-tab-customers") title = "Customers Master Register";
    else if (tabId === "dm-tab-vendors") title = "Vendors Master Register";
    else if (tabId === "dm-tab-workpermits") title = "Work Permits Access Clearance Register";
    else if (tabId === "dm-tab-purchasemanuals") title = "Purchase Manual Registers Log";

    const branchName = state.settings?.terminalGate || "Barani Security Gate";
    const printedBy = state.currentUser ? state.currentUser.name : "System Operator";
    const printedOn = new Date().toLocaleString();

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
        <html>
            <head>
                <title>${title}</title>
                <style>
                    @page {
                        size: landscape;
                        margin: 15mm;
                    }
                    body {
                        font-family: Arial, sans-serif;
                        color: #0f172a;
                        margin: 0;
                        padding: 0;
                        font-size: 11px;
                    }
                    .header-container {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        border-bottom: 2px solid #16a34a;
                        padding-bottom: 15px;
                        margin-bottom: 20px;
                    }
                    .logo-title {
                        display: flex;
                        align-items: center;
                        gap: 15px;
                    }
                    .logo {
                        width: 50px;
                        height: 50px;
                        background: #0d2818;
                        border-radius: 8px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: #f0faf4;
                        font-size: 22px;
                        font-weight: 800;
                    }
                    .title-block h1 {
                        margin: 0 0 5px 0;
                        font-size: 18px;
                        color: #0d2818;
                    }
                    .title-block p {
                        margin: 0;
                        font-size: 11px;
                        color: #64748b;
                        font-weight: 500;
                    }
                    .meta-block {
                        text-align: right;
                        font-size: 10px;
                        color: #475569;
                        line-height: 1.5;
                    }
                    .meta-block strong {
                        color: #0f172a;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 15px;
                    }
                    th {
                        background-color: #f0faf4 !important;
                        color: #0d2818;
                        font-weight: 700;
                        text-align: left;
                        padding: 8px 10px;
                        border-bottom: 2px solid #cbd5e1;
                        font-size: 10px;
                        text-transform: uppercase;
                    }
                    td {
                        padding: 8px 10px;
                        border-bottom: 1px solid #e2e8f0;
                        font-size: 10px;
                        color: #334155;
                    }
                    .badge-status {
                        display: inline-block;
                        padding: 2px 6px;
                        border-radius: 4px;
                        font-size: 8px;
                        font-weight: 700;
                        text-transform: uppercase;
                    }
                    .badge-status.approved, .badge-status.checked-in {
                        background-color: #dcfce7;
                        color: #15803d;
                    }
                    .badge-status.pending, .badge-status.submitted {
                        background-color: #fef9c3;
                        color: #a16207;
                    }
                    .badge-status.checked-out {
                        background-color: #f1f5f9;
                        color: #475569;
                    }
                    .badge-status.rejected, .badge-status.denied {
                        background-color: #fee2e2;
                        color: #b91c1c;
                    }
                    .footer-info {
                        position: fixed;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        display: flex;
                        justify-content: space-between;
                        font-size: 9px;
                        color: #94a3b8;
                        border-top: 1px solid #e2e8f0;
                        padding-top: 5px;
                    }
                </style>
            </head>
            <body>
                <div class="header-container">
                    <div class="logo-title">
                        <div class="logo">B</div>
                        <div class="title-block">
                            <h1>BHARANI HYDRAULICS VMS</h1>
                            <p>${title}</p>
                        </div>
                    </div>
                    <div class="meta-block">
                        <div>Branch: <strong>${branchName}</strong></div>
                        <div>Printed By: <strong>${printedBy}</strong></div>
                        <div>Date & Time: <strong>${printedOn}</strong></div>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th style="width: 40px;">S.No</th>
                            ${headers.map(h => `<th>${h.label}</th>`).join("")}
                        </tr>
                    </thead>
                    <tbody>
                        ${rows.map((r, i) => `
                            <tr>
                                <td>${i + 1}</td>
                                ${headers.map(h => {
        const val = r[h.key];
        if (h.key === "status") {
            const badgeClass = String(val).toLowerCase().replace(/ /g, "-");
            return `<td><span class="badge-status ${badgeClass}">${val}</span></td>`;
        }
        return `<td>${val === undefined || val === null ? "-" : val}</td>`;
    }).join("")}
                            </tr>
                        `).join("")}
                    </tbody>
                </table>

                <div class="footer-info">
                    <span>Generated via Barani VMS Secure Data Management Portal</span>
                    <span>Page 1 of 1</span>
                </div>
            </body>
        </html>
    `);
    doc.close();

    iframe.contentWindow.focus();
    setTimeout(() => {
        iframe.contentWindow.print();
        setTimeout(() => {
            document.body.removeChild(iframe);
        }, 1000);
    }, 500);
};

// Base64 Data URL to Blob Converter helper
function dataURLtoBlob(dataurl) {
    try {
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    } catch (err) {
        console.error("dataURLtoBlob conversion error:", err);
        return null;
    }
}

// ==========================================================================
// PURCHASE MANUAL & WORK PERMIT REGISTRY IMPLEMENTATIONS
// ==========================================================================
let uploadedFiles = [];

function updateWorkPermitMenuState() {
    const hasApprovedPM = state.purchaseManuals.some(pm => pm.status === "Approved");
    const wpLink = document.getElementById("nav-work-permit");
    if (wpLink) {
        if (hasApprovedPM) {
            wpLink.classList.remove("disabled");
        } else {
            wpLink.classList.add("disabled");
        }
    }
}

function handlePmAttachmentsUpload(e) {
    const pmDept = document.getElementById("pm-dept");
    const isViewOnly = pmDept ? pmDept.disabled : false;
    if (isViewOnly) return;

    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = function (evt) {
            const fileData = {
                id: "ATT" + Date.now() + "_" + Math.floor(Math.random() * 1000),
                fileName: file.name,
                fileData: evt.target.result
            };
            uploadedFiles.push(fileData);
            renderPmFilesList();
        };
        reader.readAsDataURL(file);
    }
}

function renderPmFilesList() {
    const list = document.getElementById("pm-file-list");
    if (!list) return;
    list.innerHTML = "";

    const pmDept = document.getElementById("pm-dept");
    const isViewOnly = pmDept ? pmDept.disabled : false;

    uploadedFiles.forEach(file => {
        const div = document.createElement("div");
        div.className = "file-item";

        let removeButton = "";
        if (!isViewOnly) {
            removeButton = `<button type="button" class="btn-remove-file" onclick="removeUploadedFile('${file.id}')">&times;</button>`;
        }

        div.innerHTML = `
            <span>${file.fileName}</span>
            ${removeButton}
        `;
        list.appendChild(div);
    });
}

window.removeUploadedFile = function (fileId) {
    uploadedFiles = uploadedFiles.filter(f => f.id !== fileId);
    renderPmFilesList();
};

function enablePmFormFields(isEnabled) {
    const fields = [
        "pm-dept", "pm-agent-name", "pm-agent-auth-detail", "pm-company-name", "pm-company-address", "pm-contact-number",
        "pm-contract-type", "pm-contract-no", "pm-contract-date", "pm-no-contract", "pm-nature-work", "pm-required-output",
        "pm-experience", "pm-competency-assess", "pm-eligibility", "pm-risks-involved", "pm-quality-req",
        "pm-duration", "pm-special-tool-needed", "pm-special-equip", "pm-equip-available", "pm-skill-training-req",
        "pm-special-skills", "pm-spares-provider", "pm-inspect-req", "pm-procedure-avail", "pm-inspect-rep-req",
        "pm-est-defective-prob", "pm-correction-plan-prepared", "pm-spare-parts-req",
        "pm-env-haz", "pm-env-waste", "pm-env-emissions", "pm-env-legal", "pm-env-ocps-followed", "pm-env-controls",
        "pm-num-workers", "pm-saf-insurance", "pm-saf-risk", "pm-saf-drawing", "pm-saf-briefing", "pm-saf-emergency",
        "pm-saf-height", "pm-saf-hot", "pm-saf-electrical", "pm-saf-confined", "pm-saf-isolated", "pm-saf-permit-provided",
        "pm-saf-conduct-briefed", "pm-saf-ppe"
    ];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.disabled = !isEnabled;
    });

    const draftBtn = document.getElementById("btn-pm-draft");
    const submitBtn = document.getElementById("btn-pm-submit");
    const editBtn = document.getElementById("btn-pm-edit");

    if (draftBtn) draftBtn.style.display = isEnabled ? "block" : "none";
    if (submitBtn) submitBtn.style.display = isEnabled ? "block" : "none";

    if (editBtn) {
        if (!isEnabled) {
            const editId = document.getElementById("pm-edit-id").value;
            const pm = state.purchaseManuals.find(p => p.id === editId);
            if (pm && (pm.status === "Draft" || pm.status === "Rejected")) {
                editBtn.style.display = "block";
            } else {
                editBtn.style.display = "none";
            }
        } else {
            editBtn.style.display = "none";
        }
    }

    const dropzone = document.querySelector(".attachment-dropzone");
    if (dropzone) {
        if (isEnabled) {
            dropzone.style.pointerEvents = "auto";
            dropzone.style.cursor = "pointer";
            dropzone.style.opacity = "1";
        } else {
            dropzone.style.pointerEvents = "none";
            dropzone.style.cursor = "default";
            dropzone.style.opacity = "0.6";
        }
    }

    // Refresh file list display to show/hide delete buttons based on the new isEnabled state
    renderPmFilesList();
}

function savePurchaseManual(e, status) {
    if (e) e.preventDefault();

    const dept = document.getElementById("pm-dept").value.trim();
    const agentName = document.getElementById("pm-agent-name").value.trim();
    const companyName = document.getElementById("pm-company-name").value.trim();
    const contactNumber = document.getElementById("pm-contact-number").value.trim();
    const numWorkersVal = document.getElementById("pm-num-workers").value;

    if (status === "Submitted") {
        if (!dept || !agentName || !companyName || !contactNumber || !numWorkersVal) {
            showToast("Required Fields Missing", "Please fill in all mandatory fields before submitting.", "warning");
            return;
        }
    }

    const editId = document.getElementById("pm-edit-id").value;
    let pmObj = {};

    if (editId) {
        const existingIdx = state.purchaseManuals.findIndex(pm => pm.id === editId);
        if (existingIdx !== -1) {
            pmObj = state.purchaseManuals[existingIdx];
        }
    } else {
        pmObj.id = "PM" + (1001 + state.purchaseManuals.length);
        pmObj.dateCreated = getLocalDateStr();
    }

    pmObj.dept = dept;
    pmObj.agentName = agentName;
    pmObj.agentAuthDetail = document.getElementById("pm-agent-auth-detail").value.trim();
    pmObj.companyName = companyName;
    pmObj.companyAddress = document.getElementById("pm-company-address").value.trim();
    pmObj.contactNumber = contactNumber;
    pmObj.contractType = document.getElementById("pm-contract-type").value;
    pmObj.contractNo = document.getElementById("pm-contract-no").value.trim();
    pmObj.contractDate = document.getElementById("pm-contract-date").value;
    pmObj.noContract = document.getElementById("pm-no-contract").value;

    pmObj.natureWork = document.getElementById("pm-nature-work").value.trim();
    pmObj.requiredOutput = document.getElementById("pm-required-output").value.trim();
    pmObj.experience = parseInt(document.getElementById("pm-experience").value) || 0;
    pmObj.competencyAssess = document.getElementById("pm-competency-assess").value.trim();
    pmObj.eligibility = document.getElementById("pm-eligibility").value;
    pmObj.risksInvolved = document.getElementById("pm-risks-involved").value.trim();
    pmObj.qualityReq = document.getElementById("pm-quality-req").value.trim();

    pmObj.duration = document.getElementById("pm-duration").value.trim();
    pmObj.specialToolNeeded = document.getElementById("pm-special-tool-needed").value;
    pmObj.specialEquip = document.getElementById("pm-special-equip").value.trim();
    pmObj.equipAvailable = document.getElementById("pm-equip-available").value.trim();
    pmObj.skillTrainingReq = document.getElementById("pm-skill-training-req").value;
    pmObj.specialSkills = document.getElementById("pm-special-skills").value.trim();
    pmObj.sparesProvider = document.getElementById("pm-spares-provider").value.trim();

    pmObj.inspectReq = document.getElementById("pm-inspect-req").value;
    pmObj.procedureAvail = document.getElementById("pm-procedure-avail").value;
    pmObj.inspectRepReq = document.getElementById("pm-inspect-rep-req").value;
    pmObj.estDefectiveProb = document.getElementById("pm-est-defective-prob").value;
    pmObj.correctionPlanPrepared = document.getElementById("pm-correction-plan-prepared").value;
    pmObj.sparePartsReq = document.getElementById("pm-spare-parts-req").value;

    pmObj.envHaz = document.getElementById("pm-env-haz").value;
    pmObj.envWaste = document.getElementById("pm-env-waste").value;
    pmObj.envEmissions = document.getElementById("pm-env-emissions").value;
    pmObj.envLegal = document.getElementById("pm-env-legal").value;
    pmObj.envOcpsFollowed = document.getElementById("pm-env-ocps-followed").value;
    pmObj.envControls = document.getElementById("pm-env-controls").value.trim();

    pmObj.numWorkers = parseInt(numWorkersVal) || 1;
    pmObj.safInsurance = document.getElementById("pm-saf-insurance").value;
    pmObj.safRisk = document.getElementById("pm-saf-risk").value;
    pmObj.safDrawing = document.getElementById("pm-saf-drawing").value;
    pmObj.safBriefing = document.getElementById("pm-saf-briefing").value;
    pmObj.safEmergency = document.getElementById("pm-saf-emergency").value;
    pmObj.safHeight = document.getElementById("pm-saf-height").value;
    pmObj.safHot = document.getElementById("pm-saf-hot").value;
    pmObj.safElectrical = document.getElementById("pm-saf-electrical").value;
    pmObj.safConfined = document.getElementById("pm-saf-confined").value;
    pmObj.safIsolated = document.getElementById("pm-saf-isolated").value;
    pmObj.safPermitProvided = document.getElementById("pm-saf-permit-provided").value;
    pmObj.safConductBriefed = document.getElementById("pm-saf-conduct-briefed").value;
    pmObj.safPpe = document.getElementById("pm-saf-ppe").value;

    pmObj.status = status;

    if (status === "Submitted") {
        pmObj.dateSubmitted = getLocalDateStr();
    }

    pmObj.attachments = [];
    uploadedFiles.forEach(file => {
        pmObj.attachments.push({ id: file.id, fileName: file.fileName });
        const attExistIdx = state.purchaseManualAttachments.findIndex(a => a.id === file.id);
        if (attExistIdx === -1) {
            state.purchaseManualAttachments.push({
                id: file.id,
                purchaseManualId: pmObj.id,
                fileName: file.fileName,
                fileData: file.fileData
            });
        }
    });

    if (!editId) {
        state.purchaseManuals.push(pmObj);
    }

    saveState();
    if (supabaseClient) {
        supabaseClient.from('purchase_manuals').upsert(mapPurchaseManualToDb(pmObj), { onConflict: 'manual_code' })
            .then(({ error }) => { if (error) console.error("PM cloud sync error:", error); });
    }
    updateWorkPermitMenuState();
    refreshAllDataViews();

    const toastTitle = status === "Draft" ?
        (state.currentLang === "ta" ? "வரைவு சேமிக்கப்பட்டது" : "Draft Saved") :
        (state.currentLang === "ta" ? "சமர்ப்பிக்கப்பட்டது" : "Manual Submitted");
    const toastMsg = status === "Draft" ?
        (state.currentLang === "ta" ? "கொள்முதல் கையேடு வரைவாக சேமிக்கப்பட்டது." : "Purchase manual saved as draft.") :
        (state.currentLang === "ta" ? "கொள்முதல் கையேடு மேலாளர் ஒப்புதலுக்கு சமர்ப்பிக்கப்பட்டது." : "Purchase manual submitted for manager approval.");

    showToast(toastTitle, toastMsg, "success");

    document.getElementById("pm-list-container").classList.remove("hidden");
    document.getElementById("pm-form-container").classList.add("hidden");
}

function renderPurchaseManuals() {
    const body = document.getElementById("pm-list-table-body");
    if (!body) return;
    body.innerHTML = "";

    if (state.purchaseManuals.length === 0) {
        body.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg>
                    <p>${state.currentLang === "ta" ? "கொள்முதல் கையேடுகள் எதுவும் இல்லை." : "No Purchase Manuals recorded."}</p>
                </td>
            </tr>
        `;
        return;
    }

    state.purchaseManuals.forEach(pm => {
        const tr = document.createElement("tr");
        let actionButtons = "";

        if (pm.status === "Draft") {
            actionButtons = `
                <button class="btn btn-secondary btn-sm" onclick="editPurchaseManual('${pm.id}')">${state.currentLang === "ta" ? "தொகு" : "Edit"}</button>
                <button class="btn btn-secondary btn-sm" style="color: var(--accent-danger);" onclick="deletePurchaseManual('${pm.id}')">${state.currentLang === "ta" ? "அழி" : "Delete"}</button>
            `;
        } else if (pm.status === "Submitted") {
            if (state.currentUser && state.currentUser.role === "Administrator") {
                actionButtons = `
                    <button class="btn btn-accent btn-sm" onclick="approvePurchaseManual('${pm.id}')">${state.currentLang === "ta" ? "அங்கீகரி" : "Approve"}</button>
                    <button class="btn btn-secondary btn-sm" style="color: var(--accent-danger);" onclick="rejectPurchaseManual('${pm.id}')">${state.currentLang === "ta" ? "நிராகரி" : "Reject"}</button>
                `;
            } else {
                actionButtons = `<span class="text-secondary text-xs">${state.currentLang === "ta" ? "ஒப்புதலுக்குக் காத்திருக்கிறது" : "Awaiting Approval"}</span>`;
            }
        } else {
            actionButtons = `<span class="text-secondary text-xs">${state.currentLang === "ta" ? "செயல்கள் இல்லை" : "No Actions"}</span>`;
        }

        const statusText = state.currentLang === "ta" ?
            (pm.status === "Draft" ? "வரைவு" : pm.status === "Submitted" ? "நிலுவையில்" : pm.status === "Approved" ? "அனுமதிக்கப்பட்டது" : "நிராகரிக்கப்பட்டது") :
            pm.status;

        tr.innerHTML = `
            <td><code>${pm.id}</code></td>
            <td>${pm.dept}</td>
            <td>${pm.agentName}</td>
            <td>${pm.companyName}</td>
            <td>${pm.contractType}</td>
            <td><span class="badge-status ${pm.status.toLowerCase()}">${statusText}</span></td>
            <td>
                <div class="flex gap-2">
                    <button class="btn btn-secondary btn-sm" onclick="viewPurchaseManualDetail('${pm.id}')">${state.currentLang === "ta" ? "காண்" : "View"}</button>
                    ${actionButtons}
                </div>
            </td>
        `;
        body.appendChild(tr);
    });
}

window.editPurchaseManual = function (pmId) {
    const pm = state.purchaseManuals.find(p => p.id === pmId);
    if (!pm) return;

    document.getElementById("pm-list-container").classList.add("hidden");
    document.getElementById("pm-form-container").classList.remove("hidden");

    document.getElementById("pm-edit-id").value = pm.id;
    document.getElementById("pm-form-title").innerText = (state.currentLang === "ta" ? "கொள்முதல் கையேட்டைத் தொகு" : "Edit Purchase Manual") + " - " + pm.id;

    const getYesNoVal = (val) => (val === true || val === "Yes") ? "Yes" : "No";

    document.getElementById("pm-dept").value = pm.dept;
    document.getElementById("pm-agent-name").value = pm.agentName;
    document.getElementById("pm-agent-auth-detail").value = pm.agentAuthDetail || "";
    document.getElementById("pm-company-name").value = pm.companyName;
    document.getElementById("pm-company-address").value = pm.companyAddress || "";
    document.getElementById("pm-contact-number").value = pm.contactNumber;
    document.getElementById("pm-contract-type").value = pm.contractType;
    document.getElementById("pm-contract-no").value = pm.contractNo || "";
    document.getElementById("pm-contract-date").value = pm.contractDate || "";
    document.getElementById("pm-no-contract").value = pm.noContract || "No";

    document.getElementById("pm-nature-work").value = pm.natureWork || "";
    document.getElementById("pm-required-output").value = pm.requiredOutput || "";
    document.getElementById("pm-experience").value = pm.experience || 0;
    document.getElementById("pm-competency-assess").value = pm.competencyAssess || "";
    document.getElementById("pm-eligibility").value = (pm.eligibility === "No" || pm.eligibility === "Yes") ? pm.eligibility : "Yes";
    document.getElementById("pm-risks-involved").value = pm.risksInvolved || "";
    document.getElementById("pm-quality-req").value = pm.qualityReq || "";

    document.getElementById("pm-duration").value = pm.duration || "";
    document.getElementById("pm-special-tool-needed").value = pm.specialToolNeeded || "No";
    document.getElementById("pm-special-equip").value = pm.specialEquip || "";
    document.getElementById("pm-equip-available").value = pm.equipAvailable || "";
    document.getElementById("pm-skill-training-req").value = pm.skillTrainingReq || "No";
    document.getElementById("pm-special-skills").value = pm.specialSkills || "";
    document.getElementById("pm-spares-provider").value = pm.sparesProvider || "";

    document.getElementById("pm-inspect-req").value = getYesNoVal(pm.inspectReq);
    document.getElementById("pm-procedure-avail").value = getYesNoVal(pm.procedureAvail);
    document.getElementById("pm-inspect-rep-req").value = getYesNoVal(pm.inspectRepReq);
    document.getElementById("pm-est-defective-prob").value = getYesNoVal(pm.estDefectiveProb);
    document.getElementById("pm-correction-plan-prepared").value = getYesNoVal(pm.correctionPlanPrepared);
    document.getElementById("pm-spare-parts-req").value = getYesNoVal(pm.sparePartsReq);

    document.getElementById("pm-env-haz").value = getYesNoVal(pm.envHaz);
    document.getElementById("pm-env-waste").value = getYesNoVal(pm.envWaste);
    document.getElementById("pm-env-emissions").value = getYesNoVal(pm.envEmissions);
    document.getElementById("pm-env-legal").value = getYesNoVal(pm.envLegal);
    document.getElementById("pm-env-ocps-followed").value = getYesNoVal(pm.envOcpsFollowed);

    // For legacy envControls which was boolean, handle it safely:
    if (typeof pm.envControls === "boolean") {
        document.getElementById("pm-env-controls").value = pm.envControls ? "Yes, control measures implemented." : "None";
    } else {
        document.getElementById("pm-env-controls").value = pm.envControls || "";
    }

    document.getElementById("pm-num-workers").value = pm.numWorkers || 1;
    document.getElementById("pm-saf-insurance").value = getYesNoVal(pm.safInsurance);
    document.getElementById("pm-saf-risk").value = getYesNoVal(pm.safRisk);
    document.getElementById("pm-saf-drawing").value = getYesNoVal(pm.safDrawing);
    document.getElementById("pm-saf-briefing").value = getYesNoVal(pm.safBriefing);
    document.getElementById("pm-saf-emergency").value = getYesNoVal(pm.safEmergency);
    document.getElementById("pm-saf-height").value = getYesNoVal(pm.safHeight);
    document.getElementById("pm-saf-hot").value = getYesNoVal(pm.safHot);
    document.getElementById("pm-saf-electrical").value = getYesNoVal(pm.safElectrical);
    document.getElementById("pm-saf-confined").value = getYesNoVal(pm.safConfined);
    document.getElementById("pm-saf-isolated").value = getYesNoVal(pm.safIsolated);
    document.getElementById("pm-saf-permit-provided").value = getYesNoVal(pm.safPermitProvided);
    document.getElementById("pm-saf-conduct-briefed").value = getYesNoVal(pm.safConductBriefed);
    document.getElementById("pm-saf-ppe").value = getYesNoVal(pm.safPpe);

    enablePmFormFields(true);

    uploadedFiles = [];
    const manualAttachments = state.purchaseManualAttachments.filter(a => a.purchaseManualId === pm.id);
    manualAttachments.forEach(att => {
        uploadedFiles.push({ id: att.id, fileName: att.fileName, fileData: att.fileData });
    });
    renderPmFilesList();
};

window.viewPurchaseManualDetail = function (pmId) {
    editPurchaseManual(pmId);
    enablePmFormFields(false);
    document.getElementById("pm-form-title").innerText = (state.currentLang === "ta" ? "கொள்முதல் கையேடு விவரங்கள்" : "Purchase Manual Details") + " - " + pmId;
};

window.deletePurchaseManual = function (pmId) {
    if (confirm(state.currentLang === "ta" ? "இந்த கொள்முதல் கையேட்டை நிச்சயமாக நீக்க விரும்புகிறீர்களா?" : "Are you sure you want to delete this Purchase Manual?")) {
        state.purchaseManuals = state.purchaseManuals.filter(p => p.id !== pmId);
        state.purchaseManualAttachments = state.purchaseManualAttachments.filter(a => a.purchaseManualId !== pmId);
        saveState();
        if (supabaseClient) {
            supabaseClient.from('purchase_manuals').delete().eq('manual_code', pmId)
                .then(({ error }) => { if (error) console.error("PM cloud delete error:", error); });
        }
        updateWorkPermitMenuState();
        refreshAllDataViews();
        showToast(
            state.currentLang === "ta" ? "நீக்கப்பட்டது" : "Deleted",
            state.currentLang === "ta" ? "கொள்முதல் கையேடு வெற்றிகரமாக நீக்கப்பட்டது." : "Purchase manual successfully deleted.",
            "info"
        );
    }
};

window.approvePurchaseManual = function (pmId) {
    const idx = state.purchaseManuals.findIndex(p => p.id === pmId);
    if (idx === -1) return;
    state.purchaseManuals[idx].status = "Approved";
    state.purchaseManuals[idx].dateApproved = getLocalDateStr();
    state.purchaseManualApprovals.push({
        id: "APP" + Date.now(),
        purchaseManualId: pmId,
        approverName: state.currentUser ? state.currentUser.name : "Manager",
        approvalDate: getLocalDateStr(),
        decision: "Approved",
        comments: "Approved for work permit application."
    });
    saveState();
    if (supabaseClient) {
        supabaseClient.from('purchase_manuals').update({ status: 'Approved', date_approved: getLocalDateStr() }).eq('manual_code', pmId)
            .then(({ error }) => { if (error) console.error("PM cloud approval sync error:", error); });
    }
    updateWorkPermitMenuState();
    refreshAllDataViews();
    showToast(
        state.currentLang === "ta" ? "அங்கீகரிக்கப்பட்டது" : "Approved",
        state.currentLang === "ta" ? `கொள்முதல் கையேடு ${pmId} அங்கீகரிக்கப்பட்டது.` : `Purchase manual ${pmId} has been approved. Work Permit module is now enabled.`,
        "success"
    );
};

window.rejectPurchaseManual = function (pmId) {
    const comments = prompt(state.currentLang === "ta" ? "நிராகரிப்புக்கான காரணம்:" : "Reason for rejection:");
    if (comments === null) return;
    const idx = state.purchaseManuals.findIndex(p => p.id === pmId);
    if (idx === -1) return;
    state.purchaseManuals[idx].status = "Rejected";
    state.purchaseManualApprovals.push({
        id: "APP" + Date.now(),
        purchaseManualId: pmId,
        approverName: state.currentUser ? state.currentUser.name : "Manager",
        approvalDate: getLocalDateStr(),
        decision: "Rejected",
        comments: comments || "Rejected during review."
    });
    saveState();
    if (supabaseClient) {
        supabaseClient.from('purchase_manuals').update({ status: 'Rejected' }).eq('manual_code', pmId)
            .then(({ error }) => { if (error) console.error("PM cloud rejection sync error:", error); });
    }
    updateWorkPermitMenuState();
    refreshAllDataViews();
    showToast(
        state.currentLang === "ta" ? "நிராகரிக்கப்பட்டது" : "Rejected",
        state.currentLang === "ta" ? `கொள்முதல் கையேடு ${pmId} நிராகரிக்கப்பட்டது.` : `Purchase manual ${pmId} has been rejected.`,
        "danger"
    );
};
window.approveSafetyPermit = function (wpId) {
    const idx = state.workPermits.findIndex(w => w.id === wpId);
    if (idx === -1) return;

    state.workPermits[idx].status = "Pending Final Authorization";
    state.workPermits[idx].safetyOfficerApproved = true;
    saveState();
    if (supabaseClient) {
        supabaseClient.from('work_permits').update({ status: 'Pending Final Authorization', safety_officer_approved: true }).eq('permit_code', wpId)
            .then(({ error }) => { if (error) console.error("Work permit safety approval cloud sync error:", error); });
    }
    refreshAllDataViews();

    showToast(
        state.currentLang === "ta" ? "பாதுகாப்பு அங்கீகரிக்கப்பட்டது" : "Safety Approved",
        state.currentLang === "ta" ? `வேலை அனுமதிச்சீட்டு ${wpId} பாதுகாப்பு அதிகாரி ஒப்புதல் அளித்தார்.` : `Work permit ${wpId} safety checks approved. Awaiting final authorization.`,
        "success"
    );
};

window.authorizePermit = function (wpId) {
    const idx = state.workPermits.findIndex(w => w.id === wpId);
    if (idx === -1) return;

    state.workPermits[idx].status = "Approved";
    state.workPermits[idx].finalAuthorized = true;
    saveState();
    if (supabaseClient) {
        supabaseClient.from('work_permits').update({ status: 'Approved', final_authorized: true }).eq('permit_code', wpId)
            .then(({ error }) => { if (error) console.error("Work permit authorization cloud sync error:", error); });
    }
    refreshAllDataViews();

    showToast(
        state.currentLang === "ta" ? "முழுமையாக அங்கீகரிக்கப்பட்டது" : "Fully Authorized",
        state.currentLang === "ta" ? `வேலை அனுமதிச்சீட்டு ${wpId} இறுதி அனுமதி வழங்கப்பட்டது.` : `Work permit ${wpId} is now active and fully authorized.`,
        "success"
    );
};

window.viewWorkPermitDetail = function (wpId) {
    const wp = state.workPermits.find(w => w.id === wpId);
    if (!wp) return;

    const pm = state.purchaseManuals.find(p => p.id === wp.purchaseManualId) || {};

    // Set content in the preview modal
    document.getElementById("wp-preview-id").innerText = wp.id;
    document.getElementById("wp-preview-pm-id").innerText = wp.purchaseManualId;
    document.getElementById("wp-preview-contractor").innerText = wp.companyEntity || pm.companyName || "N/A";
    document.getElementById("wp-preview-location").innerText = wp.locationSite || "N/A";
    document.getElementById("wp-preview-date").innerText = wp.conductedOn || "N/A";

    document.getElementById("wp-preview-start-date").innerText = wp.startDate;
    document.getElementById("wp-preview-end-date").innerText = wp.endDate;
    document.getElementById("wp-preview-start-time").innerText = wp.startTime || "N/A";
    document.getElementById("wp-preview-end-time").innerText = wp.endTime || "N/A";

    document.getElementById("wp-preview-risk-type").innerText = wp.highRiskWork || "General";
    document.getElementById("wp-preview-desc").innerText = wp.description || wp.workActivity || "N/A";

    // Safety Protocols Checklist
    document.getElementById("wp-preview-check-risk").innerText = wp.decRiskReviewed || "N/A";
    document.getElementById("wp-preview-check-controls").innerText = wp.decControlsAdequate || "N/A";
    document.getElementById("wp-preview-check-coord").innerText = wp.decCompetentCoord || "N/A";

    // Safety & Security Clearances
    document.getElementById("wp-preview-safety-approved").innerText = wp.safetyOfficerApproved ? "Approved (Yes)" : "Pending";
    document.getElementById("wp-preview-final-auth").innerText = wp.finalAuthorized ? "Authorized (Yes)" : "Pending";

    const statusEl = document.getElementById("wp-preview-status");
    statusEl.innerText = wp.status;

    // Set status styling class
    if (wp.status === "Approved") {
        statusEl.style.color = "var(--accent-success)";
    } else if (wp.status.includes("Pending")) {
        statusEl.style.color = "var(--accent-warning)";
    } else {
        statusEl.style.color = "var(--accent-danger)";
    }

    // Signatures
    document.getElementById("wp-preview-sig-supervisor").innerText = wp.decSupervisorSig || "N/A";
    document.getElementById("wp-preview-sig-contractor").innerText = wp.engContractorSig || "N/A";
    document.getElementById("wp-preview-sig-authorizer").innerText = wp.authPersonSig || (wp.finalAuthorized ? "Authorized Admin" : "Awaiting Authorization");

    // Open Modal
    const modal = document.getElementById("modal-work-permit-detail");
    if (modal) {
        modal.classList.add("active");
    }
};



// ==========================================================================
// WORK PERMIT CONTROLLERS
// ==========================================================================
function populateApprovedPMDropdown() {
    const select = document.getElementById("wp-pm-id");
    if (!select) return;
    select.innerHTML = `<option value="">${state.currentLang === "ta" ? "-- அனுமதிக்கப்பட்ட கொள்முதல் கையேட்டைத் தேர்ந்தெடுக்கவும் --" : "-- Choose Approved Purchase Manual --"}</option>`;

    const approvedPMs = state.purchaseManuals.filter(pm => pm.status === "Approved");
    approvedPMs.forEach(pm => {
        const opt = document.createElement("option");
        opt.value = pm.id;
        opt.innerText = `${pm.id} - ${pm.agentName} (${pm.companyName}) [${pm.dept}]`;
        select.appendChild(opt);
    });
}

function handleWorkPermitSubmit(e) {
    if (e) e.preventDefault();

    const pmId = document.getElementById("wp-pm-id").value;
    const repName = document.getElementById("wp-rep-name").value.trim();
    const startDate = document.getElementById("wp-start-date").value;
    const endDate = document.getElementById("wp-end-date").value;
    const description = document.getElementById("wp-description").value.trim();
    const chkStandards = document.getElementById("wp-chk-standards").checked;

    const companyEntity = document.getElementById("wp-company-entity").value.trim();
    const locationSite = document.getElementById("wp-location-site").value.trim();
    const conductedOn = document.getElementById("wp-conducted-on").value;
    const workActivity = document.getElementById("wp-work-activity").value.trim();
    const highRiskWork = document.getElementById("wp-high-risk-work").value;
    const startTime = document.getElementById("wp-start-time").value;
    const endTime = document.getElementById("wp-end-time").value;

    const decRiskReviewed = document.getElementById("wp-dec-risk-reviewed").value;
    const decControlsAdequate = document.getElementById("wp-dec-controls-adequate").value;
    const decCompetentCoord = document.getElementById("wp-dec-competent-coord").value;
    const decImplementControls = document.getElementById("wp-dec-implement-controls").value;
    const decWorkersInformed = document.getElementById("wp-dec-workers-informed").value;
    const decMonitorHazards = document.getElementById("wp-dec-monitor-hazards").value;
    const decReqApproval = document.getElementById("wp-dec-req-approval").value;
    const decSupervisorSig = document.getElementById("wp-dec-supervisor-sig").value.trim();

    const engReviewedDocs = document.getElementById("wp-eng-reviewed-docs").value;
    const engMonitorMethods = document.getElementById("wp-eng-monitor-methods").value;
    const engInformedPersons = document.getElementById("wp-eng-informed-persons").value;
    const engContractorSig = document.getElementById("wp-eng-contractor-sig").value.trim();

    const authReviewedDocs = document.getElementById("wp-auth-reviewed-docs").value;
    const authRegistered = document.getElementById("wp-auth-registered").value;
    const authPersonSig = document.getElementById("wp-auth-person-sig").value.trim();

    if (!pmId || !repName || !startDate || !endDate || !chkStandards || !companyEntity || !locationSite || !conductedOn || !startTime || !endTime || !decSupervisorSig || !engContractorSig || !authPersonSig) {
        showToast("Required Fields Missing", "Please fill in all required fields and signatures, and accept safety terms.", "warning");
        return;
    }

    const wpObj = {
        id: "WP" + (20260000 + state.workPermits.length + 1),
        purchaseManualId: pmId,
        companyEntity: companyEntity,
        locationSite: locationSite,
        conductedOn: conductedOn,
        workActivity: workActivity,
        highRiskWork: highRiskWork,
        startTime: startTime,
        endTime: endTime,
        repName: repName,
        startDate: startDate,
        endDate: endDate,
        description: description,
        chkStandards: chkStandards,

        decRiskReviewed: decRiskReviewed,
        decControlsAdequate: decControlsAdequate,
        decCompetentCoord: decCompetentCoord,
        decImplementControls: decImplementControls,
        decWorkersInformed: decWorkersInformed,
        decMonitorHazards: decMonitorHazards,
        decReqApproval: decReqApproval,
        decSupervisorSig: decSupervisorSig,

        engReviewedDocs: engReviewedDocs,
        engMonitorMethods: engMonitorMethods,
        engInformedPersons: engInformedPersons,
        engContractorSig: engContractorSig,

        authReviewedDocs: authReviewedDocs,
        authRegistered: authRegistered,
        authPersonSig: authPersonSig,

        status: "Pending Safety Officer Approval",
        safetyOfficerApproved: false,
        finalAuthorized: false,
        dateCreated: getLocalDateStr()
    };

    state.workPermits.push(wpObj);
    saveState();
    if (supabaseClient) {
        supabaseClient.from('work_permits').upsert(mapWorkPermitToDb(wpObj), { onConflict: 'permit_code' })
            .then(({ error }) => { if (error) console.error("Work permit submit cloud sync error:", error); });
    }
    refreshAllDataViews();

    showToast(
        state.currentLang === "ta" ? "அனுமதிச்சீட்டு சமர்ப்பிக்கப்பட்டது" : "Work Permit Submitted",
        state.currentLang === "ta" ? "வேலை அனுமதிச்சீட்டு விண்ணப்பம் சமர்ப்பிக்கப்பட்டு பாதுகாப்பு அதிகாரி ஒப்புதலுக்கு அனுப்பப்பட்டது." : "Work permit application submitted. Pending Safety Officer approval.",
        "success"
    );

    document.getElementById("wp-list-container").classList.remove("hidden");
    document.getElementById("wp-form-container").classList.add("hidden");
    document.getElementById("work-permit-form").reset();
}

function renderWorkPermits() {
    const body = document.getElementById("wp-list-table-body");
    if (!body) return;
    body.innerHTML = "";

    if (state.workPermits.length === 0) {
        body.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg>
                    <p>${state.currentLang === "ta" ? "அனுமதிச்சீட்டுகள் எதுவும் இல்லை." : "No Work Permits recorded."}</p>
                </td>
            </tr>
        `;
        return;
    }

    state.workPermits.forEach(wp => {
        const pm = state.purchaseManuals.find(p => p.id === wp.purchaseManualId) || {};
        const tr = document.createElement("tr");
        let actionButtons = "";

        if (wp.status === "Pending Safety Officer Approval") {
            if (state.currentUser && state.currentUser.role === "Administrator") {
                actionButtons = `<button class="btn btn-accent btn-sm" onclick="approveSafetyPermit('${wp.id}')">${state.currentLang === "ta" ? "பாதுகாப்பு ஒப்புதல்" : "Safety Approve"}</button>`;
            } else {
                actionButtons = `<span class="text-secondary text-xs">${state.currentLang === "ta" ? "பாதுகாப்பு ஒப்புதலுக்கு உள்ளது" : "Pending Safety Approval"}</span>`;
            }
        } else if (wp.status === "Pending Final Authorization") {
            if (state.currentUser && state.currentUser.role === "Administrator") {
                actionButtons = `<button class="btn btn-primary btn-sm" onclick="authorizePermit('${wp.id}')">${state.currentLang === "ta" ? "இறுதி அனுமதி" : "Authorize Final"}</button>`;
            } else {
                actionButtons = `<span class="text-secondary text-xs">${state.currentLang === "ta" ? "இறுதி அனுமதிக்காக காத்திருக்கிறது" : "Pending Final Auth"}</span>`;
            }
        } else {
            actionButtons = `<span class="text-secondary text-xs">${state.currentLang === "ta" ? "செயல்கள் இல்லை" : "Authorized"}</span>`;
        }

        const statusText = state.currentLang === "ta" ?
            (wp.status === "Approved" ? "அங்கீகரிக்கப்பட்டது" : wp.status === "Rejected" ? "நிராகரிக்கப்பட்டது" : wp.status === "Pending Safety Officer Approval" ? "பாதுகாப்பு நிலுவையில்" : "இறுதி அனுமதி நிலுவையில்") :
            wp.status;

        tr.innerHTML = `
             <td><code>${wp.id}</code></td>
             <td><code>${wp.purchaseManualId}</code></td>
             <td>${wp.repName}</td>
             <td>${pm.companyName || "Unknown"}</td>
             <td>${wp.startDate} to ${wp.endDate}</td>
             <td><span class="badge-status ${wp.status.toLowerCase().replace(/ /g, "-")}">${statusText}</span></td>
             <td>
                 <div class="flex gap-2">
                     <button class="btn btn-secondary btn-sm" onclick="viewWorkPermitDetail('${wp.id}')">${state.currentLang === "ta" ? "காண்" : "View"}</button>
                     ${actionButtons}
                 </div>
             </td>
        `;
        body.appendChild(tr);
    });
}


// ==========================================================================
// DASHBOARD PM METRICS Recalculators
// ==========================================================================
function renderPMDashboardStats() {
    const draftCount = state.purchaseManuals.filter(pm => pm.status === "Draft").length;
    const pendingCount = state.purchaseManuals.filter(pm => pm.status === "Submitted").length;
    const approvedCount = state.purchaseManuals.filter(pm => pm.status === "Approved").length;
    const rejectedCount = state.purchaseManuals.filter(pm => pm.status === "Rejected").length;
    const activeWpCount = state.workPermits.filter(wp => wp.status === "Approved").length;

    const elDraft = document.getElementById("stat-pm-draft");
    const elPending = document.getElementById("stat-pm-pending");
    const elApproved = document.getElementById("stat-pm-approved");
    const elRejected = document.getElementById("stat-pm-rejected");
    const elActivePermits = document.getElementById("stat-active-permits");

    if (elDraft) elDraft.innerText = draftCount;
    if (elPending) elPending.innerText = pendingCount;
    if (elApproved) elApproved.innerText = approvedCount;
    if (elRejected) elRejected.innerText = rejectedCount;
    if (elActivePermits) elActivePermits.innerText = activeWpCount;
}

// ==========================================================================
// INTERACTIVE ANALYTICS CHARTS (CHART.JS)
// ==========================================================================
let chartsInstance = {};

function renderDashboardCharts() {
    if (typeof Chart === 'undefined') return;

    // 1. Visitor Volume Chart (7 Days line trend)
    const ctxVolume = document.getElementById("chart-visitor-volume");
    if (ctxVolume) {
        if (chartsInstance.volume) chartsInstance.volume.destroy();

        const labels = [];
        const data = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split("T")[0];
            labels.push(d.toLocaleDateString([], { weekday: 'short', day: 'numeric' }));

            const count = state.visitors.filter(v => v.visitDate === dateStr).length;
            data.push(count);
        }

        chartsInstance.volume = new Chart(ctxVolume, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Daily Visitors',
                    data: data,
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    tension: 0.3,
                    fill: true,
                    borderWidth: 2.5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
            }
        });
    }

    // 2. Department-wise Visitor Distribution (Bar chart)
    const ctxDept = document.getElementById("chart-dept-visitors");
    if (ctxDept) {
        if (chartsInstance.dept) chartsInstance.dept.destroy();

        const depts = {};
        state.visitors.forEach(v => {
            const dept = v.hostDept || "Other";
            depts[dept] = (depts[dept] || 0) + 1;
        });

        chartsInstance.dept = new Chart(ctxDept, {
            type: 'bar',
            data: {
                labels: Object.keys(depts),
                datasets: [{
                    label: 'Visitors',
                    data: Object.values(depts),
                    backgroundColor: '#3b82f6',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
            }
        });
    }

    // 3. Visitor Purpose Categories (Doughnut chart)
    const ctxCategories = document.getElementById("chart-visitor-categories");
    if (ctxCategories) {
        if (chartsInstance.categories) chartsInstance.categories.destroy();

        const purposes = {};
        state.visitors.forEach(v => {
            purposes[v.purpose || "Other"] = (purposes[v.purpose || "Other"] || 0) + 1;
        });

        chartsInstance.categories = new Chart(ctxCategories, {
            type: 'doughnut',
            data: {
                labels: Object.keys(purposes),
                datasets: [{
                    data: Object.values(purposes),
                    backgroundColor: ['#2563eb', '#10b981', '#fbbf24', '#06b6d4', '#a855f7', '#64748b']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'right' } }
            }
        });
    }

    // 4. Top Visiting Guest Companies (Horizontal bar chart)
    const ctxCompanies = document.getElementById("chart-top-companies");
    if (ctxCompanies) {
        if (chartsInstance.companies) chartsInstance.companies.destroy();

        const companies = {};
        state.visitors.forEach(v => {
            if (v.company) {
                companies[v.company] = (companies[v.company] || 0) + 1;
            }
        });

        const sorted = Object.entries(companies)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        chartsInstance.companies = new Chart(ctxCompanies, {
            type: 'bar',
            data: {
                labels: sorted.map(x => x[0]),
                datasets: [{
                    label: 'Visits',
                    data: sorted.map(x => x[1]),
                    backgroundColor: '#10b981',
                    borderRadius: 4
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { x: { beginAtZero: true, ticks: { stepSize: 1 } } }
            }
        });
    }
}

// ==========================================================================
// SYSTEM AUDIT TRAIL LOGGING
// ==========================================================================
function addAuditLog(operation, category, details, status = "Success") {
    if (!state.auditLogs) state.auditLogs = [];
    const operator = state.currentUser ? state.currentUser.name : "System";

    state.auditLogs.unshift({
        timestamp: new Date().toLocaleString(),
        operation,
        category,
        operator,
        details,
        status
    });

    if (state.auditLogs.length > 100) state.auditLogs.pop();
    saveState();
    if (supabaseClient) {
        supabaseClient.from('audit_logs').insert({
            action: operation,
            actor: operator,
            details: `${category} - ${details} (${status})`
        }).then(({ error }) => { if (error) console.error("Audit log cloud sync error:", error); });
    }
    renderAuditLogsTable();
}

function renderAuditLogsTable() {
    const tbody = document.getElementById("admin-audit-logs-body");
    if (!tbody) return;
    tbody.innerHTML = "";

    if (!state.auditLogs || state.auditLogs.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="empty-state">No audit trail records found.</td></tr>`;
        return;
    }

    state.auditLogs.forEach(log => {
        const tr = document.createElement("tr");
        let badgeClass = "inside";
        if (log.category === "Security") badgeClass = "denied";
        if (log.category === "Host Approval") badgeClass = "approved";
        if (log.category === "Communications") badgeClass = "expected";

        tr.innerHTML = `
            <td><code>${log.timestamp}</code></td>
            <td><strong>${log.operation}</strong></td>
            <td><span class="badge-status ${badgeClass}" style="font-size: 0.7rem; padding: 2px 6px;">${log.category}</span></td>
            <td>${log.operator}</td>
            <td>${log.details}</td>
            <td><span style="color: ${log.status === 'Success' ? 'var(--accent-emerald)' : 'var(--accent-danger)'}; font-weight: 600;">${log.status}</span></td>
        `;
        tbody.appendChild(tr);
    });
}


/* ==========================================================================
   20. Gmail Host Approval Email ? Opens Gmail compose to host email ID
   ========================================================================== */
function sendHostApprovalGmail(visitor, hostEmployee) {
    try {
        var hostEmail = "manojkumarnj01@gmail.com";

        var visitorTime = visitor.visitDate
            ? (visitor.visitDate + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
            : new Date().toLocaleString();

        var approveUrl = "";
        var rejectUrl = "";

        if (state.settings?.gcpBackendUrl) {
            approveUrl = state.settings.gcpBackendUrl + '/api/visitors/approve?token=' + encodeURIComponent(visitor.approveToken || '');
            rejectUrl = state.settings.gcpBackendUrl + '/api/visitors/reject?token=' + encodeURIComponent(visitor.rejectToken || '');
        } else {
            var baseUrl = (state.settings?.publicWebUrl && state.settings.publicWebUrl.trim() !== "")
                ? state.settings.publicWebUrl.trim()
                : (window.location.protocol + '//' + window.location.host + window.location.pathname);

            var connector = baseUrl.includes('?') ? '&' : '?';
            approveUrl = baseUrl + connector + 'va_action=approve&va_id=' + encodeURIComponent(visitor.id);
            rejectUrl = baseUrl + connector + 'va_action=reject&va_id=' + encodeURIComponent(visitor.id);
        }

        var subject = '[VMS] Visitor Approval Request - ' + visitor.name + ' (' + visitor.id + ')';

        var bodyLines = [
            'Dear ' + visitor.hostName + ',',
            '',
            'A visitor has arrived at Barani Hydraulics reception and is waiting for your approval.',
            '',
            '-------------------------------------',
            'VISITOR DETAILS',
            '-------------------------------------',
            'Name        : ' + visitor.name,
            'Company     : ' + (visitor.company || 'Independent'),
            'Mobile      : ' + visitor.phone,
            'Purpose     : ' + (visitor.purpose || 'Meeting'),
            'Department  : ' + visitor.hostDept,
            'Date & Time : ' + visitorTime,
            'Pass ID     : ' + visitor.id,
            '-------------------------------------',
            '',
            'ACTION REQUIRED ? Please click one of the links below:',
            '',
            '>>> APPROVE VISIT (Click here to approve):',
            approveUrl,
            '',
            '>>> REJECT VISIT (Click here to reject):',
            rejectUrl,
            '',
            'Note: Clicking either link will open the VMS application and execute your decision automatically.',
            'You can also approve or reject directly in the VMS Corporate Email panel.',
            '',
            'This is an automated message from Barani Hydraulics Visitor Management System.',
            'Please do not reply to this email.'
        ];
        var body = bodyLines.join('\n');

        var gmailComposeUrl = 'https://mail.google.com/mail/?view=cm'
            + '&to=' + encodeURIComponent(hostEmail)
            + '&su=' + encodeURIComponent(subject)
            + '&body=' + encodeURIComponent(body);

        // Open Gmail compose for the actual email
        window.open(gmailComposeUrl, '_blank', 'noopener,noreferrer');

        showToast('Email Sent to Host', 'Approval request sent to ' + visitor.hostName + ' at ' + hostEmail + '. Use the email panel to approve or reject.', 'info');

        logNotificationSimulator('Host Approval Email', 'Email', hostEmail, '[EMAIL SENT] To: ' + hostEmail + ' | Subject: ' + subject);

        addAuditLog('Host Approval Email Sent', 'Communications',
            'Approval email sent to ' + hostEmail + ' for visitor ' + visitor.name + ' (' + visitor.id + ')');

    } catch (err) {
        console.error('[VMS] sendHostApprovalGmail error:', err);
    }
}

/* ==========================================================================
   21. Auto WhatsApp Pass Image Dispatch ? Captures pass card as PNG & opens WA
   ========================================================================== */
async function autoSendPassToWhatsApp(visitor, isManual = false, preOpenedWindow = null) {
    if (!visitor) return;

    // Check if auto-send is disabled (only for automatic trigger, manual bypasses this check)
    if (!isManual && state.settings && state.settings.autoSendWhatsApp === false) {
        console.log("[VMS WhatsApp] Auto-send WhatsApp is disabled in settings.");
        if (preOpenedWindow) preOpenedWindow.close();
        return;
    }

    try {
        var badgeEl = document.getElementById('printable-badge');
        if (!badgeEl) {
            console.warn('[VMS] printable-badge element not found for WhatsApp capture.');
            if (preOpenedWindow) preOpenedWindow.close();
            return;
        }

        showToast('Preparing Pass', 'Capturing visitor pass image for WhatsApp...', 'info');

        var canvas = await html2canvas(badgeEl, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff'
        });

        var imgData = canvas.toDataURL('image/png');
        var publicUrl = "";

        // Check selected WhatsApp Method
        var method = state.settings?.waMethod || "url-local";

        // If background API or simulation, close the pre-opened window immediately
        if (preOpenedWindow && (method === "meta" || method === "sim")) {
            preOpenedWindow.close();
            preOpenedWindow = null;
        }

        // Upload to Supabase if credentials are provided and method needs a cloud image
        if (supabaseClient && (method === "meta" || method === "url-cloud")) {
            showToast('Cloud Upload', 'Uploading visitor pass to cloud storage...', 'info');
            var blob = dataURLtoBlob(imgData);
            if (blob) {
                var fileName = 'pass-' + visitor.id + '.png';
                var bucketName = state.settings.supabaseBucket || 'visitor-passes';

                var { data, error } = await supabaseClient.storage
                    .from(bucketName)
                    .upload(fileName, blob, {
                        cacheControl: '3600',
                        upsert: true
                    });

                if (error) {
                    console.error('[VMS Cloud] Supabase Storage upload error:', error);
                    showToast('Cloud Upload Failed', 'Failed to host pass in cloud. Falling back to local send.', 'warning');
                } else {
                    var { data: { publicUrl: url } } = supabaseClient.storage
                        .from(bucketName)
                        .getPublicUrl(fileName);
                    publicUrl = url;
                    showToast('Cloud Uploaded', 'Visitor pass image hosted on cloud.', 'success');
                }
            }
        }

        var cleanPhone = (visitor.phone || '').replace(/[^0-9]/g, '');
        if (!cleanPhone || cleanPhone.length < 10) {
            console.error('[VMS WhatsApp] Invalid phone number. Length must be at least 10 digits:', visitor.phone);
            showToast('WhatsApp Failed', 'Visitor phone number is invalid.', 'danger');
            addAuditLog('WhatsApp Send Failed', 'Communications', `Invalid visitor phone number: ${visitor.phone}`);
            if (preOpenedWindow) preOpenedWindow.close();
            return;
        }
        if (cleanPhone.length === 10) { cleanPhone = '91' + cleanPhone; }

        var now = new Date();
        var timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        var statusText = visitor.status === "Pending" ? "Your visit request is *PENDING HOST APPROVAL*." : "Your visit has been *APPROVED*.";
        var entryTimeText = visitor.checkIn ? new Date(visitor.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : timeStr;

        var dateFormatted = visitor.visitDate || new Date().toLocaleDateString('en-US');

        var waLines = [
            '*BARANI HYDRAULICS*',
            '*VISITOR PASS*',
            '',
            statusText,
            '',
            '*Visitor ID:* ' + visitor.id,
            '*Name:* ' + visitor.name,
            '*Company:* ' + (visitor.company || 'Independent'),
            '*Host:* ' + visitor.hostName,
            '*Department:* ' + (visitor.hostDept || 'General'),
            '*Purpose:* ' + (visitor.purpose || 'Meeting'),
            '*Date:* ' + dateFormatted,
            '*Entry:* ' + entryTimeText,
            '*Exit:* ' + (visitor.expectedExit || '06:00 PM'),
            '',
            '*Security Instructions:*',
            'Please display this pass at all times. Photography is strictly prohibited. Escort required in shop floor.',
            '',
            '*Emergency Contact:* +91 422 2636222',
            ''
        ];

        if (publicUrl) {
            waLines.push('*Digital Pass Image:* ' + publicUrl);
            waLines.push('Please show this digital QR pass at the security gate.');
        } else {
            waLines.push('Your visitor pass image has been prepared.');
            waLines.push('Please open the pass attachment and show this QR pass at the security gate.');
        }

        waLines.push('');
        waLines.push('_Barani Hydraulics VMS_');
        var waMessage = waLines.join('\n');

        // Execute Dispatch based on method
        if (method === "meta" && state.settings.waToken && state.settings.waPhoneId && publicUrl) {
            // Background Meta Cloud API call
            showToast('Sending WhatsApp', 'Dispatching via Meta WhatsApp Business Cloud API...', 'info');

            var token = state.settings.waToken;
            var phoneId = state.settings.waPhoneId;

            var response = await fetch('https://graph.facebook.com/v20.0/' + phoneId + '/messages', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messaging_product: "whatsapp",
                    recipient_type: "individual",
                    to: cleanPhone,
                    type: "image",
                    image: {
                        link: publicUrl
                    }
                })
            });

            var resData = await response.json();
            if (response.ok) {
                showToast('WhatsApp Sent', 'Pass image sent directly to visitor WhatsApp!', 'success');
                logNotificationSimulator(
                    'WhatsApp API Sent',
                    'WhatsApp',
                    visitor.phone,
                    '[API SUCCESS] Pass image sent: "' + waMessage.replace(/\n/g, ' ') + '"'
                );
                addAuditLog('WhatsApp API Send Success', 'Communications', 'Dispatched pass image to ' + visitor.name + ' via WhatsApp Cloud API');
            } else {
                console.error('[VMS WhatsApp] Meta API error:', resData);
                var errMsg = resData.error?.message || "Unknown error";
                showToast('API Send Failed', errMsg + '. Redirecting to WhatsApp Web...', 'warning');

                // Fallback to URL Web Redirect
                var waUrl = 'https://api.whatsapp.com/send?phone=' + cleanPhone + '&text=' + encodeURIComponent(waMessage);
                if (preOpenedWindow) {
                    preOpenedWindow.location.href = waUrl;
                } else {
                    window.open(waUrl, '_blank', 'noopener,noreferrer');
                }
            }

        } else if (method === "url-cloud" && publicUrl) {
            // URL Redirect with Cloud link
            var waUrl = 'https://api.whatsapp.com/send?phone=' + cleanPhone + '&text=' + encodeURIComponent(waMessage);
            if (preOpenedWindow) {
                preOpenedWindow.location.href = waUrl;
            } else {
                window.open(waUrl, '_blank', 'noopener,noreferrer');
            }

            showToast('WhatsApp Web Opened', 'Opening WhatsApp Web. The message contains the pass image link.', 'success');
            logNotificationSimulator(
                'WhatsApp Web (Cloud Link)',
                'WhatsApp',
                visitor.phone,
                waMessage
            );
            addAuditLog('WhatsApp Web Redirect', 'Communications', 'Opened WhatsApp Web redirect with cloud link for ' + visitor.name);

        } else if (method === "sim") {
            // Simulator Only
            showToast('Simulated Dispatch', 'Pass dispatch simulated in logs.', 'success');
            logNotificationSimulator(
                'WhatsApp Simulated',
                'WhatsApp',
                visitor.phone,
                '[SIMULATED] ' + waMessage
            );
            addAuditLog('WhatsApp Simulated Dispatch', 'Communications', 'Simulated WhatsApp pass dispatch to ' + visitor.name);

        } else {
            // Default `url-local`: Direct redirect to WhatsApp Web (bypassing the assistant modal)
            var waUrl = 'https://api.whatsapp.com/send?phone=' + cleanPhone + '&text=' + encodeURIComponent(waMessage);
            if (preOpenedWindow) {
                preOpenedWindow.location.href = waUrl;
            } else {
                window.open(waUrl, '_blank', 'noopener,noreferrer');
            }

            showToast('WhatsApp Web Opened', 'Opening WhatsApp Web for direct delivery.', 'success');
            logNotificationSimulator(
                'WhatsApp Web (Direct)',
                'WhatsApp',
                visitor.phone,
                waMessage
            );
            addAuditLog('WhatsApp Web Redirect', 'Communications', 'Opened WhatsApp Web direct for ' + visitor.name);
        }

    } catch (err) {
        console.error('[VMS] autoSendPassToWhatsApp error:', err);
        if (preOpenedWindow) preOpenedWindow.close();
        try {
            var fb_phone = visitor.phone.replace(/[^0-9]/g, '');
            if (fb_phone.length === 10) fb_phone = '91' + fb_phone;
            var fb_msg = 'Welcome to Barani Hydraulics! Your visit has been APPROVED. Visitor ID: ' + visitor.id + '. Host: ' + visitor.hostName + '. Please show your ID at the gate.';
            window.open('https://api.whatsapp.com/send?phone=' + fb_phone + '&text=' + encodeURIComponent(fb_msg), '_blank');
        } catch (e2) { /* silently fail */ }
    }
}

/* ==========================================================================
   22. URL Param Action Handler ? Auto-approve/reject when host clicks email link
   ========================================================================== */
function checkUrlApprovalAction() {
    try {
        var params = new URLSearchParams(window.location.search);
        var action = params.get('va_action');
        var visitorId = params.get('va_id');

        if (!action || !visitorId) return;

        // Clean URL immediately so it does not re-trigger on refresh
        window.history.replaceState({}, document.title, window.location.pathname);

        // Wait for app state to fully load before acting
        setTimeout(async function () {
            // 1. Supabase Cloud-Based Approval
            if (supabaseClient) {
                showToast('Email Approval Link', 'Connecting to Supabase cloud...', 'info');
                try {
                    const statusVal = action === 'approve' ? 'Checked In' : 'Rejected';
                    const updateObj = { status: statusVal };
                    if (action === 'approve') {
                        updateObj.check_in = new Date().toISOString();
                    }

                    const { error } = await supabaseClient
                        .from('visitors')
                        .update(updateObj)
                        .eq('visitor_code', visitorId);

                    if (!error) {
                        showToast('Visitor Status Sync', `Success: Request successfully ${action}d!`, 'success');
                        syncFromSupabase();
                    } else {
                        console.error('[VMS] Supabase approval link execution error:', error);
                        showToast('Approval Failed', 'Failed to update record in Supabase.', 'warning');
                    }
                } catch (err) {
                    console.error('[VMS] Supabase approval link exception:', err);
                    showToast('Connection Offline', 'Failed to connect to Supabase server.', 'danger');
                }
                return;
            }



            // 2. Offline Browser-Local Fallback
            var visitor = state.visitors.find(function (v) { return v.id === visitorId; });
            if (!visitor) {
                showToast('Not Found', 'Visitor record ' + visitorId + ' not found. It may have already been processed.', 'warning');
                return;
            }
            if (visitor.status === 'Checked In' || visitor.status === 'Rejected') {
                showToast('Already Processed', 'Visitor ' + visitor.name + ' request was already ' + visitor.status.toLowerCase() + '.', 'info');
                return;
            }
            if (action === 'approve') {
                showToast('Host Approved via Email', 'Auto-approving visitor ' + visitor.name + '...', 'success');
                setTimeout(function () { approvePendingVisitor(visitorId); }, 700);
            } else if (action === 'reject') {
                visitor.rejectionReason = 'Rejected by host via email link.';
                showToast('Host Rejected via Email', 'Auto-rejecting visitor ' + visitor.name + '.', 'warning');
                setTimeout(function () { rejectPendingVisitor(visitorId); }, 700);
            }
        }, 1800);

    } catch (err) {
        console.error('[VMS] checkUrlApprovalAction error:', err);
    }
}

/* ==========================================================================
   23. Simulated Email Inbox List Renderers
   ========================================================================== */
function renderSimulatedEmailInbox() {
    const inboxList = document.getElementById("host-email-inbox-list");
    if (!inboxList) return;

    const pendingVisitors = state.visitors.filter(v => v.status === "Pending");
    inboxList.innerHTML = "";

    if (pendingVisitors.length === 0) {
        inboxList.innerHTML = `<div style="padding: 1rem; text-align: center; color: var(--text-secondary); font-size: 0.7rem;">Inbox Empty</div>`;

        // Clear reading pane
        const emailVisitorName = document.getElementById("host-email-visitor-name");
        const emailVisitorCo = document.getElementById("host-email-visitor-company");
        const emailVisitorPurp = document.getElementById("host-email-visitor-purpose");
        const emailVisitorTime = document.getElementById("host-email-visitor-time");
        const emailSubjectEl = document.getElementById("host-email-subject");
        const emailRecipientEl = document.getElementById("host-email-recipient");
        const emailHostNameEl = document.getElementById("host-email-host-name");

        if (emailVisitorName) emailVisitorName.innerText = "?";
        if (emailVisitorCo) emailVisitorCo.innerText = "?";
        if (emailVisitorPurp) emailVisitorPurp.innerText = "?";
        if (emailVisitorTime) emailVisitorTime.innerText = "?";
        if (emailSubjectEl) emailSubjectEl.innerText = "No Pending Request";
        if (emailRecipientEl) emailRecipientEl.innerText = "?";
        if (emailHostNameEl) emailHostNameEl.innerText = "?";

        activeSimulatedVisitor = null;
        return;
    }

    pendingVisitors.forEach((v, idx) => {
        const item = document.createElement("div");
        item.style.cssText = "padding: 8px; border-bottom: 1px solid var(--border-color); cursor: pointer; border-left: 3px solid transparent;";

        // Highlight active item
        if ((activeSimulatedVisitor && activeSimulatedVisitor.id === v.id) || (!activeSimulatedVisitor && idx === 0)) {
            item.style.borderLeft = "3px solid var(--accent-primary)";
            item.style.background = "rgba(37,99,235,0.05)";
            if (!activeSimulatedVisitor || activeSimulatedVisitor.id !== v.id) {
                selectSimulatedEmailVisitor(v);
            }
        }

        item.innerHTML = `
            <div style="font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--text-primary);">${v.hostName}</div>
            <div style="color: var(--text-secondary); font-size: 0.65rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 2px 0;">Request: ${v.name}</div>
            <div style="color: var(--accent-primary); font-size: 0.6rem; text-align: right; font-weight: 500;">Pending</div>
        `;

        item.addEventListener("click", () => {
            selectSimulatedEmailVisitor(v);
            renderSimulatedEmailInbox();
        });

        inboxList.appendChild(item);
    });
}

function selectSimulatedEmailVisitor(visitor) {
    activeSimulatedVisitor = visitor;

    const emailRecipientEl = document.getElementById("host-email-recipient");
    const emailSubjectEl = document.getElementById("host-email-subject");
    const emailHostNameEl = document.getElementById("host-email-host-name");
    const emailVisitorName = document.getElementById("host-email-visitor-name");
    const emailVisitorCo = document.getElementById("host-email-visitor-company");
    const emailVisitorPurp = document.getElementById("host-email-visitor-purpose");
    const emailVisitorTime = document.getElementById("host-email-visitor-time");

    const hostEmp = state.employees.find(e => e.id === visitor.hostId);
    const hostEmail = "manojkumarnj01@gmail.com";

    if (emailRecipientEl) emailRecipientEl.innerText = hostEmail;
    if (emailSubjectEl) emailSubjectEl.innerText = `Visitor Approval Request - ${visitor.name} (${visitor.id})`;
    if (emailHostNameEl) emailHostNameEl.innerText = visitor.hostName;
    if (emailVisitorName) emailVisitorName.innerText = visitor.name;
    if (emailVisitorCo) emailVisitorCo.innerText = visitor.company || 'Independent';
    if (emailVisitorPurp) emailVisitorPurp.innerText = visitor.purpose || 'Meeting';
    if (emailVisitorTime) emailVisitorTime.innerText = (visitor.visitDate || "") + ' ' + (visitor.expectedExit || '06:00 PM');

    // Reset rejection fields in simulator UI
    const rejectWrapper = document.getElementById("host-email-reject-wrapper");
    const rejectTextarea = document.getElementById("host-email-rejection-reason");
    const btnApprove = document.getElementById("btn-host-email-approve");
    const btnReject = document.getElementById("btn-host-email-reject");
    const btnCancel = document.getElementById("btn-host-email-cancel-reject");

    if (rejectWrapper) rejectWrapper.style.display = "none";
    if (rejectTextarea) rejectTextarea.value = "";
    if (btnCancel) btnCancel.style.display = "none";
    if (btnReject) btnReject.textContent = "Reject Link";
    if (btnApprove) btnApprove.style.display = "inline-block";
}

/* ==========================================================================
   24. Redesigned Category Registration Dashboard & Form Helpers
   ========================================================================== */

window.showRegistrationDashboard = function () {
    // Hide all forms and records viewer
    document.getElementById("registration-dashboard-wrapper").classList.remove("hidden");
    document.getElementById("student-registration-wrapper").classList.add("hidden");
    document.getElementById("customer-registration-wrapper").classList.add("hidden");
    document.getElementById("vendor-registration-wrapper").classList.add("hidden");
    document.getElementById("contractor-registration-wrapper").classList.add("hidden");
    document.getElementById("delivery-registration-wrapper").classList.add("hidden");
    document.getElementById("service-engineer-registration-wrapper").classList.add("hidden");
    document.getElementById("view-category-records-wrapper").classList.add("hidden");

    // Stop camera stream
    stopCategoryCameras();

    // Update counts
    updateRegistrationDashboardStats();
};

window.openCategoryForm = function (category) {
    // Keep dashboard cards visible, hide other forms and records viewer
    document.getElementById("registration-dashboard-wrapper").classList.remove("hidden");
    document.getElementById("student-registration-wrapper").classList.add("hidden");
    document.getElementById("customer-registration-wrapper").classList.add("hidden");
    document.getElementById("vendor-registration-wrapper").classList.add("hidden");
    document.getElementById("contractor-registration-wrapper").classList.add("hidden");
    document.getElementById("delivery-registration-wrapper").classList.add("hidden");
    document.getElementById("service-engineer-registration-wrapper").classList.add("hidden");
    document.getElementById("view-category-records-wrapper").classList.add("hidden");

    // Show form
    const wrapper = document.getElementById(`${category}-registration-wrapper`);
    if (wrapper) {
        wrapper.classList.remove("hidden");
    }

    // Set default date to today
    const dateInput = document.getElementById(`reg-${category}-visit-date`);
    if (dateInput) {
        dateInput.value = getLocalDateStr();
    }

    // Reset fields & states
    resetCategoryFormState(category);

    // Populate dropdowns if contractor
    if (category === "contractor") {
        populateContractorPMDropdown();
    }
};

function updateRegistrationDashboardStats() {
    const todayStr = getLocalDateStr();

    // Students
    if (document.getElementById("count-student-total")) {
        document.getElementById("count-student-total").innerText = state.studentMaster.length;
    }
    if (document.getElementById("count-student-today")) {
        document.getElementById("count-student-today").innerText = state.visitors.filter(v => v.purpose === "Student" && v.visitDate === todayStr).length;
    }

    // Customers
    if (document.getElementById("count-customer-total")) {
        document.getElementById("count-customer-total").innerText = state.customerMaster.length;
    }
    if (document.getElementById("count-customer-today")) {
        document.getElementById("count-customer-today").innerText = state.visitors.filter(v => v.purpose === "Customer" && v.visitDate === todayStr).length;
    }

    // Vendors
    if (document.getElementById("count-vendor-total")) {
        document.getElementById("count-vendor-total").innerText = state.vendorMaster.length;
    }
    if (document.getElementById("count-vendor-today")) {
        document.getElementById("count-vendor-today").innerText = state.visitors.filter(v => v.purpose === "Vendor" && v.visitDate === todayStr).length;
    }

    // Contractors
    if (document.getElementById("count-contractor-total")) {
        document.getElementById("count-contractor-total").innerText = state.contractorMaster.length;
    }
    if (document.getElementById("count-contractor-today")) {
        document.getElementById("count-contractor-today").innerText = state.visitors.filter(v => v.purpose === "Contractor" && v.visitDate === todayStr).length;
    }

    // Delivery
    if (document.getElementById("count-delivery-total")) {
        document.getElementById("count-delivery-total").innerText = state.deliveryMaster.length;
    }
    if (document.getElementById("count-delivery-today")) {
        document.getElementById("count-delivery-today").innerText = state.visitors.filter(v => v.purpose === "Delivery" && v.visitDate === todayStr).length;
    }

    // Service Engineers
    if (document.getElementById("count-service-engineer-total")) {
        document.getElementById("count-service-engineer-total").innerText = state.serviceEngineerMaster.length;
    }
    if (document.getElementById("count-service-engineer-today")) {
        document.getElementById("count-service-engineer-today").innerText = state.visitors.filter(v => v.purpose === "Service Engineer" && v.visitDate === todayStr).length;
    }
}

function stopCategoryCameras() {
    if (state.cameraStream) {
        state.cameraStream.getTracks().forEach(track => track.stop());
        state.cameraStream = null;
    }
    const categories = ["student", "customer", "vendor", "contractor", "delivery", "service-engineer"];
    categories.forEach(cat => {
        const video = document.getElementById(`camera-stream-${cat}`);
        if (video) video.classList.add("hidden");
        const status = document.getElementById(`camera-status-${cat}`);
        if (status) status.textContent = "Camera Inactive";
        const enableBtn = document.getElementById(`btn-enable-camera-${cat}`);
        if (enableBtn) enableBtn.classList.remove("hidden");
        const captureBtn = document.getElementById(`btn-capture-${cat}`);
        if (captureBtn) captureBtn.classList.add("hidden");
        const retakeBtn = document.getElementById(`btn-retake-${cat}`);
        if (retakeBtn) retakeBtn.classList.add("hidden");
    });
}

window.initCategoryCamera = function (category) {
    stopCategoryCameras(); // Stop any active camera first

    const video = document.getElementById(`camera-stream-${category}`);
    const status = document.getElementById(`camera-status-${category}`);
    const enableBtn = document.getElementById(`btn-enable-camera-${category}`);
    const captureBtn = document.getElementById(`btn-capture-${category}`);

    if (!video) return;

    status.textContent = "Initializing camera...";

    navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
        .then(stream => {
            state.cameraStream = stream;
            video.srcObject = stream;
            video.classList.remove("hidden");
            status.textContent = "Live Camera Feed Active";
            enableBtn.classList.add("hidden");
            captureBtn.classList.remove("hidden");
        })
        .catch(err => {
            console.error("Camera access error:", err);
            status.textContent = "Camera access denied or unavailable";
            showToast("Camera Error", "Could not start camera feed.", "danger");
        });
};

window.captureCategoryPhoto = function (category) {
    const video = document.getElementById(`camera-stream-${category}`);
    const canvas = document.getElementById(`photo-canvas-${category}`);
    const preview = document.getElementById(`photo-preview-${category}`);
    const status = document.getElementById(`camera-status-${category}`);
    const captureBtn = document.getElementById(`btn-capture-${category}`);
    const retakeBtn = document.getElementById(`btn-retake-${category}`);

    if (!video || !canvas || !preview) return;

    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);



    let studentId = "";
    const existing = state.studentMaster.find(s => s.phone === phone || s.rollNumber === rollNumber);

    if (existing) {
        studentId = existing.studentId;
        // Update changed master details
        existing.name = name;
        existing.email = email || existing.email;
        existing.college = college;
        existing.department = department;
        existing.rollNumber = rollNumber;
        existing.startDate = startDate;
        existing.endDate = endDate;
        if (state.tempVisitorPhoto) {
            existing.photo = state.tempVisitorPhoto;
        }
        saveState();
        showToast("Returning Student", `Profile updated and visit created for ${existing.name}.`, "info");
    } else {
        // Genuinely new student — create master record
        studentId = "STU" + (state.studentMaster.length + 10001);

        const newStudent = {
            studentId,
            name,
            phone,
            email: email || `${name.toLowerCase().replace(/ /g, "")}@college.edu`,
            college,
            department,
            rollNumber,
            startDate,
            endDate,
            photo: state.tempVisitorPhoto || "",
            photoIdDoc: state.tempVisitorIdDoc || "",
            qrCodeData: studentId,
            dateRegistered: getLocalDateStr()
        };

        state.studentMaster.push(newStudent);
        saveState();
    }

    const dataUrl = canvas.toDataURL("image/jpeg");
    state.tempVisitorPhoto = dataUrl; // save in state

    preview.src = dataUrl;
    video.classList.add("hidden");
    status.textContent = "Photo Captured";

    captureBtn.classList.add("hidden");
    retakeBtn.classList.remove("hidden");

    // Stop camera stream tracks
    if (state.cameraStream) {
        state.cameraStream.getTracks().forEach(track => track.stop());
        state.cameraStream = null;
    }
};

window.retakeCategoryPhoto = function (category) {
    const preview = document.getElementById(`photo-preview-${category}`);
    if (preview) {
        preview.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='1.5'><path d='M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z'/><circle cx='12' cy='13' r='4'/></svg>";
    }
    state.tempVisitorPhoto = "";
    initCategoryCamera(category);
};

function handleCategoryPhotoFileUpload(e, category) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (evt) {
        const preview = document.getElementById(`photo-preview-${category}`);
        if (preview) {
            preview.src = evt.target.result;
        }
        state.tempVisitorPhoto = evt.target.result;
        const status = document.getElementById(`camera-status-${category}`);
        if (status) {
            status.textContent = "Photo Uploaded";
        }
        const enableBtn = document.getElementById(`btn-enable-camera-${category}`);
        if (enableBtn) enableBtn.classList.remove("hidden");
        const captureBtn = document.getElementById(`btn-capture-${category}`);
        if (captureBtn) captureBtn.classList.add("hidden");
        const retakeBtn = document.getElementById(`btn-retake-${category}`);
        if (retakeBtn) retakeBtn.classList.add("hidden");

        // Stop stream if active
        if (state.cameraStream) {
            state.cameraStream.getTracks().forEach(track => track.stop());
            state.cameraStream = null;
        }
        const video = document.getElementById(`camera-stream-${category}`);
        if (video) video.classList.add("hidden");
    };
    reader.readAsDataURL(file);
}

function resetCategoryFormState(category) {
    state.tempVisitorPhoto = "";
    state.tempVisitorIdDoc = "";

    const form = document.getElementById(`${category}-registration-form`);
    if (form) {
        form.reset();
    }

    const preview = document.getElementById(`photo-preview-${category}`);
    if (preview) {
        preview.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='1.5'><path d='M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z'/><circle cx='12' cy='13' r='4'/></svg>";
    }

    // Clear badge or alert classes
    const badge = document.getElementById(`${category}-badge-alert`);
    if (badge) {
        badge.classList.add("hidden");
    }

    // For student/customer, enable name/phone editing
    if (category === "student") {
        document.getElementById("reg-student-name").readOnly = false;
        document.getElementById("reg-student-phone").readOnly = false;
        document.getElementById("reg-student-email").readOnly = false;
        document.getElementById("reg-student-college").readOnly = false;
        document.getElementById("reg-student-dept").readOnly = false;
        document.getElementById("reg-student-rollno").readOnly = false;
        if (document.getElementById("reg-student-start-date")) {
            document.getElementById("reg-student-start-date").readOnly = false;
        }
        if (document.getElementById("reg-student-end-date")) {
            document.getElementById("reg-student-end-date").readOnly = false;
        }
        document.querySelectorAll(".suggestions-box").forEach(s => { s.innerHTML = ""; s.style.display = "none"; });
        const uploadBtn = document.getElementById("student-id-doc-label");
        if (uploadBtn) uploadBtn.innerText = "Upload College ID";
    } else if (category === "customer") {
        document.getElementById("reg-customer-name").readOnly = false;
        document.getElementById("reg-customer-phone").readOnly = false;
        document.getElementById("reg-customer-email").readOnly = false;
        document.getElementById("reg-customer-company").readOnly = false;
        document.getElementById("reg-customer-id").value = "CUST" + Math.floor(10000 + Math.random() * 90000);
        document.getElementById("reg-customer-id").readOnly = false;
    }
}

window.lookupStudentProfile = function () {
    const inputVal = document.getElementById("student-lookup-input").value.trim().toLowerCase();
    if (!inputVal) {
        showToast("Validation Error", "Please enter Student ID, Phone or scan QR to search.", "warning");
        return;
    }

    const match = state.studentMaster.find(s =>
        (s.studentId && s.studentId.toLowerCase() === inputVal) ||
        (s.rollNumber && s.rollNumber.toLowerCase() === inputVal) ||
        (s.phone && s.phone.toLowerCase() === inputVal) ||
        (s.qrCodeData && s.qrCodeData.toLowerCase() === inputVal)
    );

    if (match) {
        // Load details and lock fields
        document.getElementById("reg-student-name").value = match.name;
        document.getElementById("reg-student-name").readOnly = true;
        document.getElementById("reg-student-phone").value = match.phone;
        document.getElementById("reg-student-phone").readOnly = true;
        document.getElementById("reg-student-email").value = match.email;
        document.getElementById("reg-student-email").readOnly = true;
        document.getElementById("reg-student-college").value = match.college;
        document.getElementById("reg-student-college").readOnly = true;
        document.getElementById("reg-student-dept").value = match.department;
        document.getElementById("reg-student-dept").readOnly = true;
        document.getElementById("reg-student-rollno").value = match.rollNumber;
        document.getElementById("reg-student-rollno").readOnly = true;
        if (match.startDate) {
            document.getElementById("reg-student-start-date").value = match.startDate;
            document.getElementById("reg-student-start-date").readOnly = true;
        }
        if (match.endDate) {
            document.getElementById("reg-student-end-date").value = match.endDate;
            document.getElementById("reg-student-end-date").readOnly = true;
        }

        if (match.photo) {
            const preview = document.getElementById("photo-preview-student");
            if (preview) preview.src = match.photo;
            state.tempVisitorPhoto = match.photo;
            const status = document.getElementById("camera-status-student");
            if (status) status.textContent = "Profile Photo Loaded";
        }

        const label = document.getElementById("student-id-doc-label");
        if (label) label.innerText = "College ID Verified";

        const alertBadge = document.getElementById("student-badge-alert");
        if (alertBadge) alertBadge.classList.remove("hidden");

        showToast("Profile Found", `Welcome back, ${match.name}! Permanent profile loaded.`, "success");
    } else {
        showToast("Profile Not Found", "No registered student profile matches search criteria.", "warning");
    }
};

window.lookupCustomerProfile = function () {
    const inputVal = document.getElementById("customer-lookup-input").value.trim().toLowerCase();
    if (!inputVal) {
        showToast("Validation Error", "Please enter Customer ID, Phone or scan QR to search.", "warning");
        return;
    }

    const match = state.customerMaster.find(c =>
        (c.customerId && c.customerId.toLowerCase() === inputVal) ||
        (c.phone && c.phone.toLowerCase() === inputVal) ||
        (c.qrCodeData && c.qrCodeData.toLowerCase() === inputVal)
    );

    if (match) {
        // Load details and lock fields
        document.getElementById("reg-customer-name").value = match.name;
        document.getElementById("reg-customer-name").readOnly = true;
        document.getElementById("reg-customer-phone").value = match.phone;
        document.getElementById("reg-customer-phone").readOnly = true;
        document.getElementById("reg-customer-email").value = match.email;
        document.getElementById("reg-customer-email").readOnly = true;
        document.getElementById("reg-customer-company").value = match.company;
        document.getElementById("reg-customer-company").readOnly = true;
        document.getElementById("reg-customer-id").value = match.customerId;
        document.getElementById("reg-customer-id").readOnly = true;

        if (match.photo) {
            const preview = document.getElementById("photo-preview-customer");
            if (preview) preview.src = match.photo;
            state.tempVisitorPhoto = match.photo;
            const status = document.getElementById("camera-status-customer");
            if (status) status.textContent = "Profile Photo Loaded";
        }

        const alertBadge = document.getElementById("customer-badge-alert");
        if (alertBadge) alertBadge.classList.remove("hidden");

        showToast("Profile Found", `Welcome back, ${match.name}! Profile loaded.`, "success");
    } else {
        showToast("Profile Not Found", "No registered customer profile matches search criteria.", "warning");
    }
};

window.populateContractorPMDropdown = function () {
    const pmDropdown = document.getElementById("reg-contractor-pm");
    if (!pmDropdown) return;
    pmDropdown.innerHTML = '<option value="">-- Choose Approved Purchase Manual --</option>';

    const approvedPMs = state.purchaseManuals.filter(pm => pm.status === "Approved");
    approvedPMs.forEach(pm => {
        const opt = document.createElement("option");
        opt.value = pm.id;
        opt.textContent = `${pm.id} - ${pm.companyName} (${pm.natureWork})`;
        pmDropdown.appendChild(opt);
    });
};

window.populateContractorWPDropdown = function () {
    const pmDropdown = document.getElementById("reg-contractor-pm");
    const wpDropdown = document.getElementById("reg-contractor-wp");
    if (!pmDropdown || !wpDropdown) return;

    wpDropdown.innerHTML = '<option value="">-- Choose Active Work Permit --</option>';
    const selectedPmId = pmDropdown.value;
    if (!selectedPmId) return;

    const approvedWPs = state.workPermits.filter(wp => wp.purchaseManualId === selectedPmId && wp.status === "Approved");
    approvedWPs.forEach(wp => {
        const opt = document.createElement("option");
        opt.value = wp.id;
        opt.textContent = `${wp.id} - ${wp.workActivity}`;
        wpDropdown.appendChild(opt);
    });
};

// Sync single student helper
async function syncSingleStudentToCloud(student) {
    if (supabaseClient) {
        try {
            const dbRow = mapStudentToDb(student);
            const { error } = await supabaseClient.from('students').upsert(dbRow, { onConflict: 'student_id' });
            if (error) {
                console.error("Failed to sync student to Supabase:", error);
            } else {
                console.log("Student synced to Supabase:", student.studentId);
            }
        } catch (e) {
            console.error("Supabase student sync error:", e);
        }
    }
}

window.handleStudentRegistrationSubmit = function (e) {
    e.preventDefault();

    const name = document.getElementById("reg-student-name").value.trim();
    const phone = document.getElementById("reg-student-phone").value.trim();
    const email = document.getElementById("reg-student-email").value.trim();
    const college = document.getElementById("reg-student-college").value.trim();
    const company = document.getElementById("reg-student-company").value.trim();
    const department = document.getElementById("reg-student-dept").value.trim();
    const rollNumber = document.getElementById("reg-student-rollno").value.trim();
    const aadhaar = document.getElementById("reg-student-aadhaar").value.trim();
    const address = document.getElementById("reg-student-address").value.trim();
    const purpose = document.getElementById("reg-student-purpose").value;
    const hostNameVal = document.getElementById("reg-student-host").value.trim();
    const visitDate = document.getElementById("reg-student-visit-date").value;
    const expectedExit = document.getElementById("reg-student-expected-exit").value;
    const startDate = document.getElementById("reg-student-start-date").value;
    const endDate = document.getElementById("reg-student-end-date").value;

    const matchedHost = state.employees.find(emp => emp.name === hostNameVal);
    if (!matchedHost) {
        showToast("Host Not Found", "Please choose an employee from suggestions dropdown list.", "danger");
        return;
    }

    let studentId = "";
    const existing = state.studentMaster.find(s => s.phone === phone || s.rollNumber === rollNumber);

    if (existing) {
        studentId = existing.studentId;
        existing.name = name;
        existing.email = email || existing.email;
        existing.college = college;
        existing.company = company;
        existing.department = department;
        existing.rollNumber = rollNumber;
        existing.aadhaar = aadhaar;
        existing.address = address;
        existing.startDate = startDate;
        existing.endDate = endDate;
        if (state.tempVisitorPhoto) {
            existing.photo = state.tempVisitorPhoto;
        }
        saveState();
        syncSingleStudentToCloud(existing);
        showToast("Returning Student", `Profile updated and visit created for ${existing.name}.`, "info");
    } else {
        studentId = "STU" + (state.studentMaster.length + 10001);
        const newStudent = {
            studentId,
            name,
            phone,
            email: email || `${name.toLowerCase().replace(/ /g, "")}@college.edu`,
            college,
            company,
            department,
            rollNumber,
            aadhaar,
            address,
            startDate,
            endDate,
            photo: state.tempVisitorPhoto || "",
            photoIdDoc: state.tempVisitorIdDoc || "",
            qrCodeData: studentId,
            dateRegistered: getLocalDateStr()
        };
        state.studentMaster.push(newStudent);
        saveState();
        syncSingleStudentToCloud(newStudent);
    }

    const visitId = "V" + new Date().getFullYear() + String(state.visitors.length + 10001).substring(1);
    const visitObj = {
        id: visitId,
        masterId: studentId,
        name,
        phone,
        email: email || `${name.toLowerCase().replace(/ /g, "")}@college.edu`,
        company: college,
        address: address,
        purpose: "Student",
        vehicle: "None",
        numVisitors: 1,
        idType: "College ID",
        idNumber: rollNumber,
        startDate,
        endDate,
        hostId: matchedHost.id,
        hostName: matchedHost.name,
        hostDept: matchedHost.dept,
        visitDate,
        checkIn: null,
        checkOut: null,
        expectedExit,
        status: "Pending",
        photo: state.tempVisitorPhoto || "",
        photoIdDoc: state.tempVisitorIdDoc || "",

        // New fields
        college,
        studentCompany: company,
        department,
        rollNumber,
        aadhaar,
        visitorCategory: "Student"
    };

    pendingRegistrationObj = visitObj;
    openVisitorPreview(pendingRegistrationObj);
};

window.handleCustomerRegistrationSubmit = function (e) {
    e.preventDefault();

    const name = document.getElementById("reg-customer-name").value.trim();
    const phone = document.getElementById("reg-customer-phone").value.trim();
    const email = document.getElementById("reg-customer-email").value.trim();
    const company = document.getElementById("reg-customer-company").value.trim();
    const college = document.getElementById("reg-customer-college").value.trim();
    const department = document.getElementById("reg-customer-dept").value.trim();
    const customerIdInput = document.getElementById("reg-customer-id").value.trim();
    const aadhaar = document.getElementById("reg-customer-aadhaar").value.trim();
    const address = document.getElementById("reg-customer-address").value.trim();
    const purpose = document.getElementById("reg-customer-purpose").value;
    const idType = document.getElementById("reg-customer-id-type").value;
    const idNumber = document.getElementById("reg-customer-id-number").value.trim();
    const vehicle = document.getElementById("reg-customer-vehicle").value.trim();
    const hostNameVal = document.getElementById("reg-customer-host").value.trim();
    const visitDate = document.getElementById("reg-customer-visit-date").value;
    const expectedExit = document.getElementById("reg-customer-expected-exit").value;

    const matchedHost = state.employees.find(emp => emp.name === hostNameVal);
    if (!matchedHost) {
        showToast("Host Not Found", "Please choose an employee from suggestions dropdown list.", "danger");
        return;
    }

    let customerId = "";
    const existing = state.customerMaster.find(c => c.phone === phone || (customerIdInput && c.customerId === customerIdInput));

    if (existing) {
        customerId = existing.customerId;
        existing.name = name;
        existing.email = email || existing.email;
        existing.company = company;
        existing.college = college;
        existing.department = department;
        existing.aadhaar = aadhaar;
        existing.address = address;
        if (state.tempVisitorPhoto) {
            existing.photo = state.tempVisitorPhoto;
        }
        saveState();
        showToast("Returning Customer", `Profile updated and visit created for ${existing.name}.`, "info");
    } else {
        customerId = customerIdInput || "CUST" + (state.customerMaster.length + 10001);
        const newCustomer = {
            customerId,
            name,
            phone,
            email: email || `${name.toLowerCase().replace(/ /g, "")}@example.com`,
            company,
            college,
            department,
            aadhaar,
            address,
            photo: state.tempVisitorPhoto || "",
            qrCodeData: customerId,
            dateRegistered: getLocalDateStr()
        };
        state.customerMaster.push(newCustomer);
        saveState();
    }

    const visitId = "V" + new Date().getFullYear() + String(state.visitors.length + 10001).substring(1);
    const visitObj = {
        id: visitId,
        masterId: customerId,
        name,
        phone,
        email: email || `${name.toLowerCase().replace(/ /g, "")}@example.com`,
        company,
        address: address,
        purpose: "Customer",
        vehicle,
        numVisitors: 1,
        idType,
        idNumber,
        hostId: matchedHost.id,
        hostName: matchedHost.name,
        hostDept: matchedHost.dept,
        visitDate,
        checkIn: null,
        checkOut: null,
        expectedExit,
        status: "Pending",
        photo: state.tempVisitorPhoto || "",
        photoIdDoc: "",

        // New fields
        college,
        department,
        aadhaar,
        visitorCategory: "Customer"
    };

    pendingRegistrationObj = visitObj;
    openVisitorPreview(pendingRegistrationObj);
};

window.handleVendorRegistrationSubmit = function (e) {
    e.preventDefault();

    const name = document.getElementById("reg-vendor-name").value.trim();
    const phone = document.getElementById("reg-vendor-phone").value.trim();
    const email = document.getElementById("reg-vendor-email").value.trim();
    const company = document.getElementById("reg-vendor-company").value.trim();
    const college = document.getElementById("reg-vendor-college").value.trim();
    const department = document.getElementById("reg-vendor-dept").value.trim();
    const vendorIdInput = document.getElementById("reg-vendor-visitor-id").value.trim();
    const invoice = document.getElementById("reg-vendor-invoice").value.trim();
    const aadhaar = document.getElementById("reg-vendor-aadhaar").value.trim();
    const address = document.getElementById("reg-vendor-address").value.trim();
    const idType = document.getElementById("reg-vendor-id-type").value;
    const idNumber = document.getElementById("reg-vendor-id-number").value.trim();
    const vehicle = document.getElementById("reg-vendor-vehicle").value.trim();
    const hostNameVal = document.getElementById("reg-vendor-host").value.trim();
    const visitDate = document.getElementById("reg-vendor-visit-date").value;
    const expectedExit = document.getElementById("reg-vendor-expected-exit").value;

    const matchedHost = state.employees.find(emp => emp.name === hostNameVal);
    if (!matchedHost) {
        showToast("Host Not Found", "Please choose an employee from suggestions dropdown list.", "danger");
        return;
    }

    let vendorId = "";
    const existing = state.vendorMaster.find(v => v.phone === phone || (vendorIdInput && v.vendorId === vendorIdInput));

    if (existing) {
        vendorId = existing.vendorId;
        existing.name = name;
        existing.email = email || existing.email;
        existing.company = company;
        existing.college = college;
        existing.department = department;
        existing.invoice = invoice;
        existing.aadhaar = aadhaar;
        existing.address = address;
        if (state.tempVisitorPhoto) {
            existing.photo = state.tempVisitorPhoto;
        }
        saveState();
        showToast("Returning Vendor", `Profile updated and visit created for ${existing.name}.`, "info");
    } else {
        vendorId = vendorIdInput || "VND" + (state.vendorMaster.length + 10001);
        const newVendor = {
            vendorId,
            name,
            phone,
            email: email || `${name.toLowerCase().replace(/ /g, "")}@vendor.com`,
            company,
            college,
            department,
            invoice,
            aadhaar,
            address,
            photo: state.tempVisitorPhoto || "",
            qrCodeData: vendorId,
            dateRegistered: getLocalDateStr()
        };
        state.vendorMaster.push(newVendor);
        saveState();
    }

    const visitId = "V" + new Date().getFullYear() + String(state.visitors.length + 10001).substring(1);
    const visitObj = {
        id: visitId,
        masterId: vendorId,
        name,
        phone,
        email: email || `${name.toLowerCase().replace(/ /g, "")}@vendor.com`,
        company,
        address: address,
        purpose: "Vendor",
        vehicle,
        numVisitors: 1,
        idType,
        idNumber,
        hostId: matchedHost.id,
        hostName: matchedHost.name,
        hostDept: matchedHost.dept,
        visitDate,
        checkIn: null,
        checkOut: null,
        expectedExit,
        status: "Pending",
        photo: state.tempVisitorPhoto || "",
        photoIdDoc: "",

        // New fields
        college,
        department,
        invoice,
        aadhaar,
        visitorCategory: "Vendor"
    };

    pendingRegistrationObj = visitObj;
    openVisitorPreview(pendingRegistrationObj);
};
window.handleContractorRegistrationSubmit = function (e) {
    e.preventDefault();

    const name = document.getElementById("reg-contractor-name").value.trim();
    const phone = document.getElementById("reg-contractor-phone").value.trim();
    const company = document.getElementById("reg-contractor-company").value.trim();
    const vehicle = document.getElementById("reg-contractor-vehicle").value.trim();
    const pmId = document.getElementById("reg-contractor-pm").value;
    const wpId = document.getElementById("reg-contractor-wp").value;
    const idType = document.getElementById("reg-contractor-id-type").value;
    const idNumber = document.getElementById("reg-contractor-id-number").value.trim();
    const hostNameVal = document.getElementById("reg-contractor-host").value.trim();
    const visitDate = document.getElementById("reg-contractor-visit-date").value;
    const expectedExit = document.getElementById("reg-contractor-expected-exit").value;

    const matchedHost = state.employees.find(emp => emp.name === hostNameVal);
    if (!matchedHost) {
        showToast("Host Not Found", "Please choose an employee from suggestions dropdown list.", "danger");
        return;
    }

    let contractorId = "";
    const existing = state.contractorMaster.find(c => c.phone === phone);
    if (existing) {
        contractorId = existing.contractorId;
    } else {
        contractorId = "CNT" + (state.contractorMaster.length + 10001);
        const newContractor = {
            contractorId,
            name,
            phone,
            company,
            dateRegistered: getLocalDateStr()
        };
        state.contractorMaster.push(newContractor);
        saveState();
    }

    const visitId = "V" + new Date().getFullYear() + String(state.visitors.length + 10001).substring(1);
    const visitObj = {
        id: visitId,
        masterId: contractorId,
        name,
        phone,
        email: `${name.toLowerCase().replace(/ /g, "")}@contractor.com`,
        company,
        address: `Linked PM: ${pmId} | WP: ${wpId}`,
        purpose: "Contractor",
        vehicle,
        numVisitors: 1,
        idType,
        idNumber,
        hostId: matchedHost.id,
        hostName: matchedHost.name,
        hostDept: matchedHost.dept,
        visitDate,
        checkIn: null,
        checkOut: null,
        expectedExit,
        status: "Pending",
        photo: state.tempVisitorPhoto || "",
        photoIdDoc: ""
    };

    pendingRegistrationObj = visitObj;
    openVisitorPreview(pendingRegistrationObj);
};

window.handleDeliveryRegistrationSubmit = function (e) {
    e.preventDefault();

    const name = document.getElementById("reg-delivery-name").value.trim();
    const phone = document.getElementById("reg-delivery-phone").value.trim();
    const agency = document.getElementById("reg-delivery-agency").value;
    const invoice = document.getElementById("reg-delivery-invoice").value.trim();
    const items = document.getElementById("reg-delivery-items").value.trim();
    const vehicle = document.getElementById("reg-delivery-vehicle").value.trim();
    const hostNameVal = document.getElementById("reg-delivery-host").value.trim();
    const visitDate = document.getElementById("reg-delivery-visit-date").value;
    const expectedExit = document.getElementById("reg-delivery-expected-exit").value;

    const matchedHost = state.employees.find(emp => emp.name === hostNameVal);
    if (!matchedHost) {
        showToast("Host Not Found", "Please choose an employee from suggestions dropdown list.", "danger");
        return;
    }

    let deliveryId = "";
    const existing = state.deliveryMaster.find(d => d.phone === phone);
    if (existing) {
        deliveryId = existing.deliveryId;
    } else {
        deliveryId = "DLV" + (state.deliveryMaster.length + 10001);
        const newDelivery = {
            deliveryId,
            name,
            phone,
            agency,
            dateRegistered: getLocalDateStr()
        };
        state.deliveryMaster.push(newDelivery);
        saveState();
    }

    const visitId = "V" + new Date().getFullYear() + String(state.visitors.length + 10001).substring(1);
    const visitObj = {
        id: visitId,
        masterId: deliveryId,
        name,
        phone,
        email: `${name.toLowerCase().replace(/ /g, "")}@delivery.com`,
        company: agency,
        address: `Challan: ${invoice} | Items: ${items}`,
        purpose: "Delivery",
        vehicle,
        numVisitors: 1,
        idType: "Delivery Challan",
        idNumber: invoice,
        hostId: matchedHost.id,
        hostName: matchedHost.name,
        hostDept: matchedHost.dept,
        visitDate,
        checkIn: null,
        checkOut: null,
        expectedExit,
        status: "Pending",
        photo: state.tempVisitorPhoto || "",
        photoIdDoc: ""
    };

    pendingRegistrationObj = visitObj;
    openVisitorPreview(pendingRegistrationObj);
};

window.handleServiceEngineerRegistrationSubmit = function (e) {
    e.preventDefault();

    const name = document.getElementById("reg-service-engineer-name").value.trim();
    const phone = document.getElementById("reg-service-engineer-phone").value.trim();
    const company = document.getElementById("reg-service-engineer-company").value.trim();
    const machine = document.getElementById("reg-service-engineer-machine").value.trim();
    const callNo = document.getElementById("reg-service-engineer-callno").value.trim();
    const vehicle = document.getElementById("reg-service-engineer-vehicle").value.trim();
    const idType = document.getElementById("reg-service-engineer-id-type").value;
    const idNumber = document.getElementById("reg-service-engineer-id-number").value.trim();
    const hostNameVal = document.getElementById("reg-service-engineer-host").value.trim();
    const visitDate = document.getElementById("reg-service-engineer-visit-date").value;
    const expectedExit = document.getElementById("reg-service-engineer-expected-exit").value;

    const matchedHost = state.employees.find(emp => emp.name === hostNameVal);
    if (!matchedHost) {
        showToast("Host Not Found", "Please choose an employee from suggestions dropdown list.", "danger");
        return;
    }

    let engineerId = "";
    const existing = state.serviceEngineerMaster.find(s => s.phone === phone);
    if (existing) {
        engineerId = existing.engineerId;
    } else {
        engineerId = "ENG" + (state.serviceEngineerMaster.length + 10001);
        const newEngineer = {
            engineerId,
            name,
            phone,
            company,
            dateRegistered: getLocalDateStr()
        };
        state.serviceEngineerMaster.push(newEngineer);
        saveState();
    }

    const visitId = "V" + new Date().getFullYear() + String(state.visitors.length + 10001).substring(1);
    const visitObj = {
        id: visitId,
        masterId: engineerId,
        name,
        phone,
        email: `${name.toLowerCase().replace(/ /g, "")}@service.com`,
        company,
        address: `Machine: ${machine} | Ticket: ${callNo}`,
        purpose: "Service Engineer",
        vehicle,
        numVisitors: 1,
        idType,
        idNumber,
        hostId: matchedHost.id,
        hostName: matchedHost.name,
        hostDept: matchedHost.dept,
        visitDate,
        checkIn: null,
        checkOut: null,
        expectedExit,
        status: "Pending",
        photo: state.tempVisitorPhoto || "",
        photoIdDoc: ""
    };

    pendingRegistrationObj = visitObj;
    openVisitorPreview(pendingRegistrationObj);
};

let currentViewCategory = "";

window.viewCategoryRecords = function (category) {
    currentViewCategory = category;

    // Hide dashboard and forms, show records table
    document.getElementById("registration-dashboard-wrapper").classList.add("hidden");
    document.getElementById("student-registration-wrapper").classList.add("hidden");
    document.getElementById("customer-registration-wrapper").classList.add("hidden");
    document.getElementById("vendor-registration-wrapper").classList.add("hidden");
    document.getElementById("contractor-registration-wrapper").classList.add("hidden");
    document.getElementById("delivery-registration-wrapper").classList.add("hidden");
    document.getElementById("service-engineer-registration-wrapper").classList.add("hidden");

    const wrapper = document.getElementById("view-category-records-wrapper");
    wrapper.classList.remove("hidden");

    document.getElementById("category-records-search").value = "";

    // Update title
    const title = document.getElementById("category-records-title");
    title.innerText = getCategoryTitle(category) + " Directory";

    renderCategoryRecordsTable();
};

function getCategoryTitle(cat) {
    switch (cat) {
        case "student": return "?? Students";
        case "customer": return "?? Customers";
        case "vendor": return "?? Vendors";
        case "contractor": return "?? Contractors";
        case "delivery": return "?? Delivery Personnel";
        case "service-engineer": return "?? Service Engineers";
        default: return "Visitor";
    }
}

function renderCategoryRecordsTable() {
    const thead = document.getElementById("category-records-thead");
    const tbody = document.getElementById("category-records-tbody");
    if (!thead || !tbody) return;

    thead.innerHTML = "";
    tbody.innerHTML = "";

    const searchKeyword = document.getElementById("category-records-search").value.trim().toLowerCase();

    let headers = [];
    let records = [];

    if (currentViewCategory === "student") {
        headers = ["ID", "Student Name", "Company/College", "Phone Number", "Purpose", "Start Date", "End Date", "Check In", "Check Out"];
        records = state.visitors.filter(r =>
            (r.purpose === "Student" || (r.masterId && r.masterId.startsWith("STU"))) &&
            ((r.id && r.id.toLowerCase().includes(searchKeyword)) ||
                (r.name && r.name.toLowerCase().includes(searchKeyword)) ||
                (r.phone && r.phone.toLowerCase().includes(searchKeyword)) ||
                (r.company && r.company.toLowerCase().includes(searchKeyword)))
        ).map(r => ({
            id: r.id,
            cols: [
                r.name,
                r.company,
                r.phone,
                r.purpose,
                r.startDate || "-",
                r.endDate || "-",
                r.checkIn ? new Date(r.checkIn).toLocaleString() : "-",
                r.checkOut ? new Date(r.checkOut).toLocaleString() : (r.checkIn ? "Inside Campus" : "-")
            ],
            qr: r.masterId || r.id
        }));
    } else if (currentViewCategory === "customer") {
        headers = ["ID", "Customer Name", "Company", "Phone Number", "Check In", "Check Out"];
        records = state.visitors.filter(r =>
            (r.purpose === "Customer" || (r.masterId && r.masterId.startsWith("CUST"))) &&
            ((r.id && r.id.toLowerCase().includes(searchKeyword)) ||
                (r.name && r.name.toLowerCase().includes(searchKeyword)) ||
                (r.phone && r.phone.toLowerCase().includes(searchKeyword)) ||
                (r.company && r.company.toLowerCase().includes(searchKeyword)))
        ).map(r => ({
            id: r.id,
            cols: [
                r.name,
                r.company,
                r.phone,
                r.checkIn ? new Date(r.checkIn).toLocaleString() : "-",
                r.checkOut ? new Date(r.checkOut).toLocaleString() : (r.checkIn ? "Inside Campus" : "-")
            ],
            qr: r.masterId || r.id
        }));
    } else if (currentViewCategory === "vendor") {
        headers = ["ID", "Vendor Name", "Company", "Phone Number", "Check In", "Check Out"];
        records = state.visitors.filter(r =>
            (r.purpose === "Vendor" || (r.masterId && r.masterId.startsWith("VND"))) &&
            ((r.id && r.id.toLowerCase().includes(searchKeyword)) ||
                (r.name && r.name.toLowerCase().includes(searchKeyword)) ||
                (r.phone && r.phone.toLowerCase().includes(searchKeyword)) ||
                (r.company && r.company.toLowerCase().includes(searchKeyword)))
        ).map(r => ({
            id: r.id,
            cols: [
                r.name,
                r.company,
                r.phone,
                r.checkIn ? new Date(r.checkIn).toLocaleString() : "-",
                r.checkOut ? new Date(r.checkOut).toLocaleString() : (r.checkIn ? "Inside Campus" : "-")
            ],
            qr: r.masterId || r.id
        }));
    } else if (currentViewCategory === "contractor") {
        headers = ["ID", "Name", "Phone", "Agency", "Reg Date"];
        records = state.contractorMaster.filter(r =>
            r.contractorId.toLowerCase().includes(searchKeyword) ||
            r.name.toLowerCase().includes(searchKeyword) ||
            r.phone.toLowerCase().includes(searchKeyword) ||
            r.company.toLowerCase().includes(searchKeyword)
        ).map(r => ({
            id: r.contractorId,
            cols: [r.name, r.phone, r.company, r.dateRegistered],
            qr: ""
        }));
    } else if (currentViewCategory === "delivery") {
        headers = ["ID", "Name", "Phone", "Agency", "Reg Date"];
        records = state.deliveryMaster.filter(r =>
            r.deliveryId.toLowerCase().includes(searchKeyword) ||
            r.name.toLowerCase().includes(searchKeyword) ||
            r.phone.toLowerCase().includes(searchKeyword) ||
            r.agency.toLowerCase().includes(searchKeyword)
        ).map(r => ({
            id: r.deliveryId,
            cols: [r.name, r.phone, r.agency, r.dateRegistered],
            qr: ""
        }));
    } else if (currentViewCategory === "service-engineer") {
        headers = ["ID", "Name", "Phone", "Company", "Reg Date"];
        records = state.serviceEngineerMaster.filter(r =>
            r.engineerId.toLowerCase().includes(searchKeyword) ||
            r.name.toLowerCase().includes(searchKeyword) ||
            r.phone.toLowerCase().includes(searchKeyword) ||
            r.company.toLowerCase().includes(searchKeyword)
        ).map(r => ({
            id: r.engineerId,
            cols: [r.name, r.phone, r.company, r.dateRegistered],
            qr: ""
        }));
    }

    // Header row
    const trHead = document.createElement("tr");
    headers.forEach(h => {
        const th = document.createElement("th");
        th.innerText = h;
        trHead.appendChild(th);
    });
    thead.appendChild(trHead);

    // Body rows
    if (records.length === 0) {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td colspan="${headers.length}" class="empty-state">No directory profile listings found.</td>`;
        tbody.appendChild(tr);
        return;
    }

    records.forEach(r => {
        const tr = document.createElement("tr");
        let qrCellHtml = "";
        if (headers.includes("QR Code") && r.qr) {
            qrCellHtml = `<td><button type="button" class="btn btn-secondary btn-sm" onclick="showPermanentQR('${r.id}', '${r.qr}')">Show QR</button></td>`;
        }

        tr.innerHTML = `
            <td><code>${r.id}</code></td>
            <td><strong>${r.col1}</strong></td>
            <td>${r.col2}</td>
            <td>${r.col3}</td>
            <td>${r.col4}</td>
            ${r.col5 && headers.includes("Course") ? `<td>${r.col5}</td>` : ""}
            ${qrCellHtml}
        `;
        tbody.appendChild(tr);
    });
}

window.filterCategoryRecords = function () {
    renderCategoryRecordsTable();
};

window.showPermanentQR = function (id, qrPayload) {
    const modal = document.createElement("div");
    modal.className = "modal active";
    modal.style.zIndex = "2000";
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 320px; text-align: center; padding: 2rem;">
            <h3 style="margin-bottom: 0.5rem;">Permanent QR Code</h3>
            <p class="text-secondary text-sm mb-4">${id}</p>
            <div id="popup-qr-container" style="display: inline-block; margin-bottom: 1.5rem; background: #fff; padding: 10px; border-radius: 8px;"></div>
            <div>
                <button type="button" class="btn btn-primary" onclick="this.closest('.modal').remove()">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    setTimeout(() => {
        try {
            new QRCode(document.getElementById("popup-qr-container"), {
                text: qrPayload,
                width: 150,
                height: 150,
                colorDark: "#0f172a",
                colorLight: "#ffffff"
            });
        } catch (err) {
            console.error(err);
            document.getElementById("popup-qr-container").innerText = qrPayload;
        }
    }, 100);
};

/* ==========================================================================
   INTERACTIVE DASHBOARD DETAILS DRAWER & SENSORS (AI VMS UPGRADE)
   ========================================================================== */
let drawerActiveKpi = null;
let drawerCurrentPage = 0;
const drawerPageSize = 5;
let drawerFilteredData = [];
let drawerChartInstance = null;

function setupInteractiveDashboard() {
    console.log("[Dashboard] Initializing interactive KPI card sensors...");
    const kpis = [
        { id: "stat-waiting", label: "Waiting Visitors", icon: "?", segment: "waiting" },
        { id: "stat-pending", label: "Pending Approval Queue", icon: "??", segment: "pending" },
        { id: "stat-active-in", label: "Inside Campus", icon: "??", segment: "inside" },
        { id: "stat-checked-out", label: "Visitors Exited", icon: "??", segment: "exited" },
        { id: "stat-rejected", label: "Rejected Registrations", icon: "?", segment: "rejected" },
        { id: "stat-blacklisted", label: "Blacklisted Records", icon: "?", segment: "blacklisted" },
        { id: "stat-frequent", label: "Frequent Visitors", icon: "??", segment: "frequent" },
        { id: "stat-total-today", label: "Today's Total Logs", icon: "??", segment: "today" },
        { id: "stat-pm-draft", label: "Purchase Manual Drafts", icon: "??", segment: "pm-draft" },
        { id: "stat-pm-pending", label: "Purchase Manual Pending", icon: "?", segment: "pm-pending" },
        { id: "stat-pm-approved", label: "Purchase Manual Approved", icon: "?", segment: "pm-approved" },
        { id: "stat-pm-rejected", label: "Purchase Manual Rejected", icon: "?", segment: "pm-rejected" },
        { id: "stat-active-permits", label: "Active Work Permits", icon: "??", segment: "permits" }
    ];

    kpis.forEach(kpi => {
        const el = document.getElementById(kpi.id);
        if (el) {
            const card = el.closest(".stat-card");
            if (card) {
                card.style.cursor = "pointer";
                card.classList.add("interactive-stat-card");
                card.addEventListener("click", () => openCardDetailDrawer(kpi));
            }
        }
    });

    // Close button
    const btnClose = document.getElementById("btn-close-drawer");
    if (btnClose) {
        btnClose.addEventListener("click", () => {
            document.getElementById("dashboard-detail-drawer").classList.add("hidden");
            drawerActiveKpi = null;
        });
    }

    // Filters and search
    const searchInput = document.getElementById("drawer-search");
    if (searchInput) {
        searchInput.oninput = () => {
            drawerCurrentPage = 0;
            renderDrawerContent();
        };
    }

    const purposeFilter = document.getElementById("drawer-filter-purpose");
    if (purposeFilter) {
        purposeFilter.onchange = () => {
            drawerCurrentPage = 0;
            renderDrawerContent();
        };
    }

    const deptFilter = document.getElementById("drawer-filter-dept");
    if (deptFilter) {
        deptFilter.onchange = () => {
            drawerCurrentPage = 0;
            renderDrawerContent();
        };
    }

    // Pagination buttons
    const btnPrev = document.getElementById("btn-drawer-prev");
    if (btnPrev) {
        btnPrev.onclick = () => {
            if (drawerCurrentPage > 0) {
                drawerCurrentPage--;
                renderDrawerTable();
            }
        };
    }

    const btnNext = document.getElementById("btn-drawer-next");
    if (btnNext) {
        btnNext.onclick = () => {
            const maxPage = Math.ceil(drawerFilteredData.length / drawerPageSize) - 1;
            if (drawerCurrentPage < maxPage) {
                drawerCurrentPage++;
                renderDrawerTable();
            }
        };
    }

    // Export buttons inside drawer
    const btnExportCsv = document.getElementById("btn-drawer-export-csv");
    if (btnExportCsv) {
        btnExportCsv.onclick = () => exportDrawerDataCSV();
    }
    const btnExportPdf = document.getElementById("btn-drawer-export-pdf");
    if (btnExportPdf) {
        btnExportPdf.onclick = () => exportDrawerDataPDF();
    }

    // Animate stats values counting up on dashboard load
    animateDashboardStats();
}

function openCardDetailDrawer(kpi) {
    drawerActiveKpi = kpi;
    drawerCurrentPage = 0;

    const drawer = document.getElementById("dashboard-detail-drawer");
    if (!drawer) return;

    drawer.classList.remove("hidden");
    document.getElementById("drawer-icon").innerText = kpi.icon;
    document.getElementById("drawer-title").innerText = kpi.label;

    // Show/Hide filter inputs based on segment type
    const isVisitorSeg = ["waiting", "pending", "inside", "exited", "rejected", "today", "frequent"].includes(kpi.segment);
    const purposeFilter = document.getElementById("drawer-filter-purpose");
    const deptFilter = document.getElementById("drawer-filter-dept");

    if (purposeFilter) purposeFilter.style.display = isVisitorSeg ? "inline-block" : "none";
    if (deptFilter) {
        deptFilter.style.display = (isVisitorSeg || kpi.segment.startsWith("pm-")) ? "inline-block" : "none";

        // Populate Departments select list
        deptFilter.innerHTML = '<option value="all">All Departments</option>';
        state.departments.forEach(d => {
            const opt = document.createElement("option");
            opt.value = d.name;
            opt.innerText = d.name;
            deptFilter.appendChild(opt);
        });
    }

    // Scroll to the drawer smoothly
    drawer.scrollIntoView({ behavior: 'smooth', block: 'start' });

    renderDrawerContent();
}

function renderDrawerContent() {
    if (!drawerActiveKpi) return;

    const segment = drawerActiveKpi.segment;
    let rawData = [];

    // 1. Gather raw data by segment
    if (["waiting", "pending", "inside", "exited", "rejected", "today", "frequent"].includes(segment)) {
        const todayStr = getLocalDateStr();
        if (segment === "waiting") {
            rawData = state.visitors.filter(v => v.status === "Pending" || v.status === "Approved");
        } else if (segment === "pending") {
            rawData = state.visitors.filter(v => v.status === "Pending");
        } else if (segment === "inside") {
            rawData = state.visitors.filter(v => v.status === "Checked In");
        } else if (segment === "exited") {
            rawData = state.visitors.filter(v => v.status === "Checked Out");
        } else if (segment === "rejected") {
            rawData = state.visitors.filter(v => v.status === "Rejected" || v.status === "Denied");
        } else if (segment === "today") {
            rawData = state.visitors.filter(v => v.visitDate === todayStr);
        } else if (segment === "frequent") {
            const counts = {};
            state.visitors.forEach(v => { if (v.phone) counts[v.phone] = (counts[v.phone] || 0) + 1; });
            const freqPhones = Object.keys(counts).filter(p => counts[p] >= 2);
            const freqList = [];
            freqPhones.forEach(phone => {
                const logs = state.visitors.filter(v => v.phone === phone);
                if (logs.length > 0) freqList.push(logs[logs.length - 1]);
            });
            rawData = freqList;
        }
    } else if (segment === "blacklisted") {
        rawData = state.blacklist;
    } else if (segment.startsWith("pm-")) {
        const pmStatus = segment.split("-")[1]; // draft, pending, approved, rejected
        const statusMap = {
            draft: ["Draft"],
            pending: ["Submitted", "Pending"],
            approved: ["Approved"],
            rejected: ["Rejected"]
        };
        const targetStatuses = statusMap[pmStatus] || [];
        rawData = state.purchaseManuals.filter(pm => targetStatuses.includes(pm.status));
    } else if (segment === "permits") {
        rawData = state.workPermits;
    }

    // 2. Apply search and select filters
    const searchVal = document.getElementById("drawer-search").value.trim().toLowerCase();
    const purposeVal = document.getElementById("drawer-filter-purpose").value;
    const deptVal = document.getElementById("drawer-filter-dept").value;

    drawerFilteredData = rawData.filter(item => {
        // Text search match
        let textMatch = true;
        if (searchVal !== "") {
            if (item.name) textMatch = textMatch && item.name.toLowerCase().includes(searchVal);
            if (item.id) textMatch = textMatch || item.id.toLowerCase().includes(searchVal);
            if (item.phone) textMatch = textMatch || item.phone.toLowerCase().includes(searchVal);
            if (item.company) textMatch = textMatch || item.company.toLowerCase().includes(searchVal);
            if (item.hostName) textMatch = textMatch || item.hostName.toLowerCase().includes(searchVal);
            if (item.reason) textMatch = textMatch || item.reason.toLowerCase().includes(searchVal);
        }

        // Filters select match
        let purposeMatch = true;
        if (purposeVal !== "all" && item.purpose) {
            purposeMatch = item.purpose === purposeVal;
        }

        let deptMatch = true;
        if (deptVal !== "all") {
            if (item.hostDept) deptMatch = item.hostDept === deptVal;
            else if (item.department) deptMatch = item.department === deptVal;
        }

        return textMatch && purposeMatch && deptMatch;
    });

    // 3. Render analytical headers
    const totalCount = rawData.length;
    const filteredCount = drawerFilteredData.length;
    const percentage = totalCount > 0 ? Math.round((filteredCount / totalCount) * 100) : 0;

    // Count today's items
    const todayStr = getLocalDateStr();
    let todayCount = 0;
    drawerFilteredData.forEach(item => {
        const itemDate = item.visitDate || item.dateAdded || (item.createdDate ? item.createdDate.split("T")[0] : null);
        if (itemDate === todayStr) todayCount++;
    });

    document.getElementById("drawer-stat-total").innerText = filteredCount;
    document.getElementById("drawer-stat-percentage").innerText = `${percentage}%`;
    document.getElementById("drawer-stat-today").innerText = todayCount;

    // 4. Render headers & pagination parameters
    renderDrawerTableHeaders(segment);
    renderDrawerTable();

    // 5. Render Chart analytics inside drawer
    renderDrawerSubChart(segment, drawerFilteredData);
}

function renderDrawerTableHeaders(segment) {
    const thead = document.getElementById("drawer-table-head");
    thead.innerHTML = "";

    const tr = document.createElement("tr");
    if (["waiting", "pending", "inside", "exited", "rejected", "today", "frequent"].includes(segment)) {
        tr.innerHTML = `
            <th>Visitor ID</th>
            <th>Name & Company</th>
            <th>Host Details</th>
            <th>Time Info</th>
            <th>Status</th>
            <th>Actions</th>
        `;
    } else if (segment === "blacklisted") {
        tr.innerHTML = `
            <th>ID</th>
            <th>Blacklisted Person</th>
            <th>Phone</th>
            <th>Credentials</th>
            <th>Reason</th>
            <th>Date Added</th>
        `;
    } else if (segment.startsWith("pm-")) {
        tr.innerHTML = `
            <th>PM ID</th>
            <th>Department</th>
            <th>Agent Name</th>
            <th>Vendor Company</th>
            <th>Contract Type</th>
            <th>Status</th>
        `;
    } else if (segment === "permits") {
        tr.innerHTML = `
            <th>Permit ID</th>
            <th>PM Ref ID</th>
            <th>Contractor Details</th>
            <th>Work Department</th>
            <th>Validity Dates</th>
            <th>Status</th>
        `;
    }
    thead.appendChild(tr);
}

function renderDrawerTable() {
    const tbody = document.getElementById("drawer-table-body");
    tbody.innerHTML = "";

    const totalRecords = drawerFilteredData.length;
    const totalPages = Math.ceil(totalRecords / drawerPageSize);

    // Adjust current page if out of bounds
    if (drawerCurrentPage >= totalPages && totalPages > 0) {
        drawerCurrentPage = totalPages - 1;
    }

    const startIdx = drawerCurrentPage * drawerPageSize;
    const endIdx = Math.min(startIdx + drawerPageSize, totalRecords);
    const visiblePageData = drawerFilteredData.slice(startIdx, endIdx);

    // Update pagination labels
    const paginationText = document.querySelector("#drawer-pagination-info span");
    if (paginationText) {
        if (totalRecords === 0) {
            paginationText.innerText = "Showing 0 to 0 of 0 entries";
        } else {
            paginationText.innerText = `Showing ${startIdx + 1} to ${endIdx} of ${totalRecords} entries`;
        }
    }

    if (visiblePageData.length === 0) {
        const colSpan = document.getElementById("drawer-table-head").querySelectorAll("th").length || 6;
        tbody.innerHTML = `
            <tr>
                <td colspan="${colSpan}" class="empty-state" style="text-align: center; padding: 2rem;">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">📁</div>
                    <p>No matching details found inside this card category.</p>
                </td>
            </tr>
        `;
        return;
    }

    const segment = drawerActiveKpi.segment;
    visiblePageData.forEach(item => {
        const tr = document.createElement("tr");

        if (["waiting", "pending", "inside", "exited", "rejected", "today", "frequent"].includes(segment)) {
            const timeVal = item.checkIn ? new Date(item.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (item.visitDate || "Pending approval");
            tr.innerHTML = `
                <td><code>${item.id}</code></td>
                <td>
                    <div style="font-weight:600;">${item.name}</div>
                    <div class="text-secondary text-xs">${item.company || 'Private'} | ${item.phone}</div>
                </td>
                <td>
                    <div>${item.hostName}</div>
                    <div class="text-secondary text-xs">${item.hostDept} (${item.purpose})</div>
                </td>
                <td>
                    <div>${timeVal}</div>
                    <div class="text-secondary text-xs">Exit: ${item.expectedExit || '?'}</div>
                </td>
                <td><span class="badge-status ${item.status.toLowerCase()}">${item.status}</span></td>
                <td>
                    <div class="flex gap-1">
                        ${item.status === "Pending" ? `
                            <button class="btn btn-accent btn-sm" onclick="approveEntryAction('${item.id}'); renderDrawerContent();">Approve</button>
                        ` : ''}
                        ${item.status === "Checked In" ? `
                            <button class="btn btn-secondary btn-sm" onclick="checkoutVisitorById('${item.id}'); renderDrawerContent();">Check-Out</button>
                        ` : ''}
                        <button class="btn btn-secondary btn-sm" onclick="viewPrintPassModal('${item.id}')">Badge</button>
                    </div>
                </td>
            `;
        } else if (segment === "blacklisted") {
            tr.innerHTML = `
                <td><code>${item.id}</code></td>
                <td><strong>${item.name}</strong></td>
                <td>${item.phone}</td>
                <td><span class="text-xs">${item.idType}: ${item.idNumber}</span></td>
                <td><span class="text-xs text-danger" style="color:var(--accent-danger); font-weight:500;">${item.reason}</span></td>
                <td>${item.dateAdded}</td>
            `;
        } else if (segment.startsWith("pm-")) {
            tr.innerHTML = `
                <td><code>${item.id}</code></td>
                <td><strong>${item.department}</strong></td>
                <td>${item.agentName}</td>
                <td>${item.companyName}</td>
                <td><span class="text-xs">${item.contractType}</span></td>
                <td><span class="badge-status ${item.status.toLowerCase()}">${item.status}</span></td>
            `;
        } else if (segment === "permits") {
            tr.innerHTML = `
                <td><code>${item.id}</code></td>
                <td><code>${item.pmId}</code></td>
                <td>
                    <div style="font-weight:600;">${item.contractorName}</div>
                    <div class="text-secondary text-xs">${item.vendorCompany}</div>
                </td>
                <td>${item.workDepartment}</td>
                <td><span class="text-xs">${item.startDate} to ${item.endDate}</span></td>
                <td><span class="badge-status ${item.status.toLowerCase()}">${item.status}</span></td>
            `;
        }
        tbody.appendChild(tr);
    });
}

function renderDrawerSubChart(segment, dataList) {
    const chartContainer = document.getElementById("drawer-chart-container");
    if (!chartContainer || typeof Chart === 'undefined') return;

    if (dataList.length === 0) {
        chartContainer.style.display = "none";
        return;
    }

    chartContainer.style.display = "block";
    const ctx = document.getElementById("chart-drawer-sub");
    if (!ctx) return;

    if (drawerChartInstance) {
        drawerChartInstance.destroy();
    }

    // Determine aggregations based on category
    let labels = [];
    let data = [];
    let labelText = "Frequency Count";

    if (["waiting", "pending", "inside", "exited", "rejected", "today", "frequent"].includes(segment)) {
        // Group by Purpose
        const purposeCounts = {};
        dataList.forEach(v => {
            const p = v.purpose || "Other";
            purposeCounts[p] = (purposeCounts[p] || 0) + 1;
        });
        labels = Object.keys(purposeCounts);
        data = Object.values(purposeCounts);
        labelText = "Purpose of Visit";
    } else if (segment === "blacklisted") {
        // Group by reason keywords
        const reasonCounts = { "Unauthorized Entry": 0, "Behavior Issues": 0, "ID Mismatch": 0, "Others": 0 };
        dataList.forEach(b => {
            const r = b.reason.toLowerCase();
            if (r.includes("photograph") || r.includes("unauthorized") || r.includes("trespass")) reasonCounts["Unauthorized Entry"]++;
            else if (r.includes("behavior") || r.includes("hostile") || r.includes("fight")) reasonCounts["Behavior Issues"]++;
            else if (r.includes("identity") || r.includes("refused") || r.includes("fake")) reasonCounts["ID Mismatch"]++;
            else reasonCounts["Others"]++;
        });
        labels = Object.keys(reasonCounts);
        data = Object.values(reasonCounts);
        labelText = "Security Block Category";
    } else {
        // Group by Department
        const deptCounts = {};
        dataList.forEach(item => {
            const d = item.hostDept || item.department || item.workDepartment || "Other";
            deptCounts[d] = (deptCounts[d] || 0) + 1;
        });
        labels = Object.keys(deptCounts);
        data = Object.values(deptCounts);
        labelText = "Operational Department";
    }

    drawerChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: labelText,
                data: data,
                backgroundColor: ['#3b82f6', '#10b981', '#fbbf24', '#ef4444', '#a855f7', '#64748b'],
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
        }
    });
}

function animateDashboardStats() {
    const elements = [
        "stat-waiting", "stat-pending", "stat-active-in", "stat-checked-out",
        "stat-rejected", "stat-blacklisted", "stat-frequent", "stat-total-today",
        "stat-pm-draft", "stat-pm-pending", "stat-pm-approved", "stat-pm-rejected",
        "stat-active-permits"
    ];

    elements.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;

        const target = parseInt(el.innerText) || 0;
        if (target === 0) return;

        let current = 0;
        const duration = 800; // ms
        const stepTime = Math.max(10, Math.floor(duration / target));

        el.innerText = "0";
        const timer = setInterval(() => {
            current += Math.ceil(target / 40) || 1;
            if (current >= target) {
                el.innerText = target;
                clearInterval(timer);
            } else {
                el.innerText = current;
            }
        }, stepTime);
    });
}

function exportDrawerDataCSV() {
    if (drawerFilteredData.length === 0) {
        showToast("Export Failed", "No records found in current filters to export.", "warning");
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    const headers = Object.keys(drawerFilteredData[0]).filter(k => k !== 'photo');
    csvContent += headers.join(",") + "\n";

    drawerFilteredData.forEach(row => {
        const values = headers.map(header => {
            const val = row[header] === null || row[header] === undefined ? "" : String(row[header]).replace(/"/g, '""');
            return `"${val}"`;
        });
        csvContent += values.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `VMS_Card_Report_${drawerActiveKpi.segment}_${getLocalDateStr()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("CSV Exported", "Detailed records downloaded successfully.", "success");
}

function exportDrawerDataPDF() {
    if (drawerFilteredData.length === 0) {
        showToast("PDF Export Failed", "No records inside card query to print.", "warning");
        return;
    }

    const win = window.open("", "_blank");
    if (!win) {
        showToast("Popup Blocked", "Please permit popups to view and download reports.", "warning");
        return;
    }

    let rowsHtml = "";
    const segment = drawerActiveKpi.segment;

    drawerFilteredData.forEach((r, idx) => {
        rowsHtml += `
            <tr style="border-bottom:1px solid #e2e8f0; font-size:11px;">
                <td style="padding:10px;"><code>${r.id || r.name}</code></td>
                <td style="padding:10px;"><strong>${r.name || r.department || r.id}</strong></td>
                <td style="padding:10px;">${r.company || r.agentName || r.vendorCompany || '?'}</td>
                <td style="padding:10px;">${r.hostName || r.contractType || r.workDepartment || '?'}</td>
                <td style="padding:10px;">${r.checkIn ? new Date(r.checkIn).toLocaleTimeString() : (r.reason || r.startDate || '?')}</td>
                <td style="padding:10px;"><span style="background:#f1f5f9; padding:2px 6px; border-radius:50px; font-weight:bold; font-size:9px;">${r.status || 'Active'}</span></td>
            </tr>
        `;
    });

    win.document.write(`
        <html>
        <head>
            <title>Barani VMS - ${drawerActiveKpi.label} Details</title>
            <style>
                body { font-family: sans-serif; padding: 30px; color: #0f172a; }
                header { display: flex; justify-content: space-between; border-bottom: 2px solid #2563eb; padding-bottom: 10px; margin-bottom: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                th { background-color: #f8fafc; color: #64748b; font-weight: bold; font-size: 10px; border: 1px solid #e2e8f0; padding: 10px; text-align: left; }
                td { border: 1px solid #e2e8f0; }
            </style>
        </head>
        <body>
            <header>
                <div>
                    <h1 style="margin:0; font-size:18px;">${drawerActiveKpi.label} Details Log</h1>
                    <p style="margin:4px 0; font-size:11px; color:#64748b;">Report Generated: ${new Date().toLocaleString()}</p>
                </div>
                <div style="text-align:right;">
                    <h3 style="margin:0; color:#2563eb; font-size:13px;">BARANI HYDRAULICS</h3>
                    <p style="margin:4px 0; font-size:11px; color:#64748b;">Data Count: ${drawerFilteredData.length}</p>
                </div>
            </header>
            <table>
                <thead>
                    <tr>
                        <th>Primary ID</th>
                        <th>Name/Dept</th>
                        <th>Corporate Ref</th>
                        <th>Host/Type</th>
                        <th>Time/Reason</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                </tbody>
            </table>
            <script>window.print();</script>
        </body>
        </html>
    `);
    win.document.close();
}

// ==========================================================================
// 27. SECURITY FEATURE: Sliding Session Timeout and Warning Dialog
// ==========================================================================
let sessionLastActivity = Date.now();
const sessionTimeoutDuration = 15 * 60 * 1000; // 15 minutes
const sessionWarningThreshold = 14 * 60 * 1000; // Warning at 14 minutes (60s before expiry)
let sessionWarningActive = false;
let sessionCountdownInterval = null;
let sessionWarningTimeRemaining = 60;

function initSessionTimeoutTracker() {
    console.log("[VMS Security] Active session sliding timeout tracker initialized.");

    // Activity indicators
    const resetSessionActivity = () => {
        if (!state.currentUser) return; // only track while logged in
        sessionLastActivity = Date.now();
        if (sessionWarningActive) {
            sessionWarningActive = false;
            document.getElementById("modal-session-timeout")?.classList.remove("active");
            clearInterval(sessionCountdownInterval);
        }
    };

    window.addEventListener("mousemove", resetSessionActivity);
    window.addEventListener("keydown", resetSessionActivity);
    window.addEventListener("click", resetSessionActivity);
    window.addEventListener("scroll", resetSessionActivity);

    // Main sliding monitor interval (runs every 5 seconds)
    setInterval(() => {
        if (!state.currentUser) return; // not logged in

        const inactiveTime = Date.now() - sessionLastActivity;

        if (inactiveTime >= sessionTimeoutDuration) {
            // Force Log out
            clearInterval(sessionCountdownInterval);
            document.getElementById("modal-session-timeout")?.classList.remove("active");
            handleLogoutClick();
            showToast("Session Expired", "You have been logged out due to inactivity.", "danger");
            addAuditLog("Session Expired", "System", `Automatic logout due to 15 minutes of inactivity.`);
        }
        else if (inactiveTime >= sessionWarningThreshold && !sessionWarningActive) {
            // Trigger 60s warning modal
            sessionWarningActive = true;
            sessionWarningTimeRemaining = Math.ceil((sessionTimeoutDuration - inactiveTime) / 1000);

            const modal = document.getElementById("modal-session-timeout");
            const counter = document.getElementById("timeout-seconds-counter");
            if (modal && counter) {
                counter.innerText = sessionWarningTimeRemaining;
                modal.classList.add("active");

                // Secondary countdown ticker
                sessionCountdownInterval = setInterval(() => {
                    sessionWarningTimeRemaining--;
                    if (sessionWarningTimeRemaining <= 0) {
                        clearInterval(sessionCountdownInterval);
                    } else {
                        counter.innerText = sessionWarningTimeRemaining;
                    }
                }, 1000);
            }
        }
    }, 5000);

    // Connect keep alive button
    const btnKeepAlive = document.getElementById("btn-session-keep-alive");
    if (btnKeepAlive) {
        btnKeepAlive.onclick = () => {
            resetSessionActivity();
            showToast("Session Renewed", "Your security session has been extended for another 15 minutes.", "success");
        };
    }



    window.waAssistShareDirect = async function () {
        if (!state.activeWaVisitor || !state.activeWaImage) return;
        const cleanPhone = state.activeWaVisitor.phone.replace(/[^0-9]/g, '');
        const waPhone = cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone;
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const waMessage = [
            '*Welcome to Barani Hydraulics India Pvt. Ltd!*',
            '',
            'Your visit has been *APPROVED*.',
            '',
            '*Visitor ID:* ' + state.activeWaVisitor.id,
            '*Name:* ' + state.activeWaVisitor.name,
            '*Host:* ' + state.activeWaVisitor.hostName + ' - ' + state.activeWaVisitor.hostDept,
            '*Purpose:* ' + (state.activeWaVisitor.purpose || 'Meeting'),
            '*Entry Time:* ' + timeStr,
            '*Exit Time:* ' + (state.activeWaVisitor.expectedExit || '06:00 PM'),
            '',
            '_Barani Hydraulics VMS_'
        ].join('\n');

        const passBlob = dataURLtoBlob(state.activeWaImage);
        const passFile = passBlob ? new File([passBlob], 'Barani_Visitor_Pass_' + state.activeWaVisitor.id + '.png', { type: 'image/png' }) : null;

        if (passFile && navigator.share && navigator.canShare && navigator.canShare({ files: [passFile] })) {
            try {
                await navigator.share({
                    title: 'Visitor Pass — ' + state.activeWaVisitor.name,
                    text: waMessage,
                    files: [passFile]
                });
                showToast('Pass Shared ✅', 'Shared directly.', 'success');
                addAuditLog('WhatsApp Direct Share', 'Communications', 'Shared pass image via Web Share API for ' + state.activeWaVisitor.name);
            } catch (shareErr) {
                if (shareErr.name !== 'AbortError') {
                    console.warn('[VMS] Web Share failed:', shareErr);
                    showToast('Share Failed', 'Could not share file directly.', 'danger');
                }
            }
        } else {
            showToast('Not Supported', 'Web Share is not supported on this browser/device.', 'warning');
        }
    };

    window.waAssistCopyImage = async function () {
        if (!state.activeWaImage) return;
        const passBlob = dataURLtoBlob(state.activeWaImage);
        if (passBlob && window.ClipboardItem && navigator.clipboard && navigator.clipboard.write) {
            try {
                await navigator.clipboard.write([new ClipboardItem({ 'image/png': passBlob })]);
                showToast('✅ Pass Copied!', 'Visitor pass image copied to clipboard. Press Ctrl+V in WhatsApp to paste.', 'success');

                const copyBtn = document.getElementById("wa-assist-btn-copy");
                if (copyBtn) {
                    copyBtn.classList.remove("btn-primary");
                    copyBtn.classList.add("btn-success");
                    copyBtn.innerHTML = `
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-icon">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Copied!
                    `;
                    setTimeout(() => {
                        copyBtn.classList.remove("btn-success");
                        copyBtn.classList.add("btn-primary");
                        copyBtn.innerHTML = `
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-icon">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                            Copy Pass Image
                        `;
                    }, 3000);
                }
            } catch (clipErr) {
                console.warn('[VMS] Clipboard write failed:', clipErr);
                showToast('Copy Failed', 'Failed to copy image to clipboard.', 'danger');
            }
        } else {
            showToast('Not Supported', 'Clipboard writing is not supported in this browser.', 'warning');
        }
    };

    window.waAssistOpenWhatsApp = function () {
        if (!state.activeWaVisitor) return;
        const cleanPhone = state.activeWaVisitor.phone.replace(/[^0-9]/g, '');
        const waPhone = cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone;
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const waMessage = [
            '*Welcome to Barani Hydraulics India Pvt. Ltd!*',
            '',
            'Your visit has been *APPROVED*.',
            '',
            '*Visitor ID:* ' + state.activeWaVisitor.id,
            '*Name:* ' + state.activeWaVisitor.name,
            '*Host:* ' + state.activeWaVisitor.hostName + ' - ' + state.activeWaVisitor.hostDept,
            '*Purpose:* ' + (state.activeWaVisitor.purpose || 'Meeting'),
            '*Entry Time:* ' + timeStr,
            '*Exit Time:* ' + (state.activeWaVisitor.expectedExit || '06:00 PM'),
            '',
            '_Barani Hydraulics VMS_'
        ].join('\n');

        const waUrl = 'https://api.whatsapp.com/send?phone=' + waPhone + '&text=' + encodeURIComponent(waMessage);
        window.open(waUrl, '_blank', 'noopener,noreferrer');
        showToast('WhatsApp Opened ↗', 'Redirecting to chat...', 'success');
    };
}

// ==========================================================================
// Smart Existing Visitor Search & Auto-Fill Upgrades
// ==========================================================================

window.lastSearchResults = { student: new Map(), customer: new Map(), vendor: new Map() };

function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

window.setupFormSearchListeners = function (category) {
    const fields = [];
    if (category === "student") {
        fields.push("reg-student-name", "reg-student-phone", "reg-student-email", "reg-student-rollno");
    } else if (category === "customer") {
        fields.push("reg-customer-name", "reg-customer-phone", "reg-customer-email", "reg-customer-company", "reg-customer-id", "reg-customer-id-number");
    } else if (category === "vendor") {
        fields.push("reg-vendor-name", "reg-vendor-phone", "reg-vendor-company", "reg-vendor-id-number");
    }

    const onInput = debounce((e) => {
        const val = e.target.value.trim();
        const q = val.toLowerCase();

        if (q.length < 3) {
            const container = document.getElementById(`search-results-${category}-wrapper`);
            if (container) container.classList.add("hidden");
            return;
        }

        const uniqueMatches = new Map();

        let masterList = [];
        if (category === "student") masterList = state.studentMaster || [];
        else if (category === "customer") masterList = state.customerMaster || [];
        else if (category === "vendor") masterList = state.vendorMaster || [];

        function isMatch(v) {
            if (!v) return false;

            const cleanQ = q.replace(/[\s\-\(\)\+]/g, "");
            const phone = (v.phone || "").toLowerCase();
            const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, "");
            const name = (v.name || "").toLowerCase();
            const email = (v.email || "").toLowerCase();
            const idNumber = (v.idNumber || v.rollNumber || "").toLowerCase();
            const cleanIdNumber = idNumber.replace(/[\s\-\(\)\+]/g, "");
            const id = (v.id || v.masterId || v.studentId || v.customerId || v.vendorId || "").toLowerCase();
            const cleanId = id.replace(/[\s\-\(\)\+]/g, "");

            return phone.includes(q) || (cleanQ.length > 0 && cleanPhone.includes(cleanQ)) ||
                name.includes(q) ||
                email.includes(q) ||
                idNumber.includes(q) || (cleanQ.length > 0 && cleanIdNumber.includes(cleanQ)) ||
                id.includes(q) || (cleanQ.length > 0 && cleanId.includes(cleanQ));
        }

        masterList.forEach(m => {
            if (isMatch(m)) {
                const key = m.phone || m.studentId || m.customerId || m.vendorId;
                uniqueMatches.set(key, {
                    name: m.name,
                    phone: m.phone,
                    email: m.email || "",
                    category: category.charAt(0).toUpperCase() + category.slice(1),
                    company: m.company || m.college || "",
                    lastVisit: "Registered",
                    status: "Master Profile",
                    photo: m.photo || "",
                    idNumber: m.idNumber || m.rollNumber || "",
                    idType: m.idType || (category === "student" ? "College ID" : ""),
                    raw: m
                });
            }
        });

        if (state.visitors) {
            state.visitors.forEach(v => {
                const isCategory = (category === "student" && (v.purpose === "Student" || (v.masterId && v.masterId.startsWith("STU")))) ||
                    (category === "customer" && (v.purpose === "Customer" || (v.masterId && v.masterId.startsWith("CUST")))) ||
                    (category === "vendor" && (v.purpose === "Vendor" || (v.masterId && v.masterId.startsWith("VND"))));

                if (isCategory && isMatch(v)) {
                    const key = v.phone || v.masterId || v.id;
                    const lastVisitDate = v.visitDate || (v.checkIn ? v.checkIn.substring(0, 10) : "");

                    if (uniqueMatches.has(key)) {
                        const existing = uniqueMatches.get(key);
                        if (existing.lastVisit === "Registered" || new Date(lastVisitDate) > new Date(existing.lastVisit)) {
                            existing.lastVisit = lastVisitDate;
                            existing.status = v.status;
                            if (v.photo && !existing.photo) {
                                existing.photo = v.photo;
                            }
                            existing.raw = { ...existing.raw, ...v };
                        }
                    } else {
                        uniqueMatches.set(key, {
                            name: v.name,
                            phone: v.phone,
                            email: v.email || "",
                            category: category.charAt(0).toUpperCase() + category.slice(1),
                            company: v.company || "",
                            lastVisit: lastVisitDate || "N/A",
                            status: v.status || "N/A",
                            photo: v.photo || "",
                            idNumber: v.idNumber || "",
                            idType: v.idType || "",
                            raw: v
                        });
                    }
                }
            });
        }

        window.lastSearchResults[category] = uniqueMatches;

        const tbody = document.getElementById(`search-results-${category}-list`);
        const container = document.getElementById(`search-results-${category}-wrapper`);

        if (!tbody || !container) return;

        if (uniqueMatches.size === 0) {
            container.classList.add("hidden");
            return;
        }

        tbody.innerHTML = "";
        uniqueMatches.forEach((visitor, key) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${visitor.name}</strong></td>
                <td>${visitor.phone}</td>
                <td><span class="badge-status active" style="font-size:0.65rem;">${visitor.category}</span></td>
                <td>${visitor.company}</td>
                <td>${visitor.lastVisit}</td>
                <td><span class="badge-status ${visitor.status.toLowerCase().replace(/ /g, "-")}">${visitor.status}</span></td>
                <td style="text-align: center;">
                    <div style="display: flex; gap: 4px; justify-content: center;">
                        <button type="button" class="btn btn-primary btn-xs" onclick="useExistingVisitorData('${category}', '${key}')" style="padding: 2px 6px; font-size: 0.7rem; margin:0;">Use Data</button>
                        <button type="button" class="btn btn-secondary btn-xs" onclick="viewVisitorHistory('${category}', '${key}')" style="padding: 2px 6px; font-size: 0.7rem; margin:0;">History</button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
        container.classList.remove("hidden");

    }, 300);

    fields.forEach(fieldId => {
        const el = document.getElementById(fieldId);
        if (el) {
            el.addEventListener("input", onInput);
        }
    });
};

window.useExistingVisitorData = function (category, key) {
    const results = window.lastSearchResults[category];
    if (!results) return;
    const visitor = results.get(key);
    if (!visitor) return;

    const data = visitor.raw;

    if (category === "student") {
        document.getElementById("reg-student-name").value = data.name || "";
        document.getElementById("reg-student-phone").value = data.phone || "";
        document.getElementById("reg-student-email").value = data.email || "";
        document.getElementById("reg-student-college").value = data.company || data.college || "";
        document.getElementById("reg-student-dept").value = data.department || "";
        document.getElementById("reg-student-rollno").value = data.rollNumber || data.idNumber || "";
        document.getElementById("reg-student-purpose").value = data.purpose || "Student";
        if (data.hostName) document.getElementById("reg-student-host").value = data.hostName;
        if (data.startDate) document.getElementById("reg-student-start-date").value = data.startDate;
        if (data.endDate) document.getElementById("reg-student-end-date").value = data.endDate;

        document.getElementById("reg-student-name").readOnly = true;
        document.getElementById("reg-student-phone").readOnly = true;
        document.getElementById("reg-student-email").readOnly = true;
        document.getElementById("reg-student-college").readOnly = true;
        document.getElementById("reg-student-dept").readOnly = true;
        document.getElementById("reg-student-rollno").readOnly = true;
        document.getElementById("reg-student-start-date").readOnly = true;
        document.getElementById("reg-student-end-date").readOnly = true;

        const alertBadge = document.getElementById("student-badge-alert");
        if (alertBadge) alertBadge.classList.remove("hidden");

    } else if (category === "customer") {
        document.getElementById("reg-customer-name").value = data.name || "";
        document.getElementById("reg-customer-phone").value = data.phone || "";
        document.getElementById("reg-customer-email").value = data.email || "";
        document.getElementById("reg-customer-company").value = data.company || "";
        document.getElementById("reg-customer-id").value = data.masterId || data.customerId || "";
        document.getElementById("reg-customer-purpose").value = data.purpose || "";
        document.getElementById("reg-customer-id-type").value = data.idType || "";
        document.getElementById("reg-customer-id-number").value = data.idNumber || "";
        document.getElementById("reg-customer-vehicle").value = data.vehicle || "";
        if (data.hostName) document.getElementById("reg-customer-host").value = data.hostName;

        document.getElementById("reg-customer-name").readOnly = true;
        document.getElementById("reg-customer-phone").readOnly = true;
        document.getElementById("reg-customer-email").readOnly = true;
        document.getElementById("reg-customer-company").readOnly = true;
        document.getElementById("reg-customer-id").readOnly = true;

        const alertBadge = document.getElementById("customer-badge-alert");
        if (alertBadge) alertBadge.classList.remove("hidden");

    } else if (category === "vendor") {
        document.getElementById("reg-vendor-name").value = data.name || "";
        document.getElementById("reg-vendor-phone").value = data.phone || "";
        document.getElementById("reg-vendor-company").value = data.company || "";
        document.getElementById("reg-vendor-invoice").value = data.address && data.address.startsWith("Delivery Invoice:") ? data.address.replace("Delivery Invoice: ", "") : "";
        document.getElementById("reg-vendor-id-type").value = data.idType || "";
        document.getElementById("reg-vendor-id-number").value = data.idNumber || "";
        document.getElementById("reg-vendor-vehicle").value = data.vehicle || "";
        if (data.hostName) document.getElementById("reg-vendor-host").value = data.hostName;

        document.getElementById("reg-vendor-name").readOnly = true;
        document.getElementById("reg-vendor-phone").readOnly = true;
        document.getElementById("reg-vendor-company").readOnly = true;

        const alertBadge = document.getElementById("vendor-badge-alert");
        if (alertBadge) alertBadge.classList.remove("hidden");
    }

    if (data.photo) {
        const preview = document.getElementById(`photo-preview-${category}`);
        if (preview) preview.src = data.photo;
        state.tempVisitorPhoto = data.photo;

        const status = document.getElementById(`camera-status-${category}`);
        if (status) status.textContent = "Existing Photo Loaded";

        const optionsDiv = document.getElementById(`photo-options-${category}`);
        if (optionsDiv) {
            optionsDiv.classList.remove("hidden");
            const btnExisting = document.getElementById(`btn-existing-photo-${category}`);
            const btnNew = document.getElementById(`btn-new-photo-${category}`);
            if (btnExisting && btnNew) {
                btnExisting.className = "btn btn-success btn-xs";
                btnNew.className = "btn btn-secondary btn-xs";
            }
        }
    }

    window.viewVisitorHistory(category, key);

    showToast("Profile Loaded", `Welcome back, ${data.name}! Data auto-filled.`, "success");
};

window.viewVisitorHistory = function (category, key) {
    const results = window.lastSearchResults[category];
    if (!results) return;
    const visitor = results.get(key);
    if (!visitor) return;

    const phone = visitor.phone;
    const masterId = visitor.raw.masterId || visitor.raw.studentId || visitor.raw.customerId || visitor.raw.vendorId;

    if (!state.visitors) return;

    const history = state.visitors.filter(v =>
        (v.phone && v.phone === phone) ||
        (v.masterId && v.masterId === masterId)
    );

    history.sort((a, b) => {
        const dateA = a.checkIn || a.visitDate || "";
        const dateB = b.checkIn || b.visitDate || "";
        return dateB.localeCompare(dateA);
    });

    const tbody = document.getElementById(`visit-history-${category}-list`);
    const container = document.getElementById(`visit-history-${category}-wrapper`);

    if (!tbody || !container) return;

    tbody.innerHTML = "";
    if (history.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;" class="text-secondary">No previous visit history found.</td></tr>`;
    } else {
        history.forEach(h => {
            const tr = document.createElement("tr");
            const checkInTime = h.checkIn ? new Date(h.checkIn).toLocaleString() : "-";
            const checkOutTime = h.checkOut ? new Date(h.checkOut).toLocaleString() : "-";
            tr.innerHTML = `
                <td><strong>${h.name}</strong></td>
                <td>${h.phone}</td>
                <td><span class="badge-status active" style="font-size:0.65rem;">${h.purpose}</span></td>
                <td>${h.company || "-"}</td>
                <td>${h.hostName || "-"}</td>
                <td><span class="text-xs">${checkInTime}</span></td>
                <td><span class="text-xs">${checkOutTime}</span></td>
                <td><span class="badge-status ${h.status.toLowerCase().replace(/ /g, "-")}">${h.status}</span></td>
                <td>${h.visitDate || "-"}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    container.classList.remove("hidden");
};

window.setupPhotoChoiceListeners = function (category) {
    const btnExisting = document.getElementById(`btn-existing-photo-${category}`);
    const btnNew = document.getElementById(`btn-new-photo-${category}`);

    if (btnExisting) {
        btnExisting.addEventListener("click", () => {
            btnExisting.className = "btn btn-success btn-xs";
            if (btnNew) btnNew.className = "btn btn-secondary btn-xs";

            const visitor = window.lastMatchedVisitor && window.lastMatchedVisitor[category];
            if (visitor && visitor.photo) {
                const preview = document.getElementById(`photo-preview-${category}`);
                if (preview) preview.src = visitor.photo;
                state.tempVisitorPhoto = visitor.photo;

                const status = document.getElementById(`camera-status-${category}`);
                if (status) status.textContent = "Using Existing Photo";
            }

            if (state.cameraStream) {
                state.cameraStream.getTracks().forEach(track => track.stop());
                state.cameraStream = null;
            }
            const video = document.getElementById(`camera-stream-${category}`);
            if (video) video.classList.add("hidden");
        });
    }

    if (btnNew) {
        btnNew.addEventListener("click", () => {
            btnNew.className = "btn btn-success btn-xs";
            if (btnExisting) btnExisting.className = "btn btn-secondary btn-xs";

            state.tempVisitorPhoto = "";
            const preview = document.getElementById(`photo-preview-${category}`);
            if (preview) preview.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='1.5'><path d='M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z'/><circle cx='12' cy='13' r='4'/></svg>";

            const status = document.getElementById(`camera-status-${category}`);
            if (status) status.textContent = "Camera Ready";

            initCategoryCamera(category);
        });
    }
};

window.bindAutoSearchListeners = function () {
    const categories = ["student", "customer", "vendor"];
    categories.forEach(cat => {
        const input = document.getElementById(`search-visitor-${cat}`);
        if (input) {
            input.addEventListener("input", async (e) => {
                const val = e.target.value.trim();
                await handleInstantVisitorSearch(cat, val);
            });
        }
    });
};

async function handleInstantVisitorSearch(category, queryVal) {
    const statusBadge = document.getElementById(`search-status-badge-${category}`);
    if (!queryVal || queryVal.length < 3) {
        if (statusBadge) {
            statusBadge.style.display = "none";
        }
        unlockCategoryFormFields(category);
        clearCategoryFormFields(category);
        return;
    }

    let match = null;
    const qLower = queryVal.toLowerCase();

    // Search local master arrays
    if (category === "student") {
        match = state.studentMaster.find(s =>
            (s.phone && s.phone.includes(queryVal)) ||
            (s.rollNumber && s.rollNumber.toLowerCase().includes(qLower)) ||
            (s.studentId && s.studentId.toLowerCase().includes(qLower)) ||
            (s.email && s.email.toLowerCase().includes(qLower)) ||
            (s.aadhaar && s.aadhaar.includes(queryVal))
        );
    } else if (category === "customer") {
        match = state.customerMaster.find(c =>
            (c.phone && c.phone.includes(queryVal)) ||
            (c.customerId && c.customerId.toLowerCase().includes(qLower)) ||
            (c.company && c.company.toLowerCase().includes(qLower)) ||
            (c.email && c.email.toLowerCase().includes(qLower)) ||
            (c.aadhaar && c.aadhaar.includes(queryVal))
        );
    } else if (category === "vendor") {
        match = state.vendorMaster.find(v =>
            (v.phone && v.phone.includes(queryVal)) ||
            (v.vendorId && v.vendorId.toLowerCase().includes(qLower)) ||
            (v.company && v.company.toLowerCase().includes(qLower)) ||
            (v.email && v.email.toLowerCase().includes(qLower)) ||
            (v.aadhaar && v.aadhaar.includes(queryVal))
        );
    }

    // Search state.visitors (local log list) if not found in master
    if (!match && state.visitors) {
        match = state.visitors.find(v =>
            (v.phone && v.phone.includes(queryVal)) ||
            (v.idNumber && v.idNumber.toLowerCase().includes(qLower)) ||
            (v.email && v.email.toLowerCase().includes(qLower)) ||
            (v.name && v.name.toLowerCase().includes(qLower)) ||
            (v.company && v.company.toLowerCase().includes(qLower))
        );
    }

    // Search Supabase instantly
    if (!match && supabaseClient) {
        try {
            const { data, error } = await supabaseClient
                .from('visitors')
                .select('*')
                .or(`phone.eq.${queryVal},id_number.eq.${queryVal},visitor_code.eq.${queryVal}`)
                .limit(1);
            if (!error && data && data.length > 0) {
                match = mapVisitorFromDb(data[0]);
            }
        } catch (err) {
            console.error("Supabase search error:", err);
        }
    }

    if (match) {
        window.lastMatchedVisitor[category] = match;
        // Automatically fill the fields
        autoFillVisitorFields(category, match);

        if (statusBadge) {
            statusBadge.style.display = "block";
            statusBadge.style.backgroundColor = "rgba(22, 163, 74, 0.1)";
            statusBadge.style.color = "var(--accent-success)";
            statusBadge.innerHTML = `✅ Returning ${category} profile loaded automatically!<br><span style="font-size: 0.75rem; font-weight: normal; color: var(--text-secondary);">Fields populated. You can edit them if needed.</span>`;
        }

        // Allow Replace Photo button if needed
        const photoOptions = document.getElementById(`photo-options-${category}`);
        if (photoOptions) {
            photoOptions.classList.remove("hidden");
        }
    } else {
        // No match found
        unlockCategoryFormFields(category);
        if (statusBadge) {
            statusBadge.style.display = "block";
            statusBadge.style.backgroundColor = "rgba(37, 99, 235, 0.1)";
            statusBadge.style.color = "var(--accent-primary)";
            statusBadge.innerHTML = `🆕 New Visitor<br><span style="font-size: 0.75rem; font-weight: normal; color: var(--text-secondary);">Complete the remaining details.</span>`;
        }
    }
}

function autoFillVisitorFields(category, v) {
    if (category === "student") {
        document.getElementById("reg-student-name").value = v.name || "";
        document.getElementById("reg-student-phone").value = v.phone || "";
        document.getElementById("reg-student-email").value = v.email || "";
        document.getElementById("reg-student-college").value = v.college || v.company || "";
        document.getElementById("reg-student-company").value = v.company || "";
        document.getElementById("reg-student-dept").value = v.department || v.hostDept || "";
        document.getElementById("reg-student-rollno").value = v.rollNumber || v.idNumber || "";
        document.getElementById("reg-student-visitor-id").value = v.studentId || v.visitorCode || "";
        document.getElementById("reg-student-aadhaar").value = v.aadhaar || v.idNumber || "";
        document.getElementById("reg-student-address").value = v.address || "";
        if (v.purpose) document.getElementById("reg-student-purpose").value = v.purpose;
        document.getElementById("reg-student-host").value = v.hostName || "";

        if (v.photo) {
            const preview = document.getElementById("photo-preview-student");
            if (preview) {
                preview.src = v.photo;
                preview.style.cursor = "pointer";
                preview.title = "Loaded Stored Photo (Click to update/retake)";
                preview.onclick = function () {
                    const status = document.getElementById("camera-status-student");
                    if (status) status.textContent = "Taking new photo...";
                    initCategoryCamera("student");
                };
            }
            state.tempVisitorPhoto = v.photo;
            const status = document.getElementById("camera-status-student");
            if (status) status.textContent = "Loaded Stored Photo (Click to update/retake)";
        }
    } else if (category === "customer") {
        document.getElementById("reg-customer-name").value = v.name || "";
        document.getElementById("reg-customer-phone").value = v.phone || "";
        document.getElementById("reg-customer-email").value = v.email || "";
        document.getElementById("reg-customer-company").value = v.company || "";
        document.getElementById("reg-customer-college").value = v.college || "";
        document.getElementById("reg-customer-dept").value = v.department || v.hostDept || "";
        document.getElementById("reg-customer-id").value = v.customerId || v.masterId || v.visitorCode || "";
        document.getElementById("reg-customer-aadhaar").value = v.aadhaar || v.idNumber || "";
        document.getElementById("reg-customer-address").value = v.address || "";
        if (v.purpose) document.getElementById("reg-customer-purpose").value = v.purpose;
        if (v.idType) document.getElementById("reg-customer-id-type").value = v.idType;
        document.getElementById("reg-customer-id-number").value = v.idNumber || "";
        document.getElementById("reg-customer-vehicle").value = v.vehicle || "";
        document.getElementById("reg-customer-host").value = v.hostName || "";

        if (v.photo) {
            const preview = document.getElementById("photo-preview-customer");
            if (preview) {
                preview.src = v.photo;
                preview.style.cursor = "pointer";
                preview.title = "Loaded Stored Photo (Click to update/retake)";
                preview.onclick = function () {
                    const status = document.getElementById("camera-status-customer");
                    if (status) status.textContent = "Taking new photo...";
                    initCategoryCamera("customer");
                };
            }
            state.tempVisitorPhoto = v.photo;
            const status = document.getElementById("camera-status-customer");
            if (status) status.textContent = "Loaded Stored Photo (Click to update/retake)";
        }
    } else if (category === "vendor") {
        document.getElementById("reg-vendor-name").value = v.name || "";
        document.getElementById("reg-vendor-phone").value = v.phone || "";
        document.getElementById("reg-vendor-email").value = v.email || "";
        document.getElementById("reg-vendor-company").value = v.company || "";
        document.getElementById("reg-vendor-college").value = v.college || "";
        document.getElementById("reg-vendor-dept").value = v.department || v.hostDept || "";
        document.getElementById("reg-vendor-visitor-id").value = v.vendorId || v.masterId || v.visitorCode || "";
        document.getElementById("reg-vendor-invoice").value = v.invoice || "";
        document.getElementById("reg-vendor-aadhaar").value = v.aadhaar || v.idNumber || "";
        document.getElementById("reg-vendor-address").value = v.address || "";
        if (v.idType) document.getElementById("reg-vendor-id-type").value = v.idType;
        document.getElementById("reg-vendor-id-number").value = v.idNumber || "";
        document.getElementById("reg-vendor-vehicle").value = v.vehicle || "";
        document.getElementById("reg-vendor-host").value = v.hostName || "";

        if (v.photo) {
            const preview = document.getElementById("photo-preview-vendor");
            if (preview) {
                preview.src = v.photo;
                preview.style.cursor = "pointer";
                preview.title = "Loaded Stored Photo (Click to update/retake)";
                preview.onclick = function () {
                    const status = document.getElementById("camera-status-vendor");
                    if (status) status.textContent = "Taking new photo...";
                    initCategoryCamera("vendor");
                };
            }
            state.tempVisitorPhoto = v.photo;
            const status = document.getElementById("camera-status-vendor");
            if (status) status.textContent = "Loaded Stored Photo (Click to update/retake)";
        }
    }

    // Call history display function for this category & visitor
    window.displayPreviousVisitHistory(category, v);
}

function clearCategoryFormFields(category) {
    const fields = {
        student: ["reg-student-name", "reg-student-phone", "reg-student-email", "reg-student-college", "reg-student-company", "reg-student-dept", "reg-student-rollno", "reg-student-visitor-id", "reg-student-aadhaar", "reg-student-address", "reg-student-purpose", "reg-student-host"],
        customer: ["reg-customer-name", "reg-customer-phone", "reg-customer-email", "reg-customer-company", "reg-customer-college", "reg-customer-dept", "reg-customer-id", "reg-customer-aadhaar", "reg-customer-address", "reg-customer-purpose", "reg-customer-id-type", "reg-customer-id-number", "reg-customer-vehicle", "reg-customer-host"],
        vendor: ["reg-vendor-name", "reg-vendor-phone", "reg-vendor-email", "reg-vendor-company", "reg-vendor-college", "reg-vendor-dept", "reg-vendor-visitor-id", "reg-vendor-invoice", "reg-vendor-aadhaar", "reg-vendor-address", "reg-vendor-id-type", "reg-vendor-id-number", "reg-vendor-vehicle", "reg-vendor-host"]
    };

    fields[category].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
    });

    const preview = document.getElementById(`photo-preview-${category}`);
    if (preview) {
        preview.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='1.5'><path d='M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z'/><circle cx='12' cy='13' r='4'/></svg>";
        preview.onclick = null;
        preview.style.cursor = "default";
    }
    state.tempVisitorPhoto = "";
    const status = document.getElementById(`camera-status-${category}`);
    if (status) status.textContent = "Camera Inactive";

    const historyWrapper = document.getElementById(`visit-history-${category}-wrapper`);
    if (historyWrapper) historyWrapper.classList.add("hidden");
}

function unlockCategoryFormFields(category) {
    const fields = {
        student: ["reg-student-name", "reg-student-phone", "reg-student-email", "reg-student-college", "reg-student-dept", "reg-student-rollno"],
        customer: ["reg-customer-name", "reg-customer-phone", "reg-customer-email", "reg-customer-company", "reg-customer-id"],
        vendor: ["reg-vendor-name", "reg-vendor-phone", "reg-vendor-company", "reg-vendor-invoice"]
    };

    fields[category].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.readOnly = false;
    });
}

window.displayPreviousVisitHistory = function (category, matchedVisitor) {
    const phone = matchedVisitor.phone;
    const masterId = matchedVisitor.masterId || matchedVisitor.studentId || matchedVisitor.customerId || matchedVisitor.vendorId || matchedVisitor.visitor_code || matchedVisitor.id;

    if (!state.visitors) return;

    const history = state.visitors.filter(v =>
        (v.phone && v.phone === phone) ||
        (v.masterId && v.masterId === masterId)
    );

    // Compute stats
    const totalVisits = history.length;

    // Find last check-in / check-out times
    const checkIns = history.map(h => h.checkIn).filter(Boolean).sort((a, b) => b.localeCompare(a));
    const checkOuts = history.map(h => h.checkOut).filter(Boolean).sort((a, b) => b.localeCompare(a));

    const lastCheckIn = checkIns[0] ? new Date(checkIns[0]).toLocaleString() : "-";
    const lastCheckOut = checkOuts[0] ? new Date(checkOuts[0]).toLocaleString() : "-";

    const tbody = document.getElementById(`visit-history-${category}-list`);
    const container = document.getElementById(`visit-history-${category}-wrapper`);

    if (!tbody || !container) return;

    tbody.innerHTML = "";
    if (history.length === 0) {
        tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;" class="text-secondary">No previous visit history found.</td></tr>`;
    } else {
        history.forEach(h => {
            const tr = document.createElement("tr");
            const photoSrc = h.photo || matchedVisitor.photo || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='1.5'><path d='M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z'/><circle cx='12' cy='13' r='4'/></svg>";
            const visitDate = h.visitDate || "-";
            const statusLabel = h.status || "Pending";

            tr.innerHTML = `
                <td><img src="${photoSrc}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;"></td>
                <td><strong>${h.name}</strong></td>
                <td>${h.phone}</td>
                <td>${h.company || h.college || "-"}</td>
                <td>${h.hostName || "-"}</td>
                <td><span class="text-xs">${visitDate}</span></td>
                <td><span class="badge-status ${statusLabel.toLowerCase().replace(/ /g, "-")}">${statusLabel}</span></td>
                <td>${totalVisits}</td>
                <td><span class="text-xs">${lastCheckIn}</span></td>
                <td><span class="text-xs">${lastCheckOut}</span></td>
            `;
            tbody.appendChild(tr);
        });
    }

    container.classList.remove("hidden");
};