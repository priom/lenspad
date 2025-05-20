import { http, createPublicClient, parseAbi } from "viem";
import { zksyncSepoliaTestnet } from "viem/chains";

// 0x93B418C845C4b654a89a11CfeA9917C2D3F37582
// 0xAd1F4f3E03Fc13D577AAD001A2a56Ec27B238518
export const FACTORY = "0x93B418C845C4b654a89a11CfeA9917C2D3F37582";

export const factoryAbi = parseAbi([
  // Example real definitions – replace with actual ones
  "function createSale(address token, uint256 start, uint256 end, uint256 price) returns (address)",
  "function createSaleWithNewToken(string name, string symbol, uint256 supply, uint256 price) returns (address,address)",
  "function salesCount() view returns (uint256)",
  "function allSales(uint256 index) view returns (address)",
]);

export const publicClient = createPublicClient({
  chain: zksyncSepoliaTestnet,
  transport: http("https://rpc.lens.xyz"),
});
