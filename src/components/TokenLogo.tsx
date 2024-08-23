import React from "react";

import type { ComponentProps } from "@/types";
import { Image } from "@/components";
import { FAILOVER_IMAGE } from "@/utils/constants";
import { cn } from "@/utils/functions";

export interface TokenLogoProps extends ComponentProps {
  imageUrl: string | undefined;
  alt: string | undefined;
  size?: 4 | 5 | 6 | 8 | 10 | 12;
  verified?: boolean;
}

export default function TokenLogo({
  imageUrl,
  alt,
  size = 6,
  verified = true,
  className,
}: TokenLogoProps) {
  return (
    <div
      className={cn(
        `relative w-${size} h-${size} rounded-full overflow-hidden`,
        className
      )}
    >
      <Image
        unoptimized
        src={imageUrl ? imageUrl : FAILOVER_IMAGE}
        alt={alt || "Unknown Token"}
        width={size * 4}
        height={size * 4}
        className="absolute inset-0 min-w-full min-h-full"
      />
    </div>
  );
}
