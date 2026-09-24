"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { register, RegisterState } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

const initialState: RegisterState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Creating account..." : "Register"}
    </Button>
  );
}

export default function RegisterPage() {
  const [state, formAction] = useActionState(register, initialState);

  return (
    <Card className="max-w-sm mx-auto mt-20">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input id="name" name="name" autoComplete="name" />
            {state.errors?.name?.errors.map(e => <FieldError key={e}>{e}</FieldError>)}
          </Field>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" name="email" type="email" autoComplete="email" />
            {state.errors?.email?.errors.map(e => <FieldError key={e}>{e}</FieldError>)}
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input id="password" name="password" type="password" autoComplete="new-password" />
            {state.errors?.password?.errors.map(e => <FieldError key={e}>{e}</FieldError>)}
          </Field>

          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}