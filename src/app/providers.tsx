"use client";

import { ReactNode } from "react";
import { WorkerProvider } from "@/app/worker-context";
import { PlateController } from "@udecode/plate-common";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { KorektorrProvider } from "@/app/korektorr-context";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { TooltipProvider } from "@/components/ui/tooltip";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 100,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
    persistence: localStorage.getItem("cookie_consent") === "yes" ? "localStorage+cookie" : "memory",
  });
}

const Providers = ({ children }: { children: ReactNode }) => {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient();

  return (
    <PostHogProvider client={posthog}>
      <QueryClientProvider client={queryClient}>
        <WorkerProvider>
          <PlateController>
            <KorektorrProvider>
              <TooltipProvider>{children}</TooltipProvider>
            </KorektorrProvider>
          </PlateController>
        </WorkerProvider>
        <SpeedInsights />
        <Analytics />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </PostHogProvider>
  );
};

export default Providers;
