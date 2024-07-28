"use server";

import { configureLemonSqueezy } from "@/utils/lemonsqueezy/config";
import { createCheckout } from "@lemonsqueezy/lemonsqueezy.js";
import { createServerClient } from "@/utils/supabase/server";

/**
 * This action will create a checkout on Lemon Squeezy.
 */
export async function getCheckoutUrl() {
  configureLemonSqueezy();

  const supabase = createServerClient();

  // Attempt to retrieve the user
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) {
    throw new Error("Error retrieving user data");
  }

  const user = userData?.user;
  if (!user) {
    throw new Error("User is not logged in");
  }

  const checkout = await createCheckout(process.env.LEMONSQUEEZY_STORE_ID!, process.env.LEMONSQUEEZY_VARIANT_ID!, {
    checkoutData: {
      email: user.email,
      custom: {
        user_id: user.id,
      },
    },
    productOptions: {
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}`,
      receiptButtonText: "Vrátit se zpět",
      receiptThankYouNote: "Děkujeme za platbu! Nyní máte přístup ke všem funkcím Korektorru.",
    },
    testMode: true,
  });

  return checkout.data?.data.attributes.url;
}
