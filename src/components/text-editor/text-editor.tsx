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

const defaultInitialValue = [
  {
    children: [
      {
        text: "Toto je editor s automatickou kontrolou chyb!",
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
      <Editor placeholder="Začněte psát..." />
      <p>{JSON.stringify(debugValue)}</p>
      <FloatingToolbar>
        <FloatingToolbarSuggestions />
      </FloatingToolbar>
    </Plate>
  );
};

export default TextEditor;
