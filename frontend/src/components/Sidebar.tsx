"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  LogOut,
  GraduationCap,
  ChevronRight,
  X
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Classes",
    href: "/dashboard/classes",
    icon: BookOpen,
  },
  {
    label: "Exams",
    href: "/dashboard/exams",
    icon: FileText,
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div 
        className={`lg:hidden fixed inset-0 z-40 bg-[#2B3674]/20 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} 
        onClick={onClose} 
        aria-hidden="true"
      />

      {/* Sidebar Drawer */}
      <aside className={`
        fixed top-0 left-0 h-screen w-72 bg-white border-r border-gray-100 flex flex-col z-50
        transform transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Logo Section */}
        <div className="flex items-center justify-between px-6 py-8">
          <Link href="/dashboard" className="flex items-center gap-3 group" onClick={onClose}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8A50F5] to-[#7B46F1] flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-[#2B3674] tracking-tight">ExamApp</h1>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Dashboard</p>
            </div>
          </Link>
          <button 
            onClick={onClose} 
            className="lg:hidden p-2 text-gray-400 hover:text-[#7B46F1] rounded-xl hover:bg-purple-50 transition-colors focus:ring-2 focus:ring-[#7B46F1]/20"
            aria-label="Close Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2 mt-2 overflow-y-auto">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-4">
            Main Menu
          </p>
          {navItems.map((item) => {
            if (item.label === "Classes" && user?.role === "user") return null;

            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold
                  transition-all duration-300 group relative overflow-hidden
                  ${
                    isActive
                      ? "bg-[#7B46F1] text-white shadow-md shadow-purple-500/20 scale-[1.02]"
                      : "text-gray-500 hover:text-[#7B46F1] hover:bg-purple-50"
                  }
                `}
              >
                <item.icon
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isActive ? "text-white scale-110" : "text-gray-400 group-hover:text-[#7B46F1]"
                  }`}
                />
                <span>{item.label}</span>
                {isActive && (
                  <ChevronRight className="w-4 h-4 ml-auto text-white/70" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 mt-auto">
          <div className="bg-[#F8F9FB] rounded-2xl p-4 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#8A50F5]/5 to-[#7B46F1]/5 rounded-bl-[100px]" />
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8A50F5] to-[#7B46F1] flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-purple-500/20">
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-extrabold text-[#2B3674] truncate">
                  {user?.username || "User"}
                </p>
                <p className="text-xs text-[#7B46F1] font-bold uppercase tracking-wider mt-0.5">
                  {user?.role || "member"}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                logout();
              }}
              className="w-full relative z-10 flex items-center justify-center gap-2 px-3 py-3 rounded-xl
                         text-sm font-bold text-gray-500 hover:text-white hover:bg-red-500 hover:shadow-md hover:shadow-red-500/20
                         transition-all duration-300 border border-gray-200 hover:border-transparent bg-white"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
