import React, { useEffect, useState } from "react";

import { useQueryState } from "nuqs";
import { Id, toast } from "react-toastify";

import { PublicKey } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { PoolData } from "@/app/trading/page";
import { Image, Text, TokenLogo, WalletConnectButton } from "@/components";
import FormattedNumberInput from "@/components/FormattedNumberInput";
import Button from "@/components/ui/button";
import { cn, getErrorMessage, getTokenBalance } from "@/utils/functions";
import { buyTransaction, sellTransaction } from "@/services/transactionServices";
import idl from "@/idl/solana_program.json";
import Notification from "@/components/Notification";

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
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const [address] = useQueryState("address");

  const [buyAmount, setBuyAmount] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const [total, setTotal] = useState(0);
  const [slippage, setSlippage] = useState("");
  const [orderType, setOrderType] = useState<OrderType | undefined>(OrderType.Buy);
  const [loading, setLoading] = useState(false);

  const handleChangeOrderType = (state: OrderType) => {
    setOrderType((prev) => (prev === state ? undefined : state));
  };

  const onOrder = async () => {
    const provider = { connection };
    const program = new Program(idl as any, provider);
    if (!address || !publicKey) return;

    let orderTransaction = null;
    let toastId: Id = "";
    setLoading(true);
    try {
      toastId = Notification({
        type: "warn",
        title: "Processing transaction",
      });
      toast.update(toastId, { autoClose: false, closeButton: false });
      if (orderType === OrderType.Buy) {
        orderTransaction = await buyTransaction(
          publicKey,
          Number(buyAmount),
          new PublicKey(address),
          program
        );
      } else if (orderType === OrderType.Sell) {
        orderTransaction = await sellTransaction(
          publicKey,
          Number(sellAmount),
          new PublicKey(address),
          program
        );
      }
      if (!orderTransaction) return;
      const signature = await sendTransaction(orderTransaction, connection, {
        skipPreflight: true,
      });
      const txLink = `https://explorer.solana.com/tx/${signature}?cluster=devnet`;

      Notification({
        type: "success",
        title: "Transaction confirmed",
        txLink,
      });
    } catch (err) {
      Notification({
        type: "error",
        message: getErrorMessage(err),
      });
      throw new Error(`Error while creating new token: ${getErrorMessage(err)}`);
    } finally {
      setLoading(false);
      toast.done(toastId);
    }
  };

  useEffect(() => {
    if (publicKey) {
      (async () => {
        const tokenAmount = await getTokenBalance(publicKey?.toBase58(), address, connection);
        setTotal(tokenAmount);
      })();
    }
  }, [publicKey]);

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
                    <span className="max-w-[70px] text-ellipsis whitespace-nowrap overflow-hidden">
                      {pool.name}
                    </span>
                  </div>
                  <FormattedNumberInput
                    value={sellAmount}
                    onChange={(v) => setSellAmount(v)}
                    placeholder="0"
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
                      onClick={() => setSellAmount(String(Math.floor((total * value) / 100)))}
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

            {publicKey ? (
              <Button
                className="w-full bg-rose-400 hover:opacity-80 hover:bg-rose-400 transition-all text-md text-bold text-black rounded-full"
                onClick={onOrder}
                isLoading={loading}
              >
                {OrderTypeLabel[orderType as OrderType]}
              </Button>
            ) : (
              <WalletConnectButton />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderView;
