"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input, InputProps } from "../ui/input";

export interface FormattedNumberInputProps extends Omit<InputProps, "onChange"> {
  value: string;
  onChange?: (value: string) => boolean | void;
}

const FormattedNumberInput: React.FC<FormattedNumberInputProps> = ({
  value,
  onChange,
  onBlur,
  ...props
}) => {
  const [formattedValue, setFormattedValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  useEffect(() => {
    if (!isFocused) setFormattedValue(value === "0" ? "" : formatInputValue(value));
  }, [value]);

  const handleCursorChange = () => {
    if (inputRef.current) {
      setCursorPosition(inputRef.current.selectionStart);
    }
  };

  const formatInputValue = (input: string) => {
    if (input) {
      const numberParts = input.split(".");
      const wholeNumber = numberParts[0].replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return numberParts.length === 2 ? `${wholeNumber}.${numberParts[1]}` : wholeNumber;
    } else {
      return "";
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!inputRef.current) return;
    let selectionStart = event.target.selectionStart;
    const previousValue = inputRef.current.value;

    let rawValue = event.target.value.replace(/,/g, "");

    if (rawValue === ".") {
      if (formattedValue === "") {
        rawValue = "0.";
      } else {
        rawValue = "";
      }
    }
    const numberRegEx = /^[0-9]*\.?[0-9]*$/;

    if (!numberRegEx.test(rawValue)) {
      return;
    }

    if (onChange && onChange(rawValue) === false) {
      return;
    }

    const newFormattedValue = formatInputValue(rawValue);
    setFormattedValue(newFormattedValue);

    if (inputRef.current && selectionStart !== null) {
      const isDeletingComma =
        newFormattedValue[selectionStart] === "," &&
        previousValue.length + 1 === newFormattedValue.length;

      inputRef.current.value = newFormattedValue;

      if (isDeletingComma) {
        // If deleting forward
        if (selectionStart === cursorPosition)
          inputRef.current.setSelectionRange(selectionStart + 1, selectionStart + 1);
        // If deleting backward
        else inputRef.current.setSelectionRange(selectionStart, selectionStart);
      } else {
        const diff = newFormattedValue.length - previousValue.length;
        selectionStart = Math.max(selectionStart + diff, 0);
        inputRef.current.setSelectionRange(selectionStart, selectionStart);
      }
    }
  };

  const handleFocusEvent = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
  };

  const handleBlurEvent = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (onBlur) {
      onBlur(event);
    }
    // Format the input value when the input field loses focus
    const rawValue = Number(value).toString();
    onChange && onChange(rawValue);
    setFormattedValue(rawValue === "0" ? "" : formatInputValue(rawValue));
  };

  return (
    <Input
      {...props}
      ref={inputRef}
      type="tel"
      value={formattedValue}
      onChange={handleChange}
      onClick={handleCursorChange}
      onKeyUp={handleCursorChange}
      onFocus={handleFocusEvent}
      onBlur={handleBlurEvent}
    />
  );
};

export default FormattedNumberInput;
