import { POOL_REGISTRY_SEED, POOL_SEED_PREFIX, SOL_VAULT_PREFIX } from "@/utils/constants";
import { BN, Program } from "@coral-xyz/anchor";
import { ASSOCIATED_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";
import { getAssociatedTokenAddress, getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Keypair, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY, Transaction } from "@solana/web3.js";

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

export const createBondingPoolTransaction = async (bondingProgram: Program,mintKeypair: Keypair, userKey: PublicKey | null) => {
  if (!userKey) return null;

  const [poolPda] = PublicKey.findProgramAddressSync(
    [Buffer.from(POOL_SEED_PREFIX), mintKeypair.publicKey.toBuffer()],
    bondingProgram.programId
  )
  const [poolRegistry] = PublicKey.findProgramAddressSync(
    [Buffer.from(POOL_REGISTRY_SEED)],
    bondingProgram.programId
  )
  const [poolSolVault] = PublicKey.findProgramAddressSync(
    [Buffer.from(SOL_VAULT_PREFIX),  mintKeypair.publicKey.toBuffer()],
    bondingProgram.programId
  )
  const poolToken = await getAssociatedTokenAddress(
    mintKeypair.publicKey, poolPda, true
  )
  // Token Mint
  const associatedTokenAccountAddress = getAssociatedTokenAddressSync(
    mintKeypair.publicKey,
    userKey!
  );
  const transaction = await bondingProgram.methods.createPool().accountsStrict({
    pool: poolPda,
    poolRegistry: poolRegistry,
    tokenMint: mintKeypair.publicKey,
    userTokenAccount: associatedTokenAccountAddress,
    poolTokenAccount: poolToken,
    poolSolVault: poolSolVault,
    payer: userKey,
    tokenProgram: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    tokenMetadataProgram: new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"),
    systemProgram: new PublicKey("11111111111111111111111111111111"),
    rent: new PublicKey("SysvarRent111111111111111111111111111111111"),
    associatedTokenProgram: new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"),
  }).transaction();

  transaction.feePayer = userKey;

  return transaction;
}
