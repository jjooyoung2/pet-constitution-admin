const API_BASE_URL = 'https://tbctjhfypfcjextmxaow.supabase.co/functions/v1';

// 인증 관련 API
export const authAPI = {
  async login(credentials: { email: string; password: string }) {
    const response = await fetch(`${API_BASE_URL}/auth-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return await response.json();
  },

  async register(userData: { email: string; password: string; name: string }) {
    const response = await fetch(`${API_BASE_URL}/auth-register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return await response.json();
  },

  async getMe(token: string) {
    const response = await fetch(`${API_BASE_URL}/auth-me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  },
};

// 결과 관련 API
export const resultsAPI = {
  async saveResult(resultData: any, token: string) {
    const response = await fetch(`${API_BASE_URL}/results-save`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resultData),
    });
    return await response.json();
  },

  async getMyResults(token: string) {
    const response = await fetch(`${API_BASE_URL}/results-get`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  },

  async getResultList() {
    const response = await fetch(`${API_BASE_URL}/results-list`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  },

  async getResult(resultId: string, token: string) {
    const response = await fetch(`${API_BASE_URL}/results-get`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resultId }),
    });
    return await response.json();
  },

  async deleteResult(resultId: string, token: string) {
    const response = await fetch(`${API_BASE_URL}/results-delete`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resultId }),
    });
    return await response.json();
  },
};

// 상담 관련 API
export const consultationAPI = {
  async createConsultation(consultationData: any, token: string) {
    const response = await fetch(`${API_BASE_URL}/consultation-save`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(consultationData),
    });
    return await response.json();
  },

  async getMyConsultations(token: string) {
    const response = await fetch(`${API_BASE_URL}/consultations-get`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  },
};

// 관리자용 API
export const adminAPI = {
  async getAllConsultations() {
    const response = await fetch(`${API_BASE_URL}/consultations-get`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  },

  async getAllUsers() {
    const response = await fetch(`${API_BASE_URL}/users-get`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  },

  async getUserDetail(userId: string) {
    const response = await fetch(`${API_BASE_URL}/users-get/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  },

  async updateConsultationStatus(consultationId: string, status: string) {
    const response = await fetch(`${API_BASE_URL}/consultations-update/${consultationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    return await response.json();
  },
};