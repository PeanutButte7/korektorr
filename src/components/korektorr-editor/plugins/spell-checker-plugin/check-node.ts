import { BaseText, Editor, Node, Path, Range, Text, Transforms } from "slate";
import {
  KorektorrEditor,
  KorektorrParagraphElement,
  KorektorrRichText,
} from "@/components/korektorr-editor/korektorr-editor-component";
import { checkWord } from "@/components/korektorr-editor/plugins/spell-checker-plugin/check-word";
import { checkDots } from "@/components/korektorr-editor/plugins/spell-checker-plugin/check-dots";
import { checkHasError } from "@/utils/check-has-error";
import { DictionaryWord } from "@/app/slovnik/queries";

export const checkNode = async (
  editor: KorektorrEditor,
  node: KorektorrRichText,
  path: Path,
  worker: Worker,
  dictionary: DictionaryWord[]
) => {
  if (!Editor.isEditor(editor)) {
    return editor;
  }

  const text = Node.string(node);
  const partRegex = /(\p{L}+|\p{P}+|\s+)/gu;
  const parts = text.match(partRegex);

  if (!parts) {
    return editor;
  }

  for (const part of parts) {
    const partStart = text.indexOf(part);
    const partEnd = partStart + part.length;
    const range = {
      anchor: { path, offset: partStart },
      focus: { path, offset: partEnd },
    };

    // If word is only from dots
    if (/^\.+$/.test(part)) {
      checkDots(part, range, editor);
    }
    // If word is made from letters
    else if (/^\p{L}+$/u.test(part)) {
      await checkWord(part, range, node, worker, editor, dictionary);
    }
    // If part is unknown such as a punctuation mark, it should not have an error
    else if (checkHasError(node)) {
      Transforms.setNodes(
        editor,
        { errors: { spellError: undefined, dotError: undefined } } as Partial<KorektorrRichText>,
        {
          at: range,
          match: Text.isText,
          split: true,
        }
      );
    }
  }
  return editor;
};
