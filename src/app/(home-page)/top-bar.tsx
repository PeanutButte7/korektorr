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
import { ReactNode, useEffect } from "react";
import { Separator } from "@/components/ui/separator";

interface TopBarProps {
  sideBarOpen: boolean;
  setSideBarOpen: (open: boolean) => void;
}

const TopBar = ({ sideBarOpen, setSideBarOpen }: TopBarProps) => {
  const { dictionaryReady } = useWorker();

  const smartCorrect = () => {
    setSideBarOpen(true);
  };

  return (
    <div className="flex items-center justify-between py-2 px-2 bg-card border rounded-lg ">
      <div className="flex items-center gap-2">
        <TopBarPill>
          {dictionaryReady ? (
            <IconDiscountCheckFilled size={18} className="text-emerald-500 flex-shrink-0" />
          ) : (
            <div className="w-[18px] h-[18px] flex items-center justify-center flex-shrink-0">
              <LoadingSpinner size={18} />
            </div>
          )}
          <p className="text-sm">{dictionaryReady ? "Korektor slov je aktivní!" : "Korektor slov se načítá..."}</p>
        </TopBarPill>
        <DocumentMetrics />
      </div>
      {!sideBarOpen && (
        <div className="flex gap-2">
          {/*<Button onClick={smartCorrect} size="sm" variant="fancy">*/}
          {/*  <IconSparkles />*/}
          {/*  Chytrá kontrola*/}
          {/*</Button>*/}
          <Button onClick={() => setSideBarOpen(true)} size="icon-sm" variant="outline">
            <IconLayoutSidebarRightExpandFilled />
          </Button>
        </div>
      )}
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
    <div className="h-8 flex gap-2 items-center bg-background rounded-md border py-1 px-3 text-sm">{children}</div>
  );
};

export default TopBar;
