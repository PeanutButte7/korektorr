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
import { checkQuotes } from "@/components/korektorr-editor/plugins/spell-checker-plugin/check-quotes";
import { resetNodeError } from "@/utils/reset-node-error";

export const checkNode = async (
  editor: KorektorrEditor,
  node: KorektorrRichText,
  path: Path,
  worker: Worker,
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

  const text = Node.string(node);
  const partRegex = /(\p{L}+|[^\p{L}\s"“”‘’„‟]+|["“”‘’„‟]|\s+)/gu;
  const parts = text.match(partRegex);
  const nodeIgnoreQuoteDot = !!node.ignoreQuoteDot;

  if (!parts) {
    return {
      editor,
      transformedNode: false,
    };
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
      if (nodeIgnoreQuoteDot) {
        continue;
      }

      const transformedNode = checkDots(part, range, node, editor);
      if (transformedNode) {
        return {
          editor,
          transformedNode: true,
        };
      }
    }
    // If word is only from quotation marks
    else if (/^[“”"‘’„‟]+$/.test(part)) {
      if (nodeIgnoreQuoteDot) {
        continue;
      }

      const transformedNode = checkQuotes(part, range, editor);
      if (transformedNode) {
        return {
          editor,
          transformedNode: true,
        };
      }
    }
    // If word is made from letters
    if (/^\p{L}+$/u.test(part)) {
      const { editor: newEditor, transformedNode } = await checkWord(part, range, node, worker, editor, dictionary);
      if (transformedNode) {
        return {
          editor: newEditor,
          transformedNode: true,
        };
      }
    }
    // If part is unknown such as a punctuation mark, it should not have an error
    else if (checkHasError(node)) {
      const newEditor = resetNodeError(editor, range);
      return {
        editor: newEditor,
        transformedNode: true,
      };
    }
  }

  return {
    editor,
    transformedNode: false,
  };
};
