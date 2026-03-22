"use client";

import { useAuth } from "@/context/AuthContext";
import { useClasses } from "@/hooks/useClasses";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { BookOpen, AlertCircle, Loader2, Menu, GraduationCap } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, updateUserClass } = useAuth();
  const { classes, isLoading: isLoadingClasses, error } = useClasses();
  const router = useRouter();

  const [selectedClassId, setSelectedClassId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 text-[#7B46F1] animate-spin" />
      </div>
    );
  }

  // Intercept normal users who haven't picked a class
  if (user.role === "user" && !user.class_id) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden min-h-screen">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#7B46F1]/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-400/10 rounded-full blur-[128px]" />
        
        <div className="card w-full max-w-lg relative z-10 animate-slide-up border-transparent">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8A50F5] to-[#7B46F1] flex items-center justify-center mx-auto shadow-lg shadow-purple-500/20 mb-6">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[#2B3674] mb-2">
              Welcome to ExamApp!
            </h1>
            <p className="text-gray-500">
              Please select your class to get started and view your exams.
            </p>
          </div>

          {isLoadingClasses ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
            </div>
          ) : error ? (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-red-500 mb-6">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          ) : classes.length === 0 ? (
            <div className="text-center py-8 text-gray-400 font-medium">
              No classes available. Please wait for an admin to create one.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-3 max-h-[40vh] overflow-y-auto pr-2">
                {classes.map((cls) => (
                  <button
                    key={cls.id}
                    onClick={() => setSelectedClassId(cls.id)}
                    className={`
                      w-full flex flex-col items-start p-4 rounded-xl border text-left transition-all duration-300
                      ${
                        selectedClassId === cls.id
                          ? "bg-purple-50 border-[#7B46F1]/30 shadow-sm"
                          : "bg-white border-gray-100 hover:bg-gray-50 hover:border-gray-200"
                      }
                    `}
                  >
                    <span className={`font-bold text-lg ${selectedClassId === cls.id ? "text-[#7B46F1]" : "text-[#2B3674]"}`}>
                      {cls.name}
                    </span>
                    {cls.description && (
                      <span className="text-sm text-gray-500 mt-1 line-clamp-1">
                        {cls.description}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <button
                onClick={async () => {
                  if (!selectedClassId) return;
                  setIsSubmitting(true);
                  try {
                    await updateUserClass(selectedClassId);
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                disabled={!selectedClassId || isSubmitting}
                className="w-full btn-primary py-4 mt-6 text-lg font-semibold flex items-center justify-center gap-2 shadow-purple-500/25"
              >
                {isSubmitting ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  "Join Class"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Normal Dashboard layout once class is selected (or if admin)
  return (
    <div className="min-h-screen bg-[#F4F7FE]">
      {/* Mobile Header (Hidden on Large Screens) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8A50F5] to-[#7B46F1] flex items-center justify-center shadow-sm">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-[#2B3674] tracking-tight">ExamApp</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 rounded-xl text-gray-500 hover:bg-purple-50 hover:text-[#7B46F1] transition-colors focus:outline-none focus:ring-2 focus:ring-[#7B46F1]/20"
          aria-label="Open Menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="lg:ml-72 p-4 pt-24 lg:pt-8 lg:p-8 min-h-screen transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
