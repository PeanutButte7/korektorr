import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";
import { checkSpellingNormalize } from "@/components/korektorr-editor/plugins/spell-checker-plugin/spell-checker-plugin";
import { KorektorrRichText } from "@/components/korektorr-editor/korektorr-editor-component";

type DocumentMetrics = {
  characterCount: number;
  wordCount: number;
};

export type SetErrorLeafs = Dispatch<SetStateAction<KorektorrRichText[]>>;
export type SetDocumentMetrics = Dispatch<SetStateAction<DocumentMetrics | undefined>>;

interface KorektorrContextType {
  errorLeafs: KorektorrRichText[];
  setErrorLeafs: SetErrorLeafs;
  setDocumentMetrics: SetDocumentMetrics;
  documentMetrics: DocumentMetrics | undefined;
}

const KorektorrContext = createContext<KorektorrContextType | null>(null);

export const KorektorrProvider = ({ children }: { children: ReactNode }) => {
  const [errorLeafs, setErrorLeafs] = useState<KorektorrRichText[]>([]);
  const [documentMetrics, setDocumentMetrics] = useState<DocumentMetrics | undefined>(undefined);

  return (
    <KorektorrContext.Provider value={{ errorLeafs, setErrorLeafs, documentMetrics, setDocumentMetrics }}>
      {children}
    </KorektorrContext.Provider>
  );
};

export const useKorektorr = (): KorektorrContextType => {
  const context = useContext(KorektorrContext);
  if (!context) {
    throw new Error("useKorektorr must be used within a KorektorrProvider");
  }

  return context;
};
