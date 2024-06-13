import { KorektorrRichText } from "@/components/korektorr-editor/korektorr-editor-component";
import { Editor, Transforms, Text, Range } from "slate";

export const checkWord = async (
  word: string,
  range: Range,
  node: KorektorrRichText,
  worker: Worker,
  editor: Editor
) => {
  const { isCorrect, spellSuggestions } = await workerCheckSpelling(word, worker);

  if (!isCorrect) {
    Transforms.setNodes(
      editor,
      {
        errors: {
          spellError: {
            suggestions: spellSuggestions,
            prioritySuggestion: spellSuggestions ? spellSuggestions[0] : undefined,
          },
        },
      } as Partial<KorektorrRichText>,
      {
        at: range,
        match: Text.isText,
        split: true,
      }
    );

    return editor;
  } else if (isCorrect && node.errors?.spellError) {
    // Remove the spell error mark
    Transforms.setNodes(editor, { errors: { spellError: undefined } } as Partial<KorektorrRichText>, {
      at: range,
      match: Text.isText,
    });
  }
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
