const fs = require('fs');

// Test isViewAuthorized logic
function testAuthorization() {
    const allowedSecurity = [
        "view-dashboard",
        "view-student-registration",
        "view-customer-registration",
        "view-vendor-registration",
        "view-checkout",
        "view-reports",
        "view-pending-approvals",
        "view-employee-search"
    ];

    const adminOnly = [
        "view-settings",
        "view-data-management",
        "view-purchase-manual",
        "view-work-permit"
    ];

    function isViewAuthorized(viewId, roleStr) {
        const role = roleStr.toLowerCase();
        if (role === "admin" || role === "administrator") return true;

        if (role === "security gatekeeper" || role === "front desk operator" || role === "gatekeeper" || role === "security") {
            const allowed = [
                "view-dashboard",
                "view-student-registration",
                "view-customer-registration",
                "view-vendor-registration",
                "view-checkout",
                "view-reports",
                "view-registration",
                "view-pending-approvals",
                "view-employee-search",
                "view-contractor-registration",
                "view-delivery-registration",
                "view-service-engineer-registration",
                "view-category-records",
                "view-history"
            ];
            return allowed.includes(viewId);
        }

        return false;
    }

    console.log("Checking Security user access:");
    allowedSecurity.forEach(v => {
        const auth = isViewAuthorized(v, "Security Gatekeeper");
        console.log(`  ${v}: ${auth ? "ALLOWED" : "DENIED"}`);
    });

    console.log("\nChecking Admin-Only access for Security user:");
    adminOnly.forEach(v => {
        const auth = isViewAuthorized(v, "Security Gatekeeper");
        console.log(`  ${v}: ${auth ? "ALLOWED" : "DENIED"}`);
    });
}

testAuthorization();
