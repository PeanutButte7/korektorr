"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useDeleteDictionaryWord, useGetUserDictionary } from "@/app/slovnik/queries";
import { createBrowserClient } from "@/utils/supabase/browser";
import { IconX } from "@tabler/icons-react";

const Words = () => {
  const supabase = createBrowserClient();
  const [search, setSearch] = useState("");
  const deleteMutation = useDeleteDictionaryWord(supabase);
  const { data, isSuccess } = useGetUserDictionary(supabase);

  if (!isSuccess) {
    return <p>Chyba načtení slovníku</p>;
  }

  return (
    <>
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
    </>
  );
};

export default Words;
