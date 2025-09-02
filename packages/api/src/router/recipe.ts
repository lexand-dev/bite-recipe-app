import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { desc, eq } from "@bite/db";
import { CreateRecipeSchema, Recipes } from "@bite/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";

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
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(Recipes).values(input);
    }),

  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.delete(Recipes).where(eq(Recipes.id, input));
  }),
} satisfies TRPCRouterRecord;
