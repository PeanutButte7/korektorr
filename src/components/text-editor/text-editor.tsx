"use client";

import React, { useState } from "react";
import { createBasicMarksPlugin, createPlugins } from "@udecode/plate";
import Typo from "typo-js";
import { Plate, Value } from "@udecode/plate-common";
import { Editor } from "@/components/plate-ui/editor";
import { FloatingToolbar } from "@/components/plate-ui/floating-toolbar";
import { FloatingToolbarButtons } from "@/components/plate-ui/floating-toolbar-buttons";
import FloatingToolbarSuggestions from "@/components/plate-ui/floating-toolbar-suggestions";
import useSpellCheckPlugin from "@/components/text-editor/spell-checker-plugin";

const TextEditor = ({ dictionary }: { dictionary: Typo }) => {
  const [debugValue, setDebugValue] = useState<Value>([]);

  const spellCheckPlugin = useSpellCheckPlugin(dictionary);
  const plugins = createPlugins([spellCheckPlugin, createBasicMarksPlugin()]);

  return (
    <Plate
      onChange={(newValue) => {
        setDebugValue(newValue);
      }}
      plugins={plugins}
    >
      <Editor placeholder="Začněte psát..." />
      <p>{JSON.stringify(debugValue)}</p>
      <FloatingToolbar>
        <FloatingToolbarButtons />
        <FloatingToolbarSuggestions dictionary={dictionary} />
      </FloatingToolbar>
    </Plate>
  );
};

export default TextEditor;
