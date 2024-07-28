import { configureLemonSqueezy } from "@/utils/lemonsqueezy/config";
import { Webhook } from "@/app/api/billing/webhook/typeguards";
import { createServerServiceClient } from "@/utils/supabase/server";

/**
 * This action will process a webhook event in the database.
 */
export const processWebhookEvent = async (webhook: Webhook) => {
  const {
    meta,
    data: { attributes },
  } = webhook;

  configureLemonSqueezy();
  // Service supabase client to ignore row level security
  const supabase = createServerServiceClient();

  const { error } = await supabase.from("profiles").select("is_plus").eq("id", meta.custom_data.user_id);

  if (error) throw new Error(error.message);

  // If the event is a subscription_created, set subscription active and add customer id
  if (meta.event_name === "subscription_created") {
    const { error } = await supabase
      .from("profiles")
      .update({ is_plus: true, customer_id: attributes.customer_id })
      .eq("id", meta.custom_data.user_id);

    if (error) throw new Error(error.message);
  }
  // Else only change subscription status
  else {
    if (attributes.status === "active" || attributes.status === "on_trial") {
      const { error } = await supabase.from("profiles").update({ is_plus: true }).eq("id", meta.custom_data.user_id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase.from("profiles").update({ is_plus: false }).eq("id", meta.custom_data.user_id);
      if (error) throw new Error(error.message);
    }
  }
};
