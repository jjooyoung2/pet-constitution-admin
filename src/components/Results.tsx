import React, { useState } from 'react';
import { ConstitutionData } from '../types';

interface ResultsProps {
  constitution: string;
  constitutionData: ConstitutionData;
  onSave: () => void;
  onExport: () => void;
  onBookConsultation: () => void;
  isFromMyPage?: boolean;
  onBackToMyPage?: () => void;
  petName?: string;
  userEmail?: string;
}

const Results: React.FC<ResultsProps> = ({
  constitution,
  constitutionData,
  onSave,
  onExport,
  onBookConsultation,
  isFromMyPage = false,
  onBackToMyPage,
  petName = '반려동물',
  userEmail
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState(userEmail || '');
  const [petNameInput, setPetNameInput] = useState(petName);

  const handleSendMealPlan = async () => {
    if (!email.trim()) {
      alert('이메일을 입력해주세요.');
      return;
    }
    
    if (!petNameInput.trim()) {
      alert('반려동물 이름을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('https://pet-constitution-backend.onrender.com/api/email/send-meal-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          constitution: constitution,
          petName: petNameInput.trim()
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        alert('7일 식단 샘플이 이메일로 발송되었습니다!');
        setShowEmailModal(false);
      } else {
        alert(`이메일 발송 실패: ${result.message}`);
      }
    } catch (error) {
      alert('이메일 발송 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="results">
      <div className="card">
        <div className="result-card">
          <div className="constitution-type">체질: {constitutionData.name}</div>
          <div className="constitution-description">{constitutionData.description}</div>
        </div>
        
        <div className="food-category">
          <h3>🥩 추천 고기</h3>
          <div className="food-item">{constitutionData.foods.meat}</div>
        </div>
        
        <div className="food-category">
          <h3>🌾 추천 곡물</h3>
          <div className="food-item">{constitutionData.foods.grain}</div>
        </div>
        
        <div className="food-category">
          <h3>🥬 추천 채소</h3>
          <div className="food-item">{constitutionData.foods.vegetable}</div>
        </div>
        
        <div className="food-category">
          <h3>🍎 추천 과일</h3>
          <div className="food-item">{constitutionData.foods.fruit}</div>
        </div>
        
        <div className="warning-card">
          <h3>⚠️ 피해야 할 음식</h3>
          <p>{constitutionData.avoid}</p>
        </div>
        
        <div className="season-card">
          <h3>🌤️ 계절 관리</h3>
          <p>{constitutionData.season}</p>
        </div>
        
        <div className="food-category">
          <h3>💡 관리 팁</h3>
          <p>{constitutionData.tips}</p>
        </div>
        
        <div className="disclaimer">
          <strong>주의사항:</strong> 본 결과는 교육·상담 보조용입니다. 급성 폐색·감염 등 응급 상황은 즉시 서양의학 응급 처치 후, 필요 시 한방 치료를 병행하세요. 한약·치료는 반드시 수의사 상담 후 진행하세요.
        </div>
        
        <div className="button-group">
          {isFromMyPage ? (
            <>
              <button className="btn btn-secondary" onClick={onBackToMyPage}>마이페이지로 돌아가기</button>
              <button className="btn btn-primary" onClick={onExport}>PNG 내보내기</button>
              <button className="btn btn-outline" onClick={() => setShowEmailModal(true)}>체질별 7일 식단 샘플받기</button>
              <button className="btn btn-primary" onClick={onBookConsultation}>상담 예약</button>
            </>
          ) : (
            <>
              <button className="btn btn-primary" onClick={onSave}>결과 저장</button>
              <button className="btn btn-secondary" onClick={onExport}>PNG 내보내기</button>
              <button className="btn btn-outline" onClick={() => setShowEmailModal(true)}>체질별 7일 식단 샘플받기</button>
              <button className="btn btn-primary" onClick={onBookConsultation}>상담 예약</button>
            </>
          )}
        </div>

        {/* 이메일 입력 모달 */}
        {showEmailModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>🍽️ 체질별 7일 식단 샘플 받기</h3>
                <p>{constitutionData.name} 체질에 맞는 맞춤 식단을 이메일로 받아보세요!</p>
              </div>
              
              <div className="modal-body">
                <div className="form-group">
                  <label>이메일 주소</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="이메일을 입력하세요"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="form-group">
                  <label>반려동물 이름</label>
                  <input
                    type="text"
                    value={petNameInput}
                    onChange={(e) => setPetNameInput(e.target.value)}
                    placeholder="반려동물 이름을 입력하세요"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="privacy-notice">
                  <strong>📧 이메일 내용:</strong>
                  <ul>
                    <li>7일간의 체질별 맞춤 식단 계획</li>
                    <li>아침, 점심, 저녁, 간식 메뉴</li>
                    <li>체질별 식단 관리 팁</li>
                  </ul>
                </div>
              </div>
              
              <div className="modal-footer">
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setShowEmailModal(false)}
                  disabled={isLoading}
                >
                  취소
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={handleSendMealPlan}
                  disabled={isLoading}
                >
                  {isLoading ? '발송 중...' : '식단 샘플 받기'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;
