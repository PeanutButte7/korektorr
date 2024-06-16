import { SetDocumentMetrics } from "@/app/korektorr-context";
import { iterateEditorChildren } from "@/utils/iterate-editor-children";
import { Editor } from "slate";

export const countCharactersWords = (editor: Editor, setDocumentMetrics: SetDocumentMetrics) => {
  let characterCount = 0;
  let wordCount = 0;

  iterateEditorChildren(editor, (node, path) => {
    console.log("node", node);
    characterCount += node.text.length;
    wordCount += node.text.match(/(\w+)/g)?.length || 0;
  });

  setDocumentMetrics({ characterCount, wordCount });
};
