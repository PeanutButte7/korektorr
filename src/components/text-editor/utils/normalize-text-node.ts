import { BaseText, Editor, Path, Text, Transforms } from "slate";
import { isText } from "@udecode/plate-common";

export const normalizeTextNode = (editor: Editor, node: BaseText, path: Path) => {
  // console.log("Normalize text node", node, editor, path);
  if (!node.text || !editor.children || !editor.children.length) return editor;

  // Try to merge with next node
  const lastChar = node.text.slice(-1);
  const doesEndWithPS = /[.,:;!?()\[\]{}'" \t\n\r]/.test(lastChar);

  if (!doesEndWithPS) {
    const nodeDescendant = Editor.next(editor, { at: path });
    if (!nodeDescendant) return editor;

    const [nextNode, nextNodePath] = nodeDescendant;
    // console.log("currentNode", node);

    if (isText(nextNode)) {
      const nextDoesStartWithPS = /[.,:;!?()\[\]{}'" \t\n\r]/.test(nextNode.text.slice(0, 1));
      // console.log(
      //   "Checking for merge with next node",
      //   nextNode,
      //   "char",
      //   nextNode.text.slice(0, 1),
      //   "nextDoesStartWithPS",
      //   nextDoesStartWithPS
      // );
      if (!nextDoesStartWithPS) {
        // console.log("Merging with next node at path" + nextNodePath);
        Transforms.mergeNodes(editor, { at: nextNodePath, match: Text.isText });
      }
    }
  }

  return editor;
};
