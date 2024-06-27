import { TypedSupabaseClient } from "@/utils/supabase/types";

export const getSession = async (client: TypedSupabaseClient) => {
  const {
    data: { session },
  } = await client.auth.getSession();
  if (!session) throw new Error("User is not logged in");
  return session;
};
