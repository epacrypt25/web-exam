"use client";

import { useAuth } from "@/context/AuthContext";
import { BookOpen, FileText, User, Calendar, Shield, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();

  const stats = [
    {
      label: "Username",
      value: user?.username || "—",
      icon: User,
      gradient: "from-[#8A50F5] to-[#7B46F1]",
    },
    {
      label: "Role",
      value: user?.role || "—",
      icon: Shield,
      gradient: "from-cyan-400 to-blue-500",
    },
    {
      label: "Joined",
      value: user?.created_at
        ? new Date(user.created_at).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "—",
      icon: Calendar,
      gradient: "from-emerald-400 to-teal-500",
    },
  ];

  const quickLinks = [
    {
      title: "Manage Classes",
      description: "View and create class sections",
      icon: BookOpen,
      href: "/dashboard/classes",
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      title: "Manage Exams",
      description: "View and create exams for each class",
      icon: FileText,
      href: "/dashboard/exams",
      color: "text-[#7B46F1]",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      
      {/* Interactive Top Banner with Illustration */}
      <div className="relative w-full h-auto sm:h-64 rounded-3xl bg-gradient-to-r from-[#8A50F5] to-[#7B46F1] overflow-hidden shadow-lg flex items-center p-8 sm:p-12 mb-8 border border-purple-400">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-400/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
        
        {/* Left Content */}
        <div className="relative z-10 w-full sm:w-3/5">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white mb-3 leading-tight">
            Hello, {user?.username || "User"} 👋
          </h1>
          <p className="text-white/80 text-lg max-w-md font-medium">
            Welcome to your new dashboard. Ready to manage your classes and excel in your exams today?
          </p>
        </div>

        {/* Right Content - SVG Character (hidden on smaller screens) */}
        <div className="hidden sm:block absolute right-0 bottom-0 w-[400px] h-[300px]">
          <svg viewBox="0 0 500 500" width="100%" height="100%" fill="none" className="translate-y-4">
             {/* Character / Dashboard Isometric Illustration similar to login */}
             {/* Desk */}
             <path d="M100 400h380v20H100z" fill="#DCE5ED" opacity="0.4" />
             <path d="M120 420h340v80H120z" fill="#B3CDE0" opacity="0.3" />
             
             {/* Main Dashboard UI Panel Floating */}
             <rect x="250" y="100" width="220" height="150" rx="10" fill="#fff" opacity="0.95" />
             <circle cx="280" cy="130" r="15" fill="#7B46F1" opacity="0.2" />
             <circle cx="280" cy="130" r="6" fill="#7B46F1" />
             <rect x="310" y="125" width="100" height="10" rx="5" fill="#F4F7FE" />
             <rect x="270" y="160" width="180" height="70" rx="5" fill="#F4F7FE" />
             <path d="M280 210l30-20 20 10 40-30 40 20" stroke="#2DCE89" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
             
             {/* Character */}
             <circle cx="180" cy="220" r="35" fill="#FFC0A0" />
             <path d="M130 300h100a20 20 0 0120 20v100H110V320a20 20 0 0120-20z" fill="#11CDEF" opacity="0.9" />
             
             <path d="M110 310l40 60M250 310l-40 60" stroke="#11CDEF" strokeWidth="20" strokeLinecap="round" />
             
             {/* Laptop on desk */}
             <rect x="190" y="320" width="120" height="80" rx="5" fill="#2A2B42" />
             <rect x="200" y="330" width="100" height="60" rx="2" fill="#fff" opacity="0.9" />
             <rect x="180" y="400" width="140" height="10" rx="2" fill="#DCE5ED" />

             {/* Smaller Floating bits */}
             <rect x="80" y="150" width="60" height="80" rx="10" fill="#FF5470" />
             <circle cx="110" cy="190" r="15" fill="#fff" opacity="0.9" />
             <circle cx="430" cy="80" r="8" fill="#FFC0A0" />
             <rect x="380" y="300" width="50" height="50" rx="10" fill="#2DCE89" transform="rotate(15 380 300)" />
          </svg>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="card group hover:-translate-y-1 transition-transform duration-300 border border-gray-100"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-md shadow-gray-200 group-hover:scale-110 transition-transform duration-300`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-sm font-bold text-gray-400 mb-1">{stat.label}</p>
            <p className="text-2xl font-extrabold text-[#2B3674] capitalize">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="pt-4">
        <h2 className="text-xl font-bold text-[#2B3674] mb-5">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickLinks.map((link, i) => (
            <a
              key={link.title}
              href={link.href}
              className="card group hover:-translate-y-1 hover:border-[#7B46F1]/30 hover:shadow-lg transition-all duration-300 flex items-start gap-5 border border-gray-100"
              style={{ animationDelay: `${i * 100 + 300}ms` }}
            >
              <div className={`w-14 h-14 rounded-2xl ${link.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                <link.icon className={`w-7 h-7 ${link.color}`} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#2B3674] mb-1.5 group-hover:text-[#7B46F1] transition-colors">
                  {link.title}
                </h3>
                <p className="text-sm text-gray-500 font-medium">{link.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
