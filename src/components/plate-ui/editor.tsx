import React from "react";

import type { PlateContentProps } from "@udecode/plate-common";
import { PlateContent } from "@udecode/plate-common";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { cn } from "@udecode/cn";
import { useWorker } from "@/app/worker-context";

const Editor = React.forwardRef<HTMLDivElement, PlateContentProps>(
  ({ className, disabled, readOnly, ...props }, ref) => {
    const { dictionaryReady } = useWorker();

    return (
      <div className="relative w-full" ref={ref}>
        <PlateContent
          spellCheck={false}
          renderLeaf={({ attributes, children, leaf }) => {
            const spellError = dictionaryReady && !!leaf.spellError;
            const punctuationError = !!leaf.punctuationError;
            const bold = !!leaf.bold;
            const italic = !!leaf.italic;
            const underline = !!leaf.underline;
            const strikethrough = !!leaf.strikethrough;

            return (
              <span
                {...attributes}
                className={cn(
                  spellError && "underline decoration-2 decoration-red-500",
                  punctuationError && "underline decoration-2 decoration-amber-400",
                  bold && "font-bold",
                  italic && "italic",
                  underline && "underline",
                  strikethrough && "line-through"
                )}
              >
                {children}
              </span>
            );
          }}
          aria-disabled={disabled}
          className={cn(
            " relative overflow-x-auto whitespace-pre-wrap break-words",
            "min-h-[80px] h-[50vh] w-full rounded-md bg-card px-3 py-2 font-paragraph text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none",
            "[&_[data-slate-placeholder]]:text-muted-foreground [&_[data-slate-placeholder]]:!opacity-100",
            "[&_[data-slate-placeholder]]:top-[auto_!important]",
            "[&_strong]:font-bold"
          )}
          disableDefaultStyles
          readOnly={disabled ?? readOnly}
          {...props}
        />
      </div>
    );
  }
);

Editor.displayName = "Editor";

export { Editor };
