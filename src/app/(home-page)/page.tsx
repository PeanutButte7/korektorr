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
    <div className="flex flex-col">
      {!user && <LoginPromoBanner />}
      {user && <LoginSuccessBanner />}
      <EditorSection user={user} />
    </div>
  );
};

export default HomePage;
