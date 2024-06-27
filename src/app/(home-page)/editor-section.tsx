"use client";

import React, { useEffect, useState } from "react";
import KorektorrEditorComponent from "@/components/korektorr-editor/korektorr-editor-component";
import TopBar from "@/app/(home-page)/top-bar";
import SideBar from "@/app/(home-page)/side-bar/side-bar";
import { useGetUserDictionary } from "@/app/slovnik/queries";
import { createBrowserClient } from "@/utils/supabase/browser";

const getInitialSideBarState = () => {
  const savedState = localStorage.getItem("sideBarOpen");
  return savedState ? JSON.parse(savedState) : true;
};

const EditorSection = () => {
  const supabase = createBrowserClient();
  const [sideBarOpen, setSideBarOpen] = useState(getInitialSideBarState);

  const dictionaryQuery = useGetUserDictionary(supabase);

  useEffect(() => {
    localStorage.setItem("sideBarOpen", JSON.stringify(sideBarOpen));
  }, [sideBarOpen]);

  if (!dictionaryQuery.isSuccess) return null;

  return (
    <div className="flex gap-2 mt-24">
      <div className="flex flex-col gap-2 flex-grow">
        <TopBar sideBarOpen={sideBarOpen} setSideBarOpen={setSideBarOpen} />
        <KorektorrEditorComponent dictionary={dictionaryQuery.data} />
      </div>
      {sideBarOpen && <SideBar setSideBarOpen={setSideBarOpen} />}
    </div>
  );
};

export default EditorSection;
