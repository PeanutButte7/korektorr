"use client";

import React, { useState } from "react";
import { createBasicMarksPlugin, createPlugins } from "@udecode/plate";
import { Plate, Value } from "@udecode/plate-common";
import { Editor } from "@/components/plate-ui/editor";
import { FloatingToolbar } from "@/components/plate-ui/floating-toolbar";
import { FixedToolbarButtons } from "@/components/plate-ui/fixed-toolbar-buttons";
import FloatingToolbarSuggestions from "@/components/plate-ui/floating-toolbar-suggestions";
import useSpellCheckPlugin from "@/components/text-editor/spell-checker-plugin";
import { FixedToolbar } from "@/components/plate-ui/fixed-toolbar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const defaultInitialValue = [
  {
    children: [
      {
        text: "Vítejte v českém editoru s automatickou kontrolou chyb! Text se ukládá do vašeho prohlížeče, takže se neztratí pokud opustíte stránku.",
      },
    ],
    type: "p",
  },
];

const TextEditor = () => {
  const [debugValue, setDebugValue] = useState<Value>([]);
  const initialLocalStorageValue = localStorage.getItem("editorValue");

  const spellCheckPlugin = useSpellCheckPlugin();
  const plugins = createPlugins([spellCheckPlugin, createBasicMarksPlugin()]);

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
        <Editor placeholder="Začněte psát..." />
        <Accordion type="single" collapsible className="px-4">
          <AccordionItem value="item-1" className="border-none">
            <AccordionTrigger>Open debug info</AccordionTrigger>
            <AccordionContent>
              <p>{JSON.stringify(debugValue)}</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Plate>
    </div>
  );
};

export default TextEditor;
