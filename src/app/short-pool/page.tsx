"use client";

import { Icon, Image, Text, TokenLogo, WalletConnectButton } from "@/components";
import FormattedNumber, { TokenAmountNumber } from "@/components/FormattedNumber";
import FormattedNumberInput from "@/components/FormattedNumberInput";
import Button from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/utils/functions";
import { useWallet } from "@solana/wallet-adapter-react";
import React from "react";

export default function ShortPoolPage() {
  const { publicKey } = useWallet();

  return (
    <div className="relative max-w-[500px] mx-auto mt-[100px]">
      <div className={cn("h-fit space-y-4 rounded-lg bg-card-light p-4 dark:bg-gray-900 ")}>
        <div className="relative flex flex-col items-center justify-center space-y-6">
          <div className="w-full space-y-2 rounded-lg bg-white px-6 py-4 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <Text variant="md" className="text-black-700 dark:text-white-700 sm:text-sm">
                You're paying
              </Text>
              <div className="flex items-center space-x-1 sm:text-md text-sm">
                <Label>Balance:</Label>
                <Label className="hover:underline cursor-pointer">
                  <TokenAmountNumber value={10000} />
                </Label>
              </div>
            </div>
            <div className="flex items-center justify-between sm:space-x-4 space-x-2">
              <div className="w-full">
                <FormattedNumberInput
                  value={"1000"}
                  placeholder="0.00"
                  className="p-0 !font-oswald text-lg font-600 !tracking-wider bg-transparent border-none"
                />
                <FormattedNumber
                  value={"1000"}
                  prefix="$"
                  decimalScale={3}
                  variant="md"
                  className="text-black-700 dark:text-white-700"
                />
              </div>
              <div
                // onClick={() => handleOpenModal(type)}
                className="flex cursor-pointer items-center justify-between sm:space-x-2 rounded-lg bg-gray-200 sm:px-3 sm:py-2 dark:bg-gray-900 space-x-1 px-2 py-1"
              >
                <div className="flex h-6 items-center space-x-2 tablet_sm:space-x-1">
                  {/* <TokenDetail isDetail={false} token={token} /> */}
                  <Text variant="md">Select</Text>
                </div>
                <Icon name="chevron-up-down" size={5} />
              </div>
            </div>
          </div>

          <div className="w-full space-y-2 rounded-lg bg-white px-6 py-4 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <Text variant="md" className="text-black-700 dark:text-white-700 sm:text-sm">
                To receive (estimated)
              </Text>
              <div className="flex items-center space-x-1 sm:text-md text-sm">
                <Label>Balance:</Label>
                <Label className="hover:underline cursor-pointer">
                  <TokenAmountNumber value={10000} />
                </Label>
              </div>
            </div>
            <div className="flex items-center justify-between sm:space-x-4 space-x-2">
              <div className="w-full">
                <FormattedNumberInput
                  readOnly
                  disabled
                  value={"1000"}
                  placeholder="0.00"
                  className="p-0 !font-oswald text-lg font-600 !tracking-wider bg-transparent border-none"
                />
                <FormattedNumber
                  value={"1000"}
                  prefix="$"
                  decimalScale={3}
                  variant="md"
                  className="text-black-700 dark:text-white-700"
                />
              </div>
              <div
                // onClick={() => handleOpenModal(type)}
                className="flex cursor-pointer items-center justify-between sm:space-x-2 rounded-lg bg-gray-200 sm:px-3 sm:py-2 dark:bg-gray-900 space-x-1 px-2 py-1"
              >
                <div className="flex items-center sm:space-x-4 self-start space-x-2">
                  <div className="w-[16px]">
                    <Image
                      src="https://dd.dexscreener.com/ds-data/chains/solana.png"
                      width={16}
                      height={16}
                      alt="SOL"
                    />
                  </div>
                  <div className="flex items-center space-x-2 tablet_sm:space-x-1 mobile_lg:space-x-0.5">
                    <Text variant={"md"}>SOL</Text>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {publicKey ? (
          <Button className="w-full bg-rose-400 hover:opacity-80 hover:bg-rose-400 transition-all text-md text-bold text-black rounded-full">
            Lend
          </Button>
        ) : (
          <WalletConnectButton />
        )}
      </div>
    </div>
  );
}
