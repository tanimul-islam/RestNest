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

const getPropertyByIdValidationSchema = z.object({
  params: z.object({
    id: z.uuid("Invalid Property Id"),
  }),
});

const updatePropertyValidationSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid property ID"),
  }),

  body: z.object({
    title: z.string().min(3, "Title must be at least 3 characters").optional(),

    description: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .optional(),

    price: z.number().positive("Price must be greater than 0").optional(),

    area: z.number().positive("Area must be greater than 0").optional(),

    address: z.string().min(1, "Address cannot be empty").optional(),

    city: z.string().min(1, "City cannot be empty").optional(),

    bedrooms: z.number().int().min(0, "Bedrooms cannot be negative").optional(),

    bathrooms: z
      .number()
      .int()
      .min(1, "Bathrooms must be at least 1")
      .optional(),

    categoryId: z.string().uuid("Invalid category ID").optional(),
  }),
});

const deletePropertyValidationSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid property ID"),
  }),
});

export const PropertyValidation = {
  createPropertyValidationSchema,
  getPropertyValidationSchema,
  getPropertyByIdValidationSchema,
  updatePropertyValidationSchema,
  deletePropertyValidationSchema,
};
