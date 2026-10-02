"use client";

import { Suspense, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { login } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError } from "@/components/ui/field";
import { useSearchParams } from "next/navigation";
import { toSafeCallbackUrl } from "@/lib/utils";
import Link from "next/link";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Signing in..." : "Sign in"}
    </Button>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = toSafeCallbackUrl(searchParams.get("callbackUrl"));
  const [errorMessage, formAction] = useActionState(login, undefined);

  return (
    <Card className="max-w-sm mx-auto mt-20">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="redirectTo" value={callbackUrl} />

          <Field>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="email" />
          </Field>

          <Field>
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" autoComplete="current-password" />
          </Field>

          {errorMessage && <FieldError>{errorMessage}</FieldError>}

          <SubmitButton />
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-sm">
          New to The Chronicle?
          <Button variant="link" size="sm" className="h-auto p-0 ml-1 align-baseline" asChild>
            <Link href="/register">Create an account</Link>
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}