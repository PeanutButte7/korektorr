import { BaseText, Editor, Path, Text, Transforms, Node } from "slate";
import { isText } from "@udecode/plate-common";
import { KorektorrEditor, KorektorrRichText } from "@/components/korektorr-editor/korektorr-editor-component";
import { checkHasError } from "@/utils/check-has-error";
import { isKorektorrRichText } from "@/utils/is-korektorr-rich-text";

export const normalizeTextNode = (
  editor: KorektorrEditor,
  node: KorektorrRichText,
  path: Path
): { editor: KorektorrEditor; hasError: boolean } => {
  const hasError = checkHasError(node);
  if (!editor.children || !editor.children.length || !Editor.isEditor(editor)) return { editor, hasError };

  // Try to delete node if it is empty
  if (!node.text) {
    const blockChildren = Node.children(editor, [path[0]]);
    let numberOfChildren = 0;
    for (const _ of blockChildren) {
      numberOfChildren++;
    }

    // If there are more than one child, remove the node. Don't remove if this is the only child.
    if (numberOfChildren > 1) {
      Transforms.removeNodes(editor, { at: path });
      return { editor, hasError: false };
    }
  }

  // Try to merge nodes without errors adjacent to each other
  const nextNodeEntry = Editor.next(editor, { at: path });
  if (nextNodeEntry) {
    const [nextNode, nextNodePath] = nextNodeEntry;
    const nextHasError = isKorektorrRichText(nextNode) && checkHasError(nextNode);

    // If next node and current node don't have errors, merge them
    if (!hasError && !nextHasError) {
      Transforms.mergeNodes(editor, { at: nextNodePath, match: Text.isText });
      return { editor, hasError: false };
    }
  }

  // Try to merge with next node
  const lastChar = node.text.slice(-1);
  const doesEndWithPS = /[.,:;!?()\[\]{}'" \t\n\r]/.test(lastChar);
  const nodeDescendant = Editor.next(editor, { at: path });

  if (!doesEndWithPS) {
    if (!nodeDescendant) return { editor, hasError };

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

  return { editor, hasError };
};
