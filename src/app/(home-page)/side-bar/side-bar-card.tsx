import {
  KorektorrEditor,
  KorektorrRichText,
  KorektorrValue,
} from "@/components/korektorr-editor/korektorr-editor-component";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IconArrowNarrowRight, IconArrowRight } from "@tabler/icons-react";
import { useEditorRef } from "@udecode/plate-common";
import { Editor, Transforms } from "slate";
import { useKorektorr } from "@/app/korektorr-context";

interface SideBarCardProps {
  leaf: KorektorrRichText;
}

const SideBarCard = ({ leaf }: SideBarCardProps) => {
  const { setErrorLeafs } = useKorektorr();
  const editor = useEditorRef<KorektorrValue, KorektorrEditor>();
  const type = leaf.spellError ? "spellError" : leaf.punctuationError ? "punctuationError" : null;
  const firstSuggestion = leaf.spellSuggestions?.[0];

  const fixError = () => {
    if (!firstSuggestion) return;
    if (!Editor.isEditor(editor)) return;

    if (type === "spellError") {
      // Set new text
      Transforms.insertText(editor, firstSuggestion, {
        at: leaf.path,
      });

      // Remove spell error mark
      Transforms.setNodes(editor, { spellError: false, spellSuggestions: undefined } as Partial<KorektorrRichText>, {
        at: leaf.path,
      });
    } else if (type === "punctuationError") {
      // TODO: Handle punctuation errors
    }

    // Remove the error from context
    setErrorLeafs((prev) => prev.filter(({ path }) => JSON.stringify(path) !== JSON.stringify(leaf.path)));
  };

  return (
    <button
      onClick={fixError}
      className={cn(
        "w-full font-paragraph text-sm flex flex-col gap-0.5 p-3 bg-card rounded-md border-y border-white/70 shadow-pop transition-all hover:bg-card-hover hover:shadow-inner-soft active:shadow-none",
        !firstSuggestion && "cursor-default"
      )}
    >
      <p className="text-xs text-muted-foreground">{type ? "Hrubá chyba" : "Chyba v interpunkci"}</p>
      <div className="flex gap-1 items-center flex-wrap">
        <p className={cn(type === "spellError" && "underline decoration-2 decoration-error-spell")}>{leaf.text}</p>
        {firstSuggestion && (
          <>
            <IconArrowNarrowRight className={cn("h-5 w-5", type === "spellError" && "text-error-spell")} />
            <p>{firstSuggestion}</p>
          </>
        )}
      </div>
    </button>
  );
};

export default SideBarCard;
