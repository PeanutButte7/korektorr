"use client";

import React from "react";
import TextEditor from "@/components/text-editor/text-editor";

const HomePage = () => {
  return (
    <main className="container mt-20 mx-auto gap-4 flex flex-col">
      <h1 className="text-center text-4xl font-bold">Korektorr</h1>
      <TextEditor />
    </main>
  );
};

export default HomePage;
