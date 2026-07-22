const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { getPool } = require('./backend/config/db');

const visitorRoutes = require('./backend/routes/visitorRoutes');
const employeeRoutes = require('./backend/routes/employeeRoutes');
const workPermitRoutes = require('./backend/routes/workPermitRoutes');
const dashboardRoutes = require('./backend/routes/dashboardRoutes');
const reportsRoutes = require('./backend/routes/reportsRoutes');
const authRoutes = require('./backend/routes/authRoutes');
const blacklistRoutes = require('./backend/routes/blacklistRoutes');
const notificationRoutes = require('./backend/routes/notificationRoutes');
const purchaseManualRoutes = require('./backend/routes/purchaseManualRoutes');
const auditRoutes = require('./backend/routes/auditRoutes');
const branchRoutes = require('./backend/routes/branchRoutes');
const departmentRoutes = require('./backend/routes/departmentRoutes');
const studentRoutes = require('./backend/routes/studentRoutes');
const approvalRoutes = require('./backend/routes/approvalRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and Large Payload Support (for base64 photos & QR codes)
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request Logging
app.use((req, res, next) => {
    console.log(`[API] ${req.method} ${req.url} (Role: ${req.headers['x-user-role'] || 'Anonymous'})`);
    next();
});

// Role-Based Authorization Middleware
function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        const userRole = req.headers['x-user-role'] || 'Administrator';
        const roleClean = userRole.toLowerCase();

        const isAllowed = allowedRoles.some(r => {
            const targetClean = r.toLowerCase();
            if (targetClean === 'administrator' && (roleClean === 'admin' || roleClean === 'administrator')) return true;
            if (targetClean === 'security' && (roleClean === 'security' || roleClean === 'security gatekeeper' || roleClean === 'gatekeeper' || roleClean === 'front desk operator' || roleClean === 'receptionist')) return true;
            return targetClean === roleClean;
        });

        if (!isAllowed) {
            console.warn(`[AUTH 403 BLOCKED] Role '${userRole}' denied access to ${req.method} ${req.originalUrl}`);
            return res.status(403).json({
                success: false,
                message: `Access Denied: Your security role (${userRole}) is not authorized to access this resource. Administrator privilege required.`
            });
        }
        next();
    };
}

// API Routes & Access Controls
app.use('/api/auth', authRoutes);
app.use('/api/approval', approvalRoutes);
app.use('/api/dashboard', authorizeRoles('Administrator', 'Security'), dashboardRoutes);
app.use('/api/reports', authorizeRoles('Administrator', 'Security'), reportsRoutes);

// Admin-Only Restricted API Modules
app.use('/api/security-users', authorizeRoles('Administrator'), authRoutes);
app.use('/api/employees', authorizeRoles('Administrator'), employeeRoutes);
app.use('/api/work-permits', authorizeRoles('Administrator'), workPermitRoutes);
app.use('/api/purchase-manuals', authorizeRoles('Administrator'), purchaseManualRoutes);
app.use('/api/audit-logs', authorizeRoles('Administrator'), auditRoutes);
app.use('/api/blacklist', authorizeRoles('Administrator'), blacklistRoutes);
app.use('/api/students', authorizeRoles('Administrator'), studentRoutes);
app.use('/api/branches', authorizeRoles('Administrator'), branchRoutes);
app.use('/api/departments', authorizeRoles('Administrator'), departmentRoutes);
app.use('/api/notifications', authorizeRoles('Administrator', 'Security'), notificationRoutes);
app.use('/api/visitors', authorizeRoles('Administrator', 'Security'), visitorRoutes);

// Health Check Endpoint
app.get('/api/health', async (req, res) => {
    try {
        await getPool();
        res.json({ status: 'OK', database: 'MSSQL VisitorManagement Connected', timestamp: new Date().toISOString() });
    } catch (err) {
        res.status(500).json({ status: 'ERROR', database: err.message });
    }
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('[SERVER ERROR]', err.stack);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
});

// Start Server if run directly
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`=======================================================`);
        console.log(`[VMS BACKEND] Node.js Express API Server running on port ${PORT}`);
        console.log(`[VMS BACKEND] Connected Database Target: VisitorManagement (MSSQL)`);
        console.log(`[VMS BACKEND] Role-Based Access Control Middleware Active`);
        console.log(`=======================================================`);
    });
}

module.exports = app;
