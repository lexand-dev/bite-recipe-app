import { create } from "zustand";

import type { ImageToUpload } from "../types";

interface RecipeImageStore {
  images: ImageToUpload[];
  addImage: (image: Omit<ImageToUpload, "id">) => void;
  removeImage: (id: string) => void;
  updateImage: (id: string, updates: Partial<ImageToUpload>) => void;
  clearImages: () => void;
  getImagesByType: (type: "cover" | "step") => ImageToUpload[];
  getImagesForStep: (stepIndex: number) => ImageToUpload[];
}

export const useRecipeImageStore = create<RecipeImageStore>((set, get) => ({
  images: [],

  addImage: (image) => {
    const newImage: ImageToUpload = {
      ...image,
      id: `${Date.now()}_${Math.random()}`,
    };
    set((state) => ({ images: [...state.images, newImage] }));
  },

  removeImage: (id) => {
    set((state) => ({
      images: state.images.filter((img) => img.id !== id),
    }));
  },

  updateImage: (id, updates) => {
    set((state) => ({
      images: state.images.map((img) =>
        img.id === id ? { ...img, ...updates } : img,
      ),
    }));
  },

  clearImages: () => set({ images: [] }),

  getImagesByType: (type) => {
    return get().images.filter((img) => img.type === type);
  },

  getImagesForStep: (stepIndex) => {
    return get().images.filter(
      (img) => img.type === "step" && img.stepIndex === stepIndex,
    );
  },
}));
