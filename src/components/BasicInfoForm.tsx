import React from 'react';
import { PetInfo } from '../types';

interface BasicInfoFormProps {
  petInfo: PetInfo;
  onPetInfoChange: (petInfo: PetInfo) => void;
  onBack: () => void;
  onSubmit: () => void;
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({ 
  petInfo, 
  onPetInfoChange, 
  onBack, 
  onSubmit 
}) => {
  const handleInputChange = (field: keyof PetInfo, value: string) => {
    onPetInfoChange({ ...petInfo, [field]: value });
  };

  return (
    <div className="basic-info">
      <div className="card">
        <div className="header">
          <h2>기본 정보 입력</h2>
          <p>아이를 더 잘 이해할수록 결과 정확도가 높아져요. 이름만 입력해도 괜찮아요.</p>
        </div>
        
        <div className="form-group">
          <label htmlFor="pet-name">반려동물 이름 *</label>
          <input 
            type="text" 
            id="pet-name" 
            value={petInfo.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="예: 멍멍이"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="pet-age">나이 (개월)</label>
          <input 
            type="number" 
            id="pet-age" 
            value={petInfo.age}
            onChange={(e) => handleInputChange('age', e.target.value)}
            placeholder="예: 24"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="pet-weight">체중 (kg)</label>
          <input 
            type="number" 
            id="pet-weight" 
            step="0.1"
            value={petInfo.weight}
            onChange={(e) => handleInputChange('weight', e.target.value)}
            placeholder="예: 5.2"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="pet-symptoms">주요 증상 (선택사항)</label>
          <textarea 
            id="pet-symptoms" 
            rows={3}
            value={petInfo.symptoms}
            onChange={(e) => handleInputChange('symptoms', e.target.value)}
            placeholder="예: 가끔 설사, 식욕부진 등"
          />
        </div>
        
        <div className="disclaimer">
          <strong>안내:</strong> 정확한 진단은 내원 검사(X-ray/혈액/초음파) 후 확정됩니다. 이 검사는 참고용입니다.
        </div>
        
        <div className="button-group">
          <button className="btn btn-secondary" onClick={onBack}>이전</button>
          <button className="btn btn-primary" onClick={onSubmit}>설문 시작</button>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoForm;

