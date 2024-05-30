"use client";

import { ReactNode } from "react";
import { WorkerProvider } from "@/app/worker-context";

const Providers = ({ children }: { children: ReactNode }) => {
  return <WorkerProvider>{children}</WorkerProvider>;
};

export default Providers;
