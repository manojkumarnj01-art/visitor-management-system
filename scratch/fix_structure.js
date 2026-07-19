const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'index.html');
let lines = fs.readFileSync(filePath, 'utf8').split('\n');

console.log(`Total lines: ${lines.length}`);

// Find the damaged region boundaries
// Line 496 (0-indexed: 495) has "</section>" - end of dashboard section
// We need to find where the student registration form content starts properly
// The search-visitor-box is the first good content of student registration (around line 525+)

// Find the line that has "Search Existing Visitor" for student
let searchVisitorLine = -1;
for (let i = 490; i < 550; i++) {
    if (lines[i] && lines[i].includes('Search Existing Visitor') && lines[i].includes('h3')) {
        // This is the h3 text, the search box div starts a few lines before
        // We want to find the search-visitor-box div
        for (let j = i - 5; j <= i; j++) {
            if (lines[j] && lines[j].includes('search-visitor-box')) {
                searchVisitorLine = j;
                break;
            }
        }
        if (searchVisitorLine === -1) {
            // The search-visitor-box might be merged with the corrupted content
            // Look for the style attribute instead
            for (let j = i - 3; j <= i; j++) {
                if (lines[j] && lines[j].includes('background: var(--bg-app)') && lines[j].includes('border-radius: var(--border-radius-lg)')) {
                    searchVisitorLine = j;
                    break;
                }
            }
        }
        break;
    }
}

console.log(`Found student search box content around line: ${searchVisitorLine + 1}`);

// We also need to find the checkout card duplicate
// Lines 490-496 are the end of the ORIGINAL dashboard (correct)
// Lines 497+ through the damaged area need to be replaced

// The correct structure between line 496 (</section>) and the search box should be:
const correctInsertion = `
                <!-- VIEW: PENDING APPROVALS -->
                <section id="view-pending-approvals" class="page-view">
                    <div class="dashboard-card"
                        style="padding: 20px; border: 1px solid var(--border-color); background: var(--bg-card);">
                        <div class="card-header"
                            style="border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 1.5rem;">
                            <h2 style="font-size: 1.4rem; font-weight: 800; color: var(--accent-primary); margin: 0;">&#x23F3;
                                Pending Host Approvals Queue</h2>
                            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 4px;">Review and
                                process pending visitor clearance requests.</p>
                        </div>
                        <div class="table-responsive" style="overflow-x: auto; width: 100%;">
                            <table class="data-table"
                                style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.85rem;">
                                <thead>
                                    <tr
                                        style="border-bottom: 2px solid var(--border-color); background: var(--bg-app); font-weight: 700; color: var(--text-secondary);">
                                        <th style="padding: 12px 10px;">Visitor Photo</th>
                                        <th style="padding: 12px 10px;">Visitor Name</th>
                                        <th style="padding: 12px 10px;">Mobile</th>
                                        <th style="padding: 12px 10px;">Company</th>
                                        <th style="padding: 12px 10px;">Purpose</th>
                                        <th style="padding: 12px 10px;">Visit Date</th>
                                        <th style="padding: 12px 10px;">Host Employee</th>
                                        <th style="padding: 12px 10px;">Status</th>
                                        <th style="padding: 12px 10px;" class="no-print">Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="view-pending-approvals-tbody">
                                    <tr>
                                        <td colspan="9"
                                            style="text-align: center; padding: 3rem 0; color: var(--text-muted);">No
                                            visitors awaiting approval.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                <!-- VIEW 1a: STUDENT REGISTRATION -->
                <section id="view-student-registration" class="page-view">
                    <div id="student-registration-wrapper">

                        <!-- SECTION 1: Registration Form -->
                        <div class="dashboard-card reg-form-card">
                            <div class="card-header">
                                <h2>&#x1F393; Student Registration</h2>
                            </div>

                            <form id="student-registration-form" class="app-form" autocomplete="off">
                                <div class="form-row">
                                    <!-- Form Column Left -->
                                    <div class="col-8">
                                        <!-- Smart Auto Search Section -->
                                        <div class="search-visitor-box mb-4"
                                            style="background: var(--bg-app); border: 1px solid var(--border-color); padding: 1rem; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm);">`;

// Find line 496 (the </section> after dashboard)
// Actually let's find the exact end of the dashboard section
let dashboardEndLine = -1;
for (let i = 488; i < 500; i++) {
    if (lines[i] && lines[i].trim() === '</section>' && i > 493) {
        dashboardEndLine = i;
        break;
    }
}

console.log(`Dashboard section ends at line: ${dashboardEndLine + 1}`);

// Find the "Search Existing Visitor" h3 line  
let firstGoodContentLine = -1;
for (let i = searchVisitorLine; i < searchVisitorLine + 10; i++) {
    if (lines[i] && lines[i].includes('Search Existing Visitor')) {
        // The h3 tag itself is the good content, but we want to start from the <h3 line before it
        for (let j = i - 1; j >= searchVisitorLine - 3; j--) {
            if (lines[j] && lines[j].trim().startsWith('<h3')) {
                firstGoodContentLine = j;
                break;
            }
        }
        break;
    }
}

console.log(`First good content line (h3 tag): ${firstGoodContentLine + 1}`);

// Now splice: remove lines from dashboardEndLine+1 to firstGoodContentLine-1 (inclusive)
// and insert the correct content
const removeStart = dashboardEndLine + 1; // line after </section>
const removeEnd = firstGoodContentLine; // the h3 line (we keep from here)
const removeCount = removeEnd - removeStart;

console.log(`Removing lines ${removeStart + 1} to ${removeEnd} (${removeCount} lines)`);

const insertLines = correctInsertion.split('\n');

// Splice
lines.splice(removeStart, removeCount, ...insertLines);

console.log(`Inserted ${insertLines.length} lines`);
console.log(`New total lines: ${lines.length}`);

// Write back
fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
console.log('File saved successfully!');

// Quick verification
const verify = fs.readFileSync(filePath, 'utf8');
const hasStudentSection = verify.includes('view-student-registration');
const hasPendingApprovals = verify.includes('view-pending-approvals-tbody');
const hasStudentForm = verify.includes('student-registration-form');
console.log(`Has student section: ${hasStudentSection}`);
console.log(`Has pending approvals tbody: ${hasPendingApprovals}`);
console.log(`Has student form: ${hasStudentForm}`);
