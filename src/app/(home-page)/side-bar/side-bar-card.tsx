import {
  KorektorrEditor,
  KorektorrRichText,
  KorektorrValue,
} from "@/components/korektorr-editor/korektorr-editor-component";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IconArrowNarrowRight, IconArrowRight } from "@tabler/icons-react";
import { useEditorRef } from "@udecode/plate-common";
import { Editor, Text, Transforms } from "slate";
import { useKorektorr } from "@/app/korektorr-context";
import { joinWithPreviousWord } from "@/app/(home-page)/side-bar/join-with-previous-word";
import { checkSpellingNormalize } from "@/components/korektorr-editor/plugins/spell-checker-plugin/spell-checker-plugin";
import { useWorker } from "@/app/worker-context";

interface SideBarCardProps {
  leaf: KorektorrRichText;
}

const SideBarCard = ({ leaf }: SideBarCardProps) => {
  const { setErrorLeafs } = useKorektorr();
  const { worker } = useWorker();
  const editor = useEditorRef<KorektorrValue, KorektorrEditor>();
  let type: "spellError" | "punctuationError" | "dotError" | null = null;
  if (!leaf.path) return null;

  if (leaf.errors?.spellError) {
    type = "spellError";
  } else if (leaf.errors?.punctuationError) {
    type = "punctuationError";
  } else if (leaf.errors?.dotError) {
    type = "dotError";
  }

  const labelText =
    type === "spellError" ? "Hrubá chyba" : type === "punctuationError" ? "Chyba v interpunkci" : "Chyba v tečce";

  const prioritySuggestion =
    type === "spellError" ? leaf.errors?.spellError?.prioritySuggestion : leaf.errors?.dotError?.prioritySuggestion;

  const fixError = () => {
    if (!prioritySuggestion) return;
    if (!Editor.isEditor(editor)) return;

    if (type === "spellError" || type === "dotError") {
      // Set new text
      Transforms.insertText(editor, prioritySuggestion, {
        at: leaf.path,
      });

      // Remove spell and dot error mark
      Transforms.setNodes(
        editor,
        { errors: { dotError: undefined, spellError: undefined } } as Partial<KorektorrRichText>,
        {
          at: leaf.path,
        }
      );
    } else if (type === "punctuationError") {
      // TODO: Handle punctuation errors
    }

    // Remove the error from context
    setErrorLeafs((prev) => prev.filter(({ path }) => JSON.stringify(path) !== JSON.stringify(leaf.path)));
  };

  // const originalJoinedText = joinWithPreviousWord(leaf.text, leaf.path, editor);
  const originalJoinedText = leaf.text;

  let correctedText = prioritySuggestion;
  // if (leaf.errors?.dotError && prioritySuggestion) {
  //   // If it is a dot error, add previous word to the corrected text for better readability
  //   correctedText = joinWithPreviousWord(prioritySuggestion, leaf.path, editor);
  // }

  return (
    <button
      onClick={fixError}
      className={cn(
        "w-full font-paragraph text-sm flex flex-col gap-0.5 p-3 bg-card rounded-md border-y border-white/70 shadow-pop transition-all",
        "hover:bg-card-hover hover:shadow-inner-soft active:shadow-none",
        !correctedText && "cursor-default"
      )}
    >
      <p className="text-xs text-muted-foreground">{labelText}</p>
      <div className="flex gap-1 items-center flex-wrap">
        <p className={cn(type === "spellError" && "underline decoration-2 decoration-error-spell")}>
          {originalJoinedText}
        </p>
        {correctedText && (
          <>
            <IconArrowNarrowRight
              className={cn("h-5 w-5", (type === "spellError" || type === "dotError") && "text-error-spell")}
            />
            <p>{correctedText}</p>
          </>
        )}
      </div>
    </button>
  );
};

export default SideBarCard;
