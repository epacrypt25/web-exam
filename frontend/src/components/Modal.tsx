"use client";

import { useState, FormEvent } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative glass rounded-2xl p-6 w-full max-w-md animate-slide-up mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#2B3674]">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  isTextarea?: boolean;
}

export function FormField({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  isTextarea = false,
}: FormFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-bold text-gray-500 mb-2"
      >
        {label}
      </label>
      {isTextarea ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          rows={3}
          className="input-field resize-none"
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="input-field"
        />
      )}
    </div>
  );
}
