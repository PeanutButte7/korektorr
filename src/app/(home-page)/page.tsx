import React from "react";
import EditorSection from "@/app/(home-page)/editor-section";
import { createServerClient } from "@/utils/supabase/server";
import LoginPromoBanner from "@/app/(home-page)/login-promo-banner";
import LoginSuccessBanner from "@/app/(home-page)/login-success-banner";
import { Separator } from "@/components/ui/separator";

const HomePage = async () => {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col">
      {!user && <LoginPromoBanner />}
      {user && <LoginSuccessBanner />}
      <div className="flex flex-col gap-4 mt-12">
        <div className="flex flex-col">
          <h3 className="text-2xl font-extrabold text-foreground/80">Váš asistent pro bezchybné psaní</h3>
          <p className="text-muted-foreground">
            Zvýrazněte a opravte chyby svých emailech, příspěvcích a dalším obsahu. Vyzkoušejte také AI funkce jako je
            chytrá kontrola čárek.
          </p>
        </div>
        <Separator />
        <EditorSection user={user} />
      </div>
    </div>
  );
};

export default HomePage;
