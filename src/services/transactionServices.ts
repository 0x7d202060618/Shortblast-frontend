import { CURVE_SEED, POOL_REGISTRY_SEED, POOL_SEED_PREFIX, SOL_VAULT_PREFIX } from "@/utils/constants";
import { BN, Program } from "@coral-xyz/anchor";
import { ASSOCIATED_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";
import * as anchor from "@coral-xyz/anchor";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Transaction,
} from "@solana/web3.js";
import { convertToLamports } from "@/utils/functions";

export const launchTokenTransaction = async (
  name: string,
  symbol: string,
  metadataUrl: string | undefined,
  program: Program,
  launcherKey: PublicKey | null,
  mintKeypair: Keypair,
  connection: Connection
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

  const pool = PublicKey.findProgramAddressSync(
    [Buffer.from(POOL_SEED_PREFIX), mintKeypair.publicKey.toBuffer()],
    program.programId
  )[0];
  const pool_token_account = getAssociatedTokenAddressSync(mintKeypair.publicKey, pool, true);
  const pool_sol_vault = PublicKey.findProgramAddressSync(
    [Buffer.from(SOL_VAULT_PREFIX), mintKeypair.publicKey.toBuffer()],
    program.programId
  )[0];
  const createPoolInstruction = await program.methods
    .createPool()
    .accounts({
      payer: launcherKey,
      tokenMint: mintKeypair.publicKey,
      pool: pool,
      userTokenAccount: associatedTokenAccountAddress,
      poolTokenAccount: pool_token_account,
      poolSolVault: pool_sol_vault,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      rent: SYSVAR_RENT_PUBKEY,
      systemProgram: SystemProgram.programId,
    })
    .instruction();

  transaction.add(createPoolInstruction);

  return transaction;
};


export const buyTransaction = async (user: PublicKey, amount: number, token_mint: PublicKey, program: Program) => {
    const [curveConfig] = PublicKey.findProgramAddressSync(
      [Buffer.from(CURVE_SEED)],
      program.programId
    );
    const pool = PublicKey.findProgramAddressSync(
                [
                  Buffer.from(POOL_SEED_PREFIX),
                  token_mint.toBuffer(),
                ],
                program.programId
              )[0];
    const pool_token_account = getAssociatedTokenAddressSync(token_mint, pool, true)
    const [pool_sol_vault] = PublicKey.findProgramAddressSync(
      [
        Buffer.from(SOL_VAULT_PREFIX),
        token_mint.toBuffer(),
      ],
      program.programId
    );
    const associatedTokenAccountAddress = getAssociatedTokenAddressSync(
      token_mint,
      user
    );
    const tx  = (await program.methods.buy(convertToLamports(amount)).accounts({
      dexConfigurationAccount: curveConfig,
      pool: pool,
      user: user,
      tokenMint: token_mint,
      poolTokenAccount: pool_token_account,
      poolSolVault : pool_sol_vault,
      userTokenAccount: associatedTokenAccountAddress,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      rent: SYSVAR_RENT_PUBKEY,
      systemProgram: SystemProgram.programId
    }).transaction());

    return tx;
}

export const sellTransaction = async (user: PublicKey, amount: number, token_mint: PublicKey, program: Program) => {
  const [curveConfig] = PublicKey.findProgramAddressSync(
    [Buffer.from(CURVE_SEED)],
    program.programId
  );
  const pool = PublicKey.findProgramAddressSync(
              [
                Buffer.from(POOL_SEED_PREFIX),
                token_mint.toBuffer(),
              ],
              program.programId
            )[0];
  const pool_token_account = getAssociatedTokenAddressSync(token_mint, pool, true)
  const [pool_sol_vault, bump] = PublicKey.findProgramAddressSync(
    [
      Buffer.from(SOL_VAULT_PREFIX),
      token_mint.toBuffer(),
    ],
    program.programId
  );
  const associatedTokenAccountAddress = getAssociatedTokenAddressSync(
    token_mint,
    user
  );
  const _amount = convertToLamports(amount);
  const tx  = (await program.methods.sell(convertToLamports(amount), bump).accounts({
    dexConfigurationAccount: curveConfig,
    pool: pool,
    user: user,
    tokenMint: token_mint,
    poolTokenAccount: pool_token_account,
    poolSolVault : pool_sol_vault,
    userTokenAccount: associatedTokenAccountAddress,
    tokenProgram: TOKEN_PROGRAM_ID,
    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    rent: SYSVAR_RENT_PUBKEY,
    systemProgram: SystemProgram.programId
  }).transaction());

  return tx;
}