import React from "react";

import NextImage from "next/image";
import type { ImageProps as NextImageProps } from "next/image";
import CustomNextImage from "next-export-optimize-images/picture";

import { cn } from "@/utils/functions";

import type { ComponentProps } from "@/types";

export interface ImageProps extends ComponentProps, NextImageProps {
  fill?: boolean;
}

export default function Image({ fill = false, className, ...props }: ImageProps) {
  if (fill) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <NextImage fill sizes="100vw" style={{ objectFit: "cover" }} {...props} />
      </div>
    );
  }

  return (
    <CustomNextImage
      {...props}
      className={cn("duration-100 ease-in max-w-full h-auto", className)}
    />
  );
}
