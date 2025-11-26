"use client";
import { useCallback, useMemo, useState } from "react";

export function useCategoryFilter(categories: string[], initial: string | null = null) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initial);
  const chips = useMemo(() => categories, [categories]);
  const selectAll = useCallback(() => setSelectedCategory(null), []);
  return { selectedCategory, setSelectedCategory, chips, selectAll };
}
