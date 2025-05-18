"use client";

import { useForm } from "react-hook-form";
import { parseUnits, parseAbi, Address } from "viem";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { uploadImageToLens } from "@/lib/lens/image-upload";

/* ──────────────────────────────────────────────── */
/*                 ABI fragments                    */
/* ──────────────────────────────────────────────── */
const ICO_FACTORY = "0xYourFactoryAddress";
const factoryAbi = parseAbi([
  "function createSale(address saleToken,address paymentToken,uint40 start,uint40 end,uint256 price,uint256 softCap,uint256 hardCap,string description) returns (address)",
  "function createSaleWithNewToken(string name,string symbol,address paymentToken,uint40 start,uint40 end,uint256 price,uint256 softCap,uint256 hardCap,string description) returns (address,address)",
]);

/* ──────────────────────────────────────────────── */
/*                    Form types                    */
/* ──────────────────────────────────────────────── */
interface CreateICOForm {
  useNewToken: boolean;
  tokenAddress: string;
  tokenName: string;
  tokenSymbol: string;
  paymentToken: string;
  start: string;
  end: string;
  price: string;
  softCap: string;
  hardCap: string;
  description: string; // ← add this
  image?: FileList;
}

/* ──────────────────────────────────────────────── */
export default function CreateICOPage() {
  const { register, watch, handleSubmit, reset } = useForm<CreateICOForm>({
    defaultValues: {
      useNewToken: true,
      paymentToken: "0x0000000000000000000000000000000000000000",
      description: "",
    },
  });

  const { isConnected } = useAccount();
  const {
    writeContractAsync,
    data: txHash,
    isPending,
    error: writeError,
  } = useWriteContract();

  /* Wait for confirmation */
  useWaitForTransactionReceipt({
    hash: txHash,
    confirmations: 2,
    query: { enabled: !!txHash },
  });

  /* ───────── onSubmit ───────── */
  const onSubmit = async (data: CreateICOForm) => {
    if (!isConnected) {
      toast.warning("Please connect your wallet first");
      return;
    }

    // Upload image and append storageKey to description
    if (data.image && data.image.length > 0) {
      const file = data.image[0];
      try {
        const { storageKey } = await uploadImageToLens(file);
        data.description = `${data.description}+${storageKey}`; // <-- append here
      } catch (e: any) {
        toast.error("Image upload failed: " + (e?.message || "Unknown error"));
        return;
      }
    }

    try {
      /* convert inputs */
      const startUnix = Math.floor(new Date(data.start).getTime() / 1000);
      const endUnix = Math.floor(new Date(data.end).getTime() / 1000);

      const priceWei = parseUnits(data.price, 18); // price is “payment per 1 token”
      const softCapWei = parseUnits(data.softCap, 18);
      const hardCapWei = parseUnits(data.hardCap, 18);

      if (data.useNewToken) {
        await writeContractAsync({
          address: "0x93B418C845C4b654a89a11CfeA9917C2D3F37582",
          abi: factoryAbi,
          functionName: "createSaleWithNewToken",
          args: [
            data.tokenName,
            data.tokenSymbol,
            data.paymentToken as Address,
            startUnix,
            endUnix,
            priceWei,
            softCapWei,
            hardCapWei,
            data.description,
          ],
        });
      } else {
        await writeContractAsync({
          address: "0x93B418C845C4b654a89a11CfeA9917C2D3F37582",
          abi: factoryAbi,
          functionName: "createSale",
          args: [
            data.tokenAddress as Address,
            data.paymentToken as Address,
            startUnix,
            endUnix,
            priceWei,
            softCapWei,
            hardCapWei,
            data.description
          ],
        });
      }
      toast("Transaction submitted, awaiting confirmations…");
    } catch (err: any) {
      console.log(err);
      toast.error(err.shortMessage || err.message);
    }
  };

  /* ───────── UI ───────── */
  const useNewToken = watch("useNewToken");

  return (
    <div className="max-w-lg mx-auto py-12 space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Create an ICO Sale</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Toggle new vs existing token */}
        <div className="flex items-center space-x-3">
          <Checkbox id="useNewToken" {...register("useNewToken")} />
          <Label htmlFor="useNewToken">Deploy a fresh ERC‑20 for me</Label>
        </div>

        {useNewToken ? (
          <>
            <div>
              <Label htmlFor="tokenName">Token name</Label>
              <Input
                id="tokenName"
                placeholder="e.g. Lens Coin"
                {...register("tokenName", { required: true })}
              />
            </div>
            <div>
              <Label htmlFor="tokenSymbol">Token symbol</Label>
              <Input
                id="tokenSymbol"
                placeholder="e.g. LENS"
                {...register("tokenSymbol", { required: true })}
              />
            </div>
          </>
        ) : (
          <div>
            <Label htmlFor="tokenAddress">Existing token address</Label>
            <Input
              id="tokenAddress"
              placeholder="0x…"
              {...register("tokenAddress", { required: true })}
            />
          </div>
        )}

        <div>
          <Label htmlFor="paymentToken">Payment token (0x0… for native)</Label>
          <Input
            id="paymentToken"
            placeholder="0x…"
            {...register("paymentToken", { required: true })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="start">Sale start</Label>
            <Input
              id="start"
              type="datetime-local"
              {...register("start", { required: true })}
            />
          </div>
          <div>
            <Label htmlFor="end">Sale end</Label>
            <Input
              id="end"
              type="datetime-local"
              {...register("end", { required: true })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Price (payment per token)</Label>
            <Input
              id="price"
              placeholder="0.0005"
              {...register("price", { required: true })}
            />
          </div>
          <div>
            <Label htmlFor="softCap">Soft cap</Label>
            <Input
              id="softCap"
              placeholder="10"
              {...register("softCap", { required: true })}
            />
          </div>
          <div>
            <Label htmlFor="hardCap">Hard cap</Label>
            <Input
              id="hardCap"
              placeholder="100"
              {...register("hardCap", { required: true })}
            />
          </div>
          <div>
            <Label htmlFor="description">Project description</Label>
            <Input
              id="description"
              placeholder="A short summary of the project or token utility"
              {...register("description", { required: true })}
            />
          </div>
          <div>
            <Label htmlFor="image">Project image (optional)</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              {...register("image")}
            />
          </div>
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Submitting…" : "Launch crowdsale"}
        </Button>

        {/* {writeError && (
          <p className="text-destructive text-sm">
            {writeError.shortMessage || writeError.message}
          </p>
        )} */}
      </form>
    </div>
  );
}
