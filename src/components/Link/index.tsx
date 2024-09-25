import React from "react";

import NextLink, { type LinkProps as NextLinkProps } from "next/link";

import Icon from "../Icon";
import type { ComponentProps } from "@/types";
import { cn } from "@/utils/functions";

export interface LinkProps extends ComponentProps, Omit<NextLinkProps, "href"> {
  path: string;
  external?: boolean;
  hideIcon?: boolean;
  iconSize?: 2.5 | 3 | 4;
  childClassName?: string;
}

export default function Link({
  children,
  path,
  external = false,
  hideIcon = false,
  iconSize,
  className,
  childClassName,
  ...props
}: LinkProps) {
  if (external) {
    return (
      <NextLink
        href={path}
        target="_blank"
        rel="noopener noreferrer"
        className={cn("flex w-fit flex-row items-center space-x-1 hover:underline", className)}
      >
        <div className={childClassName}>{children}</div>
        {!hideIcon && <Icon name="external" size={iconSize ? iconSize : 4} />}
      </NextLink>
    );
  }

  return (
    <NextLink href={path} {...props} className={cn("w-fit", className)}>
      {children}
    </NextLink>
  );
}
