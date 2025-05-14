// /hooks/useAllSaleDetails.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { publicClient } from "@/lib/factory";
import { saleAbi } from "@/lib/saleAbi";
import { Address, erc20Abi } from "viem";

const minimalERC20MetaAbi = [
  {
    name: "name",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "string" }],
  },
  {
    name: "symbol",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "string" }],
  },
  {
    name: "imageURI",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "string" }],
  },
] as const;

export function useAllSaleDetails(sales: `0x${string}`[]) {
    return useQuery({
      queryKey: ["allSaleDetails", ...sales], // KEY changes with sales
      enabled: sales.length > 0,              // RUN only when sales exist
      queryFn: async () => {
        const all = await Promise.all(
          sales.map(async (sale) => {
            try {
              const [
                start,
                end,
                price,
                softCap,
                hardCap,
                totalRaised,
                finalized,
                saleToken,
                paymentToken,
              ] = await Promise.all([
                publicClient.readContract({ address: sale, abi: saleAbi, functionName: "start" }),
                publicClient.readContract({ address: sale, abi: saleAbi, functionName: "end" }),
                publicClient.readContract({ address: sale, abi: saleAbi, functionName: "price" }),
                publicClient.readContract({ address: sale, abi: saleAbi, functionName: "softCap" }),
                publicClient.readContract({ address: sale, abi: saleAbi, functionName: "hardCap" }),
                publicClient.readContract({ address: sale, abi: saleAbi, functionName: "totalRaised" }),
                publicClient.readContract({ address: sale, abi: saleAbi, functionName: "finalized" }),
                publicClient.readContract({ address: sale, abi: saleAbi, functionName: "saleToken" }),
                publicClient.readContract({ address: sale, abi: saleAbi, functionName: "paymentToken" }),
              ]);
  
              const [name, symbol, imageURI] = await Promise.all([
                publicClient.readContract({
                  address: saleToken as Address,
                  abi: minimalERC20MetaAbi,
                  functionName: "name",
                }),
                publicClient.readContract({
                  address: saleToken as Address,
                  abi: minimalERC20MetaAbi,
                  functionName: "symbol",
                }),
                publicClient.readContract({
                  address: saleToken as Address,
                  abi: minimalERC20MetaAbi,
                  functionName: "imageURI",
                }).catch(() => ""), // fallback if imageURI fails
              ]);
  
              return {
                sale,
                start: Number(start),
                end: Number(end),
                price,
                softCap,
                hardCap,
                totalRaised,
                finalized,
                saleToken: saleToken as `0x${string}`,
                paymentToken: paymentToken as `0x${string}`,
                name,
                symbol,
                imageURI,
              };
            } catch (err) {
              console.error("Failed to fetch sale:", sale, err);
              return null; // optionally filter out in result
            }
          })
        );
  
        // remove any nulls if they happened
        return all.filter((s): s is NonNullable<typeof s> => !!s);
      },
    });
  }
