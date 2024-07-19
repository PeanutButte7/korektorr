"use client";

import React, { useEffect, useState } from "react";
import KorektorrEditorComponent from "@/components/korektorr-editor/korektorr-editor-component";
import TopBar from "@/app/(home-page)/top-bar";
import SideBar from "@/app/(home-page)/side-bar/side-bar";
import { useGetUserDictionary } from "@/app/slovnik/queries";
import { createBrowserClient } from "@/utils/supabase/browser";
import { User } from "@supabase/supabase-js";

interface EditorSectionProps {
  user: User | null;
}

const getInitialSideBarState = () => {
  const savedState = localStorage.getItem("sideBarOpen");
  return savedState ? JSON.parse(savedState) : true;
};

const EditorSection = ({ user }: EditorSectionProps) => {
  const supabase = createBrowserClient();
  const [sideBarOpen, setSideBarOpen] = useState(getInitialSideBarState);

  const dictionaryQuery = useGetUserDictionary(supabase, user !== null);

  useEffect(() => {
    localStorage.setItem("sideBarOpen", JSON.stringify(sideBarOpen));
  }, [sideBarOpen]);

  // If user is not logged in, bypass dictionary query
  if (!dictionaryQuery.isSuccess && user) return null;

  // If user is not logged in, return an empty dictionary
  const dictionary = dictionaryQuery.data ?? [];

  return (
    <div className="flex gap-2">
      <div className="flex flex-col gap-2 flex-grow">
        <TopBar sideBarOpen={sideBarOpen} setSideBarOpen={setSideBarOpen} dictionary={dictionary} />
        <KorektorrEditorComponent dictionary={dictionary} />
      </div>
      {sideBarOpen && <SideBar setSideBarOpen={setSideBarOpen} user={user} />}
    </div>
  );
};

export default EditorSection;
