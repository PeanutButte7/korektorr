"use client";

import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";

const DictionaryPage = () => {
  const query = useQuery({
    queryKey: ["dictionary"],
    queryFn: async () => {
      const response = await fetch("api/dictionary");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  return (
    <div className="flex flex-col gap-2 mt-20">
      <h3 className="text-muted-foreground">
        Slovník vám umožní přidávat známá slova, která nechcete, aby Korektorr označoval jako chyby.
      </h3>
      <Input placeholder="Vyhledejte slovo ve vašem slovníku" className="bg-white" />
    </div>
  );
};

export default DictionaryPage;
