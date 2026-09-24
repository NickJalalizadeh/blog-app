"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";
import postgres from 'postgres';
import { getUser } from "@/lib/db";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// ---------- Registration ----------

const RegisterSchema = z.object({
  name: z.string().min(5, "Name must be at least 5 characters."),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type RegisterState = {
  errors?: {
    name?: { errors: string[]; };
    email?: { errors: string[]; };
    password?: { errors: string[]; };
  };
};

export async function register(prevState: RegisterState, formData: FormData): Promise<RegisterState> {
  const validatedFields = RegisterSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return { errors: z.treeifyError(validatedFields.error).properties };
  }

  const { name, email, password} = validatedFields.data;

  const existingUser = await getUser(email);
  if (existingUser) {
    return { errors: { email: { errors: ["Email already registered"] } } };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = { name, email, password_hash: passwordHash };

  await sql`
    INSERT INTO users ${sql(newUser)}
  `;

  // Optional: auto sign-in right after registration instead of redirecting to /login
  // await signIn("credentials", { email, password, redirect: false });

  redirect("/login");
}

// ---------- Login ----------

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