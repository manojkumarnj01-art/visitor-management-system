const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = fs.readFileSync('index.html', 'utf8');
const dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable" });
const window = dom.window;
const document = window.document;

// Execute app.js in jsdom context
const appJs = fs.readFileSync('app.js', 'utf8');

// Mock localStorage
const localStorageMap = {};
window.localStorage = {
    getItem: (k) => localStorageMap[k] || null,
    setItem: (k, v) => { localStorageMap[k] = String(v); },
    removeItem: (k) => { delete localStorageMap[k]; },
    clear: () => { Object.keys(localStorageMap).forEach(k => delete localStorageMap[k]); }
};

// Evaluate script
window.eval(appJs);

console.log("=== SIMULATING SECURITY USER LOGIN ===");
window.state.currentUser = {
    username: "security",
    name: "Officer Higgins",
    role: "Security Gatekeeper",
    phone: "Ext. 9011",
    shift: "Day Shift"
};

// Call updateUIForRole / initial load logic
window.updateUIForRole();

// Check if visitor-registration-wrapper is visible
const visitorWrapper = document.getElementById("visitor-registration-wrapper");
const visitorWrapperHidden = visitorWrapper ? visitorWrapper.classList.contains("hidden") : true;
console.log("visitor-registration-wrapper hidden?", visitorWrapperHidden, "(Expected: false)");

// Check stats bar elements
const statCheckedOut = document.getElementById("dashboard-stat-checked-out");
const statVisitorsToday = document.getElementById("dashboard-stat-visitors-today");
const statInCampus = document.getElementById("dashboard-stat-in-campus");
console.log("Stats elements present?", !!(statCheckedOut && statVisitorsToday && statInCampus));

// Check registration cards count
const regCards = document.querySelectorAll(".registration-card");
console.log("Registration cards count:", regCards.length, "(Expected: 4)");

// Check nav links visibility
console.log("\n=== SIDEBAR LINKS VISIBILITY ===");
document.querySelectorAll(".nav-link").forEach(link => {
    const target = link.getAttribute("data-target");
    const hidden = link.classList.contains("hidden");
    console.log(`  Link [${target}]: ${hidden ? "HIDDEN (Admin only or disabled)" : "VISIBLE"}`);
});

// Check navigation authorization
console.log("\n=== VIEW AUTHORIZATION CHECKS ===");
const testViews = [
    { view: "view-dashboard", expected: true },
    { view: "view-student-registration", expected: true },
    { view: "view-customer-registration", expected: true },
    { view: "view-vendor-registration", expected: true },
    { view: "view-checkout", expected: true },
    { view: "view-reports", expected: true },
    { view: "view-settings", expected: false },
    { view: "view-data-management", expected: false },
    { view: "view-work-permit", expected: false },
    { view: "view-purchase-manual", expected: false }
];

testViews.forEach(t => {
    const isAuth = window.isViewAuthorized(t.view);
    const pass = isAuth === t.expected;
    console.log(`  View [${t.view}]: Authorized=${isAuth} | Expected=${t.expected} -> ${pass ? "PASS" : "FAIL"}`);
});
