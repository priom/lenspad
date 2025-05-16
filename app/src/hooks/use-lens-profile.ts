import { useEffect, useState } from "react";
import { fetchLensProfile } from "@/lib/lens/api";

export function useLensProfile(address?: string) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address) return;

    setLoading(true);
    fetchLensProfile(address.toLowerCase()).then((data) => {
      setProfile(data);
      setLoading(false);
    });
  }, [address]);

  return { profile, loading };
}
