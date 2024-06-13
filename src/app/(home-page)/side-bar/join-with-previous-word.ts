import { Editor, Path, Text } from "slate";
import { KorektorrEditor } from "@/components/korektorr-editor/korektorr-editor-component";

export const joinWithPreviousWord = (text: string, path: Path, editor: KorektorrEditor) => {
  if (!Editor.isEditor(editor)) return text;
  const prevNodeEntry = Editor.previous(editor, { at: path });

  if (!prevNodeEntry) return text;
  const [prevNode, prevPath] = prevNodeEntry;

  if (!Text.isText(prevNode)) return text;
  const hasTrailingSpace = prevNode.text.endsWith(" ");
  const trimmedText = prevNode.text.trim();
  const prevLastWord = trimmedText.split(" ").pop();

  console.log("prevLastWord", prevLastWord, "text", prevNode.text);
  return hasTrailingSpace ? prevLastWord + " " + text : prevLastWord + text;
};
