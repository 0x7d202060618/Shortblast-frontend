import React, { useState } from "react";

import { PoolData } from "@/app/trading/page";
import { Image, Text, TokenLogo } from "@/components";
import FormattedNumberInput from "@/components/FormattedNumberInput";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/functions";

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

const OrderView = ({ pool }: { pool: PoolData }) => {
  const total = 1000;

  const [buyAmount, setBuyAmount] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const [slippage, setSlippage] = useState("");
  const [orderType, setOrderType] = useState<OrderType | undefined>(OrderType.Buy);

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
              <span className={cn("text-[16px]", orderType === type && "text-white")}>
                {OrderTypeLabel[type as OrderType]}
              </span>
            </li>
          ))}
      </ul>
      {orderType != undefined && (
        <div className="border-gray-800 border-t-[1px] text-gray-400">
          <div className="flex flex-col p-4 gap-4">
            {orderType == OrderType.Buy ? (
              <div className="rounded-md border-[1px]">
                <div className="relative flex px-2 items-center">
                  <div className="absolute flex gap-1 items-center">
                    <div className="w-[16px]">
                      <Image
                        src="https://dd.dexscreener.com/ds-data/chains/solana.png"
                        width={16}
                        height={16}
                        alt="SOL"
                      />
                    </div>
                    <span>SOL</span>
                  </div>
                  <FormattedNumberInput
                    value={buyAmount}
                    onChange={(v) => setBuyAmount(v)}
                    className="p-0 pl-[100px] font-bold text-[16px] bg-transparent border-none"
                  />
                </div>
                <ul className="text-[12px] font-medium text-center flex border-t-[1px] overflow-hidden">
                  {[0.1, 0.25, 0.5, 1, 2, 5].map((value, index) => (
                    <li
                      key={index}
                      className={cn(
                        "w-full cursor-pointer flex flex-col items-center justify-center py-1",
                        index !== 0 && "border-l-[1px]"
                      )}
                      onClick={() => setBuyAmount(String(value))}
                    >
                      <span>{value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="rounded-md border-[1px]">
                <div className="relative flex px-2 items-center">
                  <div className="absolute flex gap-1 items-center">
                    <TokenLogo imageUrl={pool.image} alt={pool.name} size={4} />
                    <span className="max-w-[70px] text-ellipsis overflow-hidden">{pool.name}</span>
                  </div>
                  <FormattedNumberInput
                    value={sellAmount}
                    onChange={(v) => setSellAmount(v)}
                    className="p-0 pl-[100px] font-bold text-[16px] bg-transparent border-none"
                  />
                </div>
                <ul className="text-[12px] font-medium text-center flex border-t-[1px] overflow-hidden">
                  {[10, 20, 50, 75, 100].map((value, index) => (
                    <li
                      key={index}
                      className={cn(
                        "w-full cursor-pointer flex flex-col items-center justify-center py-1",
                        index !== 0 && "border-l-[1px]"
                      )}
                      onClick={() => setSellAmount(String((total * value) / 100))}
                    >
                      <span>{value}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-md border-[1px]">
              <div className="relative flex px-2 items-center">
                <Text variant="sm" className="absolute whitespace-nowrap">
                  Slippage %
                </Text>
                <FormattedNumberInput
                  value={slippage}
                  onChange={(v) => setSlippage(v)}
                  className="p-0 pl-[100px] font-bold text-[16px] bg-transparent border-none"
                />
              </div>
              <ul className="text-[12px] font-medium text-center flex border-t-[1px] overflow-hidden">
                {[0.5, 1, 3, 5, 10].map((value, index) => (
                  <li
                    key={index}
                    className={cn(
                      "w-full cursor-pointer flex flex-col items-center justify-center py-1",
                      index !== 0 && "border-l-[1px]"
                    )}
                    onClick={() => setSlippage(value.toString())}
                  >
                    <span>{value}%</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button
              className="w-full bg-[#dfff16] hover:opacity-80 hover:bg-[#dfff16] transition-all text-md text-bold text-black rounded-full"
              disabled
            >
              {OrderTypeLabel[orderType as OrderType]}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderView;
