import React, { useState, useEffect } from 'react';
import './App.css';

// 컴포넌트 import
import StartScreen from './components/StartScreen';
import BasicInfoForm from './components/BasicInfoForm';
import Survey from './components/Survey';
import Results from './components/Results';
import LoginModal from './components/LoginModal';
import AdminLoginModal from './components/AdminLoginModal';
import MyPage from './components/MyPage';
import ConsultationForm from './components/ConsultationForm';
import AdminPage from './components/AdminPage';

// 타입 및 데이터 import
import { PetInfo, Step, User } from './types';
import { questions } from './data/questions';
import { constitutionData } from './data/constitutionData';

// API import
import { authAPI, resultsAPI } from './services/api';

function App() {
  const [currentStep, setCurrentStep] = useState<Step>('start');
  const [petInfo, setPetInfo] = useState<PetInfo>({ name: '', age: '', weight: '', symptoms: '' });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [loginForConsultation, setLoginForConsultation] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [selectedResult, setSelectedResult] = useState<any>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  // PWA 설치 프롬프트
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  // 앱 시작 시 로그인 상태 확인
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      // 토큰이 있으면 사용자 정보 확인
      authAPI.getMe(savedToken)
        .then(response => {
          if (response.success && response.data) {
        setUser({
          ...response.data.user,
          is_admin: (response.data.user as any).is_admin || false
        });
            setIsLoggedIn(true);
            setToken(savedToken);
          }
        })
        .catch(() => {
          // 토큰이 유효하지 않으면 제거
          localStorage.removeItem('token');
        });
    }
  }, []);

  const startAsGuest = () => {
    setCurrentStep('basic-info');
  };

  const startSurvey = () => {
    setCurrentStep('basic-info');
  };

  const showLogin = () => {
    setShowLoginPrompt(true);
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      
      if (response.success && response.data) {
        const { token: newToken, user: userData } = response.data;
        
        // 토큰과 사용자 정보 저장
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser({
          ...userData,
          is_admin: (userData as any).is_admin || false
        });
        setIsLoggedIn(true);
        setShowLoginPrompt(false);
        
        // 게스트로 완료한 설문이 있으면 자동 저장하고 결과 화면으로 이동
        const tempResult = localStorage.getItem('temp-guest-result');
        console.log('=== LOGIN DEBUG ===');
        console.log('tempResult:', tempResult);
        console.log('answers:', answers);
        console.log('answers.length:', answers ? answers.length : 'answers is null');
        console.log('==================');
        
        if (tempResult) {
          try {
            const resultData = JSON.parse(tempResult);
            console.log('Parsed resultData:', resultData);
            
            // 임시 저장된 데이터가 유효한지 확인
            if (resultData.answers && resultData.answers.length > 0) {
              console.log('Valid temp result found, saving to server...');
              const saveResponse = await resultsAPI.saveResult(resultData, newToken);
              if (saveResponse.success) {
                alert('로그인 완료! 게스트로 완료한 설문 결과가 자동으로 저장되었습니다.');
                localStorage.removeItem('temp-guest-result'); // 임시 데이터 삭제
                
                // 임시 저장된 데이터로 상태 복원
                setPetInfo(resultData.petInfo);
                setAnswers(resultData.answers);
                setCurrentStep('results'); // 결과 화면으로 바로 이동
                return;
              }
            } else {
              console.log('Invalid temp result:', resultData);
            }
          } catch (saveError) {
            console.error('Auto-save error:', saveError);
            alert('로그인은 완료되었지만, 설문 결과 저장에 실패했습니다.');
            // 저장 실패해도 결과 화면으로 이동
            setCurrentStep('results');
            return;
          }
        } else {
          console.log('No temp result found');
        }
        
        // 임시 저장된 데이터는 없지만 현재 설문이 완료된 상태라면 결과 화면으로 이동
        if (answers && answers.length > 0) {
          console.log('Current survey completed, going to results...');
          setCurrentStep('results');
          return;
        }
        
        // 로그인 성공 후 처리
        if (loginForConsultation) {
          // 상담 예약을 위해 로그인한 경우: 상담 예약 폼으로 이동
          setCurrentStep('consultation');
          setLoginForConsultation(false);
          alert('로그인되었습니다! 상담 예약을 진행해주세요.');
        } else {
          // 일반 로그인: 홈 화면으로 이동
          setCurrentStep('start');
          alert('로그인되었습니다!');
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      alert(`로그인 실패: ${errorMessage}`);
    }
  };

  const handleRegister = async (email: string, password: string, name: string) => {
    try {
      const response = await authAPI.register({ email, password, name });
      
      if (response.success && response.data) {
        const { token: newToken, user: userData } = response.data;
        
        // 토큰과 사용자 정보 저장
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser({
          ...userData,
          is_admin: (userData as any).is_admin || false
        });
        setIsLoggedIn(true);
        setShowLoginPrompt(false);
        
        // 회원가입 성공 후 처리
        if (loginForConsultation) {
          // 상담 예약을 위해 회원가입한 경우: 상담 예약 폼으로 이동
          setCurrentStep('consultation');
          setLoginForConsultation(false);
          alert('회원가입이 완료되었습니다! 상담 예약을 진행해주세요.');
        } else {
          // 일반 회원가입: 홈 화면으로 이동
          setCurrentStep('start');
          alert('회원가입이 완료되었습니다!');
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      alert(`회원가입 실패: ${errorMessage}`);
    }
  };

  const handleLoginCancel = () => {
    setShowLoginPrompt(false);
    setLoginForConsultation(false);
    startAsGuest();
  };

  const handleBasicInfoSubmit = () => {
    if (!petInfo.name.trim()) {
      alert('반려동물 이름을 입력해주세요.');
      return;
    }
    setCurrentStep('survey');
  };

  const handleAnswerSelect = (optionIndex: number) => {
    setSelectedAnswer(optionIndex);
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = questions[currentQuestionIndex].options[optionIndex].type;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      calculateResults();
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(null);
    }
  };

  const calculateResults = () => {
    const scores: Record<string, number> = { "목": 0, "화": 0, "토": 0, "금": 0, "수": 0 };
    answers.forEach(answer => {
      if (scores[answer] !== undefined) {
        scores[answer]++;
      }
    });
    
    const maxScore = Math.max(...Object.values(scores));
    const constitution = Object.keys(scores).find(key => scores[key] === maxScore) || "목";
    
    setCurrentStep('results');
  };

  const saveResult = async () => {
    if (!isLoggedIn) {
      const shouldLogin = window.confirm(
        '결과를 저장하려면 로그인이 필요합니다.\n\n' +
        '로그인하시겠습니까?\n' +
        '• 예: 로그인 페이지로 이동\n' +
        '• 아니오: 임시로 브라우저에만 저장'
      );

      if (shouldLogin) {
        setShowLoginPrompt(true);
        return; // 로그인 후 저장하도록 return
      }
    }

    try {
      const constitution = getCurrentConstitution();

      // 디버깅을 위한 로그
      console.log('=== DEBUG INFO ===');
      console.log('petInfo:', petInfo);
      console.log('answers:', answers);
      console.log('answers.length:', answers ? answers.length : 'answers is null/undefined');
      console.log('constitution:', constitution);
      console.log('currentStep:', currentStep);
      console.log('currentQuestionIndex:', currentQuestionIndex);
      console.log('==================');

      // answers가 비어있는 경우 체크
      if (!answers || answers.length === 0) {
        alert('설문을 완료해주세요.');
        return;
      }

      // petInfo가 null이거나 비어있는 경우 기본값 설정
      const safePetInfo = {
        name: (petInfo && petInfo.name) || '이름 없음',
        age: (petInfo && petInfo.age) || '',
        weight: (petInfo && petInfo.weight) || '',
        symptoms: (petInfo && petInfo.symptoms) || ''
      };

      const resultData = {
        petInfo: safePetInfo,
        answers: answers,
        constitution: constitution
      };

      console.log('=== FINAL RESULT DATA ===');
      console.log('resultData:', resultData);
      console.log('isLoggedIn:', isLoggedIn);
      console.log('token:', token);
      console.log('========================');

      if (isLoggedIn && token) {
        // 로그인 사용자: 서버에 저장
        const response = await resultsAPI.saveResult(resultData, token);
        if (response.success) {
          alert('결과가 서버에 저장되었습니다!');
        }
      } else {
        // 게스트 사용자: 임시 저장 (로그인 시 자동 저장용)
        const tempResult = {
          ...resultData,
          timestamp: new Date().toISOString(),
          isLoggedIn: false
        };
        localStorage.setItem('temp-guest-result', JSON.stringify(tempResult));
        alert('결과가 임시 저장되었습니다.\n로그인하시면 자동으로 서버에 저장됩니다!');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      console.error('Save result error:', error);
      alert(`저장 실패: ${errorMessage}`);
    }
  };

  const exportResult = () => {
    try {
      // 결과 화면의 DOM 요소 찾기
      const resultsElement = document.querySelector('.results .card');
      if (!resultsElement) {
        alert('결과 화면을 찾을 수 없습니다.');
        return;
      }

      // html2canvas 라이브러리 사용 (CDN에서 로드)
      if (typeof window !== 'undefined' && (window as any).html2canvas) {
        (window as any).html2canvas(resultsElement as HTMLElement, {
          backgroundColor: '#ffffff',
          scale: 2, // 고해상도
          useCORS: true,
          allowTaint: true
        }).then((canvas: HTMLCanvasElement) => {
          // Canvas를 Blob으로 변환
          canvas.toBlob((blob) => {
            if (blob) {
              // 다운로드 링크 생성
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `반려동물_체질진단_결과_${new Date().toISOString().split('T')[0]}.png`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
              
              alert('PNG 파일이 다운로드되었습니다!');
            } else {
              alert('PNG 생성에 실패했습니다.');
            }
          }, 'image/png');
        }).catch((error: any) => {
          console.error('Canvas generation error:', error);
          alert('PNG 생성 중 오류가 발생했습니다.');
        });
      } else {
        // html2canvas가 로드되지 않은 경우 대체 방법
        alert('PNG 내보내기 기능을 사용하려면 페이지를 새로고침해주세요.');
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('PNG 내보내기 중 오류가 발생했습니다.');
    }
  };

  const bookConsultation = () => {
    if (!isLoggedIn) {
      // 게스트 사용자: 로그인 모달 표시 (상담예약을 위해)
      setLoginForConsultation(true);
      setShowLoginPrompt(true);
    } else {
      // 로그인 사용자: 상담 예약 폼으로 이동
      setCurrentStep('consultation');
    }
  };

  const handleConsultationSuccess = () => {
    setCurrentStep('results');
  };

  const handleConsultationCancel = () => {
    setCurrentStep('results');
  };

  const goToAdmin = () => {
    setCurrentStep('admin');
  };

  const handleAdminLogin = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      
      if (response.success && response.data) {
        const { token: newToken, user: userData } = response.data;
        
        // 관리자 권한 확인
        if (!(userData as any).is_admin) {
          alert('관리자 권한이 필요합니다.');
          return;
        }
        
        // 토큰과 사용자 정보 저장
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser({
          ...userData,
          is_admin: (userData as any).is_admin || false
        });
        setIsLoggedIn(true);
        setShowAdminLogin(false);
        
        // 관리자 페이지로 이동
        setCurrentStep('admin');
        alert('관리자로 로그인되었습니다.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      alert(`로그인 실패: ${errorMessage}`);
    }
  };

  const handleAdminLoginCancel = () => {
    setShowAdminLogin(false);
  };

  const goToMyPage = () => {
    setCurrentStep('mypage');
  };

  const viewResult = (result: any) => {
    setSelectedResult(result);
    setCurrentStep('results');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
    setCurrentStep('start');
  };

  const startNewDiagnosis = () => {
    // 설문 관련 state 초기화
    setPetInfo({ name: '', age: '', weight: '', symptoms: '' });
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setSelectedResult(null);
    
    // 임시 저장된 게스트 결과도 삭제
    localStorage.removeItem('temp-guest-result');
    
    // 기본 정보 입력 화면으로 이동
    setCurrentStep('basic-info');
  };

  const getCurrentConstitution = () => {
    const scores: Record<string, number> = { "목": 0, "화": 0, "토": 0, "금": 0, "수": 0 };
    answers.forEach(answer => {
      if (scores[answer] !== undefined) {
        scores[answer]++;
      }
    });
    
    const maxScore = Math.max(...Object.values(scores));
    return Object.keys(scores).find(key => scores[key] === maxScore) || "목";
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'start':
        return (
          <StartScreen
            onStartAsGuest={startAsGuest}
            onStartSurvey={startSurvey}
            onShowLogin={isLoggedIn ? logout : showLogin}
            onGoToMyPage={goToMyPage}
            onGoToAdmin={goToAdmin}
            isLoggedIn={isLoggedIn}
            user={user}
          />
        );
      
      case 'basic-info':
        return (
          <BasicInfoForm
            petInfo={petInfo}
            onPetInfoChange={setPetInfo}
            onBack={() => setCurrentStep('start')}
            onSubmit={handleBasicInfoSubmit}
          />
        );
      
      case 'survey':
        return (
          <Survey
            questions={questions}
            currentQuestionIndex={currentQuestionIndex}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={handleAnswerSelect}
            onNext={nextQuestion}
            onPrevious={previousQuestion}
          />
        );
      
      case 'results':
        const constitution = selectedResult ? selectedResult.constitution : getCurrentConstitution();
        const resultData = selectedResult ? {
          name: selectedResult.constitution,
          description: constitutionData[selectedResult.constitution]?.description || '체질 정보를 찾을 수 없습니다.',
          foods: constitutionData[selectedResult.constitution]?.foods || { meat: '', grain: '', vegetable: '', fruit: '' },
          avoid: constitutionData[selectedResult.constitution]?.avoid || '',
          season: constitutionData[selectedResult.constitution]?.season || '',
          tips: constitutionData[selectedResult.constitution]?.tips || ''
        } : constitutionData[constitution];
        
        return (
          <Results
            constitution={constitution}
            constitutionData={resultData}
            onSave={saveResult}
            onExport={exportResult}
            onBookConsultation={bookConsultation}
            isFromMyPage={!!selectedResult}
            onBackToMyPage={() => {
              setSelectedResult(null);
              setCurrentStep('mypage');
            }}
            petName={selectedResult ? selectedResult.pet_name : petInfo.name}
            userEmail={user?.email}
          />
        );
      
      case 'mypage':
        if (!isLoggedIn || !user || !token) {
          return (
            <div className="card">
              <div className="header">
                <h2>로그인이 필요합니다</h2>
                <p>마이페이지를 보려면 로그인해주세요.</p>
                <button className="btn btn-primary" onClick={() => setCurrentStep('start')}>
                  로그인하기
                </button>
              </div>
            </div>
          );
        }
        return (
          <MyPage
            user={user}
            token={token}
            onBack={() => setCurrentStep('start')}
            onViewResult={viewResult}
            onStartNewDiagnosis={startNewDiagnosis}
          />
        );
      
      case 'consultation':
        return (
          <ConsultationForm
            onCancel={handleConsultationCancel}
            onSuccess={handleConsultationSuccess}
            isLoggedIn={isLoggedIn}
            token={token}
            onShowLogin={showLogin}
          />
        );
      
      case 'admin':
        return <AdminPage />;
      
      default:
        return null;
    }
  };

  return (
    <div className="app">
      {renderCurrentStep()}
      
      {/* 로그인 프롬프트 모달 */}
      {showLoginPrompt && (
        <LoginModal 
          onLogin={handleLogin}
          onRegister={handleRegister}
          onCancel={handleLoginCancel}
        />
      )}

      {/* 관리자 로그인 모달 */}
      {showAdminLogin && (
        <AdminLoginModal 
          onLogin={handleAdminLogin}
          onCancel={handleAdminLoginCancel}
        />
      )}

      {/* 관리자 페이지 버튼 (고정) */}
      <button 
        className="admin-fab"
        onClick={goToAdmin}
        title="관리자 페이지"
      >
        ⚙️
      </button>

      {/* PWA 설치 프롬프트 */}
      {showInstallPrompt && (
        <div className="install-prompt">
          <div className="install-content">
            <h3>📱 앱으로 설치하세요!</h3>
            <p>홈 화면에 추가하여 더 편리하게 사용하세요</p>
            <div className="install-buttons">
              <button onClick={handleInstallClick} className="btn btn-primary">
                설치하기
              </button>
              <button 
                onClick={() => setShowInstallPrompt(false)} 
                className="btn btn-outline"
              >
                나중에
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
