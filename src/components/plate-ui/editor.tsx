import React from "react";

import type { PlateContentProps } from "@udecode/plate-common";
import { PlateContent } from "@udecode/plate-common";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { cn } from "@udecode/cn";
import { useWorker } from "@/app/worker-context";
import { KorektorrRichText } from "@/components/korektorr-editor/korektorr-editor-component";

const Editor = React.forwardRef<HTMLDivElement, PlateContentProps>(
  ({ className, disabled, readOnly, ...props }, ref) => {
    const { dictionaryReady } = useWorker();

    return (
      <div className="relative w-full h-full" ref={ref}>
        <PlateContent
          spellCheck={false}
          renderLeaf={({ attributes, children, leaf }) => {
            const typedLeaf = leaf as KorektorrRichText;

            const dotError = !!typedLeaf.errors?.dotError;
            const spellError = !!typedLeaf.errors?.spellError;
            const quotationError = !!typedLeaf.errors?.quotationError;
            const punctuationError = !!typedLeaf.errors?.punctuationError;
            const bold = !!typedLeaf.bold;
            const italic = !!typedLeaf.italic;
            const underline = !!typedLeaf.underline;
            const strikethrough = !!typedLeaf.strikethrough;

            return (
              <span
                {...attributes}
                className={cn(
                  dotError && "underline decoration-2 decoration-error-dot",
                  quotationError && "underline decoration-2 decoration-error-quotation",
                  spellError && "underline decoration-2 decoration-error-spell",
                  punctuationError && "underline decoration-2 decoration-error-punctuation",
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
            "min-h-[32rem] h-full w-full rounded-md bg-card px-3 py-2 font-paragraph text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none",
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
