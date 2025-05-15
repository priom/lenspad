"use client";

import { useQuery } from "@tanstack/react-query";
import { factoryAbi, FACTORY, publicClient } from "@/lib/factory";
import { hexToNumber } from "viem";  // tiny helper, optional

export function useSales() {
  return useQuery({
    queryKey: ["factory", "sales"],
    queryFn: async () => {
      /* 1️⃣ how many sales? */
      const countBig = await publicClient.readContract({
        address: FACTORY,
        abi: factoryAbi,
        functionName: "salesCount",
      });
      const count = Number(countBig); // bigint ➜ number

      if (count === 0) return [] as `0x${string}`[];

      /* 2️⃣ pull each address (parallel) */
      const sales = await Promise.all(
        [...Array(count).keys()].map((i) =>
          publicClient.readContract({
            address: FACTORY,
            abi: factoryAbi,
            functionName: "allSales",
            args: [BigInt(i)],
          }),
        ),
      );

      /* sales is (readonly) `readonly (0x…)[]`; cast to mutable array if needed */
      return sales as `0x${string}`[];
    },
    staleTime: 60_000,
    refetchInterval: 30_000,
  });
}
