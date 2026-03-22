"use client";

import { useState, useEffect, useCallback } from "react";
import { API_CLASS } from "@/lib/api";
import { Class, CreateClassRequest } from "@/lib/types";

export function useClasses() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClasses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await API_CLASS.get("/classes");
      setClasses(res.data || []);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch classes");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createClass = async (data: CreateClassRequest) => {
    const res = await API_CLASS.post("/classes", data);
    await fetchClasses();
    return res.data;
  };

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  return { classes, isLoading, error, fetchClasses, createClass };
}
