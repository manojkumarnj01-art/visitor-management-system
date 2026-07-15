/**
 * ==========================================================================
 * ENTERPRISE VMS CLIENT-SIDE SELF-LEARNING AI ENGINE (aiEngine.js)
 * ==========================================================================
 */

class VmsAiEngine {
    constructor() {
        this.vectorIndex = [];
        this.vocabulary = new Set();
        this.vocabArray = [];
        this.idf = {};
        this.trafficModel = {
            hourlyWeights: Array(24).fill(0),
            dailyWeights: Array(7).fill(0),
            intercept: 0
        };
        this.stats = {
            avgVisitDurationMin: 180,
            peakHours: [],
            busyDays: []
        };
    }

    /**
     * Train ML models and update vector index using current VMS state
     */
    async train(state) {
        console.log("[VmsAiEngine] Initiating background self-learning pipeline...");
        this.buildVectorIndex(state);
        this.fitTrafficRegression(state.visitors);
        this.calculateOperationalStats(state.visitors);
        console.log("[VmsAiEngine] AI models and semantic vectors successfully updated.");

        if (state.settings?.gcpAiUrl) {
            try {
                console.log("[VmsAiEngine] Syncing training dataset to Python FastAPI AI service...");
                const response = await fetch(`${state.settings.gcpAiUrl}/ai/train`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        visitors: state.visitors,
                        employees: state.employees,
                        blacklist: state.blacklist,
                        departments: state.departments
                    })
                });
                const result = await response.json();
                console.log("[VmsAiEngine] FastAPI AI service training response:", result);
            } catch (err) {
                console.error("[VmsAiEngine] Failed to sync training dataset with FastAPI AI service:", err);
            }
        }
    }

    /**
     * Tokenize text and clean up stopwords
     */
    tokenize(text) {
        if (!text) return [];
        return text.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .split(/\s+/)
            .filter(token => token.length > 2 && !this.isStopword(token));
    }

    isStopword(word) {
        const stopwords = new Set(["the", "and", "for", "with", "this", "that", "from", "you", "are", "abc", "corp", "gate", "room", "cabin", "floor"]);
        return stopwords.has(word);
    }

    /**
     * Build client-side TF-IDF vector space for semantic Q&A chatbot search
     */
    buildVectorIndex(state) {
        this.vectorIndex = [];
        this.vocabulary.clear();

        // 1. Gather all documents
        const documents = [];

        // Index visitors
        state.visitors.forEach(v => {
            documents.push({
                type: "visitor",
                id: v.id,
                ref: v,
                text: `${v.name} ${v.company || ''} ${v.purpose} ${v.hostName} ${v.hostDept} ${v.status} ${v.vehicle || ''} ${v.email || ''}`
            });
        });

        // Index employees
        state.employees.forEach(emp => {
            documents.push({
                type: "employee",
                id: emp.id,
                ref: emp,
                text: `${emp.name} ${emp.dept} ${emp.designation} ${emp.cabin} ${emp.status} ${emp.email || ''} ${emp.phone || ''}`
            });
        });

        // Index blacklist
        state.blacklist.forEach(b => {
            documents.push({
                type: "blacklist",
                id: b.id,
                ref: b,
                text: `blacklist blocked restricted danger warning ${b.name} ${b.reason} ${b.idNumber}`
            });
        });

        // Index departments
        state.departments.forEach(dept => {
            documents.push({
                type: "department",
                id: dept.name,
                ref: dept,
                text: `department office location ${dept.name} ${dept.location}`
            });
        });

        // 2. Build vocabulary
        documents.forEach(doc => {
            const tokens = this.tokenize(doc.text);
            doc.tokens = tokens;
            tokens.forEach(t => this.vocabulary.add(t));
        });

        this.vocabArray = Array.from(this.vocabulary);
        const numDocs = documents.length;

        // 3. Compute IDF
        const docFreq = {};
        this.vocabArray.forEach(term => {
            docFreq[term] = 0;
            documents.forEach(doc => {
                if (doc.tokens.includes(term)) {
                    docFreq[term]++;
                }
            });
            this.idf[term] = Math.log(1 + (numDocs / (1 + docFreq[term])));
        });

        // 4. Compute TF-IDF vectors
        documents.forEach(doc => {
            const tf = {};
            doc.tokens.forEach(term => {
                tf[term] = (tf[term] || 0) + 1;
            });

            // Normalize tf and construct vector
            const tfidfVector = {};
            let lengthSq = 0;
            this.vocabArray.forEach(term => {
                if (tf[term]) {
                    const weight = (tf[term] / doc.tokens.length) * this.idf[term];
                    tfidfVector[term] = weight;
                    lengthSq += weight * weight;
                }
            });

            doc.vector = tfidfVector;
            doc.norm = Math.sqrt(lengthSq);
            this.vectorIndex.push(doc);
        });
    }

    /**
     * Perform cosine similarity semantic search over index
     */
    semanticSearch(queryStr, typeFilter = null, limit = 5) {
        const queryTokens = this.tokenize(queryStr);
        if (queryTokens.length === 0) return [];

        // 1. Compute query vector
        const queryTf = {};
        queryTokens.forEach(t => {
            queryTf[t] = (queryTf[t] || 0) + 1;
        });

        const queryVector = {};
        let qLengthSq = 0;
        this.vocabArray.forEach(term => {
            if (queryTf[term]) {
                const idfWeight = this.idf[term] || 0.1;
                const weight = (queryTf[term] / queryTokens.length) * idfWeight;
                queryVector[term] = weight;
                qLengthSq += weight * weight;
            }
        });
        const qNorm = Math.sqrt(qLengthSq);
        if (qNorm === 0) return [];

        // 2. Score documents
        const scoredDocs = [];
        this.vectorIndex.forEach(doc => {
            if (typeFilter && doc.type !== typeFilter) return;
            if (doc.norm === 0) return;

            let dotProduct = 0;
            Object.keys(queryVector).forEach(term => {
                if (doc.vector[term]) {
                    dotProduct += queryVector[term] * doc.vector[term];
                }
            });

            const score = dotProduct / (qNorm * doc.norm);
            if (score > 0) {
                scoredDocs.push({ doc, score });
            }
        });

        return scoredDocs.sort((a, b) => b.score - a.score).slice(0, limit);
    }

    /**
     * Train Linear Regression to forecast hourly and daily visitor volume
     */
    fitTrafficRegression(visitors) {
        if (!visitors || visitors.length === 0) return;

        // Reset weights
        const hourlyCounts = Array(24).fill(0);
        const dailyCounts = Array(7).fill(0);

        // Group visits by day/hour
        visitors.forEach(v => {
            let dateObj;
            if (v.checkIn) {
                dateObj = new Date(v.checkIn);
            } else if (v.visitDate) {
                dateObj = new Date(v.visitDate + "T10:00:00");
            }
            if (dateObj && !isNaN(dateObj)) {
                const hour = dateObj.getHours();
                const day = dateObj.getDay(); // 0 = Sun, 6 = Sat
                hourlyCounts[hour]++;
                dailyCounts[day]++;
            }
        });

        // Normalize weights (probabilities)
        const total = visitors.length;
        this.trafficModel.hourlyWeights = hourlyCounts.map(c => c / total);
        this.trafficModel.dailyWeights = dailyCounts.map(c => c / total);
        this.trafficModel.intercept = total / 30; // average visitors per day approximation
    }

    /**
     * Calculate averages and peaks
     */
    calculateOperationalStats(visitors) {
        if (!visitors || visitors.length === 0) return;

        let totalDuration = 0;
        let countedDuration = 0;

        visitors.forEach(v => {
            if (v.checkIn && v.checkOut) {
                const diffMs = new Date(v.checkOut) - new Date(v.checkIn);
                const diffMin = diffMs / 1000 / 60;
                if (diffMin > 0 && diffMin < 1440) { // filter outliers
                    totalDuration += diffMin;
                    countedDuration++;
                }
            }
        });

        if (countedDuration > 0) {
            this.stats.avgVisitDurationMin = Math.round(totalDuration / countedDuration);
        }

        // Peak operational hours (top 3)
        const hourly = this.trafficModel.hourlyWeights.map((w, h) => ({ hour: h, weight: w }));
        hourly.sort((a, b) => b.weight - a.weight);
        this.stats.peakHours = hourly.slice(0, 3).map(x => x.hour);

        // Peak operational days (top 2)
        const daily = this.trafficModel.dailyWeights.map((w, d) => ({ day: d, weight: w }));
        daily.sort((a, b) => b.weight - a.weight);
        this.stats.busyDays = daily.slice(0, 2).map(x => x.day);
    }

    /**
     * Predict visitor volume for a specific date/hour
     */
    predictVolume(dayOfWeek, hour) {
        const base = this.trafficModel.intercept || 10;
        const dayFactor = this.trafficModel.dailyWeights[dayOfWeek] ? this.trafficModel.dailyWeights[dayOfWeek] * 7 : 1.0;
        const hourFactor = this.trafficModel.hourlyWeights[hour] ? this.trafficModel.hourlyWeights[hour] * 24 : 1.0;
        return Math.max(0, Math.round(base * dayFactor * hourFactor));
    }

    /**
     * Automatically classify/categorize visitor based on pattern matching
     */
    autoCategorizeVisitor(v, history) {
        // Find how many times this visitor (by phone) has registered
        const matchCount = history.filter(h => h.phone === v.phone).length;
        const purpose = (v.purpose || "").toLowerCase();
        const company = (v.company || "").toLowerCase();

        if (purpose.includes("interview")) return "Job Candidate";
        if (purpose.includes("delivery") || purpose.includes("courier")) return "Delivery Courier";
        if (purpose.includes("maintenance") || purpose.includes("service") || purpose.includes("contract")) return "Contractor";
        
        // VIP categorizations
        const vipKeywords = ["director", "ceo", "president", "audit", "government", "cfo", "vp"];
        const isVipPurpose = vipKeywords.some(keyword => purpose.includes(keyword) || (v.notes && v.notes.toLowerCase().includes(keyword)));
        const isVipCompany = ["barani", "tata", "reliance", "lars", "infotech", "acme corp"].some(k => company.includes(k));
        
        if (isVipPurpose || (isVipCompany && matchCount <= 2)) return "VIP Business Guest";
        if (matchCount >= 4) return "Frequent Vendor / Partner";
        
        return "Regular Visitor";
    }

    /**
     * Scan an incoming or active visitor record for security risk anomalies
     */
    detectAnomaly(v, blacklist, currentVisitors) {
        const anomalies = [];
        let riskScore = 0;

        if (!v) return { riskScore, anomalies };

        // 1. Blacklist check (Similarity on name or exact check on ID and phone)
        const cleanPhone = v.phone ? v.phone.replace(/[^\d]/g, '') : '';
        const isBlacklisted = blacklist.some(b => {
            const bPhone = b.phone ? b.phone.replace(/[^\d]/g, '') : '';
            const phoneMatch = cleanPhone && bPhone && cleanPhone === bPhone;
            const nameMatch = v.name && b.name && v.name.toLowerCase().trim() === b.name.toLowerCase().trim();
            const idMatch = v.idNumber && b.idNumber && v.idNumber.toLowerCase().replace(/[\s-]/g, '') === b.idNumber.toLowerCase().replace(/[\s-]/g, '');
            
            return phoneMatch || idMatch || nameMatch;
        });

        if (isBlacklisted) {
            anomalies.push("Visitor identity matches records in the local security blacklist database.");
            riskScore += 95;
        }

        // 2. Time-of-day check (Odd hours check-in prediction)
        let checkInHour = new Date().getHours();
        if (v.checkIn) {
            checkInHour = new Date(v.checkIn).getHours();
        }
        if (checkInHour < 7 || checkInHour > 19) {
            anomalies.push(`After-hours check-in attempt at ${checkInHour}:00 (standard hours: 07:00 - 19:00).`);
            riskScore += 25;
        }

        // 3. Overstay check (If Checked In and current duration > average by 2x)
        if (v.status === "Checked In" && v.checkIn) {
            const durationMin = (new Date() - new Date(v.checkIn)) / 1000 / 60;
            const overstayLimit = Math.max(240, this.stats.avgVisitDurationMin * 2);
            if (durationMin > overstayLimit) {
                anomalies.push(`Overstay Alert: Visitor campus duration (${Math.round(durationMin)} min) exceeds threshold limits.`);
                riskScore += 35;
            }
        }

        // 4. Overlapping active visits for same host (host concurrency check)
        if (v.status === "Checked In" || v.status === "Pending") {
            const hostActiveVisitsCount = currentVisitors.filter(cv => cv.hostId === v.hostId && cv.status === "Checked In" && cv.id !== v.id).length;
            if (hostActiveVisitsCount >= 3) {
                anomalies.push(`Host Concurrency: Selected employee (${v.hostName}) currently has ${hostActiveVisitsCount} concurrent visitors.`);
                riskScore += 15;
            }
        }

        // 5. Duplicate active check-ins (visitor already checked-in check)
        const dupCheck = currentVisitors.some(cv => cv.phone === v.phone && cv.status === "Checked In" && cv.id !== v.id);
        if (dupCheck) {
            anomalies.push("Visitor with the same contact number is already marked inside the facility.");
            riskScore += 50;
        }

        return {
            riskScore: Math.min(riskScore, 100),
            anomalies,
            isAnomalous: riskScore >= 30
        };
    }

    /**
     * Answer questions asked to the Chatbot based on data
     */
    answerQuestion(queryStr, state) {
        const q = queryStr.toLowerCase().trim();
        
        // 1. NLP classifier mapping for specific stats questions
        if (q.includes("stats") || q.includes("summary") || q.includes("how many visitors") || q.includes("visitor count")) {
            const todayStr = (typeof getLocalDateStr === 'function') ? getLocalDateStr() : new Date().toISOString().split('T')[0];
            const total = state.visitors.length;
            const today = state.visitors.filter(v => v.visitDate === todayStr).length;
            const inside = state.visitors.filter(v => v.status === "Checked In").length;
            const pending = state.visitors.filter(v => v.status === "Pending").length;
            const rejected = state.visitors.filter(v => v.status === "Rejected" || v.status === "Denied").length;

            return `Here is a live system audit summary:<br>
            <table class="chat-response-table" style="width:100%; border-collapse:collapse; margin-top:8px; font-size:0.8rem; border: 1px solid var(--border-color); border-radius: 4px;">
                <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 6px;">Total Database Records:</td><td style="text-align: right; padding:6px; font-weight:700;">${total}</td></tr>
                <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 6px;">Today's Registrations:</td><td style="text-align: right; padding:6px; font-weight:700; color:var(--accent-primary);">${today}</td></tr>
                <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 6px;">Currently inside Campus:</td><td style="text-align: right; padding:6px; font-weight:700; color:var(--accent-success);">${inside}</td></tr>
                <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 6px;">Pending Approvals:</td><td style="text-align: right; padding:6px; font-weight:700; color:var(--accent-amber);">${pending}</td></tr>
                <tr><td style="padding: 6px;">Rejected Registrations:</td><td style="text-align: right; padding:6px; font-weight:700; color:var(--accent-danger);">${rejected}</td></tr>
            </table>`;
        }

        // 2. Blacklist general checks
        if (q.includes("blacklist") || q.includes("blocked") || q.includes("restricted")) {
            // Check if specific name
            let found = null;
            state.blacklist.forEach(b => {
                if (q.includes(b.name.toLowerCase())) found = b;
            });

            if (found) {
                return `<span style="color:var(--accent-danger); font-weight:bold;">⚠️ Blacklist Match Found</span><br>
                <strong>${found.name}</strong> was blacklisted on ${found.dateAdded}.<br>
                <strong>Reason:</strong> ${found.reason}<br>
                <strong>ID:</strong> ${found.idType} (${found.idNumber})`;
            }

            return `The local security blacklist database contains <strong>${state.blacklist.length}</strong> restricted records.<br>
            You can verify an individual by typing: <em>"Is [Name] blacklisted?"</em>`;
        }

        // 3. AI Predictions questions
        if (q.includes("forecast") || q.includes("predict") || q.includes("tomorrow") || q.includes("peak") || q.includes("busy")) {
            const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const peakHrsText = this.stats.peakHours.map(h => `${h === 12 ? 12 : h % 12}:00 ${h >= 12 ? 'PM' : 'AM'}`).join(", ");
            const busyDaysText = this.stats.busyDays.map(d => days[d]).join(" & ");
            
            return `🔮 <strong>AI Traffic Forecast Engine</strong>:<br>
            - <strong>Busy Days</strong>: Historical data patterns show that <strong>${busyDaysText || 'Weekdays'}</strong> represent peak visiting days.<br>
            - <strong>Peak Check-in Hours</strong>: Security terminals experience maximum traffic at <strong>${peakHrsText || '10:00 AM, 2:00 PM'}</strong>.<br>
            - <strong>Staffing Suggestion</strong>: Keep auxiliary check-in gates open during these peak windows to reduce registration delays.`;
        }

        // 4. Overstay / Anomaly check questions
        if (q.includes("anomaly") || q.includes("risk") || q.includes("suspicious") || q.includes("overstay")) {
            const currentVis = state.visitors.filter(cv => cv.status === "Checked In");
            const anomalies = [];
            
            currentVis.forEach(cv => {
                const check = this.detectAnomaly(cv, state.blacklist, currentVis);
                if (check.isAnomalous) {
                    anomalies.push(`- <strong>${cv.name}</strong> (${cv.company || 'Guest'}): ${check.anomalies.join(" | ")}`);
                }
            });

            if (anomalies.length > 0) {
                return `<strong style="color:var(--accent-danger);">⚠️ Live Anomaly Warnings (${anomalies.length})</strong>:<br>
                ${anomalies.join("<br>")}`;
            }

            return `✅ <strong>All Clear</strong>: No active security alerts, blacklist matches, or overstay anomalies detected in the current campus database.`;
        }

        // 5. Fallback to vector similarity database search
        const results = this.semanticSearch(queryStr, null, 3);
        if (results.length > 0 && results[0].score > 0.15) {
            const match = results[0].doc;
            const scorePercent = Math.round(results[0].score * 100);

            if (match.type === "visitor") {
                const v = match.ref;
                return `🔎 <strong>Semantic Match</strong> (Confidence: ${scorePercent}%):<br>
                Visitor <strong>${v.name}</strong> (${v.company || 'Individual'}) is currently marked as <span class="badge-status ${v.status.toLowerCase()}">${v.status}</span>.<br>
                - <strong>Host</strong>: ${v.hostName} (${v.hostDept})<br>
                - <strong>Purpose</strong>: ${v.purpose}<br>
                - <strong>Check-In</strong>: ${v.checkIn ? new Date(v.checkIn).toLocaleString() : '—'}<br>
                - <strong>Vehicle</strong>: ${v.vehicle || 'None'}`;
            } else if (match.type === "employee") {
                const emp = match.ref;
                return `🔎 <strong>Employee Directory Match</strong> (Confidence: ${scorePercent}%):<br>
                Host <strong>${emp.name}</strong> is a <strong>${emp.designation}</strong> in the <strong>${emp.dept}</strong> department.<br>
                - <strong>Workspace Cabin</strong>: ${emp.cabin}<br>
                - <strong>Office Status</strong>: ${emp.status} (${emp.campusStatus === 'Inside' ? 'Inside Campus' : 'Off-site'})<br>
                - <strong>Contact Ext</strong>: ${emp.phone}`;
            } else if (match.type === "blacklist") {
                const bl = match.ref;
                return `<span style="color:var(--accent-danger); font-weight:bold;">⚠️ Security Alert! Semantic Match in Blacklist</span> (Confidence: ${scorePercent}%):<br>
                <strong>${bl.name}</strong> is restricted from entry.<br>
                - <strong>Reason</strong>: "${bl.reason}"<br>
                - <strong>ID Proof</strong>: ${bl.idType} (${bl.idNumber})<br>
                - <strong>Added On</strong>: ${bl.dateAdded}`;
            } else if (match.type === "department") {
                const dept = match.ref;
                return `🔎 <strong>Department Match</strong> (Confidence: ${scorePercent}%):<br>
                The offices for the <strong>${dept.name}</strong> department are situated at: <strong>${dept.location}</strong>.`;
            }
        }

        return `I couldn't locate a precise answer in the semantic search database for: "${queryStr}".<br>
        Try asking:<br>
        - <em>"Who is Manoj Kumar?"</em><br>
        - <em>"What is the status of Devon Carter?"</em><br>
        - <em>"Is John Doe blocked?"</em><br>
        - <em>"Today's stats summary"</em><br>
        - <em>"Show AI traffic predictions"</em>`;
    }

    /**
     * Generate dynamic AI insights summaries for Reports module
     */
    generateInsightsText(visitors, blacklist) {
        if (!visitors || visitors.length === 0) {
            return "No visitor logs found to run AI predictions. Register and check-in guests to activate analysis.";
        }

        const total = visitors.length;
        const checkedIn = visitors.filter(v => v.status === "Checked In").length;
        const rejected = visitors.filter(v => v.status === "Rejected" || v.status === "Denied").length;

        // Peak Purpose
        const purposes = {};
        visitors.forEach(v => purposes[v.purpose] = (purposes[v.purpose] || 0) + 1);
        let topPurpose = "N/A";
        let topPurposeCount = 0;
        Object.keys(purposes).forEach(p => {
            if (purposes[p] > topPurposeCount) {
                topPurposeCount = purposes[p];
                topPurpose = p;
            }
        });

        // Peak Company
        const companies = {};
        visitors.forEach(v => {
            if (v.company) companies[v.company] = (companies[v.company] || 0) + 1;
        });
        let topCompany = "N/A";
        let topCompanyCount = 0;
        Object.keys(companies).forEach(c => {
            if (companies[c] > topCompanyCount) {
                topCompanyCount = companies[c];
                topCompany = c;
            }
        });

        // Peak Department
        const depts = {};
        visitors.forEach(v => depts[v.hostDept] = (depts[v.hostDept] || 0) + 1);
        let topDept = "N/A";
        let topDeptCount = 0;
        Object.keys(depts).forEach(d => {
            if (depts[d] > topDeptCount) {
                topDeptCount = depts[d];
                topDept = d;
            }
        });

        const activeDays = this.stats.busyDays.map(d => ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][d]).join(" and ");
        const peakHrsText = this.stats.peakHours.map(h => `${h}:00`).join(", ");

        // Compute anomalies counts
        let anomalyCount = 0;
        visitors.forEach(v => {
            const check = this.detectAnomaly(v, blacklist, visitors.filter(x => x.status === 'Checked In'));
            if (check.isAnomalous) anomalyCount++;
        });

        return `💡 <strong>AI Cognitive Report Analysis</strong>:
        <ul style="margin: 6px 0 0 16px; padding: 0; line-height: 1.5; font-size: 0.8rem;">
            <li><strong>Anomalies Detected</strong>: Found <strong>${anomalyCount}</strong> security anomalies or overstay incidents in the selection.</li>
            <li><strong>Primary Target</strong>: The <strong>${topDept}</strong> department represents the busiest department hub, receiving <strong>${Math.round((topDeptCount/total)*100)}%</strong> of visits.</li>
            <li><strong>Lead Purpose</strong>: <strong>${topPurpose}</strong> is the primary guest purpose (<strong>${topPurposeCount}</strong> occurrences).</li>
            <li><strong>Corporate Source</strong>: Guests from <strong>${topCompany || 'N/A'}</strong> constitute the largest corporate segment.</li>
            <li><strong>Traffic Forecast</strong>: Next peak traffic spikes are predicted on <strong>${activeDays || 'Weekdays'}</strong>, primarily around <strong>${peakHrsText || '10:00 to 14:00'}</strong>. Guard gates should allocate 2 staff members during these windows.</li>
        </ul>`;
    }
}

// Instantiate Global AI Engine
window.vmsAi = new VmsAiEngine();
