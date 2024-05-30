import { ENode, ENodeEntry, TNode, Value } from "@udecode/plate-common";
import { BaseText, Editor, Node, Path, Text, Transforms } from "slate";
import { createPluginFactory } from "@udecode/plate";
import { useWorker } from "@/app/worker-context";

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

const checkSpelling = async (editor: Editor, entry: ENodeEntry<Value>, worker: Worker) => {
  const [node, path] = entry;

  if (!Node.string(node)) {
    return;
  }

  const text = Node.string(node);
  const wordRegex = /(\p{L}+)/gu;
  const words = text.match(wordRegex);

  if (!words) {
    return;
  }

  for (const word of words) {
    console.log("Checking word: ", word);
    const wordStart = text.indexOf(word);
    const wordEnd = wordStart + word.length;
    const range = {
      anchor: { path, offset: wordStart },
      focus: { path, offset: wordEnd },
    };

    const isCorrect = await checkWord(word, worker);

    if (!isCorrect && !node.spellError) {
      console.log("Word is incorrect: ", word);

      Transforms.setNodes(editor, { spellError: true } as Partial<BaseText>, {
        at: range,
        match: Text.isText,
        split: true,
      });
    } else if (isCorrect && node.spellError) {
      // Remove the spell error mark
      Transforms.setNodes(editor, { spellError: false } as Partial<BaseText>, {
        at: range,
        match: Text.isText,
      });
    }
  }
};

const debouncedCheckSpelling = debounce((editor: Editor, [node, path]: [ENode<Value>, Path], worker: Worker) => {
  checkSpelling(editor, [node, path], worker);
}, 500);

function debounce(func: (...args: any[]) => void, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return function (...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

const useSpellCheckPlugin = () => {
  const { worker } = useWorker();

  return createPluginFactory({
    key: "spellCheck",
    withOverrides: (editor) => {
      const { normalizeNode } = editor;
      if (!Editor.isEditor(editor)) {
        throw new Error("useSpellCheckPlugin must be used with a Slate editor");
      }

      editor.normalizeNode = ([node, path]: [Node, Path]) => {
        if (Text.isText(node)) {
          debouncedCheckSpelling(editor, [node, path], worker);
        }

        normalizeNode([node as TNode, path]);
      };

      return editor;
    },
  })();
};

export default useSpellCheckPlugin;
