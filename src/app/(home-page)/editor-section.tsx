"use client";

import React, { useEffect, useState } from "react";
import KorektorrEditorComponent from "@/components/korektorr-editor/korektorr-editor-component";
import TopBar from "@/app/(home-page)/top-bar";
import SideBar from "@/app/(home-page)/side-bar/side-bar";

const getInitialSideBarState = () => {
  const savedState = localStorage.getItem("sideBarOpen");
  return savedState ? JSON.parse(savedState) : true;
};

const EditorSection = () => {
  const [sideBarOpen, setSideBarOpen] = useState(getInitialSideBarState);

  useEffect(() => {
    localStorage.setItem("sideBarOpen", JSON.stringify(sideBarOpen));
  }, [sideBarOpen]);

  return (
    <div className="flex gap-2 mt-24">
      <div className="flex flex-col gap-2 flex-grow">
        <TopBar sideBarOpen={sideBarOpen} setSideBarOpen={setSideBarOpen} />
        <KorektorrEditorComponent />
      </div>
      {sideBarOpen && <SideBar setSideBarOpen={setSideBarOpen} />}
    </div>
  );
};

export default EditorSection;
