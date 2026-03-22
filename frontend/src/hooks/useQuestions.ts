"use client";

import { useState, useCallback } from "react";
import { API_EXAM } from "@/lib/api";
import { Question, CreateQuestionRequest } from "@/lib/types";

export function useQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestionsByExam = useCallback(async (examId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await API_EXAM.get(`/exams/${examId}/questions`);
      setQuestions(res.data || []);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch questions");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createQuestion = useCallback(async (examId: string, data: Omit<CreateQuestionRequest, "exam_id">) => {
    const res = await API_EXAM.post(`/exams/${examId}/questions`, data);
    await fetchQuestionsByExam(examId);
    return res.data;
  }, [fetchQuestionsByExam]);

  const submitExam = useCallback(async (examId: string, answers: Record<string, string>) => {
    const res = await API_EXAM.post(`/exams/${examId}/submit`, { answers });
    return res.data;
  }, []);

  const getExamResult = useCallback(async (examId: string) => {
    try {
      const res = await API_EXAM.get(`/exams/${examId}/result`);
      return res.data;
    } catch (err: any) {
      if (err.response?.status === 404) return null;
      throw err;
    }
  }, []);

  return { questions, isLoading, error, fetchQuestionsByExam, createQuestion, submitExam, getExamResult };
}
