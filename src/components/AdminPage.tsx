import React, { useEffect, useState } from 'react';

interface Consultation {
  id: number;
  name: string;
  phone: string;
  preferred_date: string;
  content: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
}

interface User {
  id: number;
  name: string;
  phone: string;
  email: string;
  created_at: string;
}

interface UserDetail {
  user: User;
  results: Array<{
    id: number;
    pet_name: string;
    pet_age: string;
    pet_weight: string;
    pet_symptoms: string;
    pet_type?: string;
    answers: any[];
    constitution: string;
    created_at: string;
  }>;
  consultations: Array<{
    id: number;
    name: string;
    phone: string;
    preferred_date: string;
    content: string;
    status: string;
    created_at: string;
    updated_at: string;
  }>;
}

interface EmailSubmission {
  id: number;
  email: string;
  name: string;
  phone: string;
  submitted_at: string;
  result_id: number;
  email_sent?: boolean;
}

const AdminPage: React.FC = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'consultations' | 'users' | 'email-send'>('users');
  const [emailSubmissions, setEmailSubmissions] = useState<EmailSubmission[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<number[]>([]);
  const [searchCriteria, setSearchCriteria] = useState<'name' | 'email'>('name');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredSearchQuery, setFilteredSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'registration' | 'alphabetical'>('registration');
  const [emailSearchCriteria, setEmailSearchCriteria] = useState<'name' | 'email'>('name');
  const [emailSearchQuery, setEmailSearchQuery] = useState<string>('');
  const [filteredEmailSearchQuery, setFilteredEmailSearchQuery] = useState<string>('');
  const [emailSortOrder, setEmailSortOrder] = useState<'registration' | 'alphabetical'>('registration');

  useEffect(() => {
    document.title = '온솔 반려동물 체질 검사 관리 시스템';
  }, []);

  useEffect(() => {
    if (activeTab === 'consultations') {
      fetchConsultations();
    } else if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'email-send') {
      fetchEmailSubmissions();
    }
  }, [activeTab]);

  const fetchConsultations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // localStorage에서 토큰 가져오기
      const token = localStorage.getItem('token');
      
      // Supabase Edge Function으로 상담 예약 목록 조회
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwZXl6ZHZ0emR0enh4c2djc3lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MjEzNTQsImV4cCI6MjA4MDQ5NzM1NH0.NfHYC4H9EWbMItKY2Q_GMbRmOHloq4lGi_rpxAKq5zA',
      };
      
      // 토큰이 있으면 Authorization 헤더 추가
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('https://xpeyzdvtzdtzxxsgcsyf.supabase.co/functions/v1/consultations-get', {
        method: 'POST',
        headers,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Edge Function error:', errorText);
        throw new Error(`상담 예약 목록을 불러오는데 실패했습니다. (${response.status})`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setConsultations(result.data.consultations);
        setError(null);
      } else {
        setError(result.message || '상담 예약 목록을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('fetchConsultations error:', err);
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // localStorage에서 토큰 가져오기
      const token = localStorage.getItem('token');
      
      // Supabase Edge Function으로 회원 목록 조회
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwZXl6ZHZ0emR0enh4c2djc3lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MjEzNTQsImV4cCI6MjA4MDQ5NzM1NH0.NfHYC4H9EWbMItKY2Q_GMbRmOHloq4lGi_rpxAKq5zA',
      };
      
      // 토큰이 있으면 Authorization 헤더 추가
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('https://xpeyzdvtzdtzxxsgcsyf.supabase.co/functions/v1/users-get', {
        method: 'POST',
        headers,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Edge Function error:', errorText);
        throw new Error(`회원 목록을 불러오는데 실패했습니다. (${response.status})`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setUsers(result.data.users);
        setError(null);
      } else {
        setError(result.message || '회원 목록을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('fetchUsers error:', err);
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsSent = async () => {
    if (selectedEmails.length === 0) {
      alert('선택된 항목이 없습니다.');
      return;
    }

    if (!window.confirm(`선택한 ${selectedEmails.length}건을 발송완료로 변경하시겠습니까?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('인증 토큰이 필요합니다.');
        return;
      }

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwZXl6ZHZ0emR0enh4c2djc3lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MjEzNTQsImV4cCI6MjA4MDQ5NzM1NH0.NfHYC4H9EWbMItKY2Q_GMbRmOHloq4lGi_rpxAKq5zA',
        'Authorization': `Bearer ${token}`,
      };

      const response = await fetch('https://xpeyzdvtzdtzxxsgcsyf.supabase.co/functions/v1/results-update-email-sent', {
        method: 'POST',
        headers,
        body: JSON.stringify({ resultIds: selectedEmails }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Edge Function error:', errorText);
        throw new Error(`발송완료 상태 변경 실패 (${response.status})`);
      }

      const result = await response.json();
      
      if (result.success) {
        alert(`${selectedEmails.length}건이 발송완료로 변경되었습니다.`);
        setSelectedEmails([]);
        fetchEmailSubmissions(); // 목록 새로고침
      } else {
        alert(`발송완료 상태 변경 실패: ${result.message}`);
      }
    } catch (err) {
      console.error('handleMarkAsSent error:', err);
      alert('발송완료 상태 변경 중 오류가 발생했습니다.');
    }
  };

  const fetchEmailSubmissions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // localStorage에서 토큰 가져오기
      const token = localStorage.getItem('token');
      
      // Supabase Edge Function으로 이메일 제출 목록 조회
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwZXl6ZHZ0emR0enh4c2djc3lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MjEzNTQsImV4cCI6MjA4MDQ5NzM1NH0.NfHYC4H9EWbMItKY2Q_GMbRmOHloq4lGi_rpxAKq5zA',
      };
      
      // 토큰이 있으면 Authorization 헤더 추가
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('https://xpeyzdvtzdtzxxsgcsyf.supabase.co/functions/v1/email-submissions-get', {
        method: 'POST',
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Edge Function error:', errorText);
        throw new Error(`이메일 제출 목록을 불러오는데 실패했습니다. (${response.status})`);
      }

      const result = await response.json();
      
      if (result.success) {
        setEmailSubmissions(result.data);
        setError(null);
      } else {
        setError(result.message || '이메일 제출 목록을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('fetchEmailSubmissions error:', err);
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
      
      // Edge Function이 배포되지 않은 경우를 위한 안내
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('CORS')) {
        setError('Edge Function이 배포되지 않았습니다. Supabase Dashboard에서 email-submissions-get 함수를 배포해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserDetail = async (userId: number) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // localStorage에서 토큰 가져오기
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('인증 토큰이 필요합니다.');
        setIsLoading(false);
        return;
      }
      
      // Supabase Edge Function으로 회원 상세 정보 조회
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwZXl6ZHZ0emR0enh4c2djc3lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MjEzNTQsImV4cCI6MjA4MDQ5NzM1NH0.NfHYC4H9EWbMItKY2Q_GMbRmOHloq4lGi_rpxAKq5zA',
        'Authorization': `Bearer ${token}`,
      };
      
      const response = await fetch('https://xpeyzdvtzdtzxxsgcsyf.supabase.co/functions/v1/user-detail', {
        method: 'POST',
        headers,
        body: JSON.stringify({ userId: userId.toString() }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Edge Function error:', errorText);
        
        if (response.status === 404) {
          throw new Error('user-detail Edge Function이 배포되지 않았습니다. Supabase Dashboard에서 배포해주세요.');
        }
        
        throw new Error(`회원 상세 정보를 불러오는데 실패했습니다. (${response.status})`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setSelectedUser(result.data);
        setError(null);
      } else {
        setError(result.message || '회원 상세 정보를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('fetchUserDetail error:', err);
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      
      // 404 에러인 경우 명확한 안내 메시지
      if (errorMessage.includes('404') || errorMessage.includes('배포되지 않았습니다')) {
        setError('⚠️ user-detail Edge Function이 배포되지 않았습니다.\n\nSupabase Dashboard → Edge Functions → user-detail → Deploy');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      // localStorage에서 토큰 가져오기
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('인증 토큰이 필요합니다.');
        return;
      }
      
      // Supabase Edge Function으로 상담 예약 상태 업데이트
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwZXl6ZHZ0emR0enh4c2djc3lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MjEzNTQsImV4cCI6MjA4MDQ5NzM1NH0.NfHYC4H9EWbMItKY2Q_GMbRmOHloq4lGi_rpxAKq5zA',
        'Authorization': `Bearer ${token}`,
      };
      
      const response = await fetch('https://xpeyzdvtzdtzxxsgcsyf.supabase.co/functions/v1/consultations-update', {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          consultationId: id,
          status: newStatus 
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Edge Function error:', errorText);
        throw new Error(`상태 업데이트 실패 (${response.status})`);
      }

      const result = await response.json();
      
      if (result.success) {
        alert('상태가 업데이트되었습니다.');
        fetchConsultations(); // 목록 새로고침
      } else {
        alert(`상태 업데이트 실패: ${result.message}`);
      }
    } catch (err) {
      console.error('updateStatus error:', err);
      alert('상태 업데이트 중 오류가 발생했습니다.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#ff9800';
      case 'confirmed': return '#2196f3';
      case 'completed': return '#4caf50';
      case 'cancelled': return '#f44336';
      default: return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '대기중';
      case 'confirmed': return '확정';
      case 'completed': return '완료';
      case 'cancelled': return '취소';
      default: return status;
    }
  };

  const filteredConsultations = selectedStatus === 'all' 
    ? consultations 
    : consultations.filter(c => c.status === selectedStatus);

  if (isLoading) {
    return (
      <div className="admin-page">
        <div className="card">
          <p>상담 예약 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="card">
          <p className="error-message">오류: {error}</p>
          <button className="btn btn-primary" onClick={fetchConsultations}>
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // 회원 상세보기 페이지
  if (selectedUser) {
    return (
      <div className="admin-page">
        <div className="card">
          <div className="header">
            <h2>👤 회원 상세 정보</h2>
            <p>{selectedUser.user.name}님의 상세 정보</p>
          </div>

          <div className="user-detail">
            <div className="user-info">
              <h3>기본 정보</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>이름:</label>
                  <span>{selectedUser.user.name}</span>
                </div>
                <div className="info-item">
                  <label>전화번호:</label>
                  <span>{selectedUser.user.phone}</span>
                </div>
                <div className="info-item">
                  <label>이메일:</label>
                  <span>{selectedUser.user.email}</span>
                </div>
                <div className="info-item">
                  <label>가입일:</label>
                  <span>{(() => {
                    const date = new Date(selectedUser.user.created_at);
                    const kstDate = new Date(date.getTime() + (9 * 60 * 60 * 1000));
                    return kstDate.toLocaleString('ko-KR', {
                      timeZone: 'Asia/Seoul',
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: true
                    });
                  })()}</span>
                </div>
              </div>
            </div>

            <div className="user-results">
              <h3>반려동물 체질 설문 내역 ({selectedUser.results.length}건)</h3>
              {selectedUser.results.length === 0 ? (
                <p>설문 내역이 없습니다.</p>
              ) : (
                <div className="results-list">
                  {selectedUser.results.map((result) => (
                    <div key={result.id} className="result-item">
                      <div className="result-header">
                        <h4>{result.pet_name}</h4>
                        <span className="date">{(() => {
                          const date = new Date(result.created_at);
                          const kstDate = new Date(date.getTime() + (9 * 60 * 60 * 1000));
                          return kstDate.toLocaleString('ko-KR', {
                            timeZone: 'Asia/Seoul',
                            year: 'numeric',
                            month: 'numeric',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: true
                          });
                        })()}</span>
                      </div>
                      <div className="result-details">
                        {result.pet_type && (
                          <p><strong>구분:</strong> {result.pet_type === 'dog' ? '강아지' : result.pet_type === 'cat' ? '고양이' : result.pet_type}</p>
                        )}
                        <p><strong>반려동물 이름:</strong> {result.pet_name}</p>
                        <p><strong>체질:</strong> {result.constitution}</p>
                        {result.pet_age && (
                          <p><strong>나이:</strong> {result.pet_age}</p>
                        )}
                        {result.pet_weight && (
                          <p><strong>체중:</strong> {result.pet_weight}</p>
                        )}
                        {result.pet_symptoms && (
                          <p><strong>주요증상:</strong> {result.pet_symptoms}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 예약 내역 섹션 숨김 */}
            {/* <div className="user-consultations">
              <h3>예약 내역 ({selectedUser.consultations.length}건)</h3>
              {selectedUser.consultations.length === 0 ? (
                <p>예약 내역이 없습니다.</p>
              ) : (
                <div className="consultations-list">
                  {selectedUser.consultations.map((consultation) => (
                    <div key={consultation.id} className="consultation-item">
                      <div className="consultation-header">
                        <h4>상담 예약 #{consultation.id}</h4>
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(consultation.status) }}
                        >
                          {getStatusText(consultation.status)}
                        </span>
                        <span className="date">
                          희망일: {new Date(consultation.preferred_date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="consultation-content">
                        <p><strong>상담 내용:</strong></p>
                        <p>{consultation.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div> */}
          </div>
          <div style={{ textAlign: 'center', padding: '30px 0' }}>
            <button 
              className="btn btn-secondary" 
              onClick={() => setSelectedUser(null)}
            >
              ← 목록으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="card">
        <div className="header">
          <h2>🏥 관리자 페이지</h2>
          <p>온솔 반려동물 체질 검사 관리 시스템</p>
        </div>

        <div className="admin-tabs">
          {/* 상담 예약 관리 탭 숨김 */}
          {/* <button 
            className={`tab-button ${activeTab === 'consultations' ? 'active' : ''}`}
            onClick={() => setActiveTab('consultations')}
          >
            상담 예약 관리
          </button> */}
          <button 
            className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            회원 관리
          </button>
          <button 
            className={`tab-button ${activeTab === 'email-send' ? 'active' : ''}`}
            onClick={() => setActiveTab('email-send')}
          >
            이메일 발송관리
          </button>
        </div>

        {activeTab === 'consultations' ? (
          <>
            <div className="admin-controls">
              <div className="filter-section">
                <label>상태별 필터:</label>
                <select 
                  value={selectedStatus} 
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="status-filter"
                >
                  <option value="all">전체</option>
                  <option value="pending">대기중</option>
                  <option value="confirmed">확정</option>
                  <option value="completed">완료</option>
                  <option value="cancelled">취소</option>
                </select>
              </div>
              
              <div className="stats">
                <span>총 예약: {consultations.length}건</span>
                <span>대기중: {consultations.filter(c => c.status === 'pending').length}건</span>
                <span>확정: {consultations.filter(c => c.status === 'confirmed').length}건</span>
              </div>
            </div>

            <div className="consultations-list">
              {filteredConsultations.length === 0 ? (
                <div className="no-consultations">
                  <p>상담 예약이 없습니다.</p>
                </div>
              ) : (
                filteredConsultations.map((consultation) => (
                  <div key={consultation.id} className="consultation-item">
                    <div className="consultation-header">
                      <div className="consultation-info">
                        <h4>{consultation.name}</h4>
                        <span className="phone">{consultation.phone}</span>
                        <span className="date">
                          희망일: {new Date(consultation.preferred_date).toLocaleDateString()}
                        </span>
                        <span className="created">
                          신청일: {new Date(consultation.created_at).toLocaleString()}
                        </span>
                      </div>
                      <div className="consultation-status">
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(consultation.status) }}
                        >
                          {getStatusText(consultation.status)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="consultation-content">
                      <p><strong>상담 내용:</strong></p>
                      <p>{consultation.content}</p>
                    </div>
                    
                    <div className="consultation-actions">
                      <select
                        value={consultation.status}
                        onChange={(e) => updateStatus(consultation.id, e.target.value)}
                        className="status-select"
                      >
                        <option value="pending">대기중</option>
                        <option value="confirmed">확정</option>
                        <option value="completed">완료</option>
                        <option value="cancelled">취소</option>
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : activeTab === 'email-send' ? (
          <>
            <div className="admin-controls">
              <div className="stats">
                <span>총 이메일 제출: {emailSubmissions.length}건</span>
              </div>
            </div>
            <div className="search-controls-wrapper">
              <div className="search-controls">
                <select
                  className="search-criteria-select"
                  value={emailSearchCriteria}
                  onChange={(e) => setEmailSearchCriteria(e.target.value as 'name' | 'email')}
                >
                  <option value="name">이름</option>
                  <option value="email">이메일</option>
                </select>
                <input
                  type="text"
                  className="search-input"
                  placeholder={emailSearchCriteria === 'name' ? '이름으로 검색...' : '이메일로 검색...'}
                  value={emailSearchQuery}
                  onChange={(e) => setEmailSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      setFilteredEmailSearchQuery(emailSearchQuery);
                    }
                  }}
                />
                <button
                  className="btn btn-primary search-button"
                  onClick={() => {
                    setFilteredEmailSearchQuery(emailSearchQuery);
                  }}
                >
                  검색
                </button>
                <span className="sort-label">정렬:</span>
                <select
                  className="sort-select"
                  value={emailSortOrder}
                  onChange={(e) => setEmailSortOrder(e.target.value as 'registration' | 'alphabetical')}
                >
                  <option value="registration">등록순</option>
                  <option value="alphabetical">가나다순</option>
                </select>
              </div>
              <button
                className="btn btn-primary"
                onClick={handleMarkAsSent}
                disabled={selectedEmails.length === 0}
              >
                메일발송완료
              </button>
            </div>
            
            {(() => {
              // 검색 필터링
              let filteredSubmissions = emailSubmissions;
              if (filteredEmailSearchQuery.trim()) {
                filteredSubmissions = emailSubmissions.filter(submission => {
                  if (emailSearchCriteria === 'name') {
                    return submission.name.toLowerCase().includes(filteredEmailSearchQuery.toLowerCase());
                  } else {
                    return submission.email.toLowerCase().includes(filteredEmailSearchQuery.toLowerCase());
                  }
                });
              }

              // 정렬
              const sortedSubmissions = [...filteredSubmissions].sort((a, b) => {
                if (emailSortOrder === 'registration') {
                  return new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime();
                } else {
                  return a.name.localeCompare(b.name, 'ko');
                }
              });

              return sortedSubmissions.length === 0 ? (
                <div className="no-users">
                  <p>검색 결과가 없습니다.</p>
                </div>
              ) : (
                <div className="users-table">
                  <table>
                    <thead>
                      <tr>
                        <th>
                          <input
                            type="checkbox"
                            checked={selectedEmails.length === sortedSubmissions.length && sortedSubmissions.length > 0}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedEmails(sortedSubmissions.map(item => item.id));
                              } else {
                                setSelectedEmails([]);
                              }
                            }}
                          />
                        </th>
                        <th>이메일</th>
                        <th>이름</th>
                        <th>전화번호</th>
                        <th>상태</th>
                        <th>제출일</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedSubmissions.map((submission) => (
                        <tr key={submission.id}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedEmails.includes(submission.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedEmails([...selectedEmails, submission.id]);
                                } else {
                                  setSelectedEmails(selectedEmails.filter(id => id !== submission.id));
                                }
                              }}
                            />
                          </td>
                          <td>{submission.email}</td>
                          <td>{submission.name}</td>
                          <td>{submission.phone}</td>
                          <td>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: 600,
                              backgroundColor: submission.email_sent ? '#4caf50' : '#ff9800',
                              color: 'white'
                            }}>
                              {submission.email_sent ? '발송완료' : '미완료'}
                            </span>
                          </td>
                          <td>
                            {(() => {
                              const date = new Date(submission.submitted_at);
                              const kstDate = new Date(date.getTime() + (9 * 60 * 60 * 1000));
                              return kstDate.toLocaleString('ko-KR', {
                                timeZone: 'Asia/Seoul',
                                year: 'numeric',
                                month: 'numeric',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: true
                              });
                            })()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })()}
          </>
        ) : (
          <div className="users-list">
            <div className="admin-controls">
              <div className="stats">
                <span>총 회원: {users.length}명</span>
              </div>
            </div>
            <div className="search-controls-wrapper">
              <div className="search-controls">
                <select
                  className="search-criteria-select"
                  value={searchCriteria}
                  onChange={(e) => setSearchCriteria(e.target.value as 'name' | 'email')}
                >
                  <option value="name">이름</option>
                  <option value="email">이메일</option>
                </select>
                <input
                  type="text"
                  className="search-input"
                  placeholder={searchCriteria === 'name' ? '이름으로 검색...' : '이메일로 검색...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      setFilteredSearchQuery(searchQuery);
                    }
                  }}
                />
                <button
                  className="btn btn-primary search-button"
                  onClick={() => {
                    setFilteredSearchQuery(searchQuery);
                  }}
                >
                  검색
                </button>
                <span className="sort-label">정렬:</span>
                <select
                  className="sort-select"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'registration' | 'alphabetical')}
                >
                  <option value="registration">등록순</option>
                  <option value="alphabetical">가나다순</option>
                </select>
              </div>
            </div>
            
            {(() => {
              // 검색 필터링
              let filteredUsers = users;
              if (filteredSearchQuery.trim()) {
                filteredUsers = users.filter(user => {
                  if (searchCriteria === 'name') {
                    return user.name.toLowerCase().includes(filteredSearchQuery.toLowerCase());
                  } else {
                    return user.email.toLowerCase().includes(filteredSearchQuery.toLowerCase());
                  }
                });
              }

              // 정렬
              const sortedUsers = [...filteredUsers].sort((a, b) => {
                if (sortOrder === 'registration') {
                  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                } else {
                  return a.name.localeCompare(b.name, 'ko');
                }
              });

              return sortedUsers.length === 0 ? (
                <div className="no-users">
                  <p>검색 결과가 없습니다.</p>
                </div>
              ) : (
                <div className="users-table">
                  <table>
                    <thead>
                      <tr>
                        <th>이름</th>
                        <th>전화번호</th>
                        <th>이메일</th>
                        <th>가입일</th>
                        <th>액션</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedUsers.map((user) => (
                        <tr key={user.id}>
                          <td>
                            <button 
                              className="user-name-link"
                              onClick={() => fetchUserDetail(user.id)}
                            >
                              {user.name}
                            </button>
                          </td>
                          <td>{user.phone || '-'}</td>
                          <td>{user.email}</td>
                          <td>{new Date(user.created_at).toLocaleDateString('ko-KR')}</td>
                          <td>
                            <button 
                              className="btn btn-primary btn-sm"
                              onClick={() => fetchUserDetail(user.id)}
                            >
                              상세보기
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;

