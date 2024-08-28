"use client";

import React from "react";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import Icon from "./Icon";
import { truncateAddress } from "@/utils/functions";

export default function WalletConnectButton() {
  const { publicKey, connecting, connected, disconnecting } = useWallet();
  return (
    <div>
      <WalletMultiButton>
        <div className="flex items-center space-x-0.5 lg:space-x-2">
          {!publicKey ? (
            <>
              {!connecting && !connected && !disconnecting && <Icon name="wallet" size={6} />}
              <p className="hidden lg:block">Connect Wallet</p>
            </>
          ) : (
            <p className="hidden lg:block">{truncateAddress(publicKey.toBase58())}</p>
          )}
        </div>
      </WalletMultiButton>
    </div>
  );
}
