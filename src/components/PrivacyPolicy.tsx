import React from 'react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  // 구글 플레이 심사용: 직접 URL 접근 시 뒤로가기 버튼 숨김
  const isDirectAccess =
    typeof window !== 'undefined' &&
    (window.location.pathname === '/privacy' ||
     window.location.pathname === '/privacy.html');
  const showBackButton = !isDirectAccess;

  return (
    <div className="privacy-policy">
      <div className="card">
        <div className="header">
          <h2>개인정보처리방침</h2>
          <p>온솔 반려동물 체질 검사</p>
          <p style={{ fontSize: '0.9em', color: '#666', marginTop: '8px' }}>(운영: 온솔 양·한방 동물병원)</p>
        </div>

        <div className="privacy-content">
          <section style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <p>
              본 개인정보처리방침은 「온솔 반려동물 체질 검사」 앱(이하 "앱")에서 제공하는 서비스와 관련하여 적용됩니다.
            </p>
          </section>

          <section>
            <h3>1. 개인정보의 처리 목적</h3>
            <p>
              온솔 양·한방 동물병원(이하 "병원")은 다음의 목적을 위하여 개인정보를 처리합니다. 
              처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 
              이용 목적이 변경되는 경우에는 개인정보보호법 제18조에 따라 별도의 동의를 받는 등 
              필요한 조치를 이행할 예정입니다.
            </p>
            <ul>
              <li>반려동물 체질 진단 서비스 제공</li>
              <li>진단 결과 저장 및 관리</li>
              <li>회원 관리 및 본인 확인</li>
            </ul>
            <p style={{ marginTop: '10px', fontSize: '0.95em', color: '#333' }}>
              서비스 제공을 위해 사용자가 요청한 경우, 진단 결과 및 추천 식단 정보를 이메일로 발송할 수 있습니다.
            </p>
          </section>

          <section>
            <h3>2. 개인정보의 처리 및 보유기간</h3>
            <p>
              병원은 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 
              동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
            </p>
            <ul>
              <li><strong>회원 정보:</strong> 회원 탈퇴 시까지 (단, 사용자가 개인정보 삭제를 요청한 경우에는 해당 정보는 지체 없이 삭제되며, 관계 법령에 따라 보존이 필요한 경우에는 해당 법령에서 정한 기간 동안 보관됩니다.)</li>
              <li><strong>진단 결과:</strong> 회원 탈퇴 시까지 또는 사용자가 삭제 요청 시까지</li>
            </ul>
            <p style={{ marginTop: '10px', fontSize: '0.9em', color: '#666' }}>
              <strong>참고:</strong> 상담 예약은 네이버 예약 서비스를 통해 외부로 연결되며, 
              해당 서비스의 개인정보처리방침이 적용됩니다. 본 앱에서는 상담 예약 관련 개인정보를 수집하지 않습니다.
            </p>
          </section>

          <section>
            <h3>3. 처리하는 개인정보의 항목</h3>
            <p>병원은 다음의 개인정보 항목을 처리하고 있습니다:</p>
            <ul>
              <li>
                <strong>필수항목 (회원가입/로그인):</strong>
                <ul style={{ marginTop: '8px', marginLeft: '20px' }}>
                  <li>소셜 로그인: 이메일, 고유 사용자 ID (카카오/구글 계정 정보)</li>
                </ul>
              </li>
              <li>
                <strong>선택항목:</strong>
                <ul style={{ marginTop: '8px', marginLeft: '20px' }}>
                  <li>반려동물 정보: 이름, 나이, 체중, 증상, 반려동물 종류(강아지/고양이)</li>
                  <li>체질 진단 결과: 설문 답변, 진단된 체질 정보</li>
                </ul>
              </li>
              <li><strong>자동 수집 항목:</strong> IP 주소, 접속 로그, 기기 정보, 앱 버전 정보</li>
            </ul>
          </section>

          <section>
            <h3>4. 개인정보의 제3자 제공</h3>
            <p>
              병원은 원칙적으로 정보주체의 개인정보를 제3자에게 제공하지 않습니다. 
              다만, 다음의 경우에는 예외로 합니다:
            </p>
            <ul>
              <li>정보주체가 사전에 동의한 경우</li>
              <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
            </ul>
          </section>

          <section>
            <h3>4-1. 개인정보 처리 위탁 및 제3자 서비스 이용</h3>
            <p>
              병원은 서비스 제공을 위해 다음과 같은 외부 서비스를 이용하고 있습니다.
            </p>
            <ul>
              <li>
                <strong>Supabase:</strong> 사용자 인증 및 데이터베이스 관리
              </li>
              <li>
                <strong>카카오 로그인:</strong> 소셜 로그인 인증
              </li>
              <li>
                <strong>구글 로그인:</strong> 소셜 로그인 인증
              </li>
            </ul>
            <p>
              위 서비스는 해당 서비스 제공자의 개인정보처리방침에 따라 개인정보를 처리합니다.
            </p>
          </section>

          <section>
            <h3>5. 정보주체의 권리·의무 및 그 행사방법</h3>
            <p>
              정보주체는 병원에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다:
            </p>
            <ul>
              <li>개인정보 열람요구권</li>
              <li>개인정보 정정·삭제요구권</li>
              <li>개인정보 처리정지 요구권</li>
            </ul>
            <p>
              권리 행사는 병원에 대해 서면, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며, 
              병원은 이에 대해 지체 없이 조치하겠습니다.
            </p>
            <p style={{ fontSize: '0.9em', color: '#666', marginTop: '8px' }}>
              계정 삭제는 앱 내 설정 메뉴 또는 개인정보 보호책임자 이메일을 통해 요청할 수 있습니다.
            </p>
          </section>

          <section>
            <h3>6. 개인정보의 파기</h3>
            <p>
              병원은 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 
              지체없이 해당 개인정보를 파기합니다. 파기의 절차 및 방법은 다음과 같습니다:
            </p>
            <ul>
                <li>
                    <strong>파기절차:</strong> 이용자가 회원 탈퇴를 요청하는 경우,
                    해당 계정 및 관련 개인정보는 Supabase 데이터베이스에서
                    지체 없이 삭제됩니다. 단, 관계 법령에 따라 보존이 필요한 경우에는
                    해당 법령에서 정한 기간 동안 별도로 보관될 수 있습니다.
                </li>
                <li>
                    <strong>파기방법:</strong> 전자적 파일 형태의 개인정보는
                    복구 및 재생이 불가능한 방식으로 안전하게 삭제됩니다.
                </li>
            </ul>
          </section>

          <section>
            <h3>7. 개인정보 보호책임자</h3>
            <p>
              병원은 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 
              불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
            </p>
            <ul>
                <li>
                    <strong>개인정보 보호책임자:</strong> 온솔 양·한방 동물병원
                    (개발 및 운영 담당자)
                </li>
                <li><strong>이메일:</strong> qlwmz@naver.com</li>
                <li><strong>연락처:</strong> 010-8230-1246</li>
            </ul>
            <p style={{ marginTop: '10px', fontSize: '0.9em', color: '#666' }}>
              개인정보 보호 관련 문의사항이 있으시면 위 연락처로 문의해주시기 바랍니다.
            </p>
          </section>

          <section>
            <h3>8. 개인정보의 안전성 확보 조치</h3>
            <p>
              병원은 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:
            </p>
            <ul>
                <li>
                    <strong>관리적 조치:</strong> 개인정보 접근 권한을 최소한의 담당자로
                    제한하고, 개인정보 처리에 대한 내부 관리 기준을 마련하여 운영하고 있습니다.
                </li>
                <li>
                    <strong>기술적 조치:</strong> Supabase 등 외부 서비스의 보안 기능을 활용하여
                    개인정보에 대한 접근 제어 및 암호화를 적용하고 있습니다.
                </li>
                <li>
                    <strong>물리적 조치:</strong> 개인정보가 저장된 시스템은 클라우드 환경에서
                    관리되며, 관리자 계정에 대한 접근을 제한하고 있습니다.
                </li>
            </ul>
          </section>

          <section>
            <h3>9. 개인정보처리방침 변경</h3>
            <p>
              이 개인정보처리방침은 2025년 12월 1일부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 
              삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
            </p>
          </section>

          <section>
            <h3>10. 앱 내 저장소 및 기기 정보의 활용</h3>
            <p>
              본 앱은 쿠키를 사용하지 않으며, 서비스 제공을 위해 앱 내 저장소(AsyncStorage)를 활용합니다. 
              앱 내 저장소는 사용자의 로그인 토큰 등 서비스 이용에 필요한 최소한의 정보를 저장하는 데 사용되며, 
              사용자가 앱 내 설정 메뉴를 통해 삭제하거나 앱 삭제 시 함께 삭제됩니다.
            </p>
            <p style={{ fontSize: '0.9em', color: '#666', marginTop: '8px' }}>
                또한 서비스 제공 및 보안을 위해 기기 모델, 운영체제 버전, 앱 버전 등의 비식별화된 기기 정보를 수집할 수 있습니다.
            </p>
          </section>
        </div>

        {/* 구글 플레이 심사용: 직접 URL 접근 시 뒤로가기 버튼 숨김 */}
        {showBackButton && (
          <div className="button-group" style={{ marginTop: '30px' }}>
            <button className="btn btn-primary" onClick={onBack}>
              돌아가기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrivacyPolicy;
