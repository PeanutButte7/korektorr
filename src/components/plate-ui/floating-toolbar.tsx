"use client";

import React from "react";

import { cn, withRef } from "@udecode/cn";
import { PortalBody, useComposedRef } from "@udecode/plate-common";
import {
  flip,
  type FloatingToolbarState,
  offset,
  useFloatingToolbar,
  useFloatingToolbarState,
} from "@udecode/plate-floating";

import { Toolbar, ToolbarGroup } from "./toolbar";
import FloatingToolbarSuggestions from "@/components/plate-ui/floating-toolbar-suggestions";
import FloatingToolbarAddToDictionary from "@/components/plate-ui/floating-toolbar-add-to-dictionary";
import { Separator } from "@/components/ui/separator";

export const FloatingToolbar = withRef<
  typeof Toolbar,
  {
    state?: FloatingToolbarState;
  }
>(({ state, ...props }, componentRef) => {
  const floatingToolbarState = useFloatingToolbarState({
    ...state,
    floatingOptions: {
      middleware: [
        offset(12),
        flip({
          fallbackPlacements: ["top-start", "top-end", "bottom-start", "bottom-end"],
          padding: 12,
        }),
      ],
      placement: "bottom",
      ...state?.floatingOptions,
    },
  });

  const { hidden, props: rootProps, ref: floatingRef } = useFloatingToolbar(floatingToolbarState);

  const ref = useComposedRef<HTMLDivElement>(componentRef, floatingRef);

  if (hidden) return null;

  return (
    <PortalBody>
      <Toolbar
        className={cn(
          "absolute z-50 flex flex-col items-start whitespace-nowrap border bg-card opacity-100 shadow-pop rounded-md"
        )}
        ref={ref}
        {...rootProps}
        {...props}
      >
        <FloatingToolbarSuggestions />
        <FloatingToolbarAddToDictionary />
      </Toolbar>
    </PortalBody>
  );
});
