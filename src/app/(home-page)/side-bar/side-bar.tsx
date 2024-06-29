import {
  IconConfetti,
  IconLayoutSidebarRightCollapse,
  IconLayoutSidebarRightCollapseFilled,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useEditorRef, useEditorSelector, useEditorState } from "@udecode/plate-common";
import {
  KorektorrEditor,
  KorektorrRichText,
  KorektorrValue,
} from "@/components/korektorr-editor/korektorr-editor-component";
import { useEffect, useState } from "react";
import { useKorektorr } from "@/app/korektorr-context";
import SideBarCard from "@/app/(home-page)/side-bar/side-bar-card";
import { useTransition, animated } from "@react-spring/web";
import { useWorker } from "@/app/worker-context";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface SideBarProps {
  setSideBarOpen: (open: boolean) => void;
}

const SideBar = ({ setSideBarOpen }: SideBarProps) => {
  const { errorLeafs } = useKorektorr();
  const { dictionaryReady } = useWorker();

  const transitions = useTransition(errorLeafs, {
    keys: (item) => JSON.stringify(item.path),
    from: { opacity: 0, transform: "translate3d(0, -40px, 0)" },
    enter: { opacity: 1, transform: "translate3d(0, 0, 0)" },
    leave: { opacity: 0, transform: "translate3d(0, -40px, 0)" },
    config: { duration: 250 },
  });

  return (
    <div className="overflow-y-auto max-h-[36rem] w-64 flex flex-col flex-shrink-0 gap-2 px-4 pt-2.5 pb-3 bg-gradient-to-b from-card to-blue-50 border border-blue-200 rounded-lg shadow-pop">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-extrabold text-primary">Chyby</h3>
        <Button
          onClick={() => setSideBarOpen(false)}
          size="icon-sm"
          variant="ghost"
          className="text-primary hover:text-primary/90 hover:bg-blue-50"
        >
          <IconLayoutSidebarRightCollapseFilled />
        </Button>
      </div>
      {!dictionaryReady ? (
        <div className="flex flex-col gap-2 justify-center items-center self-center text-blue-400 h-3/4">
          <LoadingSpinner className="h-9 w-9 text-blue-400" />
          <p className="font-bold">Korektor slov se načítá...</p>
        </div>
      ) : errorLeafs.length ? (
        transitions((style, item, _, key) => (
          <animated.div style={style} key={key}>
            <SideBarCard leaf={item} />
          </animated.div>
        ))
      ) : (
        <div className="flex flex-col gap-2 justify-center items-center self-center text-blue-400 h-3/4">
          <IconConfetti className="h-9 w-9" />
          <p className="font-bold">Je to bez chyb!</p>
          <Button onClick={() => setSideBarOpen(false)} size="sm" variant="link" className="text-blue-400 -mt-1">
            Zavřít
          </Button>
        </div>
      )}
    </div>
  );
};

export default SideBar;
