import { Editor, Node, Path } from "slate";
import { KorektorrRichText } from "@/components/korektorr-editor/korektorr-editor-component";
import { isKorektorrRichText } from "@/utils/is-korektorr-rich-text";

export const iterateEditorChildren = (
  editor: Editor,
  callback: (node: KorektorrRichText, path: Path) => void,
  reverse = false
) => {
  for (const [block, blockPath] of Node.children(editor, [], { reverse })) {
    for (const [child, childPath] of Node.children(editor, blockPath, { reverse })) {
      if (isKorektorrRichText(child)) {
        callback(child, childPath);
      }
    }
  }
};
