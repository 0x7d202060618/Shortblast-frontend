import millify from "millify";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { FormatNumberOptions } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const truncateAddress = (walletAddress: string, len = 4) => {
  return walletAddress.slice(0, len) + "..." + walletAddress.slice(-len);
};

export const formatNumber = (
  value: string | number | null | undefined,
  {
    prefix = "",
    suffix = "",
    thousandSeparator = true,
    decimalScale = 2,
    isPercentage = false,
    truncateTinyValue = false,
    useMillify = false,
    placeholder = "N/A",
  }: FormatNumberOptions = {}
): string => {
  if (value === undefined || value === null) return placeholder;

  let numberValue = Number(value);

  if (isPercentage && suffix === "") {
    suffix = "%";
  }

  if (numberValue === 0) {
    return `${prefix}0${suffix}`;
  }

  if (truncateTinyValue && numberValue < 0.0001) {
    return `${prefix}${isPercentage ? "<0.01" : "<0.0001"}${suffix}`;
  }

  if (Math.abs(numberValue) < 1e-6) {
    numberValue = 0;
  }

  if (isPercentage) {
    numberValue *= 100;
  }

  if (useMillify) {
    return prefix + millify(numberValue, { precision: decimalScale }) + suffix;
  }

  let formattedValue = numberValue.toFixed(decimalScale);
  formattedValue = parseFloat(formattedValue).toString();

  if (thousandSeparator) {
    const parts = formattedValue.split(".");
    const separator = typeof thousandSeparator === "string" ? thousandSeparator : ",";
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    formattedValue = parts.join(".");
  }

  return `${prefix}${formattedValue}${suffix}`;
};
