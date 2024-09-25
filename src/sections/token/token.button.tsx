import React from "react";

import { useWallet } from "@solana/wallet-adapter-react";

import Button from "@/components/ui/button";
import WalletConnectButton from "@/components/WalletConnectButton";

const TokenButton = ({ loading = false }: { loading?: boolean }) => {
  const { publicKey } = useWallet();

  const isConnected = Boolean(publicKey);

  return (
    <>
      {isConnected ? (
        <Button
          type="submit"
          className="w-full bg-rose-400 hover:opacity-80 hover:bg-rose-400 transition-all text-md text-bold text-black rounded-full"
          isLoading={loading}
          disabled={loading}
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
