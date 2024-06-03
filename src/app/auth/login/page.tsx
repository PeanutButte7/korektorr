"use client";

import { loginWithEmail } from "@/app/auth/login/login-with-email";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormStatus, useFormState } from "react-dom";
import SubmitButton from "@/app/auth/login/submit-button";

const initialState = {
  message: "",
  success: false,
};

const LoginPage = () => {
  const [state, formAction] = useFormState(loginWithEmail, initialState);
  const { pending } = useFormStatus();

  return (
    <form action={formAction} className="w-full max-w-sm mt-20 self-center">
      <Card>
        {!state.success ? (
          <>
            <CardHeader>
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>Enter your email below to login to your account.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="email@example.com" required />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <SubmitButton />
              {state.message && <p className="text-sm text-destructive self-start">{state.message}</p>}
              <p className="text-sm text-muted-foreground">
                If you do not have an account, a new one will be created for you.
              </p>
            </CardFooter>
          </>
        ) : (
          <>
            <CardHeader>
              <CardTitle className="text-2xl">Email sent!</CardTitle>
              <CardDescription>Check your inbox to login.</CardDescription>
            </CardHeader>
          </>
        )}
      </Card>
    </form>
  );
};

export default LoginPage;
