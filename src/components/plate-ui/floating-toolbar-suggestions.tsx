import React from "react";
import { isText, useEditorSelector } from "@udecode/plate-common";
import { Editor, Node, Transforms } from "slate";
import Typo from "typo-js";
import { ToolbarButton } from "@/components/plate-ui/toolbar";

const FloatingToolbarSuggestions = ({ dictionary }: { dictionary: Typo }) => {
  const editor = useEditorSelector((editor) => {
    return editor;
  }, []);

  if (!Editor.isEditor(editor)) throw new Error("Editor is not an instance of Editor");

  const selection = editor.selection;
  if (!selection) return null;

  const node = Node.get(editor, selection.anchor.path);
  if (!isText(node)) throw new Error("Node is not a text node");
  if (!node.spellError) return null; // Return if there is no spell error
  if (node.text.length > 20) return null; // Return if the text is too long and would cause the site to hang

  const suggestions = dictionary.suggest(node.text) ?? ["no suggestions"];

  const fixError = (suggestion: string) => {
    Transforms.insertText(editor, suggestion, {
      at: selection.anchor.path,
    });
  };

  return (
    <div className="flex bg-slate-100">
      {suggestions.map((suggestion, index) => (
        <ToolbarButton key={index} onClick={() => fixError(suggestion)}>
          {suggestion}
        </ToolbarButton>
      ))}
    </div>
  );
};

export default FloatingToolbarSuggestions;
