"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerClient } from "@/utils/supabase/server";

export async function loginWithEmail(prevState: any, formData: FormData) {
  const supabase = createServerClient();

  if (!formData.get("email")) {
    return {
      success: false,
      message: "Je nutné zadat email",
      email: "",
    };
  }

  const email = formData.get("email") as string;

  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: "https://korektorr.cz/",
    },
  });

  if (error) {
    return {
      success: false,
      message: error.message,
      email,
    };
  }

  revalidatePath("/", "layout");
  return {
    success: true,
    email,
  };
}
