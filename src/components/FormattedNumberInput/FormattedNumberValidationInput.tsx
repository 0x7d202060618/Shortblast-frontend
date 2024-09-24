"use client";

import React from "react";

import FormattedNumberInput, { FormattedNumberInputProps } from ".";
import { Text } from "..";

interface FormattedNumberValidationInputProps extends FormattedNumberInputProps {
  validate: boolean;
  validationMessage: string;
  validationStyle: string;
}

const FormattedNumberValidationInput: React.FC<FormattedNumberValidationInputProps> = ({
  validate,
  validationMessage,
  validationStyle,
  ...props
}) => {
  return (
    <div className="relative">
      <FormattedNumberInput {...props} />
      {validate && (
        <div className="absolute -bottom-5 -left-56 w-72">
          <Text variant={"sm"} className="text-danger">
            {validationMessage}
          </Text>
        </div>
      )}
    </div>
  );
};

export default FormattedNumberValidationInput;
