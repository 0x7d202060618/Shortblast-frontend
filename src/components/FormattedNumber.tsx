import React from "react";

import { formatNumber } from "@/utils/functions";
import { FormatNumberOptions } from "@/types";
import Text, { TextProps } from "./Text";

export interface FormattedNumberProps
  extends Omit<TextProps, "children">,
    FormatNumberOptions {
  value: string | number | null | undefined;
}

const FormattedNumber: React.FC<FormattedNumberProps> = ({
  value,
  decimalScale,
  prefix,
  suffix,
  thousandSeparator,
  isPercentage,
  truncateTinyValue,
  useMillify,
  placeholder,
  ...props
}) => {
  const formattedNumber = formatNumber(value, {
    decimalScale,
    prefix,
    suffix,
    thousandSeparator,
    isPercentage,
    truncateTinyValue,
    useMillify,
    placeholder,
  });

  return <Text {...props}>{formattedNumber}</Text>;
};

export const TokenAmountNumber: React.FC<FormattedNumberProps> = ({
  value,
  decimalScale = 9,
  ...props
}) => {
  return (
    <FormattedNumber value={value} decimalScale={decimalScale} {...props} />
  );
};

export const CurrencyNumber: React.FC<FormattedNumberProps> = ({
  value,
  decimalScale = 2,
  prefix = "$",
  useMillify = true,
  ...props
}) => {
  return (
    <FormattedNumber
      value={value}
      decimalScale={decimalScale}
      prefix={prefix}
      useMillify={useMillify}
      {...props}
    />
  );
};

export const PercentageNumber: React.FC<FormattedNumberProps> = ({
  value,
  isPercentage = true,
  truncateTinyValue = true,
  ...props
}) => {
  return (
    <FormattedNumber
      value={value}
      isPercentage={isPercentage}
      truncateTinyValue={truncateTinyValue}
      {...props}
    />
  );
};

export default FormattedNumber;
