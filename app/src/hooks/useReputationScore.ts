import useSWR from "swr";

const API_URL = "https://lens-bigquery-api-84180858304.us-central1.run.app/api/bigquery/query";
// const API_URL = "http://localhost:8000/api/bigquery/query";

async function fetchReputationScore(address: string): Promise<number | null> {
  console.log("Fetching for address:", address);
  const query = `SELECT creator_address_web3, reputation_score FROM \`priom-sidekick.lens_mainnet_dataset.lens_mainnet_repscore\` WHERE LOWER(creator_address_web3) = '${address.toLowerCase()}' LIMIT 1`;
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) {
    console.log("API error:", res.status);
    return null;
  }
  const data = await res.json();
  console.log("API data:", data);
  if (data.results && data.results.length > 0) {
    const score = data.results[0].reputation_score;
    console.log("Score found:", score);
    return score !== null && score !== undefined ? score : null;
  }
  console.log("No results found for address:", address);
  return null;
}
export function useReputationScore(address: string | undefined) {
  return useSWR(
    address ? ["reputation-score", address] : null,
    () => (address ? fetchReputationScore(address) : null),
    { revalidateOnFocus: false }
  );
}
