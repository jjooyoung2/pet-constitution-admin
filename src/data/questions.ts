import { Question } from '../types';

export const questions: Question[] = [
  {
    question: "반려동물의 활동량은 어떤가요?",
    options: [
      { text: "매우 활발하고 에너지가 넘쳐요", type: "목" },
      { text: "적당히 활발하고 적절한 에너지", type: "화" },
      { text: "차분하고 안정적이에요", type: "토" },
      { text: "조용하고 신중해요", type: "금" },
      { text: "가끔 활발하지만 대부분 조용해요", type: "수" }
    ]
  },
  {
    question: "스트레스에 대한 반응은?",
    options: [
      { text: "스트레스를 잘 받고 예민해요", type: "목" },
      { text: "적당히 스트레스를 받아요", type: "화" },
      { text: "스트레스에 잘 견디는 편이에요", type: "토" },
      { text: "스트레스를 잘 받지 않아요", type: "금" },
      { text: "스트레스를 잘 받지만 회복이 빨라요", type: "수" }
    ]
  },
  {
    question: "소화 기능은 어떤가요?",
    options: [
      { text: "소화가 잘 안 되고 가끔 설사해요", type: "목" },
      { text: "소화가 보통이에요", type: "화" },
      { text: "소화가 잘 되고 변이 정상이에요", type: "토" },
      { text: "소화가 좋고 변이 단단해요", type: "금" },
      { text: "소화가 불안정하고 변이 가끔 묽어요", type: "수" }
    ]
  },
  {
    question: "피부 상태는 어떤가요?",
    options: [
      { text: "피부가 건조하고 가려워해요", type: "목" },
      { text: "피부가 적당히 건조해요", type: "화" },
      { text: "피부가 건강하고 윤기가 나요", type: "토" },
      { text: "피부가 건조하고 각질이 있어요", type: "금" },
      { text: "피부가 차갑고 축축해요", type: "수" }
    ]
  },
  {
    question: "수면 패턴은 어떤가요?",
    options: [
      { text: "잠을 잘 못 자고 불안해해요", type: "목" },
      { text: "적당히 잠을 자요", type: "화" },
      { text: "잠을 잘 자고 편안해해요", type: "토" },
      { text: "잠을 깊이 자요", type: "금" },
      { text: "잠을 가끔 못 자고 불안해해요", type: "수" }
    ]
  },
  {
    question: "식욕은 어떤가요?",
    options: [
      { text: "식욕이 불안정하고 가끔 안 먹어요", type: "목" },
      { text: "식욕이 보통이에요", type: "화" },
      { text: "식욕이 좋고 잘 먹어요", type: "토" },
      { text: "식욕이 적당해요", type: "금" },
      { text: "식욕이 불안정하고 가끔 과식해요", type: "수" }
    ]
  },
  {
    question: "체온은 어떤가요?",
    options: [
      { text: "체온이 높고 더위를 잘 타요", type: "목" },
      { text: "체온이 적당해요", type: "화" },
      { text: "체온이 정상이에요", type: "토" },
      { text: "체온이 낮고 추위를 타요", type: "금" },
      { text: "체온이 불안정해요", type: "수" }
    ]
  },
  {
    question: "호흡 상태는 어떤가요?",
    options: [
      { text: "호흡이 빠르고 얕아요", type: "목" },
      { text: "호흡이 보통이에요", type: "화" },
      { text: "호흡이 깊고 안정적이에요", type: "토" },
      { text: "호흡이 얕고 가끔 어려워해요", type: "금" },
      { text: "호흡이 불안정해요", type: "수" }
    ]
  },
  {
    question: "관절과 근육 상태는 어떤가요?",
    options: [
      { text: "근육이 긴장되고 뻣뻣해요", type: "목" },
      { text: "근육이 적당히 유연해요", type: "화" },
      { text: "근육이 부드럽고 유연해요", type: "토" },
      { text: "근육이 뻣뻣하고 관절이 아파요", type: "금" },
      { text: "근육이 약하고 관절이 불안정해요", type: "수" }
    ]
  },
  {
    question: "전반적인 건강 상태는 어떤가요?",
    options: [
      { text: "가끔 아프지만 회복이 빨라요", type: "목" },
      { text: "보통 건강해요", type: "화" },
      { text: "건강하고 활력이 넘쳐요", type: "토" },
      { text: "건강하지만 가끔 피로해요", type: "금" },
      { text: "건강이 불안정하고 가끔 아파요", type: "수" }
    ]
  }
];

