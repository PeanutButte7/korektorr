"use client";

import React, { useCallback, useEffect, useState } from "react";
import { BaseEditor, BaseRange, Descendant, Node } from "slate";
import { createBasicMarksPlugin, createPluginFactory, createPlugins } from "@udecode/plate";
import Typo from "typo-js";
import { ENodeEntry, Plate, Value } from "@udecode/plate-common";
import { Editor } from "@/components/plate-ui/editor";
import { FloatingToolbar } from "@/components/plate-ui/floating-toolbar";
import { FloatingToolbarButtons } from "@/components/plate-ui/floating-toolbar-buttons";
import FloatingToolbarSuggestions from "@/components/plate-ui/floating-toolbar-suggestions";
import useSpellCheckPlugin from "@/components/text-editor/spell-checker-plugin";
import { ReactEditor } from "slate-react";
import { HistoryEditor } from "slate-history";

export type TypoDictionary = Typo | null;

// Load Typo.js dictionary
const loadDictionary = async () => {
  const affResponse = await fetch("/dictionaries/cs_CZ.aff");
  const affData = await affResponse.text();

  const dicResponse = await fetch("/dictionaries/cs_CZ.dic");
  const dicData = await dicResponse.text();

  return new Typo("cs_CZ", affData, dicData);
};

const TextEditor = () => {
  const [debugValue, setDebugValue] = useState<Value>([]);
  const [dictionary, setDictionary] = useState<TypoDictionary>(null);

  useEffect(() => {
    loadDictionary().then((value) => {
      setDictionary(value);
    });
  }, []);

  if (!dictionary) {
    return <div>Loading dictionary...</div>;
  }

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
        {/*<FloatingToolbarSuggestions*/}
      </FloatingToolbar>
    </Plate>
  );
};

export default TextEditor;
