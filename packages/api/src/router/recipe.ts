import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { desc, eq } from "@bite/db";
import { Ingredients, Recipes, StepImages, Steps } from "@bite/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";
import { CreateRecipeSchema } from "../types";

export const recipeRouter = {
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.Recipes.findMany({
      orderBy: desc(Recipes.id),
      limit: 10,
    });
  }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.Recipes.findFirst({
        where: eq(Recipes.id, input.id),
      });
    }),
  create: protectedProcedure
    .input(CreateRecipeSchema)
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session;

      let userId;

      if (!user.id) {
        userId = input.userId;
      } else {
        userId = user.id;
      }

      if (!userId) {
        throw new Error("User ID is required to create a recipe");
      }

      try {
        // Iniciar transacción
        return await ctx.db.transaction(async (tx) => {
          // 1. Crear la receta principal
          const [recipe] = await tx
            .insert(Recipes)
            .values({
              title: input.title,
              description: input.description,
              coverImage: input.coverImage,
              cookTime: input.cookTime,
              serving: input.serving,
              origin: input.origin,
              categoryId: input.categoryId,
              userId,
              isPublished: false,
            })
            .returning();

          if (!recipe) {
            throw new Error("Failed to create recipe");
          }

          // 2. Insertar ingredientes
          if (input.ingredients.length > 0) {
            await tx.insert(Ingredients).values(
              input.ingredients.map((ingredient, index) => ({
                recipeId: recipe.id,
                name: ingredient.name,
                order: ingredient.order || index,
              })),
            );
          }

          // 3. Insertar pasos con sus imágenes
          if (input.steps.length > 0) {
            for (const [index, step] of input.steps.entries()) {
              // Insertar el paso
              const [insertedStep] = await tx
                .insert(Steps)
                .values({
                  recipeId: recipe.id,
                  instruction: step.instruction,
                  order: step.order || index,
                })
                .returning();

              if (!insertedStep) {
                throw new Error("Failed to create recipe");
              }

              // Insertar imágenes del paso si existen
              if (step.images && step.images.length > 0) {
                await tx.insert(StepImages).values(
                  step.images.map((imageUrl) => ({
                    stepId: insertedStep.id,
                    imageUrl: imageUrl,
                  })),
                );
              }
            }
          }

          return recipe;
        });
      } catch (error) {
        console.error("Error creating recipe:", error);
        throw new Error("Failed to create recipe");
      }
    }),

  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.delete(Recipes).where(eq(Recipes.id, input));
  }),
} satisfies TRPCRouterRecord;
