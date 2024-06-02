import { Editor } from "slate";
import { createPluginFactory } from "@udecode/plate";
import { useWorker } from "@/app/worker-context";
import { checkNodeSpelling } from "@/components/korektorr-editor/utils/check-node-spelling";
import { normalizeTextNode } from "@/components/korektorr-editor/utils/normalize-text-node";
import { KorektorrEditor } from "@/components/korektorr-editor/korektorr-editor";
import { isInline, isText } from "@udecode/plate-common";

const checkSpellingNormalize = async (editor: KorektorrEditor, worker: Worker) => {
  let currentEditor = editor;
  let blockIndex = 0;

  // TODO: Do this recursively
  // It's important to fetch from the current editor, because the editor is being mutated

  // Check spelling
  // Go through blocks in the editor
  while (blockIndex < editor.children.length) {
    let nodeIndex = 0;

    // Go through nodes in the block
    // @ts-ignore
    while (nodeIndex < currentEditor.children[blockIndex].children.length) {
      // @ts-ignore
      const node = currentEditor.children[blockIndex].children[nodeIndex];

      // Update the editor with the changed editor
      currentEditor = await checkNodeSpelling(currentEditor, node, [blockIndex, nodeIndex], worker);
      nodeIndex++;
    }

    blockIndex++;
  }

  // Normalize text nodes
  // Reset block index
  blockIndex = 0;
  // Go through blocks in the editor
  while (blockIndex < editor.children.length) {
    let nodeIndex = 0;

    // Go through nodes in the block
    // @ts-ignore

    while (nodeIndex < currentEditor.children[blockIndex].children.length) {
      // @ts-ignore
      const node = currentEditor.children[blockIndex].children[nodeIndex];

      // Update the editor with the changed editor
      currentEditor = normalizeTextNode(currentEditor, node, [blockIndex, nodeIndex]);
      nodeIndex++;
    }

    blockIndex++;
  }
};

const debouncedCheckSpellingNormalize = debounce(async (editor: KorektorrEditor, worker: Worker) => {
  await checkSpellingNormalize(editor, worker);
}, 300);

function debounce(func: (...args: any[]) => void, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return function (...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

const useSpellCheckNormalizePlugin = () => {
  const { worker } = useWorker();

  return createPluginFactory({
    key: "spellCheck",
    handlers: {
      onKeyDown: (editor) => (value) => {
        if (!Editor.isEditor(editor)) {
          throw new Error("useSpellCheckPlugin must be used with a Slate editor");
        }

        console.log("Typed");
        Editor.withoutNormalizing(editor, () => {
          debouncedCheckSpellingNormalize(editor, worker);
        });
      },
      onPaste: (editor) => (event) => {
        if (!Editor.isEditor(editor)) {
          throw new Error("useSpellCheckPlugin must be used with a Slate editor");
        }

        console.log("Pasted");
        Editor.withoutNormalizing(editor, () => {
          debouncedCheckSpellingNormalize(editor, worker);
        });
      },
    },
  })();
};

export { useSpellCheckNormalizePlugin, checkSpellingNormalize, debouncedCheckSpellingNormalize };
