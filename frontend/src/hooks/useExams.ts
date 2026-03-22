"use client";

import { useState, useCallback } from "react";
import { API_EXAM } from "@/lib/api";
import { Exam, CreateExamRequest } from "@/lib/types";

export function useExams() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExamsByClass = useCallback(async (classId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await API_EXAM.get(`/exams?class_id=${classId}`);
      setExams(res.data || []);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch exams");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createExam = async (data: CreateExamRequest) => {
    const res = await API_EXAM.post("/exams", data);
    await fetchExamsByClass(data.class_id);
    return res.data;
  };

  return { exams, isLoading, error, fetchExamsByClass, createExam };
}
