import {
  KorektorrEditor,
  KorektorrRichText,
  KorektorrValue,
} from "@/components/korektorr-editor/korektorr-editor-component";
import { Button } from "@/components/ui/button";
import { IconArrowNarrowRight, IconArrowRight, IconBook2, IconCircleDashedX, IconX } from "@tabler/icons-react";
import { useEditorRef } from "@udecode/plate-common";
import { Editor, Text, Transforms } from "slate";
import { useKorektorr } from "@/app/korektorr-context";
import { useWorker } from "@/app/worker-context";
import { cn } from "@/utils/cn";
import { resetNodeError } from "@/utils/reset-node-error";
import { Separator } from "@/components/ui/separator";
import { useGetUserDictionary, useInsertDictionaryWord } from "@/app/slovnik/queries";
import { createBrowserClient } from "@/utils/supabase/browser";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { User } from "@supabase/supabase-js";
import { checkSpellingNormalize } from "@/components/korektorr-editor/plugins/spell-checker-plugin/spell-checker-plugin";

interface SideBarCardProps {
  leaf: KorektorrRichText;
  user: User | null;
}

const SideBarCard = ({ leaf, user }: SideBarCardProps) => {
  const supabase = createBrowserClient();
  const { setErrorLeafs } = useKorektorr();
  const { worker } = useWorker();
  const editor = useEditorRef<KorektorrValue, KorektorrEditor>();
  const insertMutation = useInsertDictionaryWord(supabase);

  let type: "spellError" | "dotError" | "quotationError" | null = null;
  if (!leaf.path) return null;

  if (leaf.errors?.spellError) {
    type = "spellError";
  } else if (leaf.errors?.dotError) {
    type = "dotError";
  } else if (leaf.errors?.quotationError) {
    type = "quotationError";
  }

  const labelText =
    type === "spellError" ? "Hrubá chyba" : type === "quotationError" ? "Chyba v úvozovkách" : "Chyba v tečce";

  const prioritySuggestion =
    type === "spellError"
      ? leaf.errors?.spellError?.prioritySuggestion
      : leaf.errors?.dotError?.prioritySuggestion || leaf.errors?.quotationError?.prioritySuggestion;

  const suggestions =
    type === "spellError"
      ? leaf.errors?.spellError?.suggestions
      : leaf.errors?.dotError?.suggestions || leaf.errors?.quotationError?.suggestions;

  const fixError = (suggestion: string) => {
    if (!Editor.isEditor(editor)) return;

    if (type === "spellError" || type === "dotError" || type === "quotationError") {
      if (!leaf.path) throw new Error("No leaf path");

      // Set new text
      Transforms.insertText(editor, suggestion, {
        at: leaf.path,
      });

      // Remove spell and dot error mark
      resetNodeError(editor, leaf.path);
    }

    // Remove the error from context
    setErrorLeafs((prev) => prev.filter(({ path }) => JSON.stringify(path) !== JSON.stringify(leaf.path)));
  };

  const dismissError = () => {
    if (!Editor.isEditor(editor)) return;
    if (!leaf.path) throw new Error("No leaf path");

    // Remove error
    if (type !== "spellError") {
      Transforms.setNodes(
        editor,
        {
          errors: { quotationError: undefined, dotError: undefined },
          ignoreQuoteDot: true,
        } as Partial<KorektorrRichText>,
        {
          at: leaf.path,
        }
      );
      setErrorLeafs((prev) => prev.filter(({ path }) => JSON.stringify(path) !== JSON.stringify(leaf.path)));
      return;
    }

    // Add word to dictionary
    insertMutation.mutateAsync(leaf.text).then((data) => {
      if (!leaf.path) throw new Error("No leaf path");

      resetNodeError(editor, leaf.path);
      checkSpellingNormalize(editor, worker, setErrorLeafs, data);
    });
  };

  const tooltipContent = !user ? (
    <span>
      Funkce potlačení chyb
      <br />
      vyžaduje příhlášení
    </span>
  ) : type === "spellError" ? (
    <span>
      Potlačit chybu a<br />
      přidat slovo do slovníku
    </span>
  ) : (
    <span>Potlačit chybu</span>
  );

  // const originalJoinedText = joinWithPreviousWord(leaf.text, leaf.path, editor);

  // if (leaf.errors?.dotError && prioritySuggestion) {
  //   // If it is a dot error, add previous word to the corrected text for better readability
  //   correctedText = joinWithPreviousWord(prioritySuggestion, leaf.path, editor);
  // }

  return (
    <div
      className={cn(
        "w-full font-paragraph text-sm flex flex-col gap-2 p-3 bg-card rounded-md shadow-pop transition-all border",
        type === "spellError" && "border-error-spell/40",
        type === "dotError" && "border-error-dot/40",
        type === "quotationError" && "border-error-quotation/40"
      )}
    >
      <div className="flex justify-between items-center">
        <p className="text-xs text-muted-foreground">{labelText}</p>
        <Tooltip delayDuration={user ? 500 : 0}>
          <TooltipTrigger asChild>
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={() => {
                if (!user) return;
                dismissError();
              }}
              className="h-5 w-5 text-muted-foreground"
            >
              <IconCircleDashedX />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">{tooltipContent}</TooltipContent>
        </Tooltip>
      </div>
      <div className="flex gap-1 items-center flex-wrap">
        <p
          className={cn(
            "underline decoration-2",
            type === "spellError" && "decoration-error-spell",
            type === "dotError" && "decoration-error-dot",
            type === "quotationError" && "decoration-error-quotation"
          )}
        >
          {leaf.text}
        </p>
        {prioritySuggestion && (
          <>
            <IconArrowNarrowRight
              className={cn(
                "h-5 w-5",
                type === "spellError" && "text-error-spell",
                type === "dotError" && "text-error-dot",
                type === "quotationError" && "text-error-quotation"
              )}
            />
            <button
              onClick={() => fixError(prioritySuggestion)}
              className="px-2 py-1 text-xs border rounded hover:bg-card-hover"
            >
              {prioritySuggestion}
            </button>
          </>
        )}
      </div>
      {type !== "quotationError" && (
        <>
          <Separator />
          <div className="flex gap-1 items-center flex-wrap w-full">
            {suggestions &&
              suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => fixError(suggestion)}
                  className="px-2 py-1 text-xs border rounded hover:bg-card-hover"
                >
                  {suggestion}
                </button>
              ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SideBarCard;
