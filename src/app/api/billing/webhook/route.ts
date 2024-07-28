import crypto from "node:crypto";
import { webhookHasMetaAndStatus } from "@/app/api/billing/webhook/typeguards";
import { processWebhookEvent } from "@/app/api/billing/webhook/processWebhookEvent";

export async function POST(request: Request) {
  if (!process.env.LEMONSQUEEZY_WEBHOOK_SECRET) {
    return new Response("Lemon Squeezy Webhook Secret not set in .env", {
      status: 500,
    });
  }

  // First, make sure the request is from Lemon Squeezy.
  const rawBody = await request.text();
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

  const hmac = crypto.createHmac("sha256", secret);
  const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
  const signature = Buffer.from(request.headers.get("X-Signature") || "", "utf8");

  if (!crypto.timingSafeEqual(digest, signature)) {
    throw new Error("Invalid signature.");
  }

  const rawData = JSON.parse(rawBody) as unknown;
  console.log(rawData);

  // Type guard to check if the object has a 'meta' property.
  if (webhookHasMetaAndStatus(rawData)) {
    // Non-blocking call to process the webhook event.
    void processWebhookEvent(rawData);

    return new Response("OK", { status: 200 });
  }

  return new Response("Data invalid", { status: 400 });
}
