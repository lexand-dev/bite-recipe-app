import { z } from "zod/v4";

export const CreateRecipeSchema = z.object({
  title: z.string().min(1, "El título es requerido").max(256),
  description: z.string().min(1, "La descripción es requerida"),
  coverImage: z.string().optional(),
  cookTime: z.string().optional(),
  serving: z.string().optional(),
  origin: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  ingredients: z.array(
    z.object({
      name: z.string().min(1, "El nombre del ingrediente es requerido"),
      order: z.number(),
    }),
  ),
  steps: z.array(
    z.object({
      instruction: z.string().min(1, "La instrucción es requerida"),
      order: z.number(),
      images: z.array(z.string()).optional(), // URLs de imágenes
    }),
  ),
});

export type CreateRecipeInput = z.infer<typeof CreateRecipeSchema>;

export interface ImageToUpload {
  id: string;
  uri: string;
  stepIndex?: number;
  type: "cover" | "step";
  isUploading?: boolean;
  uploadedUrl?: string;
  error?: string;
}
