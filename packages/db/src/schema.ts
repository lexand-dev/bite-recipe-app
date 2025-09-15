import { sql } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

import { user } from "./auth-schema";

/* ========== CATEGORIES ========== */
export const Categories = pgTable("categories", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  name: t.varchar({ length: 128 }).notNull().unique(),
  description: t.text(),
}));

export const CreateCategorySchema = createInsertSchema(Categories, {
  name: z.string().max(128),
}).omit({ id: true });

/* ========== RECIPES ========== */
export const Recipes = pgTable("recipes", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  title: t.varchar({ length: 256 }).notNull(),
  description: t.text().notNull(),
  coverImage: t.varchar({ length: 512 }),
  cookTime: t.text(),
  serving: t.text(),
  origin: t.text(),
  userId: t
    .text()
    .notNull()
    .references(() => user.id),
  categoryId: t.uuid().references(() => Categories.id),
  isPublished: t.boolean().default(false).notNull(),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
}));

export const CreateRecipeSchema = createInsertSchema(Recipes, {
  title: z.string().max(256),
  description: z.string(),
  coverImage: z.string().optional(),
  userId: z.string().min(1),
  categoryId: z.string().optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  isPublished: true,
});

/* ========== INGREDIENTS ========== */
export const Ingredients = pgTable("ingredients", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  recipeId: t
    .uuid()
    .notNull()
    .references(() => Recipes.id),
  name: t.varchar({ length: 128 }).notNull(),
  order: t.integer().notNull(), // Order of the ingredient in the list
}));

export const CreateIngredientSchema = createInsertSchema(Ingredients, {
  name: z.string().max(128),
}).omit({ id: true });

/* ========== STEPS ========== */
export const Steps = pgTable("steps", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  recipeId: t
    .uuid()
    .notNull()
    .references(() => Recipes.id),
  stepNumber: t.integer().notNull(),
  instruction: t.text().notNull(),
}));

export const CreateStepSchema = createInsertSchema(Steps, {
  instruction: z.string(),
  stepNumber: z.number().min(1),
}).omit({ id: true });

/* ========== COMMENTS ========== */
export const Comments = pgTable("comments", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  recipeId: t
    .uuid()
    .notNull()
    .references(() => Recipes.id),
  userId: t
    .text()
    .notNull()
    .references(() => user.id),
  content: t.text().notNull(),
  createdAt: t.timestamp().defaultNow().notNull(),
}));

export const CreateCommentSchema = createInsertSchema(Comments, {
  content: z.string().max(512),
}).omit({ id: true, createdAt: true });

/* ========== BOOKMARKS ========== */
export const Bookmarks = pgTable("bookmarks", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  userId: t
    .text()
    .notNull()
    .references(() => user.id),
  recipeId: t
    .uuid()
    .notNull()
    .references(() => Recipes.id),
  createdAt: t.timestamp().defaultNow().notNull(),
}));

export const CreateBookmarkSchema = createInsertSchema(Bookmarks, {}).omit({
  id: true,
  createdAt: true,
});

/* ========== LIKES ========== */
export const Likes = pgTable("likes", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  userId: t
    .text()
    .notNull()
    .references(() => user.id),
  recipeId: t
    .uuid()
    .notNull()
    .references(() => Recipes.id),
  createdAt: t.timestamp().defaultNow().notNull(),
}));

export const CreateLikeSchema = createInsertSchema(Likes, {}).omit({
  id: true,
  createdAt: true,
});

export * from "./auth-schema";
