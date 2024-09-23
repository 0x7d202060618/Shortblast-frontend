import React from "react";

import { PoolData } from "@/app/trading/page";
import { Text } from "@/components";
import FormattedNumber, { CurrencyNumber } from "@/components/FormattedNumber";
import { SOL_PRICE } from "@/utils/constants";

const SummaryView = ({ pool }: { pool: PoolData }) => {
  return (
    <div className="w-full bg-gray-900 rounded-md border-[1px] border-gray-800 flex flex-col gap-3 p-4">
      <div className="flex justify-center">
        <Text className="font-bold text-[22px]">{pool.name}</Text>
      </div>
      <div className="flex">
        <div className="flex-1 flex flex-col gap-1">
          <Text className="text-[11px] uppercase text-gray-500">Price Usd</Text>
          <CurrencyNumber
            value={pool.price * SOL_PRICE}
            decimalScale={6}
            className="text-[15px] font-medium"
          />
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <Text className="text-[11px] uppercase text-gray-500">Price Sol</Text>
          <FormattedNumber
            value={pool.price}
            decimalScale={9}
            useMillify
            className="text-[15px] font-medium"
          />
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <Text className="text-[11px] uppercase text-gray-500">Supply</Text>
          {/* <FormattedNumber value={1000000000} useMillify className="text-[15px] font-medium" /> */}
          <Text className="text-[15px] font-medium">-</Text>
        </div>
      </div>
      <div className="w-full h-[1px] bg-gray-700" />
      <div className="flex">
        <div className="flex-1 flex flex-col gap-1">
          <Text className="text-[11px] uppercase text-gray-500">Liquidity</Text>
          <CurrencyNumber value={pool.liquidity} className="text-[15px] font-medium" />
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <Text className="text-[11px] uppercase text-gray-500">MKT Cap</Text>
          <CurrencyNumber value={pool.marketCap} className="text-[15px] font-medium" />
        </div>
        <div className="flex-1" />
      </div>
    </div>
  );
};

export default SummaryView;
