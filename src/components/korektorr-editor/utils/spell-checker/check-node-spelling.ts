import { BaseText, Editor, Node, Path, Range, Text, Transforms } from "slate";
import {
  KorektorrEditor,
  KorektorrParagraphElement,
  KorektorrRichText,
} from "@/components/korektorr-editor/korektorr-editor-component";
import { checkWord } from "@/components/korektorr-editor/utils/spell-checker/check-word";
import { checkDots } from "@/components/korektorr-editor/utils/spell-checker/check-dots";

export const checkNodeSpelling = async (
  editor: KorektorrEditor,
  node: KorektorrRichText,
  path: Path,
  worker: Worker
) => {
  if (!Editor.isEditor(editor)) {
    return editor;
  }

  const text = Node.string(node);
  const wordRegex = /(\p{L}+|\.+)/gu;
  const words = text.match(wordRegex);

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

    // If word is only from dots
    if (/^\.+$/.test(word)) {
      checkDots(word, range, editor);
      continue;
    }

    await checkWord(word, range, node, worker, editor);
  }

  return editor;
};
