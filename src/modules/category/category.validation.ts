import { z } from "zod";

const createCategoryValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        error: "Category name is required",
      })
      .min(2, "Category name must be at least 2 characters long"),

    description: z.string().optional(),
  }),
});

export const CategoryValidation = {
  createCategoryValidationSchema,
};
