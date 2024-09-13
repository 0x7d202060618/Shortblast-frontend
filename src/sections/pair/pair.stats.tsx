import React, { useState } from "react";

import { CurrencyNumber } from "@/components/FormattedNumber";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/utils/functions";

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

export default StatsView;
