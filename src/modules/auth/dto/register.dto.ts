import { z } from "zod";
import { roleDto } from "./fields/role.dto";

export const registerUserSchema = z.object({
  fullName: z
    .string({
      required_error: "Full name is required",
      invalid_type_error: "Full name must be a string",
    })
    .min(4, "Full name cannot be less than 4 chars long"),

  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email("Invalid email format"),

  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\[\]{};':"\\|,.<>/?-]).+$/,
      "Password must include uppercase, lowercase, number, and special character"
    ),
  role: roleDto.optional(),
});

export const registerUserRequestSchema = z.object({
  body: registerUserSchema,
});

export type RegisterUserDto = z.infer<typeof registerUserSchema>;
