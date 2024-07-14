"use client";

import React, { useEffect, useState } from "react";
import { createBasicMarksPlugin, createPlugins, ELEMENT_PARAGRAPH } from "@udecode/plate";
import { Plate, PlateEditor, TDescendant, TElement, useEditorRef } from "@udecode/plate-common";
import { Editor as PlateEditorComponent } from "@/components/plate-ui/editor";
import { FloatingToolbar } from "@/components/plate-ui/floating-toolbar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  checkSpellingNormalize,
  useSpellCheckNormalizePlugin,
} from "@/components/korektorr-editor/plugins/spell-checker-plugin/spell-checker-plugin";
import { useWorker } from "@/app/worker-context";
import { Editor as SlateEditor, Path } from "slate";
import { useKorektorr } from "@/app/korektorr-context";
import { useNormalizationPlugin } from "@/components/korektorr-editor/plugins/normalization-plugin/normalization-plugin";
import { countCharactersWords } from "@/components/korektorr-editor/plugins/document-metrics-plugin/count-characters-words";
import useDocumentMetricsPlugin from "@/components/korektorr-editor/plugins/document-metrics-plugin/document-metrics-plugin";
import { DictionaryWord } from "@/app/slovnik/queries";

export type ErrorType = "dotError" | "spellError" | "quotationError"; // Add more error types as needed

export type ErrorDetails = {
  suggestions?: string[]; // For spell and other suggestions
  prioritySuggestion?: string;
};

export type KorektorrRichText = TDescendant & {
  text: string;
  path?: Path;
  ignoreQuoteDot?: boolean;
  errors?: {
    [key in ErrorType]?: ErrorDetails;
  };
};

export interface KorektorrParagraphElement extends TElement {
  children: KorektorrRichText[];
  type: typeof ELEMENT_PARAGRAPH;
}

export type KorektorrRootBlock = KorektorrParagraphElement;

export type KorektorrValue = KorektorrRootBlock[];

export type KorektorrEditor = PlateEditor<KorektorrValue>;

const KorektorrEditorComponent = ({ dictionary }: { dictionary: DictionaryWord[] }) => {
  const { setErrorLeafs, setDocumentMetrics, debug } = useKorektorr();
  const { worker, dictionaryReady } = useWorker();
  const editor = useEditorRef<KorektorrValue, KorektorrEditor>();

  const [debugValue, setDebugValue] = useState<KorektorrValue>([]);
  const initialLocalStorageValue = localStorage.getItem("editorValue");

  const plugins = createPlugins([
    useSpellCheckNormalizePlugin(dictionary),
    useNormalizationPlugin(),
    useDocumentMetricsPlugin(),
    createBasicMarksPlugin(),
  ]);
  // const getPunctuationErrors = useGetPunctuationErrors(editor);

  useEffect(() => {
    if (!SlateEditor.isEditor(editor)) return;
    countCharactersWords(editor, setDocumentMetrics);

    if (!dictionaryReady) return;
    checkSpellingNormalize(editor, worker, setErrorLeafs, dictionary);
  }, [dictionaryReady, editor]);

  return (
    <div className="relative bg-background rounded-lg border shadow-pop flex-grow">
      {/*<Button*/}
      {/*  onClick={() => {*/}
      {/*    getPunctuationErrors.mutate(editor.children);*/}
      {/*    // setPunctuationErrors(editor, []);*/}
      {/*  }}*/}
      {/*  className="self-start"*/}
      {/*>*/}
      {/*  {getPunctuationErrors.isPending ? "Analyzing..." : "Analyze sentences"}*/}
      {/*</Button>*/}
      <Plate
        normalizeInitialValue
        initialValue={initialLocalStorageValue ? JSON.parse(initialLocalStorageValue) : undefined}
        onChange={(newValue) => {
          setDebugValue(newValue);
          localStorage.setItem("editorValue", JSON.stringify(newValue));
        }}
        plugins={plugins}
      >
        <FloatingToolbar />
        <PlateEditorComponent placeholder="Začněte psát..." />
      </Plate>
      {debug && (
        <div className="absolute bg-background">
          {debugValue.map((node, index) => (
            <div key={"parentDebug" + index}>
              {/*{JSON.stringify(node)}*/}
              <div className="border-l border-red-400 ml-2 pl-2">
                {node.children.map((childNode, childIndex) => (
                  <p key={"childDebug" + childIndex} className="my-1 bg-slate-100">
                    {JSON.stringify(childNode)}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KorektorrEditorComponent;
