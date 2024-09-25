"use client";

import React from "react";

import { TailSpin } from "react-loader-spinner";

export interface RoundLoaderProps {
  width?: string | number;
  height?: string | number;
  color?: string;
  visible?: boolean;
}

export default function RoundLoader({
  width = 20,
  height = 20,
  color,
  visible = false,
}: RoundLoaderProps) {
  return (
    <TailSpin
      width={width}
      height={height}
      color={color ? color : "#FFFFFF"}
      ariaLabel="tail-spin-loading"
      radius="1"
      wrapperStyle={{}}
      wrapperClass=""
      visible={visible}
    />
  );
}
