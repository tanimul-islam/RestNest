import { z } from "zod";

const registerUserValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "Name is required"
            : "Name must be a string",
      })
      .min(2, {
        error: "Name must be at least 2 characters long",
      }),

    email: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "Email is required"
            : "Email must be a string",
      })
      .email({
        error: "Please provide a valid email address",
      }),

    password: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "Password is required"
            : "Password must be a string",
      })
      .min(8, {
        error: "Password must be at least 8 characters long",
      }),

    role: z.enum(["TENANT", "LANDLORD"], {
      error: (issue) =>
        issue.input === undefined
          ? "Role is required"
          : "Role must be TENANT or LANDLORD",
    }),
  }),
});
const loginUserValidationSchema = z.object({
  body: z.object({
    email: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "Email is required"
            : "Email must be a string",
      })
      .email({
        error: "Please provide a valid email address",
      }),

    password: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "Password is required"
            : "Password must be a string",
      })
      .min(8, {
        error: "Password must be at least 8 characters long",
      }),
  }),
});

export const AuthValidation = {
  registerUserValidationSchema,
  loginUserValidationSchema,
};
