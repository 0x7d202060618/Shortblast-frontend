"use client";
import React, { useState } from "react";

import { useQueryState } from "nuqs";
import { AdvancedChart } from "react-tradingview-embed";
import { FormattedNumber, Image, Text, TokenLogo } from "@/components";
import MOCK_DATA from "../data.json";
import { CurrencyNumber } from "@/components/FormattedNumber";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/utils/functions";
import { PairData } from "../page";
import { twMerge } from "tailwind-merge";

export default function TokenPairDetail() {
  const [tokenId] = useQueryState("tokenId");
  const selectedTokenPair = MOCK_DATA.find((pair) => pair.token.address == tokenId)!;

  return (
    <div className="w-full mt-2">
      <div className="p-2 flex gap-2">
        <div className="flex-1 flex flex-col border-[1px] border-gray-800 rounded-md overflow-hidden">
          <div className="w-full h-[50px] bg-gray-800 flex items-center p-5 gap-2">
            <TokenLogo
              imageUrl={selectedTokenPair.token.image}
              alt={selectedTokenPair.token.name}
              size={6}
            />
            <Text variant="h3" className="font-bold">
              {selectedTokenPair.token.name}
            </Text>
          </div>
          <AdvancedChart widgetProps={{ theme: "dark" }} />
          <div className="w-full h-[700px] bg-gray-900"></div>
        </div>
        <div className="min-w-[320px] h-[1000px] flex flex-col gap-2">
          <SummaryView token={selectedTokenPair} />
          <StatsView />
          {/* <OrderView /> */}
        </div>
      </div>
    </div>
  );
}

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

enum TimeFrame {
  "5M",
  "1H",
  "6H",
  "24H",
}

const StatsView = () => {
  const [period, setPeriod] = useState<TimeFrame | undefined>();

  const handleChangeState = (state: TimeFrame) => {
    setPeriod((prev) => (prev == state ? undefined : state));
  };

  return (
    <div className="w-full bg-gray-900 border-[1px] border-gray-800 rounded-md overflow-hidden">
      <ul className="text-[12px] font-medium text-center flex text-gray-400">
        {(
          Object.keys(TimeFrame).filter(
            (v) => !Number.isInteger(Number(v))
          ) as unknown as TimeFrame[]
        ).map((state, index) => (
          <li
            className={cn(
              "w-full cursor-pointer flex flex-col items-center justify-center pt-2 pb-3",
              index != 0 && "border-l-[1px]",
              period == state && "bg-gray-800"
            )}
            onClick={() => handleChangeState(state)}
          >
            <span className="leading-tight">{state}</span>
            <span className="text-white text-[13px] font-medium">0.00%</span>
          </li>
        ))}
      </ul>

      {!!period && (
        <div className="border-gray-800 border-t-[1px]">
          <div className="relative flex flex-col px-4 my-4 gap-4">
            <div className="flex">
              <div className="flex flex-col min-w-[61px] pr-4">
                <span className="text-gray-400 text-[10px] mt-auto uppercase">TXNS</span>
                <span className="text-white text-[13px] font-medium">148</span>
              </div>
              <div className="flex flex-col w-full pl-4">
                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-[10px] uppercase">BUYS</span>
                    <span className="text-white text-[13px] font-medium">68</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-[10px] text-right uppercase">SELLS</span>
                    <span className="text-white text-[13px] font-medium text-right">80</span>
                  </div>
                </div>
                <Progress value={46} className="h-1 bg-[#ff4b92]" />
              </div>
            </div>

            <div className="flex">
              <div className="flex flex-col min-w-[61px] pr-4">
                <span className="text-gray-400 text-[10px] mt-auto uppercase">Volume</span>
                <CurrencyNumber className="text-white text-[13px] font-medium" value={8300} />
              </div>
              <div className="flex flex-col w-full pl-4">
                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-[10px] uppercase">Buy Vol</span>
                    <CurrencyNumber className="text-white text-[13px] font-medium" value={4400} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-[10px] text-right uppercase">Sell Vol</span>
                    <CurrencyNumber
                      className="text-white text-[13px] font-medium text-right"
                      value={3700}
                    />
                  </div>
                </div>
                <Progress value={56} className="h-1 bg-[#ff4b92]" />
              </div>
            </div>

            <div className="flex">
              <div className="flex flex-col min-w-[61px] pr-4">
                <span className="text-gray-400 text-[10px] mt-auto uppercase">Makers</span>
                <span className="text-white text-[13px] font-medium">83</span>
              </div>
              <div className="flex flex-col w-full pl-4">
                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-[10px] uppercase">Buyers</span>
                    <span className="text-white text-[13px] font-medium">40</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-[10px] text-right uppercase">Sellers</span>
                    <span className="text-white text-[13px] font-medium text-right">43</span>
                  </div>
                </div>
                <Progress value={48} className="h-1 bg-[#ff4b92]" />
              </div>
            </div>

            <div className="absolute top-0 left-[77px] h-full w-[1px] bg-gray-800" />
          </div>
        </div>
      )}
    </div>
  );
};
// Define the OrderType enum
enum OrderType {
  Buy,
  Sell,
}

// Define OrderTypeLabel for readable display
const OrderTypeLabel = {
  [OrderType.Buy]: "Buy",
  [OrderType.Sell]: "Sell",
};

const OrderView = () => {
  const [orderType, setOrderType] = useState<OrderType | undefined>();

  const handleChangeOrderType = (state: OrderType) => {
    setOrderType((prev) => (prev === state ? undefined : state));
  };

  return (
    <div className="w-full bg-gray-900 border-[1px] border-gray-800 rounded-md overflow-hidden">
      <ul className="text-[12px] font-medium text-center flex text-gray-400">
        {Object.values(OrderType)
          .filter((v) => typeof v === "number") // Filter out only enum values
          .map((type, index) => (
            <li
              key={type}
              className={cn(
                "w-full cursor-pointer flex flex-col items-center justify-center pt-2 pb-3",
                index !== 0 && "border-l-[1px]",
                orderType === type && "bg-gray-800"
              )}
              onClick={() => handleChangeOrderType(type as OrderType)}
            >
              <span className={twMerge("text-[16px]", orderType === type && "text-white")}>
                {OrderTypeLabel[type as OrderType]}
              </span>
            </li>
          ))}
      </ul>
      {orderType === OrderType.Buy && (
        <div className="border-gray-800 border-t-[1px]">
          <div className="flex flex-col p-4">
            <div className="rounded-md border-[1px]">
              <div className="flex py-1 px-2">
                <div className="flex gap-1 items-center">
                  <Image
                    src="https://dd.dexscreener.com/ds-data/chains/solana.png"
                    width={16}
                    height={16}
                    alt="SOL"
                  />
                  <span>SOL</span>
                </div>
              </div>
              <ul className="text-[12px] font-medium text-center flex text-gray-400 border-t-[1px] overflow-hidden">
                {[0.1, 0.25, 0.5, 1, 2, 5].map((value, index) => (
                  <li
                    key={value}
                    className={cn(
                      "w-full cursor-pointer flex flex-col items-center justify-center py-1",
                      index !== 0 && "border-l-[1px]"
                    )}
                  >
                    <span>{value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
