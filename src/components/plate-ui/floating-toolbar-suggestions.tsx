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
import { resetNodeError } from "@/utils/reset-node-error";

const FloatingToolbarSuggestions = () => {
  const editor = useEditorRef<KorektorrValue, KorektorrEditor>();

  const selection = editor.selection;
  if (!selection) return;

  const node = Node.get(editor, selection.anchor.path);
  if (!isKorektorrRichText(node)) throw new Error("Node is not a text node");

  const spellSuggestions = node.errors?.spellError?.suggestions ?? [];
  const quotationSuggestions = node.errors?.quotationError?.suggestions ?? [];
  const dotSuggestions = node.errors?.dotError?.suggestions ?? [];

  const suggestions = [...spellSuggestions, ...quotationSuggestions, ...dotSuggestions];

  // Replace text with suggestion
  const fixError = (suggestion: string) => {
    if (!Editor.isEditor(editor)) return;
    if (!editor.selection) throw new Error("No selection");

    // Set new text
    Transforms.insertText(editor, suggestion, {
      at: editor.selection.anchor.path,
    });

    // Remove spell error mark
    Transforms.setNodes(
      editor,
      {
        errors: { spellError: undefined, quotationError: undefined, dotError: undefined },
      } as Partial<KorektorrRichText>,
      {
        at: editor.selection?.anchor.path,
      }
    );
  };

  if (!suggestions.length) return;

  return (
    <div className="flex m-1">
      {suggestions.map((suggestion, index) => (
        <ToolbarButton key={index} onClick={() => fixError(suggestion)}>
          {suggestion}
        </ToolbarButton>
      ))}
      {/*{punctuationSuggestion && (*/}
      {/*  <ToolbarButton onClick={() => fixPunctuationError(punctuationSuggestion)}>*/}
      {/*    {punctuationSuggestion}*/}
      {/*  </ToolbarButton>*/}
      {/*)}*/}
    </div>
  );
};

export default FloatingToolbarSuggestions;
