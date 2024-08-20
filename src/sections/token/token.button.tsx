import React from "react";

import { useWallet } from "@solana/wallet-adapter-react";

import { Button } from "@/components/ui/button";
import WalletConnectButton from "@/components/WalletConnectButton";

const TokenButton = () => {
  const { publicKey } = useWallet();

  const isConnected = Boolean(publicKey);

  return (
    <>
      {isConnected ? (
        <Button
          type="submit"
          className="w-full bg-[#dfff16] hover:opacity-80 hover:bg-[#dfff16] transition-all text-md text-bold text-black rounded-full"
        >
          Launch Token
        </Button>
      ) : (
        <WalletConnectButton />
      )}
    </>
  );
};

export default TokenButton;
