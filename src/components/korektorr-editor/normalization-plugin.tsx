import { useWorker } from "@/app/worker-context";
import { useKorektorr } from "@/app/korektorr-context";
import { debouncedCheckSpellingNormalize } from "@/components/korektorr-editor/spell-checker-plugin";
import { createPluginFactory } from "@udecode/plate";
import { Editor, Transforms } from "slate";
import { isText } from "@udecode/plate-common";

export const useNormalizationPlugin = () => {
  return createPluginFactory({
    key: "normalization",
    withOverrides: (editor) => {
      if (!Editor.isEditor(editor)) return editor;
      const { normalizeNode } = editor;

      // @ts-ignore
      editor.normalizeNode = ([node, path]) => {
        if (!node.path || JSON.stringify(node.path) !== JSON.stringify(path)) {
          Transforms.setNodes(editor, { path: path } as Partial<any>, { at: path });
          return;
        }
      };

      return editor;
    },
  })();
};
