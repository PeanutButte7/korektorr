import { ENode, ENodeEntry, isElement, TNode, Value } from "@udecode/plate-common";
import { TypoDictionary } from "@/components/text-editor/text-editor";
import { BaseRange, Editor, Node, Path, Transforms, Text, BaseText, BaseElement } from "slate";
import { createPluginFactory } from "@udecode/plate";

const checkSpelling = (editor: Editor, entry: ENodeEntry<Value>, dictionary: TypoDictionary): void => {
  const [node, path] = entry;

  if (!Node.string(node)) {
    return;
  }

  const text = Node.string(node);
  const wordRegex = /(\p{L}+)/gu;
  const words = text.match(wordRegex);
  console.log("words", words);

  if (!words) {
    return;
  }

  let match;
  while ((match = wordRegex.exec(text)) !== null) {
    if (!dictionary) return;

    const word = match[0];
    const wordStart = match.index;
    const wordEnd = wordStart + word.length;
    const range = {
      anchor: { path, offset: wordStart },
      focus: { path, offset: wordEnd },
    };

    if (!dictionary.check(word)) {
      // Does the node already have a spell error mark?
      const marks = Editor.marks(editor);
      const spellErrorMark = marks && Object.values(marks).includes("spellError");
      // console.log(range);
      // console.log("spellErrorMark", spellErrorMark);

      // if (!spellErrorMark) {
      //   Transforms.wrapNodes(editor, { spellError: true }, { at: range, match: Text.isText });
      // }
      Transforms.setNodes(editor, { spellError: true } as Partial<BaseText>, {
        at: range,
        match: Text.isText,
        split: true,
      });
    } else {
      // Remove the spell error mark
      Transforms.setNodes(editor, { spellError: false } as Partial<BaseText>, { at: range, match: Text.isText });
    }
  }
};

const debouncedCheckSpelling = debounce((editor: Editor, [node, path]: [ENode<Value>, Path], dictionary: any) => {
  checkSpelling(editor, [node, path], dictionary);
}, 100);

function debounce(func: (...args: any[]) => void, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return function (...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

const useSpellCheckPlugin = (dictionary: TypoDictionary) => {
  return createPluginFactory({
    key: "spellCheck",
    withOverrides: (editor) => {
      const { normalizeNode } = editor;
      if (!Editor.isEditor(editor)) {
        throw new Error("useSpellCheckPlugin must be used with a Slate editor");
      }

      editor.normalizeNode = ([node, path]: [Node, Path]) => {
        if (Text.isText(node)) {
          debouncedCheckSpelling(editor, [node, path], dictionary);
        }

        normalizeNode([node as TNode, path]);
      };

      return editor;
    },
  })();
};

export default useSpellCheckPlugin;
