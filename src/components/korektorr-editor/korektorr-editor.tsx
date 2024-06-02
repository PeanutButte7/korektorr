"use client";

import React, { useEffect, useState } from "react";
import { createBasicMarksPlugin, createPlugins, ELEMENT_PARAGRAPH } from "@udecode/plate";
import { Plate, PlateEditor, TDescendant, TElement, useEditorState } from "@udecode/plate-common";
import { Editor as PlateEditorComponent } from "@/components/plate-ui/editor";
import { FloatingToolbar } from "@/components/plate-ui/floating-toolbar";
import { FixedToolbarButtons } from "@/components/plate-ui/fixed-toolbar-buttons";
import FloatingToolbarSuggestions from "@/components/plate-ui/floating-toolbar-suggestions";
import { FixedToolbar } from "@/components/plate-ui/fixed-toolbar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  checkSpellingNormalize,
  useSpellCheckNormalizePlugin,
} from "@/components/korektorr-editor/spell-checker-plugin";
import { useWorker } from "@/app/worker-context";
import { BaseText, Editor as SlateEditor } from "slate";

export type KorektorrRichText = TDescendant & {
  text: string;
  spellError?: boolean;
};

export interface KorektorrParagraphElement extends TElement {
  children: KorektorrRichText[];
  type: typeof ELEMENT_PARAGRAPH;
}

export type KorektorrRootBlock = KorektorrParagraphElement;

export type KorektorrValue = KorektorrRootBlock[];

export type KorektorrEditor = PlateEditor<KorektorrValue>;

const defaultInitialValue: KorektorrValue = [
  {
    type: "p",
    children: [
      {
        text: "Vítejte v českém editoru s automatickou kontrolou chib! Text se ukládá do vašeho prohlížeče, takže se neztratí pokud opustíte stránku.",
      },
    ],
  },
];

const KorektorrEditor = () => {
  const { worker, dictionaryReady } = useWorker();
  const editor = useEditorState<KorektorrValue, KorektorrEditor>();

  const [debugValue, setDebugValue] = useState<KorektorrValue>([]);
  const initialLocalStorageValue = localStorage.getItem("editorValue");

  const plugins = createPlugins([useSpellCheckNormalizePlugin(), createBasicMarksPlugin()]);

  useEffect(() => {
    if (!dictionaryReady) return;

    console.log("Dictionary mounted");
    if (!SlateEditor.isEditor(editor)) return;
    checkSpellingNormalize(editor, worker);
  }, [dictionaryReady]);

  return (
    <div className="bg-background rounded-lg border">
      <Plate
        initialValue={initialLocalStorageValue ? JSON.parse(initialLocalStorageValue) : defaultInitialValue}
        onChange={(newValue) => {
          setDebugValue(newValue);
          localStorage.setItem("editorValue", JSON.stringify(newValue));
        }}
        plugins={plugins}
      >
        <FixedToolbar>
          <FixedToolbarButtons />
        </FixedToolbar>
        <FloatingToolbar>
          <FloatingToolbarSuggestions />
        </FloatingToolbar>
        <PlateEditorComponent placeholder="Začněte psát..." />
        <Accordion type="single" collapsible className="px-4">
          <AccordionItem value="item-1" className="border-none">
            <AccordionTrigger>Otevřít vývojářské informace</AccordionTrigger>
            <AccordionContent>
              <p>{JSON.stringify(debugValue)}</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Plate>
    </div>
  );
};

export default KorektorrEditor;
