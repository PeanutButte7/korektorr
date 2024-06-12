import { BaseText, Editor, Node, Path, Text, Transforms } from "slate";
import {
  KorektorrEditor,
  KorektorrParagraphElement,
  KorektorrRichText,
} from "@/components/korektorr-editor/korektorr-editor-component";

const checkWord = async (
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
export const checkNodeSpelling = async (
  editor: KorektorrEditor,
  node: KorektorrRichText,
  path: Path,
  worker: Worker
) => {
  const text = Node.string(node);
  const wordRegex = /(\p{L}+)/gu;
  const words = text.match(wordRegex);

  if (!Editor.isEditor(editor)) {
    return editor;
  }

  if (!words) {
    return editor;
  }

  for (const word of words) {
    const wordStart = text.indexOf(word);
    const wordEnd = wordStart + word.length;
    const range = {
      anchor: { path, offset: wordStart },
      focus: { path, offset: wordEnd },
    };
    const { isCorrect, spellSuggestions } = await checkWord(word, worker);

    if (!isCorrect) {
      Transforms.setNodes(editor, { spellError: true, spellSuggestions } as Partial<KorektorrRichText>, {
        at: range,
        match: Text.isText,
        split: true,
      });

      return editor;
    } else if (isCorrect && node.spellError) {
      // Remove the spell error mark
      Transforms.setNodes(editor, { spellError: false, spellSuggestions: undefined } as Partial<KorektorrRichText>, {
        at: range,
        match: Text.isText,
      });
    }
  }

  return editor;
};
