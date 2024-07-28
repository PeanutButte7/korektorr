export type Webhook = {
  data: {
    attributes: {
      status: "active" | "paused" | "past_due" | "unpaid" | "canceled" | "expired" | "on_trial";
      customer_id: number;
    };
  };
  meta: {
    test_mode: boolean;
    event_name: "subscription_created" | "subscription_updated";
    custom_data: { user_id: string };
    webhook_id: string;
  };
};

export const webhookHasMetaAndStatus = (rawData: unknown): rawData is Webhook => {
  return (
    typeof rawData === "object" &&
    rawData !== null &&
    "meta" in rawData &&
    typeof (rawData as any).meta === "object" &&
    (rawData as any).meta !== null &&
    typeof (rawData as any).meta.test_mode === "boolean" &&
    typeof (rawData as any).meta.event_name === "string" &&
    typeof (rawData as any).meta.custom_data === "object" &&
    (rawData as any).meta.custom_data !== null &&
    typeof (rawData as any).meta.custom_data.user_id === "string" &&
    typeof (rawData as any).meta.webhook_id === "string" &&
    "data" in rawData &&
    typeof (rawData as any).data === "object" &&
    (rawData as any).data !== null &&
    "attributes" in (rawData as any).data &&
    typeof (rawData as any).data.attributes === "object" &&
    (rawData as any).data.attributes !== null &&
    typeof (rawData as any).data.attributes.status === "string" &&
    typeof (rawData as any).data.attributes.customer_id === "number"
  );
};
