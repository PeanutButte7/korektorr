import { isText, useEditorRef, useEditorSelector } from "@udecode/plate-common";
import { BaseText, Editor, Node, Transforms } from "slate";
import { ToolbarButton } from "@/components/plate-ui/toolbar";
import { useWorker } from "@/app/worker-context";
import { useEffect, useState } from "react";
import {
  KorektorrEditor,
  KorektorrRichText,
  KorektorrValue,
} from "@/components/korektorr-editor/korektorr-editor-component";
import { isKorektorrRichText } from "@/utils/is-korektorr-rich-text";
import { checkHasError } from "@/utils/check-has-error";
import { IconBook2 } from "@tabler/icons-react";
import { useGetUserDictionary, useInsertDictionaryWord } from "@/app/slovnik/queries";
import { createBrowserClient } from "@/utils/supabase/browser";
import { checkSpellingNormalize } from "@/components/korektorr-editor/plugins/spell-checker-plugin/spell-checker-plugin";
import { useKorektorr } from "@/app/korektorr-context";

const FloatingToolbarAddToDictionary = () => {
  const supabase = createBrowserClient();
  const editor = useEditorRef<KorektorrValue, KorektorrEditor>();
  const { worker } = useWorker();
  const { setErrorLeafs } = useKorektorr();

  const insertMutation = useInsertDictionaryWord(supabase);

  const selection = editor.selection;
  if (!selection) return;

  const node = Node.get(editor, selection.anchor.path);
  if (!isKorektorrRichText(node)) throw new Error("Node is not a text node");

  const hasSpellError = node.errors?.spellError;

  if (!hasSpellError) return;

  return (
    <ToolbarButton
      onClick={() => {
        const wordLowerCase = node.text.toLowerCase();

        insertMutation.mutateAsync(wordLowerCase).then((data) => {
          checkSpellingNormalize(editor, worker, setErrorLeafs, data);
        });
      }}
      className="self-stretch justify-start m-1"
    >
      <IconBook2 />
      Přidat do slovníku
    </ToolbarButton>
  );
};

export default FloatingToolbarAddToDictionary;
