"use server";

import { configureLemonSqueezy } from "@/utils/lemonsqueezy/config";
import { getCustomer } from "@lemonsqueezy/lemonsqueezy.js";

/**
 * This action will get active subscription for the user.
 */
export async function getManageUrl(customerId: number) {
  configureLemonSqueezy();

  const customer = await getCustomer(customerId);

  return customer.data?.data.attributes.urls.customer_portal;
}
