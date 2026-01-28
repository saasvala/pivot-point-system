import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98] touch-manipulation",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-glow-primary",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
        outline: "border-2 border-input bg-transparent hover:bg-muted hover:text-foreground hover:border-primary/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm hover:shadow-glow-secondary",
        ghost: "hover:bg-muted hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // POS specific variants
        pos: "bg-card text-card-foreground border-2 border-border hover:border-primary/50 hover:bg-muted h-auto min-h-[80px] flex-col gap-1 p-4 rounded-xl shadow-soft hover:shadow-lg",
        posCategory: "bg-muted text-foreground border-2 border-transparent hover:border-primary/30 h-auto min-h-[60px] flex-col gap-1 p-3 rounded-xl font-semibold hover:bg-primary/10",
        posAction: "bg-primary/10 text-primary border-2 border-primary/30 hover:bg-primary/20 hover:border-primary/50 font-semibold",
        posCheckout: "bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold text-lg shadow-glow-primary hover:shadow-glow-secondary transition-shadow",
        posCancel: "bg-destructive/10 text-destructive border-2 border-destructive/30 hover:bg-destructive/20",
        // Glass variants
        glass: "glass-card text-foreground hover:bg-muted/50",
        // Gradient variants
        gradient: "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-glow-primary hover:shadow-glow-secondary",
        gradientOutline: "border-2 border-primary/50 bg-transparent hover:bg-primary/10 hover:border-primary",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
        iconLg: "h-12 w-12",
        pos: "h-16 px-6",
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
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
