import { ENode, ENodeEntry, isElement, TNode, Value } from "@udecode/plate-common";
import { TypoDictionary } from "@/components/text-editor/text-editor";
import { BaseRange, Editor, Node, Path, Transforms, Text, BaseText, BaseElement } from "slate";
import { createPluginFactory } from "@udecode/plate";
import Typo from "typo-js";

const checkSpelling = (editor: Editor, entry: ENodeEntry<Value>, dictionary: Typo): void => {
  const [node, path] = entry;
  console.log("checkSpelling", node, path);

  if (!Node.string(node)) {
    return;
  }

  const text = Node.string(node);
  const wordRegex = /(\p{L}+)/gu;
  const words = text.match(wordRegex);

  if (!words) {
    return;
  }

  words.forEach((word) => {
    console.log("Checking word: ", word);
    const wordStart = text.indexOf(word);
    const wordEnd = wordStart + word.length;
    const range = {
      anchor: { path, offset: wordStart },
      focus: { path, offset: wordEnd },
    };

    if (!dictionary.check(word)) {
      console.log("Word is incorrect: ", word);

      Transforms.setNodes(editor, { spellError: true } as Partial<BaseText>, {
        at: range,
        match: Text.isText,
        split: true,
      });
    } else {
      // If node is already in that state do nothing
      if (node.spellError === false) return;

      // Remove the spell error mark
      Transforms.setNodes(editor, { spellError: false } as Partial<BaseText>, {
        at: range,
        match: Text.isText,
      });
    }
  });
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
