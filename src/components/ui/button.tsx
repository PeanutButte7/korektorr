import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/cn";
import LoadingSpinner from "@/components/ui/loading-spinner";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-70 hover:no-underline",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-pop border-white/70 border-y hover:bg-blue-700",
        // secondary: "bg-white text-foreground shadow-pop border-white/70 border-y hover:bg-background/90",
        outline: "border bg-white hover:bg-background text-foreground hover:text-foreground/80",
        fancy:
          "bg-gradient-to-b from-blue-500 via-blue-700 to-blue-600 text-primary-foreground shadow-pop border-white/70 border-y hover:shadow-inner-soft !bg-size-200 bg-pos-0 hover:bg-pos-100",
        ghost: "hover:bg-background hover:text-foreground/90",
        link: "text-foreground underline-offset-4 underline hover:no-underline",
      },
      size: {
        default: "h-9 px-4 [&>svg]:h-4 [&>svg]:w-4",
        sm: "h-8 px-3 [&>svg]:h-4 [&>svg]:w-4",
        icon: "h-9 w-9",
        "icon-sm": "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(loading && "!text-transparent", buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        <LoadingSpinner size={18} className={cn("absolute text-white", !loading && "hidden")} />
        {props.children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
