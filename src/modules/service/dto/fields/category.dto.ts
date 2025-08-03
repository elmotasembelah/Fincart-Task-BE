import { z } from "zod";
import { Category } from "../../service.types";

export const categoryDto = z.nativeEnum(Category, {
  required_error: "Category is required",
  invalid_type_error: "Invalid category value",
});
