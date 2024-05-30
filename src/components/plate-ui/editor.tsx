import React from "react";

import type { PlateContentProps } from "@udecode/plate-common";
import { PlateContent } from "@udecode/plate-common";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { cn } from "@udecode/cn";
import { useWorker } from "@/app/worker-context";

const editorVariants = cva(
  cn(
    "relative overflow-x-auto whitespace-pre-wrap break-words",
    "min-h-[80px] w-full rounded-md bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none",
    "[&_[data-slate-placeholder]]:text-muted-foreground [&_[data-slate-placeholder]]:!opacity-100",
    "[&_[data-slate-placeholder]]:top-[auto_!important]",
    "[&_strong]:font-bold"
  ),
  {
    defaultVariants: {
      size: "sm",
      variant: "outline",
    },
    variants: {
      disabled: {
        true: "cursor-not-allowed opacity-50",
      },
      focused: {
        true: "ring-2 ring-ring ring-offset-2",
      },
      size: {
        md: "text-base",
        sm: "text-sm",
      },
      variant: {
        ghost: "",
        outline: "border border-input",
      },
    },
  }
);

export type EditorProps = PlateContentProps & VariantProps<typeof editorVariants>;

const Editor = React.forwardRef<HTMLDivElement, EditorProps>(
  ({ className, disabled, focused, readOnly, size, variant, ...props }, ref) => {
    const { dictionaryReady } = useWorker();

    return (
      <div className="relative w-full" ref={ref}>
        <PlateContent
          spellCheck={false}
          renderLeaf={({ attributes, children, leaf }) => {
            const spellError = dictionaryReady && !!leaf.spellError;
            const bold = !!leaf.bold;
            const italic = !!leaf.italic;
            const underline = !!leaf.underline;
            const strikethrough = !!leaf.strikethrough;

            return (
              <span
                {...attributes}
                className={cn(
                  spellError && "bg-red-200",
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
            editorVariants({
              disabled,
              focused,
              size,
              variant,
            }),
            className
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
