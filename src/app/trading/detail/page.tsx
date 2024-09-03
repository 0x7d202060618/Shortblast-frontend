"use client";
import React from "react";

import { useQueryState } from "nuqs";
import { AdvancedChart } from "react-tradingview-embed";
import { Text } from "@/components";

export default function TokenPairDetail() {
  const [tokenId] = useQueryState("tokenId");

  return (
    <div className="w-full mt-2">
      <div className="p-2 flex gap-2">
        <div className="flex-1 flex flex-col border-[1px] border-gray-800 rounded-md overflow-hidden">
          <div className="w-full h-[50px] bg-gray-800 flex items-center p-5">
            <Text variant="h3">Header</Text>
          </div>
          <AdvancedChart widgetProps={{ theme: "dark" }} />
          <div className="w-full h-[700px] bg-gray-900"></div>
        </div>
        <div className="min-w-[320px] h-[1000px] flex flex-col gap-2">
          <div className="w-full h-[200px] bg-gray-900 rounded-md" />
          <div className="w-full h-[300px] bg-gray-900 rounded-md" />
          <div className="w-full h-[500px] bg-gray-900 rounded-md" />
        </div>
      </div>
    </div>
  );
}
