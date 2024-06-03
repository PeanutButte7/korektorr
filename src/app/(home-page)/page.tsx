import React from "react";
import KorektorrEditor from "@/components/korektorr-editor/korektorr-editor";
import { useWorker } from "@/app/worker-context";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { IconDiscountCheckFilled } from "@tabler/icons-react";
import { createServerClient } from "@/utils/supabase/server";
import WorkerIndicator from "@/app/(home-page)/worker-indicator";

const HomePage = async () => {
  return (
    <>
      <h1 className="text-center mt-20 mb-4 text-4xl font-bold text-muted-foreground">Korektorr</h1>
      <WorkerIndicator />
      <KorektorrEditor />
    </>
  );
};

export default HomePage;
