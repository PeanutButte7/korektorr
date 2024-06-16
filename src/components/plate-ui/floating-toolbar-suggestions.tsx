import { isText, useEditorSelector } from "@udecode/plate-common";
import { BaseText, Editor, Node, Transforms } from "slate";
import { ToolbarButton } from "@/components/plate-ui/toolbar";
import { useWorker } from "@/app/worker-context";
import { useEffect, useState } from "react";
import { KorektorrRichText } from "@/components/korektorr-editor/korektorr-editor-component";

const suggestWord = async (word: string, worker: Worker): Promise<string[]> => {
  return new Promise((resolve) => {
    worker.postMessage({ type: "suggest_word", word });

    worker.onmessage = (event) => {
      const message = event.data;
      if (message.type === "word_suggested") {
        resolve(message.suggestions);
      }
    };
  });
};

const FloatingToolbarSuggestions = () => {
  const { worker, dictionaryReady } = useWorker();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const editor = useEditorSelector((editor) => {
    return editor;
  }, []);

  // Get suggestions
  useEffect(() => {
    const getSuggestions = async () => {
      if (!dictionaryReady) return;
      if (!Editor.isEditor(editor)) throw new Error("Editor is not an instance of Editor");

      const selection = editor.selection;
      if (!selection) return;

      const node = Node.get(editor, selection.anchor.path) as KorektorrRichText;
      if (!isText(node)) throw new Error("Node is not a text node");
      if (!node.errors?.spellError) return; // Return if there is no spell error
      if (node.text.length > 20) return; // Return if the text is too long and would cause too long of a load time

      const suggestions = await suggestWord(node.text, worker);
      setSuggestions(suggestions);
    };

    getSuggestions();
  }, [dictionaryReady, editor, worker]);

  const selection = editor.selection;
  if (!selection) return;

  const node = Node.get(editor, selection.anchor.path);
  if (!isText(node)) throw new Error("Node is not a text node");

  const punctuationSuggestion: string = node.punctuationSuggestion as string;

  // Replace text with suggestion
  const fixError = (suggestion: string) => {
    if (!Editor.isEditor(editor)) return;

    // Set new text
    Transforms.insertText(editor, suggestion, {
      at: editor.selection?.anchor.path,
    });

    // Remove spell error mark
    Transforms.setNodes(editor, { errors: { spellError: undefined } } as Partial<KorektorrRichText>, {
      at: editor.selection?.anchor.path,
    });
  };

  const fixPunctuationError = (suggestion: string) => {
    if (!Editor.isEditor(editor)) return;

    // Set new text
    Transforms.insertText(editor, suggestion, {
      at: editor.selection?.anchor.path,
    });

    // Remove punctuation error mark
    Transforms.setNodes(editor, { punctuationError: null, punctuationSuggestion: null } as Partial<BaseText>, {
      at: editor.selection?.anchor.path,
    });
  };

  return (
    <div className="flex bg-slate-100">
      {suggestions.map((suggestion, index) => (
        <ToolbarButton key={index} onClick={() => fixError(suggestion)}>
          {suggestion}
        </ToolbarButton>
      ))}
      {punctuationSuggestion && (
        <ToolbarButton onClick={() => fixPunctuationError(punctuationSuggestion)}>
          {punctuationSuggestion}
        </ToolbarButton>
      )}
    </div>
  );
};

export default FloatingToolbarSuggestions;
