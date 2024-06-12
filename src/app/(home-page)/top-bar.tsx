"use client";

import { useWorker } from "@/app/worker-context";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { IconDiscountCheckFilled, IconLayoutSidebarRightExpandFilled, IconSparkles } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useKorektorr } from "@/app/korektorr-context";

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
        <div className="h-8 flex gap-2 bg-background rounded-md border py-1 px-3 items-center">
          {dictionaryReady ? (
            <IconDiscountCheckFilled size={18} className="text-emerald-500 flex-shrink-0" />
          ) : (
            <div className="w-[18px] h-[18px] flex items-center justify-center flex-shrink-0">
              <LoadingSpinner size={18} />
            </div>
          )}
          <p className="text-sm">{dictionaryReady ? "Korektor slov je aktivní!" : "Korektor slov se načítá..."}</p>
        </div>
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

export default TopBar;
