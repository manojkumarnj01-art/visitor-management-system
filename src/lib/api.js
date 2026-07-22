// Node.js + Express + MSSQL REST API Client Adapter for Visitor Management System
// Replaces Supabase SDK with direct fetch calls to http://localhost:5000/api

const BACKEND_BASE_URL = "http://localhost:5000/api";

const TABLE_ENDPOINT_MAP = {
  branches: "/branches",
  departments: "/departments",
  employees: "/employees",
  visitors: "/visitors",
  visitor_passes: "/visitors",
  blacklist: "/blacklist",
  notifications: "/notifications",
  security_users: "/security-users",
  system_settings: "/system-settings",
  audit_logs: "/audit-logs",
  purchase_manuals: "/purchase-manuals",
  work_permits: "/work-permits",
  students: "/students"
};

function getAuthHeaders() {
  const token = localStorage.getItem("vms_jwt_token");
  let userRole = "Administrator";
  try {
    const userStr = localStorage.getItem("gk_current_user");
    if (userStr) {
      const u = JSON.parse(userStr);
      if (u && u.role) userRole = u.role;
    }
  } catch (e) {}

  return {
    "Content-Type": "application/json",
    "X-User-Role": userRole,
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

class RestQueryBuilder {
  constructor(table) {
    this.table = table;
    this.endpoint = TABLE_ENDPOINT_MAP[table] || `/${table}`;
    this.filters = {};
  }

  select(columns = "*") {
    this.operation = "SELECT";
    return this;
  }

  eq(column, value) {
    this.filters[column] = value;
    return this;
  }

  single() {
    this.isSingle = true;
    return this;
  }

  order(column, options = {}) {
    this.orderCol = column;
    this.orderAsc = options.ascending !== false;
    return this;
  }

  limit(count) {
    this.limitCount = count;
    return this;
  }

  async insert(data) {
    const payload = Array.isArray(data) ? data[0] : data;
    try {
      const res = await fetch(`${BACKEND_BASE_URL}${this.endpoint}`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      const resultData = json.data ? (Array.isArray(data) ? [json.data] : json.data) : null;
      return { data: resultData, error: json.success ? null : new Error(json.message) };
    } catch (err) {
      return { data: null, error: err };
    }
  }

  async update(data) {
    const id = this.filters.id || this.filters.visitor_code || this.filters.employee_code || this.filters.phone || this.filters.permit_code || this.filters.manual_code;
    const url = id ? `${BACKEND_BASE_URL}${this.endpoint}/${id}` : `${BACKEND_BASE_URL}${this.endpoint}`;
    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      const json = await res.json();
      return { data: json.data, error: json.success ? null : new Error(json.message) };
    } catch (err) {
      return { data: null, error: err };
    }
  }

  async upsert(data, options = {}) {
    const payload = Array.isArray(data) ? data : [data];
    try {
      let lastResult = null;
      for (const item of payload) {
        const res = await fetch(`${BACKEND_BASE_URL}${this.endpoint}`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(item)
        });
        const json = await res.json();
        lastResult = json.data;
      }
      return { data: Array.isArray(data) ? [lastResult] : lastResult, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  }

  async delete() {
    const id = this.filters.id || this.filters.employee_code || this.filters.phone || this.filters.permit_code || this.filters.manual_code || this.filters.username;
    try {
      const res = await fetch(`${BACKEND_BASE_URL}${this.endpoint}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });
      const json = await res.json();
      return { data: json.data, error: json.success ? null : new Error(json.message) };
    } catch (err) {
      return { data: null, error: err };
    }
  }

  then(resolve, reject) {
    this._executeQuery().then(resolve, reject);
  }

  async _executeQuery() {
    try {
      let url = `${BACKEND_BASE_URL}${this.endpoint}`;
      if (this.filters.id) {
        url += `/${this.filters.id}`;
      } else if (this.filters.employee_code || this.filters.code) {
        url += `/code/${this.filters.employee_code || this.filters.code}`;
      } else if (this.filters.username) {
        url += `/${this.filters.username}`;
      }

      const res = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders()
      });
      const json = await res.json();

      let data = json.data;
      if (data && Array.isArray(data)) {
        if (this.filters.status) {
          data = data.filter(item => item.status === this.filters.status);
        }
        if (this.isSingle) {
          data = data[0] || null;
        }
      }

      return { data, error: json.success ? null : new Error(json.message) };
    } catch (err) {
      return { data: null, error: err };
    }
  }
}

export const apiClient = {
  from: (table) => new RestQueryBuilder(table),
  get: async (endpoint) => {
    const res = await fetch(`${BACKEND_BASE_URL}${endpoint}`, { headers: getAuthHeaders() });
    return res.json();
  },
  post: async (endpoint, data) => {
    const res = await fetch(`${BACKEND_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  put: async (endpoint, data) => {
    const res = await fetch(`${BACKEND_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  delete: async (endpoint) => {
    const res = await fetch(`${BACKEND_BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    return res.json();
  },
  auth: {
    signInWithPassword: async ({ username, email, password }) => {
      try {
        const userVal = username || email;
        const res = await fetch(`${BACKEND_BASE_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: userVal, email: email, password })
        });
        const json = await res.json();
        if (json.success && json.data.token) {
          localStorage.setItem("vms_jwt_token", json.data.token);
          return { data: { user: json.data.user, session: { access_token: json.data.token } }, error: null };
        }
        return { data: null, error: new Error(json.message || "Invalid credentials") };
      } catch (err) {
        return { data: null, error: err };
      }
    },
    signUp: async (data) => {
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
        const json = await res.json();
        if (json.success && json.data.token) {
          localStorage.setItem("vms_jwt_token", json.data.token);
          return { data: { user: json.data.user, session: { access_token: json.data.token } }, error: null };
        }
        return { data: null, error: new Error(json.message || "Registration failed") };
      } catch (err) {
        return { data: null, error: err };
      }
    },
    signOut: async () => {
      localStorage.removeItem("vms_jwt_token");
      return { error: null };
    },
    getSession: async () => {
      const token = localStorage.getItem("vms_jwt_token");
      if (token) {
        return { data: { session: { access_token: token } }, error: null };
      }
      return { data: { session: null }, error: null };
    }
  }
};

window.apiClient = apiClient;
window.supabaseClient = apiClient;
window.supabase = {
  createClient: () => apiClient,
  from: (table) => apiClient.from(table)
};

export default apiClient;
