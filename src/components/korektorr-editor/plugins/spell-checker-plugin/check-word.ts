import { KorektorrEditor, KorektorrRichText } from "@/components/korektorr-editor/korektorr-editor-component";
import { Editor, Transforms, Text, Range } from "slate";
import { findPrioritySuggestion } from "@/components/korektorr-editor/plugins/spell-checker-plugin/find-priority-suggestion";
import { DictionaryWord } from "@/app/slovnik/queries";
import { findInDictionary } from "@/components/korektorr-editor/plugins/spell-checker-plugin/find-in-dictionary";
import { checkHasError } from "@/utils/check-has-error";
import { resetNodeError } from "@/utils/reset-node-error";

export const checkWord = async (
  word: string,
  range: Range,
  node: KorektorrRichText,
  worker: Worker,
  editor: KorektorrEditor,
  dictionary: DictionaryWord[]
): Promise<{
  editor: KorektorrEditor;
  transformedNode: boolean;
}> => {
  if (!Editor.isEditor(editor)) {
    return {
      editor,
      transformedNode: false,
    };
  }

  // If word is in the dictionary, don't check it
  if (findInDictionary(word, dictionary)) {
    // If it also has an error mark, remove it
    if (node.errors?.spellError) {
      Transforms.setNodes(editor, { errors: { spellError: undefined } } as Partial<KorektorrRichText>, {
        at: range,
        match: Text.isText,
      });

      return {
        editor,
        transformedNode: true,
      };
    }

    return {
      editor,
      transformedNode: false,
    };
  }

  // Otherwise check the word against Hunspell dictionary
  const { isCorrect, spellSuggestions } = await workerCheckSpelling(word, worker);

  // Add dictionary words to the suggestions and find the best among them
  const suggestionsWithDictionary = [...(spellSuggestions ?? []), ...dictionary.map((w) => w.word)];
  const prioritySuggestion = findPrioritySuggestion(word, suggestionsWithDictionary);

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

    return {
      editor,
      transformedNode: true,
    };
  } else if (isCorrect && checkHasError(node)) {
    resetNodeError(editor, range);
    return {
      editor,
      transformedNode: true,
    };
  }

  return {
    editor,
    transformedNode: false,
  };
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
