const fs = require('fs');

const appJs = fs.readFileSync('app.js', 'utf8');

const state = {
    currentUser: {
        username: "security",
        name: "Officer Higgins",
        role: "Security Gatekeeper"
    },
    activeView: "view-dashboard"
};

// Extract functions from app.js
const isViewAuthorizedMatch = appJs.match(/function isViewAuthorized\(viewId\) \{[\s\S]*?\n\}/);
console.log("Found isViewAuthorized function in app.js:", !!isViewAuthorizedMatch);

eval(isViewAuthorizedMatch[0]);

console.log("\n=== TESTING ISVIEWAUTHORIZED FOR SECURITY ROLE ===");
const allowedTests = [
    "view-dashboard",
    "view-student-registration",
    "view-customer-registration",
    "view-vendor-registration",
    "view-checkout",
    "view-reports",
    "view-pending-approvals",
    "view-employee-search"
];

const deniedTests = [
    "view-settings",
    "view-data-management",
    "view-work-permit",
    "view-purchase-manual"
];

let allPassed = true;
allowedTests.forEach(v => {
    const res = isViewAuthorized(v);
    console.log(`Allowed View [${v}]: ${res ? "PASSED" : "FAILED"}`);
    if (!res) allPassed = false;
});

deniedTests.forEach(v => {
    const res = isViewAuthorized(v);
    console.log(`Denied View [${v}]: ${!res ? "PASSED (Blocked)" : "FAILED (Allowed)"}`);
    if (res) allPassed = false;
});

console.log(`\nOverall Authorization Test: ${allPassed ? "ALL PASSED" : "HAS FAILURES"}`);
