import { BaseText, Editor, Node, Path, Text, Transforms } from "slate";
import {
  KorektorrEditor,
  KorektorrParagraphElement,
  KorektorrRichText,
} from "@/components/korektorr-editor/korektorr-editor";

const checkWord = async (word: string, worker: Worker): Promise<boolean> => {
  return new Promise((resolve) => {
    worker.postMessage({ type: "check_word", word });

    worker.onmessage = (event) => {
      const message = event.data;
      if (message.type === "word_checked") {
        resolve(message.isCorrect);
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
    const isCorrect = await checkWord(word, worker);

    if (!isCorrect && !node.spellError) {
      Transforms.setNodes(editor, { spellError: true } as Partial<BaseText>, {
        at: range,
        match: Text.isText,
        split: true,
      });

      return editor;
    } else if (isCorrect && node.spellError) {
      // Remove the spell error mark
      Transforms.setNodes(editor, { spellError: false } as Partial<BaseText>, {
        at: range,
        match: Text.isText,
      });
    }
  }

  return editor;
};
