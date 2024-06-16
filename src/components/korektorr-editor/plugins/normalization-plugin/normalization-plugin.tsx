import { useWorker } from "@/app/worker-context";
import { useKorektorr } from "@/app/korektorr-context";
import { debouncedCheckSpellingNormalize } from "@/components/korektorr-editor/plugins/spell-checker-plugin/spell-checker-plugin";
import { createPluginFactory } from "@udecode/plate";
import { Editor, Transforms, Element, Text, Node } from "slate";
import { isKorektorrRichText } from "@/utils/is-korektorr-rich-text";

export const useNormalizationPlugin = () => {
  return createPluginFactory({
    key: "normalization",
    withOverrides: (editor) => {
      if (!Editor.isEditor(editor)) return editor;
      const { normalizeNode } = editor;

      // @ts-ignore
      editor.normalizeNode = ([node, path]) => {
        const { normalizeNode } = editor;

        // If node is a paragraph, cycle through its children
        if (Element.isElement(node) && "type" in node && node.type === "p") {
          for (const [child, childPath] of Node.children(editor, path)) {
            // Add path to node
            if (isKorektorrRichText(child)) {
              if (!child.path || JSON.stringify(child.path) !== JSON.stringify(childPath)) {
                Transforms.setNodes(editor, { path: childPath } as Partial<any>, { at: childPath });
                return;
              }
            }
          }
        }

        if (isKorektorrRichText(node)) {
          // Add path to node
          if (!node.path || JSON.stringify(node.path) !== JSON.stringify(path)) {
            Transforms.setNodes(editor, { path: path } as Partial<any>, { at: path });
            return;
          }
        }

        // normalizeNode([node, path]);
      };

      return editor;
    },
  })();
};
