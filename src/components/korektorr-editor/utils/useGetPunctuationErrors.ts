import { Suggestions, setPunctuationErrors } from "@/components/korektorr-editor/utils/setPuctuationErrors";
import { KorektorrEditor, KorektorrValue } from "@/components/korektorr-editor/korektorr-editor-component";
import { useMutation } from "@tanstack/react-query";
import { Node } from "slate";

export const useGetPunctuationErrors = (editor: KorektorrEditor) => {
  return useMutation({
    mutationFn: async (editorValue: KorektorrValue) => {
      const res = await fetch("/sentence-analysis", {
        method: "POST",
        body: JSON.stringify({
          editorValue: JSON.stringify(editorValue),
        }),
      });
      return await res.json();
    },
    onSuccess: (data) => {
      if (!data.suggestions) throw new Error("New editor was not created by the AI");

      const suggestions: Suggestions = data.suggestions;
      console.log("Suggestions", suggestions);
      setPunctuationErrors(editor, suggestions);
    },
  });
};
