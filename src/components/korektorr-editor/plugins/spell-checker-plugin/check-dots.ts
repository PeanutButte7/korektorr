import { Editor, Range, Transforms, Text } from "slate";
import { KorektorrRichText } from "@/components/korektorr-editor/korektorr-editor-component";

export const checkDots = (word: string, range: Range, editor: Editor) => {
  // Match two dots or 4 or more dots
  if (/^(\.\.)$/.test(word)) {
    Transforms.setNodes(
      editor,
      { errors: { dotError: { suggestions: [".", "..."], prioritySuggestion: "." } } } as Partial<KorektorrRichText>,
      {
        at: range,
        match: Text.isText,
        split: true,
      }
    );

    return true;
  } else if (/^(\.{4,})$/.test(word)) {
    Transforms.setNodes(
      editor,
      { errors: { dotError: { suggestions: [".", "..."], prioritySuggestion: "..." } } } as Partial<KorektorrRichText>,
      {
        at: range,
        match: Text.isText,
        split: true,
      }
    );

    return true;
  }
  // Match three dots or a single dot and remove the spell error
  else {
    Transforms.setNodes(editor, { errors: { dotError: undefined } } as Partial<KorektorrRichText>, {
      at: range,
      match: Text.isText,
    });

    return true;
  }
};
