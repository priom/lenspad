export async function fetchLensProfile(address: string) {
    const res = await fetch("https://api-v2.lens.dev", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query GetLensProfile {
            profiles(request: { ownedBy: ["${address}"], limit: 1 }) {
              items {
                id
                handle {
                  fullHandle
                }
                metadata {
                  displayName
                  bio
                  picture {
                    ... on ImageSet {
                      raw {
                        uri
                      }
                    }
                  }
                }
              }
            }
          }
        `
      }),
    });
  
    const json = await res.json();
    const profile = json?.data?.profiles?.items?.[0];
    return profile || null;
  }
  