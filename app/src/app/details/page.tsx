"use client";

import { useSaleDetails } from "@/hooks/useSalesDetails";
import { formatUnits } from "viem";

export default function DiscoverPage() {
  const { data: sale, isLoading, error } = useSaleDetails("0x6Ef1eEF110E8599857E60CB29A926598D7116B02");

  if (isLoading) return <div className="p-4 border rounded">Loading…</div>;
  if (error || !sale) return <div className="p-4 border rounded">Error loading sale</div>;

  return (
    <div className="p-6 border rounded shadow-sm space-y-2">
      <p className="font-semibold text-sm text-muted-foreground">Crowdsale</p>
      <p className="break-all text-xs">{0x6Ef1eEF110E8599857E60CB29A926598D7116B02}</p>
      <p className="text-sm">
        <strong>Price:</strong> {formatUnits(sale.price, 18)} ETH
      </p>
      <p className="text-sm">
        <strong>Soft Cap:</strong> {formatUnits(sale.softCap, 18)}
      </p>
      <p className="text-sm">
        <strong>Raised:</strong> {formatUnits(sale.totalRaised, 18)}
      </p>
      <p className="text-sm">
        <strong>Finalized:</strong> {sale.finalized ? "✅" : "❌"}
      </p>
    </div>
  );
}
