"use client";

import { useSales } from "@/hooks/use-sales";
import { IcoCard } from "@/components/ico-card";
import { useAllSaleDetails } from "@/hooks/useAllSalesDetails";
import { Address } from "viem";

export default function DiscoverPage() {
    const { data: sales = [], isLoading, error } = useSales();
    console.log(sales);
    const shouldFetchDetails = !isLoading && sales.length > 0;
    const { data: saleDetails = [], isLoading: loadingDetails } = useAllSaleDetails(
    shouldFetchDetails ? (sales as Address[]) : []
);
  console.log(saleDetails);

  if (isLoading) return <p className="my-16">Loading on‑chain sales…</p>;
  if (error)     return <p className="text-destructive">{`${error}`}</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 my-16">
      <div>
      {saleDetails.map((sale) => (
        <div key={sale.sale}>
          <p><strong>{sale.name} ({sale.symbol})</strong></p>
          <p>Sale address: {sale.sale}</p>
          <p>Start: {new Date(sale.start * 1000).toLocaleString()}</p>
          <p>Price: {sale.price.toString()}</p>
          <img src={sale.imageURI} alt="Token" width={100} />
        </div>
      ))}
    </div>
    </div>
  );
}
