import React, { useState } from 'react';
import { consultationAPI } from '../services/api';

interface ConsultationFormProps {
  onCancel: () => void;
  onSuccess: () => void;
  isLoggedIn?: boolean;
  token?: string | null;
  onShowLogin?: () => void;
}

interface ConsultationData {
  name: string;
  phone: string;
  preferredDate: string;
  content: string;
}

const ConsultationForm: React.FC<ConsultationFormProps> = ({ 
  onCancel, 
  onSuccess, 
  isLoggedIn = false, 
  token = null, 
  onShowLogin 
}) => {
  const [formData, setFormData] = useState<ConsultationData>({
    name: '',
    phone: '',
    preferredDate: '',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 입력값 검증
    if (!formData.name.trim()) {
      alert('이름을 입력해주세요.');
      return;
    }
    if (!formData.phone.trim()) {
      alert('전화번호를 입력해주세요.');
      return;
    }
    if (!formData.preferredDate) {
      alert('희망 날짜를 선택해주세요.');
      return;
    }
    if (!formData.content.trim()) {
      alert('상담 내용을 입력해주세요.');
      return;
    }

    // 전화번호 형식 검증
    const phoneRegex = /^[0-9-+\s()]+$/;
    if (!phoneRegex.test(formData.phone)) {
      alert('올바른 전화번호 형식을 입력해주세요.');
      return;
    }

    // 이미 로그인된 사용자만 이 폼에 접근 가능

    setIsSubmitting(true);

    try {
      const response = await consultationAPI.createConsultation(formData, token);

      if (response.success) {
        alert('상담 예약이 완료되었습니다!\n빠른 시일 내에 연락드리겠습니다.');
        onSuccess();
      } else {
        alert(`예약 실패: ${response.message}`);
      }
    } catch (error) {
      console.error('Consultation booking error:', error);
      alert('예약 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 오늘 날짜를 최소값으로 설정
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="consultation-form">
      <div className="card">
        <div className="header">
          <h2>🏥 상담 예약</h2>
          <p>온솔 양·한방 동물병원 상담 예약을 신청해주세요.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">이름 *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="이름을 입력하세요"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">전화번호 *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="010-1234-5678"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="preferredDate">희망 날짜 *</label>
            <input
              type="date"
              id="preferredDate"
              name="preferredDate"
              value={formData.preferredDate}
              onChange={handleInputChange}
              min={today}
              required
            />
            <small>오늘 이후 날짜를 선택해주세요.</small>
          </div>

          <div className="form-group">
            <label htmlFor="content">상담 내용 *</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="반려동물의 증상, 궁금한 점, 상담받고 싶은 내용을 자세히 적어주세요."
              rows={5}
              required
            />
          </div>

          <div className="form-group">
            <div className="privacy-notice">
              <strong>개인정보 수집 및 이용 동의</strong>
              <p>상담 예약을 위해 입력하신 개인정보는 상담 목적으로만 사용되며, 상담 완료 후 즉시 삭제됩니다.</p>
            </div>
          </div>

          <div className="button-group">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              취소
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? '예약 중...' : '예약 신청'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConsultationForm;
