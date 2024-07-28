import { configureLemonSqueezy } from "@/utils/lemonsqueezy/config";
import { listWebhooks } from "@lemonsqueezy/lemonsqueezy.js";

/**
 * This action will check if a webhook exists on Lemon Squeezy. It will return
 * the webhook if it exists, otherwise it will return undefined.
 */
export const hasWebhook = async () => {
  configureLemonSqueezy();

  if (!process.env.LEMONSQUEEZY_WEBHOOK_URL) {
    throw new Error("Missing required WEBHOOK_URL env variable. Please, set it in your .env file.");
  }

  // Check if a webhook exists on Lemon Squeezy.
  const allWebhooks = await listWebhooks({
    filter: { storeId: process.env.LEMONSQUEEZY_STORE_ID },
  });

  // Check if WEBHOOK_URL ends with a slash. If not, add it.
  let webhookUrl = process.env.LEMONSQUEEZY_WEBHOOK_URL;

  const webhook = allWebhooks.data?.data.find((wh) => wh.attributes.url === webhookUrl && wh.attributes.test_mode);

  return webhook;
};
