import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-normal disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-[3px] focus-visible:ring-primary/20 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-accent hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0",
        destructive:
          "bg-error text-white shadow-sm hover:bg-error/90 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 focus-visible:ring-error/20 dark:focus-visible:ring-error/40",
        outline:
          "border border-border bg-background shadow-sm hover:bg-secondary hover:text-foreground hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-muted hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0",
        ghost:
          "hover:bg-secondary hover:text-foreground hover:scale-[1.02] dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline hover:text-accent",
        success:
          "bg-success text-white shadow-sm hover:bg-success/90 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0",
        warning:
          "bg-warning text-foreground shadow-sm hover:bg-warning/90 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0",
        info:
          "bg-info text-white shadow-sm hover:bg-info/90 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 text-xs",
        lg: "h-10 rounded-lg px-6 has-[>svg]:px-4 text-base",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
