"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";
import postgres from 'postgres';
import { getUser } from "@/lib/db";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const RegisterSchema = z.object({
  name: z.string().min(4, "Name must be at least 4 characters"),
  email: z.email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(28, "Password must be less than 28 characters"),
  confirmPassword: z.string(),
});

export type RegisterState = {
  errors?: {
    name?: { errors: string[]; };
    email?: { errors: string[]; };
    password?: { errors: string[]; };
    confirmPassword?: { errors: string[]; };
  };
};

export async function register(prevState: RegisterState, formData: FormData): Promise<RegisterState> {
  const validatedFields = RegisterSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validatedFields.success) {
    return { errors: z.treeifyError(validatedFields.error).properties };
  }

  const { name, email, password, confirmPassword} = validatedFields.data;

  if (password !== confirmPassword)
    return { errors: { password: { errors: ["The passwords do not match"] }, confirmPassword: { errors: ["The passwords do not match"] }}};

  const existingUser = await getUser(email);
  if (existingUser)
    return { errors: { email: { errors: ["Email already registered"] }}};

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = { name, email, password_hash: passwordHash };

  await sql`
    INSERT INTO users ${sql(newUser)}
  `;

  // Optional: auto sign-in right after registration instead of redirecting to /login
  await signIn("credentials", { email, password, redirect: false });

  redirect("/");
}

export async function login(prevState: string | undefined, formData: FormData): Promise<string | undefined> {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid email or password";
        default:
          return "Something went wrong. Please try again.";
      }
    }
    // Re-throw so Next.js can handle the redirect on success
    throw error;
  }
}