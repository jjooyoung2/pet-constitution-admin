import React, { useEffect, useState } from 'react';
import './AdminPage.css';

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

const SUPABASE_FUNCTIONS_URL = 'https://xpeyzdvtzdtzxxsgcsyf.supabase.co/functions/v1';

const AdminPage: React.FC = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'consultations' | 'users'>('users');
  const [sortOrder, setSortOrder] = useState<'name' | 'date'>('date');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [appliedSearchQuery, setAppliedSearchQuery] = useState<string>('');
  const [searchType, setSearchType] = useState<'name' | 'email'>('name');

  useEffect(() => {
    if (activeTab === 'consultations') {
      fetchConsultations();
    } else {
      fetchUsers();
    }
  }, [activeTab]);

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const fetchConsultations = async () => {
    try {
      setIsLoading(true);
      const token = getToken();
      if (!token) {
        setError('로그인이 필요합니다.');
        return;
      }

      const response = await fetch(`${SUPABASE_FUNCTIONS_URL}/consultations-get`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ token }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setConsultations(result.data.consultations);
        setError(null);
      } else {
        setError(result.message || '상담 예약 목록을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const token = getToken();
      if (!token) {
        setError('로그인이 필요합니다.');
        return;
      }

      const response = await fetch(`${SUPABASE_FUNCTIONS_URL}/users-get`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ token }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setUsers(result.data.users);
        setError(null);
      } else {
        setError(result.message || '회원 목록을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserDetail = async (userId: number) => {
    try {
      setIsLoading(true);
      const token = getToken();
      if (!token) {
        setError('로그인이 필요합니다.');
        return;
      }

      const response = await fetch(`${SUPABASE_FUNCTIONS_URL}/user-detail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ token, userId }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSelectedUser(result.data);
        setError(null);
      } else {
        setError(result.message || '회원 상세 정보를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const token = getToken();
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }

      const response = await fetch(`${SUPABASE_FUNCTIONS_URL}/consultations-update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ token, status: newStatus }),
      });

      const result = await response.json();
      
      if (result.success) {
        alert('상태가 업데이트되었습니다.');
        fetchConsultations(); // 목록 새로고침
      } else {
        alert(`상태 업데이트 실패: ${result.message}`);
      }
    } catch (err) {
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

  // 검색 실행 함수
  const handleSearch = () => {
    setAppliedSearchQuery(searchQuery);
  };

  // Enter 키로 검색
  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 회원 목록 필터링 및 정렬
  const filteredAndSortedUsers = users
    .filter((user: User) => {
      if (!appliedSearchQuery.trim()) return true;
      
      if (searchType === 'name') {
        return user.name.toLowerCase().includes(appliedSearchQuery.toLowerCase());
      } else {
        return user.email.toLowerCase().includes(appliedSearchQuery.toLowerCase());
      }
    })
    .sort((a: User, b: User) => {
      if (sortOrder === 'name') {
        // 가나다순
        return a.name.localeCompare(b.name, 'ko');
      } else {
        // 등록순 (최신순)
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

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
                  <span>{new Date(selectedUser.user.created_at).toLocaleString()}</span>
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
                        <span className="constitution-badge">{result.constitution}</span>
                        <span className="date">{new Date(result.created_at).toLocaleString()}</span>
                      </div>
                      <div className="result-details">
                        <p><strong>나이:</strong> {result.pet_age}</p>
                        <p><strong>체중:</strong> {result.pet_weight}</p>
                        <p><strong>증상:</strong> {result.pet_symptoms}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div style={{ padding: '30px', borderTop: '1px solid #e8e3d8', textAlign: 'center', background: '#faf8f3' }}>
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
          <button 
            className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            회원 관리
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
        ) : (
          <div className="users-list">
            <div className="admin-controls">
              <div className="stats">
                <span>총 회원: {users.length}명</span>
                {appliedSearchQuery && (
                  <span>검색 결과: {filteredAndSortedUsers.length}명</span>
                )}
              </div>
            </div>

            {/* 검색 및 정렬 컨트롤 */}
            <div className="search-controls" style={{ 
              padding: '20px 30px', 
              background: '#faf8f3', 
              borderBottom: '1px solid #e8e3d8',
              display: 'flex',
              gap: '15px',
              flexWrap: 'wrap',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flex: '1', minWidth: '300px' }}>
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value as 'name' | 'email')}
                  style={{
                    padding: '10px 12px',
                    border: '1px solid #e8e3d8',
                    borderRadius: '8px',
                    background: 'white',
                    color: '#3a3a3a',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  <option value="name">이름</option>
                  <option value="email">이메일</option>
                </select>
                <input
                  type="text"
                  placeholder={`${searchType === 'name' ? '이름' : '이메일'}으로 검색...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  style={{
                    flex: '1',
                    padding: '10px 12px',
                    border: '1px solid #e8e3d8',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: '#3a3a3a',
                    minWidth: '200px'
                  }}
                />
                <button
                  onClick={handleSearch}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #4a7c59 0%, #3a6349 100%)',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(74, 124, 89, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  검색
                </button>
              </div>
              
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <label style={{ color: '#4a7c59', fontWeight: '600', fontSize: '14px' }}>정렬:</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'name' | 'date')}
                  style={{
                    padding: '10px 12px',
                    border: '1px solid #e8e3d8',
                    borderRadius: '8px',
                    background: 'white',
                    color: '#3a3a3a',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  <option value="date">등록순</option>
                  <option value="name">가나다순</option>
                </select>
              </div>
            </div>
            
            {users.length === 0 ? (
              <div className="no-users">
                <p>등록된 회원이 없습니다.</p>
              </div>
            ) : filteredAndSortedUsers.length === 0 ? (
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
                    {filteredAndSortedUsers.map((user) => (
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
                        <td>{new Date(user.created_at).toLocaleDateString()}</td>
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
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
