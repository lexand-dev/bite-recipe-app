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
      if (!input.userId) {
        throw new Error("User ID is required to create a recipe");
      }

      try {
        // 1. Create the recipe
        const [recipe] = await ctx.db
          .insert(Recipes)
          .values({
            title: input.title,
            description: input.description,
            coverImage: input.coverImage,
            cookTime: input.cookTime,
            serving: input.serving,
            origin: input.origin,
            categoryId: input.categoryId,
            userId: input.userId,
            isPublished: false,
          })
          .returning({
            id: Recipes.id,
          });

        if (!recipe?.id) {
          throw new Error("Failed to create recipe");
        }

        if (input.ingredients.length === 0) {
          throw new Error("At least one ingredient is required");
        }

        // 2. Insert ingredients
        const createIngredients = await ctx.db.insert(Ingredients).values(
          input.ingredients.map((ingredient, index) => ({
            recipeId: recipe.id,
            name: ingredient.name,
            order: ingredient.order || index,
          })),
        );

        // 3. Insert steps and step images
        const stepPromises = input.steps.map(async (step, index) => {
          const [createdStep] = await ctx.db
            .insert(Steps)
            .values({
              instruction: step.instruction,
              recipeId: recipe.id,
              order: step.order || index,
            })
            .returning({ id: Steps.id });

          if (!createdStep?.id) {
            throw new Error("Failed to create step");
          }

          if (step.images && step.images.length > 0) {
            await ctx.db.insert(StepImages).values(
              step.images.map((image) => ({
                stepId: createdStep.id,
                imageUrl: image,
              })),
            );
          }
        });

        await Promise.all([createIngredients, stepPromises]);
      } catch (error) {
        console.error("Error creating recipe:", error);
        throw new Error("Failed to create recipe");
      }
    }),

  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.delete(Recipes).where(eq(Recipes.id, input));
  }),
} satisfies TRPCRouterRecord;
