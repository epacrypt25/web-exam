"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { GraduationCap, Eye, EyeOff, Facebook, Linkedin } from "lucide-react";
import toast from "react-hot-toast";

// Social Icon placeholder
function GoogleIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
    </svg>
  );
}

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(username, password);
      toast.success("Welcome back! 🎉");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#7B46F1] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-[#8A50F5] to-[#7B46F1] p-4 sm:p-8 overflow-hidden font-sans">
      {/* Decorative Outer Shapes */}
      <div className="absolute top-10 left-10 w-24 h-24 border-4 border-dashed border-white/20 rounded-xl rotate-12" />
      <div className="absolute bottom-20 left-20">
        <div className="w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-b-[50px] border-b-cyan-400 rotate-45 opacity-80" />
      </div>
      <div className="absolute top-20 right-32">
        <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[35px] border-b-cyan-400 -rotate-12 opacity-80" />
      </div>
      <div className="absolute bottom-32 right-32 w-4 h-4 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
      <div className="absolute top-40 right-10 w-3 h-3 rounded-full bg-white/50" />
      
      {/* Circle dot grid (simplified) */}
      <div className="absolute bottom-10 right-10 grid grid-cols-4 gap-2 opacity-20">
        {[...Array(16)].map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-white" />
        ))}
      </div>
      <div className="absolute top-10 left-32 grid grid-cols-4 gap-2 opacity-20">
        {[...Array(16)].map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-white" />
        ))}
      </div>

      {/* Main White Login Card */}
      <div className="relative z-10 w-full max-w-[1100px] bg-white rounded-3xl shadow-[0_10px_50px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col min-h-[600px]">
        
        {/* Header inside Card */}
        <div className="flex items-center justify-between p-6 lg:p-10 pb-0">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full border border-purple-200 flex items-center justify-center bg-white shadow-sm font-bold text-purple-600">
              <GraduationCap className="w-6 h-6 text-[#7B46F1]" />
            </div>
            <h1 className="text-xl font-bold text-[#2A2B42]">
              ExamApp
            </h1>
          </div>
          
          <Link
            href="/register"
            className="px-6 py-2 rounded-full border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Register
          </Link>
        </div>

        {/* Main Columns */}
        <div className="flex flex-col lg:flex-row flex-1 px-6 lg:px-16 py-8">
          
          {/* Left Side: Form */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center max-w-md mx-auto lg:mx-0 lg:pr-8">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <h2 className="text-[22px] font-bold text-[#2A2B42]">
                Login to your account
              </h2>
              
              <div className="flex items-center gap-2 lg:gap-3">
                <span className="text-xs text-gray-400 font-medium">Login with</span>
                <div className="flex gap-2">
                  <button type="button" className="w-7 h-7 bg-gray-100 rounded-full text-gray-500 flex items-center justify-center hover:bg-gray-200 hover:text-gray-700 transition">
                    <Facebook className="w-3.5 h-3.5 fill-current border-none" />
                  </button>
                  <button type="button" className="w-7 h-7 bg-gray-100 rounded-full text-gray-500 flex items-center justify-center hover:bg-gray-200 hover:text-gray-700 transition">
                    <GoogleIcon className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" className="w-7 h-7 bg-gray-100 rounded-full text-gray-500 flex items-center justify-center hover:bg-gray-200 hover:text-gray-700 transition">
                    <Linkedin className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  id="login-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your username"
                  required
                  className="w-full px-6 py-[18px] bg-[#F8F9FB] border border-transparent rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7B46F1] focus:bg-white focus:border-[#7B46F1]/20 placeholder-gray-400 transition-all font-medium text-sm"
                />
              </div>

              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full px-6 py-[18px] bg-[#F8F9FB] border border-transparent rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7B46F1] focus:bg-white focus:border-[#7B46F1]/20 placeholder-gray-400 transition-all font-medium text-sm pr-14"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-6 gap-6">
                <Link href="#" className="text-sm font-medium text-gray-400 hover:text-[#7B46F1] transition-colors ml-2">
                  Forgot password?
                </Link>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-10 py-3.5 rounded-full bg-[#6A3EEA] text-white font-medium hover:bg-[#5a33c8] hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-70 disabled:hover:shadow-none min-w-[120px]"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                  ) : (
                    "Log In"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Side: Illustration (Hidden on small screens) */}
          <div className="hidden lg:flex w-1/2 items-center justify-center relative pl-8">
            <div className="relative w-full max-w-[450px] aspect-square flex items-center justify-center">
               <svg viewBox="0 0 500 500" width="100%" height="100%" className="relative z-10" fill="none">
                 {/* Calendar Base */}
                 <rect x="230" y="160" width="220" height="150" rx="10" fill="#E8F0FE" stroke="#B3CDE0" strokeWidth="4" />
                 <path d="M240 190h200v2H240zM240 220h200v2H240zM240 250h200v2H240zM240 280h200v2H240z" fill="#B3CDE0" />
                 {/* Calendar Rings */}
                 <circle cx="260" cy="150" r="8" fill="#5E72E4" />
                 <circle cx="310" cy="150" r="8" fill="#5E72E4" />
                 <circle cx="360" cy="150" r="8" fill="#5E72E4" />
                 <circle cx="410" cy="150" r="8" fill="#5E72E4" />
                 {/* Calendar marked circle */}
                 <circle cx="350" cy="225" r="30" stroke="#FF5470" strokeWidth="6" fill="none" />
                 <path d="M340 225l10 10 20-20" stroke="#FF5470" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />

                 {/* Laptop base */}
                 <rect x="80" y="270" width="220" height="130" rx="5" fill="#11CDEF" opacity="0.1" />
                 <path d="M70 400h240l20 30H50l20-30z" fill="#DCE5ED" />
                 <rect x="90" y="415" width="200" height="8" rx="2" fill="#fff" opacity="0.7" />
                 <path d="M90 280h200v120H90z" fill="#fff" />
                 
                 {/* Laptop grid/keys */}
                 <rect x="110" y="300" width="160" height="80" rx="3" fill="#2A2B42" opacity="0.9" />

                 {/* Abstract human figure sitting */}
                 <path d="M150 250v-40a20 20 0 0140 0v40" stroke="#5E72E4" strokeWidth="15" strokeLinecap="round" />
                 <circle cx="170" cy="180" r="25" fill="#FFC0A0" />
                 <path d="M140 220h60a10 10 0 0110 10v60H130v-60a10 10 0 0110-10z" fill="#5E72E4" />

                 {/* Scattered decorative bits */}
                 <rect x="100" y="100" width="15" height="15" fill="#11CDEF" transform="rotate(45 100 100)" />
                 <rect x="420" y="370" width="20" height="20" fill="#2DCE89" transform="rotate(15 420 370)" />
                 <circle cx="60" cy="250" r="5" fill="#FF5470" />
                 
                 {/* Extra text bubbles */}
                 <rect x="360" y="100" width="45" height="25" rx="12" fill="#2DCE89" />
                 <circle cx="372" cy="112.5" r="3" fill="#fff" />
                 <circle cx="382" cy="112.5" r="3" fill="#fff" />
                 <circle cx="392" cy="112.5" r="3" fill="#fff" />
               </svg>
            </div>
          </div>
        </div>

        {/* Footer inside Card */}
        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-between px-6 lg:px-10 py-6 text-[13px] text-gray-400 mt-auto bg-white border-t border-gray-50">
          <div className="mb-4 sm:mb-0">
            <span className="mr-2">© Copyright ExamApp 2026</span>
          </div>
          <div className="flex items-center gap-6 font-medium">
            <Link href="#" className="hover:text-gray-600 transition-colors">Term & Condition</Link>
            <Link href="#" className="hover:text-gray-600 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-gray-600 transition-colors">Help</Link>
          </div>
          <div className="hidden sm:flex items-center gap-2 mt-4 sm:mt-0">
            <span className="w-2 h-2 rounded-full bg-[#7B46F1]"></span>
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span className="w-2 h-2 rounded-full bg-gray-300"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
