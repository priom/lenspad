// /lib/saleAbi.ts
import { parseAbi } from "viem";

export const saleAbi = parseAbi([
  "function start() view returns (uint40)",
  "function end() view returns (uint40)",
  "function price() view returns (uint256)",
  "function softCap() view returns (uint256)",
  "function hardCap() view returns (uint256)",
  "function totalRaised() view returns (uint256)",
  "function finalized() view returns (bool)",
  "function saleToken() view returns (address)",
  "function paymentToken() view returns (address)",
  "function owner() view returns (address)",
  "function description() view returns (string)" 
]);
