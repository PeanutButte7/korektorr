import React from "react";
import EditorSection from "@/app/(home-page)/editor-section";
import { createServerClient } from "@/utils/supabase/server";
import LoginPromoBanner from "@/app/(home-page)/login-promo-banner";
import LoginSuccessBanner from "@/app/(home-page)/login-success-banner";

const HomePage = async () => {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex gap-2 flex-col">
      {!user && <LoginPromoBanner />}
      {user && <LoginSuccessBanner />}
      <EditorSection />
    </div>
  );
};

export default HomePage;
