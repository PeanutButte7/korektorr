"use client";

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { IconDiscountCheckFilled } from "@tabler/icons-react";
import { useWorker } from "@/app/worker-context";
import { createBrowserClient } from "@/utils/supabase/browser";

const WorkerIndicator = () => {
  const { dictionaryReady } = useWorker();

  return (
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
  );
};

export default WorkerIndicator;
