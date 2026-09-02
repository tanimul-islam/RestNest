import { z } from "zod";

const createRentalRequestSchema = z.object({
  body: z.object({
    propertyId: z.string().uuid(),

    totalAmount: z.coerce
      .number()
      .positive("Total amount must be greater than 0"),

    moveInDate: z.coerce.date().optional(),

    durationMonths: z.coerce
      .number()
      .int("Duration must be a whole number")
      .positive("Duration must be greater than 0")
      .optional(),

    message: z.string().optional(),
  }),
});

export const RentalValidation = {
  createRentalRequestSchema,
};
