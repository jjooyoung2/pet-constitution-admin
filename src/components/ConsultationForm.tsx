import React, { useState } from 'react';

interface ConsultationFormProps {
  onCancel: () => void;
  onSuccess: () => void;
  isLoggedIn: boolean;
  token: string | null;
  onShowLogin: () => void;
}

const ConsultationForm: React.FC<ConsultationFormProps> = ({
  onCancel,
  onSuccess,
  isLoggedIn,
  token,
  onShowLogin
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert('상담 예약을 하려면 로그인이 필요합니다.');
      onShowLogin();
      return;
    }

    if (!name.trim() || !phone.trim() || !preferredDate || !content.trim()) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('https://pet-constitution-backend-production.up.railway.app/api/consultations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          preferred_date: preferredDate,
          content: content.trim()
        })
      });

      const result = await response.json();

      if (result.success) {
        alert('상담 예약이 완료되었습니다!');
        onSuccess();
      } else {
        alert(`상담 예약 실패: ${result.message || '알 수 없는 오류가 발생했습니다.'}`);
      }
    } catch (error) {
      alert('상담 예약 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="consultation-form">
      <div className="card">
        <div className="header">
          <h2>📅 상담 예약</h2>
          <p>온솔 양·한방 동물병원 상담 예약</p>
        </div>

        {!isLoggedIn && (
          <div className="login-prompt">
            <p>상담 예약을 하려면 로그인이 필요합니다.</p>
            <button className="btn btn-primary" onClick={onShowLogin}>
              로그인하기
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="name">이름 *</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
              disabled={!isLoggedIn || isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">전화번호 *</label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="010-1234-5678"
              disabled={!isLoggedIn || isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="preferredDate">희망 상담일 *</label>
            <input
              id="preferredDate"
              type="date"
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              disabled={!isLoggedIn || isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">상담 내용 *</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="상담하고 싶은 내용을 입력하세요"
              rows={5}
              disabled={!isLoggedIn || isLoading}
              required
            />
          </div>

          <div className="button-group">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              취소
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!isLoggedIn || isLoading}
            >
              {isLoading ? '예약 중...' : '예약하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConsultationForm;