import React from "react";
import KorektorrEditorComponent from "@/components/korektorr-editor/korektorr-editor-component";
import WorkerIndicator from "@/app/(home-page)/worker-indicator";

const HomePage = async () => {
  return (
    <>
      <h1 className="text-center mt-20 mb-4 text-4xl font-bold text-muted-foreground">Korektorr</h1>
      <WorkerIndicator />
      <KorektorrEditorComponent />
    </>
  );
};

export default HomePage;
