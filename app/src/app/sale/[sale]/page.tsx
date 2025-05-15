"use client";

import { useSaleDetails } from "@/hooks/useSalesDetails";
import { Address, formatUnits, parseUnits } from "viem";
import Image from "next/image";
import { useState } from "react";
import { useWriteContract, useAccount } from "wagmi";
import { toast } from "sonner";

export default function SalePage({ params }: { params: { sale: string } }) {
  const { sale } = params;
  const {
    data: saleDetails,
    isLoading,
    error,
  } = useSaleDetails(sale as Address);
  const [lensAmount, setLensAmount] = useState("");
  const [estimatedTokens, setEstimatedTokens] = useState("0");
  console.log(saleDetails);

  const { isConnected } = useAccount();
  const { writeContractAsync, isPending } = useWriteContract();

  if (isLoading) return <div className="p-4 border rounded">Loading…</div>;
  if (error || !saleDetails)
    return <div className="p-4 border rounded">Error loading sale</div>;

  const handleEstimate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLensAmount(value);

    try {
      const parsed = parseUnits(value || "0", 18);
      const estimated = (parsed * 10n ** 18n) / saleDetails.price;
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

      await writeContractAsync({
        address: sale as Address,
        abi: [
          {
            name: "contribute",
            type: "function",
            stateMutability: isNative ? "payable" : "nonpayable",
            inputs: [{ name: "amount", type: "uint256" }],
            outputs: [],
          },
        ],
        functionName: "contribute",
        args: [lensAmountInWei], // <-- always passed
        value: isNative ? lensAmountInWei : undefined,
      });

      toast.success("Contribution submitted!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.shortMessage || err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">
        {saleDetails.name} ({saleDetails.symbol})
      </h1>

      <div className="flex gap-6">
        {saleDetails.imageURI ? (
          <Image
            src={saleDetails.imageURI}
            alt={saleDetails.name}
            width={150}
            height={150}
            className="rounded shadow"
          />
        ) : (
          <div className="w-[150px] h-[150px] bg-secondary flex items-center justify-center rounded">
            <span>No Image</span>
          </div>
        )}

        <div className="space-y-2 text-sm">
          <p>
            <strong>Owner:</strong> {saleDetails.owner}
          </p>
          <p>
            <strong>Owner Reputation Score:</strong> {}
          </p>
          <p>
            <strong>Price:</strong> {formatUnits(saleDetails.price, 18)}{" "}
            LENS/token
          </p>
          <p>
            <strong>Soft Cap:</strong> {formatUnits(saleDetails.softCap, 18)}{" "}
            LENS
          </p>
          <p>
            <strong>Raised:</strong> {formatUnits(saleDetails.totalRaised, 18)}{" "}
            LENS
          </p>
          <p>
            <strong>Ends:</strong>{" "}
            {new Date(saleDetails.end * 1000).toLocaleString()}
          </p>
          <p>
            <strong>Finalized:</strong> {saleDetails.finalized ? "✅" : "❌"}
          </p>
        </div>
      </div>

      {saleDetails.description && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Project Description</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {saleDetails.description}
          </p>
        </div>
      )}

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Estimate Tokens</h2>
        <input
          type="text"
          inputMode="decimal"
          value={lensAmount}
          onChange={handleEstimate}
          className="p-2 border rounded w-full"
          placeholder="Enter amount in LENS"
        />

        <p className="text-sm text-muted-foreground">
          You will receive approximately <strong>{estimatedTokens}</strong>{" "}
          tokens.
        </p>
        <button
          onClick={handleBuy}
          disabled={isPending || lensAmount <= 0}
          className="mt-2 px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
        >
          {isPending ? "Submitting…" : "Buy Tokens"}
        </button>
      </div>
    </div>
  );
}
