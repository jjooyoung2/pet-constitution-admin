import React from 'react';

interface SupportProps {
  onBack: () => void;
}

const Support: React.FC<SupportProps> = ({ onBack }) => {
  // 직접 URL 접근 시 뒤로가기 버튼 숨김
  const isDirectAccess =
    typeof window !== 'undefined' &&
    window.location.pathname === '/support';
  const showBackButton = !isDirectAccess;

  return (
    <div className="privacy-policy">
      <div className="card">
        <div className="header">
          <h2>앱 지원 안내</h2>
          <p>온솔 반려동물 체질 검사</p>
        </div>

        <div className="privacy-content">
          <section style={{ marginBottom: '20px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <div style={{ fontSize: '1.1em', lineHeight: '1.8' }}>
              <p style={{ marginBottom: '15px' }}>
                <strong>문의:</strong>{' '}
                <a 
                  href="mailto:info@onsolvet.kr" 
                  style={{ color: '#4a90e2', textDecoration: 'none' }}
                >
                  info@onsolvet.kr
                </a>
              </p>
              <p>
                <strong>운영시간:</strong> 평일 10:00–18:00
              </p>
            </div>
          </section>

          {showBackButton && (
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <button
                onClick={onBack}
                style={{
                  padding: '12px 30px',
                  fontSize: '16px',
                  backgroundColor: '#4a90e2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                돌아가기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Support;




