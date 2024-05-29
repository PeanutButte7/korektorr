"use client";

import React, { useEffect, useState } from "react";
import TextEditor from "@/components/text-editor/text-editor";
import Typo from "typo-js";

type TypoDictionary = Typo | null;

// Load Typo.js dictionary
const loadDictionary = async () => {
  const affResponse = await fetch("/dictionaries/cs_CZ.aff");
  const affData = await affResponse.text();

  const dicResponse = await fetch("/dictionaries/cs_CZ.dic");
  const dicData = await dicResponse.text();

  return new Typo("cs_CZ", affData, dicData);
};

const HomePage = () => {
  const [dictionary, setDictionary] = useState<TypoDictionary>(null);

  useEffect(() => {
    loadDictionary().then((value) => {
      setDictionary(value);
    });
  }, []);

  return (
    <main className="container mt-20 mx-auto gap-4 flex flex-col">
      <h1 className="text-center text-4xl font-bold">Korektorr</h1>
      {dictionary ? <TextEditor dictionary={dictionary} /> : <p>Loading dictionary...</p>}
    </main>
  );
};

export default HomePage;
