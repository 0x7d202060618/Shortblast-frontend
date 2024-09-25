import React, { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/functions";
import { ComponentProps } from "@/types";
import Icon, { IconType } from "../Icon";
import RoundLoader from "../Loader/round-loader";

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
export interface ButtonProps
  extends ComponentProps,
    ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariantProps {
  label?: string;
  startIcon?: IconType;
  endIcon?: IconType;
  isLoading?: boolean;
  gradientEffect?: boolean;
}

export default function Button({
  label,
  size,
  startIcon,
  endIcon,
  isLoading,
  gradientEffect = true,
  className,
  variant,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        props.disabled || isLoading || !gradientEffect ? "" : "button",
        buttonVariants({ variant, size, className }),
        className
      )}
      {...props}
    >
      {/* start icon */}
      {!isLoading ? (
        startIcon ? (
          <Icon name={startIcon} size={4}>
            {startIcon}
          </Icon>
        ) : (
          <div />
        )
      ) : (
        <div />
      )}

      {/* if loading, shows loading state, otherwise, shows label */}
      <span className={cn((startIcon || isLoading || endIcon) && "mx-2")}>{label ?? children}</span>

      {/* end icon */}
      {!isLoading ? (
        endIcon ? (
          <Icon name={endIcon} size={5} className="duration-200 group-hover:translate-x-1">
            {endIcon}
          </Icon>
        ) : (
          <div />
        )
      ) : (
        <RoundLoader color="#FFFFFF" visible={isLoading} />
      )}
    </button>
  );
}
