import React, { useState } from 'react';

interface AdminLoginModalProps {
  onLogin: (email: string, password: string) => void;
  onCancel: () => void;
}

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onLogin, onCancel }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert('이메일과 비밀번호를 입력해주세요.');
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
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>🔐 관리자 로그인</h3>
          <p>관리자 권한이 필요합니다</p>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label>이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="관리자 이메일을 입력하세요"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label>비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              disabled={isLoading}
            />
          </div>

          <div className="privacy-notice">
            <strong>관리자 전용:</strong> 이 페이지는 관리자만 접근할 수 있습니다.
          </div>
        </form>

        <div className="modal-footer">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onCancel}
            disabled={isLoading}
          >
            취소
          </button>
          <button 
            type="submit" 
            className="btn btn-primary" 
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? '로그인 중...' : '관리자 로그인'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginModal;




