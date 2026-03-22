"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { GraduationCap, Eye, EyeOff, ArrowRight, UserPlus } from "lucide-react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsSubmitting(true);
    try {
      await register(username, password);
      toast.success("Account created! Please sign in 🎉");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side — Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-purple-950 via-surface-950 to-brand-950">
        <div className="absolute top-32 right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-32 left-20 w-64 h-64 bg-brand-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />

        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-brand-500 flex items-center justify-center shadow-glow">
              <UserPlus className="w-7 h-7 text-white" />
            </div>
          </div>
          <h2 className="text-5xl font-extrabold text-white leading-tight mb-4">
            Join
            <br />
            <span className="gradient-text">ExamApp</span>
          </h2>
          <p className="text-lg text-surface-400 max-w-md leading-relaxed">
            Create your account in seconds and start managing classes and exams with a modern, intuitive interface.
          </p>
        </div>
      </div>

      {/* Right Side — Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md animate-slide-up">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-brand-500 flex items-center justify-center shadow-glow">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">ExamApp</h1>
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-surface-400 mb-8">
            Fill in the details to create your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="register-username" className="block text-sm font-medium text-surface-300 mb-2">
                Username
              </label>
              <input
                id="register-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                required
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="register-password" className="block text-sm font-medium text-surface-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  required
                  className="input-field pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="register-confirm-password" className="block text-sm font-medium text-surface-300 mb-2">
                Confirm Password
              </label>
              <input
                id="register-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
                required
                className="input-field"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-surface-500 mt-8">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-brand-400 hover:text-brand-300 font-semibold transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
