"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerClient } from "@/utils/supabase/server";

export async function loginWithEmail(prevState: any, formData: FormData) {
  const supabase = createServerClient();

  if (!formData.get("email")) {
    return {
      success: false,
      message: "Email is required",
    };
  }

  const { data, error } = await supabase.auth.signInWithOtp({
    email: formData.get("email") as string,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: "https://korektorr.cz/",
    },
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/", "layout");
  return {
    success: true,
  };
}
