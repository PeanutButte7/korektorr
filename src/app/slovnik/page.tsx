import Words from "@/app/slovnik/words";
import { createServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const DictionaryPage = async () => {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  return (
    <div className="flex flex-col gap-2 mt-20">
      <h3 className="text-muted-foreground">
        Slovník vám umožní přidávat známá slova, která nechcete, aby Korektorr označoval jako chyby.
      </h3>
      <Words />
    </div>
  );
};

export default DictionaryPage;
