import { KorektorrEditor, KorektorrRichText } from "@/components/korektorr-editor/korektorr-editor-component";
import { Transforms, Text, BaseEditor, Range, Path, Editor } from "slate";

export const resetNodeError = (editor: KorektorrEditor, rangePath: Range | Path) => {
  if (!Editor.isEditor(editor)) {
    return editor;
  }

  if (Range.isRange(rangePath)) {
    Transforms.setNodes(
      editor,
      {
        errors: { spellError: undefined, dotError: undefined, quotationError: undefined },
      } as Partial<KorektorrRichText>,
      {
        at: rangePath,
        match: Text.isText,
        split: true,
      }
    );
  } else {
    Transforms.setNodes(
      editor,
      {
        errors: { dotError: undefined, spellError: undefined, quotationError: undefined },
      } as Partial<KorektorrRichText>,
      {
        at: rangePath,
      }
    );
  }

  return editor;
};
