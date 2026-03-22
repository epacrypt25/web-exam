export interface User {
  id: string;
  username: string;
  role: string;
  class_id?: string | null;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface Class {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface CreateClassRequest {
  name: string;
  description: string;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  class_id: string;
  created_at: string;
}

export interface CreateExamRequest {
  title: string;
  description: string;
  class_id: string;
}

export interface Question {
  id: string;
  exam_id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  created_at: string;
}

export interface CreateQuestionRequest {
  exam_id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
}

export interface ExamResult {
  id: string;
  exam_id: string;
  user_id: string;
  score: number;
  total: number;
  created_at: string;
}

export interface SubmitExamRequest {
  answers: Record<string, string>;
}
