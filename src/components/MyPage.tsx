import React, { useState, useEffect } from 'react';
import { resultsAPI, consultationAPI } from '../services/api';
import { constitutionData } from '../data/constitutionData';

interface Result {
  id: number;
  pet_name: string;
  pet_age: string;
  pet_weight: string;
  pet_symptoms: string;
  answers: string[];
  constitution: string;
  created_at: string;
}

interface Consultation {
  id: number;
  name: string;
  phone: string;
  preferred_date: string;
  content: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

interface MyPageProps {
  user: { id: number; email: string; name: string | null };
  token: string;
  onBack: () => void;
  onViewResult: (result: Result) => void;
  onStartNewDiagnosis: () => void;
}

const MyPage: React.FC<MyPageProps> = ({ user, token, onBack, onViewResult, onStartNewDiagnosis }) => {
  const [results, setResults] = useState<Result[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'results' | 'consultations'>('results');

  useEffect(() => {
    loadData();
  }, [token]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      console.log('=== MyPage loadData ===');
      console.log('Token:', token);
      console.log('User:', user);
      
      // 설문 결과와 상담 문의를 병렬로 로드
      const [resultsResponse, consultationsResponse] = await Promise.all([
        resultsAPI.getMyResults(token),
        consultationAPI.getMyConsultations(token)
      ]);

      if (resultsResponse.success && resultsResponse.data) {
        setResults(resultsResponse.data.results);
      }

      if (consultationsResponse.success && consultationsResponse.data) {
        setConsultations(consultationsResponse.data.consultations);
      }

      if (!resultsResponse.success && !consultationsResponse.success) {
        setError('데이터를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getConstitutionInfo = (constitution: string) => {
    return constitutionData[constitution] || {
      name: constitution,
      description: '체질 정보를 찾을 수 없습니다.'
    };
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

  if (isLoading) {
    return (
      <div className="mypage">
        <div className="card">
          <div className="header">
            <h2>마이페이지</h2>
            <p>데이터를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mypage">
        <div className="card">
          <div className="header">
            <h2>마이페이지</h2>
            <p className="error-message">{error}</p>
            <button className="btn btn-primary" onClick={loadData}>
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mypage">
      <div className="card">
        <div className="header">
          <h2>{user.name || user.email}님의 마이페이지</h2>
          <p>진단 결과와 상담 문의를 확인하고 관리하세요.</p>
        </div>

        <div className="user-info">
          <h3>내 정보</h3>
          <p className="info-item"><strong>이메일:</strong> {user.email}</p>
          {user.name && <p className="info-item"><strong>이름:</strong> {user.name}</p>}
        </div>

        {/* 탭 네비게이션 */}
        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'results' ? 'active' : ''}`}
            onClick={() => setActiveTab('results')}
          >
            진단 결과 ({results.length})
          </button>
          <button 
            className={`tab-button ${activeTab === 'consultations' ? 'active' : ''}`}
            onClick={() => setActiveTab('consultations')}
          >
            상담 문의 ({consultations.length})
          </button>
        </div>

        {/* 탭 컨텐츠 */}
        {activeTab === 'results' && (
          <div className="results-section">
            <h3>진단 결과 ({results.length}개)</h3>
            
            {results.length === 0 ? (
              <div className="no-results">
                <p>아직 진단 결과가 없습니다.</p>
                <button className="btn btn-primary" onClick={onStartNewDiagnosis}>
                  새 진단 시작하기
                </button>
              </div>
            ) : (
              <div className="results-list">
                {results.map((result) => {
                  const constitutionInfo = getConstitutionInfo(result.constitution);
                  return (
                    <div key={result.id} className="result-item">
                      <div className="result-header">
                        <h4>{result.pet_name || '이름 없음'}</h4>
                        <span className="result-date">{formatDate(result.created_at)}</span>
                      </div>
                      <div className="result-content">
                        <span className="constitution-badge">{constitutionInfo.name}</span>
                        <p className="constitution-desc">{constitutionInfo.description}</p>
                        <div className="pet-details">
                          {result.pet_age && <span>나이: {result.pet_age}개월</span>}
                          {result.pet_weight && <span>체중: {result.pet_weight}kg</span>}
                          {result.pet_symptoms && <span>증상: {result.pet_symptoms}</span>}
                        </div>
                      </div>
                      <div className="result-actions">
                        <button 
                          className="btn btn-secondary" 
                          onClick={() => onViewResult(result)}
                        >
                          자세히 보기
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'consultations' && (
          <div className="consultations-section">
            <h3>상담 문의 ({consultations.length}개)</h3>
            
            {consultations.length === 0 ? (
              <div className="no-consultations">
                <p>아직 상담 문의가 없습니다.</p>
                <p>상담이 필요하시면 결과 화면에서 "상담 예약" 버튼을 클릭해주세요.</p>
              </div>
            ) : (
              <div className="consultations-list">
                {consultations.map((consultation) => (
                  <div key={consultation.id} className="consultation-item">
                    <div className="consultation-header">
                      <h4>{consultation.name}</h4>
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(consultation.status) }}
                      >
                        {getStatusText(consultation.status)}
                      </span>
                    </div>
                    <div className="consultation-content">
                      <p><strong>전화번호:</strong> {consultation.phone}</p>
                      <p><strong>희망 날짜:</strong> {new Date(consultation.preferred_date).toLocaleDateString()}</p>
                      <p><strong>신청일:</strong> {formatDate(consultation.created_at)}</p>
                      <div className="consultation-details">
                        <p><strong>상담 내용:</strong></p>
                        <p>{consultation.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="button-group">
          <button className="btn btn-secondary" onClick={onStartNewDiagnosis}>
            새 진단 시작
          </button>
          <button className="btn btn-outline" onClick={onBack}>
            뒤로 가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyPage;