import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "ExamApp — Modern Exam Management",
  description:
    "A premium exam management platform with class management and user profiles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#1e293b",
                color: "#f1f5f9",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
