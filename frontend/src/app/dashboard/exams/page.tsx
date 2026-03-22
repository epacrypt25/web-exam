"use client";

import { useState, useEffect } from "react";
import { useClasses } from "@/hooks/useClasses";
import { useExams } from "@/hooks/useExams";
import { useQuestions } from "@/hooks/useQuestions";
import { useAuth } from "@/context/AuthContext";
import { Modal, FormField } from "@/components/Modal";
import {
  Plus,
  FileText,
  Calendar,
  Loader2,
  AlertCircle,
  FolderOpen,
  BookOpen,
  Filter,
  MessageSquare,
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  Trophy,
  ArrowRight,
  ListOrdered
} from "lucide-react";
import toast from "react-hot-toast";
import { Exam, ExamResult } from "@/lib/types";

export default function ExamsPage() {
  const { classes, isLoading: isLoadingClasses } = useClasses();
  const { exams, isLoading: isLoadingExams, error, fetchExamsByClass, createExam } = useExams();
  const { questions, isLoading: isLoadingQuestions, fetchQuestionsByExam, createQuestion, submitExam, getExamResult } = useQuestions();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [examClassId, setExamClassId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Question state
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);

  // Quiz Mode State
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(30);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);
  const [isSubmittingExam, setIsSubmittingExam] = useState(false);

  const startQuiz = () => {
    setIsQuizStarted(true);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeLeft(30);
    setIsQuizFinished(false);
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimeLeft(30);
    } else {
      setIsSubmittingExam(true);
      try {
        const res = await submitExam(selectedExam!.id, answers);
        setExamResult(res);
        setIsQuizFinished(true);
        toast.success("Exam completed!");
      } catch (err: any) {
        toast.error("Failed to submit exam");
        setSelectedExam(null);
      } finally {
        setIsSubmittingExam(false);
      }
    }
  };

  const handleAnswerSelect = (optionLabel: string) => {
    const currentQ = questions[currentQuestionIndex];
    if (!currentQ) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionLabel,
    }));
  };

  // Quiz Timer
  useEffect(() => {
    if (!isQuizStarted || isQuizFinished || isSubmittingExam || !questions[currentQuestionIndex] || isAdmin) return;

    if (timeLeft === 0) {
      handleNextQuestion();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [isQuizStarted, isQuizFinished, isSubmittingExam, timeLeft, currentQuestionIndex, questions, isAdmin]);

  // Fetch exams when a class is selected
  useEffect(() => {
    if (selectedClassId) {
      fetchExamsByClass(selectedClassId);
    }
  }, [selectedClassId, fetchExamsByClass]);

  // Auto-select class based on role
  useEffect(() => {
    if (isAdmin) {
      if (classes.length > 0 && !selectedClassId) {
        setSelectedClassId(classes[0].id);
      }
    } else {
      if (user?.class_id && selectedClassId !== user.class_id) {
        setSelectedClassId(user.class_id);
      }
    }
  }, [classes, selectedClassId, isAdmin, user]);

  // Fetch questions when an exam is selected
  useEffect(() => {
    if (selectedExam) {
      setExamResult(null);
      if (!isAdmin) {
        getExamResult(selectedExam.id).then((res) => {
          if (res) {
            setExamResult(res);
            setIsQuizFinished(true);
          } else {
            setIsQuizStarted(false);
            setCurrentQuestionIndex(0);
            setAnswers({});
            setTimeLeft(30);
            setIsQuizFinished(false);
          }
        }).catch(() => {
          // ignore cache err
        });
      }
      fetchQuestionsByExam(selectedExam.id);
    }
  }, [selectedExam, fetchQuestionsByExam, getExamResult, isAdmin]);

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createExam({ title, description, class_id: examClassId });
      toast.success("Exam created successfully! 📝");
      setIsModalOpen(false);
      setTitle("");
      setDescription("");
      setExamClassId("");
      if (examClassId === selectedClassId) {
        fetchExamsByClass(selectedClassId);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to create exam");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExam) return;
    setIsSubmittingQuestion(true);
    try {
      await createQuestion(selectedExam.id, {
        question_text: questionText,
        option_a: optionA,
        option_b: optionB,
        option_c: optionC,
        option_d: optionD,
        correct_answer: correctAnswer,
      });
      toast.success("Question added! ✅");
      setIsQuestionModalOpen(false);
      resetQuestionForm();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to create question");
    } finally {
      setIsSubmittingQuestion(false);
    }
  };

  const resetQuestionForm = () => {
    setQuestionText("");
    setOptionA("");
    setOptionB("");
    setOptionC("");
    setOptionD("");
    setCorrectAnswer("");
  };

  const selectedClassName =
    classes.find((c) => c.id === selectedClassId)?.name || "";

  const optionLabels = ["A", "B", "C", "D"] as const;
  const optionColors: Record<string, string> = {
    A: "from-blue-500 to-cyan-400",
    B: "from-purple-500 to-pink-500",
    C: "from-amber-400 to-orange-500",
    D: "from-emerald-400 to-teal-500",
  };

  // ==================== QUESTIONS DETAIL VIEW ====================
  if (selectedExam) {
    if (!isAdmin) {
      // ----------------------------------------------------------------
      // USER: QUIZ MODE
      // ----------------------------------------------------------------
      if (isLoadingQuestions) {
        return (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#7B46F1] animate-spin" />
          </div>
        );
      }

      if (questions.length === 0) {
        return (
          <div className="max-w-3xl mx-auto mt-10 text-center animate-fade-in card">
            <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-[#7B46F1]" />
            </div>
            <h2 className="text-2xl font-bold text-[#2B3674] mb-2">No Questions Available</h2>
            <p className="text-gray-500 mb-6">This exam doesn't have any questions yet.</p>
            <button onClick={() => setSelectedExam(null)} className="btn-secondary">
              Go Back
            </button>
          </div>
        );
      }

      if (isSubmittingExam) {
        return (
          <div className="flex flex-col items-center justify-center py-20 gap-4 mt-10 card">
            <Loader2 className="w-10 h-10 text-[#7B46F1] animate-spin" />
            <p className="text-gray-500 animate-pulse font-medium">Submitting your answers...</p>
          </div>
        );
      }

      if (isQuizFinished && examResult) {
        return (
          <div className="max-w-2xl mx-auto mt-10 animate-slide-up">
            <div className="card text-center p-10 border border-purple-100 relative overflow-hidden bg-white shadow-xl">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#7B46F1]/5 rounded-full blur-[100px]" />
              
              <div className="relative z-10">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#8A50F5] to-[#7B46F1] flex items-center justify-center mx-auto shadow-lg shadow-purple-500/30 mb-6">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
                
                <h2 className="text-3xl font-extrabold text-[#2B3674] mb-2">Exam Completed!</h2>
                <p className="text-gray-500 mb-8 font-medium">{selectedExam.title}</p>
                
                <div className="flex justify-center gap-8 mb-10">
                  <div className="text-center">
                    <p className="text-6xl font-black text-[#7B46F1] mb-2 drop-shadow-sm">{examResult.score}</p>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Final Score</p>
                  </div>
                </div>

                <button onClick={() => setSelectedExam(null)} className="btn-primary w-full max-w-xs mx-auto text-lg py-4">
                  Back to Exams
                </button>
              </div>
            </div>
          </div>
        );
      }

      if (!isQuizStarted) {
        return (
          <div className="max-w-2xl mx-auto mt-10 animate-fade-in">
            <div className="card p-8 border border-purple-100 shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
               <div className="relative z-10">
                <button
                  onClick={() => setSelectedExam(null)}
                  className="mb-8 flex flex-row items-center gap-2 text-gray-500 hover:text-[#7B46F1] transition-colors text-sm font-bold"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8A50F5] to-[#7B46F1] flex items-center justify-center shadow-lg mb-6 shadow-purple-500/20">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                
                <h2 className="text-3xl font-extrabold text-[#2B3674] mb-2">{selectedExam.title}</h2>
                <p className="text-gray-500 mb-8 leading-relaxed font-medium">
                  {selectedExam.description || "You are about to start this exam."}
                </p>
                
                <div className="bg-[#F8F9FB] rounded-xl p-6 border border-gray-100 mb-8 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Exam Rules</h3>
                  <ul className="space-y-4">
                    <li className="flex gap-3 text-[#2B3674] font-medium">
                      <ListOrdered className="w-5 h-5 text-[#7B46F1] flex-shrink-0" />
                      <span>This exam consists of <strong>{questions.length} multiple choice questions</strong>.</span>
                    </li>
                    <li className="flex gap-3 text-[#2B3674] font-medium">
                      <Clock className="w-5 h-5 text-[#7B46F1] flex-shrink-0" />
                      <span>You will have exactly <strong>30 seconds</strong> to answer each question.</span>
                    </li>
                    <li className="flex gap-3 text-[#2B3674] font-medium">
                      <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                      <span>If the time runs out, the current question will be skipped automatically and marked incorrect.</span>
                    </li>
                  </ul>
                </div>

                <button onClick={startQuiz} className="btn-primary w-full text-lg py-4 flex items-center justify-center gap-2 font-bold shadow-purple-500/25">
                  Start Exam Now
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        );
      }

      // Active Quiz Render
      const currentQ = questions[currentQuestionIndex];
      const selectedAnswer = answers[currentQ.id];

      return (
        <div className="max-w-3xl mx-auto mt-6 animate-fade-in">
          {/* Progress & Timer Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
            </div>
            <div className={`
              flex items-center gap-2 px-4 py-2 rounded-full font-bold
              ${timeLeft <= 10 ? "bg-red-50 text-red-500 animate-pulse border border-red-100" : "bg-purple-50 text-[#7B46F1] border border-purple-100"}
            `}>
              <Clock className="w-4 h-4" />
              00:{timeLeft.toString().padStart(2, "0")}
            </div>
          </div>

          <div className="w-full h-2 bg-gray-100 rounded-full mb-8 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#8A50F5] to-[#7B46F1] transition-all duration-1000 ease-linear shadow-[0_0_10px_rgba(123,70,241,0.5)]"
              style={{ width: `${(timeLeft / 30) * 100}%` }}
            />
          </div>

          {/* Question Card */}
          <div className="card mb-6 border border-gray-100 shadow-xl">
            <p className="text-xl md:text-2xl font-bold text-[#2B3674] leading-relaxed mb-8">
              {currentQ.question_text}
            </p>

            <div className="grid grid-cols-1 gap-3">
              {optionLabels.map((label) => {
                const optionKey = `option_${label.toLowerCase()}` as "option_a" | "option_b" | "option_c" | "option_d";
                const isSelected = selectedAnswer === label;
                
                return (
                  <button
                    key={label}
                    onClick={() => handleAnswerSelect(label)}
                    className={`
                      w-full text-left flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300
                      ${
                        isSelected 
                        ? `bg-[#F8F5FF] border-[#7B46F1] shadow-md shadow-purple-500/10` 
                        : "bg-white border-gray-100 hover:bg-gray-50 hover:border-gray-200"
                      }
                    `}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`
                        w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm transition-colors shadow-sm
                        ${isSelected ? "bg-[#7B46F1] text-white" : "bg-gray-100 text-gray-500"}
                      `}>
                        {label}
                      </div>
                      <span className={`font-semibold text-lg ${isSelected ? "text-[#7B46F1]" : "text-gray-600"}`}>
                        {currentQ[optionKey]}
                      </span>
                    </div>
                    {isSelected && <CheckCircle2 className="w-6 h-6 text-[#7B46F1] animate-slide-up" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Controls */}
          <div className="flex justify-end">
            <button
              onClick={handleNextQuestion}
              disabled={!selectedAnswer}
              className={`
                flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all
                ${selectedAnswer 
                  ? "bg-[#2B3674] text-white hover:bg-[#1e2654] hover:scale-[1.02] shadow-lg" 
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"}
              `}
            >
              {currentQuestionIndex === questions.length - 1 ? "Finish Exam" : "Next Question"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      );
    }

    // ----------------------------------------------------------------
    // ADMIN: MANAGEMENT VIEW
    // ----------------------------------------------------------------
    return (
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
        {/* Back Button & Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedExam(null)}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500 hover:text-[#7B46F1]"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-extrabold text-[#2B3674] mb-1">
              {selectedExam.title}
            </h1>
            <p className="text-gray-500 font-medium text-sm">
              {selectedExam.description || "No description"} •{" "}
              {questions.length} question{questions.length !== 1 ? "s" : ""}
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setIsQuestionModalOpen(true)}
              className="btn-primary flex items-center gap-2 shadow-purple-500/20"
            >
              <Plus className="w-5 h-5" />
              Add Question
            </button>
          )}
        </div>

        {/* Questions List */}
        {isLoadingQuestions ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#7B46F1] animate-spin" />
          </div>
        ) : questions.length === 0 ? (
          <div className="card flex flex-col items-center justify-center py-16 text-center shadow-sm border border-transparent">
            <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-[#7B46F1]" />
            </div>
            <h3 className="text-lg font-bold text-[#2B3674] mb-2">
              No questions yet
            </h3>
            <p className="text-gray-500 font-medium mb-6 max-w-sm">
              {isAdmin
                ? "Add your first multiple choice question to this exam."
                : "No questions have been added to this exam yet."}
            </p>
            {isAdmin && (
              <button
                onClick={() => setIsQuestionModalOpen(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Question
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            {questions.map((q, i) => (
              <div
                key={q.id}
                className="card animate-slide-up border border-gray-100 shadow-md"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8A50F5] to-[#7B46F1] flex items-center justify-center flex-shrink-0 text-white font-bold text-sm shadow-sm">
                    {i + 1}
                  </div>
                  <p className="text-[#2B3674] font-bold text-lg leading-relaxed pt-1.5">
                    {q.question_text}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-14">
                  {optionLabels.map((label) => {
                    const optionKey = `option_${label.toLowerCase()}` as
                      | "option_a"
                      | "option_b"
                      | "option_c"
                      | "option_d";
                    const isCorrect = q.correct_answer.toUpperCase() === label;
                    return (
                      <div
                        key={label}
                        className={`
                          flex items-center gap-3 px-4 py-3 rounded-xl border transition-all
                          ${
                            isCorrect
                              ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                              : "bg-[#F8F9FB] border-gray-100 text-gray-500"
                          }
                        `}
                      >
                        {isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                        )}
                        <span className="font-bold text-sm mr-1">
                          {label}.
                        </span>
                        <span className="text-sm font-medium">{q[optionKey]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Question Modal */}
        <Modal
          isOpen={isQuestionModalOpen}
          onClose={() => setIsQuestionModalOpen(false)}
          title="Add Multiple Choice Question"
        >
          <form onSubmit={handleCreateQuestion} className="space-y-4">
            <FormField
              label="Question"
              id="question-text"
              value={questionText}
              onChange={setQuestionText}
              placeholder="What is the capital of Indonesia?"
              isTextarea
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <FormField
                label="Option A"
                id="option-a"
                value={optionA}
                onChange={setOptionA}
                placeholder="Jakarta"
                required
              />
              <FormField
                label="Option B"
                id="option-b"
                value={optionB}
                onChange={setOptionB}
                placeholder="Bandung"
                required
              />
              <FormField
                label="Option C"
                id="option-c"
                value={optionC}
                onChange={setOptionC}
                placeholder="Surabaya"
                required
              />
              <FormField
                label="Option D"
                id="option-d"
                value={optionD}
                onChange={setOptionD}
                placeholder="Yogyakarta"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">
                Correct Answer
              </label>
              <div className="flex gap-2">
                {optionLabels.map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setCorrectAnswer(label)}
                    className={`
                      flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-300
                      ${
                        correctAnswer === label
                          ? `bg-gradient-to-r ${optionColors[label]} text-white shadow-lg scale-105`
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                      }
                    `}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsQuestionModalOpen(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingQuestion || !correctAnswer}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {isSubmittingQuestion ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add Question
                  </>
                )}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  // ==================== EXAMS LIST VIEW ====================
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-[#2B3674] mb-2">Exams</h1>
          <p className="text-gray-500 font-medium">
            View and create exams for each class
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => {
              setExamClassId(selectedClassId);
              setIsModalOpen(true);
            }}
            className="btn-primary flex items-center gap-2 shadow-purple-500/20"
            disabled={classes.length === 0}
          >
            <Plus className="w-5 h-5" />
            New Exam
          </button>
        )}
      </div>

      {/* Class Filter */}
      {isAdmin && (
        isLoadingClasses ? (
          <div className="flex items-center gap-2 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-bold">Loading classes...</span>
          </div>
        ) : classes.length === 0 ? (
          <div className="card flex items-center gap-4 text-amber-500 bg-amber-50 border border-amber-100 shadow-sm p-5">
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <p className="text-sm font-bold">
              No classes found. Please create a class first before adding exams.
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-500">
              <Filter className="w-5 h-5 text-[#7B46F1]" />
              <span className="text-sm font-bold">Filter by Class:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {classes.map((cls) => (
                <button
                  key={cls.id}
                  onClick={() => setSelectedClassId(cls.id)}
                  className={`
                    px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 shadow-sm
                    ${
                      selectedClassId === cls.id
                        ? "bg-[#7B46F1] text-white shadow-[#7B46F1]/20 border border-[#7B46F1]"
                        : "bg-white text-gray-500 border border-gray-200 hover:text-[#7B46F1] hover:border-purple-200"
                    }
                  `}
                >
                  {cls.name}
                </button>
              ))}
            </div>
          </div>
        )
      )}

      {/* Exams Content */}
      {!selectedClassId ? null : isLoadingExams ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-[#7B46F1] animate-spin" />
        </div>
      ) : error ? (
        <div className="card flex items-center gap-4 text-red-500 bg-red-50 border border-red-100 p-5">
          <AlertCircle className="w-6 h-6 flex-shrink-0" />
          <p className="font-medium">{error}</p>
        </div>
      ) : exams.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-center border-transparent shadow-sm">
          <div className="w-20 h-20 rounded-2xl bg-purple-50 flex items-center justify-center mb-5">
            <FolderOpen className="w-10 h-10 text-[#7B46F1]" />
          </div>
          <h3 className="text-xl font-bold text-[#2B3674] mb-3">
            No exams in &quot;{selectedClassName}&quot;
          </h3>
          <p className="text-gray-500 mb-8 max-w-sm font-medium">
            Create the first exam for this class to get your students started.
          </p>
          {isAdmin && (
            <button
              onClick={() => {
                setExamClassId(selectedClassId);
                setIsModalOpen(true);
              }}
              className="btn-primary flex items-center gap-2 shadow-purple-500/20"
            >
              <Plus className="w-5 h-5" />
              Create Exam
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam, i) => (
            <div
              key={exam.id}
              onClick={() => setSelectedExam(exam)}
              className="card group hover:-translate-y-1 hover:border-[#7B46F1]/30 hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-start justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8A50F5] to-[#7B46F1] flex items-center justify-center shadow-md shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#7B46F1] bg-[#7B46F1]/10 px-3 py-1.5 rounded-lg">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Questions</span>
                </div>
              </div>
              <h3 className="text-lg font-extrabold text-[#2B3674] mb-2 group-hover:text-[#7B46F1] transition-colors leading-snug">
                {exam.title}
              </h3>
              <p className="text-sm text-gray-500 font-medium mb-5 line-clamp-2">
                {exam.description || "No description provided for this exam"}
              </p>
              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(exam.created_at).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-500 bg-blue-50 px-2.5 py-1.5 rounded-lg">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span className="max-w-[100px] truncate">{selectedClassName}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Exam Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Exam"
      >
        <form onSubmit={handleCreateExam} className="space-y-4">
          <FormField
            label="Exam Title"
            id="exam-title"
            value={title}
            onChange={setTitle}
            placeholder="e.g. Midterm Exam Chapter 1-5"
            required
          />
          <FormField
            label="Description"
            id="exam-description"
            value={description}
            onChange={setDescription}
            placeholder="Brief description of the exam..."
            isTextarea
          />
          <div>
            <label
              htmlFor="exam-class"
              className="block text-sm font-bold text-gray-500 mb-2"
            >
              Class
            </label>
            <select
              id="exam-class"
              value={examClassId}
              onChange={(e) => setExamClassId(e.target.value)}
              required
              className="input-field appearance-none cursor-pointer"
            >
              <option value="" disabled>
                Select a class
              </option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Create
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
