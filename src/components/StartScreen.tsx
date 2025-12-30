import React from 'react';
import { User } from '../types';

interface StartScreenProps {
  onStartAsGuest: () => void;
  onStartSurvey: () => void;
  onShowLogin: () => void;
  onGoToMyPage: () => void;
  onGoToAdmin: () => void;
  onGoToPrivacy: () => void;
  isLoggedIn: boolean;
  user: User | null;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStartAsGuest, onStartSurvey, onShowLogin, onGoToMyPage, onGoToAdmin, onGoToPrivacy, isLoggedIn, user }) => {
  return (
    <div className="start-screen">
      <div className="card">
        <div className="header">
          <h1>🐾 반려동물 체질 진단</h1>
          <p>온솔 양·한방 동물병원에 오신 걸 환영합니다. 3분이면 끝나요!</p>
          {isLoggedIn && user && (
            <div className="user-welcome">
              <p>안녕하세요, {user.name || user.email}님! 👋</p>
            </div>
          )}
        </div>
        
        <div className="welcome-text">
          <p><strong>반려동물의 체질 경향을 10문항으로 확인하고, 맞는 음식과 계절 관리 팁을 받아보세요.</strong></p>
        </div>
        
        <div className="privacy-notice">
          <strong>개인정보 수집 안내:</strong> 결과 저장과 상담 연결을 위해 최소 정보만 보관됩니다. 언제든 삭제 가능합니다.
          <br />
          <a href="#" onClick={(e) => { e.preventDefault(); onGoToPrivacy(); }} style={{ color: '#667eea', textDecoration: 'underline', marginTop: '8px', display: 'inline-block' }}>
            개인정보처리방침 보기
          </a>
        </div>
        
                    <div className="button-group">
                      {isLoggedIn ? (
                        <>
                          <button className="btn btn-primary" onClick={onStartSurvey}>설문시작</button>
                          <button className="btn btn-secondary" onClick={onGoToMyPage}>마이페이지</button>
                          <button className="btn btn-outline" onClick={onShowLogin}>로그아웃</button>
                        </>
                      ) : (
                        <>
                          <button className="btn btn-primary" onClick={onStartAsGuest}>게스트로 시작</button>
                          <button className="btn btn-secondary" onClick={onShowLogin}>로그인</button>
                        </>
                      )}
                    </div>
      </div>
    </div>
  );
};

export default StartScreen;