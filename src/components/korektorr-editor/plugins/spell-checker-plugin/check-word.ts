import { KorektorrRichText } from "@/components/korektorr-editor/korektorr-editor-component";
import { Editor, Transforms, Text, Range } from "slate";
import { findPrioritySuggestion } from "@/components/korektorr-editor/plugins/spell-checker-plugin/find-priority-suggestion";

export const checkWord = async (
  word: string,
  range: Range,
  node: KorektorrRichText,
  worker: Worker,
  editor: Editor
) => {
  const { isCorrect, spellSuggestions } = await workerCheckSpelling(word, worker);

  const prioritySuggestion = findPrioritySuggestion(word, spellSuggestions);

  if (!isCorrect) {
    Transforms.setNodes(
      editor,
      {
        errors: {
          spellError: {
            suggestions: spellSuggestions,
            prioritySuggestion: prioritySuggestion,
          },
        },
      } as Partial<KorektorrRichText>,
      {
        at: range,
        match: Text.isText,
        split: true,
      }
    );
  } else if (isCorrect && node.errors?.spellError) {
    // Remove the spell error mark
    Transforms.setNodes(editor, { errors: { spellError: undefined } } as Partial<KorektorrRichText>, {
      at: range,
      match: Text.isText,
    });
  }

  return editor;
};

const workerCheckSpelling = async (
  word: string,
  worker: Worker
): Promise<{
  isCorrect: boolean;
  spellSuggestions?: string[];
}> => {
  return new Promise((resolve) => {
    worker.postMessage({ type: "check_word", word });

    worker.onmessage = (event) => {
      const message = event.data;
      if (message.type === "word_checked") {
        resolve({ isCorrect: message.isCorrect, spellSuggestions: message.spellSuggestions });
      }
    };
  });
};
