import { z } from "zod";

const createPropertyValidationSchema = z.object({
  body: z.object({
    title: z
      .string({
        error: "Title is required",
      })
      .min(3, "Title must be at least 3 characters"),

    description: z
      .string({
        error: "Description is required",
      })
      .min(10, "Description must be at least 10 characters"),

    address: z.string({
      error: "Address is required",
    }),

    city: z.string({
      error: "City is required",
    }),

    price: z
      .number({
        error: "Rent must be a number",
      })
      .positive("Rent must be greater than 0"),

    area: z
      .number({
        error: "Area  must be a number",
      })
      .positive("Area must be greater than 0"),

    bedrooms: z
      .number({
        error: "Bedrooms must be a number",
      })
      .int()
      .min(0),

    bathrooms: z
      .number({
        error: "Bathrooms must be a number",
      })
      .int()
      .min(1),

    categoryId: z.string({
      error: "Category is required",
    }),
  }),
});

const getPropertyValidationSchema = z.object({
  query: z
    .object({
      location: z.string().optional(),

      minPrice: z.coerce
        .number()
        .positive("Minimum price can't be less than 0")
        .optional(),

      maxPrice: z.coerce
        .number()
        .positive("maximum price can't be less than 0")
        .optional(),
      type: z.string().optional(),
    })
    .refine(
      (data) => {
        if (data.minPrice !== undefined && data.maxPrice !== undefined) {
          return data.minPrice <= data.maxPrice;
        }
        return true;
      },
      {
        message: "Minimum price can't be greater than maximum price",
      },
    ),
});

export const PropertyValidation = {
  createPropertyValidationSchema,
  getPropertyValidationSchema,
};
