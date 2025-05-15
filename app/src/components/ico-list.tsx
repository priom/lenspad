"use client";
import { IcoCard } from "@/components/ico-card";
import { useAllSaleDetails } from "@/hooks/useAllSalesDetails";
import { useSales } from "@/hooks/use-sales";
import { Address } from "viem";


export function ICOList() {
  const { data: sales = [], isLoading, error } = useSales();
    console.log(sales);
    const shouldFetchDetails = !isLoading && sales.length > 0;
    const { data: saleDetails = [], isLoading: loadingDetails } = useAllSaleDetails(
    shouldFetchDetails ? (sales as Address[]) : []);

    console.log(sales);
  
      
  

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 my-16">
      {saleDetails.map((saleDetail) => <IcoCard {...saleDetail} key={saleDetail.sale} />)}
      {/* {saleDetails.map((saleDetail) => (console.log(saleDetail))} */}
    </div>
  );
}