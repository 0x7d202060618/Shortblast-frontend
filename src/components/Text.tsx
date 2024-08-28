import React from "react";
import type { HTMLAttributes, ElementType } from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/functions";

import type { ComponentProps } from "@/types";

const tags = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  lg: "p",
  md: "p",
  sm: "p",
  vs: "p",
};

export type TextVariantProps = VariantProps<typeof textVariants>;
export const textVariants = cva("", {
  variants: {
    variant: {
      h1: "!font-oswald text-h1 tablet_sm:text-h2 font-700 uppercase",
      h2: "!font-oswald text-h2 tablet_sm:text-h3 font-700 uppercase",
      h3: "!font-oswald text-h3 tablet_sm:text-h4 font-700 uppercase",
      h4: "!font-oswald text-h4 tablet_sm:text-h5 font-700 uppercase",
      h5: "!font-oswald text-h5 tablet_sm:text-lg font-700 uppercase",
      lg: "!font-inter text-lg tablet_sm:text-md mobile_lg:text-sm",
      md: "!font-inter text-md tablet_sm:text-sm mobile_lg:!text-vs",
      sm: "!font-inter text-sm mobile_lg:!text-vs",
      vs: "!font-inter !text-vs",
    },
    intent: {
      default: "text-black dark:text-white",
      primary: "text-primary-light dark:text-primary-dark",
      secondary: "text-black-400 dark:text-white-400",
      warning: "text-warning",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
  },
});

export interface TextProps extends ComponentProps, HTMLAttributes<HTMLElement>, TextVariantProps {
  as?: ElementType;
}

export default function Text({
  children,
  as,
  variant = "md",
  intent,
  align,
  className,
  ...props
}: TextProps) {
  if (variant === undefined || variant === null || !tags[variant]) return null;
  const NextText = as || tags[variant];

  return (
    <NextText {...props} className={cn(textVariants({ variant, intent, align }), className)}>
      {children}
    </NextText>
  );
}
