"use server";

import { getCustomer, listSubscriptions } from "@lemonsqueezy/lemonsqueezy.js";
import { TypedSupabaseClient } from "@/utils/supabase/types";
import { configureLemonSqueezy } from "@/utils/lemonsqueezy/config";

export const getSubscription = async (client: TypedSupabaseClient, customerId: string) => {
  configureLemonSqueezy();

  const { data: profileData, error: profileError } = await client
    .from("profiles")
    .select("is_plus, customer_id")
    .eq("id", customerId)
    .limit(1)
    .single();

  if (profileError) throw new Error(profileError.message);
  if (!profileData.customer_id) throw new Error("Profile does not have a customer ID");
  console.log(profileData);

  const { data: customerData, error: customerError } = await getCustomer(profileData.customer_id);
  if (customerError) throw new Error(customerError.message);

  const { data: subscriptionData, error: subscriptionError } = await listSubscriptions({
    filter: { userEmail: customerData.data.attributes.email },
  });

  if (subscriptionError) throw new Error(subscriptionError.message);

  return subscriptionData.data;
};
