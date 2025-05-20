"use client";

import { useSaleDetails } from "@/hooks/useSalesDetails";
import { Address, formatUnits, parseUnits } from "viem";
import Image from "next/image";
import { useState } from "react";
import { useWriteContract, useAccount, useBalance } from "wagmi";
import { toast } from "sonner";
import { useReputationScore } from "@/hooks/useReputationScore";
import { use } from "react";

function SaleHeader({
  name,
  symbol,
  imageURI,
}: {
  name: string;
  symbol: string;
  imageURI?: string;
}) {
  return (
    <div className="flex flex-col items-center text-center gap-4">
      <h1 className="text-3xl font-bold tracking-tight">
        {name} ({symbol})
      </h1>
    </div>
  );
}

function extractStorageKey(description: string): string | null {
  console.log(description, "description");
  const match = description.match(/\+\s*([a-fA-F0-9]+)/);
  console.log(match, "match");
  return match ? match[1] : null;
}

function storageKeyToGroveUrl(storageKey: string) {
  return `https://api.grove.storage/${storageKey}`;
}

function removeImageHash(description: string): string {
  return description.replace(/\s*\+([a-zA-Z0-9_]+)\s*$/, '').trim();
}


export default function SalePage({
  params,
}: {
  params: Promise<{ sale: string }>;
}) {
  const { sale } = use(params);
  const {
    data: saleDetails,
    isLoading,
    error,
  } = useSaleDetails(sale as Address);
  const { address } = useAccount();
  const { data: balanceData, isLoading: balanceLoading } = useBalance({
    address,
  });
  console.log(balanceData, "balanceData");

  const [lensAmount, setLensAmount] = useState("");
  const [estimatedTokens, setEstimatedTokens] = useState("0");
  const { data: reputationScore, isLoading: repLoading } = useReputationScore(
    saleDetails?.owner ? (saleDetails.owner as string).toLowerCase() : undefined
  );
  console.log(saleDetails);

  const { isConnected } = useAccount();
  const { writeContractAsync, isPending } = useWriteContract();

  function getProgressPercent(
    raised: bigint,
    softCap: bigint,
    hardCap: bigint
  ): number {
    const r = Number(raised);
    const h = Number(hardCap);
    return Math.min((r / h) * 100, 100);
  }

  if (isLoading) return <div className="p-4 border rounded">Loading…</div>;
  if (error || !saleDetails)
    return <div className="p-4 border rounded">Error loading sale</div>;

  const handleEstimate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLensAmount(value);

    try {
      const parsed = parseUnits(value || "0", 18);
      const estimated = (parsed * 10n ** 18n) / (saleDetails.price as bigint) ;
      setEstimatedTokens(formatUnits(estimated, 18));
    } catch {
      setEstimatedTokens("0");
    }
  };

  const handleBuy = async () => {
    if (!isConnected) {
      toast.warning("Please connect your wallet");
      return;
    }

    try {
      const lensAmountInWei = parseUnits(lensAmount || "0", 18);
      const isNative =
        saleDetails.paymentToken ===
        "0x0000000000000000000000000000000000000000";

        const contributePayableAbi = [
          {
            name: "contribute",
            type: "function",
            stateMutability: "payable",
            inputs: [{ name: "amount", type: "uint256" }],
            outputs: [],
          },
        ] as const;
      
        await writeContractAsync({
          address: sale as Address,
          abi: contributePayableAbi,
          functionName: "contribute",
          args: [lensAmountInWei],
          value: lensAmountInWei,          // ✅ required, matches overload
        });

      toast.success("Contribution submitted!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.shortMessage || err.message);
    }
  };

  // ...inside SalePage, after all hooks and before return...

  const imageStorageKey = saleDetails.description
    ? extractStorageKey(saleDetails.description as string)
    : null;
  const imageURI = imageStorageKey
    ? storageKeyToGroveUrl(imageStorageKey)
    : undefined;
  console.log(imageURI, "imageURI");
  return (
    <div className="max-w-6xl mx-auto py-10 px-4 flex flex-col gap-10">
      {/* Column layout: Header + Description */}
      <div className="flex flex-col gap-6 items-center text-center">
        <SaleHeader
          name={saleDetails.name}
          symbol={saleDetails.symbol}
        />
        {saleDetails.description && (
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold mb-2">Project Description</h2>
            <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
              {removeImageHash(saleDetails.description as string)}
            </p>
          </div>
        )}
      </div>

      {/* Row layout: Sale info + Wallet form */}
      <div className="flex flex-col md:flex-row gap-10">
        {imageURI ? (
          <Image
            src={imageURI}
            alt={`Image of ${saleDetails.name}`}
            width={150}
            height={150}
            className="rounded shadow"
          />
        ) : (
          <div className="w-[150px] h-[150px] bg-secondary flex items-center justify-center rounded">
            <span>No Image</span>
          </div>
        )}
        {/* {saleDetails.imageURI ? (
          <Image
            src={saleDetails.imageURI}
            alt={`Image of ${name}`}
            width={150}
            height={150}
            className="rounded shadow"
          />
        ) : (
          <div className="w-[150px] h-[150px] bg-secondary flex items-center justify-center rounded">
            <span>No Image</span>
          </div>
        )} */}
        <div className="flex-1 space-y-2 text-sm">
          {/* Sale info */}
          <p>
            <strong>Token Address:</strong> {saleDetails.saleToken || "N/A"}
          </p>
          <p>
            <strong>Owner:</strong> {saleDetails.owner}
          </p>
          <p>
            <strong>Owner Reputation Score:</strong>{" "}
            {repLoading
              ? "Loading…"
              : reputationScore !== null && reputationScore !== undefined
              ? reputationScore
              : "N/A"}
          </p>
          <p>
            <strong>Price:</strong> {formatUnits(saleDetails.price as bigint, 18)}{" "}
            LENS/token
          </p>
          <p>
            <strong>Soft Cap:</strong> {formatUnits(saleDetails.softCap as bigint, 18)}{" "}
            LENS
          </p>
          <p>
            <strong>Hard Cap:</strong> {formatUnits(saleDetails.hardCap as bigint, 18)}{" "}
            LENS
          </p>
          <p>
            <strong>Raised:</strong> {formatUnits(saleDetails.totalRaised as bigint, 18)}{" "}
            LENS
          </p>
          <div className="w-full bg-muted h-4 rounded overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{
                width: `${getProgressPercent(
                  saleDetails.totalRaised as bigint,
                  saleDetails.softCap as bigint,
                  saleDetails.hardCap as bigint
                )}%`,
              }}
            />
          </div>
          <p>
            <strong>Ends:</strong>{" "}
            {new Date(saleDetails.end * 1000).toLocaleString()}
          </p>
          <p>
            <strong>Finalized:</strong> {saleDetails.finalized ? "✅" : "❌"}
          </p>
        </div>

        <div className="w-full md:w-[400px] space-y-4 p-4 border border-border rounded-xl bg-muted/10">
          <h2 className="text-lg font-semibold">Your Wallet</h2>
          <div className="text-sm">
            <strong>Balance:</strong>{" "}
            {balanceLoading
              ? "Loading…"
              : formatUnits(balanceData?.value || 0n, 18)}{" "}
            {saleDetails.paymentToken ===
            "0x0000000000000000000000000000000000000000"
              ? "GHO"
              : "LENS"}
          </div>
          <div className="space-y-2 pt-2">
            <label htmlFor="lensAmount" className="text-sm">
              Enter amount to contribute
            </label>
            <input
              id="lensAmount"
              type="text"
              inputMode="decimal"
              value={lensAmount}
              onChange={handleEstimate}
              className="p-2 border rounded w-full"
              placeholder="Enter amount"
            />
            <p className="text-sm text-muted-foreground">
              You will receive approximately <strong>{estimatedTokens}</strong>{" "}
              tokens.
            </p>
            <button
              onClick={handleBuy}
              disabled={isPending || lensAmount <= "0"}
              className="w-full mt-2 px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
            >
              {isPending ? "Submitting…" : "Buy Tokens"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
