import { useWorker } from "@/app/worker-context";
import { SetDocumentMetrics, useKorektorr } from "@/app/korektorr-context";
import { debouncedCheckSpellingNormalize } from "@/components/korektorr-editor/plugins/spell-checker-plugin/spell-checker-plugin";
import { createPluginFactory } from "@udecode/plate";
import { Editor } from "slate";
import { iterateEditorChildren } from "@/utils/iterate-editor-children";
import { countCharactersWords } from "@/components/korektorr-editor/plugins/document-metrics-plugin/count-characters-words";

const useDocumentMetricsPlugin = () => {
  const { worker } = useWorker();
  const { setDocumentMetrics } = useKorektorr();

  return createPluginFactory({
    key: "documentMetrics",
    handlers: {
      onChange: (editor) => (value) => {
        if (!Editor.isEditor(editor)) {
          throw new Error("useDocumentMetricsPlugin must be used with a Slate editor");
        }

        countCharactersWords(editor, setDocumentMetrics);
      },
    },
  })();
};

export default useDocumentMetricsPlugin;
