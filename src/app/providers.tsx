"use client";

import { ReactNode } from "react";
import { WorkerProvider } from "@/app/worker-context";
import { TooltipProvider } from "@/components/plate-ui/tooltip";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <WorkerProvider>
      <TooltipProvider disableHoverableContent delayDuration={500} skipDelayDuration={0}>
        {children}
      </TooltipProvider>
    </WorkerProvider>
  );
};

export default Providers;
