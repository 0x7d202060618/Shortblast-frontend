import { Program } from '@coral-xyz/anchor';
import { SolanaProgram } from "../../types/solana_program";
import { POOL_REGISTRY_ADDRESS } from '@/utils/constants';


export const getPools = async (program: Program<SolanaProgram>) => {
    const pools = await program.account.liquidityPool.all();
    return pools;
}

export const getPoolRegistry = async (program: Program<SolanaProgram>) => {
    const pool_registry = await program.account.poolRegistry.fetch(POOL_REGISTRY_ADDRESS);
    return pool_registry;
}