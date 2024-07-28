import { TypedSupabaseClient } from "@/utils/supabase/types";
import { getSession } from "@/utils/get-session";
import { useQuery } from "@tanstack/react-query";

const subscriptionKey = "subscription";

const getProfile = async (client: TypedSupabaseClient): Promise<{ isPlus: boolean; customerId: number | null }> => {
  const session = await getSession(client);
  const { data, error } = await client
    .from("profiles")
    .select("is_plus, customer_id")
    .eq("id", session.user.id)
    .limit(1)
    .single();

  if (error) throw new Error(error.message);

  return {
    customerId: data.customer_id,
    isPlus: data.is_plus,
  };
};
export const useGetProfile = (client: TypedSupabaseClient) =>
  useQuery({
    queryKey: [subscriptionKey],
    queryFn: () => getProfile(client),
  });
