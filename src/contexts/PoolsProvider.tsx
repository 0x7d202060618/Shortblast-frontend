"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

import { useQueryState } from "nuqs";

import { Program } from "@coral-xyz/anchor";
import { useConnection } from "@solana/wallet-adapter-react";

import { getPools } from "@/app/provider/bondingProvider";
import { ComponentProps } from "@/types";
import { convertFromLamports } from "@/utils/functions";
import idl from "@/idl/solana_program.json";
import { PoolData } from "@/app/trading/page";
import axios from "axios";

export const PoolsContext = createContext({
  pools: undefined as PoolData[] | undefined,
  selectedPool: undefined as PoolData | undefined,
});

export default function PoolsProvider({ children }: ComponentProps) {
  const { connection } = useConnection();
  const [address] = useQueryState("address");

  const [pools, setPools] = useState<PoolData[]>();
  const [selectedPool, setSelectedPool] = useState<PoolData>();

  useEffect(() => {
    const provider = { connection };
    const program = new Program(idl as any, provider);

    (async () => {
      const pools = await getPools(program);

      const response = await fetch(process.env.NEXT_PUBLIC_HELIUS_RPC_URL!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: "9ruB56ZUbEmq7whokt52w8RcbEpUz9qJwpoaj6MrfwZS",
          method: "getAssetBatch",
          params: {
            ids: pools.map((pool) => pool.account.token.toBase58()),
          },
        }),
      });
      const data = await response.json();
      const poolAssets = await Promise.all(
        data?.result.map(async (pool: any) => {
          let image = "";
          console.log(pool.content);
          try {
            const response = await axios({
              method: "GET",
              url: pool.content.json_uri,
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
            const data = await response.data;
            image = data.image || "";
          } catch (err) {
            console.log(err);
          }

          return {
            name: pool.content.metadata.name,
            symbol: pool.content.metadata.symbol,
            image,
          };
        })
      );

      setPools(
        pools.map((pool, index) => {
          return {
            name: poolAssets[index].name,
            symbol: poolAssets[index].symbol,
            image: poolAssets[index].image,
            address: pool.account.token.toBase58(),
            liquidity: convertFromLamports(pool.account.totalSupply - pool.account.reserveToken),
            marketCap: 60 - convertFromLamports(pool.account.reserveSol),
            price:
              0.0615 *
              0.0003606 *
              Math.exp(
                0.0003606 *
                  convertFromLamports(pool.account.totalSupply - pool.account.reserveToken)
              ),
          };
        })
      );
    })();
  }, [connection]);

  useEffect(() => {
    if (address && pools) {
      const selectedPool = pools.find((pool) => pool.address == address);
      setSelectedPool(selectedPool);
    }
  }, [address, pools]);

  return <PoolsContext.Provider value={{ pools, selectedPool }}>{children}</PoolsContext.Provider>;
}

export const usePools = () => {
  return useContext(PoolsContext);
};
