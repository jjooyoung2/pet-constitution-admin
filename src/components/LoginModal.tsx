import React, { useState } from 'react';

interface LoginModalProps {
  onLogin: (email: string, password: string) => void;
  onRegister: (email: string, password: string, name: string) => void;
  onCancel: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onLogin, onRegister, onCancel }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    if (!isLoginMode && !name.trim()) {
      alert('이름을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      if (isLoginMode) {
        await onLogin(email, password);
      } else {
        await onRegister(email, password, name);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setEmail('');
    setPassword('');
    setName('');
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>{isLoginMode ? '로그인' : '회원가입'}</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <p>
              {isLoginMode 
                ? '결과를 저장하고 다른 기기에서도 확인하려면 로그인이 필요합니다.'
                : '새 계정을 만들어 결과를 저장하고 관리하세요.'
              }
            </p>
            
            {!isLoginMode && (
              <div className="form-group">
                <label>이름 (선택사항)</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="이름을 입력하세요" 
                />
              </div>
            )}
            
            <div className="form-group">
              <label>이메일</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력하세요" 
                required
              />
            </div>
            <div className="form-group">
              <label>비밀번호</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요" 
                required
              />
            </div>
            
            <div className="mode-toggle">
              <button 
                type="button"
                className="toggle-btn"
                onClick={toggleMode}
                disabled={isLoading}
              >
                {isLoginMode ? '회원가입하기' : '로그인하기'}
              </button>
            </div>
          </div>
          <div className="modal-footer">
            <button 
              type="button"
              className="btn btn-secondary" 
              onClick={onCancel}
              disabled={isLoading}
            >
              게스트로 계속
            </button>
            <button 
              type="submit"
              className="btn btn-primary" 
              disabled={isLoading}
            >
              {isLoading 
                ? (isLoginMode ? '로그인 중...' : '회원가입 중...') 
                : (isLoginMode ? '로그인' : '회원가입')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;