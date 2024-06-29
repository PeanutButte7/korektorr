import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { checkSpellingNormalize } from "@/components/korektorr-editor/plugins/spell-checker-plugin/spell-checker-plugin";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface WorkerContextType {
  worker: Worker;
  dictionaryReady: boolean;
}

const WorkerContext = createContext<WorkerContextType | null>(null);

export const WorkerProvider = ({ children }: { children: ReactNode }) => {
  const [worker, setWorker] = useState<Worker | null>(null);
  const [dictionaryReady, setDictionaryReady] = useState(false);

  useEffect(() => {
    if (typeof Worker !== "undefined") {
      const newWorker = new Worker("/workers/typo.js");
      setWorker(newWorker);

      newWorker.onmessage = (event) => {
        const data = event.data;
        if (data.type === "dictionary_ready") {
          setDictionaryReady(true);
        }
      };
    }

    return () => {
      worker?.terminate();
    };
  }, []);

  if (!worker) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 h-screen">
        <p>Korektorr se načítá...</p>
        <LoadingSpinner size={32} className="text-primary" />
      </div>
    );
  }

  return <WorkerContext.Provider value={{ worker, dictionaryReady }}>{children}</WorkerContext.Provider>;
};

export const useWorker = (): WorkerContextType => {
  const context = useContext(WorkerContext);
  if (!context) {
    throw new Error("useWorker must be used within a WorkerProvider");
  }

  return context;
};
