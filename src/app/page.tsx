"use client";

import React from "react";
import KorektorrEditor from "@/components/korektorr-editor/korektorr-editor";
import { useWorker } from "@/app/worker-context";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { IconDiscountCheckFilled } from "@tabler/icons-react";

const HomePage = () => {
  const { dictionaryReady } = useWorker();

  return (
    <main className="container mt-20 mx-auto gap-2 xl:px-48 lg:px-20 flex flex-col ">
      <h1 className="text-center text-4xl mb-4 font-bold text-muted-foreground">Korektorr</h1>
      <div className="flex flex-col md:flex-row gap-2 text-sm leading-6">
        <div className="flex gap-2 bg-background rounded-lg border py-1 px-4 self-start items-center">
          {dictionaryReady ? (
            <IconDiscountCheckFilled size={24} className="text-teal-400 flex-shrink-0" />
          ) : (
            <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
              <LoadingSpinner size={16} />
            </div>
          )}
          <p>{dictionaryReady ? "Korektor slov je aktivní!" : "Korektor slov se načítá..."}</p>
        </div>
        <div className="flex gap-2 bg-background rounded-lg border py-1 px-4 self-start items-center">
          <p>🚧</p>
          <p>Tato stránka je ve vývoji. Aktuálně používate testovací verzi.</p>
        </div>
      </div>
      <KorektorrEditor />
    </main>
  );
};

export default HomePage;
