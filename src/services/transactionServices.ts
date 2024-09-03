import { BN, Program } from "@coral-xyz/anchor";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { Keypair, PublicKey, Transaction } from "@solana/web3.js";

export const launchTokenTransaction = async (
  name: string,
  symbol: string,
  metadataUrl: string | undefined,
  program: Program,
  launcherKey: PublicKey | null,
  mintKeypair: Keypair
) => {
  if (!launcherKey) return null;
  const transaction = await program.methods
    .createToken(name, symbol, metadataUrl)
    .accountsStrict({
      payer: launcherKey,
      mintAccount: mintKeypair.publicKey,
      metadataAccount: PublicKey.findProgramAddressSync(
        [
          Buffer.from("metadata"),
          new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s").toBuffer(),
          mintKeypair.publicKey.toBuffer(),
        ],
        new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s")
      )[0],
      tokenProgram: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
      tokenMetadataProgram: new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"),
      systemProgram: new PublicKey("11111111111111111111111111111111"),
      rent: new PublicKey("SysvarRent111111111111111111111111111111111"),
    })
    .transaction();

  // Token Mint
  const associatedTokenAccountAddress = getAssociatedTokenAddressSync(
    mintKeypair.publicKey,
    launcherKey!
  );
  const mintInstruction = await program.methods
    .mintToken()
    .accountsPartial({
      mintAuthority: launcherKey,
      recipient: launcherKey,
      mintAccount: mintKeypair.publicKey,
      associatedTokenAccount: associatedTokenAccountAddress,
    })
    .instruction();

  transaction.add(mintInstruction);

  return transaction;
};
