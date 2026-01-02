export interface PetInfo {
  name: string;
  petType?: string; // '강아지' | '고양이'
  age: string;
  weight: string;
  symptoms: string;
}

export interface Question {
  question: string;
  options: {
    text: string;
    type: string;
  }[];
}

export interface ConstitutionData {
  name: string;
  description: string;
  foods: {
    meat: string;
    grain: string;
    vegetable: string;
    fruit: string;
  };
  avoid: string;
  season: string;
  tips: string;
}

export interface User {
  id: number;
  email: string;
  name: string | null;
  is_admin?: boolean;
}

export interface ApiUser {
  id: number;
  email: string;
  name: string | null;
  is_admin?: boolean;
}

export type Step = 'start' | 'basic-info' | 'survey' | 'results' | 'mypage' | 'consultation' | 'admin' | 'admin-login' | 'privacy' | 'support';