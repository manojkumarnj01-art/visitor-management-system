from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import math
import numpy as np

app = FastAPI(title="Bharani VMS AI Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global in-memory AI State Model (similar to aiEngine.js)
class GlobalAiState:
    def __init__(self):
        self.vector_index = []
        self.vocabulary = set()
        self.vocab_array = []
        self.idf = {}
        self.traffic_model = {
            "hourlyWeights": [0.0] * 24,
            "dailyWeights": [0.0] * 7,
            "intercept": 10.0
        }
        self.stats = {
            "avgVisitDurationMin": 180,
            "peakHours": [10, 14, 15],
            "busyDays": [1, 2, 3] # Mon, Tue, Wed
        }

ai_state = GlobalAiState()

# Pydantic Schemas
class VisitorRecord(BaseModel):
    id: Optional[str] = None
    name: str
    phone: str
    email: Optional[str] = None
    address: Optional[str] = None
    company: Optional[str] = None
    purpose: str
    vehicle: Optional[str] = None
    numVisitors: Optional[int] = 1
    idType: Optional[str] = None
    idNumber: Optional[str] = None
    hostId: Optional[str] = None
    hostName: Optional[str] = None
    hostDept: Optional[str] = None
    visitDate: Optional[str] = None
    checkIn: Optional[str] = None
    checkOut: Optional[str] = None
    expectedExit: Optional[str] = None
    status: Optional[str] = "Pending"
    photo: Optional[str] = None

class EmployeeRecord(BaseModel):
    id: str
    name: str
    dept: str
    designation: Optional[str] = None
    cabin: Optional[str] = None
    status: Optional[str] = None
    campusStatus: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None

class BlacklistRecord(BaseModel):
    id: str
    name: str
    phone: str
    idType: str
    idNumber: str
    reason: str
    dateAdded: str

class DepartmentRecord(BaseModel):
    name: str
    location: str

class TrainingPayload(BaseModel):
    visitors: List[VisitorRecord]
    employees: List[EmployeeRecord]
    blacklist: List[BlacklistRecord]
    departments: List[DepartmentRecord]

class AnomalyPayload(BaseModel):
    visitor: VisitorRecord
    blacklist: List[BlacklistRecord]
    currentVisitors: List[VisitorRecord]

class ForecastQuery(BaseModel):
    dayOfWeek: int
    hour: int

class ChatQuery(BaseModel):
    query: str
    visitors: List[VisitorRecord]
    employees: List[EmployeeRecord]
    blacklist: List[BlacklistRecord]
    departments: List[DepartmentRecord]

# Text Helpers
STOPWORDS = {"the", "and", "for", "with", "this", "that", "from", "you", "are", "abc", "corp", "gate", "room", "cabin", "floor"}

def tokenize(text: str) -> List[str]:
    if not text:
        return []
    clean = "".join([c.lower() for c in text if c.isalnum() or c.isspace() or c == "-"])
    tokens = clean.split()
    return [t for t in tokens if len(t) > 2 and t not in STOPWORDS]

@app.get("/health")
def health_check():
    return {"status": "healthy", "model_loaded": True}

@app.post("/ai/train")
def train_model(payload: TrainingPayload):
    try:
        # 1. Update operational stats
        visitors = payload.visitors
        if not visitors:
            return {"status": "No visitor data to train models"}

        # Calculate average duration
        durations = []
        for v in visitors:
            if v.checkIn and v.checkOut:
                try:
                    # Very simple ISO timestamp parse fallback
                    from datetime import datetime
                    cin = datetime.fromisoformat(v.checkIn.replace("Z", ""))
                    cout = datetime.fromisoformat(v.checkOut.replace("Z", ""))
                    diff = (cout - cin).total_seconds() / 60
                    if 0 < diff < 1440:
                        durations.append(diff)
                except Exception:
                    pass

        if durations:
            ai_state.stats["avgVisitDurationMin"] = int(np.mean(durations))

        # 2. Linear Regression Traffic forecasting
        hourly_counts = [0] * 24
        daily_counts = [0] * 7
        total_valid = 0

        for v in visitors:
            try:
                from datetime import datetime
                dt = None
                if v.checkIn:
                    dt = datetime.fromisoformat(v.checkIn.replace("Z", ""))
                elif v.visitDate:
                    dt = datetime.strptime(v.visitDate, "%Y-%m-%d")
                
                if dt:
                    hourly_counts[dt.hour] += 1
                    daily_counts[dt.weekday()] += 1
                    total_valid += 1
            except Exception:
                pass

        if total_valid > 0:
            ai_state.traffic_model["hourlyWeights"] = [c / total_valid for c in hourly_counts]
            ai_state.traffic_model["dailyWeights"] = [c / total_valid for c in daily_counts]
            ai_state.traffic_model["intercept"] = total_valid / 30.0

            # Sort for peak hours
            hourly_indexed = sorted(enumerate(ai_state.traffic_model["hourlyWeights"]), key=lambda x: x[1], reverse=True)
            ai_state.stats["peakHours"] = [h[0] for h in hourly_indexed[:3]]

            # Sort for busy days
            daily_indexed = sorted(enumerate(ai_state.traffic_model["dailyWeights"]), key=lambda x: x[1], reverse=True)
            ai_state.stats["busyDays"] = [d[0] for d in daily_indexed[:2]]

        # 3. TF-IDF Q&A Index Seeding
        ai_state.vocabulary.clear()
        documents = []

        for v in visitors:
            text = f"{v.name} {v.company or ''} {v.purpose} {v.hostName or ''} {v.hostDept or ''} {v.status or ''} {v.vehicle or ''} {v.email or ''}"
            documents.append({"type": "visitor", "id": v.id, "text": text, "ref": v})

        for emp in payload.employees:
            text = f"{emp.name} {emp.dept} {emp.designation or ''} {emp.cabin or ''} {emp.status or ''} {emp.email or ''} {emp.phone or ''}"
            documents.append({"type": "employee", "id": emp.id, "text": text, "ref": emp})

        for bl in payload.blacklist:
            text = f"blacklist blocked restricted danger warning {bl.name} {bl.reason} {bl.idNumber}"
            documents.append({"type": "blacklist", "id": bl.id, "text": text, "ref": bl})

        for dept in payload.departments:
            text = f"department office location {dept.name} {dept.location}"
            documents.append({"type": "department", "id": dept.name, "text": text, "ref": dept})

        # Process tokens
        for doc in documents:
            doc["tokens"] = tokenize(doc["text"])
            for t in doc["tokens"]:
                ai_state.vocabulary.add(t)

        ai_state.vocab_array = list(ai_state.vocabulary)
        num_docs = len(documents)

        # Compute IDF
        doc_freq = {}
        for term in ai_state.vocab_array:
            doc_freq[term] = sum(1 for doc in documents if term in doc["tokens"])
            ai_state.idf[term] = math.log(1 + (num_docs / (1 + doc_freq[term])))

        # Compute TF-IDF vectors
        ai_state.vector_index = []
        for doc in documents:
            tf = {}
            for term in doc["tokens"]:
                tf[term] = tf.get(term, 0) + 1

            vector = {}
            length_sq = 0.0
            for term in ai_state.vocab_array:
                if term in tf:
                    weight = (tf[term] / len(doc["tokens"])) * ai_state.idf[term]
                    vector[term] = weight
                    length_sq += weight * weight

            doc["vector"] = vector
            doc["norm"] = math.sqrt(length_sq)
            ai_state.vector_index.append(doc)

        return {
            "status": "success",
            "message": "AI model training and semantic vector generation complete.",
            "visitors_trained": len(payload.visitors),
            "vocabulary_size": len(ai_state.vocab_array)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Training failed: {str(e)}")

@app.post("/ai/predict-volume")
def predict_volume(query: ForecastQuery):
    base = ai_state.traffic_model["intercept"]
    day_factor = ai_state.traffic_model["dailyWeights"][query.dayOfWeek] * 7.0
    hour_factor = ai_state.traffic_model["hourlyWeights"][query.hour] * 24.0
    val = max(0, int(base * day_factor * hour_factor))
    return {"prediction": val}

@app.post("/ai/anomaly")
def detect_anomaly(payload: AnomalyPayload):
    v = payload.visitor
    blacklist = payload.blacklist
    current_visitors = payload.currentVisitors

    anomalies = []
    risk_score = 0

    # 1. Blacklist check
    clean_phone = "".join([c for c in v.phone if c.isdigit()]) if v.phone else ""
    is_blacklisted = False
    for bl in blacklist:
        bl_phone = "".join([c for c in bl.phone if c.isdigit()]) if bl.phone else ""
        phone_match = clean_phone and bl_phone and clean_phone == bl_phone
        name_match = v.name.lower().strip() == bl.name.lower().strip()
        id_match = v.idNumber and bl.idNumber and v.idNumber.lower().replace(" ", "").replace("-", "") == bl.idNumber.lower().replace(" ", "").replace("-", "")

        if phone_match or name_match or id_match:
            is_blacklisted = True
            break

    if is_blacklisted:
        anomalies.append("Visitor identity matches records in the local security blacklist database.")
        risk_score += 95

    # 2. Time of day check
    try:
        from datetime import datetime
        check_in_hour = datetime.now().hour
        if v.checkIn:
            check_in_hour = datetime.fromisoformat(v.checkIn.replace("Z", "")).hour
        if check_in_hour < 7 or check_in_hour > 19:
            anomalies.append(f"After-hours check-in attempt at {check_in_hour}:00 (standard hours: 07:00 - 19:00).")
            risk_score += 25
    except Exception:
        pass

    # 3. Overstay check
    if v.status == "Checked In" and v.checkIn:
        try:
            from datetime import datetime
            cin = datetime.fromisoformat(v.checkIn.replace("Z", ""))
            duration_min = (datetime.now() - cin).total_seconds() / 60
            overstay_limit = max(240, ai_state.stats["avgVisitDurationMin"] * 2)
            if duration_min > overstay_limit:
                anomalies.append(f"Overstay Alert: Visitor campus duration ({int(duration_min)} min) exceeds threshold limits.")
                risk_score += 35
        except Exception:
            pass

    # 4. Host concurrency check
    if v.status in ("Checked In", "Pending"):
        host_active_visits = sum(1 for cv in current_visitors if cv.hostId == v.hostId and cv.status == "Checked In" and cv.id != v.id)
        if host_active_visits >= 3:
            anomalies.append(f"Host Concurrency: Selected employee ({v.hostName}) currently has {host_active_visits} concurrent visitors.")
            risk_score += 15

    # 5. Duplicate active check-ins
    dup_check = any(cv.phone == v.phone and cv.status == "Checked In" and cv.id != v.id for cv in current_visitors)
    if dup_check:
        anomalies.append("Visitor with the same contact number is already marked inside the facility.")
        risk_score += 50

    return {
        "riskScore": min(risk_score, 100),
        "anomalies": anomalies,
        "isAnomalous": risk_score >= 30
    }

@app.post("/ai/insights")
def generate_insights(payload: TrainingPayload):
    visitors = payload.visitors
    if not visitors:
        return {"insights": "No visitor logs found to run AI predictions. Register and check-in guests to activate analysis."}

    total = len(visitors)
    
    # Calculate top categories
    purposes = {}
    companies = {}
    departments = {}
    
    for v in visitors:
        purposes[v.purpose] = purposes.get(v.purpose, 0) + 1
        if v.company:
            companies[v.company] = companies.get(v.company, 0) + 1
        if v.hostDept:
            departments[v.hostDept] = departments.get(v.hostDept, 0) + 1

    top_purpose = max(purposes, key=purposes.get) if purposes else "N/A"
    top_company = max(companies, key=companies.get) if companies else "N/A"
    top_dept = max(departments, key=departments.get) if departments else "N/A"

    days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    busy_days_text = " & ".join([days[d] for d in ai_state.stats["busyDays"]])
    peak_hours_text = ", ".join([f"{h:02d}:00" for h in ai_state.stats["peakHours"]])

    # Simple anomaly counter
    anomaly_count = 0
    current_visitors = [v for v in visitors if v.status == "Checked In"]
    for v in visitors:
        payload_anomaly = AnomalyPayload(visitor=v, blacklist=payload.blacklist, currentVisitors=current_visitors)
        check = detect_anomaly(payload_anomaly)
        if check["isAnomalous"]:
            anomaly_count += 1

    html_insights = f"""💡 <strong>AI Cloud Analysis & Predictions Report</strong>:
    <ul style="margin: 6px 0 0 16px; padding: 0; line-height: 1.5; font-size: 0.8rem;">
        <li><strong>Anomalies Detected</strong>: Found <strong>{anomaly_count}</strong> security anomalies or overstay incidents in the database.</li>
        <li><strong>Primary Target</strong>: The <strong>{top_dept}</strong> department represents the busiest department hub, receiving <strong>{int((departments.get(top_dept, 0)/total)*100)}%</strong> of visits.</li>
        <li><strong>Lead Purpose</strong>: <strong>{top_purpose}</strong> is the primary guest purpose (<strong>{purposes.get(top_purpose, 0)}</strong> occurrences).</li>
        <li><strong>Corporate Source</strong>: Guests from <strong>{top_company}</strong> constitute the largest corporate segment.</li>
        <li><strong>Traffic Forecast</strong>: Next peak traffic spikes are predicted on <strong>{busy_days_text or 'Weekdays'}</strong>, primarily around <strong>{peak_hours_text or '10:00 to 14:00'}</strong>. Guard gates should allocate 2 staff members during these windows.</li>
    </ul>"""

    return {"insights": html_insights}

@app.post("/ai/chatbot")
def answer_question(payload: ChatQuery):
    query_str = payload.query.lower().strip()
    
    # 1. NLP statistics check
    if any(k in query_str for k in ("stats", "summary", "how many visitors", "visitor count")):
        from datetime import datetime
        today_str = datetime.now().strftime("%Y-%m-%d")
        total = len(payload.visitors)
        today = sum(1 for v in payload.visitors if v.visitDate == today_str)
        inside = sum(1 for v in payload.visitors if v.status == "Checked In")
        pending = sum(1 for v in payload.visitors if v.status == "Pending")
        rejected = sum(1 for v in payload.visitors if v.status in ("Rejected", "Denied"))

        return {
            "answer": f"""Here is a live system audit summary:<br>
            <table class="chat-response-table" style="width:100%; border-collapse:collapse; margin-top:8px; font-size:0.8rem; border: 1px solid var(--border-color); border-radius: 4px;">
                <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 6px;">Total Database Records:</td><td style="text-align: right; padding:6px; font-weight:700;">{total}</td></tr>
                <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 6px;">Today's Registrations:</td><td style="text-align: right; padding:6px; font-weight:700; color:var(--accent-primary);">{today}</td></tr>
                <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 6px;">Currently inside Campus:</td><td style="text-align: right; padding:6px; font-weight:700; color:var(--accent-success);">{inside}</td></tr>
                <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 6px;">Pending Approvals:</td><td style="text-align: right; padding:6px; font-weight:700; color:var(--accent-amber);">{pending}</td></tr>
                <tr><td style="padding: 6px;">Rejected Registrations:</td><td style="text-align: right; padding:6px; font-weight:700; color:var(--accent-danger);">{rejected}</td></tr>
            </table>"""
        }

    # 2. Blacklist check
    if any(k in query_str for k in ("blacklist", "blocked", "restricted")):
        found = None
        for b in payload.blacklist:
            if b.name.lower() in query_str:
                found = b
                break

        if found:
            return {
                "answer": f"""<span style="color:var(--accent-danger); font-weight:bold;">⚠️ Blacklist Match Found</span><br>
                <strong>{found.name}</strong> was blacklisted on {found.dateAdded}.<br>
                <strong>Reason:</strong> {found.reason}<br>
                <strong>ID:</strong> {found.idType} ({found.idNumber})"""
            }

        return {
            "answer": f"""The local security blacklist database contains <strong>{len(payload.blacklist)}</strong> restricted records.<br>
            You can verify an individual by typing: <em>"Is [Name] blacklisted?"</em>"""
        }

    # 3. Vector database semantic search fallback
    query_tokens = tokenize(payload.query)
    if not query_tokens or not ai_state.vector_index:
        return {
            "answer": "I couldn't locate a precise answer. Try asking about a specific visitor's status, today's stats, or AI predictions."
        }

    query_tf = {}
    for t in query_tokens:
        query_tf[t] = query_tf.get(t, 0) + 1

    query_vector = {}
    q_length_sq = 0.0
    for term in ai_state.vocab_array:
        if term in query_tf:
            idf_weight = ai_state.idf.get(term, 0.1)
            weight = (query_tf[term] / len(query_tokens)) * idf_weight
            query_vector[term] = weight
            q_length_sq += weight * weight

    q_norm = math.sqrt(q_length_sq)
    if q_norm == 0:
         return {"answer": "I couldn't match any query terms. Try asking about different visitors or departments."}

    # Score documents
    scored_docs = []
    for doc in ai_state.vector_index:
        if doc["norm"] == 0:
            continue

        dot_product = sum(query_vector[term] * doc["vector"][term] for term in query_vector if term in doc["vector"])
        score = dot_product / (q_norm * doc["norm"])
        if score > 0.15:
            scored_docs.append((doc, score))

    scored_docs = sorted(scored_docs, key=lambda x: x[1], reverse=True)

    if scored_docs:
        doc, score = scored_docs[0]
        score_percent = int(score * 100)
        ref = doc["ref"]

        if doc["type"] == "visitor":
            return {
                "answer": f"""🔎 <strong>Semantic Match</strong> (Confidence: {score_percent}%):<br>
                Visitor <strong>{ref.name}</strong> ({ref.company or 'Individual'}) is currently marked as <span class="badge-status {ref.status.lower()}">{ref.status}</span>.<br>
                - <strong>Host</strong>: {ref.hostName} ({ref.hostDept})<br>
                - <strong>Purpose</strong>: {ref.purpose}<br>
                - <strong>Check-In</strong>: {ref.checkIn or '—'}<br>
                - <strong>Vehicle</strong>: {ref.vehicle or 'None'}"""
            }
        elif doc["type"] == "employee":
            return {
                "answer": f"""🔎 <strong>Employee Directory Match</strong> (Confidence: {score_percent}%):<br>
                Host <strong>{ref.name}</strong> is a <strong>{ref.designation or 'Employee'}</strong> in the <strong>{ref.dept}</strong> department.<br>
                - <strong>Workspace Cabin</strong>: {ref.cabin or '—'}<br>
                - <strong>Office Status</strong>: {ref.status or 'In Office'} ({'Inside Campus' if ref.campusStatus == 'Inside' else 'Off-site'})<br>
                - <strong>Contact Ext</strong>: {ref.phone or '—'}"""
            }
        elif doc["type"] == "blacklist":
            return {
                "answer": f"""<span style="color:var(--accent-danger); font-weight:bold;">⚠️ Security Alert! Semantic Match in Blacklist</span> (Confidence: {score_percent}%):<br>
                <strong>{ref.name}</strong> is restricted from entry.<br>
                - <strong>Reason</strong>: "{ref.reason}"<br>
                - <strong>ID Proof</strong>: {ref.idType} ({ref.idNumber})<br>
                - <strong>Added On</strong>: {ref.dateAdded}"""
            }
        elif doc["type"] == "department":
            return {
                "answer": f"""🔎 <strong>Department Match</strong> (Confidence: {score_percent}%):<br>
                The offices for the <strong>{ref.name}</strong> department are situated at: <strong>{ref.location}</strong>."""
            }

    return {
        "answer": """I couldn't locate a precise answer in the semantic search database for your query.<br>
        Try asking:<br>
        - <em>"Who is Manoj Kumar?"</em><br>
        - <em>"What is the status of Devon Carter?"</em><br>
        - <em>"Is John Doe blocked?"</em><br>
        - <em>"Today's stats summary"</em><br>
        - <em>"Show AI traffic predictions"</em>"""
    }
