import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { resultsAPI } from '../services/api';

interface MyPageProps {
  user: User;
  token: string;
  onBack: () => void;
  onViewResult: (result: any) => void;
  onStartNewDiagnosis: () => void;
}

const MyPage: React.FC<MyPageProps> = ({
  user,
  token,
  onBack,
  onViewResult,
  onStartNewDiagnosis
}) => {
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await resultsAPI.getUserResults(token);
      
      if (response.success && response.data) {
        setResults(response.data.results || response.data || []);
      } else {
        setError(response.error || '결과를 불러올 수 없습니다.');
      }
    } catch (err) {
      setError('결과를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mypage">
      <div className="card">
        <div className="header">
          <h2>마이페이지</h2>
          <p>안녕하세요, {user.name || user.email}님!</p>
        </div>

        <div className="user-info">
          <div className="info-item">
            <strong>이메일:</strong> {user.email}
          </div>
          {user.name && (
            <div className="info-item">
              <strong>이름:</strong> {user.name}
            </div>
          )}
        </div>

        <div className="button-group" style={{ marginBottom: '20px' }}>
          <button className="btn btn-primary" onClick={onStartNewDiagnosis}>
            새 진단 시작하기
          </button>
          <button className="btn btn-outline" onClick={onBack}>
            돌아가기
          </button>
        </div>

        <div className="results-section">
          <h3>저장된 진단 결과</h3>
          
          {isLoading ? (
            <div className="loading">로딩 중...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : results.length === 0 ? (
            <div className="empty-state">
              <p>저장된 진단 결과가 없습니다.</p>
              <p>새 진단을 시작해보세요!</p>
            </div>
          ) : (
            <div className="results-list">
              {results.map((result, index) => (
                <div
                  key={result.id || index}
                  className="result-item"
                  onClick={() => onViewResult(result)}
                >
                  <div className="result-header">
                    <h4>{result.pet_name || result.petInfo?.name || '반려동물'}</h4>
                    <span className="constitution-badge">{result.constitution || '체질 정보 없음'}</span>
                  </div>
                  {result.created_at && (
                    <div className="result-date">
                      {new Date(result.created_at).toLocaleDateString('ko-KR')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPage;