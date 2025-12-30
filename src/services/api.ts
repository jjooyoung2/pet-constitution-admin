// API 기본 설정
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-supabase-url.supabase.co/rest/v1';

// 공통 API 응답 타입
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 인증 관련 API
export const authAPI = {
  // 로그인
  async login(credentials: { email: string; password: string }): Promise<ApiResponse<{ token: string; user: any }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      
      if (response.ok) {
        return { success: true, data };
      } else {
        return { success: false, error: data.message || '로그인에 실패했습니다.' };
      }
    } catch (error) {
      return { success: false, error: '네트워크 오류가 발생했습니다.' };
    }
  },

  // 회원가입
  async register(userData: { email: string; password: string; name: string }): Promise<ApiResponse<{ token: string; user: any }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      
      if (response.ok) {
        return { success: true, data };
      } else {
        return { success: false, error: data.message || '회원가입에 실패했습니다.' };
      }
    } catch (error) {
      return { success: false, error: '네트워크 오류가 발생했습니다.' };
    }
  },

  // 사용자 정보 조회
  async getMe(token: string): Promise<ApiResponse<{ user: any }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        return { success: true, data };
      } else {
        return { success: false, error: data.message || '사용자 정보를 가져올 수 없습니다.' };
      }
    } catch (error) {
      return { success: false, error: '네트워크 오류가 발생했습니다.' };
    }
  },

};

// 결과 관련 API
export const resultsAPI = {
  // 결과 저장
  async saveResult(resultData: any, token?: string): Promise<ApiResponse> {
    try {
      const headers: any = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/results`, {
        method: 'POST',
        headers,
        body: JSON.stringify(resultData),
      });

      const data = await response.json();
      
      if (response.ok) {
        return { success: true, data };
      } else {
        return { success: false, error: data.message || '결과 저장에 실패했습니다.' };
      }
    } catch (error) {
      return { success: false, error: '네트워크 오류가 발생했습니다.' };
    }
  },

  // 사용자 결과 조회
  async getUserResults(token: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/results/user`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        return { success: true, data };
      } else {
        return { success: false, error: data.message || '결과를 가져올 수 없습니다.' };
      }
    } catch (error) {
      return { success: false, error: '네트워크 오류가 발생했습니다.' };
    }
  }
};