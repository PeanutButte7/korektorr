import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";
import { checkSpellingNormalize } from "@/components/korektorr-editor/spell-checker-plugin";
import { KorektorrRichText } from "@/components/korektorr-editor/korektorr-editor-component";

export type SetErrorLeafs = Dispatch<SetStateAction<KorektorrRichText[]>>;

interface KorektorrContextType {
  errorLeafs: KorektorrRichText[];
  setErrorLeafs: SetErrorLeafs;
}

const KorektorrContext = createContext<KorektorrContextType | null>(null);

export const KorektorrProvider = ({ children }: { children: ReactNode }) => {
  const [errorLeafs, setErrorLeafs] = useState<KorektorrRichText[]>([]);

  return <KorektorrContext.Provider value={{ errorLeafs, setErrorLeafs }}>{children}</KorektorrContext.Provider>;
};

export const useKorektorr = (): KorektorrContextType => {
  const context = useContext(KorektorrContext);
  if (!context) {
    throw new Error("useKorektorr must be used within a KorektorrProvider");
  }

  return context;
};
