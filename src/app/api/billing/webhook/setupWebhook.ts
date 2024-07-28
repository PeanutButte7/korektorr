import { configureLemonSqueezy } from "@/utils/lemonsqueezy/config";
import { createWebhook } from "@lemonsqueezy/lemonsqueezy.js";
import { hasWebhook } from "@/app/api/billing/webhook/hasWebhook";

/**
 * This action will set up a webhook on Lemon Squeezy to listen to
 * Subscription events. It will only set up the webhook if it does not exist.
 */
export const setupWebhook = async () => {
  configureLemonSqueezy();

  if (!process.env.LEMONSQUEEZY_WEBHOOK_URL) {
    throw new Error("Missing required WEBHOOK_URL env variable. Please, set it in your .env file.");
  }

  // Check if WEBHOOK_URL ends with a slash. If not, add it.
  let webhookUrl = process.env.LEMONSQUEEZY_WEBHOOK_URL;

  // eslint-disable-next-line no-console -- allow
  console.log("Setting up a webhook on Lemon Squeezy (Test Mode)...");

  // Do not set a webhook on Lemon Squeezy if it already exists.
  let webhook = await hasWebhook();

  // If the webhook does not exist, create it.
  if (!webhook) {
    const newWebhook = await createWebhook(process.env.LEMONSQUEEZY_STORE_ID!, {
      secret: process.env.LEMONSQUEEZY_WEBHOOK_SECRET!,
      url: webhookUrl,
      testMode: true, // will create a webhook in Test mode only!
      events: ["subscription_created", "subscription_expired", "subscription_updated"],
    });

    webhook = newWebhook.data?.data;
  }

  // eslint-disable-next-line no-console -- allow
  console.log(`Webhook ${webhook?.id} created on Lemon Squeezy.`);
};
