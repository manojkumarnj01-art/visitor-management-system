# Migration Report: Supabase to Microsoft SQL Server Migration

## Executive Summary
The Visitor Management System has been fully migrated from Supabase to **Microsoft SQL Server** (`VisitorManagement` database) with a custom **Node.js + Express** REST API backend.

**Key Achievements:**
- Removed `@supabase/supabase-js` SDK dependencies.
- Created Express REST API server running on **PORT 5000**.
- Integrated Microsoft SQL Server database connection using the `mssql` npm package.
- Generated full REST APIs for Visitor Registration, Check-in/Out, Employee Management, Work Permits, Dashboard Stats, Reports, Blacklist, Notifications, Purchase Manuals, and Audit Logs.
- Built reusable frontend REST API client `src/lib/api.js` executing native `fetch()` calls.
- **100% Zero UI / HTML / CSS changes**: preserved original layout, colors, tables, forms, navigation, and overall user experience.

---

## Changed & Created Files Inventory

### Backup Files (`backups/`)
- `backups/app.js.bak`
- `backups/package.json.bak`
- `backups/index.html.bak`
- `backups/supabase.js.bak`

### Environment & Dependencies
- `.env`: Created SQL Server connection configuration (`DB_SERVER`, `DB_DATABASE=VisitorManagement`, `DB_USER`, `DB_PASSWORD`, `PORT=5000`).
- `package.json`: Replaced `@supabase/supabase-js` with `express`, `mssql`, `cors`, `dotenv`.

### Backend Architecture
- `server.js`: Express application entry point.
- `backend/config/db.js`: MSSQL connection pool manager using `mssql` package.
- **Controllers (`backend/controllers/`)**:
  - `visitorController.js`: Registration, check-in, check-out, updates, search, delete.
  - `employeeController.js`: Employee management CRUD.
  - `workPermitController.js`: Work permit creation and safety officer approvals.
  - `dashboardController.js`: Real-time dashboard statistics and analytics.
  - `reportsController.js`: Visitor logs & department volume reports.
  - `authController.js`: Security users authentication & role management.
  - `blacklistController.js`: Visitor blacklist management.
  - `notificationController.js`: System notification dispatches.
  - `purchaseManualController.js`: Contractor purchase manual approvals.
  - `auditController.js`: Audit logs tracking.
  - `branchController.js` & `departmentController.js` & `studentController.js`
- **Routes (`backend/routes/`)**:
  - `visitorRoutes.js`, `employeeRoutes.js`, `workPermitRoutes.js`, `dashboardRoutes.js`, `reportsRoutes.js`, `authRoutes.js`, `blacklistRoutes.js`, `notificationRoutes.js`, `purchaseManualRoutes.js`, `auditRoutes.js`, `branchRoutes.js`, `departmentRoutes.js`, `studentRoutes.js`.

### Frontend API Integration
- `src/lib/api.js`: REST API client module using native `fetch()`.
- `src/lib/supabase.js`: Clean compatibility wrapper delegating to `api.js`.
- `index.html`: Updated script tag to load `/src/lib/api.js`.

---

## Installation & Running Instructions

### 1. Database Setup
Execute `mssql_schema.sql` on your Microsoft SQL Server instance to initialize the `VisitorManagement` database:
```sql
USE VisitorManagement;
-- Runs mssql_schema.sql DDL script
```

### 2. Configure Environment (`.env`)
Update database credentials in `.env`:
```env
DB_SERVER=localhost
DB_DATABASE=VisitorManagement
DB_USER=sa
DB_PASSWORD=YourPassword123!
PORT=5000
```

### 3. Start Backend Server
```bash
npm run server
```
*Server runs at: `http://localhost:5000`*

### 4. Start Frontend Web Application
```bash
npm run dev
```
*Vite dev server runs at: `http://localhost:5173`*
