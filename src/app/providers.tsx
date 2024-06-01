"use client";

import { ReactNode } from "react";
import { WorkerProvider } from "@/app/worker-context";
import { TooltipProvider } from "@/components/plate-ui/tooltip";
import { PlateController } from "@udecode/plate-common";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <WorkerProvider>
      <PlateController>
        <TooltipProvider disableHoverableContent delayDuration={500} skipDelayDuration={0}>
          {children}
          <Analytics />
          <SpeedInsights />
        </TooltipProvider>
      </PlateController>
    </WorkerProvider>
  );
};

export default Providers;
