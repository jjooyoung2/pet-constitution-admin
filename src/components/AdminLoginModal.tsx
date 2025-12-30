import React, { useState } from 'react';

interface AdminLoginModalProps {
  onLogin: (email: string, password: string) => void;
  onCancel: () => void;
}

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onLogin, onCancel }) => {
  const [email, setEmail] = useState('admin@onsol.com');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    // admin@onsol.com만 허용
    if (email !== 'admin@onsol.com') {
      alert('관리자 계정만 로그인할 수 있습니다.');
      return;
    }

    setIsLoading(true);
    try {
      await onLogin(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app" style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: '#f5f1e8'
    }}>
      <div className="card" style={{ 
        maxWidth: '400px', 
        width: '100%', 
        margin: '20px',
        background: '#faf8f3',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e8e3d8',
        overflow: 'hidden'
      }}>
        <div className="header" style={{
          background: '#4a7c59',
          color: 'white',
          padding: '40px 30px',
          textAlign: 'center'
        }}>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '28px', fontWeight: '700' }}>🔐 관리자 로그인</h2>
          <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>관리자 권한이 필요합니다</p>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '30px' }}>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: '#4a7c59',
              fontSize: '14px'
            }}>이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                // admin@onsol.com만 입력 가능
                if (e.target.value === 'admin@onsol.com' || e.target.value.startsWith('admin@onsol.co')) {
                  setEmail(e.target.value);
                }
              }}
              placeholder="admin@onsol.com"
              disabled={isLoading}
              readOnly
              style={{ 
                width: '100%', 
                padding: '12px', 
                fontSize: '16px', 
                border: '1px solid #e8e3d8', 
                borderRadius: '8px',
                backgroundColor: '#f5f1e8',
                color: '#3a3a3a',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: '#4a7c59',
              fontSize: '14px'
            }}>비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              disabled={isLoading}
              style={{ 
                width: '100%', 
                padding: '12px', 
                fontSize: '16px', 
                border: '1px solid #e8e3d8', 
                borderRadius: '8px',
                backgroundColor: 'white',
                color: '#3a3a3a',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ 
            marginBottom: '20px', 
            padding: '12px', 
            backgroundColor: '#f5f1e8', 
            borderRadius: '8px', 
            fontSize: '14px',
            color: '#4a7c59',
            border: '1px solid #e8e3d8'
          }}>
            <strong>관리자 전용:</strong> 이 페이지는 관리자만 접근할 수 있습니다.
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="submit" 
              className="btn btn-primary" 
              onClick={handleSubmit}
              disabled={isLoading}
              style={{ 
                flex: 1,
                background: '#4a7c59',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                opacity: isLoading ? 0.6 : 1
              }}
              onMouseOver={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.background = '#3a6349';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#4a7c59';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {isLoading ? '로그인 중...' : '관리자 로그인'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginModal;



