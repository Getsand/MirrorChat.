import { z } from "zod";

export const signInSchema = z.object({
    email: z.string().nonempty("Email is required"), // Ensures email is provided
    password: z.string().nonempty("Password is required"), // Ensures password is provided
});
