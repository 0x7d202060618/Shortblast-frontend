"use client";
import React from "react";

import { AdvancedChart } from "react-tradingview-embed";
import { Text, TokenLogo } from "@/components";
import StatsView from "@/sections/pair/pair.stats";
import SummaryView from "@/sections/pair/pair.summary";
import OrderView from "@/sections/pair/pair.order";
import { usePools } from "@/contexts/PoolsProvider";

export default function TokenPairDetail() {
  const { selectedPool } = usePools();

  return (
    <div className="w-full mt-2">
      {selectedPool && (
        <div className="p-2 flex gap-2">
          <div className="flex-1 flex flex-col border-[1px] border-gray-800 rounded-md overflow-hidden">
            <div className="w-full h-[50px] bg-gray-800 flex items-center p-5 gap-2">
              <TokenLogo imageUrl={selectedPool.image} alt={selectedPool.name} size={6} />
              <Text variant="h3" className="font-bold">
                {selectedPool.name}
              </Text>
            </div>
            <AdvancedChart widgetProps={{ theme: "dark" }} />
            {/* <div className="w-full h-[700px] bg-gray-900"></div> */}
          </div>
          <div className="max-w-[320px] min-w-[320px] flex flex-col gap-2">
            <SummaryView pool={selectedPool} />
            <StatsView />
            <OrderView pool={selectedPool} />
          </div>
        </div>
      )}
    </div>
  );
}
