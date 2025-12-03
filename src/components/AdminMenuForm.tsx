"use client";
import { useRef } from "react";
import { z } from "zod";
import { useZodFormValidation } from "@/lib/hooks/useZodFormValidation";
import type { MenuItem } from "@/lib/types/menu";

type Props = {
  existingSlugs: string[];
  categories: string[];
  onSubmit: (item: Omit<MenuItem, "id">) => void;
  pending?: boolean;
  className?: string;
};

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

export default function AdminMenuForm({ existingSlugs, categories, onSubmit, pending = false, className = "" }: Props) {
  const nameRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);

  const schema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    price: z.number().positive("Price must be positive"),
    image: z.string().url("Invalid URL").optional(),
    category: z.string().min(1, "Category is required"),
    tags: z.string().optional(),
    slug: z.string().min(1, "Slug is required").refine((v) => !existingSlugs.includes(v), { message: "Slug already exists" }),
    popularity: z.number().min(0).max(100).optional(),
  });

  const { values, setValue, errors, attempted, validateField, submit } = useZodFormValidation(schema, {
    name: "",
    description: "",
    price: 0,
    image: "",
    category: categories[0] || "",
    tags: "",
    slug: "",
    popularity: 0,
  });

  const handleNameChange = (v: string) => {
    setValue("name", v);
    const s = slugify(v);
    setValue("slug", s);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit(() => {
      const item: Omit<MenuItem, "id"> = {
        slug: values.slug,
        name: values.name,
        description: values.description,
        price: values.price,
        image: values.image || "",
        category: values.category,
        tags: (values.tags || "").split(",").map((t) => t.trim()).filter(Boolean),
        popularity: typeof values.popularity === "number" ? values.popularity : 0,
      } as any;
      onSubmit(item);
    });
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-3 rounded-md border border-white/10 bg-zinc-900/50 p-3 sm:p-4 ${className}`}>
      {attempted && (errors.name || errors.description || errors.price || errors.category || errors.slug) && (
        <div className="rounded-md border border-red-400 bg-red-600/20 text-red-200 px-3 py-2 text-sm">Please fix the highlighted fields.</div>
      )}
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          type="text"
          value={values.name || ""}
          onChange={(e) => handleNameChange(e.target.value)}
          onBlur={() => validateField("name")}
          ref={nameRef}
          className={`mt-1 w-full rounded-md bg-black border px-3 py-2 text-white placeholder-zinc-500 ${errors.name ? "border-red-400" : "border-white/20"}`}
          placeholder="Menu name"
        />
        {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">Slug</label>
        <input
          type="text"
          value={values.slug || ""}
          onChange={(e) => setValue("slug", e.target.value)}
          onBlur={() => validateField("slug")}
          className={`mt-1 w-full rounded-md bg-black border px-3 py-2 text-white ${errors.slug ? "border-red-400" : "border-white/20"}`}
          placeholder="unique-slug"
        />
        {errors.slug && <p className="mt-1 text-xs text-red-400">{errors.slug}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          value={values.description || ""}
          onChange={(e) => setValue("description", e.target.value)}
          onBlur={() => validateField("description")}
          className={`mt-1 w-full rounded-md bg-black border px-3 py-2 text-white ${errors.description ? "border-red-400" : "border-white/20"}`}
          placeholder="Describe the item"
          rows={3}
        />
        {errors.description && <p className="mt-1 text-xs text-red-400">{errors.description}</p>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium">Price</label>
          <input
            type="number"
            step="0.5"
            value={typeof values.price === "number" ? values.price : 0}
            onChange={(e) => setValue("price", Number(e.target.value))}
            onBlur={() => validateField("price")}
            ref={priceRef}
            className={`mt-1 w-full rounded-md bg-black border px-3 py-2 text-white ${errors.price ? "border-red-400" : "border-white/20"}`}
            placeholder="0"
          />
          {errors.price && <p className="mt-1 text-xs text-red-400">{errors.price}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            value={values.category || ""}
            onChange={(e) => setValue("category", e.target.value)}
            onBlur={() => validateField("category")}
            className={`mt-1 w-full rounded-md bg-black border px-3 py-2 text-white ${errors.category ? "border-red-400" : "border-white/20"}`}
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
            {!categories.length && <option value="">Select category</option>}
          </select>
          {errors.category && <p className="mt-1 text-xs text-red-400">{errors.category}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium">Image URL</label>
        <input
          type="url"
          value={values.image || ""}
          onChange={(e) => setValue("image", e.target.value)}
          className="mt-1 w-full rounded-md bg-black border border-white/20 px-3 py-2 text-white"
          placeholder="https://..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Tags (comma-separated)</label>
        <input
          type="text"
          value={values.tags || ""}
          onChange={(e) => setValue("tags", e.target.value)}
          className="mt-1 w-full rounded-md bg-black border border-white/20 px-3 py-2 text-white"
          placeholder="spicy, vegetarian"
        />
      </div>
      <div className="flex items-center justify-end gap-2">
        <button type="submit" disabled={pending} className="rounded-md bg-white text-black px-3 py-2 text-sm font-medium disabled:opacity-60">Create</button>
      </div>
    </form>
  );
}

