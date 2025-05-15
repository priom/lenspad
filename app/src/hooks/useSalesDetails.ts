// /hooks/useSaleDetails.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { publicClient } from "@/lib/factory";
import { saleAbi } from "@/lib/saleAbi";
import { Address, erc20Abi } from "viem";

export function useSaleDetails(sale: `0x${string}`) {
  return useQuery({
    queryKey: ["sale", sale],
    queryFn: async () => {
      const calls = [
        "start",
        "end",
        "price",
        "softCap",
        "hardCap",
        "totalRaised",
        "finalized",
        "saleToken",
        "paymentToken",
        "owner"
      ] as const;

      const results = await Promise.all(
        calls.map((fn) =>
          publicClient.readContract({
            address: sale,
            abi: saleAbi,
            functionName: fn,
          }),
        ),
      );

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
        owner,
      ] = results;
      const [name, symbol] = await Promise.all([
        publicClient.readContract({
          address: saleToken as Address,
          abi: erc20Abi,
          functionName: "name",
        }),
        publicClient.readContract({
          address: saleToken as Address,
          abi: erc20Abi,
          functionName: "symbol",
        }),
      ]);

      return {
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
        owner: owner as `0x${string}`,
      };
    },
    enabled: !!sale,
  });
}
