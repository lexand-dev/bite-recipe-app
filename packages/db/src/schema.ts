import { sql } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";

import { user } from "./auth-schema";

/* ========== CATEGORIES ========== */
export const Categories = pgTable("categories", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  name: t.varchar({ length: 128 }).notNull().unique(),
  description: t.text(),
}));

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

/* ========== STEPS ========== */
export const Steps = pgTable("steps", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  recipeId: t
    .uuid()
    .notNull()
    .references(() => Recipes.id),
  order: t.integer().notNull(),
  instruction: t.text().notNull(),
}));

/* ========== STEP IMAGES ========== */
export const StepImages = pgTable("step_images", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  stepId: t
    .uuid()
    .notNull()
    .references(() => Steps.id),
  imageUrl: t.text().notNull(),
}));

export * from "./auth-schema";
