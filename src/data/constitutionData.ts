import { ConstitutionData } from '../types';

export const constitutionData: Record<string, ConstitutionData> = {
  "목": {
    name: "목(木)",
    description: "활동적이고 스트레스 민감. 열 관리와 간담 해독 케어가 도움이 됩니다.",
    foods: {
      meat: "닭고기",
      grain: "보리",
      vegetable: "브로콜리",
      fruit: "사과"
    },
    avoid: "자극적·기름진 간식 과다, 불규칙 급여",
    season: "봄(바람·건조 변동): 알레르기/피부·호흡 주의, 환기와 보습 균형",
    tips: "추천 식단: 닭고기 기반 단백질 + 보리 소량 + 브로콜리 소량 찌거나 삶아 급여 + 사과 아주 소량."
  },
  "화": {
    name: "화(火)",
    description: "열이 많고 활동적. 수분 공급과 열 관리가 중요합니다.",
    foods: {
      meat: "칠면조",
      grain: "현미",
      vegetable: "오이",
      fruit: "수박"
    },
    avoid: "기름진 붉은 고기 과다, 아주 매운/자극적 간식, 한낮 뜨거운 환경에서의 건조 간식",
    season: "여름(열/습): 갈증/소화 주의, 한낮 산책 피하기, 미지근한 물 자주",
    tips: "열이 많아 과도한 지방/자극적인 간식은 피하세요. 수분 많은 담백 식단이 좋아요."
  },
  "토": {
    name: "토(土)",
    description: "안정적이고 소화가 좋음. 균형잡힌 식단이 중요합니다.",
    foods: {
      meat: "소고기",
      grain: "찹쌀",
      vegetable: "단호박",
      fruit: "배"
    },
    avoid: "고탄수 간식 남용, 급격한 사료 교체, 과일 과다",
    season: "여름(열/습): 갈증/소화 주의, 한낮 산책 피하기, 미지근한 물 자주",
    tips: "안정적인 식단과 규칙적인 급여가 중요합니다."
  },
  "금": {
    name: "금(金)",
    description: "조용하고 신중. 호흡기와 피부 관리가 중요합니다.",
    foods: {
      meat: "오리고기",
      grain: "조",
      vegetable: "무",
      fruit: "배"
    },
    avoid: "건조 스낵 과다, 향 강한 간식",
    season: "가을(건조): 호흡·피부 주의, 실내 습도 관리, 보습 케어",
    tips: "건조해지는 계절엔 실내 습도를 유지하고, 산책 후 피부 보습·브러싱을 해주세요."
  },
  "수": {
    name: "수(水)",
    description: "차분하고 신중. 신장과 방광 건강 관리가 중요합니다.",
    foods: {
      meat: "양고기",
      grain: "흑미",
      vegetable: "시금치",
      fruit: "블루베리"
    },
    avoid: "냉한 음식 과다, 겨울철 찬 물/얼음 간식",
    season: "겨울(한기): 관절·신장·방광 주의, 체온 유지, 차가운 급여 피하기",
    tips: "체온 유지와 따뜻한 환경이 중요합니다."
  }
};

