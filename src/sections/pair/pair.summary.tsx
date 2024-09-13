import React from "react";

import { PairData } from "@/app/trading/page";
import { Text } from "@/components";
import FormattedNumber, { CurrencyNumber } from "@/components/FormattedNumber";

const SummaryView = ({ token }: { token: PairData }) => {
  return (
    <div className="w-full bg-gray-900 rounded-md border-[1px] border-gray-800 flex flex-col gap-3 p-4">
      <div className="flex justify-center">
        <Text className="font-bold text-[22px]">{token.token.name}</Text>
      </div>
      <div className="flex">
        <div className="flex-1 flex flex-col gap-1">
          <Text className="text-[11px] uppercase text-gray-500">Price Usd</Text>
          <CurrencyNumber value={0.00001} decimalScale={6} className="text-[15px] font-medium" />
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <Text className="text-[11px] uppercase text-gray-500">Price Sol</Text>
          <FormattedNumber
            value={0.02239}
            decimalScale={6}
            useMillify
            className="text-[15px] font-medium"
          />
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <Text className="text-[11px] uppercase text-gray-500">Supply</Text>
          <FormattedNumber value={1000000000} useMillify className="text-[15px] font-medium" />
        </div>
      </div>
      <div className="w-full h-[1px] bg-gray-700" />
      <div className="flex">
        <div className="flex-1 flex flex-col gap-1">
          <Text className="text-[11px] uppercase text-gray-500">Liquidity</Text>
          <CurrencyNumber value={55000} className="text-[15px] font-medium" />
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <Text className="text-[11px] uppercase text-gray-500">MKT Cap</Text>
          <CurrencyNumber value={288560} className="text-[15px] font-medium" />
        </div>
        <div className="flex-1" />
      </div>
    </div>
  );
};

export default SummaryView;
