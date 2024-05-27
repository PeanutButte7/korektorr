"use client";

import React, { useMemo, useCallback, useState, useEffect } from "react";
import { BaseRange, createEditor, Node } from "slate";
import { Editable, Slate, withReact } from "slate-react";
import { withHistory } from "slate-history";
import { createPlugins, ELEMENT_PARAGRAPH, createPluginFactory } from "@udecode/plate";
import Typo from "typo-js";
import { DecorateEntry, ENodeEntry, Plate, PlateEditor, Value } from "@udecode/plate-common";
import { Editor } from "@/components/plate-ui/editor";

type TypoDictionary = Typo | null;

// Load Typo.js dictionary
const loadDictionary = async () => {
  const affResponse = await fetch("/dictionaries/cs_CZ.aff");
  const affData = await affResponse.text();

  const dicResponse = await fetch("/dictionaries/cs_CZ.dic");
  const dicData = await dicResponse.text();

  return new Typo("cs_CZ", affData, dicData);
};

const checkSpelling = (entry: ENodeEntry<Value>, dictionary: TypoDictionary): BaseRange[] => {
  const [node, path] = entry;

  if (!Node.string(node)) {
    return [];
  }

  const ranges: BaseRange[] = [];
  const text = Node.string(node);
  // Regular expression to match words and exclude punctuation
  // Regular expression to match words including diacritics
  const wordRegex = /\b[\p{L}]+\b/gu;
  const words = text.match(wordRegex);

  if (!words) {
    return ranges;
  }

  let start = 0;
  words.forEach((word) => {
    const wordStart = text.indexOf(word, start);
    const wordEnd = wordStart + word.length;

    // If word is spelled incorrectly, highlight it
    if (dictionary && !dictionary.check(word)) {
      console.log("Checking word against dictionary", word, dictionary.check(word));
      ranges.push({
        anchor: { path, offset: wordStart },
        focus: { path, offset: wordEnd },
        spellError: true, // Custom property to highlight errors
      });
    }

    // Update start to the end of the current word plus one to account for spaces/punctuation
    start = wordEnd + 1;
  });

  console.log("returning ranges", ranges);

  return ranges;
};

const useSpellCheckPlugin = (dictionary: TypoDictionary) => {
  return createPluginFactory({
    key: "spellCheck",
    decorate: (editor) => (value) => checkSpelling(value, dictionary),
  })();
};

const TextEditor = () => {
  const [dictionary, setDictionary] = useState<TypoDictionary>(null);

  useEffect(() => {
    loadDictionary().then((value) => {
      setDictionary(value);
      console.log("Loaded dictionary", value);
    });
  }, []);

  if (!dictionary) {
    return <div>Loading dictionary...</div>;
  }

  const spellCheckPlugin = useSpellCheckPlugin(dictionary);
  const plugins = createPlugins([spellCheckPlugin]);

  return (
    <main className="container mt-2">
      <Plate plugins={plugins}>
        <Editor placeholder="Enter some text..." />
      </Plate>
    </main>
  );
};

export default TextEditor;
