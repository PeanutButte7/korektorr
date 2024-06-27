"use client";

import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { useDeleteDictionaryWord, useGetUserDictionary } from "@/app/slovnik/queries";
import { createBrowserClient } from "@/utils/supabase/browser";
import { Button } from "@/components/ui/button";
import { IconX } from "@tabler/icons-react";
import { useState } from "react";

const DictionaryPage = () => {
  const [search, setSearch] = useState("");
  const supabase = createBrowserClient();
  const { data, isSuccess } = useGetUserDictionary(supabase);
  const deleteMutation = useDeleteDictionaryWord(supabase);

  if (!isSuccess) {
    return <p>Chyba načtení slovníku</p>;
  }

  return (
    <div className="flex flex-col gap-2 mt-20">
      <h3 className="text-muted-foreground">
        Slovník vám umožní přidávat známá slova, která nechcete, aby Korektorr označoval jako chyby.
      </h3>
      <Input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Vyhledejte slovo ve vašem slovníku"
        className="h-11 bg-white text-base rounded-lg"
      />
      <div className="flex gap-2 flex-wrap items-start mt-4">
        {!data ? (
          <p>Ve slovníku nejsou žádná slova. Přidejte slova v editoru.</p>
        ) : (
          <>
            {(() => {
              const filteredData = data.filter(({ word }) => word.toLowerCase().includes(search));

              if (!filteredData.length) return <p className="text-muted-foreground">Nebyla nalezena žádná slova</p>;

              return filteredData.map((word) => (
                <div key={word.id} className="flex gap-2 items-center px-4 py-1 bg-white text rounded-full border">
                  <span>{word.word}</span>
                  <Button
                    onClick={() => deleteMutation.mutate(word.id)}
                    size="icon-sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive/90 hover:bg-destructive-foreground h-4 w-4"
                  >
                    <IconX />
                  </Button>
                </div>
              ));
            })()}
          </>
        )}
      </div>
    </div>
  );
};

export default DictionaryPage;
