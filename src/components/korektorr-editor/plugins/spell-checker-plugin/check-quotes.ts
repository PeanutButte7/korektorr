import { Editor, Range, Node, Transforms, Text } from "slate";
import { KorektorrRichText } from "@/components/korektorr-editor/korektorr-editor-component";
import { iterateEditorChildren } from "@/utils/iterate-editor-children";

export const checkQuotes = (word: string, range: Range, editor: Editor) => {
  let quotationMarkCount = 0;

  // Count quotation marks in the editor
  iterateEditorChildren(editor, (node, path) => {
    // Check only nodes before and including the current word
    if (path[1] > range.anchor.path[1]) return;

    const matches = node.text.match(/[“”‘’„‟"']/g);
    quotationMarkCount += matches?.length ?? 0;
  });

  if (quotationMarkCount % 2 === 1 && word !== "„") {
    Transforms.setNodes(
      editor,
      {
        errors: { quotationError: { suggestions: ["„", "“"], prioritySuggestion: "„" } },
      } as Partial<KorektorrRichText>,
      {
        at: range,
        match: Text.isText,
        split: true,
      }
    );

    return true;
  } else if (quotationMarkCount % 2 === 0 && word !== "“") {
    Transforms.setNodes(
      editor,
      {
        errors: { quotationError: { suggestions: ["„", "“"], prioritySuggestion: "“" } },
      } as Partial<KorektorrRichText>,
      {
        at: range,
        match: Text.isText,
        split: true,
      }
    );

    return true;
  }

  return false;
};
