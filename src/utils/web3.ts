import axios from "axios";
import { Program } from "@coral-xyz/anchor";

import { TokenMetadata } from "@/types/token";
import { POOL_REGISTRY_ADDRESS } from "@/utils/constants";
import { SolanaProgram } from "@/types/solana_program";

export async function uploadImagePinata(file: File) {
  if (file) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        headers: {
          pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
          pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_API_SECRET,
          "Content-Type": "multipart/form-data",
        },
      });

      const ImgHash = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
      return ImgHash;
    } catch (err) {
      throw err;
    }
  }
}

export async function uploadMetaData(tokenInfo: TokenMetadata) {
  const data = JSON.stringify({
    name: tokenInfo.name,
    symbol: tokenInfo.symbol,
    description: tokenInfo.description,
    image: tokenInfo.icon,
    banner: tokenInfo.banner,
  });
  try {
    const response = await axios({
      method: "POST",
      url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      data: data,
      headers: {
        pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
        pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_API_SECRET,
        "Content-Type": "application/json",
      },
    });

    const url = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;

    return url;
  } catch (err) {
    throw err;
  }
}

export const getPools = async (program: Program<SolanaProgram>) => {
  const pools = await program.account.liquidityPool.all();
  return pools;
};

export const getPoolRegistry = async (program: Program<SolanaProgram>) => {
  const pool_registry = await program.account.poolRegistry.fetch(POOL_REGISTRY_ADDRESS);
  return pool_registry;
};
