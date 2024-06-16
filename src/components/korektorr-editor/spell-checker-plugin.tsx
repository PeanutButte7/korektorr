import { Editor } from "slate";
import { createPluginFactory } from "@udecode/plate";
import { useWorker } from "@/app/worker-context";
import { checkNode } from "@/components/korektorr-editor/utils/spell-checker/check-node";
import { normalizeTextNode } from "@/components/korektorr-editor/utils/normalize-text-node";
import { KorektorrEditor, KorektorrRichText } from "@/components/korektorr-editor/korektorr-editor-component";
import { SetErrorLeafs, useKorektorr } from "@/app/korektorr-context";

const checkSpellingNormalize = async (editor: KorektorrEditor, worker: Worker, setErrorLeafs: SetErrorLeafs) => {
  let currentEditor = editor;
  let blockIndex = 0;

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
      currentEditor = await checkNode(currentEditor, node, [blockIndex, nodeIndex], worker);
      nodeIndex++;
    }

    blockIndex++;
  }

  // Normalize text nodes
  blockIndex = 0; // Reset block index
  let errorLeafs: KorektorrRichText[] = [];
  // Go through blocks in the editor
  while (blockIndex < editor.children.length) {
    let nodeIndex = 0;

    // Go through nodes in the block
    // @ts-ignore

    while (nodeIndex < currentEditor.children[blockIndex].children.length) {
      // @ts-ignore
      const node = currentEditor.children[blockIndex].children[nodeIndex];

      // Update the editor with the changed editor
      const { editor, hasError } = normalizeTextNode(currentEditor, node, [blockIndex, nodeIndex]);
      currentEditor = editor;

      if (hasError) {
        errorLeafs.push(node);
      }

      nodeIndex++;
    }

    blockIndex++;
  }

  // Set hasError flag if there is any error in the editor
  setErrorLeafs(errorLeafs);
};

const debouncedCheckSpellingNormalize = debounce(
  async (editor: KorektorrEditor, worker: Worker, setErrorLeafs: SetErrorLeafs) => {
    await checkSpellingNormalize(editor, worker, setErrorLeafs);
  },
  300
);

function debounce(func: (...args: any[]) => void, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return function (...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

const useSpellCheckNormalizePlugin = () => {
  const { worker } = useWorker();
  const { setErrorLeafs } = useKorektorr();

  return createPluginFactory({
    key: "spellCheck",
    handlers: {
      onKeyDown: (editor) => (value) => {
        if (!Editor.isEditor(editor)) {
          throw new Error("useSpellCheckPlugin must be used with a Slate editor");
        }

        console.log("Typed");
        Editor.withoutNormalizing(editor, () => {
          debouncedCheckSpellingNormalize(editor, worker, setErrorLeafs);
        });
      },
      onPaste: (editor) => (event) => {
        if (!Editor.isEditor(editor)) {
          throw new Error("useSpellCheckPlugin must be used with a Slate editor");
        }

        console.log("Pasted");
        Editor.withoutNormalizing(editor, () => {
          debouncedCheckSpellingNormalize(editor, worker, setErrorLeafs);
        });
      },
    },
  })();
};

export { useSpellCheckNormalizePlugin, checkSpellingNormalize, debouncedCheckSpellingNormalize };
