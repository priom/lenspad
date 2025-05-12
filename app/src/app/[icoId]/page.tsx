import { dummyICOs } from "@/dummy-data";

export default async function IcoDetails({
  params,
}: {
  params: Promise<{ icoId: string }>;
}) {
  const { icoId } = await params;

  return <h2>{icoId}</h2>;
}
