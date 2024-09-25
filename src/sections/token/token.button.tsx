import React from "react";

import { useWallet } from "@solana/wallet-adapter-react";

import Button from "@/components/ui/button";
import WalletConnectButton from "@/components/WalletConnectButton";

const TokenButton = ({
  loading = false,
  disabled = false,
}: {
  loading?: boolean;
  disabled?: boolean;
}) => {
  const { publicKey } = useWallet();

  const isConnected = Boolean(publicKey);

  return (
    <>
      {isConnected ? (
        <Button
          type="submit"
          className="w-full bg-rose-400 hover:opacity-80 hover:bg-rose-400 transition-all text-md text-bold text-black rounded-full"
          isLoading={loading}
          disabled={disabled}
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
