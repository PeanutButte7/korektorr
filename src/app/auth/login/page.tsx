"use client";

import { loginWithEmail } from "@/app/auth/login/login-with-email";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState } from "react-dom";
import SubmitButton from "@/app/auth/login/submit-button";
import { IconMailShare } from "@tabler/icons-react";

const initialState = {
  message: "",
  success: false,
  email: "",
};

const LoginPage = () => {
  const [state, formAction] = useFormState(loginWithEmail, initialState);

  return (
    <form action={formAction} className="w-full max-w-sm mt-20 self-center">
      <Card>
        {!state.success ? (
          <>
            <CardHeader>
              <CardTitle className="text-2xl font-black text-primary">Přihlásit se</CardTitle>
              <CardDescription>Přihlašte se snadno a bezpečně pouze pomocí emailu.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="kevin.bacon@email.com" required />
                <p className="text-sm text-muted-foreground">Pokud nemáte založený účet, bude vytvořen.</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 mt-8">
              <SubmitButton />
              {state.message && <p className="text-sm text-destructive self-start">{state.message}</p>}
            </CardFooter>
          </>
        ) : (
          <>
            <CardHeader>
              <IconMailShare size={32} className="text-primary" />
              <CardTitle className="text-2xl font-black text-primary">Zkontrolujte váš email!</CardTitle>
              <CardDescription>
                <p className="text-sm text-muted-foreground">Poslali jsme vám email na adresu:</p>
                <p className="text-sm text-muted-foreground font-extrabold">{state.email}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Pro přihlášení nebo vytvoření účtu stačí kliknout na odkaz v emailu.
                </p>
              </CardDescription>
            </CardHeader>
            <CardFooter className="mt-8">
              <Button onClick={() => location.reload()} type="reset" variant="outline" className="w-full">
                Přihlásit se jiným emailem
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </form>
  );
};

export default LoginPage;
