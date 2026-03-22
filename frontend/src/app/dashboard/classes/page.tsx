"use client";

import { useState } from "react";
import { useClasses } from "@/hooks/useClasses";
import { useAuth } from "@/context/AuthContext";
import { Modal, FormField } from "@/components/Modal";
import { Plus, BookOpen, Calendar, Loader2, AlertCircle, FolderOpen } from "lucide-react";
import toast from "react-hot-toast";

export default function ClassesPage() {
  const { classes, isLoading, error, createClass } = useClasses();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createClass({ name, description });
      toast.success("Class created successfully! 🎓");
      setIsModalOpen(false);
      setName("");
      setDescription("");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to create class");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#2B3674] mb-2">Classes</h1>
          <p className="text-gray-500">
            Manage your class sections and organize exams
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Class
          </button>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#7B46F1] animate-spin" />
        </div>
      ) : error ? (
        <div className="card flex items-center gap-4 text-red-400">
          <AlertCircle className="w-6 h-6 flex-shrink-0" />
          <p>{error}</p>
        </div>
      ) : classes.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-center border-transparent">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center mb-4">
            <FolderOpen className="w-8 h-8 text-[#7B46F1]" />
          </div>
          <h3 className="text-lg font-bold text-[#2B3674] mb-2">No classes yet</h3>
          <p className="text-gray-500 mb-6 max-w-sm font-medium">
            Create your first class to start organizing exams.
          </p>
          {isAdmin && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Class
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {classes.map((cls, i) => (
            <div
              key={cls.id}
              className="card group hover:-translate-y-1 hover:border-[#7B46F1]/30 hover:shadow-xl transition-all duration-300 border border-gray-100"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8A50F5] to-[#7B46F1] flex items-center justify-center shadow-md shadow-gray-200 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#2B3674] mb-2 group-hover:text-[#7B46F1] transition-colors">
                {cls.name}
              </h3>
              <p className="text-sm text-gray-500 font-medium mb-4 line-clamp-2">
                {cls.description || "No description"}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  {new Date(cls.created_at).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Class"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <FormField
            label="Class Name"
            id="class-name"
            value={name}
            onChange={setName}
            placeholder="e.g. Mathematics 101"
            required
          />
          <FormField
            label="Description"
            id="class-description"
            value={description}
            onChange={setDescription}
            placeholder="Brief description of the class..."
            isTextarea
          />
          <div className="flex gap-3 pt-2">
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
