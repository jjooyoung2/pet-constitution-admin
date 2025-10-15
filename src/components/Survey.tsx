import React from 'react';
import { Question } from '../types';

interface SurveyProps {
  questions: Question[];
  currentQuestionIndex: number;
  selectedAnswer: number | null;
  onAnswerSelect: (optionIndex: number) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const Survey: React.FC<SurveyProps> = ({
  questions,
  currentQuestionIndex,
  selectedAnswer,
  onAnswerSelect,
  onNext,
  onPrevious
}) => {
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="survey">
      <div className="card">
        <div className="header">
          <h2>체질 진단 설문</h2>
          <p>총 10문항 중 {currentQuestionIndex + 1}문항</p>
        </div>
        
        <div className="progress-bar">
          <div className="progress-fill" style={{width: `${progress}%`}}></div>
        </div>
        
        <div className="question-card">
          <div className="question-title">{currentQuestion.question}</div>
          <div className="options">
            {currentQuestion.options.map((option, index) => (
              <div 
                key={index}
                className={`option ${selectedAnswer === index ? 'selected' : ''}`}
                onClick={() => onAnswerSelect(index)}
              >
                {option.text}
              </div>
            ))}
          </div>
        </div>
        
        <div className="button-group">
          <button 
            className="btn btn-secondary" 
            onClick={onPrevious}
            style={{display: currentQuestionIndex > 0 ? 'block' : 'none'}}
          >
            이전
          </button>
          <button 
            className="btn btn-primary" 
            onClick={onNext}
            disabled={selectedAnswer === null}
          >
            {currentQuestionIndex === questions.length - 1 ? '결과 보기' : '다음'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Survey;














