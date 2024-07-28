"use client";

import { useWorker } from "@/app/worker-context";
import LoadingSpinner from "@/components/ui/loading-spinner";
import {
  IconDiscountCheckFilled,
  IconLayoutSidebarRightExpandFilled,
  IconSparkles,
  IconTextScan2,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useKorektorr } from "@/app/korektorr-context";
import { useEditorRef } from "@udecode/plate-common";
import { KorektorrEditor, KorektorrValue } from "@/components/korektorr-editor/korektorr-editor-component";
import { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";
import { useSmartCorrection } from "@/components/korektorr-editor/utils/use-smart-correction";
import { DictionaryWord } from "@/app/slovnik/queries";
import { createBrowserClient } from "@/utils/supabase/browser";
import { useGetProfile } from "@/utils/queries";

interface TopBarProps {
  sideBarOpen: boolean;
  setSideBarOpen: (open: boolean) => void;
  dictionary: DictionaryWord[];
}

const TopBar = ({ sideBarOpen, setSideBarOpen, dictionary }: TopBarProps) => {
  const supabase = createBrowserClient();
  const { dictionaryReady } = useWorker();
  const editor = useEditorRef<KorektorrValue, KorektorrEditor>();

  const mutation = useSmartCorrection(editor, dictionary);
  const { data, isSuccess } = useGetProfile(supabase);

  const smartCorrect = () => {
    mutation.mutate(editor);
  };

  return (
    <div className="flex items-center justify-between flex-wrap py-2 px-2 bg-card border rounded-lg ">
      <div className="flex items-center gap-2 flex-wrap">
        <TopBarPill>
          {dictionaryReady ? (
            <IconDiscountCheckFilled size={18} className="text-emerald-500 flex-shrink-0" />
          ) : (
            <div className="w-[18px] h-[18px] flex items-center justify-center flex-shrink-0">
              <LoadingSpinner size={18} />
            </div>
          )}
          <p className="text-xs md:text-sm">
            {dictionaryReady ? "Korektor slov je aktivní!" : "Korektor slov se načítá..."}
          </p>
        </TopBarPill>
        <DocumentMetrics />
      </div>
      <div className="flex gap-2">
        {isSuccess &&
          (data.isPlus ? (
            <Button onClick={smartCorrect} loading={mutation.isPending} size="sm" variant="fancy">
              <IconSparkles />
              Chytrá kontrola
            </Button>
          ) : (
            <Button onClick={() => (window.location.href = "/predplatne")} size="sm" variant="fancy">
              <IconSparkles />
              Koupit chytrou kontrolu
            </Button>
          ))}
        {!sideBarOpen && (
          <Button onClick={() => setSideBarOpen(true)} size="icon-sm" variant="outline">
            <IconLayoutSidebarRightExpandFilled />
          </Button>
        )}
      </div>
    </div>
  );
};

const DocumentMetrics = () => {
  const { documentMetrics } = useKorektorr();

  if (!documentMetrics) return null;
  const { wordCount, characterCount } = documentMetrics;
  const wordLabel = ["slov", "slovo", "slova", "slova", "slova"][wordCount] || "slov";
  const characterLabel = ["znaků", "znak", "znaky", "znaky", "znaky"][characterCount] || "znaků";

  return (
    <TopBarPill>
      <IconTextScan2 size={18} />
      <p>
        {documentMetrics.wordCount} {wordLabel}
      </p>
      <Separator orientation="vertical" />
      <p>
        {documentMetrics.characterCount} {characterLabel}
      </p>
    </TopBarPill>
  );
};

const TopBarPill = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-8 flex gap-2 items-center bg-background rounded-md border py-1 px-3 text-xs md:text-sm text-nowrap">
      {children}
    </div>
  );
};

export default TopBar;
